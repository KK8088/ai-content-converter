/**
 * AI内容格式转换工具 - 主应用模块
 * 
 * @description 应用程序主入口和控制器
 * @version 1.0.0
 * @author zk0x01
 */

/**
 * 主应用类
 */
class AIContentConverter {
    constructor() {
        this.currentContent = '';
        this.currentContentType = 'auto';
        this.currentTemplate = 'professional';
        this.isProcessing = false;

        // 简单的日志系统
        this.logger = {
            info: (msg) => APP_CONFIG.debug && console.log(`[INFO] ${msg}`),
            error: (msg) => console.error(`[ERROR] ${msg}`),
            warn: (msg) => console.warn(`[WARN] ${msg}`),
            debug: (msg) => APP_CONFIG.debug && console.log(`[DEBUG] ${msg}`)
        };

        this.init();
    }

    /**
     * 初始化应用
     */
    init() {
        this.bindEvents();
        this.loadSettings();
        this.initTheme();
        this.showWelcomeMessage();
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 内容输入事件
        const contentTextarea = document.getElementById('ai-content');
        if (contentTextarea) {
            contentTextarea.addEventListener('input', this.debounce((e) => {
                this.handleContentChange(e.target.value);
            }, 300));
        }

        // 快捷操作按钮事件
        this.bindQuickActions();

        // 转换按钮
        const convertBtn = document.getElementById('convert-btn');
        if (convertBtn) {
            convertBtn.addEventListener('click', () => this.handleConvert());
        }

        // 清空按钮
        const clearBtn = document.getElementById('clear-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.handleClear());
        }

        // 预览按钮
        const previewBtn = document.getElementById('preview-btn');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.handlePreview());
        }

        // 预览标签切换
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchPreviewTab(e.target.dataset.tab);
            });
        });

        // 文件上传
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        }

        // 拖拽上传
        const dropZone = document.getElementById('file-drop-zone');
        if (dropZone) {
            dropZone.addEventListener('click', () => fileInput?.click());
            dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
            dropZone.addEventListener('drop', (e) => this.handleDrop(e));
        }

        // 选项变化
        document.getElementById('content-type')?.addEventListener('change', (e) => {
            this.currentContentType = e.target.value;
            this.updatePreview();
        });

        document.getElementById('template-style')?.addEventListener('change', (e) => {
            this.currentTemplate = e.target.value;
        });

        // 示例标签切换
        document.querySelectorAll('.example-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.handleExampleTab(e));
        });

        // 主题切换
        document.querySelectorAll('.theme-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleThemeChange(e));
        });
    }

    /**
     * 处理内容变化
     */
    handleContentChange(content) {
        this.currentContent = content;
        this.updateStats(content);
        this.updatePreview();
        this.saveToStorage();
    }

    /**
     * 处理转换
     */
    async handleConvert() {
        if (!this.currentContent.trim()) {
            this.showMessage('请输入要转换的内容', 'warning');
            return;
        }

        if (this.isProcessing) {
            return;
        }

        try {
            this.isProcessing = true;
            this.showLoading(true);
            
            const outputFormat = document.getElementById('output-format')?.value || 'docx';
            const fileName = document.getElementById('file-name')?.value || 
                           Utils.string.generateFileName(this.currentContent, outputFormat);

            // 检测内容类型
            const contentType = this.currentContentType === 'auto' 
                ? contentDetector.detectContentType(this.currentContent)
                : this.currentContentType;

            // 根据输出格式进行转换
            if (outputFormat === 'docx' || outputFormat === 'both') {
                await this.generateWord(this.currentContent, contentType, fileName);
            }
            
            if (outputFormat === 'xlsx' || outputFormat === 'both') {
                await this.generateExcel(this.currentContent, contentType, fileName);
            }

            this.showMessage('转换完成！文件已开始下载', 'success');
            this.updateUsageStats();
            
        } catch (error) {
            this.logger.error('转换失败: ' + error.message);
            this.showMessage('转换失败：' + error.message, 'error');
        } finally {
            this.isProcessing = false;
            this.showLoading(false);
        }
    }

    /**
     * 生成Word文档 - 增强版
     */
    async generateWord(content, contentType, fileName) {
        try {
            // 预处理内容，支持多源AI内容
            const cleanedContent = this.preprocessAIContent(content);

            // 验证内容完整性
            const originalStats = Utils.string.getTextStats(content);
            const cleanedStats = Utils.string.getTextStats(cleanedContent);

            console.log('📊 内容完整性验证:', {
                original: originalStats,
                cleaned: cleanedStats,
                charLoss: originalStats.chars - cleanedStats.chars
            });

            const { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle, convertInchesToTwip, Packer } = docx;

            const children = [];

            // 添加文档头部信息
            children.push(new Paragraph({
                children: [new TextRun({
                    text: fileName.replace(/\.[^/.]+$/, ""),
                    font: "微软雅黑",
                    size: 32,
                    bold: true,
                    color: "2E5BBA"
                })],
                heading: HeadingLevel.TITLE,
                spacing: { after: 240 },
                alignment: AlignmentType.CENTER
            }));

            children.push(new Paragraph({
                children: [new TextRun({
                    text: `生成时间: ${new Date().toLocaleString('zh-CN')}`,
                    font: "微软雅黑",
                    size: 18,
                    color: "666666"
                })],
                spacing: { after: 360 },
                alignment: AlignmentType.CENTER
            }));

            if (contentType === 'markdown' || this.containsMarkdownElements(cleanedContent)) {
                const elements = markdownParser.parseMarkdown(cleanedContent);
                children.push(...this.convertElementsToWord(elements));
            } else {
                // 智能文本处理
                const processedElements = this.parseTextContent(cleanedContent);
                children.push(...this.convertElementsToWord(processedElements));
            }

            const doc = new Document({
                creator: "AI内容格式转换工具 v1.1.1",
                title: fileName.replace(/\.[^/.]+$/, ""),
                description: "由AI内容格式转换工具生成 - 支持ChatGPT、Claude、DeepSeek等AI内容",
                subject: "AI内容转换文档",
                keywords: ["AI", "转换", "Word", "文档"],
                sections: [{
                    properties: {
                        page: {
                            margin: {
                                top: convertInchesToTwip(1),
                                right: convertInchesToTwip(1),
                                bottom: convertInchesToTwip(1),
                                left: convertInchesToTwip(1)
                            }
                        }
                    },
                    children: children
                }]
            });

            const blob = await Packer.toBlob(doc);

            // 验证生成的文档大小
            console.log('📄 Word文档生成完成:', {
                size: `${(blob.size / 1024).toFixed(2)} KB`,
                elements: children.length
            });

            this.downloadFile(blob, fileName.replace(/\.[^/.]+$/, "") + '.docx');

        } catch (error) {
            console.error('❌ Word文档生成失败:', error);
            throw new Error(`Word文档生成失败: ${error.message}`);
        }
    }

    /**
     * 生成Excel文档
     */
    async generateExcel(content, contentType, fileName) {
        const workbook = XLSX.utils.book_new();
        
        if (contentType === 'markdown') {
            const tables = markdownParser.safeExtractTables(content);
            if (tables.length > 0) {
                tables.forEach((table, index) => {
                    const worksheet = this.createStyledWorksheet(table.data, table.title);
                    const sheetName = (table.title || `Sheet${index + 1}`).substring(0, 31);
                    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
                });
            } else {
                const worksheet = this.createContentWorksheet(content);
                XLSX.utils.book_append_sheet(workbook, worksheet, "内容");
            }
        } else {
            const worksheet = this.createContentWorksheet(content);
            XLSX.utils.book_append_sheet(workbook, worksheet, "内容");
        }
        
        XLSX.writeFile(workbook, fileName.replace(/\.[^/.]+$/, "") + '.xlsx');
    }

    /**
     * 转换元素为Word格式 - 增强版
     */
    convertElementsToWord(elements) {
        const {
            Paragraph,
            TextRun,
            Table,
            TableRow,
            TableCell,
            HeadingLevel,
            AlignmentType,
            WidthType,
            BorderStyle,
            convertInchesToTwip
        } = docx;

        const wordElements = [];

        elements.forEach(element => {
            switch (element.type) {
                case 'heading':
                    wordElements.push(new Paragraph({
                        children: [new TextRun({
                            text: element.text,
                            font: "微软雅黑",
                            size: 32 - (element.level - 1) * 4,
                            bold: true,
                            color: "2E5BBA"
                        })],
                        heading: HeadingLevel[`HEADING_${element.level}`],
                        spacing: { before: 240, after: 120 }
                    }));
                    break;

                case 'paragraph':
                    wordElements.push(new Paragraph({
                        children: this.convertInlineToWord(element.formatted || [{ type: 'text', text: element.text || '' }]),
                        spacing: { after: 120 }
                    }));
                    break;

                case 'table':
                    wordElements.push(this.createWordTable(element));
                    break;

                case 'list':
                    element.items.forEach(item => {
                        wordElements.push(new Paragraph({
                            children: [
                                new TextRun({
                                    text: `• ${item.text}`,
                                    font: "微软雅黑",
                                    size: 22
                                })
                            ],
                            spacing: { after: 60 },
                            indent: { left: convertInchesToTwip(0.25) }
                        }));
                    });
                    break;

                case 'orderedList':
                    element.items.forEach((item, index) => {
                        wordElements.push(new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${index + 1}. ${item.text}`,
                                    font: "微软雅黑",
                                    size: 22
                                })
                            ],
                            spacing: { after: 60 },
                            indent: { left: convertInchesToTwip(0.25) }
                        }));
                    });
                    break;

                case 'codeBlock':
                    wordElements.push(new Paragraph({
                        children: [new TextRun({
                            text: element.content,
                            font: "Consolas",
                            size: 20,
                            color: "333333"
                        })],
                        shading: { fill: "F8F8F8" },
                        spacing: { before: 120, after: 120 },
                        border: {
                            top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                            bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                            left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                            right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" }
                        }
                    }));
                    break;

                case 'blockquote':
                    wordElements.push(new Paragraph({
                        children: [new TextRun({
                            text: element.content,
                            font: "微软雅黑",
                            size: 22,
                            italics: true,
                            color: "666666"
                        })],
                        spacing: { before: 120, after: 120 },
                        indent: { left: convertInchesToTwip(0.5) },
                        shading: { fill: "F9F9F9" }
                    }));
                    break;

                default:
                    // 处理未知类型，作为普通段落
                    if (element.text) {
                        wordElements.push(new Paragraph({
                            children: [new TextRun({
                                text: element.text,
                                font: "微软雅黑",
                                size: 22
                            })],
                            spacing: { after: 120 }
                        }));
                    }
                    break;
            }
        });

        return wordElements;
    }

    /**
     * 创建Word表格
     */
    createWordTable(tableElement) {
        const {
            Table,
            TableRow,
            TableCell,
            Paragraph,
            TextRun,
            WidthType,
            BorderStyle,
            AlignmentType,
            convertInchesToTwip
        } = docx;

        const rows = [];

        // 创建表头
        if (tableElement.headers && tableElement.headers.length > 0) {
            const headerCells = tableElement.headers.map(header =>
                new TableCell({
                    children: [new Paragraph({
                        children: [new TextRun({
                            text: header,
                            font: "微软雅黑",
                            size: 22,
                            bold: true,
                            color: "FFFFFF"
                        })],
                        alignment: AlignmentType.CENTER
                    })],
                    shading: { fill: "4472C4" },
                    margins: {
                        top: convertInchesToTwip(0.08),
                        bottom: convertInchesToTwip(0.08),
                        left: convertInchesToTwip(0.08),
                        right: convertInchesToTwip(0.08)
                    }
                })
            );
            rows.push(new TableRow({ children: headerCells }));
        }

        // 创建数据行
        if (tableElement.rows && tableElement.rows.length > 0) {
            tableElement.rows.forEach((row, rowIndex) => {
                const cells = row.map(cellData => {
                    // 智能数据类型识别和格式化
                    const formattedText = this.formatCellData(cellData);
                    const isNumeric = this.isNumericData(cellData);

                    return new TableCell({
                        children: [new Paragraph({
                            children: [new TextRun({
                                text: formattedText,
                                font: "微软雅黑",
                                size: 20,
                                color: isNumeric ? "0066CC" : "333333"
                            })],
                            alignment: isNumeric ? AlignmentType.RIGHT : AlignmentType.LEFT
                        })],
                        shading: { fill: rowIndex % 2 === 0 ? "F8F9FA" : "FFFFFF" },
                        margins: {
                            top: convertInchesToTwip(0.06),
                            bottom: convertInchesToTwip(0.06),
                            left: convertInchesToTwip(0.08),
                            right: convertInchesToTwip(0.08)
                        }
                    });
                });
                rows.push(new TableRow({ children: cells }));
            });
        }

        return new Table({
            rows: rows,
            width: {
                size: 100,
                type: WidthType.PERCENTAGE
            },
            borders: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
                insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "EEEEEE" },
                insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "EEEEEE" }
            },
            margins: {
                top: convertInchesToTwip(0.1),
                bottom: convertInchesToTwip(0.1)
            }
        });
    }

    /**
     * 格式化单元格数据
     */
    formatCellData(cellData) {
        if (!cellData) return '';

        const text = cellData.toString().trim();

        // 处理货币格式
        if (text.match(/^[¥$€£]\d+([,.]?\d+)*$/)) {
            return text;
        }

        // 处理百分比
        if (text.match(/^[+-]?\d+(\.\d+)?%$/)) {
            return text;
        }

        // 处理数字（添加千分位分隔符）
        if (text.match(/^\d+(\.\d+)?$/)) {
            const num = parseFloat(text);
            return num.toLocaleString();
        }

        return text;
    }

    /**
     * 判断是否为数值数据
     */
    isNumericData(cellData) {
        if (!cellData) return false;

        const text = cellData.toString().trim();

        // 货币、百分比、纯数字都算数值数据
        return text.match(/^[¥$€£+-]?\d+([,.]?\d+)*%?$/) !== null;
    }

    /**
     * 转换行内格式为Word
     */
    convertInlineToWord(formatted) {
        const { TextRun } = docx;

        if (!formatted || !Array.isArray(formatted)) {
            return [new TextRun({ text: '', font: "微软雅黑", size: 22 })];
        }

        return formatted.map(part => {
            const options = {
                text: part.text || '',
                font: "微软雅黑",
                size: 22
            };

            switch (part.type) {
                case 'bold':
                    options.bold = true;
                    break;
                case 'italic':
                    options.italics = true;
                    break;
                case 'code':
                    options.font = "Consolas";
                    options.shading = { fill: "F0F0F0" };
                    options.size = 20;
                    break;
                case 'link':
                    options.color = "0066CC";
                    options.underline = {};
                    break;
                default:
                    // 普通文本
                    break;
            }

            return new TextRun(options);
        });
    }

    /**
     * 创建样式化工作表
     */
    createStyledWorksheet(data, title) {
        const worksheet = XLSX.utils.aoa_to_sheet(data);
        
        // 设置列宽
        const colWidths = [];
        if (data.length > 0) {
            for (let col = 0; col < data[0].length; col++) {
                let maxWidth = 10;
                for (let row = 0; row < data.length; row++) {
                    if (data[row][col]) {
                        const cellLength = String(data[row][col]).length;
                        maxWidth = Math.max(maxWidth, Math.min(cellLength * 1.2, 50));
                    }
                }
                colWidths.push({ width: maxWidth });
            }
        }
        worksheet['!cols'] = colWidths;
        
        return worksheet;
    }

    /**
     * 创建内容工作表
     */
    createContentWorksheet(content) {
        const lines = content.split('\n').filter(line => line.trim());
        const data = [['行号', '内容']];
        
        lines.forEach((line, index) => {
            data.push([index + 1, line.trim()]);
        });
        
        return this.createStyledWorksheet(data, "文本内容");
    }

    /**
     * 预处理AI内容，支持多源格式
     */
    preprocessAIContent(content) {
        if (!content) return '';

        let cleaned = content;

        // 1. 清理HTML标签（来自网页复制）
        cleaned = cleaned.replace(/<[^>]*>/g, '');

        // 2. 清理特殊编码字符
        cleaned = cleaned.replace(/&nbsp;/g, ' ');
        cleaned = cleaned.replace(/&lt;/g, '<');
        cleaned = cleaned.replace(/&gt;/g, '>');
        cleaned = cleaned.replace(/&amp;/g, '&');
        cleaned = cleaned.replace(/&quot;/g, '"');

        // 3. 标准化换行符
        cleaned = cleaned.replace(/\r\n/g, '\n');
        cleaned = cleaned.replace(/\r/g, '\n');

        // 4. 清理多余的空白字符
        cleaned = cleaned.replace(/[ \t]+$/gm, ''); // 行尾空格
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n'); // 多余空行

        // 5. 修复表格格式（处理不同AI工具的表格输出）
        cleaned = this.normalizeTableFormat(cleaned);

        // 6. 修复代码块格式
        cleaned = this.normalizeCodeBlocks(cleaned);

        // 7. 修复列表格式
        cleaned = this.normalizeListFormat(cleaned);

        return cleaned.trim();
    }

    /**
     * 标准化表格格式
     */
    normalizeTableFormat(content) {
        const lines = content.split('\n');
        const normalizedLines = [];

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            // 检测表格行
            if (line.includes('|')) {
                // 确保表格行格式正确
                if (!line.trim().startsWith('|')) {
                    line = '|' + line;
                }
                if (!line.trim().endsWith('|')) {
                    line = line + '|';
                }

                // 清理单元格内容
                const cells = line.split('|');
                const cleanedCells = cells.map(cell => cell.trim());
                line = cleanedCells.join(' | ');
            }

            normalizedLines.push(line);
        }

        return normalizedLines.join('\n');
    }

    /**
     * 标准化代码块格式
     */
    normalizeCodeBlocks(content) {
        // 修复代码块标记
        content = content.replace(/```(\w+)?\n/g, '```$1\n');
        content = content.replace(/```\s*$/gm, '```');

        // 处理行内代码
        content = content.replace(/`([^`\n]+)`/g, '`$1`');

        return content;
    }

    /**
     * 标准化列表格式
     */
    normalizeListFormat(content) {
        const lines = content.split('\n');
        const normalizedLines = [];

        for (let line of lines) {
            // 标准化无序列表
            line = line.replace(/^[\s]*[-*+]\s+/, '- ');

            // 标准化有序列表
            line = line.replace(/^[\s]*(\d+)[\.\)]\s+/, '$1. ');

            normalizedLines.push(line);
        }

        return normalizedLines.join('\n');
    }

    /**
     * 检查是否包含Markdown元素
     */
    containsMarkdownElements(content) {
        const markdownPatterns = [
            /^#{1,6}\s+/m,           // 标题
            /\|.*\|/m,               // 表格
            /```[\s\S]*?```/m,       // 代码块
            /^[-*+]\s+/m,            // 无序列表
            /^\d+\.\s+/m,            // 有序列表
            /^>\s+/m,                // 引用
            /\*\*.*?\*\*/,           // 加粗
            /_.*?_/,                 // 斜体
            /`.*?`/                  // 行内代码
        ];

        return markdownPatterns.some(pattern => pattern.test(content));
    }

    /**
     * 解析纯文本内容为结构化元素
     */
    parseTextContent(content) {
        const lines = content.split('\n');
        const elements = [];
        let currentElement = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (!line) {
                // 空行，结束当前元素
                if (currentElement) {
                    elements.push(currentElement);
                    currentElement = null;
                }
                continue;
            }

            // 检测表格
            if (line.includes('|') && line.split('|').length > 2) {
                if (!currentElement || currentElement.type !== 'table') {
                    if (currentElement) elements.push(currentElement);
                    currentElement = {
                        type: 'table',
                        headers: [],
                        rows: []
                    };
                }

                const cells = line.split('|')
                    .map(cell => cell.trim())
                    .filter(cell => cell.length > 0);

                if (currentElement.headers.length === 0) {
                    currentElement.headers = cells;
                } else if (!this.isSimpleSeparatorLine(line)) {
                    currentElement.rows.push(cells);
                }
            } else {
                // 普通文本
                if (currentElement && currentElement.type === 'table') {
                    elements.push(currentElement);
                    currentElement = null;
                }

                elements.push({
                    type: 'paragraph',
                    text: line,
                    formatted: [{ type: 'text', text: line }]
                });
            }
        }

        // 添加最后一个元素
        if (currentElement) {
            elements.push(currentElement);
        }

        return elements;
    }

    /**
     * 处理文件上传
     */
    async handleFileUpload(event) {
        if (!event || !event.target || !event.target.files) {
            this.logger.error('无效的文件上传事件');
            return;
        }

        const file = event.target.files[0];
        if (!file) return;

        try {
            if (!Utils.file.isFileTypeSupported(file)) {
                this.showMessage('不支持的文件格式，请上传 .md 或 .txt 文件', 'error');
                return;
            }

            if (file.size > APP_CONFIG.limits.maxFileSize) {
                this.showMessage(`文件大小超过限制（最大${Utils.file.formatFileSize(APP_CONFIG.limits.maxFileSize)}）`, 'error');
                return;
            }

            const content = await Utils.file.readFileContent(file);
            const textarea = document.getElementById('ai-content');
            if (textarea) {
                textarea.value = content;
                this.handleContentChange(content);
                this.showMessage('文件上传成功', 'success');
            } else {
                throw new Error('找不到文本输入区域');
            }

        } catch (error) {
            this.logger.error('文件上传错误: ' + error.message);
            this.showMessage('文件读取失败：' + error.message, 'error');
        } finally {
            // 清空文件输入，允许重复上传同一文件
            if (event.target) {
                event.target.value = '';
            }
        }
    }

    /**
     * 更新统计信息 - 增强版
     */
    updateStats(content) {
        const stats = Utils.string.getTextStats(content);

        // 更新统计数值
        this.updateStatValue('char-count', stats.chars);
        this.updateStatValue('word-count', stats.words);
        this.updateStatValue('table-count', stats.tables);
        this.updateStatValue('code-count', stats.codeBlocks);

        // 添加动画效果
        this.animateStats();
    }

    /**
     * 更新单个统计值
     */
    updateStatValue(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            const valueElement = element.querySelector('.stat-value');
            if (valueElement) {
                const oldValue = parseInt(valueElement.textContent) || 0;
                if (oldValue !== value) {
                    valueElement.style.transform = 'scale(1.2)';
                    valueElement.style.color = 'var(--success-color)';

                    setTimeout(() => {
                        valueElement.textContent = value.toLocaleString();
                        valueElement.style.transform = 'scale(1)';
                        valueElement.style.color = 'var(--primary-color)';
                    }, 150);
                }
            }
        }
    }

    /**
     * 统计动画效果
     */
    animateStats() {
        const statsGroup = document.querySelector('.stats-group');
        if (statsGroup) {
            statsGroup.style.transform = 'translateY(-2px)';
            setTimeout(() => {
                statsGroup.style.transform = 'translateY(0)';
            }, 200);
        }
    }

    /**
     * 绑定快捷操作事件
     */
    bindQuickActions() {
        // 清空内容
        const clearBtn = document.getElementById('clear-content');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearContent());
        }

        // 格式化内容
        const formatBtn = document.getElementById('format-content');
        if (formatBtn) {
            formatBtn.addEventListener('click', () => this.formatContent());
        }

        // 保存草稿
        const saveBtn = document.getElementById('save-draft');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveDraft());
        }
    }

    /**
     * 清空内容
     */
    clearContent() {
        if (this.currentContent.trim() && !confirm('确定要清空所有内容吗？')) {
            return;
        }

        const textarea = document.getElementById('ai-content');
        if (textarea) {
            textarea.value = '';
            this.handleContentChange('');
            this.showMessage('内容已清空', 'success');

            // 添加清空动画
            textarea.style.transform = 'scale(0.98)';
            setTimeout(() => {
                textarea.style.transform = 'scale(1)';
            }, 150);
        }
    }

    /**
     * 格式化内容
     */
    formatContent() {
        if (!this.currentContent.trim()) {
            this.showMessage('没有内容需要格式化', 'warning');
            return;
        }

        try {
            // 基础格式化逻辑
            let formatted = this.currentContent
                .replace(/\n{3,}/g, '\n\n') // 移除多余空行
                .replace(/[ \t]+$/gm, '') // 移除行尾空格
                .replace(/^[ \t]+/gm, '') // 移除行首空格（保留代码块）
                .trim();

            const textarea = document.getElementById('ai-content');
            if (textarea) {
                textarea.value = formatted;
                this.handleContentChange(formatted);
                this.showMessage('内容格式化完成', 'success');

                // 添加格式化动画
                textarea.style.background = 'rgba(16, 185, 129, 0.1)';
                setTimeout(() => {
                    textarea.style.background = '';
                }, 1000);
            }
        } catch (error) {
            this.showMessage('格式化失败：' + error.message, 'error');
        }
    }

    /**
     * 保存草稿
     */
    saveDraft() {
        if (!this.currentContent.trim()) {
            this.showMessage('没有内容需要保存', 'warning');
            return;
        }

        try {
            const draft = {
                content: this.currentContent,
                timestamp: new Date().toISOString(),
                stats: Utils.string.getTextStats(this.currentContent)
            };

            localStorage.setItem(STORAGE_KEYS.LAST_CONTENT, JSON.stringify(draft));
            this.showMessage('草稿已保存', 'success');

            // 添加保存动画
            const saveBtn = document.getElementById('save-draft');
            if (saveBtn) {
                saveBtn.style.background = 'var(--success-color)';
                saveBtn.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    saveBtn.style.background = '';
                    saveBtn.style.transform = '';
                }, 500);
            }
        } catch (error) {
            this.showMessage('保存失败：' + error.message, 'error');
        }
    }

    /**
     * 显示消息
     */
    showMessage(message, type = 'info') {
        // 使用日志系统记录消息
        this.logger.info(`${type.toUpperCase()}: ${message}`);

        // 可以在这里添加更复杂的消息显示逻辑
        if (type === 'error') {
            alert('错误: ' + message);
        } else if (type === 'success') {
            alert('成功: ' + message);
        }
    }

    /**
     * 显示/隐藏加载状态
     */
    showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.display = show ? 'block' : 'none';
        }
    }

    /**
     * 下载文件
     */
    downloadFile(blob, fileName) {
        if (!blob || !fileName) {
            this.logger.error('下载文件参数无效');
            return;
        }

        try {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.style.display = 'none'; // 隐藏元素
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            this.logger.error('文件下载失败: ' + error.message);
            this.showMessage('文件下载失败', 'error');
        }
    }

    /**
     * 防抖函数
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * 加载设置
     */
    loadSettings() {
        const settings = Utils.storage.get(STORAGE_KEYS.USER_SETTINGS, {});
        // 应用设置...
    }

    /**
     * 保存到存储
     */
    saveToStorage() {
        Utils.storage.set(STORAGE_KEYS.LAST_CONTENT, this.currentContent);
    }

    /**
     * 初始化主题
     */
    initTheme() {
        const savedTheme = Utils.storage.get(STORAGE_KEYS.THEME_PREFERENCE, 'light');
        document.documentElement.setAttribute('data-theme', savedTheme);
    }

    /**
     * 显示欢迎消息
     */
    showWelcomeMessage() {
        if (APP_CONFIG.debug) {
            console.log(`%c🚀 AI内容格式转换工具 v${APP_CONFIG.version} 已启动`, 'color: #6366f1; font-size: 16px; font-weight: bold;');
            console.log('GitHub: ' + APP_CONFIG.github.url);
        }
    }

    // 其他方法的简化实现...
    handleClear() { document.getElementById('ai-content').value = ''; this.handleContentChange(''); }
    /**
     * 处理预览功能
     */
    handlePreview() {
        const content = document.getElementById('ai-content').value.trim();
        if (!content) {
            this.showMessage('请先输入内容', 'warning');
            return;
        }

        this.logger.info('显示预览...');
        this.showPreviewSection(content);
    }

    /**
     * 显示预览区域
     */
    showPreviewSection(content) {
        const previewSection = document.getElementById('preview-section');
        if (previewSection) {
            previewSection.style.display = 'block';
            this.generatePreview(content);

            // 滚动到预览区域
            previewSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * 生成预览内容
     */
    generatePreview(content) {
        console.log('🔍 开始生成预览:', content.length, '字符');

        try {
            const detector = new ContentDetector();
            const contentType = detector.detectContentType(content);
            console.log('📊 检测到内容类型:', contentType);

            const previewContent = document.getElementById('preview-content');
            console.log('📋 预览容器:', previewContent ? '存在' : '不存在');

            if (!previewContent) {
                console.error('❌ 预览容器不存在!');
                this.showMessage('预览容器初始化失败', 'error');
                return;
            }

            // 生成结构预览
            this.generateStructurePreview(content, contentType);
            console.log('✅ 结构预览生成完成');

            // 设置默认标签为激活状态
            this.switchPreviewTab('structure');
            console.log('✅ 预览标签切换完成');

        } catch (error) {
            console.error('❌ 预览生成失败:', error);
            this.showMessage('预览生成失败: ' + error.message, 'error');

            // 显示错误信息给用户
            const previewContent = document.getElementById('preview-content');
            if (previewContent) {
                previewContent.innerHTML = `
                    <div class="error-message" style="padding: 2rem; text-align: center; color: #dc2626; background: #fef2f2; border-radius: 8px; border: 1px solid #fecaca;">
                        <h4 style="margin: 0 0 1rem 0;">⚠️ 预览生成失败</h4>
                        <p style="margin: 0 0 0.5rem 0;"><strong>错误信息:</strong> ${error.message}</p>
                        <p style="margin: 0; font-size: 0.9rem; color: #991b1b;">请检查输入内容格式是否正确，或刷新页面重试</p>
                    </div>
                `;
            }
        }
    }

    /**
     * 生成结构预览 - 简化版本
     */
    generateStructurePreview(content, contentType) {
        console.log('🏗️ 开始生成结构预览, 内容类型:', contentType);

        try {
            let previewHtml = '<div class="preview-structure">';

            // 基本信息显示
            previewHtml += `<div class="detection-info">
                <h4>🤖 智能检测结果</h4>
                <p><strong>内容类型:</strong> ${this.getContentTypeLabel(contentType)}</p>
                <p><strong>字符数:</strong> ${content.length}</p>
                <p><strong>生成时间:</strong> ${new Date().toLocaleTimeString()}</p>
            </div>`;

            // 简化的表格处理
            if (contentType === 'table') {
                console.log('📊 处理表格内容');
                previewHtml += '<div class="table-preview">';
                previewHtml += '<h4>📊 表格预览</h4>';

                // 简单的表格解析
                const tables = this.parseSimpleTable(content);
                console.log('📊 解析到表格数量:', tables.length);

                if (tables.length > 0) {
                    tables.forEach((table, index) => {
                        console.log(`📊 处理表格 ${index + 1}, 列数:`, table.headers.length, '行数:', table.rows.length);

                        previewHtml += `<div class="table-item">
                            <h5>表格 ${index + 1} (${table.headers.length}列 × ${table.rows.length}行)</h5>
                            <table class="preview-table">
                                <thead><tr>`;

                        table.headers.forEach(header => {
                            previewHtml += `<th>${this.escapeHtml(header)}</th>`;
                        });

                        previewHtml += '</tr></thead><tbody>';

                        table.rows.forEach(row => {
                            previewHtml += '<tr>';
                            row.forEach(cell => {
                                previewHtml += `<td>${this.escapeHtml(cell)}</td>`;
                            });
                            previewHtml += '</tr>';
                        });

                        previewHtml += '</tbody></table></div>';
                    });
                } else {
                    previewHtml += '<p class="no-tables">未检测到有效的表格数据</p>';
                }

                previewHtml += '</div>';
            } else {
                console.log('📄 处理非表格内容');
                previewHtml += `<div class="content-preview">
                    <h4>📄 内容预览</h4>
                    <div class="preview-text">${this.formatPreviewText(content)}</div>
                </div>`;
            }

            previewHtml += '</div>';

            const previewContainer = document.getElementById('preview-content');
            if (previewContainer) {
                previewContainer.innerHTML = previewHtml;
                console.log('✅ 结构预览HTML已插入到容器');
            } else {
                throw new Error('预览容器不存在');
            }

        } catch (error) {
            console.error('❌ 结构预览生成失败:', error);
            throw error; // 重新抛出错误，让上层处理
        }
    }

    /**
     * 切换预览标签
     */
    switchPreviewTab(tabName) {
        // 更新标签状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // 显示对应内容
        const content = document.getElementById('ai-content').value.trim();
        if (!content) return;

        const detector = new ContentDetector();

        switch (tabName) {
            case 'structure':
                this.generateStructurePreview(content, detector.detectContentType(content));
                break;
            case 'word':
                this.generateWordPreview(content);
                break;
            case 'excel':
                this.generateExcelPreview(content);
                break;
        }
    }

    /**
     * 生成Word预览
     */
    generateWordPreview(content) {
        const previewContent = document.getElementById('preview-content');
        previewContent.innerHTML = `
            <div class="word-preview">
                <h4>📄 Word文档预览</h4>
                <div class="document-preview">
                    <div class="doc-header">
                        <h3>AI转换文档</h3>
                        <p class="doc-meta">生成时间: ${new Date().toLocaleString()}</p>
                    </div>
                    <div class="doc-content">
                        ${this.formatPreviewText(content)}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 生成Excel预览 - 简化版本
     */
    generateExcelPreview(content) {
        console.log('📊 开始生成Excel预览');

        try {
            const tables = this.parseSimpleTable(content);

            let previewHtml = '<div class="excel-preview">';
            previewHtml += '<h4>📊 Excel工作表预览</h4>';

            if (tables.length > 0) {
                tables.forEach((table, index) => {
                    previewHtml += `
                        <div class="worksheet-preview">
                            <div class="sheet-tab">工作表${index + 1}</div>
                            <div class="excel-table">
                                <table class="excel-grid">
                                    <thead><tr>`;

                    table.headers.forEach((header, colIndex) => {
                        previewHtml += `<th class="excel-header">${String.fromCharCode(65 + colIndex)}</th>`;
                    });

                    previewHtml += '</tr><tr>';

                    table.headers.forEach(header => {
                        previewHtml += `<td class="excel-cell header-cell">${this.escapeHtml(header)}</td>`;
                    });

                    previewHtml += '</tr></thead><tbody>';

                    table.rows.forEach((row, rowIndex) => {
                        previewHtml += '<tr>';
                        row.forEach(cell => {
                            previewHtml += `<td class="excel-cell">${this.escapeHtml(cell)}</td>`;
                        });
                        previewHtml += '</tr>';
                    });

                    previewHtml += '</tbody></table></div></div>';
                });
            } else {
                previewHtml += '<p class="no-tables">未检测到表格数据</p>';
            }

            previewHtml += '</div>';

            const previewContainer = document.getElementById('preview-content');
            if (previewContainer) {
                previewContainer.innerHTML = previewHtml;
                console.log('✅ Excel预览生成成功');
            }

        } catch (error) {
            console.error('❌ Excel预览生成失败:', error);
            const previewContainer = document.getElementById('preview-content');
            if (previewContainer) {
                previewContainer.innerHTML = `
                    <div class="error-message" style="padding: 2rem; text-align: center; color: #dc2626;">
                        <h4>Excel预览生成失败</h4>
                        <p>错误: ${error.message}</p>
                    </div>
                `;
            }
        }
    }

    /**
     * 格式化预览文本
     */
    formatPreviewText(content) {
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/^# (.*$)/gm, '<h1>$1</h1>')
            .replace(/^## (.*$)/gm, '<h2>$1</h2>')
            .replace(/^### (.*$)/gm, '<h3>$1</h3>')
            .replace(/\n/g, '<br>');
    }

    /**
     * 获取内容类型标签
     */
    getContentTypeLabel(type) {
        const labels = {
            'table': '📊 表格数据',
            'list': '📋 列表项目',
            'article': '📄 文章内容',
            'markdown': '📝 Markdown格式',
            'code': '💻 代码块'
        };
        return labels[type] || '📄 文本内容';
    }

    /**
     * HTML转义函数，防止XSS攻击
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 简化的表格解析方法
     */
    parseSimpleTable(content) {
        const lines = content.split('\n').filter(line => line.trim());
        const tables = [];
        let currentTable = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // 检测表格行
            if (line.includes('|') && line.split('|').length > 2) {
                const cells = line.split('|')
                    .map(cell => cell.trim())
                    .filter(cell => cell.length > 0);

                if (!currentTable) {
                    // 开始新表格
                    currentTable = {
                        headers: cells,
                        rows: []
                    };
                } else if (this.isSimpleSeparatorLine(line)) {
                    // 跳过分隔行
                    continue;
                } else {
                    // 添加数据行
                    currentTable.rows.push(cells);
                }
            } else if (currentTable) {
                // 表格结束
                tables.push(currentTable);
                currentTable = null;
            }
        }

        // 处理最后一个表格
        if (currentTable) {
            tables.push(currentTable);
        }

        return tables;
    }

    /**
     * 检查是否为简单分隔行
     */
    isSimpleSeparatorLine(line) {
        return line.includes('---') || line.includes('===') ||
               (line.includes('|') && line.includes('-'));
    }
    updatePreview() { /* 预览更新逻辑 */ }
    handleDragOver(e) { e.preventDefault(); }
    handleDrop(e) { e.preventDefault(); /* 拖拽处理逻辑 */ }
    handleExampleTab(e) { /* 示例切换逻辑 */ }
    handleThemeChange(e) { /* 主题切换逻辑 */ }
    updateUsageStats() { /* 使用统计更新 */ }
}

// 应用启动
document.addEventListener('DOMContentLoaded', () => {
    window.app = new AIContentConverter();
});

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIContentConverter;
}

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
     * 生成Word文档
     */
    async generateWord(content, contentType, fileName) {
        // 这里将集成原有的Word生成逻辑
        const { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, WidthType, BorderStyle, convertInchesToTwip, Packer } = docx;
        
        const children = [];
        
        if (contentType === 'markdown') {
            const elements = markdownParser.parseMarkdown(content);
            children.push(...this.convertElementsToWord(elements));
        } else {
            // 简单文本处理
            const lines = content.split('\n').filter(line => line.trim());
            lines.forEach(line => {
                children.push(new Paragraph({
                    children: [new TextRun({
                        text: line,
                        font: "微软雅黑",
                        size: 22
                    })],
                    spacing: { after: 120 }
                }));
            });
        }

        const doc = new Document({
            creator: "AI内容格式转换工具",
            title: fileName.replace(/\.[^/.]+$/, ""),
            description: "由AI内容格式转换工具生成",
            sections: [{
                properties: {},
                children: children
            }]
        });

        const blob = await Packer.toBlob(doc);
        this.downloadFile(blob, fileName.replace(/\.[^/.]+$/, "") + '.docx');
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
     * 转换元素为Word格式
     */
    convertElementsToWord(elements) {
        const { Paragraph, TextRun, HeadingLevel, AlignmentType } = docx;
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
                        children: this.convertInlineToWord(element.formatted),
                        spacing: { after: 120 }
                    }));
                    break;

                case 'codeBlock':
                    wordElements.push(new Paragraph({
                        children: [new TextRun({
                            text: element.content,
                            font: "Consolas",
                            size: 20
                        })],
                        shading: { fill: "F8F8F8" },
                        spacing: { before: 120, after: 120 }
                    }));
                    break;

                // 其他元素类型...
            }
        });

        return wordElements;
    }

    /**
     * 转换行内格式为Word
     */
    convertInlineToWord(formatted) {
        const { TextRun } = docx;
        return formatted.map(part => {
            const options = {
                text: part.text,
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
     * 更新统计信息
     */
    updateStats(content) {
        const stats = Utils.string.getTextStats(content);
        
        document.getElementById('char-count').textContent = `字符数: ${stats.chars}`;
        document.getElementById('word-count').textContent = `单词数: ${stats.words}`;
        document.getElementById('table-count').textContent = `表格数: ${stats.tables}`;
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

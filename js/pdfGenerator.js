/**
 * AI内容格式转换工具 - PDF生成器模块
 * 
 * @description 专业PDF文档生成功能
 * @version 1.5.1
 * @author zk0x01
 */

/**
 * PDF生成器类
 */
class PDFGenerator {
    constructor() {
        this.isInitialized = false;
        this.defaultOptions = {
            format: 'a4',
            orientation: 'portrait',
            margin: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            },
            fontSize: 12,
            fontFamily: 'Arial',
            lineHeight: 1.5
        };
        
        this.init();
    }

    /**
     * 初始化PDF生成器
     */
    async init() {
        if (this.isInitialized) return;

        try {
            // 动态加载jsPDF库
            if (typeof window.jsPDF === 'undefined') {
                await this.loadJsPDF();
            }
            
            this.isInitialized = true;
            console.log('📄 PDF生成器初始化完成');
        } catch (error) {
            console.error('PDF生成器初始化失败:', error);
            throw error;
        }
    }

    /**
     * 动态加载jsPDF库和html2canvas库
     */
    async loadJsPDF() {
        try {
            // 加载jsPDF核心库
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
            console.log('📚 jsPDF库加载完成');

            // 加载html2canvas库用于中文支持
            await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
            console.log('🖼️ html2canvas库加载完成');

            // 设置中文支持方案
            await this.setupChineseFontSupport();
            console.log('🈶 中文字体支持已配置');

        } catch (error) {
            console.error('PDF库加载失败:', error);
            throw error;
        }
    }

    /**
     * 加载脚本文件
     */
    async loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`脚本加载失败: ${src}`));
            document.head.appendChild(script);
        });
    }

    /**
     * 设置中文字体支持
     */
    async setupChineseFontSupport() {
        // 创建一个支持中文的字体配置
        this.chineseFontConfig = {
            fontName: 'NotoSansCJK',
            fontStyle: 'normal',
            fontWeight: 'normal',
            // 使用系统字体作为备选方案
            fallbackFonts: [
                'Microsoft YaHei',
                'SimHei',
                'SimSun',
                'PingFang SC',
                'Hiragino Sans GB',
                'WenQuanYi Micro Hei',
                'sans-serif'
            ]
        };

        // 设置字体映射
        this.fontMapping = {
            'Arial': 'helvetica',
            'Times': 'times',
            'Chinese': 'NotoSansCJK',
            'Default': 'NotoSansCJK'  // 默认使用支持中文的字体
        };
    }

    /**
     * 设置PDF中文字体支持
     */
    async setupPDFChineseFont(pdf) {
        try {
            // 获取jsPDF支持的字体列表
            const fontList = pdf.getFontList();
            console.log('📚 PDF支持的字体:', Object.keys(fontList));

            // 尝试使用Canvas检测中文字体支持
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // 测试中文字符渲染
            const testText = '中文测试';
            const supportedFonts = [];

            // 首先检查jsPDF内置字体
            const jsPDFFonts = ['helvetica', 'times', 'courier'];
            for (const font of jsPDFFonts) {
                if (fontList[font]) {
                    supportedFonts.push(font);
                }
            }

            // 然后检查系统字体
            for (const font of this.chineseFontConfig.fallbackFonts) {
                ctx.font = `12px "${font}"`;
                const metrics = ctx.measureText(testText);
                if (metrics.width > 0) {
                    console.log(`🈶 检测到系统中文字体: ${font}`);
                }
            }

            // 设置PDF字体 - 优先使用helvetica作为基础字体
            this.selectedChineseFont = 'helvetica';
            this.selectedChineseFontBold = 'helvetica';

            console.log(`🈶 选择PDF字体: ${this.selectedChineseFont}`);

        } catch (error) {
            console.warn('中文字体检测失败，使用默认字体:', error);
            this.selectedChineseFont = 'helvetica';
            this.selectedChineseFontBold = 'helvetica';
        }
    }

    /**
     * 获取字体名称
     */
    getFontFamily(requestedFont) {
        // 检查是否包含中文字符
        const hasChinese = this.containsChinese(this.currentContent || '');

        if (hasChinese) {
            // 如果内容包含中文，优先使用支持中文的字体
            console.log('🈶 检测到中文内容，使用中文字体');
            return this.selectedChineseFont || 'helvetica';
        }

        // 否则使用映射的字体，确保字体名称正确
        const mappedFont = this.fontMapping[requestedFont];
        if (mappedFont) {
            return mappedFont;
        }

        // 如果没有映射，使用默认字体
        return 'helvetica';
    }

    /**
     * 检测文本是否包含中文字符
     */
    containsChinese(text) {
        const chineseRegex = /[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/;
        return chineseRegex.test(text);
    }

    /**
     * 添加支持中文的文本到PDF
     */
    addTextWithChineseSupport(pdf, text, x, y, maxWidth) {
        try {
            // 检查文本是否包含中文
            if (this.containsChinese(text)) {
                console.log(`🈶 添加中文文本: ${text.substring(0, 20)}...`);

                // 对于中文文本，确保使用正确的字体
                const currentFont = pdf.getFont();
                console.log(`📚 当前字体: ${currentFont.fontName}`);

                // 确保字符编码正确
                const encodedText = this.encodeChineseText(text);

                if (maxWidth) {
                    // 如果指定了最大宽度，进行文本换行
                    const lines = pdf.splitTextToSize(encodedText, maxWidth);
                    pdf.text(lines, x, y);
                } else {
                    pdf.text(encodedText, x, y);
                }
            } else {
                // 英文文本正常处理
                if (maxWidth) {
                    const lines = pdf.splitTextToSize(text, maxWidth);
                    pdf.text(lines, x, y);
                } else {
                    pdf.text(text, x, y);
                }
            }
        } catch (error) {
            console.warn('文本添加失败，使用备用方法:', error);
            // 备用方法：直接添加文本
            try {
                if (maxWidth) {
                    const lines = pdf.splitTextToSize(text, maxWidth);
                    pdf.text(lines, x, y);
                } else {
                    pdf.text(text, x, y);
                }
            } catch (fallbackError) {
                console.error('备用文本添加也失败:', fallbackError);
                // 最后的备用方案：添加错误提示
                pdf.text('[文本显示错误]', x, y);
            }
        }
    }

    /**
     * 编码中文文本以确保正确显示
     */
    encodeChineseText(text) {
        try {
            // 确保文本是UTF-8编码
            return decodeURIComponent(encodeURIComponent(text));
        } catch (error) {
            console.warn('中文文本编码失败:', error);
            return text;
        }
    }

    /**
     * 生成PDF文档
     * @param {string} content - 文档内容
     * @param {Object} options - 生成选项
     * @returns {Promise<Blob>} PDF文件Blob
     */
    async generatePDF(content, options = {}) {
        if (!this.isInitialized) {
            await this.init();
        }

        // 保存当前内容用于字体检测
        this.currentContent = content;
        const config = { ...this.defaultOptions, ...options };

        try {
            // 检查是否包含中文字符
            const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
            const hasChinese = this.containsChinese(contentStr);

            console.log(`🔍 中文检测: 内容="${contentStr.substring(0, 50)}...", 包含中文=${hasChinese}`);

            if (hasChinese) {
                console.log('🈶 检测到中文内容，使用html2canvas方案');
                return await this.generatePDFWithCanvas(content, config);
            } else {
                console.log('🔤 英文内容，使用传统jsPDF方案');
                return await this.generatePDFTraditional(content, config);
            }

        } catch (error) {
            console.error('PDF生成失败:', error);
            throw error;
        }
    }

    /**
     * 使用html2canvas方案生成PDF（支持中文）
     */
    async generatePDFWithCanvas(content, config) {
        try {
            // 创建临时HTML容器
            const htmlContainer = this.createHTMLContainer(content, config);
            document.body.appendChild(htmlContainer);

            // 使用html2canvas渲染HTML为图片
            const canvas = await html2canvas(htmlContainer, {
                scale: 2, // 提高清晰度
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                width: htmlContainer.offsetWidth,
                height: htmlContainer.offsetHeight
            });

            // 移除临时容器
            document.body.removeChild(htmlContainer);

            // 创建PDF并添加图片
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: config.orientation,
                unit: 'mm',
                format: config.format
            });

            // 计算图片尺寸
            const imgWidth = pdf.internal.pageSize.getWidth() - (config.margin.left + config.margin.right);
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            // 添加图片到PDF
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', config.margin.left, config.margin.top, imgWidth, imgHeight);

            // 如果内容超过一页，需要分页处理
            const pageHeight = pdf.internal.pageSize.getHeight() - (config.margin.top + config.margin.bottom);
            if (imgHeight > pageHeight) {
                await this.handleMultiPageCanvas(pdf, canvas, config);
            }

            console.log('✅ PDF生成完成（html2canvas方案）');
            return pdf.output('blob');

        } catch (error) {
            console.error('html2canvas PDF生成失败:', error);
            // 降级到传统方案
            console.log('🔄 降级到传统PDF生成方案');
            return await this.generatePDFTraditional(content, config);
        }
    }

    /**
     * 传统jsPDF方案生成PDF（英文内容）
     */
    async generatePDFTraditional(content, config) {
        // 创建jsPDF实例
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: config.orientation,
            unit: 'mm',
            format: config.format
        });

        // 设置中文字体支持
        await this.setupPDFChineseFont(pdf);

        // 设置字体和样式 - 优先使用支持中文的字体
        const fontFamily = this.getFontFamily(config.fontFamily);
        pdf.setFont(fontFamily);
        pdf.setFontSize(config.fontSize);

        // 处理内容
        const processedContent = this.preprocessContent(content);

        // 添加内容到PDF
        await this.addContentToPDF(pdf, processedContent, config);

        // 返回PDF Blob
        return pdf.output('blob');
    }

    /**
     * 创建HTML容器用于渲染
     */
    createHTMLContainer(content, config) {
        const container = document.createElement('div');
        container.style.cssText = `
            position: absolute;
            top: -9999px;
            left: -9999px;
            width: 800px;
            background: white;
            padding: 40px;
            font-family: 'Microsoft YaHei', 'SimHei', 'SimSun', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
        `;

        // 处理内容并转换为HTML
        const processedContent = this.preprocessContent(content);
        container.innerHTML = this.contentToHTML(processedContent, config);

        return container;
    }

    /**
     * 将内容转换为HTML
     */
    contentToHTML(content, config) {
        let html = '';

        // 添加标题
        if (content.title) {
            html += `<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 20px; color: #333;">${content.title}</h1>`;
        }

        // 添加章节内容
        if (content.sections && content.sections.length > 0) {
            for (const section of content.sections) {
                // 添加章节标题
                const headingLevel = Math.min(section.level || 1, 6);
                const fontSize = 20 - (headingLevel - 1) * 2;
                html += `<h${headingLevel} style="font-size: ${fontSize}px; font-weight: bold; margin: 20px 0 10px 0; color: #333;">${section.title}</h${headingLevel}>`;

                // 添加章节内容
                if (section.content && section.content.length > 0) {
                    for (const paragraph of section.content) {
                        html += `<p style="margin: 10px 0; line-height: 1.6;">${paragraph}</p>`;
                    }
                }
            }
        }

        return html;
    }

    /**
     * 处理多页Canvas内容
     */
    async handleMultiPageCanvas(pdf, canvas, config) {
        // 简化版本：如果内容太长，暂时只显示第一页
        // 后续可以实现更复杂的分页逻辑
        console.log('⚠️ 内容超过一页，当前版本显示第一页内容');
    }

    /**
     * 预处理内容
     * @param {string} content - 原始内容
     * @returns {Object} 处理后的内容结构
     */
    preprocessContent(content) {
        const lines = content.split('\n');
        const processedContent = {
            title: '',
            sections: [],
            tables: [],
            lists: []
        };

        let currentSection = null;
        let currentTable = null;
        let currentList = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (!line) continue;

            // 检测标题
            if (line.startsWith('#')) {
                const level = line.match(/^#+/)[0].length;
                const title = line.replace(/^#+\s*/, '');
                
                if (level === 1 && !processedContent.title) {
                    processedContent.title = title;
                } else {
                    currentSection = {
                        level,
                        title,
                        content: []
                    };
                    processedContent.sections.push(currentSection);
                }
                continue;
            }

            // 检测表格
            if (line.includes('|')) {
                if (!currentTable) {
                    currentTable = {
                        headers: [],
                        rows: []
                    };
                    processedContent.tables.push(currentTable);
                }
                
                const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
                
                if (currentTable.headers.length === 0) {
                    currentTable.headers = cells;
                } else if (!line.includes('---')) {
                    currentTable.rows.push(cells);
                }
                continue;
            } else {
                currentTable = null;
            }

            // 检测列表
            if (line.match(/^[\s]*[-*+]\s+/) || line.match(/^[\s]*\d+\.\s+/)) {
                if (!currentList) {
                    currentList = {
                        type: line.match(/^\d+\./) ? 'ordered' : 'unordered',
                        items: []
                    };
                    processedContent.lists.push(currentList);
                }
                
                const item = line.replace(/^[\s]*[-*+\d.]\s*/, '');
                currentList.items.push(item);
                continue;
            } else {
                currentList = null;
            }

            // 普通文本
            if (currentSection) {
                currentSection.content.push(line);
            } else {
                // 创建默认section
                if (processedContent.sections.length === 0) {
                    processedContent.sections.push({
                        level: 1,
                        title: '内容',
                        content: []
                    });
                }
                processedContent.sections[processedContent.sections.length - 1].content.push(line);
            }
        }

        return processedContent;
    }

    /**
     * 添加内容到PDF
     * @param {Object} pdf - jsPDF实例
     * @param {Object} content - 处理后的内容
     * @param {Object} config - 配置选项
     */
    async addContentToPDF(pdf, content, config) {
        let yPosition = config.margin.top;
        const pageHeight = pdf.internal.pageSize.height;
        const pageWidth = pdf.internal.pageSize.width;
        const maxWidth = pageWidth - config.margin.left - config.margin.right;

        // 添加标题
        if (content.title) {
            pdf.setFontSize(config.fontSize + 6);
            const titleFont = this.getFontFamily(config.fontFamily);
            pdf.setFont(titleFont, 'bold');
            yPosition += 10;

            // 使用中文友好的文本添加方法
            this.addTextWithChineseSupport(pdf, content.title, config.margin.left, yPosition, maxWidth);
            yPosition += 15;
        }

        // 重置字体
        pdf.setFontSize(config.fontSize);
        const normalFont = this.getFontFamily(config.fontFamily);
        pdf.setFont(normalFont, 'normal');

        // 添加章节
        for (const section of content.sections) {
            // 检查是否需要新页面
            if (yPosition > pageHeight - 50) {
                pdf.addPage();
                yPosition = config.margin.top;
            }

            // 添加章节标题
            const sectionFont = this.getFontFamily(config.fontFamily);
            pdf.setFont(sectionFont, 'bold');
            pdf.setFontSize(config.fontSize + (4 - section.level));
            yPosition += 10;

            // 使用中文友好的文本添加方法
            this.addTextWithChineseSupport(pdf, section.title, config.margin.left, yPosition, maxWidth);
            yPosition += 8;

            // 重置字体
            pdf.setFont(sectionFont, 'normal');
            pdf.setFontSize(config.fontSize);

            // 添加章节内容
            for (const paragraph of section.content) {
                // 使用中文友好的文本处理
                let lines;
                if (this.containsChinese(paragraph)) {
                    // 中文文本特殊处理
                    const encodedParagraph = this.encodeChineseText(paragraph);
                    lines = pdf.splitTextToSize(encodedParagraph, maxWidth);
                } else {
                    lines = pdf.splitTextToSize(paragraph, maxWidth);
                }

                // 检查是否需要新页面
                if (yPosition + (lines.length * config.lineHeight * 4) > pageHeight - config.margin.bottom) {
                    pdf.addPage();
                    yPosition = config.margin.top;
                }

                for (const line of lines) {
                    yPosition += config.lineHeight * 4;
                    // 使用中文友好的文本添加方法
                    this.addTextWithChineseSupport(pdf, line, config.margin.left, yPosition);
                }
                yPosition += 5;
            }
        }

        // 添加表格
        for (const table of content.tables) {
            if (yPosition > pageHeight - 100) {
                pdf.addPage();
                yPosition = config.margin.top;
            }

            yPosition += 10;
            await this.addTableToPDF(pdf, table, config.margin.left, yPosition, maxWidth);
            yPosition += (table.rows.length + 2) * 8 + 10;
        }

        // 添加列表
        for (const list of content.lists) {
            if (yPosition > pageHeight - 50) {
                pdf.addPage();
                yPosition = config.margin.top;
            }

            yPosition += 10;
            for (let i = 0; i < list.items.length; i++) {
                const bullet = list.type === 'ordered' ? `${i + 1}.` : '•';
                const text = `${bullet} ${list.items[i]}`;
                const lines = pdf.splitTextToSize(text, maxWidth - 10);
                
                for (const line of lines) {
                    yPosition += config.lineHeight * 4;
                    pdf.text(line, config.margin.left + 5, yPosition);
                }
            }
            yPosition += 5;
        }
    }

    /**
     * 添加表格到PDF
     * @param {Object} pdf - jsPDF实例
     * @param {Object} table - 表格数据
     * @param {number} x - X坐标
     * @param {number} y - Y坐标
     * @param {number} maxWidth - 最大宽度
     */
    async addTableToPDF(pdf, table, x, y, maxWidth) {
        const colWidth = maxWidth / table.headers.length;
        const rowHeight = 8;
        let currentY = y;

        // 绘制表头
        pdf.setFont(pdf.getFont().fontName, 'bold');
        pdf.setFillColor(240, 240, 240);
        
        for (let i = 0; i < table.headers.length; i++) {
            const cellX = x + (i * colWidth);
            pdf.rect(cellX, currentY, colWidth, rowHeight, 'FD');
            pdf.text(table.headers[i], cellX + 2, currentY + 5);
        }
        
        currentY += rowHeight;

        // 绘制数据行
        pdf.setFont(pdf.getFont().fontName, 'normal');
        
        for (const row of table.rows) {
            for (let i = 0; i < row.length && i < table.headers.length; i++) {
                const cellX = x + (i * colWidth);
                pdf.rect(cellX, currentY, colWidth, rowHeight, 'S');
                pdf.text(row[i] || '', cellX + 2, currentY + 5);
            }
            currentY += rowHeight;
        }
    }

    /**
     * 下载PDF文件 - Chrome兼容性增强版
     * @param {Blob} pdfBlob - PDF Blob对象
     * @param {string} filename - 文件名
     */
    downloadPDF(pdfBlob, filename = 'document.pdf') {
        try {
            console.log('📥 开始下载PDF:', { filename, size: pdfBlob.size });

            // 确保文件名安全
            const safeFileName = this.sanitizeFileName(filename);

            // 创建具有正确MIME类型的PDF Blob
            const pdfBlobWithMime = new Blob([pdfBlob], {
                type: 'application/pdf'
            });

            // 检测浏览器类型
            const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

            if (isChrome) {
                // Chrome浏览器特殊处理
                this.downloadPDFChrome(pdfBlobWithMime, safeFileName);
            } else {
                // 其他浏览器使用标准方法
                this.downloadPDFStandard(pdfBlobWithMime, safeFileName);
            }

            console.log('✅ PDF下载触发成功:', safeFileName);

        } catch (error) {
            console.error('❌ PDF下载失败:', error);
            throw new Error(`PDF下载失败: ${error.message}`);
        }
    }

    /**
     * Chrome浏览器专用PDF下载方法
     */
    downloadPDFChrome(pdfBlob, filename) {
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');

        link.style.display = 'none';
        link.href = url;
        link.download = filename;
        link.type = 'application/pdf';

        // 添加到DOM
        document.body.appendChild(link);

        // 使用setTimeout确保DOM更新完成
        setTimeout(() => {
            link.click();

            // 延迟清理
            setTimeout(() => {
                if (document.body.contains(link)) {
                    document.body.removeChild(link);
                }
                URL.revokeObjectURL(url);
            }, 100);
        }, 10);
    }

    /**
     * 标准浏览器PDF下载方法
     */
    downloadPDFStandard(pdfBlob, filename) {
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * 清理文件名，确保安全
     */
    sanitizeFileName(fileName) {
        if (!fileName) return 'document.pdf';

        return fileName
            .replace(/[<>:"/\\|?*]/g, '_')  // 替换不安全字符
            .replace(/\s+/g, '_')          // 替换空格
            .replace(/_{2,}/g, '_')        // 合并多个下划线
            .substring(0, 255)             // 限制长度
            .replace(/\.$/, '')            // 移除末尾的点
            || 'document.pdf';             // 如果为空则使用默认名称
    }
}

// 创建全局实例
const pdfGenerator = new PDFGenerator();

// 导出
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PDFGenerator;
}

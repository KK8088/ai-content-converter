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
     * 动态加载jsPDF库
     */
    async loadJsPDF() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            script.onload = () => {
                console.log('📚 jsPDF库加载完成');
                resolve();
            };
            script.onerror = () => {
                reject(new Error('jsPDF库加载失败'));
            };
            document.head.appendChild(script);
        });
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

        const config = { ...this.defaultOptions, ...options };
        
        try {
            // 创建jsPDF实例
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: config.orientation,
                unit: 'mm',
                format: config.format
            });

            // 设置字体和样式 - 使用jsPDF内置字体
            const fontFamily = config.fontFamily === 'Arial' ? 'helvetica' :
                              config.fontFamily === 'Times' ? 'times' : 'helvetica';
            pdf.setFont(fontFamily);
            pdf.setFontSize(config.fontSize);

            // 处理内容
            const processedContent = this.preprocessContent(content);
            
            // 添加内容到PDF
            await this.addContentToPDF(pdf, processedContent, config);

            // 返回PDF Blob
            return pdf.output('blob');
            
        } catch (error) {
            console.error('PDF生成失败:', error);
            throw error;
        }
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
            pdf.setFont(config.fontFamily, 'bold');
            yPosition += 10;
            pdf.text(content.title, config.margin.left, yPosition);
            yPosition += 15;
        }

        // 重置字体
        pdf.setFontSize(config.fontSize);
        pdf.setFont(config.fontFamily, 'normal');

        // 添加章节
        for (const section of content.sections) {
            // 检查是否需要新页面
            if (yPosition > pageHeight - 50) {
                pdf.addPage();
                yPosition = config.margin.top;
            }

            // 添加章节标题
            const fontFamily = config.fontFamily === 'Arial' ? 'helvetica' :
                              config.fontFamily === 'Times' ? 'times' : 'helvetica';
            pdf.setFont(fontFamily, 'bold');
            pdf.setFontSize(config.fontSize + (4 - section.level));
            yPosition += 10;
            pdf.text(section.title, config.margin.left, yPosition);
            yPosition += 8;

            // 重置字体
            pdf.setFont(fontFamily, 'normal');
            pdf.setFontSize(config.fontSize);

            // 添加章节内容
            for (const paragraph of section.content) {
                const lines = pdf.splitTextToSize(paragraph, maxWidth);
                
                // 检查是否需要新页面
                if (yPosition + (lines.length * config.lineHeight * 4) > pageHeight - config.margin.bottom) {
                    pdf.addPage();
                    yPosition = config.margin.top;
                }

                for (const line of lines) {
                    yPosition += config.lineHeight * 4;
                    pdf.text(line, config.margin.left, yPosition);
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

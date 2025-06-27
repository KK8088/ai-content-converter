/**
 * AI内容格式转换工具 - Markdown解析模块
 * 
 * @description 解析Markdown内容为结构化数据
 * @version 1.0.0
 * @author zk0x01
 */

/**
 * Markdown解析器类
 */
class MarkdownParser {
    constructor() {
        this.elements = [];
        this.currentTitle = '';
    }

    /**
     * 解析Markdown内容
     * @param {string} content - Markdown内容
     * @returns {Array} 解析后的元素数组
     */
    parseMarkdown(content) {
        this.elements = [];
        this.currentTitle = '';
        
        const lines = content.split('\n');
        let i = 0;
        
        while (i < lines.length) {
            const line = lines[i];
            
            // 跳过空行
            if (!line.trim()) {
                i++;
                continue;
            }
            
            // 解析代码块
            if (line.startsWith('```')) {
                const codeBlock = this.parseCodeBlock(lines, i);
                this.elements.push(...codeBlock.elements);
                i = codeBlock.nextIndex;
                continue;
            }
            
            // 解析表格
            if (line.includes('|') && i + 1 < lines.length && this.isSeparatorLine(lines[i + 1])) {
                const table = this.parseMarkdownTable(lines, i);
                this.elements.push(table.element);
                i = table.nextIndex;
                continue;
            }
            
            // 解析标题
            if (line.match(/^#{1,6}\s/)) {
                this.elements.push(this.parseHeading(line));
                i++;
                continue;
            }
            
            // 解析引用块
            if (line.startsWith('> ')) {
                const quote = this.parseQuoteBlock(lines, i);
                this.elements.push(quote.element);
                i = quote.nextIndex;
                continue;
            }
            
            // 解析列表
            if (line.match(/^[-*+]\s/) || line.match(/^\d+\.\s/)) {
                const list = this.parseList(lines, i);
                this.elements.push(...list.elements);
                i = list.nextIndex;
                continue;
            }
            
            // 解析分隔线
            if (line.match(/^---+$/)) {
                this.elements.push(this.createSeparatorLine());
                i++;
                continue;
            }
            
            // 解析普通段落
            const paragraph = this.parseParagraph(lines, i);
            if (paragraph.element) {
                this.elements.push(paragraph.element);
            }
            i = paragraph.nextIndex;
        }
        
        return this.elements;
    }

    /**
     * 提取Markdown表格
     * @param {string} content - 内容
     * @returns {Array} 表格数组
     */
    extractMarkdownTables(content) {
        const tables = [];
        const lines = content.split('\n');
        let i = 0;
        let currentTitle = '';
        
        while (i < lines.length) {
            const line = lines[i].trim();
            
            // 跳过空行
            if (!line) {
                i++;
                continue;
            }
            
            // 检测标题
            if (line.match(/^#{1,6}\s/)) {
                currentTitle = line.replace(/^#{1,6}\s/, '').trim();
                i++;
                continue;
            }
            
            // 检测表格开始
            if (this.isTableStart(lines, i)) {
                const tableResult = this.parseTable(lines, i, currentTitle || `表格${tables.length + 1}`);
                if (tableResult.data.length > 0) {
                    tables.push(tableResult);
                }
                i = tableResult.nextIndex;
                currentTitle = ''; // 重置标题
                continue;
            }
            
            i++;
        }
        
        return tables;
    }

    /**
     * 检测表格开始
     * @param {Array} lines - 行数组
     * @param {number} index - 当前索引
     * @returns {boolean} 是否为表格开始
     */
    isTableStart(lines, index) {
        if (index >= lines.length) return false;
        
        const currentLine = lines[index].trim();
        if (!currentLine.includes('|')) return false;
        
        // 检查下一行是否为分隔线
        if (index + 1 < lines.length) {
            const nextLine = lines[index + 1].trim();
            if (this.isSeparatorLine(nextLine)) {
                return true;
            }
        }
        
        // 如果没有分隔线，检查是否为连续的表格行
        if (index + 1 < lines.length) {
            const nextLine = lines[index + 1].trim();
            if (nextLine.includes('|')) {
                // 检查管道符数量是否相似
                const currentPipes = (currentLine.match(/\|/g) || []).length;
                const nextPipes = (nextLine.match(/\|/g) || []).length;
                return Math.abs(currentPipes - nextPipes) <= 1 && currentPipes >= 2;
            }
        }
        
        return false;
    }

    /**
     * 检测分隔线
     * @param {string} line - 行内容
     * @returns {boolean} 是否为分隔线
     */
    isSeparatorLine(line) {
        // 标准Markdown分隔线
        if (/^\|?[\s]*:?-+:?[\s]*(\|[\s]*:?-+:?[\s]*)*\|?$/.test(line)) {
            return true;
        }
        // 简化的分隔线
        if (/^[-|:\s]+$/.test(line) && line.includes('-')) {
            return true;
        }
        return false;
    }

    /**
     * 解析表格
     * @param {Array} lines - 行数组
     * @param {number} startIndex - 开始索引
     * @param {string} title - 表格标题
     * @returns {object} 表格对象
     */
    parseTable(lines, startIndex, title) {
        const tableData = [];
        let i = startIndex;
        
        // 解析表头
        const headerLine = lines[i].trim();
        const headers = this.parseTableRow(headerLine);
        if (headers.length > 0) {
            tableData.push(headers);
            i++;
        }
        
        // 跳过分隔线（如果存在）
        if (i < lines.length && this.isSeparatorLine(lines[i].trim())) {
            i++;
        }
        
        // 解析数据行
        while (i < lines.length) {
            const line = lines[i].trim();
            if (!line) {
                i++;
                continue;
            }
            
            if (!line.includes('|')) {
                break;
            }
            
            const cells = this.parseTableRow(line);
            if (cells.length > 0) {
                // 确保列数一致性
                while (cells.length < headers.length) {
                    cells.push('');
                }
                if (cells.length > headers.length) {
                    cells.splice(headers.length);
                }
                tableData.push(cells);
            }
            i++;
        }
        
        return {
            title: title,
            data: tableData,
            nextIndex: i
        };
    }

    /**
     * 解析表格行
     * @param {string} line - 行内容
     * @returns {Array} 单元格数组
     */
    parseTableRow(line) {
        if (!line || !line.includes('|')) return [];
        
        // 移除首尾的管道符
        let cleanLine = line.trim();
        if (cleanLine.startsWith('|')) {
            cleanLine = cleanLine.substring(1);
        }
        if (cleanLine.endsWith('|')) {
            cleanLine = cleanLine.substring(0, cleanLine.length - 1);
        }
        
        // 分割并清理单元格
        return cleanLine.split('|')
            .map(cell => Utils.string.cleanCellContent(cell.trim()))
            .filter((cell, index, arr) => {
                // 保留空单元格，但移除完全空的尾部单元格
                if (index === arr.length - 1 && cell === '') {
                    return false;
                }
                return true;
            });
    }

    /**
     * 解析标题
     * @param {string} line - 行内容
     * @returns {object} 标题对象
     */
    parseHeading(line) {
        const match = line.match(/^(#{1,6})\s(.+)$/);
        if (!match) return null;
        
        const level = match[1].length;
        const text = match[2].trim();
        
        // 更新当前标题
        this.currentTitle = text;
        
        return {
            type: 'heading',
            level: level,
            text: text,
            id: this.generateId(text)
        };
    }

    /**
     * 解析代码块
     * @param {Array} lines - 行数组
     * @param {number} startIndex - 开始索引
     * @returns {object} 代码块对象
     */
    parseCodeBlock(lines, startIndex) {
        const elements = [];
        let i = startIndex + 1;
        const codeLines = [];
        let language = lines[startIndex].substring(3).trim();
        
        while (i < lines.length && !lines[i].startsWith('```')) {
            codeLines.push(lines[i]);
            i++;
        }
        
        const codeText = codeLines.join('\n');
        
        elements.push({
            type: 'codeBlock',
            language: language,
            content: codeText,
            lineCount: codeLines.length
        });
        
        return { elements, nextIndex: i + 1 };
    }

    /**
     * 解析引用块
     * @param {Array} lines - 行数组
     * @param {number} startIndex - 开始索引
     * @returns {object} 引用块对象
     */
    parseQuoteBlock(lines, startIndex) {
        const quoteLines = [];
        let i = startIndex;
        
        while (i < lines.length && lines[i].startsWith('> ')) {
            quoteLines.push(lines[i].substring(2).trim());
            i++;
        }
        
        const quoteText = quoteLines.join(' ');
        
        const element = {
            type: 'quote',
            content: quoteText,
            lineCount: quoteLines.length
        };
        
        return { element, nextIndex: i };
    }

    /**
     * 解析列表
     * @param {Array} lines - 行数组
     * @param {number} startIndex - 开始索引
     * @returns {object} 列表对象
     */
    parseList(lines, startIndex) {
        const elements = [];
        let i = startIndex;
        const items = [];
        
        while (i < lines.length) {
            const line = lines[i];
            if (!line.match(/^[-*+]\s/) && !line.match(/^\d+\.\s/)) {
                break;
            }
            
            const isOrdered = line.match(/^\d+\.\s/);
            const text = line.replace(/^[-*+]\s/, '').replace(/^\d+\.\s/, '').trim();
            
            items.push({
                text: text,
                formatted: this.parseInlineFormatting(text)
            });
            
            i++;
        }
        
        if (items.length > 0) {
            elements.push({
                type: 'list',
                ordered: !!items[0].text.match(/^\d+\./),
                items: items
            });
        }
        
        return { elements, nextIndex: i };
    }

    /**
     * 解析段落
     * @param {Array} lines - 行数组
     * @param {number} startIndex - 开始索引
     * @returns {object} 段落对象
     */
    parseParagraph(lines, startIndex) {
        let text = '';
        let i = startIndex;
        
        while (i < lines.length && lines[i].trim() && 
               !lines[i].match(/^#{1,6}\s/) && 
               !lines[i].startsWith('```') && 
               !lines[i].startsWith('> ') &&
               !lines[i].match(/^[-*+]\s/) && 
               !lines[i].match(/^\d+\.\s/) &&
               !lines[i].includes('|')) {
            text += (text ? ' ' : '') + lines[i].trim();
            i++;
        }
        
        if (!text.trim()) {
            return { element: null, nextIndex: i + 1 };
        }
        
        const element = {
            type: 'paragraph',
            content: text,
            formatted: this.parseInlineFormatting(text)
        };
        
        return { element, nextIndex: i };
    }

    /**
     * 解析行内格式
     * @param {string} text - 文本内容
     * @returns {Array} 格式化文本数组
     */
    parseInlineFormatting(text) {
        const parts = [];
        
        // 简化的行内格式解析
        const segments = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/);
        
        for (const segment of segments) {
            if (!segment) continue;
            
            if (segment.startsWith('**') && segment.endsWith('**')) {
                // 加粗
                parts.push({
                    type: 'bold',
                    text: segment.slice(2, -2)
                });
            } else if (segment.startsWith('*') && segment.endsWith('*')) {
                // 斜体
                parts.push({
                    type: 'italic',
                    text: segment.slice(1, -1)
                });
            } else if (segment.startsWith('`') && segment.endsWith('`')) {
                // 行内代码
                parts.push({
                    type: 'code',
                    text: segment.slice(1, -1)
                });
            } else if (segment.match(/\[[^\]]+\]\([^)]+\)/)) {
                // 链接
                const linkMatch = segment.match(/\[([^\]]+)\]\(([^)]+)\)/);
                if (linkMatch) {
                    parts.push({
                        type: 'link',
                        text: linkMatch[1],
                        url: linkMatch[2]
                    });
                }
            } else {
                // 普通文本
                parts.push({
                    type: 'text',
                    text: segment
                });
            }
        }
        
        return parts.length > 0 ? parts : [{
            type: 'text',
            text: text
        }];
    }

    /**
     * 创建分隔线
     * @returns {object} 分隔线对象
     */
    createSeparatorLine() {
        return {
            type: 'separator'
        };
    }

    /**
     * 生成ID
     * @param {string} text - 文本
     * @returns {string} 生成的ID
     */
    generateId(text) {
        return text.toLowerCase()
            .replace(/[^\w\u4e00-\u9fa5\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();
    }

    /**
     * 安全的表格解析
     * @param {string} content - 内容
     * @returns {Array} 表格数组
     */
    safeExtractTables(content) {
        try {
            return this.extractMarkdownTables(content);
        } catch (error) {
            console.warn('表格提取出错:', error);
            // 尝试简单的表格检测
            const lines = content.split('\n').filter(line => line.includes('|'));
            if (lines.length >= 2) {
                const simpleTable = lines.map(line => 
                    line.split('|').map(cell => Utils.string.cleanCellContent(cell)).filter(cell => cell)
                ).filter(row => row.length > 0);
                
                if (simpleTable.length > 0) {
                    return [{
                        title: '表格1',
                        data: simpleTable
                    }];
                }
            }
            return [];
        }
    }
}

// 创建全局实例
const markdownParser = new MarkdownParser();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkdownParser;
}

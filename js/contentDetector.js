/**
 * AI内容格式转换工具 - 内容检测模块
 * 
 * @description 智能检测内容类型和格式
 * @version 1.0.0
 * @author zk0x01
 */

/**
 * 内容检测器类
 */
class ContentDetector {
    constructor() {
        this.scoreThresholds = {
            markdown: 15,
            table: 30,
            list: 20
        };
    }

    /**
     * 智能检测内容类型 - 增强版
     * @param {string} content - 待检测内容
     * @returns {string} 检测到的内容类型
     */
    detectContentType(content) {
        if (!content || !content.trim()) {
            return 'article';
        }
        
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        const totalLines = lines.length;
        
        // 计算各种格式的权重
        let markdownScore = 0;
        let tableScore = 0;
        let listScore = 0;
        let codeScore = 0;
        
        // 检测Markdown表格 - 更严格的检测
        const tableLines = lines.filter(line => line.includes('|'));
        const separatorLines = lines.filter(line => this.isSeparatorLine(line));
        
        if (tableLines.length >= 2 && separatorLines.length >= 1) {
            // 检查表格结构的一致性
            const tableLinesWithPipes = tableLines.filter(line => {
                const pipeCount = (line.match(/\|/g) || []).length;
                return pipeCount >= 2; // 至少需要2个管道符形成表格
            });
            
            if (tableLinesWithPipes.length >= 2) {
                tableScore += 50;
                markdownScore += 30;
            }
        }
        
        // 检测代码块
        const codeBlockMatches = content.match(/```[\s\S]*?```/g);
        if (codeBlockMatches) {
            codeScore += codeBlockMatches.length * 20;
            markdownScore += 25;
        }
        
        // 检测单行代码块（没有结束标记的）
        if (content.includes('```')) {
            markdownScore += 15;
        }
        
        // 检测引用块
        const quoteLines = lines.filter(line => /^>\s/.test(line));
        if (quoteLines.length > 0) {
            markdownScore += quoteLines.length * 5;
        }
        
        // 检测Markdown标题
        const headingLines = lines.filter(line => /^#{1,6}\s/.test(line));
        if (headingLines.length > 0) {
            markdownScore += headingLines.length * 10;
        }
        
        // 检测列表
        const unorderedListLines = lines.filter(line => /^[-*+]\s/.test(line));
        const orderedListLines = lines.filter(line => /^\d+\.\s/.test(line));
        const totalListLines = unorderedListLines.length + orderedListLines.length;
        
        if (totalListLines > 0) {
            listScore += totalListLines * 8;
            markdownScore += totalListLines * 5;
        }
        
        // 检测Markdown链接和格式
        const linkMatches = content.match(/\[([^\]]+)\]\(([^)]+)\)/g);
        if (linkMatches) {
            markdownScore += linkMatches.length * 3;
        }
        
        const boldMatches = content.match(/\*\*([^*]+)\*\*/g);
        if (boldMatches) {
            markdownScore += boldMatches.length * 2;
        }
        
        const italicMatches = content.match(/\*([^*]+)\*/g);
        if (italicMatches) {
            markdownScore += italicMatches.length * 1;
        }
        
        // 检测简单CSV
        if (this.isSimpleCSV(content)) {
            tableScore += 40;
        }
        
        // 检测分隔线
        const separatorCount = lines.filter(line => /^-{3,}$/.test(line)).length;
        if (separatorCount > 0) {
            markdownScore += separatorCount * 5;
        }
        
        // 根据权重决定内容类型
        const maxScore = Math.max(markdownScore, tableScore, listScore, codeScore);
        
        // 如果表格分数最高且超过阈值
        if (tableScore >= this.scoreThresholds.table && tableScore === maxScore) {
            return 'table';
        }
        
        // 如果Markdown分数超过阈值
        if (markdownScore >= this.scoreThresholds.markdown) {
            return 'markdown';
        }
        
        // 如果主要是列表内容
        if (listScore >= this.scoreThresholds.list && totalListLines / totalLines > 0.5) {
            return 'list';
        }
        
        // 默认为文章
        return 'article';
    }

    /**
     * 检测是否为简单CSV格式
     * @param {string} content - 内容
     * @returns {boolean} 是否为CSV
     */
    isSimpleCSV(content) {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length < 2) return false;
        
        // 检查是否包含Markdown表格标记
        if (content.includes('|') || content.includes('---')) {
            return false;
        }
        
        const firstLineCommas = (lines[0].match(/,/g) || []).length;
        if (firstLineCommas === 0) return false;
        
        // 检查列数一致性
        let consistentLines = 0;
        for (const line of lines) {
            const commas = (line.match(/,/g) || []).length;
            if (Math.abs(commas - firstLineCommas) <= 1) {
                consistentLines++;
            }
        }
        
        // 至少80%的行需要有一致的列数
        const consistency = consistentLines / lines.length;
        return consistency >= 0.8 && firstLineCommas >= 1;
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
     * 分析内容结构
     * @param {string} content - 内容
     * @returns {object} 结构分析结果
     */
    analyzeContentStructure(content) {
        const lines = content.split('\n');
        const structure = {
            headings: [],
            tables: [],
            codeBlocks: [],
            lists: [],
            quotes: [],
            paragraphs: [],
            links: [],
            images: []
        };

        let currentSection = null;
        let inCodeBlock = false;
        let codeBlockStart = -1;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (!line) continue;

            // 检测代码块
            if (line.startsWith('```')) {
                if (!inCodeBlock) {
                    inCodeBlock = true;
                    codeBlockStart = i;
                } else {
                    inCodeBlock = false;
                    structure.codeBlocks.push({
                        start: codeBlockStart,
                        end: i,
                        language: lines[codeBlockStart].substring(3).trim(),
                        content: lines.slice(codeBlockStart + 1, i).join('\n')
                    });
                }
                continue;
            }

            if (inCodeBlock) continue;

            // 检测标题
            const headingMatch = line.match(/^(#{1,6})\s(.+)$/);
            if (headingMatch) {
                structure.headings.push({
                    level: headingMatch[1].length,
                    text: headingMatch[2],
                    line: i
                });
                currentSection = headingMatch[2];
                continue;
            }

            // 检测表格
            if (line.includes('|') && i + 1 < lines.length && this.isSeparatorLine(lines[i + 1])) {
                const tableResult = this.parseTableStructure(lines, i);
                structure.tables.push({
                    start: i,
                    end: tableResult.endLine,
                    headers: tableResult.headers,
                    rows: tableResult.rows,
                    section: currentSection
                });
                i = tableResult.endLine;
                continue;
            }

            // 检测列表
            if (line.match(/^[-*+]\s/) || line.match(/^\d+\.\s/)) {
                const listResult = this.parseListStructure(lines, i);
                structure.lists.push({
                    start: i,
                    end: listResult.endLine,
                    type: listResult.type,
                    items: listResult.items,
                    section: currentSection
                });
                i = listResult.endLine;
                continue;
            }

            // 检测引用
            if (line.startsWith('> ')) {
                const quoteResult = this.parseQuoteStructure(lines, i);
                structure.quotes.push({
                    start: i,
                    end: quoteResult.endLine,
                    content: quoteResult.content,
                    section: currentSection
                });
                i = quoteResult.endLine;
                continue;
            }

            // 检测链接
            const linkMatches = line.match(/\[([^\]]+)\]\(([^)]+)\)/g);
            if (linkMatches) {
                linkMatches.forEach(match => {
                    const linkMatch = match.match(/\[([^\]]+)\]\(([^)]+)\)/);
                    if (linkMatch) {
                        structure.links.push({
                            text: linkMatch[1],
                            url: linkMatch[2],
                            line: i,
                            section: currentSection
                        });
                    }
                });
            }

            // 检测图片
            const imageMatches = line.match(/!\[([^\]]*)\]\(([^)]+)\)/g);
            if (imageMatches) {
                imageMatches.forEach(match => {
                    const imageMatch = match.match(/!\[([^\]]*)\]\(([^)]+)\)/);
                    if (imageMatch) {
                        structure.images.push({
                            alt: imageMatch[1],
                            src: imageMatch[2],
                            line: i,
                            section: currentSection
                        });
                    }
                });
            }

            // 普通段落
            if (line && !line.startsWith('#') && !line.includes('|') && 
                !line.match(/^[-*+]\s/) && !line.match(/^\d+\.\s/) && 
                !line.startsWith('> ')) {
                structure.paragraphs.push({
                    content: line,
                    line: i,
                    section: currentSection
                });
            }
        }

        return structure;
    }

    /**
     * 解析表格结构
     * @param {Array} lines - 行数组
     * @param {number} startIndex - 开始索引
     * @returns {object} 表格结构
     */
    parseTableStructure(lines, startIndex) {
        const headers = this.parseTableRow(lines[startIndex]);
        const rows = [];
        let i = startIndex + 2; // 跳过分隔线

        while (i < lines.length && lines[i].includes('|')) {
            const row = this.parseTableRow(lines[i]);
            if (row.length > 0) {
                rows.push(row);
            }
            i++;
        }

        return {
            headers,
            rows,
            endLine: i - 1
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
     * 解析列表结构
     * @param {Array} lines - 行数组
     * @param {number} startIndex - 开始索引
     * @returns {object} 列表结构
     */
    parseListStructure(lines, startIndex) {
        const items = [];
        const isOrdered = lines[startIndex].match(/^\d+\.\s/);
        let i = startIndex;

        while (i < lines.length) {
            const line = lines[i];
            if (!line.match(/^[-*+]\s/) && !line.match(/^\d+\.\s/)) {
                break;
            }
            
            const text = line.replace(/^[-*+]\s/, '').replace(/^\d+\.\s/, '').trim();
            items.push(text);
            i++;
        }

        return {
            type: isOrdered ? 'ordered' : 'unordered',
            items,
            endLine: i - 1
        };
    }

    /**
     * 解析引用结构
     * @param {Array} lines - 行数组
     * @param {number} startIndex - 开始索引
     * @returns {object} 引用结构
     */
    parseQuoteStructure(lines, startIndex) {
        const quoteLines = [];
        let i = startIndex;

        while (i < lines.length && lines[i].startsWith('> ')) {
            quoteLines.push(lines[i].substring(2).trim());
            i++;
        }

        return {
            content: quoteLines.join(' '),
            endLine: i - 1
        };
    }

    /**
     * 获取内容统计信息
     * @param {string} content - 内容
     * @returns {object} 统计信息
     */
    getContentStats(content) {
        const structure = this.analyzeContentStructure(content);
        const textStats = Utils.string.getTextStats(content);
        
        return {
            ...textStats,
            headings: structure.headings.length,
            tables: structure.tables.length,
            codeBlocks: structure.codeBlocks.length,
            lists: structure.lists.length,
            quotes: structure.quotes.length,
            links: structure.links.length,
            images: structure.images.length,
            complexity: this.calculateComplexity(structure)
        };
    }

    /**
     * 计算内容复杂度
     * @param {object} structure - 内容结构
     * @returns {string} 复杂度等级
     */
    calculateComplexity(structure) {
        let score = 0;
        
        score += structure.headings.length * 2;
        score += structure.tables.length * 10;
        score += structure.codeBlocks.length * 5;
        score += structure.lists.length * 3;
        score += structure.quotes.length * 2;
        score += structure.links.length * 1;
        score += structure.images.length * 3;
        
        if (score < 10) return 'simple';
        if (score < 30) return 'medium';
        return 'complex';
    }
}

// 创建全局实例
const contentDetector = new ContentDetector();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentDetector;
}

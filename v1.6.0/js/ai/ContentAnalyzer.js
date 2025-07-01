/**
 * 智能内容分析引擎
 * 分析AI对话内容并推荐最佳输出格式
 */

class ContentAnalyzer {
    constructor() {
        this.patterns = {
            // 表格检测模式
            table: {
                regex: /\|.*\|.*\|/g,
                weight: 0.9,
                format: 'xlsx',
                description: '检测到表格数据'
            },
            
            // 代码块检测
            codeBlock: {
                regex: /```[\s\S]*?```/g,
                weight: 0.8,
                format: 'docx',
                description: '检测到代码块'
            },
            
            // 列表检测
            list: {
                regex: /^[\s]*[-*+]\s+/gm,
                weight: 0.6,
                format: 'docx',
                description: '检测到列表结构'
            },
            
            // 标题检测
            heading: {
                regex: /^#{1,6}\s+/gm,
                weight: 0.7,
                format: 'docx',
                description: '检测到标题结构'
            },
            
            // 数学公式检测
            math: {
                regex: /\$\$[\s\S]*?\$\$|\$[^$]+\$/g,
                weight: 0.8,
                format: 'pdf',
                description: '检测到数学公式'
            },
            
            // 引用检测
            quote: {
                regex: /^>\s+/gm,
                weight: 0.5,
                format: 'docx',
                description: '检测到引用内容'
            },
            
            // 链接检测
            link: {
                regex: /https?:\/\/[^\s]+/g,
                weight: 0.4,
                format: 'docx',
                description: '检测到链接'
            }
        };
        
        this.formatWeights = {
            'docx': 0,
            'xlsx': 0,
            'pdf': 0
        };
        
        this.cache = new Map();
        this.analysisHistory = [];
    }

    /**
     * 分析内容并返回推荐结果
     * @param {string} content - 要分析的内容
     * @returns {Promise<Object>} 分析结果
     */
    async analyze(content) {
        if (!content || content.trim().length === 0) {
            return this.getEmptyAnalysis();
        }

        // 检查缓存
        const cacheKey = this.generateCacheKey(content);
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        try {
            // 执行分析
            const analysis = await this.performAnalysis(content);
            
            // 缓存结果
            this.cache.set(cacheKey, analysis);
            
            // 记录分析历史
            this.recordAnalysis(content, analysis);
            
            return analysis;
            
        } catch (error) {
            console.error('内容分析失败:', error);
            return this.getErrorAnalysis();
        }
    }

    /**
     * 执行具体的内容分析
     * @param {string} content - 内容
     * @returns {Object} 分析结果
     */
    async performAnalysis(content) {
        // 基础特征提取
        const features = this.extractFeatures(content);
        
        // 模式匹配
        const patterns = this.matchPatterns(content);
        
        // 计算格式分数
        const scores = this.calculateFormatScores(features, patterns);
        
        // 获取推荐
        const recommendation = this.getRecommendation(scores, features);
        
        // 生成建议
        const suggestions = this.generateSuggestions(features, patterns, recommendation);
        
        return {
            features,
            patterns,
            scores,
            recommendation,
            suggestions,
            confidence: recommendation.confidence,
            timestamp: Date.now()
        };
    }

    /**
     * 提取内容基础特征
     * @param {string} content - 内容
     * @returns {Object} 特征对象
     */
    extractFeatures(content) {
        const lines = content.split('\n');
        const words = content.split(/\s+/).filter(word => word.length > 0);
        
        return {
            // 基础统计
            length: content.length,
            wordCount: words.length,
            lineCount: lines.length,
            paragraphCount: content.split(/\n\s*\n/).length,
            
            // 字符特征
            hasChineseChars: /[\u4e00-\u9fff]/.test(content),
            hasEnglishChars: /[a-zA-Z]/.test(content),
            hasNumbers: /\d/.test(content),
            hasSpecialChars: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(content),
            
            // 结构特征
            avgLineLength: lines.reduce((sum, line) => sum + line.length, 0) / lines.length,
            maxLineLength: Math.max(...lines.map(line => line.length)),
            emptyLineRatio: lines.filter(line => line.trim() === '').length / lines.length,
            
            // 复杂度指标
            complexity: this.calculateComplexity(content),
            readability: this.calculateReadability(content),
            
            // 内容类型推断
            isConversation: this.isConversationContent(content),
            isStructured: this.isStructuredContent(content),
            isTechnical: this.isTechnicalContent(content)
        };
    }

    /**
     * 匹配内容模式
     * @param {string} content - 内容
     * @returns {Array} 匹配的模式
     */
    matchPatterns(content) {
        const matches = [];
        
        for (const [name, pattern] of Object.entries(this.patterns)) {
            const regex = pattern.regex;
            const found = content.match(regex);
            
            if (found) {
                matches.push({
                    name,
                    count: found.length,
                    weight: pattern.weight,
                    format: pattern.format,
                    description: pattern.description,
                    examples: found.slice(0, 3) // 保留前3个示例
                });
            }
        }
        
        return matches.sort((a, b) => b.weight - a.weight);
    }

    /**
     * 计算各格式的分数
     * @param {Object} features - 特征
     * @param {Array} patterns - 模式匹配结果
     * @returns {Object} 格式分数
     */
    calculateFormatScores(features, patterns) {
        const scores = { docx: 0, xlsx: 0, pdf: 0 };
        
        // 基于模式匹配的分数
        patterns.forEach(pattern => {
            scores[pattern.format] += pattern.weight * pattern.count;
        });
        
        // 基于内容特征的分数调整
        
        // Excel适合的情况
        if (features.isStructured && patterns.some(p => p.name === 'table')) {
            scores.xlsx += 2.0;
        }
        
        // PDF适合的情况
        if (features.wordCount > 1000) {
            scores.pdf += 1.0;
        }
        
        if (patterns.some(p => p.name === 'math')) {
            scores.pdf += 1.5;
        }
        
        // Word适合的情况（默认选择）
        if (features.isConversation) {
            scores.docx += 1.0;
        }
        
        if (patterns.some(p => ['heading', 'list', 'quote'].includes(p.name))) {
            scores.docx += 1.0;
        }
        
        // 归一化分数
        const maxScore = Math.max(...Object.values(scores));
        if (maxScore > 0) {
            Object.keys(scores).forEach(format => {
                scores[format] = Math.round((scores[format] / maxScore) * 100);
            });
        }
        
        return scores;
    }

    /**
     * 获取推荐结果
     * @param {Object} scores - 格式分数
     * @param {Object} features - 特征
     * @returns {Object} 推荐结果
     */
    getRecommendation(scores, features) {
        const sortedFormats = Object.entries(scores)
            .sort(([,a], [,b]) => b - a)
            .map(([format, score]) => ({ format, score }));
        
        const topFormat = sortedFormats[0];
        const secondFormat = sortedFormats[1];
        
        // 计算置信度
        let confidence = topFormat.score;
        
        // 如果最高分和第二高分差距很小，降低置信度
        if (secondFormat && topFormat.score - secondFormat.score < 20) {
            confidence = Math.max(60, confidence - 15);
        }
        
        // 如果没有明显特征，使用默认推荐
        if (topFormat.score === 0) {
            return {
                format: 'docx',
                confidence: 75,
                reason: '通用文档格式，适合大多数内容',
                alternatives: ['pdf', 'xlsx']
            };
        }
        
        return {
            format: topFormat.format,
            confidence: Math.min(95, confidence),
            reason: this.getRecommendationReason(topFormat.format, features),
            alternatives: sortedFormats.slice(1, 3).map(f => f.format)
        };
    }

    /**
     * 生成推荐理由
     * @param {string} format - 推荐格式
     * @param {Object} features - 特征
     * @returns {string} 推荐理由
     */
    getRecommendationReason(format, features) {
        const reasons = {
            'xlsx': '检测到表格数据，Excel格式最适合数据展示和分析',
            'pdf': features.wordCount > 1000 
                ? '内容较长，PDF格式便于阅读和分享'
                : '检测到复杂格式，PDF能完美保持布局',
            'docx': features.isConversation 
                ? '对话内容适合Word文档格式，便于编辑和格式化'
                : '检测到丰富文本结构，Word格式最适合'
        };
        
        return reasons[format] || '基于内容分析的智能推荐';
    }

    /**
     * 生成智能建议
     * @param {Object} features - 特征
     * @param {Array} patterns - 模式
     * @param {Object} recommendation - 推荐
     * @returns {Array} 建议列表
     */
    generateSuggestions(features, patterns, recommendation) {
        const suggestions = [];
        
        // 主要推荐
        suggestions.push({
            type: 'primary',
            format: recommendation.format,
            title: this.getFormatDisplayName(recommendation.format),
            description: recommendation.reason,
            confidence: recommendation.confidence,
            icon: this.getFormatIcon(recommendation.format)
        });
        
        // 替代建议
        recommendation.alternatives.forEach(format => {
            suggestions.push({
                type: 'alternative',
                format: format,
                title: this.getFormatDisplayName(format),
                description: this.getAlternativeReason(format, features),
                confidence: Math.max(50, recommendation.confidence - 20),
                icon: this.getFormatIcon(format)
            });
        });
        
        // 特殊建议
        if (features.hasChineseChars && recommendation.format === 'pdf') {
            suggestions.push({
                type: 'tip',
                title: '中文优化',
                description: '已启用中文字符优化，确保PDF显示效果',
                icon: '🇨🇳'
            });
        }
        
        return suggestions;
    }

    /**
     * 计算内容复杂度
     * @param {string} content - 内容
     * @returns {number} 复杂度分数 (0-1)
     */
    calculateComplexity(content) {
        let complexity = 0;
        
        // 基于不同类型字符的复杂度
        const charTypes = {
            chinese: (content.match(/[\u4e00-\u9fff]/g) || []).length,
            english: (content.match(/[a-zA-Z]/g) || []).length,
            numbers: (content.match(/\d/g) || []).length,
            special: (content.match(/[^\w\s\u4e00-\u9fff]/g) || []).length
        };
        
        const totalChars = content.length;
        if (totalChars === 0) return 0;
        
        // 字符多样性
        const diversity = Object.values(charTypes).filter(count => count > 0).length / 4;
        complexity += diversity * 0.3;
        
        // 特殊字符比例
        const specialRatio = charTypes.special / totalChars;
        complexity += Math.min(specialRatio * 2, 0.4);
        
        // 行长度变化
        const lines = content.split('\n');
        const lengths = lines.map(line => line.length);
        const avgLength = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
        const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
        const lengthComplexity = Math.min(Math.sqrt(variance) / avgLength, 0.3);
        complexity += lengthComplexity;
        
        return Math.min(complexity, 1);
    }

    /**
     * 计算可读性分数
     * @param {string} content - 内容
     * @returns {number} 可读性分数 (0-1)
     */
    calculateReadability(content) {
        const sentences = content.split(/[.!?。！？]/).filter(s => s.trim().length > 0);
        const words = content.split(/\s+/).filter(w => w.length > 0);
        
        if (sentences.length === 0 || words.length === 0) return 0.5;
        
        const avgWordsPerSentence = words.length / sentences.length;
        const avgCharsPerWord = content.replace(/\s/g, '').length / words.length;
        
        // 简化的可读性计算
        let readability = 1;
        
        // 句子长度惩罚
        if (avgWordsPerSentence > 20) {
            readability -= 0.2;
        }
        
        // 词汇长度惩罚
        if (avgCharsPerWord > 8) {
            readability -= 0.2;
        }
        
        return Math.max(0, Math.min(1, readability));
    }

    /**
     * 判断是否为对话内容
     * @param {string} content - 内容
     * @returns {boolean}
     */
    isConversationContent(content) {
        const conversationPatterns = [
            /^(用户|User|Human)[:：]/gm,
            /^(助手|Assistant|AI|ChatGPT|Claude)[:：]/gm,
            /^Q[:：]/gm,
            /^A[:：]/gm
        ];
        
        return conversationPatterns.some(pattern => pattern.test(content));
    }

    /**
     * 判断是否为结构化内容
     * @param {string} content - 内容
     * @returns {boolean}
     */
    isStructuredContent(content) {
        const structurePatterns = [
            /\|.*\|.*\|/g,  // 表格
            /^#{1,6}\s+/gm, // 标题
            /^[\s]*[-*+]\s+/gm, // 列表
            /^\d+\.\s+/gm   // 有序列表
        ];
        
        const matches = structurePatterns.reduce((count, pattern) => {
            return count + (content.match(pattern) || []).length;
        }, 0);
        
        return matches > 3;
    }

    /**
     * 判断是否为技术内容
     * @param {string} content - 内容
     * @returns {boolean}
     */
    isTechnicalContent(content) {
        const technicalKeywords = [
            'function', 'class', 'import', 'export', 'const', 'let', 'var',
            'API', 'HTTP', 'JSON', 'SQL', 'HTML', 'CSS', 'JavaScript',
            'Python', 'Java', 'React', 'Vue', 'Angular', 'Node.js'
        ];
        
        const keywordCount = technicalKeywords.reduce((count, keyword) => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            return count + (content.match(regex) || []).length;
        }, 0);
        
        return keywordCount > 5;
    }

    /**
     * 获取格式显示名称
     * @param {string} format - 格式
     * @returns {string} 显示名称
     */
    getFormatDisplayName(format) {
        const names = {
            'docx': 'Word文档',
            'xlsx': 'Excel表格',
            'pdf': 'PDF文档'
        };
        return names[format] || format.toUpperCase();
    }

    /**
     * 获取格式图标
     * @param {string} format - 格式
     * @returns {string} 图标
     */
    getFormatIcon(format) {
        const icons = {
            'docx': '📄',
            'xlsx': '📊',
            'pdf': '📄'
        };
        return icons[format] || '📄';
    }

    /**
     * 获取替代格式的推荐理由
     * @param {string} format - 格式
     * @param {Object} features - 特征
     * @returns {string} 理由
     */
    getAlternativeReason(format, features) {
        const reasons = {
            'docx': '便于后续编辑和修改',
            'xlsx': '适合数据分析和处理',
            'pdf': '便于分享和打印'
        };
        return reasons[format] || '备选格式';
    }

    /**
     * 生成缓存键
     * @param {string} content - 内容
     * @returns {string} 缓存键
     */
    generateCacheKey(content) {
        // 简单的哈希函数
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 转换为32位整数
        }
        return `analysis_${Math.abs(hash)}`;
    }

    /**
     * 记录分析历史
     * @param {string} content - 内容
     * @param {Object} analysis - 分析结果
     */
    recordAnalysis(content, analysis) {
        this.analysisHistory.push({
            timestamp: Date.now(),
            contentLength: content.length,
            recommendation: analysis.recommendation,
            confidence: analysis.confidence
        });
        
        // 保持历史记录在合理范围内
        if (this.analysisHistory.length > 100) {
            this.analysisHistory = this.analysisHistory.slice(-50);
        }
    }

    /**
     * 获取空分析结果
     * @returns {Object} 空分析结果
     */
    getEmptyAnalysis() {
        return {
            features: null,
            patterns: [],
            scores: { docx: 0, xlsx: 0, pdf: 0 },
            recommendation: {
                format: 'docx',
                confidence: 50,
                reason: '等待输入内容',
                alternatives: []
            },
            suggestions: [],
            confidence: 50,
            timestamp: Date.now()
        };
    }

    /**
     * 获取错误分析结果
     * @returns {Object} 错误分析结果
     */
    getErrorAnalysis() {
        return {
            features: null,
            patterns: [],
            scores: { docx: 75, xlsx: 0, pdf: 0 },
            recommendation: {
                format: 'docx',
                confidence: 75,
                reason: '分析出错，使用默认推荐',
                alternatives: ['pdf']
            },
            suggestions: [{
                type: 'primary',
                format: 'docx',
                title: 'Word文档',
                description: '通用格式，适合大多数内容',
                confidence: 75,
                icon: '📄'
            }],
            confidence: 75,
            timestamp: Date.now()
        };
    }

    /**
     * 清除缓存
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * 获取分析统计
     * @returns {Object} 统计信息
     */
    getStats() {
        return {
            cacheSize: this.cache.size,
            historyCount: this.analysisHistory.length,
            avgConfidence: this.analysisHistory.length > 0 
                ? this.analysisHistory.reduce((sum, item) => sum + item.confidence, 0) / this.analysisHistory.length
                : 0
        };
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ContentAnalyzer;
} else if (typeof window !== 'undefined') {
    window.ContentAnalyzer = ContentAnalyzer;
}

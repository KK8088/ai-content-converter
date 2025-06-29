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

        // Word标准样式配置
        this.wordStyles = this.initWordStyles();

        this.init();
    }

    /**
     * 初始化Word标准样式配置
     */
    initWordStyles() {
        return {
            // 字体配置 - 符合Word中文环境默认
            fonts: {
                chinese: "宋体",           // Word中文默认字体
                english: "Calibri",       // Word英文默认字体
                code: "Consolas",         // 代码字体
                fallback: "微软雅黑"      // 备用字体
            },

            // 字号配置 - 符合Word默认设置
            fontSizes: {
                title: 28,        // 文档标题
                heading1: 24,     // 一级标题
                heading2: 20,     // 二级标题
                heading3: 16,     // 三级标题
                heading4: 14,     // 四级标题
                heading5: 12,     // 五级标题
                heading6: 11,     // 六级标题
                normal: 11,       // 正文
                small: 9,         // 小字
                code: 10          // 代码
            },

            // 颜色配置 - Word标准配色
            colors: {
                text: "000000",           // 正文黑色
                heading: "2E5BBA",        // 标题蓝色
                tableHeader: "FFFFFF",    // 表头白色文字
                tableHeaderBg: "4472C4",  // 表头蓝色背景
                code: "333333",           // 代码深灰
                codeBg: "F2F2F2",         // 代码背景浅灰
                quote: "666666",          // 引用灰色
                quoteBg: "F9F9F9",        // 引用背景
                border: "BFBFBF"          // 边框灰色
            },

            // 间距配置 - Word标准间距（单位：磅）
            spacing: {
                titleBefore: 0,           // 文档标题前间距
                titleAfter: 18,           // 文档标题后间距
                heading1Before: 12,       // 一级标题前间距
                heading1After: 6,         // 一级标题后间距
                heading2Before: 10,       // 二级标题前间距
                heading2After: 6,         // 二级标题后间距
                heading3Before: 10,       // 三级标题前间距
                heading3After: 6,         // 三级标题后间距
                paragraphAfter: 8,        // 段落后间距
                listAfter: 4,             // 列表项后间距
                codeBlockBefore: 6,       // 代码块前间距
                codeBlockAfter: 6,        // 代码块后间距
                tableBefore: 6,           // 表格前间距
                tableAfter: 6             // 表格后间距
            },

            // 行间距配置
            lineSpacing: {
                normal: 1.15,             // 正文行间距
                heading: 1.0,             // 标题行间距
                code: 1.0                 // 代码行间距
            }
        };
    }

    /**
     * 获取标题字体大小
     */
    getHeadingFontSize(level) {
        const sizes = {
            1: this.wordStyles.fontSizes.heading1,
            2: this.wordStyles.fontSizes.heading2,
            3: this.wordStyles.fontSizes.heading3,
            4: this.wordStyles.fontSizes.heading4,
            5: this.wordStyles.fontSizes.heading5,
            6: this.wordStyles.fontSizes.heading6
        };
        return sizes[level] || this.wordStyles.fontSizes.normal;
    }

    /**
     * 获取标题间距
     */
    getHeadingSpacing(level) {
        const spacings = {
            1: { before: this.wordStyles.spacing.heading1Before, after: this.wordStyles.spacing.heading1After },
            2: { before: this.wordStyles.spacing.heading2Before, after: this.wordStyles.spacing.heading2After },
            3: { before: this.wordStyles.spacing.heading3Before, after: this.wordStyles.spacing.heading3After }
        };
        return spacings[level] || { before: 10, after: 6 };
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

        // 高级选项切换事件
        this.bindAdvancedOptions();

        // 初始化转换策略引擎
        this.initializeConversionStrategies();

        // 初始化格式推荐系统
        this.initializeFormatRecommendationSystem();

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
     * 处理内容变化 - 增强版智能识别
     */
    handleContentChange(content) {
        this.currentContent = content;
        this.updateStats(content);

        // 智能检测内容类型 - 使用增强算法
        const detectionResult = this.intelligentContentDetection(content);
        this.currentContentType = detectionResult.type;
        this.detectionConfidence = detectionResult.confidence;
        this.detectionDetails = detectionResult.details;

        // 更新UI显示
        this.updateContentTypeDisplay();
        this.updateDetectionResultDisplay(detectionResult);
        this.updatePreview();
        this.saveToStorage();
    }

    /**
     * 智能内容检测 - v2.0 增强版算法
     */
    intelligentContentDetection(content) {
        if (!content || !content.trim()) {
            return {
                type: 'auto',
                confidence: 0,
                details: { reason: '内容为空' },
                recommendations: [],
                outputFormats: ['docx']
            };
        }

        // 初始化分析结果
        const analysisResult = {
            syntaxAnalysis: this.analyzeSyntaxFeatures(content),
            semanticAnalysis: this.analyzeSemanticFeatures(content),
            structureAnalysis: this.analyzeStructureFeatures(content),
            contextAnalysis: this.analyzeContextFeatures(content)
        };

        // 综合分析结果
        return this.synthesizeAnalysisResults(analysisResult, content);
    }

    /**
     * 语法特征分析 - 新增
     */
    analyzeSyntaxFeatures(content) {
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        const totalLines = lines.length;

        // 语法模式识别
        const syntaxPatterns = {
            markdown: {
                headers: (content.match(/^#{1,6}\s+/gm) || []).length,
                tables: this.detectMarkdownTables(content),
                codeBlocks: (content.match(/```[\s\S]*?```/gm) || []).length,
                inlineCode: (content.match(/`[^`]+`/g) || []).length,
                lists: this.detectLists(content),
                emphasis: (content.match(/\*\*.*?\*\*|\*.*?\*/gm) || []).length,
                links: (content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length,
                quotes: (content.match(/^>\s+/gm) || []).length
            },
            structured: {
                json: /^\s*[\{\[]/.test(content.trim()),
                xml: /<[^>]+>/.test(content),
                csv: this.detectCSV(content),
                yaml: /^[\w\s]+:\s*[\w\s]/m.test(content),
                ini: /^\[[\w\s]+\]$/m.test(content)
            },
            conversational: {
                aiDialog: (content.match(/^(用户|User|Human|助手|Assistant|AI|ChatGPT|Claude|DeepSeek)[:：]/gm) || []).length,
                qaFormat: (content.match(/^[QA][:：]/gm) || []).length,
                interview: (content.match(/^(问|答|Q|A)[:：]/gm) || []).length,
                dialogue: (content.match(/^[A-Za-z\u4e00-\u9fa5]+[:：]/gm) || []).length
            }
        };

        // 计算语法特征分数
        const scores = this.calculateSyntaxScores(syntaxPatterns, totalLines);

        return {
            patterns: syntaxPatterns,
            scores: scores,
            confidence: this.calculateSyntaxConfidence(scores)
        };
    }

    /**
     * 检测Markdown表格 - 增强版
     */
    detectMarkdownTables(content) {
        const lines = content.split('\n');
        let tableCount = 0;
        let inTable = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.includes('|') && !this.isTableSeparatorLine(line)) {
                if (!inTable) {
                    // 检查下一行是否为分隔符
                    const nextLine = i + 1 < lines.length ? lines[i + 1].trim() : '';
                    if (this.isTableSeparatorLine(nextLine)) {
                        tableCount++;
                        inTable = true;
                    }
                }
            } else if (inTable && !line.includes('|')) {
                inTable = false;
            }
        }

        return tableCount;
    }

    /**
     * 检测列表结构
     */
    detectLists(content) {
        const lines = content.split('\n').map(line => line.trim());

        const unorderedLists = lines.filter(line => /^[-*+]\s+/.test(line)).length;
        const orderedLists = lines.filter(line => /^\d+\.\s+/.test(line)).length;
        const nestedLists = lines.filter(line => /^\s{2,}[-*+]\s+/.test(line)).length;

        return {
            unordered: unorderedLists,
            ordered: orderedLists,
            nested: nestedLists,
            total: unorderedLists + orderedLists
        };
    }

    /**
     * 检测CSV格式 - 增强版
     */
    detectCSV(content) {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length < 2) return false;

        // 检查是否包含Markdown表格标记
        if (content.includes('|') && content.includes('---')) {
            return false;
        }

        // 检查逗号分隔的一致性
        const firstLineCommas = (lines[0].match(/,/g) || []).length;
        if (firstLineCommas === 0) return false;

        const consistentLines = lines.slice(0, Math.min(5, lines.length)).filter(line => {
            const commas = (line.match(/,/g) || []).length;
            return commas === firstLineCommas;
        });

        return consistentLines.length >= Math.min(3, lines.length) && firstLineCommas >= 1;
    }

    /**
     * 计算语法特征分数
     */
    calculateSyntaxScores(patterns, totalLines) {
        const scores = {
            markdown: 0,
            structured: 0,
            conversational: 0,
            table: 0,
            code: 0,
            list: 0,
            article: 0
        };

        // Markdown特征评分
        scores.markdown += patterns.markdown.headers * 8;
        scores.markdown += patterns.markdown.tables * 15;
        scores.markdown += patterns.markdown.codeBlocks * 12;
        scores.markdown += patterns.markdown.inlineCode * 2;
        scores.markdown += patterns.markdown.lists.total * 5;
        scores.markdown += patterns.markdown.emphasis * 3;
        scores.markdown += patterns.markdown.links * 4;
        scores.markdown += patterns.markdown.quotes * 6;

        // 结构化数据评分
        if (patterns.structured.json) scores.structured += 20;
        if (patterns.structured.xml) scores.structured += 15;
        if (patterns.structured.csv) scores.structured += 25;
        if (patterns.structured.yaml) scores.structured += 18;
        if (patterns.structured.ini) scores.structured += 12;

        // 对话格式评分
        scores.conversational += patterns.conversational.aiDialog * 8;
        scores.conversational += patterns.conversational.qaFormat * 6;
        scores.conversational += patterns.conversational.interview * 7;
        scores.conversational += patterns.conversational.dialogue * 3;

        // 专门类型评分
        scores.table = patterns.markdown.tables * 20 + (patterns.structured.csv ? 25 : 0);
        scores.code = patterns.markdown.codeBlocks * 15 + patterns.markdown.inlineCode * 2;
        scores.list = patterns.markdown.lists.total * 8;

        // 文章类型评分（基于文本长度和结构）
        if (totalLines > 10 && scores.markdown < 20 && scores.structured < 10) {
            scores.article = Math.min(totalLines * 2, 50);
        }

        return scores;
    }

    /**
     * 计算语法置信度
     */
    calculateSyntaxConfidence(scores) {
        const maxScore = Math.max(...Object.values(scores));
        const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

        if (totalScore === 0) return 0;

        const confidence = Math.round((maxScore / totalScore) * 100);
        return Math.min(confidence, 95); // 语法分析最高95%
    }

    /**
     * 语义特征分析 - 新增
     */
    analyzeSemanticFeatures(content) {
        const businessTypes = {
            report: ['报告', '分析', '总结', '汇报', 'report', 'analysis', 'summary'],
            proposal: ['方案', '计划', '建议', '提案', 'proposal', 'plan', 'suggestion'],
            documentation: ['说明', '文档', '手册', '指南', 'documentation', 'manual', 'guide'],
            data: ['数据', '统计', '指标', '结果', 'data', 'statistics', 'metrics', 'results'],
            meeting: ['会议', '讨论', '记录', 'meeting', 'discussion', 'minutes'],
            technical: ['技术', '开发', '代码', '系统', 'technical', 'development', 'system'],
            academic: ['研究', '论文', '学术', 'research', 'paper', 'academic']
        };

        const semanticScores = {};
        Object.keys(businessTypes).forEach(type => {
            semanticScores[type] = 0;
            businessTypes[type].forEach(keyword => {
                const regex = new RegExp(keyword, 'gi');
                const matches = content.match(regex);
                if (matches) {
                    semanticScores[type] += matches.length * 3;
                }
            });
        });

        // 检测专业术语密度
        const technicalTerms = ['API', 'JSON', 'XML', 'HTTP', 'SQL', 'CSS', 'HTML', 'JavaScript', 'Python'];
        const technicalScore = technicalTerms.reduce((score, term) => {
            const regex = new RegExp(term, 'gi');
            const matches = content.match(regex);
            return score + (matches ? matches.length * 2 : 0);
        }, 0);

        return {
            businessTypes: semanticScores,
            technicalScore: technicalScore,
            confidence: this.calculateSemanticConfidence(semanticScores, technicalScore)
        };
    }

    /**
     * 计算语义置信度
     */
    calculateSemanticConfidence(businessScores, technicalScore) {
        const maxBusinessScore = Math.max(...Object.values(businessScores));
        const totalScore = Object.values(businessScores).reduce((sum, score) => sum + score, 0) + technicalScore;

        if (totalScore === 0) return 0;

        const confidence = Math.round(((maxBusinessScore + technicalScore) / totalScore) * 100);
        return Math.min(confidence, 90); // 语义分析最高90%
    }

    /**
     * 结构特征分析 - 新增
     */
    analyzeStructureFeatures(content) {
        const lines = content.split('\n').filter(line => line.trim());
        const totalLines = lines.length;

        // 计算各类型内容占比
        const tableLines = lines.filter(line => line.includes('|') && !this.isTableSeparatorLine(line)).length;
        const codeLines = this.countCodeLines(content);
        const listLines = lines.filter(line => /^[-*+]\s+|^\d+\.\s+/.test(line.trim())).length;
        const textLines = totalLines - tableLines - codeLines - listLines;

        const distribution = {
            textRatio: textLines / totalLines,
            tableRatio: tableLines / totalLines,
            codeRatio: codeLines / totalLines,
            listRatio: listLines / totalLines
        };

        // 分析文档层次结构
        const hierarchy = this.analyzeHierarchy(content);

        // 评估复杂度
        const complexity = this.assessComplexity(distribution, hierarchy, totalLines);

        return {
            distribution: distribution,
            hierarchy: hierarchy,
            complexity: complexity,
            confidence: this.calculateStructureConfidence(distribution, hierarchy)
        };
    }

    /**
     * 计算代码行数
     */
    countCodeLines(content) {
        const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
        let codeLines = 0;

        codeBlocks.forEach(block => {
            const lines = block.split('\n');
            codeLines += Math.max(0, lines.length - 2); // 减去开始和结束的```行
        });

        return codeLines;
    }

    /**
     * 分析文档层次结构
     */
    analyzeHierarchy(content) {
        const headings = content.match(/^#{1,6}\s+.+$/gm) || [];
        const levels = headings.map(heading => {
            const level = heading.match(/^#+/)[0].length;
            return level;
        });

        return {
            depth: levels.length > 0 ? Math.max(...levels) : 0,
            sections: levels.length,
            flow: this.determineFlow(levels)
        };
    }

    /**
     * 确定文档流类型
     */
    determineFlow(levels) {
        if (levels.length === 0) return 'simple';
        if (levels.length === 1) return 'single';

        const hasMultipleLevels = new Set(levels).size > 1;
        const isSequential = levels.every((level, index) => {
            if (index === 0) return true;
            return level >= levels[index - 1] - 1; // 允许同级或下一级
        });

        if (hasMultipleLevels && isSequential) return 'hierarchical';
        if (hasMultipleLevels) return 'complex';
        return 'linear';
    }

    /**
     * 评估内容复杂度
     */
    assessComplexity(distribution, hierarchy, totalLines) {
        let complexityScore = 0;

        // 基于内容分布的复杂度
        if (distribution.tableRatio > 0.3) complexityScore += 2;
        if (distribution.codeRatio > 0.2) complexityScore += 2;
        if (distribution.listRatio > 0.4) complexityScore += 1;

        // 基于层次结构的复杂度
        if (hierarchy.depth > 3) complexityScore += 2;
        if (hierarchy.sections > 5) complexityScore += 1;
        if (hierarchy.flow === 'complex') complexityScore += 2;

        // 基于文档长度的复杂度
        if (totalLines > 100) complexityScore += 1;
        if (totalLines > 500) complexityScore += 2;

        if (complexityScore >= 6) return 'high';
        if (complexityScore >= 3) return 'medium';
        return 'low';
    }

    /**
     * 计算结构置信度
     */
    calculateStructureConfidence(distribution, hierarchy) {
        // 基于分布的均匀性和层次的清晰度计算置信度
        const distributionEntropy = this.calculateEntropy(Object.values(distribution));
        const hierarchyScore = hierarchy.sections > 0 ? Math.min(hierarchy.sections * 10, 50) : 0;

        const confidence = Math.round((distributionEntropy * 50) + (hierarchyScore));
        return Math.min(confidence, 85); // 结构分析最高85%
    }

    /**
     * 计算熵值
     */
    calculateEntropy(values) {
        const total = values.reduce((sum, val) => sum + val, 0);
        if (total === 0) return 0;

        const probabilities = values.map(val => val / total).filter(p => p > 0);
        const entropy = -probabilities.reduce((sum, p) => sum + p * Math.log2(p), 0);

        return Math.min(entropy / Math.log2(probabilities.length), 1);
    }

    /**
     * 上下文特征分析 - 新增
     */
    analyzeContextFeatures(content) {
        // 检测时间相关内容
        const timePatterns = {
            dates: (content.match(/\d{4}[-/]\d{1,2}[-/]\d{1,2}|\d{1,2}[-/]\d{1,2}[-/]\d{4}/g) || []).length,
            times: (content.match(/\d{1,2}:\d{2}(:\d{2})?/g) || []).length,
            periods: (content.match(/今天|昨天|明天|本周|上周|下周|本月|上月|下月/g) || []).length
        };

        // 检测数值和度量
        const numericalPatterns = {
            percentages: (content.match(/\d+(\.\d+)?%/g) || []).length,
            currencies: (content.match(/[¥$€£]\s*\d+([,.]?\d+)*/g) || []).length,
            numbers: (content.match(/\d+([,.]?\d+)*/g) || []).length
        };

        // 检测引用和来源
        const referencePatterns = {
            citations: (content.match(/\[[^\]]+\]/g) || []).length,
            urls: (content.match(/https?:\/\/[^\s]+/g) || []).length,
            emails: (content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || []).length
        };

        return {
            temporal: timePatterns,
            numerical: numericalPatterns,
            references: referencePatterns,
            confidence: this.calculateContextConfidence(timePatterns, numericalPatterns, referencePatterns)
        };
    }

    /**
     * 计算上下文置信度
     */
    calculateContextConfidence(timePatterns, numericalPatterns, referencePatterns) {
        const timeScore = Object.values(timePatterns).reduce((sum, val) => sum + val, 0);
        const numScore = Object.values(numericalPatterns).reduce((sum, val) => sum + val, 0);
        const refScore = Object.values(referencePatterns).reduce((sum, val) => sum + val, 0);

        const totalScore = timeScore + numScore + refScore;
        if (totalScore === 0) return 0;

        const confidence = Math.min(totalScore * 5, 80); // 上下文分析最高80%
        return confidence;
    }

    /**
     * 综合分析结果 - 新增
     */
    synthesizeAnalysisResults(analysisResult, content) {
        const { syntaxAnalysis, semanticAnalysis, structureAnalysis, contextAnalysis } = analysisResult;

        // 权重配置
        const weights = {
            syntax: 0.35,
            semantic: 0.25,
            structure: 0.25,
            context: 0.15
        };

        // 计算加权置信度
        const weightedConfidence = Math.round(
            syntaxAnalysis.confidence * weights.syntax +
            semanticAnalysis.confidence * weights.semantic +
            structureAnalysis.confidence * weights.structure +
            contextAnalysis.confidence * weights.context
        );

        // 确定最终内容类型
        const finalType = this.determineContentType(analysisResult);

        // 生成推荐和输出格式
        const recommendations = this.generateRecommendations(analysisResult, finalType);
        const outputFormats = this.suggestOutputFormats(analysisResult, finalType);

        return {
            type: finalType,
            confidence: Math.min(weightedConfidence, 98), // 最高98%置信度
            details: this.generateDetailedAnalysis(analysisResult),
            recommendations: recommendations,
            outputFormats: outputFormats,
            analysisBreakdown: {
                syntax: syntaxAnalysis,
                semantic: semanticAnalysis,
                structure: structureAnalysis,
                context: contextAnalysis
            }
        };
    }

    /**
     * 确定最终内容类型
     */
    determineContentType(analysisResult) {
        const { syntaxAnalysis, semanticAnalysis, structureAnalysis } = analysisResult;
        const syntaxScores = syntaxAnalysis.scores;
        const distribution = structureAnalysis.distribution;

        // 基于多维度分析确定类型
        if (distribution.tableRatio > 0.4 || syntaxScores.table > 40) {
            return 'table';
        }

        if (distribution.codeRatio > 0.3 || syntaxScores.code > 30) {
            return 'code';
        }

        if (syntaxScores.conversational > 20) {
            return 'conversation';
        }

        if (distribution.listRatio > 0.5 || syntaxScores.list > 25) {
            return 'list';
        }

        if (syntaxScores.structured > 20) {
            return 'structured';
        }

        if (syntaxScores.markdown > 15 || structureAnalysis.hierarchy.sections > 2) {
            return 'markdown';
        }

        return 'article';
    }

    /**
     * 生成推荐建议
     */
    generateRecommendations(analysisResult, contentType) {
        const recommendations = [];
        const { structureAnalysis, contextAnalysis } = analysisResult;

        switch (contentType) {
            case 'table':
                recommendations.push('建议使用Excel格式以获得最佳表格展示效果');
                if (structureAnalysis.complexity === 'high') {
                    recommendations.push('内容复杂，建议同时生成Word文档作为说明');
                }
                break;

            case 'code':
                recommendations.push('建议使用Word格式以保持代码格式和语法高亮');
                recommendations.push('考虑添加技术文档模板以提升专业性');
                break;

            case 'conversation':
                recommendations.push('建议使用Word格式以清晰展示对话结构');
                recommendations.push('可考虑添加时间戳和参与者标识');
                break;

            case 'structured':
                recommendations.push('检测到结构化数据，建议保持原有格式');
                recommendations.push('可考虑转换为表格形式以提高可读性');
                break;

            default:
                recommendations.push('建议使用Word格式以获得最佳阅读体验');
                if (structureAnalysis.hierarchy.depth > 3) {
                    recommendations.push('文档层次较深，建议添加目录导航');
                }
        }

        // 基于上下文添加建议
        if (contextAnalysis.numerical.currencies > 0) {
            recommendations.push('检测到货币信息，建议使用专业商务模板');
        }

        if (contextAnalysis.temporal.dates > 3) {
            recommendations.push('包含多个日期，建议按时间顺序组织内容');
        }

        return recommendations;
    }

    /**
     * 建议输出格式
     */
    suggestOutputFormats(analysisResult, contentType) {
        const { structureAnalysis } = analysisResult;
        const formats = [];

        switch (contentType) {
            case 'table':
                formats.push({ format: 'xlsx', priority: 'primary', reason: '表格数据最适合Excel格式' });
                if (structureAnalysis.distribution.textRatio > 0.3) {
                    formats.push({ format: 'docx', priority: 'secondary', reason: '包含说明文字，Word作为补充' });
                }
                break;

            case 'code':
                formats.push({ format: 'docx', priority: 'primary', reason: '代码内容适合Word格式展示' });
                break;

            case 'conversation':
                formats.push({ format: 'docx', priority: 'primary', reason: '对话格式适合Word文档' });
                break;

            case 'structured':
                formats.push({ format: 'docx', priority: 'primary', reason: '结构化内容适合Word格式' });
                formats.push({ format: 'xlsx', priority: 'alternative', reason: '可选择Excel以表格形式展示' });
                break;

            default:
                formats.push({ format: 'docx', priority: 'primary', reason: '文档内容适合Word格式' });
                if (structureAnalysis.distribution.tableRatio > 0.2) {
                    formats.push({ format: 'xlsx', priority: 'alternative', reason: '包含表格，可选择Excel格式' });
                }
        }

        return formats;
    }

    /**
     * 生成详细分析报告
     */
    generateDetailedAnalysis(analysisResult) {
        const { syntaxAnalysis, semanticAnalysis, structureAnalysis, contextAnalysis } = analysisResult;

        const features = [];
        const patterns = [];

        // 语法特征
        if (syntaxAnalysis.patterns.markdown.tables > 0) {
            features.push(`${syntaxAnalysis.patterns.markdown.tables}个表格`);
        }
        if (syntaxAnalysis.patterns.markdown.codeBlocks > 0) {
            features.push(`${syntaxAnalysis.patterns.markdown.codeBlocks}个代码块`);
        }
        if (syntaxAnalysis.patterns.markdown.lists.total > 0) {
            features.push(`${syntaxAnalysis.patterns.markdown.lists.total}个列表项`);
        }

        // 结构特征
        if (structureAnalysis.hierarchy.sections > 0) {
            features.push(`${structureAnalysis.hierarchy.sections}个章节`);
        }

        // 上下文特征
        if (contextAnalysis.numerical.currencies > 0) {
            features.push(`${contextAnalysis.numerical.currencies}个货币值`);
        }
        if (contextAnalysis.temporal.dates > 0) {
            features.push(`${contextAnalysis.temporal.dates}个日期`);
        }

        return {
            features: features,
            patterns: patterns,
            complexity: structureAnalysis.complexity,
            confidence_factors: [
                `语法分析: ${syntaxAnalysis.confidence}%`,
                `语义分析: ${semanticAnalysis.confidence}%`,
                `结构分析: ${structureAnalysis.confidence}%`,
                `上下文分析: ${contextAnalysis.confidence}%`
            ]
        };
    }

    /**
     * 转换策略引擎 - 新增
     */
    initializeConversionStrategies() {
        this.conversionStrategies = new Map();

        // 数据密集型策略
        this.conversionStrategies.set('data-heavy', {
            name: '数据密集型',
            description: '适用于表格数据占比超过60%的内容',
            primaryFormat: 'xlsx',
            secondaryFormat: 'docx',
            template: 'data-analysis',
            options: {
                preserveFormatting: true,
                autoFitColumns: true,
                addCharts: true,
                dataValidation: true
            }
        });

        // 代码密集型策略
        this.conversionStrategies.set('code-heavy', {
            name: '代码密集型',
            description: '适用于代码内容占比超过40%的技术文档',
            primaryFormat: 'docx',
            secondaryFormat: null,
            template: 'technical',
            options: {
                syntaxHighlighting: true,
                codeFormatting: true,
                lineNumbers: true,
                technicalLayout: true
            }
        });

        // 对话记录策略
        this.conversionStrategies.set('conversational', {
            name: '对话记录型',
            description: '适用于AI对话、会议记录等对话格式内容',
            primaryFormat: 'docx',
            secondaryFormat: null,
            template: 'conversation',
            options: {
                speakerIdentification: true,
                timestampFormatting: true,
                dialogueLayout: true,
                conversationFlow: true
            }
        });

        // 混合内容策略
        this.conversionStrategies.set('mixed-content', {
            name: '混合内容型',
            description: '适用于包含多种格式的复杂文档',
            primaryFormat: 'docx',
            secondaryFormat: 'xlsx',
            template: 'comprehensive',
            options: {
                multiFormatSupport: true,
                adaptiveLayout: true,
                crossReferences: true,
                tableOfContents: true
            }
        });

        // 文本密集型策略
        this.conversionStrategies.set('text-heavy', {
            name: '文本密集型',
            description: '适用于以文本内容为主的文档',
            primaryFormat: 'docx',
            secondaryFormat: null,
            template: 'article',
            options: {
                readabilityOptimization: true,
                paragraphFormatting: true,
                headingStructure: true,
                documentFlow: true
            }
        });

        // 列表密集型策略
        this.conversionStrategies.set('list-heavy', {
            name: '列表密集型',
            description: '适用于列表项目占比较高的内容',
            primaryFormat: 'docx',
            secondaryFormat: 'xlsx',
            template: 'structured-list',
            options: {
                listFormatting: true,
                hierarchicalStructure: true,
                bulletCustomization: true,
                listToTable: true
            }
        });
    }

    /**
     * 智能策略选择
     */
    selectOptimalStrategy(analysisResult) {
        // 安全检查分析结果结构
        if (!analysisResult || !analysisResult.analysisBreakdown) {
            console.warn('分析结果结构不完整，使用默认策略');
            return {
                strategy: 'text-heavy',
                confidence: 50,
                reasons: ['分析结果不完整，使用默认策略'],
                strategyInfo: this.conversionStrategies.get('text-heavy')
            };
        }

        const { syntaxAnalysis, semanticAnalysis, structureAnalysis, contextAnalysis } = analysisResult.analysisBreakdown;

        // 安全检查各个分析组件
        if (!structureAnalysis || !structureAnalysis.distribution) {
            console.warn('结构分析数据不完整，使用默认策略');
            return {
                strategy: 'text-heavy',
                confidence: 50,
                reasons: ['结构分析数据不完整'],
                strategyInfo: this.conversionStrategies.get('text-heavy')
            };
        }

        const distribution = structureAnalysis.distribution;
        const complexity = structureAnalysis.complexity || 'medium';

        // 策略选择决策树
        let selectedStrategy = 'text-heavy'; // 默认策略
        let confidence = 0;
        let reasons = [];

        // 安全获取分析分数
        const syntaxScores = syntaxAnalysis?.scores || {};
        const tableRatio = distribution.tableRatio || 0;
        const codeRatio = distribution.codeRatio || 0;
        const listRatio = distribution.listRatio || 0;

        // 1. 数据密集型判断
        if (tableRatio > 0.6 || syntaxScores.table > 50) {
            selectedStrategy = 'data-heavy';
            confidence = Math.min(90, tableRatio * 100 + 20);
            reasons.push(`表格内容占比${Math.round(tableRatio * 100)}%`);
        }
        // 2. 代码密集型判断
        else if (codeRatio > 0.4 || syntaxScores.code > 40) {
            selectedStrategy = 'code-heavy';
            confidence = Math.min(85, codeRatio * 100 + 25);
            reasons.push(`代码内容占比${Math.round(codeRatio * 100)}%`);
        }
        // 3. 对话记录判断
        else if (syntaxScores.conversational > 25) {
            selectedStrategy = 'conversational';
            confidence = Math.min(80, syntaxScores.conversational + 30);
            reasons.push(`检测到对话格式特征`);
        }
        // 4. 列表密集型判断
        else if (listRatio > 0.5 || syntaxScores.list > 30) {
            selectedStrategy = 'list-heavy';
            confidence = Math.min(75, listRatio * 100 + 15);
            reasons.push(`列表内容占比${Math.round(listRatio * 100)}%`);
        }
        // 5. 混合内容判断
        else if (complexity === 'high' || this.isComplexMixedContent(distribution)) {
            selectedStrategy = 'mixed-content';
            confidence = 70;
            reasons.push(`内容复杂度为${complexity}`);
        }

        // 6. 基于语义分析调整策略
        if (semanticAnalysis && semanticAnalysis.businessTypes) {
            const businessType = this.getDominantBusinessType(semanticAnalysis.businessTypes);
            if (businessType) {
                const adjustment = this.adjustStrategyByBusinessType(selectedStrategy, businessType);
                if (adjustment.changed) {
                    selectedStrategy = adjustment.strategy;
                    confidence = Math.min(confidence + 10, 95);
                    reasons.push(`业务类型：${businessType}`);
                }
            }
        }

        return {
            strategy: selectedStrategy,
            confidence: confidence,
            reasons: reasons,
            strategyInfo: this.conversionStrategies.get(selectedStrategy)
        };
    }

    /**
     * 判断是否为复杂混合内容
     */
    isComplexMixedContent(distribution) {
        const nonZeroTypes = Object.values(distribution).filter(ratio => ratio > 0.1).length;
        const maxRatio = Math.max(...Object.values(distribution));

        // 如果有3种以上内容类型且没有明显主导类型
        return nonZeroTypes >= 3 && maxRatio < 0.6;
    }

    /**
     * 获取主导业务类型
     */
    getDominantBusinessType(businessTypes) {
        const maxScore = Math.max(...Object.values(businessTypes));
        if (maxScore < 5) return null; // 分数太低，不明确

        return Object.keys(businessTypes).find(type => businessTypes[type] === maxScore);
    }

    /**
     * 根据业务类型调整策略
     */
    adjustStrategyByBusinessType(currentStrategy, businessType) {
        const adjustments = {
            'technical': {
                'text-heavy': 'code-heavy',
                'mixed-content': 'code-heavy'
            },
            'data': {
                'text-heavy': 'data-heavy',
                'mixed-content': 'data-heavy'
            },
            'meeting': {
                'text-heavy': 'conversational',
                'mixed-content': 'conversational'
            }
        };

        const adjustment = adjustments[businessType];
        if (adjustment && adjustment[currentStrategy]) {
            return {
                changed: true,
                strategy: adjustment[currentStrategy]
            };
        }

        return { changed: false, strategy: currentStrategy };
    }

    /**
     * 初始化格式推荐系统 - 新增
     */
    initializeFormatRecommendationSystem() {
        this.formatRecommendations = {
            // 格式适配矩阵
            adaptationMatrix: {
                'table': {
                    primary: { format: 'xlsx', confidence: 95, reason: '表格数据最适合Excel格式展示和计算' },
                    secondary: { format: 'docx', confidence: 75, reason: 'Word可以展示表格但功能有限' },
                    alternative: { format: 'both', confidence: 90, reason: '同时生成Excel和Word满足不同需求' }
                },
                'code': {
                    primary: { format: 'docx', confidence: 90, reason: '代码内容适合Word格式的语法高亮和格式化' },
                    secondary: { format: 'xlsx', confidence: 30, reason: 'Excel不适合代码内容展示' },
                    alternative: { format: 'docx', confidence: 90, reason: 'Word是代码文档的最佳选择' }
                },
                'conversation': {
                    primary: { format: 'docx', confidence: 85, reason: '对话格式适合Word的文档流和格式化' },
                    secondary: { format: 'xlsx', confidence: 40, reason: 'Excel可以表格化展示但不够自然' },
                    alternative: { format: 'docx', confidence: 85, reason: 'Word最适合对话记录的阅读体验' }
                },
                'list': {
                    primary: { format: 'docx', confidence: 80, reason: '列表内容适合Word的列表格式和层次结构' },
                    secondary: { format: 'xlsx', confidence: 70, reason: 'Excel可以将列表转换为结构化数据' },
                    alternative: { format: 'both', confidence: 85, reason: '提供文档和数据两种视图' }
                },
                'structured': {
                    primary: { format: 'both', confidence: 88, reason: '结构化数据适合多格式展示' },
                    secondary: { format: 'xlsx', confidence: 82, reason: 'Excel适合结构化数据的分析和处理' },
                    alternative: { format: 'docx', confidence: 75, reason: 'Word适合结构化数据的文档化展示' }
                },
                'markdown': {
                    primary: { format: 'docx', confidence: 85, reason: 'Markdown内容最适合转换为Word文档' },
                    secondary: { format: 'xlsx', confidence: 50, reason: 'Excel仅适合其中的表格部分' },
                    alternative: { format: 'both', confidence: 80, reason: '复杂Markdown可能需要多格式支持' }
                },
                'article': {
                    primary: { format: 'docx', confidence: 95, reason: '文章内容最适合Word的文档格式和排版' },
                    secondary: { format: 'xlsx', confidence: 25, reason: 'Excel不适合长文本内容' },
                    alternative: { format: 'docx', confidence: 95, reason: 'Word是文章的最佳载体' }
                }
            },

            // 模板推荐规则
            templateRecommendations: {
                'technical': 'technical',
                'data': 'data-analysis',
                'meeting': 'conversation',
                'academic': 'academic',
                'report': 'professional',
                'proposal': 'professional',
                'documentation': 'simple'
            }
        };
    }

    /**
     * 生成智能格式推荐
     */
    generateFormatRecommendations(analysisResult) {
        const contentType = analysisResult.type;
        const matrix = this.formatRecommendations.adaptationMatrix[contentType];

        if (!matrix) {
            // 默认推荐
            return {
                primary: { format: 'docx', confidence: 70, reason: '通用文档格式，适合大多数内容' },
                secondary: { format: 'xlsx', confidence: 40, reason: '备选表格格式' },
                alternative: { format: 'both', confidence: 60, reason: '提供多种格式选择' }
            };
        }

        // 基于内容特征调整推荐
        const adjustedRecommendations = this.adjustRecommendationsByFeatures(matrix, analysisResult);

        return adjustedRecommendations;
    }

    /**
     * 根据内容特征调整推荐
     */
    adjustRecommendationsByFeatures(baseMatrix, analysisResult) {
        // 安全检查分析结果
        if (!analysisResult || !analysisResult.analysisBreakdown) {
            return baseMatrix;
        }

        const { structureAnalysis, contextAnalysis } = analysisResult.analysisBreakdown;

        if (!structureAnalysis || !structureAnalysis.distribution) {
            return baseMatrix;
        }

        const distribution = structureAnalysis.distribution;

        let adjusted = JSON.parse(JSON.stringify(baseMatrix)); // 深拷贝

        // 基于表格占比调整
        if (distribution.tableRatio > 0.5) {
            adjusted.primary.confidence = Math.min(adjusted.primary.confidence + 10, 98);
            if (adjusted.primary.format !== 'xlsx') {
                adjusted.alternative = {
                    format: 'xlsx',
                    confidence: 90,
                    reason: '高表格占比建议使用Excel格式'
                };
            }
        }

        // 基于代码占比调整
        if (distribution.codeRatio > 0.3) {
            if (adjusted.primary.format !== 'docx') {
                adjusted.primary = {
                    format: 'docx',
                    confidence: 92,
                    reason: '高代码占比最适合Word格式的代码展示'
                };
            }
        }

        // 基于复杂度调整
        if (structureAnalysis.complexity === 'high') {
            adjusted.alternative = {
                format: 'both',
                confidence: Math.min(adjusted.alternative.confidence + 15, 95),
                reason: '复杂内容建议生成多种格式以满足不同需求'
            };
        }

        // 基于数值内容调整
        if (contextAnalysis.numerical.currencies > 3 || contextAnalysis.numerical.percentages > 5) {
            if (adjusted.primary.format !== 'xlsx') {
                adjusted.secondary = {
                    format: 'xlsx',
                    confidence: 85,
                    reason: '包含大量数值数据，Excel格式便于计算和分析'
                };
            }
        }

        return adjusted;
    }

    /**
     * 生成模板推荐
     */
    generateTemplateRecommendation(analysisResult) {
        // 安全检查分析结果
        if (!analysisResult || !analysisResult.analysisBreakdown || !analysisResult.analysisBreakdown.semanticAnalysis) {
            return {
                template: 'professional',
                confidence: 50,
                reason: '分析数据不完整，使用默认专业模板'
            };
        }

        const { semanticAnalysis } = analysisResult.analysisBreakdown;
        const businessTypes = semanticAnalysis.businessTypes || {};

        // 找到最高分的业务类型
        const dominantType = Object.keys(businessTypes).reduce((a, b) =>
            businessTypes[a] > businessTypes[b] ? a : b
        );

        const recommendedTemplate = this.formatRecommendations.templateRecommendations[dominantType];

        return {
            template: recommendedTemplate || 'professional',
            confidence: businessTypes[dominantType] > 10 ? 85 : 60,
            reason: `基于${dominantType}业务类型的最佳模板选择`
        };
    }

    /**
     * 处理转换 - 智能策略版
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

            // 1. 智能内容分析
            this.showMessage('🧠 正在智能分析内容...', 'info');
            const analysisResult = this.intelligentContentDetection(this.currentContent);

            // 2. 策略选择
            const strategyResult = this.selectOptimalStrategy(analysisResult);

            // 3. 显示策略选择结果
            this.showMessage(`🎯 已选择${strategyResult.strategyInfo.name}策略 (${strategyResult.confidence}%置信度)`, 'info');

            // 4. 获取用户设置
            const outputFormat = document.getElementById('output-format')?.value || 'docx';
            const templateStyle = document.getElementById('template-style')?.value || 'professional';
            const fileName = document.getElementById('file-name')?.value ||
                           Utils.string.generateFileName(this.currentContent, outputFormat);

            // 5. 生成格式推荐
            const formatRecommendations = this.generateFormatRecommendations(analysisResult);
            const templateRecommendation = this.generateTemplateRecommendation(analysisResult);

            // 6. 应用智能策略和推荐
            const conversionPlan = this.createConversionPlan(strategyResult, outputFormat, templateStyle, fileName, formatRecommendations, templateRecommendation);

            // 7. 显示智能预览
            this.showIntelligentPreview(conversionPlan, analysisResult, formatRecommendations);

            // 8. 显示转换计划
            this.showMessage(`📋 转换计划：${conversionPlan.description}`, 'info');

            // 9. 执行转换
            await this.executeConversionPlan(conversionPlan, analysisResult);

            // 8. 完成提示
            this.showMessage('✅ 智能转换完成！文件已开始下载', 'success');
            this.updateUsageStats();

        } catch (error) {
            this.logger.error('智能转换失败: ' + error.message);
            this.showMessage('❌ 转换失败：' + error.message, 'error');
        } finally {
            this.isProcessing = false;
            this.showLoading(false);
        }
    }

    /**
     * 创建转换计划 - 增强版
     */
    createConversionPlan(strategyResult, userFormat, templateStyle, fileName, formatRecommendations, templateRecommendation) {
        const strategy = strategyResult.strategyInfo;

        // 智能格式选择 - 结合推荐系统
        let finalFormat = userFormat;
        let formatReason = '用户选择';

        // 如果用户选择了auto或者推荐置信度很高，使用推荐格式
        if (userFormat === 'auto' || formatRecommendations.primary.confidence > 90) {
            finalFormat = formatRecommendations.primary.format;
            formatReason = formatRecommendations.primary.reason;
        }

        // 智能模板选择 - 结合推荐系统
        let finalTemplate = templateStyle;
        let templateReason = '用户选择';

        if (templateStyle === 'auto' || templateRecommendation.confidence > 80) {
            finalTemplate = templateRecommendation.template;
            templateReason = templateRecommendation.reason;
        }

        return {
            strategy: strategyResult.strategy,
            confidence: strategyResult.confidence,
            reasons: strategyResult.reasons,
            format: finalFormat,
            formatReason: formatReason,
            template: finalTemplate,
            templateReason: templateReason,
            fileName: fileName,
            options: strategy.options,
            recommendations: {
                format: formatRecommendations,
                template: templateRecommendation
            },
            description: this.generateConversionDescription(strategy, finalFormat, finalTemplate)
        };
    }

    /**
     * 生成转换描述
     */
    generateConversionDescription(strategy, format, template) {
        const formatNames = {
            'docx': 'Word文档',
            'xlsx': 'Excel表格',
            'both': 'Word和Excel'
        };

        const templateNames = {
            'professional': '专业商务',
            'academic': '学术论文',
            'simple': '简洁清爽',
            'colorful': '彩色活泼',
            'technical': '技术文档',
            'data-analysis': '数据分析',
            'conversation': '对话记录',
            'comprehensive': '综合文档',
            'article': '文章报告',
            'structured-list': '结构化列表'
        };

        return `使用${strategy.name}策略生成${formatNames[format] || format}，应用${templateNames[template] || template}模板`;
    }

    /**
     * 执行转换计划
     */
    async executeConversionPlan(plan, analysisResult) {
        const { format, template, fileName, options } = plan;

        // 根据策略应用特殊选项
        this.applyStrategyOptions(options);

        if (format === 'docx' || format === 'both') {
            await this.generateWordWithStrategy(this.currentContent, plan, analysisResult, fileName);
        }

        if (format === 'xlsx' || format === 'both') {
            await this.generateExcelWithStrategy(this.currentContent, plan, analysisResult, fileName);
        }
    }

    /**
     * 应用策略选项
     */
    applyStrategyOptions(options) {
        // 将策略选项应用到转换器配置
        this.strategyOptions = options || {};

        // 更新Word样式配置
        if (options.technicalLayout) {
            this.wordStyles.fonts.code = 'Consolas';
            this.wordStyles.fontSizes.code = 9;
        }

        if (options.readabilityOptimization) {
            this.wordStyles.lineSpacing.normal = 1.15;
            this.wordStyles.spacing.paragraphAfter = 6;
        }

        if (options.dialogueLayout) {
            this.wordStyles.spacing.paragraphBefore = 4;
            this.wordStyles.spacing.paragraphAfter = 4;
        }
    }

    /**
     * 使用策略生成Word文档
     */
    async generateWordWithStrategy(content, plan, analysisResult, fileName) {
        // 使用现有的generateWord方法，但应用策略选项
        const contentType = analysisResult.type;
        await this.generateWord(content, contentType, fileName);
    }

    /**
     * 使用策略生成Excel文档
     */
    async generateExcelWithStrategy(content, plan, analysisResult, fileName) {
        // 使用现有的generateExcel方法，但应用策略选项
        const contentType = analysisResult.type;
        await this.generateExcel(content, contentType, fileName);
    }

    /**
     * 显示智能预览 - 新增
     */
    showIntelligentPreview(conversionPlan, analysisResult, formatRecommendations) {
        // 更新检测结果显示
        this.updateDetectionResultDisplay(analysisResult);

        // 显示策略信息
        this.displayStrategyInfo(conversionPlan);

        // 显示格式推荐
        this.displayFormatRecommendations(formatRecommendations);

        // 显示转换预览
        this.displayConversionPreview(conversionPlan, analysisResult);
    }

    /**
     * 显示策略信息
     */
    displayStrategyInfo(conversionPlan) {
        const detectionPanel = document.getElementById('detection-panel');
        if (detectionPanel) {
            // 添加策略信息到检测面板
            let strategyInfo = detectionPanel.querySelector('.strategy-info');
            if (!strategyInfo) {
                strategyInfo = document.createElement('div');
                strategyInfo.className = 'strategy-info';
                detectionPanel.appendChild(strategyInfo);
            }

            strategyInfo.innerHTML = `
                <div class="strategy-header">
                    <span class="strategy-icon">🎯</span>
                    <span class="strategy-name">${conversionPlan.strategy}</span>
                    <span class="strategy-confidence">${conversionPlan.confidence}%</span>
                </div>
                <div class="strategy-reasons">
                    ${conversionPlan.reasons.map(reason => `<span class="reason-tag">${reason}</span>`).join('')}
                </div>
            `;
        }
    }

    /**
     * 显示格式推荐
     */
    displayFormatRecommendations(recommendations) {
        const optionsSection = document.querySelector('.options-grid');
        if (optionsSection) {
            // 添加推荐信息到选项区域
            let recommendationPanel = optionsSection.querySelector('.recommendation-panel');
            if (!recommendationPanel) {
                recommendationPanel = document.createElement('div');
                recommendationPanel.className = 'recommendation-panel';
                optionsSection.appendChild(recommendationPanel);
            }

            recommendationPanel.innerHTML = `
                <div class="recommendation-header">
                    <span class="rec-icon">💡</span>
                    <span class="rec-title">智能推荐</span>
                </div>
                <div class="recommendation-items">
                    <div class="rec-item primary">
                        <span class="rec-badge">推荐</span>
                        <span class="rec-format">${this.getFormatDisplayName(recommendations.primary.format)}</span>
                        <span class="rec-confidence">${recommendations.primary.confidence}%</span>
                        <div class="rec-reason">${recommendations.primary.reason}</div>
                    </div>
                    ${recommendations.secondary ? `
                    <div class="rec-item secondary">
                        <span class="rec-badge">备选</span>
                        <span class="rec-format">${this.getFormatDisplayName(recommendations.secondary.format)}</span>
                        <span class="rec-confidence">${recommendations.secondary.confidence}%</span>
                        <div class="rec-reason">${recommendations.secondary.reason}</div>
                    </div>
                    ` : ''}
                </div>
            `;
        }
    }

    /**
     * 显示转换预览
     */
    displayConversionPreview(conversionPlan, analysisResult) {
        // 在预览区域显示转换效果预览
        const previewArea = document.querySelector('.preview-area');
        if (previewArea) {
            const previewContent = this.generatePreviewContent(conversionPlan, analysisResult);
            previewArea.innerHTML = previewContent;
        }
    }

    /**
     * 生成预览内容
     */
    generatePreviewContent(conversionPlan, analysisResult) {
        const { format, template, strategy } = conversionPlan;
        const { details } = analysisResult;

        return `
            <div class="preview-header">
                <h3>📋 转换预览</h3>
                <div class="preview-meta">
                    <span class="meta-item">格式: ${this.getFormatDisplayName(format)}</span>
                    <span class="meta-item">模板: ${template}</span>
                    <span class="meta-item">策略: ${strategy}</span>
                </div>
            </div>
            <div class="preview-content">
                <div class="preview-stats">
                    <div class="stat-group">
                        ${details.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                </div>
                <div class="preview-description">
                    <p>${conversionPlan.description}</p>
                    <p class="preview-note">
                        <strong>预期效果：</strong>
                        ${this.generatePreviewDescription(format, template, details.features)}
                    </p>
                </div>
            </div>
        `;
    }

    /**
     * 生成预览描述
     */
    generatePreviewDescription(format, template, features) {
        const descriptions = [];

        if (format === 'docx') {
            descriptions.push('生成专业的Word文档');
            if (features.includes('表格')) descriptions.push('表格将使用Word原生表格格式');
            if (features.includes('代码块')) descriptions.push('代码将保持语法高亮和格式');
            if (features.includes('列表项')) descriptions.push('列表将使用Word标准列表样式');
        } else if (format === 'xlsx') {
            descriptions.push('生成Excel电子表格');
            if (features.includes('表格')) descriptions.push('表格数据将优化为Excel格式');
            if (features.includes('货币值')) descriptions.push('货币数据将应用Excel货币格式');
        } else if (format === 'both') {
            descriptions.push('同时生成Word文档和Excel表格');
            descriptions.push('提供文档阅读和数据分析两种视图');
        }

        return descriptions.join('，') + '。';
    }

    /**
     * 获取格式显示名称
     */
    getFormatDisplayName(format) {
        const names = {
            'docx': 'Word文档',
            'xlsx': 'Excel表格',
            'both': 'Word+Excel',
            'auto': '智能选择'
        };
        return names[format] || format;
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

            // 添加文档标题 - 使用Word标准样式
            children.push(new Paragraph({
                children: [new TextRun({
                    text: fileName.replace(/\.[^/.]+$/, ""),
                    font: {
                        name: this.wordStyles.fonts.chinese,
                        eastAsia: this.wordStyles.fonts.chinese
                    },
                    size: this.wordStyles.fontSizes.title * 2, // docx.js使用半磅单位
                    bold: true,
                    color: this.wordStyles.colors.heading
                })],
                heading: HeadingLevel.TITLE,
                spacing: {
                    before: this.wordStyles.spacing.titleBefore * 20,
                    after: this.wordStyles.spacing.titleAfter * 20
                },
                alignment: AlignmentType.CENTER
            }));

            // 添加生成时间 - 使用Word标准格式
            children.push(new Paragraph({
                children: [new TextRun({
                    text: `生成时间: ${new Date().toLocaleString('zh-CN')}`,
                    font: {
                        name: this.wordStyles.fonts.chinese,
                        eastAsia: this.wordStyles.fonts.chinese
                    },
                    size: this.wordStyles.fontSizes.small * 2,
                    color: this.wordStyles.colors.quote
                })],
                spacing: { after: this.wordStyles.spacing.paragraphAfter * 20 * 3 },
                alignment: AlignmentType.CENTER
            }));

            // 使用智能检测结果选择转换策略
            const detectionResult = this.intelligentContentDetection(cleanedContent);
            console.log('🤖 智能检测结果:', detectionResult);

            if (detectionResult.type === 'markdown' || this.containsMarkdownElements(cleanedContent)) {
                // Markdown内容处理
                const elements = markdownParser.parseMarkdown(cleanedContent);
                const cleanedElements = this.postProcessElements(elements);
                children.push(...this.convertElementsToWord(cleanedElements));
            } else if (detectionResult.type === 'table') {
                // 表格数据专门处理
                const tableElements = this.parseTableContent(cleanedContent);
                const cleanedElements = this.postProcessElements(tableElements);
                children.push(...this.convertElementsToWord(cleanedElements));
            } else if (detectionResult.type === 'list') {
                // 列表内容专门处理
                const listElements = this.parseListContent(cleanedContent);
                const cleanedElements = this.postProcessElements(listElements);
                children.push(...this.convertElementsToWord(cleanedElements));
            } else if (detectionResult.type === 'code') {
                // 代码内容专门处理
                const codeElements = this.parseCodeContent(cleanedContent);
                const cleanedElements = this.postProcessElements(codeElements);
                children.push(...this.convertElementsToWord(cleanedElements));
            } else {
                // 智能文本处理
                const processedElements = this.parseTextContent(cleanedContent);
                const cleanedElements = this.postProcessElements(processedElements);
                children.push(...this.convertElementsToWord(cleanedElements));
            }

            // 创建Word文档 - 使用标准设置
            const doc = new Document({
                creator: "AI内容格式转换工具 v1.1.1",
                title: fileName.replace(/\.[^/.]+$/, ""),
                description: "由AI内容格式转换工具生成 - 支持ChatGPT、Claude、DeepSeek等AI内容",
                subject: "AI内容转换文档",
                keywords: ["AI", "转换", "Word", "文档"],

                // 设置默认字体 - 符合Word中文环境
                defaultTabStop: convertInchesToTwip(0.5),

                sections: [{
                    properties: {
                        page: {
                            // Word标准页面设置 - A4纸张，标准页边距
                            size: {
                                orientation: "portrait",
                                width: convertInchesToTwip(8.27),   // A4宽度
                                height: convertInchesToTwip(11.69)  // A4高度
                            },
                            margin: {
                                top: convertInchesToTwip(1),        // 上边距1英寸
                                right: convertInchesToTwip(1),      // 右边距1英寸
                                bottom: convertInchesToTwip(1),     // 下边距1英寸
                                left: convertInchesToTwip(1)        // 左边距1英寸
                            }
                        }
                    },
                    children: children
                }],

                // 设置文档样式 - Word标准样式
                styles: {
                    default: {
                        document: {
                            run: {
                                font: {
                                    name: this.wordStyles.fonts.chinese,
                                    eastAsia: this.wordStyles.fonts.chinese
                                },
                                size: this.wordStyles.fontSizes.normal * 2,
                                color: this.wordStyles.colors.text
                            },
                            paragraph: {
                                spacing: {
                                    line: Math.round(this.wordStyles.lineSpacing.normal * 240),
                                    after: this.wordStyles.spacing.paragraphAfter * 20
                                }
                            }
                        }
                    }
                }
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
                    // 使用Word标准标题样式
                    const headingFontSize = this.getHeadingFontSize(element.level);
                    const headingSpacing = this.getHeadingSpacing(element.level);

                    wordElements.push(new Paragraph({
                        children: [new TextRun({
                            text: this.deepCleanMarkdownText(element.text),
                            font: {
                                name: this.wordStyles.fonts.chinese,
                                eastAsia: this.wordStyles.fonts.chinese
                            },
                            size: headingFontSize * 2, // docx.js使用半磅单位
                            bold: true,
                            color: this.wordStyles.colors.heading
                        })],
                        heading: HeadingLevel[`HEADING_${element.level}`],
                        spacing: {
                            before: headingSpacing.before * 20,
                            after: headingSpacing.after * 20,
                            line: Math.round(this.wordStyles.lineSpacing.heading * 240)
                        }
                    }));
                    break;

                case 'paragraph':
                    // 使用Word标准正文样式
                    wordElements.push(new Paragraph({
                        children: this.convertInlineToWord(element.formatted || [{ type: 'text', text: element.text || '' }]),
                        spacing: {
                            after: this.wordStyles.spacing.paragraphAfter * 20,
                            line: Math.round(this.wordStyles.lineSpacing.normal * 240)
                        }
                    }));
                    break;

                case 'table':
                    wordElements.push(this.createWordTable(element));
                    break;

                case 'list':
                    // 使用Word标准无序列表样式
                    element.items.forEach(item => {
                        wordElements.push(new Paragraph({
                            children: [
                                new TextRun({
                                    text: `• ${this.deepCleanMarkdownText(item.text)}`,
                                    font: {
                                        name: this.wordStyles.fonts.chinese,
                                        eastAsia: this.wordStyles.fonts.chinese
                                    },
                                    size: this.wordStyles.fontSizes.normal * 2
                                })
                            ],
                            spacing: {
                                after: this.wordStyles.spacing.listAfter * 20,
                                line: Math.round(this.wordStyles.lineSpacing.normal * 240)
                            },
                            indent: { left: convertInchesToTwip(0.25) }
                        }));
                    });
                    break;

                case 'orderedList':
                    // 使用Word标准有序列表样式
                    element.items.forEach((item, index) => {
                        wordElements.push(new Paragraph({
                            children: [
                                new TextRun({
                                    text: `${index + 1}. ${this.deepCleanMarkdownText(item.text)}`,
                                    font: {
                                        name: this.wordStyles.fonts.chinese,
                                        eastAsia: this.wordStyles.fonts.chinese
                                    },
                                    size: this.wordStyles.fontSizes.normal * 2
                                })
                            ],
                            spacing: {
                                after: this.wordStyles.spacing.listAfter * 20,
                                line: Math.round(this.wordStyles.lineSpacing.normal * 240)
                            },
                            indent: { left: convertInchesToTwip(0.25) }
                        }));
                    });
                    break;

                case 'codeBlock':
                    // 使用Word标准代码样式 - 优化版
                    const codeLines = element.content.split('\n');
                    codeLines.forEach((line, index) => {
                        wordElements.push(new Paragraph({
                            children: [new TextRun({
                                text: line || ' ', // 空行用空格占位
                                font: {
                                    name: this.wordStyles.fonts.code
                                },
                                size: this.wordStyles.fontSizes.code * 2,
                                color: this.wordStyles.colors.code
                            })],
                            shading: { fill: this.wordStyles.colors.codeBg },
                            spacing: {
                                before: index === 0 ? this.wordStyles.spacing.codeBlockBefore * 20 : 0,
                                after: index === codeLines.length - 1 ? this.wordStyles.spacing.codeBlockAfter * 20 : 0,
                                line: Math.round(this.wordStyles.lineSpacing.code * 240)
                            },
                            border: index === 0 ? {
                                top: { style: BorderStyle.SINGLE, size: 2, color: this.wordStyles.colors.border },
                                left: { style: BorderStyle.SINGLE, size: 2, color: this.wordStyles.colors.border },
                                right: { style: BorderStyle.SINGLE, size: 2, color: this.wordStyles.colors.border }
                            } : index === codeLines.length - 1 ? {
                                bottom: { style: BorderStyle.SINGLE, size: 2, color: this.wordStyles.colors.border },
                                left: { style: BorderStyle.SINGLE, size: 2, color: this.wordStyles.colors.border },
                                right: { style: BorderStyle.SINGLE, size: 2, color: this.wordStyles.colors.border }
                            } : {
                                left: { style: BorderStyle.SINGLE, size: 2, color: this.wordStyles.colors.border },
                                right: { style: BorderStyle.SINGLE, size: 2, color: this.wordStyles.colors.border }
                            },
                            indent: { left: convertInchesToTwip(0.25) }
                        }));
                    });
                    break;

                case 'blockquote':
                    // 使用Word标准引用样式 - 优化版
                    wordElements.push(new Paragraph({
                        children: [
                            new TextRun({
                                text: '"',
                                font: {
                                    name: this.wordStyles.fonts.chinese,
                                    eastAsia: this.wordStyles.fonts.chinese
                                },
                                size: (this.wordStyles.fontSizes.normal + 2) * 2,
                                bold: true,
                                color: this.wordStyles.colors.primary
                            }),
                            new TextRun({
                                text: this.deepCleanMarkdownText(element.content),
                                font: {
                                    name: this.wordStyles.fonts.chinese,
                                    eastAsia: this.wordStyles.fonts.chinese
                                },
                                size: this.wordStyles.fontSizes.normal * 2,
                                italics: true,
                                color: this.wordStyles.colors.quote
                            }),
                            new TextRun({
                                text: '"',
                                font: {
                                    name: this.wordStyles.fonts.chinese,
                                    eastAsia: this.wordStyles.fonts.chinese
                                },
                                size: (this.wordStyles.fontSizes.normal + 2) * 2,
                                bold: true,
                                color: this.wordStyles.colors.primary
                            })
                        ],
                        spacing: {
                            before: this.wordStyles.spacing.paragraphAfter * 20,
                            after: this.wordStyles.spacing.paragraphAfter * 20,
                            line: Math.round(this.wordStyles.lineSpacing.normal * 240)
                        },
                        indent: {
                            left: convertInchesToTwip(0.5),
                            right: convertInchesToTwip(0.25)
                        },
                        shading: { fill: this.wordStyles.colors.quoteBg },
                        border: {
                            left: {
                                style: BorderStyle.SINGLE,
                                size: 8,
                                color: this.wordStyles.colors.primary
                            }
                        }
                    }));
                    break;

                default:
                    // 处理未知类型，作为普通段落 - 使用Word标准样式
                    if (element.text) {
                        wordElements.push(new Paragraph({
                            children: [new TextRun({
                                text: element.text,
                                font: {
                                    name: this.wordStyles.fonts.chinese,
                                    eastAsia: this.wordStyles.fonts.chinese
                                },
                                size: this.wordStyles.fontSizes.normal * 2,
                                color: this.wordStyles.colors.text
                            })],
                            spacing: {
                                after: this.wordStyles.spacing.paragraphAfter * 20,
                                line: Math.round(this.wordStyles.lineSpacing.normal * 240)
                            }
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

        // 创建表头 - 使用Word标准表格样式
        if (tableElement.headers && tableElement.headers.length > 0) {
            const headerCells = tableElement.headers.map(header =>
                new TableCell({
                    children: [new Paragraph({
                        children: [new TextRun({
                            text: this.deepCleanMarkdownText(header),
                            font: {
                                name: this.wordStyles.fonts.chinese,
                                eastAsia: this.wordStyles.fonts.chinese
                            },
                            size: this.wordStyles.fontSizes.normal * 2,
                            bold: true,
                            color: this.wordStyles.colors.tableHeader
                        })],
                        alignment: AlignmentType.CENTER,
                        spacing: {
                            line: Math.round(this.wordStyles.lineSpacing.normal * 240)
                        }
                    })],
                    shading: { fill: this.wordStyles.colors.tableHeaderBg },
                    margins: {
                        top: convertInchesToTwip(0.08),    // Word标准单元格内边距
                        bottom: convertInchesToTwip(0.08),
                        left: convertInchesToTwip(0.08),
                        right: convertInchesToTwip(0.08)
                    }
                })
            );
            rows.push(new TableRow({ children: headerCells }));
        }

        // 创建数据行 - 使用Word标准样式
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
                                font: {
                                    name: this.wordStyles.fonts.chinese,
                                    eastAsia: this.wordStyles.fonts.chinese
                                },
                                size: this.wordStyles.fontSizes.normal * 2,
                                color: isNumeric ? "0066CC" : this.wordStyles.colors.text
                            })],
                            alignment: isNumeric ? AlignmentType.RIGHT : AlignmentType.LEFT,
                            spacing: {
                                line: Math.round(this.wordStyles.lineSpacing.normal * 240)
                            }
                        })],
                        shading: {
                            fill: rowIndex % 2 === 0 ? "F8F9FA" : "FFFFFF"
                        },
                        margins: {
                            top: convertInchesToTwip(0.08),     // Word标准单元格内边距
                            bottom: convertInchesToTwip(0.08),
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
            // Word标准表格边框样式 - 优化版
            borders: {
                top: {
                    style: BorderStyle.SINGLE,
                    size: 6,  // 稍微加粗边框以提高可读性
                    color: this.wordStyles.colors.border
                },
                bottom: {
                    style: BorderStyle.SINGLE,
                    size: 6,
                    color: this.wordStyles.colors.border
                },
                left: {
                    style: BorderStyle.SINGLE,
                    size: 6,
                    color: this.wordStyles.colors.border
                },
                right: {
                    style: BorderStyle.SINGLE,
                    size: 6,
                    color: this.wordStyles.colors.border
                },
                insideHorizontal: {
                    style: BorderStyle.SINGLE,
                    size: 4,  // 内部边框稍细
                    color: this.wordStyles.colors.border
                },
                insideVertical: {
                    style: BorderStyle.SINGLE,
                    size: 4,  // 内部边框稍细
                    color: this.wordStyles.colors.border
                }
            },
            margins: {
                top: convertInchesToTwip(this.wordStyles.spacing.tableBefore / 20),
                bottom: convertInchesToTwip(this.wordStyles.spacing.tableAfter / 20)
            },
            // 添加表格样式
            style: "TableGrid",
            layout: "autofit"
        });
    }

    /**
     * 格式化单元格数据 - 增强版
     */
    formatCellData(cellData) {
        if (!cellData) return '';

        let text = cellData.toString().trim();

        // 深度清理单元格内容，移除所有Markdown标记
        text = this.deepCleanMarkdownText(text);

        // 处理货币格式
        if (text.match(/^[¥$€£]\s*\d+([,.]?\d+)*$/)) {
            // 标准化货币格式，确保符号和数字之间没有空格
            return text.replace(/([¥$€£])\s+/, '$1');
        }

        // 处理百分比
        if (text.match(/^[+-]?\d+(\.\d+)?%$/)) {
            return text;
        }

        // 处理带货币符号的复杂格式
        const currencyMatch = text.match(/^([¥$€£])\s*([0-9,]+\.?\d*)$/);
        if (currencyMatch) {
            const symbol = currencyMatch[1];
            const number = currencyMatch[2];
            return `${symbol}${number}`;
        }

        // 处理数字（添加千分位分隔符）
        if (text.match(/^\d+(\.\d+)?$/)) {
            const num = parseFloat(text);
            return num.toLocaleString('zh-CN');
        }

        // 处理emoji和特殊符号
        if (text.match(/^[✅⚠️❌🔴🟢🟡]+/)) {
            return text; // 保留状态符号
        }

        return text;
    }

    /**
     * 清理单元格文本
     */
    cleanCellText(text) {
        if (!text) return '';

        let cleaned = text;

        // 清理多余的空格
        cleaned = cleaned.replace(/\s+/g, ' ');

        // 清理特殊字符
        cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, ''); // 零宽字符

        // 清理HTML实体
        cleaned = cleaned.replace(/&nbsp;/g, ' ');
        cleaned = cleaned.replace(/&amp;/g, '&');
        cleaned = cleaned.replace(/&lt;/g, '<');
        cleaned = cleaned.replace(/&gt;/g, '>');
        cleaned = cleaned.replace(/&quot;/g, '"');

        // 标准化引号
        cleaned = cleaned.replace(/[""]/g, '"');
        cleaned = cleaned.replace(/['']/g, "'");

        // 清理多余的标点符号
        cleaned = cleaned.replace(/\.{3,}/g, '...');

        return cleaned.trim();
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
     * 转换行内格式为Word - 使用Word标准样式
     */
    convertInlineToWord(formatted) {
        const { TextRun } = docx;

        if (!formatted || !Array.isArray(formatted)) {
            return [new TextRun({
                text: '',
                font: {
                    name: this.wordStyles.fonts.chinese,
                    eastAsia: this.wordStyles.fonts.chinese
                },
                size: this.wordStyles.fontSizes.normal * 2
            })];
        }

        return formatted.map(part => {
            // 彻底清理文本中的Markdown符号
            const cleanText = this.deepCleanMarkdownText(part.text || '');

            const options = {
                text: cleanText,
                font: {
                    name: this.wordStyles.fonts.chinese,
                    eastAsia: this.wordStyles.fonts.chinese
                },
                size: this.wordStyles.fontSizes.normal * 2,
                color: this.wordStyles.colors.text
            };

            switch (part.type) {
                case 'bold':
                    options.bold = true;
                    break;
                case 'italic':
                    options.italics = true;
                    break;
                case 'code':
                    options.font = {
                        name: this.wordStyles.fonts.code
                    };
                    options.shading = { fill: this.wordStyles.colors.codeBg };
                    options.size = this.wordStyles.fontSizes.code * 2;
                    options.color = this.wordStyles.colors.code;
                    break;
                case 'link':
                    options.color = "0066CC";
                    options.underline = {};
                    break;
                default:
                    // 普通文本使用默认样式
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
     * 预处理AI内容，支持多源格式 - 增强版
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
        cleaned = cleaned.replace(/&apos;/g, "'");
        cleaned = cleaned.replace(/&#39;/g, "'");
        cleaned = cleaned.replace(/&#34;/g, '"');

        // 3. 标准化换行符
        cleaned = cleaned.replace(/\r\n/g, '\n');
        cleaned = cleaned.replace(/\r/g, '\n');

        // 4. 清理多余的空白字符
        cleaned = cleaned.replace(/[ \t]+$/gm, ''); // 行尾空格
        cleaned = cleaned.replace(/^[ \t]+/gm, ''); // 行首空格（保留代码块缩进）
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n'); // 多余空行

        // 5. 清理Markdown残留符号
        cleaned = this.cleanMarkdownSymbols(cleaned);

        // 6. 修复表格格式（处理不同AI工具的表格输出）
        cleaned = this.normalizeTableFormat(cleaned);

        // 7. 修复代码块格式
        cleaned = this.normalizeCodeBlocks(cleaned);

        // 8. 修复列表格式
        cleaned = this.normalizeListFormat(cleaned);

        // 9. 清理特殊字符和符号
        cleaned = this.cleanSpecialCharacters(cleaned);

        // 10. 最终格式化
        cleaned = this.finalFormatCleanup(cleaned);

        return cleaned.trim();
    }

    /**
     * 后处理解析后的元素，清理残留符号
     */
    postProcessElements(elements) {
        if (!elements || !Array.isArray(elements)) return elements;

        return elements.map(element => {
            const cleanedElement = { ...element };

            switch (element.type) {
                case 'heading':
                    // 清理标题中的#符号
                    if (cleanedElement.text) {
                        cleanedElement.text = cleanedElement.text.replace(/^#+\s*/, '').trim();
                    }
                    break;

                case 'paragraph':
                    // 清理段落中的Markdown符号
                    if (cleanedElement.text) {
                        cleanedElement.text = this.cleanMarkdownFromText(cleanedElement.text);
                    }
                    if (cleanedElement.formatted) {
                        cleanedElement.formatted = cleanedElement.formatted.map(part => ({
                            ...part,
                            text: this.cleanMarkdownFromText(part.text || '')
                        }));
                    }
                    break;

                case 'table':
                    // 清理表格数据
                    if (cleanedElement.headers) {
                        cleanedElement.headers = cleanedElement.headers.map(header =>
                            this.cleanMarkdownFromText(header)
                        );
                    }
                    if (cleanedElement.rows) {
                        cleanedElement.rows = cleanedElement.rows.map(row =>
                            row.map(cell => this.cleanMarkdownFromText(cell))
                        );
                    }
                    break;

                case 'list':
                case 'orderedList':
                    // 清理列表项
                    if (cleanedElement.items) {
                        cleanedElement.items = cleanedElement.items.map(item => ({
                            ...item,
                            text: this.cleanMarkdownFromText(item.text || '')
                        }));
                    }
                    break;

                case 'codeBlock':
                    // 代码块内容保持原样，但清理包围的```
                    if (cleanedElement.content) {
                        cleanedElement.content = cleanedElement.content.replace(/^```[\w]*\n?/, '').replace(/\n?```$/, '');
                    }
                    break;

                case 'blockquote':
                    // 清理引用块的>符号
                    if (cleanedElement.content) {
                        cleanedElement.content = cleanedElement.content.replace(/^>\s*/, '').trim();
                    }
                    break;
            }

            return cleanedElement;
        });
    }

    /**
     * 从文本中清理Markdown符号
     */
    cleanMarkdownFromText(text) {
        if (!text) return '';

        let cleaned = text;

        // 清理加粗和斜体标记（保留格式效果，但移除符号）
        cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1'); // **bold**
        cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');     // *italic*
        cleaned = cleaned.replace(/__([^_]+)__/g, '$1');     // __bold__
        cleaned = cleaned.replace(/_([^_]+)_/g, '$1');       // _italic_

        // 清理行内代码标记
        cleaned = cleaned.replace(/`([^`]+)`/g, '$1');       // `code`

        // 清理链接标记
        cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // [text](url)

        // 清理图片标记
        cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1'); // ![alt](url)

        // 清理其他Markdown符号
        cleaned = cleaned.replace(/^[-*+]\s+/, '');          // 列表符号
        cleaned = cleaned.replace(/^\d+\.\s+/, '');          // 有序列表
        cleaned = cleaned.replace(/^>\s*/, '');              // 引用符号
        cleaned = cleaned.replace(/^#+\s*/, '');             // 标题符号

        // 清理分隔线
        cleaned = cleaned.replace(/^-{3,}$/, '');
        cleaned = cleaned.replace(/^={3,}$/, '');

        return cleaned.trim();
    }

    /**
     * 深度清理Markdown文本 - 确保Word原生格式
     */
    deepCleanMarkdownText(text) {
        if (!text) return '';

        let cleaned = text.toString();

        // 1. 清理所有Markdown格式标记
        cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');     // **粗体**
        cleaned = cleaned.replace(/\*([^*]+)\*/g, '$1');         // *斜体*
        cleaned = cleaned.replace(/__([^_]+)__/g, '$1');         // __粗体__
        cleaned = cleaned.replace(/_([^_]+)_/g, '$1');           // _斜体_
        cleaned = cleaned.replace(/`([^`]+)`/g, '$1');           // `代码`
        cleaned = cleaned.replace(/~~([^~]+)~~/g, '$1');         // ~~删除线~~

        // 2. 清理链接标记
        cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'); // [文本](链接)
        cleaned = cleaned.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1'); // ![图片](链接)

        // 3. 清理标题标记
        cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');           // # 标题

        // 4. 清理列表标记
        cleaned = cleaned.replace(/^[-*+]\s+/gm, '');            // - 列表
        cleaned = cleaned.replace(/^\d+\.\s+/gm, '');            // 1. 列表

        // 5. 清理引用标记
        cleaned = cleaned.replace(/^>\s*/gm, '');                // > 引用

        // 6. 清理代码块标记
        cleaned = cleaned.replace(/```[\w]*\n?/g, '');           // ```代码块
        cleaned = cleaned.replace(/\n?```$/g, '');               // 结束```

        // 7. 清理分隔线
        cleaned = cleaned.replace(/^[-=]{3,}$/gm, '');           // --- 或 ===

        // 8. 清理HTML标签
        cleaned = cleaned.replace(/<[^>]*>/g, '');

        // 9. 清理HTML实体
        cleaned = cleaned.replace(/&nbsp;/g, ' ');
        cleaned = cleaned.replace(/&amp;/g, '&');
        cleaned = cleaned.replace(/&lt;/g, '<');
        cleaned = cleaned.replace(/&gt;/g, '>');
        cleaned = cleaned.replace(/&quot;/g, '"');
        cleaned = cleaned.replace(/&apos;/g, "'");
        cleaned = cleaned.replace(/&#39;/g, "'");
        cleaned = cleaned.replace(/&#34;/g, '"');

        // 10. 标准化引号和符号
        cleaned = cleaned.replace(/[""]/g, '"');
        cleaned = cleaned.replace(/['']/g, "'");
        cleaned = cleaned.replace(/[—–]/g, '-');

        // 11. 清理零宽字符
        cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');

        // 12. 清理多余空格和换行
        cleaned = cleaned.replace(/\s+/g, ' ');                  // 多个空格变单个
        cleaned = cleaned.replace(/\n\s*\n/g, '\n');             // 多个换行变单个

        // 13. 清理行首行尾空格
        cleaned = cleaned.trim();

        return cleaned;
    }

    /**
     * 清理Markdown残留符号
     */
    cleanMarkdownSymbols(content) {
        let cleaned = content;

        // 不要在这里清理Markdown符号，因为我们需要它们来解析格式
        // 清理工作将在解析后进行

        return cleaned;
    }

    /**
     * 清理特殊字符和符号
     */
    cleanSpecialCharacters(content) {
        let cleaned = content;

        // 清理零宽字符
        cleaned = cleaned.replace(/[\u200B-\u200D\uFEFF]/g, '');

        // 标准化引号
        cleaned = cleaned.replace(/[""]/g, '"');
        cleaned = cleaned.replace(/['']/g, "'");

        // 标准化破折号
        cleaned = cleaned.replace(/[—–]/g, '-');

        // 清理多余的标点符号
        cleaned = cleaned.replace(/\.{3,}/g, '...');
        cleaned = cleaned.replace(/-{3,}/g, '---');

        // 标准化空格
        cleaned = cleaned.replace(/\u00A0/g, ' '); // 不间断空格
        cleaned = cleaned.replace(/\u2009/g, ' '); // 细空格
        cleaned = cleaned.replace(/\u2002/g, ' '); // en空格
        cleaned = cleaned.replace(/\u2003/g, ' '); // em空格

        return cleaned;
    }

    /**
     * 最终格式化清理
     */
    finalFormatCleanup(content) {
        let cleaned = content;

        // 清理多余的空格
        cleaned = cleaned.replace(/ {2,}/g, ' ');

        // 确保段落间有适当的空行
        cleaned = cleaned.replace(/\n\n+/g, '\n\n');

        // 清理行首行尾空格
        cleaned = cleaned.split('\n').map(line => line.trim()).join('\n');

        // 移除开头和结尾的多余空行
        cleaned = cleaned.replace(/^\n+/, '').replace(/\n+$/, '');

        return cleaned;
    }

    /**
     * 标准化表格格式 - 增强版
     */
    normalizeTableFormat(content) {
        const lines = content.split('\n');
        const normalizedLines = [];

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();

            // 跳过表格分隔符行（如 |---|---|--- 或 :---:|:---: 等）
            if (this.isTableSeparatorLine(line)) {
                continue; // 完全跳过分隔符行
            }

            // 检测表格数据行
            if (line.includes('|') && !this.isTableSeparatorLine(line)) {
                // 确保表格行格式正确
                if (!line.startsWith('|')) {
                    line = '|' + line;
                }
                if (!line.endsWith('|')) {
                    line = line + '|';
                }

                // 清理单元格内容
                const cells = line.split('|');
                const cleanedCells = cells.map(cell => {
                    let cleanCell = cell.trim();
                    // 清理单元格内的多余空格
                    cleanCell = cleanCell.replace(/\s+/g, ' ');
                    return cleanCell;
                });

                // 过滤掉空的首尾单元格
                const filteredCells = cleanedCells.filter((cell, index) => {
                    return !(index === 0 && cell === '') && !(index === cleanedCells.length - 1 && cell === '');
                });

                if (filteredCells.length > 0) {
                    line = '| ' + filteredCells.join(' | ') + ' |';
                    normalizedLines.push(line);
                }
            } else if (line) {
                normalizedLines.push(line);
            }
        }

        return normalizedLines.join('\n');
    }

    /**
     * 检测表格分隔符行
     */
    isTableSeparatorLine(line) {
        const trimmed = line.trim();

        // 检测各种表格分隔符格式
        const separatorPatterns = [
            /^\|?[\s]*:?-+:?[\s]*(\|[\s]*:?-+:?[\s]*)*\|?$/,  // |---|---|
            /^[\s]*:?-+:?[\s]*(\|[\s]*:?-+:?[\s]*)+$/,        // ---|---|
            /^\|[\s]*:?-+:?[\s]*\|$/,                         // |---|
            /^[\s]*[-=]{3,}[\s]*$/                            // --- 或 ===
        ];

        return separatorPatterns.some(pattern => pattern.test(trimmed));
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
     * 解析表格内容
     */
    parseTableContent(content) {
        const elements = [];
        const lines = content.split('\n').filter(line => line.trim());

        if (this.isSimpleCSV(content)) {
            // CSV格式处理
            const rows = lines.map(line => line.split(',').map(cell => cell.trim()));
            if (rows.length > 0) {
                elements.push({
                    type: 'table',
                    headers: rows[0],
                    rows: rows.slice(1)
                });
            }
        } else {
            // Markdown表格处理
            const tableLines = lines.filter(line => line.includes('|'));
            if (tableLines.length >= 2) {
                const rows = tableLines.map(line =>
                    line.split('|')
                        .map(cell => cell.trim())
                        .filter(cell => cell.length > 0)
                );

                if (rows.length > 0) {
                    elements.push({
                        type: 'table',
                        headers: rows[0],
                        rows: rows.slice(1).filter(row => !row.every(cell => /^:?-+:?$/.test(cell)))
                    });
                }
            }
        }

        return elements;
    }

    /**
     * 解析列表内容
     */
    parseListContent(content) {
        const elements = [];
        const lines = content.split('\n');
        let currentList = null;

        for (const line of lines) {
            const trimmedLine = line.trim();

            if (!trimmedLine) {
                if (currentList) {
                    elements.push(currentList);
                    currentList = null;
                }
                continue;
            }

            // 无序列表
            const unorderedMatch = trimmedLine.match(/^[-*+]\s+(.+)$/);
            if (unorderedMatch) {
                if (!currentList || currentList.type !== 'list') {
                    if (currentList) elements.push(currentList);
                    currentList = { type: 'list', items: [] };
                }
                currentList.items.push({ text: unorderedMatch[1] });
                continue;
            }

            // 有序列表
            const orderedMatch = trimmedLine.match(/^\d+\.\s+(.+)$/);
            if (orderedMatch) {
                if (!currentList || currentList.type !== 'orderedList') {
                    if (currentList) elements.push(currentList);
                    currentList = { type: 'orderedList', items: [] };
                }
                currentList.items.push({ text: orderedMatch[1] });
                continue;
            }

            // 普通文本
            if (currentList) {
                elements.push(currentList);
                currentList = null;
            }
            elements.push({
                type: 'paragraph',
                text: trimmedLine,
                formatted: [{ type: 'text', text: trimmedLine }]
            });
        }

        if (currentList) {
            elements.push(currentList);
        }

        return elements;
    }

    /**
     * 解析代码内容
     */
    parseCodeContent(content) {
        const elements = [];
        const lines = content.split('\n');
        let i = 0;

        while (i < lines.length) {
            const line = lines[i];

            // 检测代码块
            if (line.trim().startsWith('```')) {
                let codeContent = '';
                let language = line.trim().substring(3).trim();
                i++;

                while (i < lines.length && !lines[i].trim().startsWith('```')) {
                    codeContent += lines[i] + '\n';
                    i++;
                }

                elements.push({
                    type: 'codeBlock',
                    content: codeContent.trim(),
                    language: language
                });
                i++;
            } else if (line.trim()) {
                // 普通文本行
                elements.push({
                    type: 'paragraph',
                    text: line.trim(),
                    formatted: [{ type: 'text', text: line.trim() }]
                });
                i++;
            } else {
                i++;
            }
        }

        return elements;
    }

    /**
     * 检测简单CSV格式
     */
    isSimpleCSV(content) {
        const lines = content.split('\n').filter(line => line.trim());
        if (lines.length < 2) return false;

        // 检查是否包含Markdown表格标记
        if (content.includes('|') || content.includes('---')) {
            return false;
        }

        // 检查每行是否有相同数量的逗号
        const firstLineCommas = (lines[0].match(/,/g) || []).length;
        if (firstLineCommas === 0) return false;

        const consistentCommas = lines.slice(0, Math.min(5, lines.length)).every(line => {
            const commas = (line.match(/,/g) || []).length;
            return commas === firstLineCommas;
        });

        return consistentCommas && firstLineCommas >= 1;
    }

    /**
     * 更新内容类型显示
     */
    updateContentTypeDisplay() {
        const contentTypeSelect = document.getElementById('content-type');
        if (contentTypeSelect && this.currentContentType !== 'auto') {
            // 自动设置检测到的类型
            const typeMapping = {
                'markdown': '📝 Markdown格式',
                'table': '📊 表格数据',
                'list': '📋 列表/项目',
                'article': '📄 文章/报告',
                'code': '💻 代码内容'
            };

            const options = Array.from(contentTypeSelect.options);
            const targetOption = options.find(option =>
                option.textContent.includes(typeMapping[this.currentContentType]?.split(' ')[1] || '')
            );

            if (targetOption) {
                contentTypeSelect.value = targetOption.value;
            }
        }
    }

    /**
     * 更新检测结果显示
     */
    updateDetectionResultDisplay(detectionResult) {
        // 在统计信息区域显示检测结果
        const statsGroup = document.querySelector('.stats-group');
        if (statsGroup && detectionResult.confidence > 0) {
            // 移除旧的检测结果显示
            const oldDetection = statsGroup.querySelector('.detection-result');
            if (oldDetection) {
                oldDetection.remove();
            }

            // 创建新的检测结果显示
            const detectionElement = document.createElement('span');
            detectionElement.className = 'stat-item detection-result';
            detectionElement.innerHTML = `
                <span class="stat-icon">🤖</span>
                <span class="stat-value">${detectionResult.confidence}%</span>
                <span class="stat-label">${this.getTypeDisplayName(detectionResult.type)}</span>
            `;
            detectionElement.title = `检测特征: ${detectionResult.details.features.join(', ')}`;

            statsGroup.appendChild(detectionElement);

            // 添加动画效果
            detectionElement.style.transform = 'scale(0.8)';
            detectionElement.style.opacity = '0';
            setTimeout(() => {
                detectionElement.style.transform = 'scale(1)';
                detectionElement.style.opacity = '1';
                detectionElement.style.transition = 'all 0.3s ease-out';
            }, 100);
        }
    }

    /**
     * 获取类型显示名称
     */
    getTypeDisplayName(type) {
        const typeNames = {
            'markdown': 'Markdown',
            'table': '表格',
            'list': '列表',
            'article': '文章',
            'code': '代码',
            'auto': '自动'
        };
        return typeNames[type] || '未知';
    }

    /**
     * 绑定高级选项事件
     */
    bindAdvancedOptions() {
        const advancedToggle = document.getElementById('advanced-toggle');
        const advancedContent = document.getElementById('advanced-content');

        if (advancedToggle && advancedContent) {
            advancedToggle.addEventListener('click', () => {
                const isVisible = advancedContent.style.display !== 'none';

                if (isVisible) {
                    advancedContent.style.display = 'none';
                    advancedToggle.classList.remove('active');
                } else {
                    advancedContent.style.display = 'block';
                    advancedToggle.classList.add('active');
                }
            });
        }
    }

    /**
     * 更新检测结果显示 - 增强版
     */
    updateDetectionResultDisplay(detectionResult) {
        const detectionPanel = document.getElementById('detection-panel');
        const detectionConfidence = document.getElementById('detection-confidence');
        const detectedType = document.getElementById('detected-type');
        const detectionFeatures = document.getElementById('detection-features');

        if (detectionPanel && detectionResult.confidence > 0) {
            // 显示检测面板
            detectionPanel.style.display = 'block';

            // 更新置信度
            if (detectionConfidence) {
                detectionConfidence.textContent = `${detectionResult.confidence}%`;
                detectionConfidence.className = 'detection-confidence';

                // 根据置信度设置颜色
                if (detectionResult.confidence >= 80) {
                    detectionConfidence.style.background = 'var(--success-color)';
                } else if (detectionResult.confidence >= 60) {
                    detectionConfidence.style.background = 'var(--warning-color)';
                } else {
                    detectionConfidence.style.background = 'var(--danger-color)';
                }
            }

            // 更新检测类型
            if (detectedType) {
                const typeIcons = {
                    'markdown': '📝',
                    'table': '📊',
                    'list': '📋',
                    'article': '📄',
                    'code': '💻',
                    'auto': '🤖'
                };

                const icon = typeIcons[detectionResult.type] || '📄';
                const typeName = this.getTypeDisplayName(detectionResult.type);
                detectedType.textContent = `${icon} ${typeName}格式`;
            }

            // 更新检测特征
            if (detectionFeatures && detectionResult.details.features) {
                const features = detectionResult.details.features.slice(0, 3); // 只显示前3个特征
                detectionFeatures.textContent = `检测到：${features.join('、')}`;
            }

            // 添加动画效果
            detectionPanel.style.animation = 'slideInDown 0.5s ease-out';
        } else {
            // 隐藏检测面板
            if (detectionPanel) {
                detectionPanel.style.display = 'none';
            }
        }

        // 同时更新统计区域的检测结果
        const statsGroup = document.querySelector('.stats-group');
        if (statsGroup && detectionResult.confidence > 0) {
            // 移除旧的检测结果显示
            const oldDetection = statsGroup.querySelector('.detection-result');
            if (oldDetection) {
                oldDetection.remove();
            }

            // 创建新的检测结果显示
            const detectionElement = document.createElement('span');
            detectionElement.className = 'stat-item detection-result';
            detectionElement.innerHTML = `
                <span class="stat-icon">🤖</span>
                <span class="stat-value">${detectionResult.confidence}%</span>
                <span class="stat-label">${this.getTypeDisplayName(detectionResult.type)}</span>
            `;
            detectionElement.title = `检测特征: ${detectionResult.details.features.join(', ')}`;

            statsGroup.appendChild(detectionElement);

            // 添加动画效果
            detectionElement.style.transform = 'scale(0.8)';
            detectionElement.style.opacity = '0';
            setTimeout(() => {
                detectionElement.style.transform = 'scale(1)';
                detectionElement.style.opacity = '1';
                detectionElement.style.transition = 'all 0.3s ease-out';
            }, 100);
        }
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

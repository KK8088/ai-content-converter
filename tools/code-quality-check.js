/**
 * 代码质量检查工具
 * 用于检查JavaScript代码的质量和潜在问题
 */

class CodeQualityChecker {
    constructor() {
        this.rules = {
            // 基础规则
            noConsoleLog: {
                name: '避免使用console.log',
                pattern: /console\.log\(/g,
                severity: 'warning',
                message: '生产代码中应避免使用console.log，建议使用专门的日志系统'
            },
            noAlert: {
                name: '避免使用alert',
                pattern: /alert\(/g,
                severity: 'warning',
                message: '应使用更友好的用户提示方式替代alert'
            },
            noEval: {
                name: '禁止使用eval',
                pattern: /eval\(/g,
                severity: 'error',
                message: 'eval函数存在安全风险，应避免使用'
            },
            
            // 函数规则
            functionTooLong: {
                name: '函数过长',
                check: (content) => {
                    const functions = content.match(/function\s+\w+\s*\([^)]*\)\s*\{[^}]*\}/g) || [];
                    return functions.filter(func => func.split('\n').length > 50);
                },
                severity: 'warning',
                message: '函数行数过多（>50行），建议拆分为更小的函数'
            },
            
            // 变量规则
            varDeclaration: {
                name: '使用var声明变量',
                pattern: /\bvar\s+/g,
                severity: 'info',
                message: '建议使用let或const替代var'
            },
            
            // 错误处理规则
            emptyTryCatch: {
                name: '空的try-catch块',
                pattern: /catch\s*\([^)]*\)\s*\{\s*\}/g,
                severity: 'warning',
                message: '空的catch块可能隐藏错误，应添加适当的错误处理'
            },
            
            // 代码风格规则
            trailingWhitespace: {
                name: '行尾空白字符',
                pattern: /[ \t]+$/gm,
                severity: 'info',
                message: '行尾存在多余的空白字符'
            },
            
            // 安全规则
            innerHTML: {
                name: '使用innerHTML',
                pattern: /\.innerHTML\s*=/g,
                severity: 'warning',
                message: '使用innerHTML可能存在XSS风险，建议使用textContent或安全的DOM操作'
            }
        };
        
        this.results = [];
    }

    /**
     * 检查代码质量
     * @param {string} code - 要检查的代码
     * @param {string} filename - 文件名
     * @returns {Array} 检查结果
     */
    checkCode(code, filename = 'unknown') {
        this.results = [];
        
        // 按行分割代码
        const lines = code.split('\n');
        
        // 执行所有规则检查
        for (const [ruleId, rule] of Object.entries(this.rules)) {
            if (rule.pattern) {
                this.checkPattern(code, lines, rule, ruleId, filename);
            } else if (rule.check) {
                this.checkCustom(code, rule, ruleId, filename);
            }
        }
        
        return this.results;
    }

    /**
     * 检查正则表达式模式
     */
    checkPattern(code, lines, rule, ruleId, filename) {
        let match;
        while ((match = rule.pattern.exec(code)) !== null) {
            const lineNumber = this.getLineNumber(code, match.index);
            const lineContent = lines[lineNumber - 1];
            
            this.results.push({
                rule: ruleId,
                name: rule.name,
                severity: rule.severity,
                message: rule.message,
                filename: filename,
                line: lineNumber,
                column: this.getColumnNumber(code, match.index),
                content: lineContent.trim(),
                match: match[0]
            });
        }
    }

    /**
     * 检查自定义规则
     */
    checkCustom(code, rule, ruleId, filename) {
        const issues = rule.check(code);
        if (Array.isArray(issues)) {
            issues.forEach(issue => {
                this.results.push({
                    rule: ruleId,
                    name: rule.name,
                    severity: rule.severity,
                    message: rule.message,
                    filename: filename,
                    content: typeof issue === 'string' ? issue.substring(0, 100) + '...' : 'Custom check result'
                });
            });
        }
    }

    /**
     * 获取行号
     */
    getLineNumber(code, index) {
        return code.substring(0, index).split('\n').length;
    }

    /**
     * 获取列号
     */
    getColumnNumber(code, index) {
        const lines = code.substring(0, index).split('\n');
        return lines[lines.length - 1].length + 1;
    }

    /**
     * 生成报告
     */
    generateReport(results) {
        const report = {
            summary: {
                total: results.length,
                errors: results.filter(r => r.severity === 'error').length,
                warnings: results.filter(r => r.severity === 'warning').length,
                info: results.filter(r => r.severity === 'info').length
            },
            issues: results,
            recommendations: this.generateRecommendations(results)
        };
        
        return report;
    }

    /**
     * 生成改进建议
     */
    generateRecommendations(results) {
        const recommendations = [];
        
        const errorCount = results.filter(r => r.severity === 'error').length;
        const warningCount = results.filter(r => r.severity === 'warning').length;
        
        if (errorCount > 0) {
            recommendations.push({
                priority: 'high',
                message: `发现 ${errorCount} 个错误，建议立即修复`
            });
        }
        
        if (warningCount > 5) {
            recommendations.push({
                priority: 'medium',
                message: `发现 ${warningCount} 个警告，建议逐步改进代码质量`
            });
        }
        
        // 检查常见问题模式
        const consoleIssues = results.filter(r => r.rule === 'noConsoleLog').length;
        if (consoleIssues > 3) {
            recommendations.push({
                priority: 'medium',
                message: '建议实现统一的日志系统替代console.log'
            });
        }
        
        const alertIssues = results.filter(r => r.rule === 'noAlert').length;
        if (alertIssues > 0) {
            recommendations.push({
                priority: 'medium',
                message: '建议实现用户友好的提示系统替代alert'
            });
        }
        
        return recommendations;
    }

    /**
     * 格式化报告为HTML
     */
    formatReportHTML(report) {
        const severityColors = {
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3'
        };
        
        const severityIcons = {
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        
        let html = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px;">代码质量检查报告</h1>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 30px;">
                <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #333;">${report.summary.total}</div>
                    <div style="color: #666;">总问题数</div>
                </div>
                <div style="background: #ffebee; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #f44336;">${report.summary.errors}</div>
                    <div style="color: #666;">错误</div>
                </div>
                <div style="background: #fff3e0; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #ff9800;">${report.summary.warnings}</div>
                    <div style="color: #666;">警告</div>
                </div>
                <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px; font-weight: bold; color: #2196f3;">${report.summary.info}</div>
                    <div style="color: #666;">信息</div>
                </div>
            </div>
        `;
        
        if (report.recommendations.length > 0) {
            html += `
            <div style="background: #e8f5e8; border-left: 4px solid #4caf50; padding: 15px; margin-bottom: 30px; border-radius: 4px;">
                <h3 style="margin-top: 0; color: #2e7d32;">💡 改进建议</h3>
                <ul style="margin-bottom: 0;">
            `;
            
            report.recommendations.forEach(rec => {
                html += `<li style="margin-bottom: 8px; color: #2e7d32;">${rec.message}</li>`;
            });
            
            html += `</ul></div>`;
        }
        
        if (report.issues.length > 0) {
            html += `<h2 style="color: #333; margin-bottom: 20px;">问题详情</h2>`;
            
            report.issues.forEach((issue, index) => {
                const color = severityColors[issue.severity];
                const icon = severityIcons[issue.severity];
                
                html += `
                <div style="border: 1px solid #e0e0e0; border-radius: 6px; margin-bottom: 15px; overflow: hidden;">
                    <div style="background: ${color}; color: white; padding: 10px; font-weight: 500;">
                        ${icon} ${issue.name} (${issue.severity.toUpperCase()})
                    </div>
                    <div style="padding: 15px;">
                        <div style="margin-bottom: 10px; color: #333;">${issue.message}</div>
                        ${issue.filename ? `<div style="font-size: 12px; color: #666; margin-bottom: 5px;">文件: ${issue.filename}</div>` : ''}
                        ${issue.line ? `<div style="font-size: 12px; color: #666; margin-bottom: 5px;">位置: 第${issue.line}行${issue.column ? `, 第${issue.column}列` : ''}</div>` : ''}
                        ${issue.content ? `<div style="background: #f5f5f5; padding: 8px; border-radius: 4px; font-family: monospace; font-size: 12px; color: #333; margin-top: 8px;">${issue.content}</div>` : ''}
                    </div>
                </div>
                `;
            });
        } else {
            html += `
            <div style="background: #e8f5e8; border: 1px solid #4caf50; border-radius: 6px; padding: 20px; text-align: center; color: #2e7d32;">
                <h3 style="margin: 0;">🎉 恭喜！没有发现代码质量问题</h3>
            </div>
            `;
        }
        
        html += `</div>`;
        return html;
    }
}

// 如果在Node.js环境中
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CodeQualityChecker;
}

// 如果在浏览器环境中
if (typeof window !== 'undefined') {
    window.CodeQualityChecker = CodeQualityChecker;
}

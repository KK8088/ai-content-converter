/**
 * AI内容格式转换工具 - 错误处理模块
 * 
 * @description 统一的错误处理和用户友好的错误提示系统
 * @version 1.5.0
 * @author zk0x01
 */

/**
 * 错误处理器类
 */
class ErrorHandler {
    constructor() {
        this.errorContainer = null;
        this.errorHistory = [];
        this.maxHistorySize = 50;
        this.isInitialized = false;
        
        // 错误类型定义
        this.errorTypes = {
            VALIDATION: 'validation',
            CONVERSION: 'conversion',
            NETWORK: 'network',
            STORAGE: 'storage',
            SYSTEM: 'system',
            USER_INPUT: 'user_input',
            FILE_PROCESSING: 'file_processing',
            MEMORY: 'memory',
            BROWSER_COMPATIBILITY: 'browser_compatibility'
        };

        // 错误级别定义
        this.errorLevels = {
            INFO: 'info',
            WARNING: 'warning',
            ERROR: 'error',
            CRITICAL: 'critical'
        };

        // 错误恢复策略
        this.recoveryStrategies = {
            RETRY: 'retry',
            FALLBACK: 'fallback',
            RELOAD: 'reload',
            MANUAL: 'manual',
            IGNORE: 'ignore'
        };

        // 用户友好的错误消息映射
        this.userFriendlyMessages = {
            [this.errorTypes.FILE_PROCESSING]: {
                title: '文件处理错误',
                suggestions: ['检查文件格式是否正确', '尝试使用较小的文件', '刷新页面后重试']
            },
            [this.errorTypes.MEMORY]: {
                title: '内存不足',
                suggestions: ['关闭其他标签页', '处理较小的文件', '刷新页面释放内存']
            },
            [this.errorTypes.BROWSER_COMPATIBILITY]: {
                title: '浏览器兼容性问题',
                suggestions: ['更新到最新版本浏览器', '尝试使用Chrome或Edge浏览器', '启用JavaScript']
            },
            [this.errorTypes.NETWORK]: {
                title: '网络连接问题',
                suggestions: ['检查网络连接', '刷新页面重试', '稍后再试']
            },
            [this.errorTypes.CONVERSION]: {
                title: '转换失败',
                suggestions: ['检查内容格式', '尝试简化内容', '选择其他输出格式']
            }
        };

        this.init();
    }

    /**
     * 初始化错误处理器
     */
    init() {
        if (this.isInitialized) return;

        // 创建错误显示容器
        this.createErrorContainer();

        // 监听全局错误
        this.setupGlobalErrorHandlers();

        // 设置控制台错误拦截
        this.setupConsoleErrorCapture();

        this.isInitialized = true;
        console.log('🛡️ 错误处理系统已初始化');
    }

    /**
     * 创建错误显示容器
     */
    createErrorContainer() {
        // 检查是否已存在
        if (document.getElementById('error-container')) {
            this.errorContainer = document.getElementById('error-container');
            return;
        }

        // 创建错误容器
        const container = document.createElement('div');
        container.id = 'error-container';
        container.className = 'error-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            max-width: 400px;
            pointer-events: none;
        `;

        document.body.appendChild(container);
        this.errorContainer = container;
    }

    /**
     * 设置全局错误处理
     */
    setupGlobalErrorHandlers() {
        // 捕获未处理的JavaScript错误
        window.addEventListener('error', (event) => {
            // 区分资源加载错误和JavaScript运行时错误
            const isResourceError = event.target !== window &&
                                  (event.target.tagName === 'SCRIPT' ||
                                   event.target.tagName === 'LINK' ||
                                   event.target.tagName === 'IMG' ||
                                   event.target.tagName === 'IFRAME');

            if (isResourceError) {
                // 资源加载错误只记录到控制台，不显示用户提示
                console.warn(`资源加载失败: ${event.target.src || event.target.href}`, event);
                this.logError({
                    type: this.errorTypes.NETWORK,
                    level: this.errorLevels.WARNING,
                    message: `资源加载失败: ${event.target.src || event.target.href}`,
                    filename: event.target.src || event.target.href,
                    error: event.error,
                    timestamp: new Date(),
                    showToUser: false // 不显示给用户
                });
            } else {
                // JavaScript运行时错误显示给用户
                this.handleError({
                    type: this.errorTypes.SYSTEM,
                    level: this.errorLevels.ERROR,
                    message: event.message,
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno,
                    error: event.error,
                    timestamp: new Date(),
                    showToUser: true
                });
            }
        });

        // 捕获未处理的Promise拒绝
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: this.errorTypes.SYSTEM,
                level: this.errorLevels.ERROR,
                message: `未处理的Promise拒绝: ${event.reason}`,
                error: event.reason,
                timestamp: new Date()
            });
        });
    }

    /**
     * 设置控制台错误捕获
     */
    setupConsoleErrorCapture() {
        const originalError = console.error;
        const originalWarn = console.warn;

        console.error = (...args) => {
            originalError.apply(console, args);
            this.logError({
                type: this.errorTypes.SYSTEM,
                level: this.errorLevels.ERROR,
                message: args.join(' '),
                timestamp: new Date()
            });
        };

        console.warn = (...args) => {
            originalWarn.apply(console, args);
            this.logError({
                type: this.errorTypes.SYSTEM,
                level: this.errorLevels.WARNING,
                message: args.join(' '),
                timestamp: new Date()
            });
        };
    }

    /**
     * 处理错误 - 增强版
     * @param {Object} errorInfo - 错误信息
     */
    handleError(errorInfo) {
        // 记录错误
        this.logError(errorInfo);

        // 分析错误并确定恢复策略
        const recoveryStrategy = this.analyzeErrorAndGetStrategy(errorInfo);
        errorInfo.recoveryStrategy = recoveryStrategy;

        // 只有明确标记为显示给用户的错误才显示提示
        if (errorInfo.showToUser !== false) {
            this.showEnhancedUserError(errorInfo);
        }

        // 尝试自动恢复
        this.attemptAutoRecovery(errorInfo);

        // 发送错误报告（如果需要）
        this.reportError(errorInfo);
    }

    /**
     * 分析错误并确定恢复策略
     * @param {Object} errorInfo - 错误信息
     * @returns {string} 恢复策略
     */
    analyzeErrorAndGetStrategy(errorInfo) {
        const { type, message, error } = errorInfo;

        // 基于错误类型和消息内容确定策略
        if (type === this.errorTypes.MEMORY) {
            return this.recoveryStrategies.RELOAD;
        }

        if (type === this.errorTypes.NETWORK) {
            return this.recoveryStrategies.RETRY;
        }

        if (type === this.errorTypes.FILE_PROCESSING) {
            if (message.includes('大文件') || message.includes('内存')) {
                return this.recoveryStrategies.FALLBACK;
            }
            return this.recoveryStrategies.RETRY;
        }

        if (type === this.errorTypes.BROWSER_COMPATIBILITY) {
            return this.recoveryStrategies.FALLBACK;
        }

        if (type === this.errorTypes.CONVERSION) {
            return this.recoveryStrategies.FALLBACK;
        }

        return this.recoveryStrategies.MANUAL;
    }

    /**
     * 显示增强的用户错误提示
     * @param {Object} errorInfo - 错误信息
     */
    showEnhancedUserError(errorInfo) {
        const userMessage = this.getUserFriendlyMessage(errorInfo);
        const errorElement = this.createEnhancedErrorElement(errorInfo, userMessage);

        // 显示错误
        this.displayErrorElement(errorElement);

        // 自动隐藏非关键错误
        if (errorInfo.level !== this.errorLevels.CRITICAL) {
            setTimeout(() => {
                this.hideError(errorElement);
            }, 8000);
        }
    }

    /**
     * 获取用户友好的错误消息
     * @param {Object} errorInfo - 错误信息
     * @returns {Object} 用户友好的消息
     */
    getUserFriendlyMessage(errorInfo) {
        const template = this.userFriendlyMessages[errorInfo.type];

        if (template) {
            return {
                title: template.title,
                message: this.simplifyErrorMessage(errorInfo.message),
                suggestions: template.suggestions,
                recoveryStrategy: errorInfo.recoveryStrategy
            };
        }

        return {
            title: '操作失败',
            message: this.simplifyErrorMessage(errorInfo.message),
            suggestions: ['刷新页面重试', '检查输入内容', '联系技术支持'],
            recoveryStrategy: errorInfo.recoveryStrategy
        };
    }

    /**
     * 简化错误消息，使其更用户友好
     * @param {string} message - 原始错误消息
     * @returns {string} 简化后的消息
     */
    simplifyErrorMessage(message) {
        if (!message) return '发生了未知错误';

        // 移除技术性词汇和堆栈信息
        let simplified = message
            .replace(/at\s+.*\s+\(.*\)/g, '') // 移除堆栈跟踪
            .replace(/Error:\s*/g, '') // 移除Error前缀
            .replace(/TypeError:\s*/g, '') // 移除TypeError前缀
            .replace(/ReferenceError:\s*/g, '') // 移除ReferenceError前缀
            .replace(/\s+/g, ' ') // 合并多个空格
            .trim();

        // 如果消息太长，截断并添加省略号
        if (simplified.length > 100) {
            simplified = simplified.substring(0, 97) + '...';
        }

        return simplified || '操作失败，请重试';
    }

    /**
     * 创建增强的错误显示元素
     * @param {Object} errorInfo - 错误信息
     * @param {Object} userMessage - 用户友好消息
     * @returns {HTMLElement} 错误元素
     */
    createEnhancedErrorElement(errorInfo, userMessage) {
        const errorElement = document.createElement('div');
        errorElement.className = `error-message error-${errorInfo.level}`;
        errorElement.setAttribute('data-error-id', errorInfo.id || this.generateErrorId());

        const iconMap = {
            [this.errorLevels.INFO]: '💡',
            [this.errorLevels.WARNING]: '⚠️',
            [this.errorLevels.ERROR]: '❌',
            [this.errorLevels.CRITICAL]: '🚨'
        };

        const recoveryButtonsHtml = this.createRecoveryButtonsHtml(errorInfo);

        errorElement.innerHTML = `
            <div class="error-header">
                <span class="error-icon">${iconMap[errorInfo.level] || '❌'}</span>
                <span class="error-title">${userMessage.title}</span>
                <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="error-content">
                <p class="error-message-text">${userMessage.message}</p>
                ${userMessage.suggestions.length > 0 ? `
                    <div class="error-suggestions">
                        <p class="suggestions-title">建议解决方案：</p>
                        <ul class="suggestions-list">
                            ${userMessage.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                ${recoveryButtonsHtml}
            </div>
            <div class="error-details" style="display: none;">
                <p><strong>错误类型：</strong>${errorInfo.type}</p>
                <p><strong>时间：</strong>${errorInfo.timestamp ? errorInfo.timestamp.toLocaleString() : '未知'}</p>
                <p><strong>详细信息：</strong>${errorInfo.message}</p>
            </div>
            <button class="error-toggle-details" onclick="this.previousElementSibling.style.display = this.previousElementSibling.style.display === 'none' ? 'block' : 'none'; this.textContent = this.textContent === '显示详情' ? '隐藏详情' : '显示详情';">显示详情</button>
        `;

        return errorElement;
    }

    /**
     * 创建恢复操作按钮HTML
     * @param {Object} errorInfo - 错误信息
     * @returns {string} 按钮HTML
     */
    createRecoveryButtonsHtml(errorInfo) {
        const strategy = errorInfo.recoveryStrategy;
        let buttonsHtml = '';

        switch (strategy) {
            case this.recoveryStrategies.RETRY:
                buttonsHtml = `
                    <div class="error-actions">
                        <button class="error-action-btn retry-btn" onclick="window.errorHandler.retryLastOperation('${errorInfo.id}')">
                            🔄 重试
                        </button>
                    </div>
                `;
                break;

            case this.recoveryStrategies.FALLBACK:
                buttonsHtml = `
                    <div class="error-actions">
                        <button class="error-action-btn fallback-btn" onclick="window.errorHandler.useFallbackMethod('${errorInfo.id}')">
                            🔧 使用备用方法
                        </button>
                        <button class="error-action-btn retry-btn" onclick="window.errorHandler.retryLastOperation('${errorInfo.id}')">
                            🔄 重试
                        </button>
                    </div>
                `;
                break;

            case this.recoveryStrategies.RELOAD:
                buttonsHtml = `
                    <div class="error-actions">
                        <button class="error-action-btn reload-btn" onclick="window.errorHandler.reloadPage()">
                            🔄 刷新页面
                        </button>
                    </div>
                `;
                break;

            default:
                buttonsHtml = `
                    <div class="error-actions">
                        <button class="error-action-btn help-btn" onclick="window.errorHandler.showHelp('${errorInfo.type}')">
                            ❓ 获取帮助
                        </button>
                    </div>
                `;
        }

        return buttonsHtml;
    }

    /**
     * 尝试自动恢复
     * @param {Object} errorInfo - 错误信息
     */
    attemptAutoRecovery(errorInfo) {
        const strategy = errorInfo.recoveryStrategy;

        // 只对特定类型的错误进行自动恢复
        if (errorInfo.level === this.errorLevels.CRITICAL) {
            return; // 关键错误不自动恢复
        }

        switch (strategy) {
            case this.recoveryStrategies.RETRY:
                // 延迟自动重试（仅对网络错误）
                if (errorInfo.type === this.errorTypes.NETWORK) {
                    setTimeout(() => {
                        this.retryLastOperation(errorInfo.id);
                    }, 3000);
                }
                break;

            case this.recoveryStrategies.FALLBACK:
                // 自动使用备用方法（仅对文件处理错误）
                if (errorInfo.type === this.errorTypes.FILE_PROCESSING) {
                    setTimeout(() => {
                        this.useFallbackMethod(errorInfo.id);
                    }, 1000);
                }
                break;
        }
    }

    /**
     * 重试上次操作
     * @param {string} errorId - 错误ID
     */
    retryLastOperation(errorId) {
        const errorInfo = this.errorHistory.find(e => e.id === errorId);
        if (!errorInfo) return;

        // 隐藏错误提示
        const errorElement = document.querySelector(`[data-error-id="${errorId}"]`);
        if (errorElement) {
            errorElement.remove();
        }

        // 触发重试事件
        window.dispatchEvent(new CustomEvent('errorRetry', {
            detail: { errorInfo, errorId }
        }));

        console.log('正在重试操作...', errorInfo);
    }

    /**
     * 使用备用方法
     * @param {string} errorId - 错误ID
     */
    useFallbackMethod(errorId) {
        const errorInfo = this.errorHistory.find(e => e.id === errorId);
        if (!errorInfo) return;

        // 隐藏错误提示
        const errorElement = document.querySelector(`[data-error-id="${errorId}"]`);
        if (errorElement) {
            errorElement.remove();
        }

        // 触发备用方法事件
        window.dispatchEvent(new CustomEvent('errorFallback', {
            detail: { errorInfo, errorId }
        }));

        console.log('正在使用备用方法...', errorInfo);
    }

    /**
     * 刷新页面
     */
    reloadPage() {
        if (confirm('确定要刷新页面吗？未保存的内容将丢失。')) {
            window.location.reload();
        }
    }

    /**
     * 显示帮助信息
     * @param {string} errorType - 错误类型
     */
    showHelp(errorType) {
        const helpContent = this.getHelpContent(errorType);

        // 创建帮助对话框
        const helpDialog = document.createElement('div');
        helpDialog.className = 'help-dialog';
        helpDialog.innerHTML = `
            <div class="help-dialog-content">
                <div class="help-dialog-header">
                    <h3>帮助信息</h3>
                    <button class="help-dialog-close" onclick="this.closest('.help-dialog').remove()">×</button>
                </div>
                <div class="help-dialog-body">
                    ${helpContent}
                </div>
                <div class="help-dialog-footer">
                    <button class="help-dialog-btn" onclick="this.closest('.help-dialog').remove()">关闭</button>
                </div>
            </div>
        `;

        document.body.appendChild(helpDialog);
    }

    /**
     * 获取帮助内容
     * @param {string} errorType - 错误类型
     * @returns {string} 帮助内容HTML
     */
    getHelpContent(errorType) {
        const helpMap = {
            [this.errorTypes.FILE_PROCESSING]: `
                <h4>文件处理问题解决方案</h4>
                <ul>
                    <li>确保文件格式正确（支持.md、.txt文件）</li>
                    <li>文件大小不超过10MB</li>
                    <li>检查文件内容是否包含特殊字符</li>
                    <li>尝试将大文件分割成小文件处理</li>
                </ul>
            `,
            [this.errorTypes.MEMORY]: `
                <h4>内存不足解决方案</h4>
                <ul>
                    <li>关闭其他浏览器标签页</li>
                    <li>处理较小的文件</li>
                    <li>刷新页面释放内存</li>
                    <li>使用性能更好的设备</li>
                </ul>
            `,
            [this.errorTypes.BROWSER_COMPATIBILITY]: `
                <h4>浏览器兼容性问题</h4>
                <ul>
                    <li>更新浏览器到最新版本</li>
                    <li>推荐使用Chrome、Edge或Firefox</li>
                    <li>确保JavaScript已启用</li>
                    <li>清除浏览器缓存</li>
                </ul>
            `
        };

        return helpMap[errorType] || `
            <h4>通用解决方案</h4>
            <ul>
                <li>刷新页面重试</li>
                <li>检查网络连接</li>
                <li>清除浏览器缓存</li>
                <li>联系技术支持</li>
            </ul>
        `;
    }

    /**
     * 记录错误到历史
     * @param {Object} errorInfo - 错误信息
     */
    logError(errorInfo) {
        // 添加到错误历史
        this.errorHistory.unshift({
            id: this.generateErrorId(),
            ...errorInfo,
            timestamp: errorInfo.timestamp || new Date()
        });

        // 限制历史大小
        if (this.errorHistory.length > this.maxHistorySize) {
            this.errorHistory = this.errorHistory.slice(0, this.maxHistorySize);
        }

        // 存储到本地存储
        try {
            Utils.storage.set('error_history', this.errorHistory.slice(0, 10));
        } catch (e) {
            console.warn('无法保存错误历史:', e);
        }
    }

    /**
     * 显示用户友好的错误消息
     * @param {Object} errorInfo - 错误信息
     */
    showUserError(errorInfo) {
        if (!this.errorContainer) return;

        const errorElement = this.createErrorElement(errorInfo);
        this.errorContainer.appendChild(errorElement);

        // 自动移除错误消息
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.remove();
            }
        }, this.getErrorDisplayDuration(errorInfo.level));
    }

    /**
     * 创建错误显示元素
     * @param {Object} errorInfo - 错误信息
     * @returns {HTMLElement} 错误元素
     */
    createErrorElement(errorInfo) {
        const errorDiv = document.createElement('div');
        errorDiv.className = `error-message error-${errorInfo.level}`;
        errorDiv.style.cssText = `
            background: ${this.getErrorColor(errorInfo.level)};
            color: white;
            padding: 12px 16px;
            margin-bottom: 8px;
            border-radius: 6px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            pointer-events: auto;
            cursor: pointer;
            transition: all 0.3s ease;
            animation: slideIn 0.3s ease;
            max-width: 100%;
            word-wrap: break-word;
        `;

        const icon = this.getErrorIcon(errorInfo.level);
        const userMessage = this.getUserFriendlyMessage(errorInfo);

        errorDiv.innerHTML = `
            <div style="display: flex; align-items: flex-start; gap: 8px;">
                <span style="font-size: 16px; flex-shrink: 0;">${icon}</span>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 500; margin-bottom: 4px;">${userMessage.title}</div>
                    <div style="font-size: 13px; opacity: 0.9;">${userMessage.description}</div>
                    ${userMessage.action ? `<div style="font-size: 12px; margin-top: 6px; opacity: 0.8;">💡 ${userMessage.action}</div>` : ''}
                </div>
                <button style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; padding: 0; margin-left: 8px;" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // 点击查看详情
        errorDiv.addEventListener('click', (e) => {
            if (e.target.tagName !== 'BUTTON') {
                this.showErrorDetails(errorInfo);
            }
        });

        return errorDiv;
    }

    /**
     * 获取用户友好的错误消息
     * @param {Object} errorInfo - 错误信息
     * @returns {Object} 用户友好的消息
     */
    getUserFriendlyMessage(errorInfo) {
        const messageMap = {
            [this.errorTypes.VALIDATION]: {
                title: '输入验证失败',
                description: '请检查输入内容的格式是否正确',
                action: '确保内容符合支持的格式要求'
            },
            [this.errorTypes.CONVERSION]: {
                title: '转换过程出错',
                description: '文档转换时遇到问题',
                action: '请尝试简化内容或刷新页面重试'
            },
            [this.errorTypes.NETWORK]: {
                title: '网络连接问题',
                description: '无法连接到服务器',
                action: '请检查网络连接并重试'
            },
            [this.errorTypes.STORAGE]: {
                title: '存储空间问题',
                description: '本地存储空间不足或访问受限',
                action: '请清理浏览器缓存或检查存储权限'
            },
            [this.errorTypes.USER_INPUT]: {
                title: '输入内容有误',
                description: '输入的内容格式不正确',
                action: '请参考示例格式重新输入'
            },
            [this.errorTypes.SYSTEM]: {
                title: '系统错误',
                description: '应用程序遇到意外错误',
                action: '请刷新页面重试，如问题持续请联系支持'
            }
        };

        const defaultMessage = {
            title: '未知错误',
            description: errorInfo.message || '发生了未知错误',
            action: '请刷新页面重试'
        };

        return messageMap[errorInfo.type] || defaultMessage;
    }

    /**
     * 获取错误颜色
     * @param {string} level - 错误级别
     * @returns {string} 颜色值
     */
    getErrorColor(level) {
        const colorMap = {
            [this.errorLevels.INFO]: '#2196F3',
            [this.errorLevels.WARNING]: '#FF9800',
            [this.errorLevels.ERROR]: '#F44336',
            [this.errorLevels.CRITICAL]: '#9C27B0'
        };
        return colorMap[level] || '#757575';
    }

    /**
     * 获取错误图标
     * @param {string} level - 错误级别
     * @returns {string} 图标
     */
    getErrorIcon(level) {
        const iconMap = {
            [this.errorLevels.INFO]: 'ℹ️',
            [this.errorLevels.WARNING]: '⚠️',
            [this.errorLevels.ERROR]: '❌',
            [this.errorLevels.CRITICAL]: '🚨'
        };
        return iconMap[level] || '❓';
    }

    /**
     * 获取错误显示持续时间
     * @param {string} level - 错误级别
     * @returns {number} 持续时间（毫秒）
     */
    getErrorDisplayDuration(level) {
        const durationMap = {
            [this.errorLevels.INFO]: 3000,
            [this.errorLevels.WARNING]: 5000,
            [this.errorLevels.ERROR]: 8000,
            [this.errorLevels.CRITICAL]: 12000
        };
        return durationMap[level] || 5000;
    }

    /**
     * 生成错误ID
     * @returns {string} 错误ID
     */
    generateErrorId() {
        return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 显示错误详情
     * @param {Object} errorInfo - 错误信息
     */
    showErrorDetails(errorInfo) {
        const details = `
错误类型: ${errorInfo.type}
错误级别: ${errorInfo.level}
错误消息: ${errorInfo.message}
发生时间: ${errorInfo.timestamp?.toLocaleString()}
${errorInfo.filename ? `文件: ${errorInfo.filename}:${errorInfo.lineno}:${errorInfo.colno}` : ''}
${errorInfo.error?.stack ? `堆栈: ${errorInfo.error.stack}` : ''}
        `.trim();

        console.group('🔍 错误详情');
        console.log(details);
        console.log('完整错误对象:', errorInfo);
        console.groupEnd();
    }

    /**
     * 报告错误（可扩展用于发送到服务器）
     * @param {Object} errorInfo - 错误信息
     */
    reportError(errorInfo) {
        // 这里可以添加错误报告逻辑
        // 例如发送到错误监控服务
        if (errorInfo.level === this.errorLevels.CRITICAL) {
            console.log('🚨 关键错误已记录，建议立即处理');
        }
    }

    /**
     * 清空错误历史
     */
    clearErrorHistory() {
        this.errorHistory = [];
        Utils.storage.remove('error_history');
    }

    /**
     * 获取错误历史
     * @returns {Array} 错误历史
     */
    getErrorHistory() {
        return [...this.errorHistory];
    }

    /**
     * 便捷方法：显示信息
     * @param {string} message - 消息
     */
    info(message) {
        this.logError({
            type: this.errorTypes.SYSTEM,
            level: this.errorLevels.INFO,
            message: message,
            timestamp: new Date(),
            showToUser: false
        });
    }

    /**
     * 便捷方法：显示警告
     * @param {string} message - 消息
     */
    warn(message) {
        this.logError({
            type: this.errorTypes.SYSTEM,
            level: this.errorLevels.WARNING,
            message: message,
            timestamp: new Date(),
            showToUser: false
        });
    }

    /**
     * 便捷方法：显示错误
     * @param {string} message - 消息
     * @param {string} type - 错误类型
     */
    error(message, type = this.errorTypes.SYSTEM) {
        this.handleError({
            type: type,
            level: this.errorLevels.ERROR,
            message: message,
            timestamp: new Date()
        });
    }

    /**
     * 便捷方法：显示关键错误
     * @param {string} message - 消息
     * @param {string} type - 错误类型
     */
    critical(message, type = this.errorTypes.SYSTEM) {
        this.handleError({
            type: type,
            level: this.errorLevels.CRITICAL,
            message: message,
            timestamp: new Date()
        });
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.error-container .error-message:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}
`;
document.head.appendChild(style);

// 创建全局实例
const errorHandler = new ErrorHandler();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ErrorHandler;
}

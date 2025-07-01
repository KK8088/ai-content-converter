/**
 * 双模式UI控制器
 * 管理简单模式和高级模式的切换
 */

class DualModeController {
    constructor() {
        this.mode = 'simple'; // 'simple' | 'advanced'
        this.container = null;
        this.smartAnalyzer = null;
        this.advancedPanel = null;
        this.callbacks = {
            onModeChange: [],
            onConvert: []
        };
        
        this.init();
    }

    /**
     * 初始化双模式控制器
     */
    init() {
        this.createContainer();
        this.bindEvents();
        this.loadUserPreference();
    }

    /**
     * 创建双模式UI容器
     */
    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'dual-mode-container';
        this.container.innerHTML = this.getTemplate();
        
        // 插入到页面中
        const targetElement = document.querySelector('#app') || document.body;
        targetElement.appendChild(this.container);
    }

    /**
     * 获取UI模板
     */
    getTemplate() {
        return `
            <div class="app-layout">
                <!-- 应用头部 -->
                <header class="app-header">
                    <div class="container">
                        <div class="header-content">
                            <div class="brand">
                                <h1 class="app-title text-3xl font-bold">AI内容格式转换工具</h1>
                                <p class="app-subtitle text-secondary">智能转换，一键完成</p>
                            </div>
                            <div class="version-info">
                                <span class="version-badge">v1.6.0</span>
                                <span class="mode-indicator" data-mode="${this.mode}">
                                    ${this.mode === 'simple' ? '简单模式' : '高级模式'}
                                </span>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- 主要内容区域 -->
                <main class="app-main">
                    <div class="container">
                        <div class="main-content stack">
                            <!-- 智能输入区域 -->
                            <div class="input-section card">
                                <div class="input-header">
                                    <h2 class="text-xl font-semibold">粘贴您的AI对话内容</h2>
                                    <p class="text-secondary text-sm">支持ChatGPT、Claude、文心一言等AI工具的对话内容</p>
                                </div>
                                
                                <div class="smart-input-wrapper">
                                    <textarea 
                                        class="smart-input input" 
                                        placeholder="Ctrl+V 粘贴内容，我们会自动识别最佳格式..."
                                        data-auto-resize="true"
                                    ></textarea>
                                    
                                    <div class="input-status">
                                        <span class="word-count text-muted text-sm">0 字</span>
                                        <div class="format-indicator">
                                            <span class="indicator-dot"></span>
                                            <span class="indicator-text text-sm">等待输入</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 操作按钮区域 -->
                            <div class="action-section">
                                <div class="action-buttons flex-center gap-md">
                                    <button class="btn btn-primary btn-lg smart-convert-btn">
                                        <span class="btn-icon">🚀</span>
                                        <span class="btn-text">智能转换</span>
                                    </button>
                                    
                                    <button class="btn btn-secondary advanced-toggle-btn">
                                        <span class="btn-icon">⚙️</span>
                                        <span class="btn-text">高级选项</span>
                                    </button>
                                </div>
                                
                                <div class="mode-switch">
                                    <button class="mode-switch-btn text-sm text-muted" data-mode="toggle">
                                        ${this.mode === 'simple' ? '切换到高级模式' : '切换到简单模式'}
                                    </button>
                                </div>
                            </div>

                            <!-- 智能建议区域 -->
                            <div class="suggestion-section hidden">
                                <div class="suggestion-card card-compact">
                                    <div class="suggestion-content">
                                        <!-- 动态内容 -->
                                    </div>
                                </div>
                            </div>

                            <!-- 高级选项面板 -->
                            <div class="advanced-panel hidden">
                                <div class="advanced-content card">
                                    <div class="panel-header flex-between">
                                        <h3 class="text-lg font-semibold">高级选项</h3>
                                        <button class="panel-close-btn btn btn-secondary btn-sm">
                                            <span>收起</span>
                                        </button>
                                    </div>
                                    
                                    <div class="panel-body stack">
                                        <!-- 格式选择 -->
                                        <div class="option-group">
                                            <label class="option-label text-sm font-medium">输出格式</label>
                                            <div class="format-options">
                                                <label class="format-option">
                                                    <input type="radio" name="format" value="docx" checked>
                                                    <span class="option-content">
                                                        <span class="option-icon">📄</span>
                                                        <span class="option-text">Word文档</span>
                                                    </span>
                                                </label>
                                                <label class="format-option">
                                                    <input type="radio" name="format" value="xlsx">
                                                    <span class="option-content">
                                                        <span class="option-icon">📊</span>
                                                        <span class="option-text">Excel表格</span>
                                                    </span>
                                                </label>
                                                <label class="format-option">
                                                    <input type="radio" name="format" value="pdf">
                                                    <span class="option-content">
                                                        <span class="option-icon">📄</span>
                                                        <span class="option-text">PDF文档</span>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        <!-- 模板选择 -->
                                        <div class="option-group">
                                            <label class="option-label text-sm font-medium">文档模板</label>
                                            <select class="template-select input">
                                                <option value="professional">专业模板</option>
                                                <option value="simple">简洁模板</option>
                                                <option value="academic">学术模板</option>
                                                <option value="creative">创意模板</option>
                                            </select>
                                        </div>

                                        <!-- 文件名设置 -->
                                        <div class="option-group">
                                            <label class="option-label text-sm font-medium">文件名</label>
                                            <input type="text" class="filename-input input" placeholder="自动生成文件名">
                                        </div>

                                        <!-- 高级设置 -->
                                        <div class="option-group">
                                            <label class="option-label text-sm font-medium">高级设置</label>
                                            <div class="advanced-options stack-sm">
                                                <label class="checkbox-option">
                                                    <input type="checkbox" class="preserve-formatting">
                                                    <span class="checkbox-text text-sm">保持原始格式</span>
                                                </label>
                                                <label class="checkbox-option">
                                                    <input type="checkbox" class="include-metadata">
                                                    <span class="checkbox-text text-sm">包含元数据</span>
                                                </label>
                                                <label class="checkbox-option">
                                                    <input type="checkbox" class="optimize-mobile">
                                                    <span class="checkbox-text text-sm">移动端优化</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <!-- 状态栏 -->
                <footer class="app-footer">
                    <div class="container">
                        <div class="status-bar">
                            <div class="status-info text-sm text-muted">
                                <span class="status-text">就绪</span>
                            </div>
                            <div class="quick-stats text-sm text-muted">
                                <span class="conversion-count">今日转换: 0</span>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        `;
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        if (!this.container) return;

        // 模式切换按钮
        const modeSwitchBtn = this.container.querySelector('.mode-switch-btn');
        modeSwitchBtn?.addEventListener('click', () => this.toggleMode());

        // 高级选项切换
        const advancedToggleBtn = this.container.querySelector('.advanced-toggle-btn');
        advancedToggleBtn?.addEventListener('click', () => this.toggleAdvancedPanel());

        // 面板关闭按钮
        const panelCloseBtn = this.container.querySelector('.panel-close-btn');
        panelCloseBtn?.addEventListener('click', () => this.hideAdvancedPanel());

        // 智能转换按钮
        const smartConvertBtn = this.container.querySelector('.smart-convert-btn');
        smartConvertBtn?.addEventListener('click', () => this.handleSmartConvert());

        // 输入框事件
        const smartInput = this.container.querySelector('.smart-input');
        smartInput?.addEventListener('input', (e) => this.handleInputChange(e));
        smartInput?.addEventListener('paste', (e) => this.handlePaste(e));

        // 格式选择事件
        const formatOptions = this.container.querySelectorAll('input[name="format"]');
        formatOptions.forEach(option => {
            option.addEventListener('change', (e) => this.handleFormatChange(e));
        });
    }

    /**
     * 切换模式
     */
    toggleMode() {
        this.mode = this.mode === 'simple' ? 'advanced' : 'simple';
        this.updateModeUI();
        this.saveUserPreference();
        this.triggerCallback('onModeChange', this.mode);
    }

    /**
     * 更新模式UI
     */
    updateModeUI() {
        const modeIndicator = this.container.querySelector('.mode-indicator');
        const modeSwitchBtn = this.container.querySelector('.mode-switch-btn');
        
        if (modeIndicator) {
            modeIndicator.textContent = this.mode === 'simple' ? '简单模式' : '高级模式';
            modeIndicator.setAttribute('data-mode', this.mode);
        }
        
        if (modeSwitchBtn) {
            modeSwitchBtn.textContent = this.mode === 'simple' ? '切换到高级模式' : '切换到简单模式';
        }

        // 根据模式显示/隐藏相关元素
        if (this.mode === 'simple') {
            this.hideAdvancedPanel();
        }
    }

    /**
     * 切换高级选项面板
     */
    toggleAdvancedPanel() {
        const panel = this.container.querySelector('.advanced-panel');
        if (panel.classList.contains('hidden')) {
            this.showAdvancedPanel();
        } else {
            this.hideAdvancedPanel();
        }
    }

    /**
     * 显示高级选项面板
     */
    showAdvancedPanel() {
        const panel = this.container.querySelector('.advanced-panel');
        const toggleBtn = this.container.querySelector('.advanced-toggle-btn .btn-text');
        
        panel?.classList.remove('hidden');
        if (toggleBtn) toggleBtn.textContent = '收起选项';
        
        // 添加显示动画
        panel?.classList.add('animate-slide-up');
    }

    /**
     * 隐藏高级选项面板
     */
    hideAdvancedPanel() {
        const panel = this.container.querySelector('.advanced-panel');
        const toggleBtn = this.container.querySelector('.advanced-toggle-btn .btn-text');
        
        panel?.classList.add('hidden');
        if (toggleBtn) toggleBtn.textContent = '高级选项';
    }

    /**
     * 处理智能转换
     */
    async handleSmartConvert() {
        const input = this.container.querySelector('.smart-input');
        const content = input?.value?.trim();
        
        if (!content) {
            this.showMessage('请先输入内容', 'warning');
            return;
        }

        try {
            this.setConvertButtonLoading(true);
            
            if (this.mode === 'simple') {
                await this.performSmartConvert(content);
            } else {
                await this.performAdvancedConvert(content);
            }
            
            this.triggerCallback('onConvert', { content, mode: this.mode });
            
        } catch (error) {
            console.error('转换失败:', error);
            this.showMessage('转换失败，请重试', 'error');
        } finally {
            this.setConvertButtonLoading(false);
        }
    }

    /**
     * 执行智能转换
     */
    async performSmartConvert(content) {
        // 这里会调用智能分析引擎
        // 暂时使用模拟实现
        await new Promise(resolve => setTimeout(resolve, 2000));
        this.showMessage('智能转换完成！', 'success');
    }

    /**
     * 执行高级转换
     */
    async performAdvancedConvert(content) {
        // 获取用户选择的选项
        const options = this.getAdvancedOptions();
        
        // 执行转换
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.showMessage(`${options.format.toUpperCase()}文档生成完成！`, 'success');
    }

    /**
     * 获取高级选项
     */
    getAdvancedOptions() {
        const formatInput = this.container.querySelector('input[name="format"]:checked');
        const templateSelect = this.container.querySelector('.template-select');
        const filenameInput = this.container.querySelector('.filename-input');
        
        return {
            format: formatInput?.value || 'docx',
            template: templateSelect?.value || 'professional',
            filename: filenameInput?.value || '',
            preserveFormatting: this.container.querySelector('.preserve-formatting')?.checked || false,
            includeMetadata: this.container.querySelector('.include-metadata')?.checked || false,
            optimizeMobile: this.container.querySelector('.optimize-mobile')?.checked || false
        };
    }

    /**
     * 设置转换按钮加载状态
     */
    setConvertButtonLoading(loading) {
        const btn = this.container.querySelector('.smart-convert-btn');
        const icon = btn?.querySelector('.btn-icon');
        const text = btn?.querySelector('.btn-text');
        
        if (loading) {
            btn?.setAttribute('disabled', 'true');
            if (icon) icon.textContent = '🔄';
            if (text) text.textContent = '转换中...';
        } else {
            btn?.removeAttribute('disabled');
            if (icon) icon.textContent = '🚀';
            if (text) text.textContent = '智能转换';
        }
    }

    /**
     * 处理输入变化
     */
    handleInputChange(event) {
        const content = event.target.value;
        this.updateWordCount(content);
        
        // 延迟分析以避免频繁调用
        clearTimeout(this.analysisTimeout);
        this.analysisTimeout = setTimeout(() => {
            if (content.length > 10) {
                this.analyzeContent(content);
            }
        }, 500);
    }

    /**
     * 更新字数统计
     */
    updateWordCount(content) {
        const wordCount = content.length;
        const wordCountElement = this.container.querySelector('.word-count');
        if (wordCountElement) {
            wordCountElement.textContent = `${wordCount} 字`;
        }
    }

    /**
     * 分析内容
     */
    async analyzeContent(content) {
        // 这里会调用智能分析引擎
        // 暂时使用模拟实现
        const indicator = this.container.querySelector('.format-indicator');
        const dot = indicator?.querySelector('.indicator-dot');
        const text = indicator?.querySelector('.indicator-text');
        
        if (dot && text) {
            dot.className = 'indicator-dot analyzing';
            text.textContent = '分析中...';
            
            // 模拟分析
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            dot.className = 'indicator-dot ready';
            text.textContent = '建议Word格式';
        }
    }

    /**
     * 显示消息
     */
    showMessage(message, type = 'info') {
        // 创建消息提示
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        
        // 添加到页面
        document.body.appendChild(messageEl);
        
        // 自动移除
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    /**
     * 保存用户偏好
     */
    saveUserPreference() {
        localStorage.setItem('dualMode_preference', JSON.stringify({
            mode: this.mode,
            timestamp: Date.now()
        }));
    }

    /**
     * 加载用户偏好
     */
    loadUserPreference() {
        try {
            const saved = localStorage.getItem('dualMode_preference');
            if (saved) {
                const preference = JSON.parse(saved);
                this.mode = preference.mode || 'simple';
                this.updateModeUI();
            }
        } catch (error) {
            console.warn('加载用户偏好失败:', error);
        }
    }

    /**
     * 注册回调函数
     */
    on(event, callback) {
        if (this.callbacks[event]) {
            this.callbacks[event].push(callback);
        }
    }

    /**
     * 触发回调函数
     */
    triggerCallback(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`回调函数执行失败 (${event}):`, error);
                }
            });
        }
    }

    /**
     * 获取当前模式
     */
    getMode() {
        return this.mode;
    }

    /**
     * 设置模式
     */
    setMode(mode) {
        if (mode !== this.mode) {
            this.mode = mode;
            this.updateModeUI();
            this.saveUserPreference();
        }
    }

    /**
     * 销毁组件
     */
    destroy() {
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
        
        clearTimeout(this.analysisTimeout);
        this.callbacks = { onModeChange: [], onConvert: [] };
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DualModeController;
} else if (typeof window !== 'undefined') {
    window.DualModeController = DualModeController;
}

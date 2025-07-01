/**
 * Elegant UI Controller - 真正现代化的优雅界面系统
 * 专注于美学、功能性和用户体验
 */

class ElegantUIController {
    constructor() {
        this.state = {
            theme: 'light',
            mode: 'simple',
            isAnalyzing: false,
            content: '',
            suggestion: null
        };
        
        this.init();
    }

    /**
     * 初始化优雅UI系统
     */
    init() {
        this.createLayout();
        this.setupInteractions();
        this.setupAnimations();
        this.bindEvents();
        
        console.log('✨ Elegant UI System initialized');
    }

    /**
     * 创建现代化布局
     */
    createLayout() {
        const app = document.getElementById('app');
        if (!app) return;

        app.innerHTML = `
            <div class="min-h-screen" style="background: linear-gradient(to bottom, #ffffff, #f9fafb);">
                <!-- 现代化导航栏 -->
                <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
                    <div class="container">
                        <div class="flex items-center justify-between py-4">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h1 class="text-lg font-semibold text-gray-900">AI内容转换</h1>
                                    <p class="text-xs text-gray-500">智能 • 高效 • 专业</p>
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-3">
                                <span class="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">v1.6.0</span>
                                <button class="theme-toggle btn btn-ghost btn-sm rounded-full w-8 h-8 p-0">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <!-- 主要内容区域 -->
                <main class="pt-20 pb-16">
                    <div class="container container-sm">
                        <!-- 标题区域 -->
                        <div class="text-center mb-12 animate-fade-in">
                            <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                                将AI对话转换为
                                <span class="text-blue-600">专业文档</span>
                            </h2>
                            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                                支持ChatGPT、Claude等AI工具的对话内容，一键生成Word、Excel、PDF等格式文档
                            </p>
                        </div>

                        <!-- 智能输入卡片 -->
                        <div class="card card-elevated mb-8 animate-slide-up" style="animation-delay: 0.1s;">
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-700 mb-3">
                                    粘贴您的AI对话内容
                                </label>
                                <div class="relative">
                                    <textarea 
                                        class="smart-input input textarea resize-none"
                                        placeholder="Ctrl+V 粘贴内容，我们会自动识别最佳格式..."
                                        rows="8"
                                    ></textarea>
                                    
                                    <!-- 输入状态指示器 -->
                                    <div class="absolute bottom-3 right-3 flex items-center gap-2 text-xs text-gray-500">
                                        <span class="status-dot" id="status-dot"></span>
                                        <span id="status-text">等待输入</span>
                                        <span class="mx-2">•</span>
                                        <span id="char-count">0 字符</span>
                                    </div>
                                </div>
                            </div>

                            <!-- 快速操作按钮 -->
                            <div class="flex flex-col sm:flex-row gap-3">
                                <button class="smart-convert-btn btn btn-primary btn-lg flex-1 hover-lift">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                    智能转换
                                </button>
                                
                                <button class="advanced-toggle btn btn-secondary hover-lift">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                                    </svg>
                                    高级选项
                                </button>
                            </div>
                        </div>

                        <!-- 智能建议卡片 -->
                        <div class="suggestion-card hidden mb-8 animate-scale-in">
                            <div class="card" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border: none; color: white;">
                                <div class="flex items-start gap-4">
                                    <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                        </svg>
                                    </div>
                                    <div class="flex-1">
                                        <h3 class="font-semibold mb-1" id="suggestion-title">智能建议</h3>
                                        <p class="text-white/90 text-sm mb-3" id="suggestion-description">
                                            基于内容分析的最佳格式推荐
                                        </p>
                                        <div class="flex items-center gap-2" id="suggestion-tags">
                                            <!-- 动态标签 -->
                                        </div>
                                    </div>
                                    <button class="apply-suggestion btn btn-ghost text-white border-white/30 hover:bg-white/10">
                                        应用建议
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- 高级选项面板 -->
                        <div class="advanced-panel hidden">
                            <div class="card animate-slide-up">
                                <div class="flex items-center justify-between mb-6">
                                    <h3 class="text-lg font-semibold text-gray-900">高级选项</h3>
                                    <button class="close-advanced btn btn-ghost btn-sm">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>
                                
                                <div class="grid gap-6">
                                    <!-- 格式选择 -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-3">输出格式</label>
                                        <div class="grid sm:grid-cols-3 gap-3">
                                            <label class="format-option cursor-pointer">
                                                <input type="radio" name="format" value="docx" class="hidden" checked>
                                                <div class="format-card p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-all hover-lift">
                                                    <div class="flex items-center gap-3">
                                                        <div class="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-lg">
                                                            📄
                                                        </div>
                                                        <div>
                                                            <div class="font-medium text-gray-900">Word文档</div>
                                                            <div class="text-xs text-gray-500">适合文本内容</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                            
                                            <label class="format-option cursor-pointer">
                                                <input type="radio" name="format" value="xlsx" class="hidden">
                                                <div class="format-card p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-all hover-lift">
                                                    <div class="flex items-center gap-3">
                                                        <div class="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-lg">
                                                            📊
                                                        </div>
                                                        <div>
                                                            <div class="font-medium text-gray-900">Excel表格</div>
                                                            <div class="text-xs text-gray-500">适合数据分析</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                            
                                            <label class="format-option cursor-pointer">
                                                <input type="radio" name="format" value="pdf" class="hidden">
                                                <div class="format-card p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-all hover-lift">
                                                    <div class="flex items-center gap-3">
                                                        <div class="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-lg">
                                                            📄
                                                        </div>
                                                        <div>
                                                            <div class="font-medium text-gray-900">PDF文档</div>
                                                            <div class="text-xs text-gray-500">适合正式文档</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <!-- 模板选择 -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-3">文档模板</label>
                                        <select class="input">
                                            <option value="professional">专业模板</option>
                                            <option value="simple">简约模板</option>
                                            <option value="academic">学术模板</option>
                                            <option value="creative">创意模板</option>
                                        </select>
                                    </div>

                                    <!-- 高级设置 -->
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-3">高级设置</label>
                                        <div class="space-y-3">
                                            <label class="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" class="w-4 h-4 text-blue-600 rounded">
                                                <span class="text-sm text-gray-700">保留原始格式</span>
                                            </label>
                                            <label class="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" class="w-4 h-4 text-blue-600 rounded">
                                                <span class="text-sm text-gray-700">包含元数据</span>
                                            </label>
                                            <label class="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" class="w-4 h-4 text-blue-600 rounded">
                                                <span class="text-sm text-gray-700">移动端优化</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <!-- 底部状态栏 -->
                <footer class="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50">
                    <div class="container py-3">
                        <div class="flex items-center justify-between text-sm text-gray-600">
                            <div class="flex items-center gap-2">
                                <span class="status-dot success"></span>
                                <span>系统就绪</span>
                            </div>
                            <div>今日转换: <span class="font-medium text-gray-900">0</span> 次</div>
                        </div>
                    </div>
                </footer>
            </div>
        `;
    }

    /**
     * 设置交互功能
     */
    setupInteractions() {
        this.setupSmartInput();
        this.setupFormatSelector();
        this.setupThemeToggle();
        this.setupAdvancedPanel();
    }

    /**
     * 设置智能输入框
     */
    setupSmartInput() {
        const input = document.querySelector('.smart-input');
        const statusDot = document.getElementById('status-dot');
        const statusText = document.getElementById('status-text');
        const charCount = document.getElementById('char-count');

        if (!input) return;

        input.addEventListener('input', (e) => {
            const content = e.target.value;
            const length = content.length;
            
            this.state.content = content;
            charCount.textContent = `${length} 字符`;
            
            if (length === 0) {
                statusDot.className = 'status-dot';
                statusText.textContent = '等待输入';
                this.hideSuggestion();
            } else if (length < 50) {
                statusDot.className = 'status-dot warning';
                statusText.textContent = '内容较少';
                this.hideSuggestion();
            } else {
                statusDot.className = 'status-dot processing';
                statusText.textContent = '正在分析...';
                this.state.isAnalyzing = true;
                
                // 模拟智能分析
                setTimeout(() => {
                    this.analyzeContent(content);
                }, 1500);
            }
        });
    }

    /**
     * 分析内容并显示建议
     */
    analyzeContent(content) {
        // 简单的内容分析逻辑
        let suggestion = {
            format: 'docx',
            title: '建议生成Word文档',
            description: '检测到完整的文档结构，适合Word格式',
            tags: ['文档结构', '85% 匹配']
        };

        // 检测表格
        if (content.includes('|') && content.split('\n').filter(line => line.includes('|')).length > 2) {
            suggestion = {
                format: 'xlsx',
                title: '建议生成Excel表格',
                description: '检测到规整的表格数据，Excel格式最适合数据展示和分析',
                tags: ['表格数据', '95% 匹配']
            };
        }

        // 检测代码
        if (content.includes('```') || content.includes('function') || content.includes('class')) {
            suggestion.tags.push('代码片段');
        }

        this.state.suggestion = suggestion;
        this.showSuggestion(suggestion);
        
        // 更新状态
        const statusDot = document.getElementById('status-dot');
        const statusText = document.getElementById('status-text');
        statusDot.className = 'status-dot success';
        statusText.textContent = '分析完成';
        this.state.isAnalyzing = false;
    }

    /**
     * 显示智能建议
     */
    showSuggestion(suggestion) {
        const suggestionCard = document.querySelector('.suggestion-card');
        const title = document.getElementById('suggestion-title');
        const description = document.getElementById('suggestion-description');
        const tags = document.getElementById('suggestion-tags');

        if (suggestionCard && title && description && tags) {
            title.textContent = suggestion.title;
            description.textContent = suggestion.description;
            
            tags.innerHTML = suggestion.tags.map(tag => 
                `<span class="px-2 py-1 bg-white/20 rounded text-xs">${tag}</span>`
            ).join('');
            
            suggestionCard.classList.remove('hidden');
        }
    }

    /**
     * 隐藏建议
     */
    hideSuggestion() {
        const suggestionCard = document.querySelector('.suggestion-card');
        if (suggestionCard) {
            suggestionCard.classList.add('hidden');
        }
    }

    /**
     * 设置格式选择器
     */
    setupFormatSelector() {
        const formatOptions = document.querySelectorAll('.format-option');
        
        formatOptions.forEach(option => {
            const input = option.querySelector('input');
            const card = option.querySelector('.format-card');
            
            input.addEventListener('change', () => {
                // 重置所有选项
                formatOptions.forEach(opt => {
                    opt.querySelector('.format-card').className = 'format-card p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-all hover-lift';
                });
                
                // 高亮选中项
                if (input.checked) {
                    card.className = 'format-card p-4 border-2 border-blue-500 rounded-lg bg-blue-50 transition-all hover-lift';
                }
            });
        });
    }

    /**
     * 设置主题切换
     */
    setupThemeToggle() {
        const themeToggle = document.querySelector('.theme-toggle');
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    /**
     * 切换主题
     */
    toggleTheme() {
        const html = document.documentElement;
        const isDark = html.getAttribute('data-theme') === 'dark';
        
        if (isDark) {
            html.removeAttribute('data-theme');
            this.state.theme = 'light';
        } else {
            html.setAttribute('data-theme', 'dark');
            this.state.theme = 'dark';
        }
        
        this.showToast(`已切换到${this.state.theme === 'dark' ? '暗色' : '亮色'}主题`);
    }

    /**
     * 设置高级面板
     */
    setupAdvancedPanel() {
        const advancedToggle = document.querySelector('.advanced-toggle');
        const advancedPanel = document.querySelector('.advanced-panel');
        const closeAdvanced = document.querySelector('.close-advanced');
        
        if (advancedToggle) {
            advancedToggle.addEventListener('click', () => {
                this.toggleAdvancedPanel();
            });
        }
        
        if (closeAdvanced) {
            closeAdvanced.addEventListener('click', () => {
                this.toggleAdvancedPanel(false);
            });
        }
    }

    /**
     * 切换高级面板
     */
    toggleAdvancedPanel(show = null) {
        const panel = document.querySelector('.advanced-panel');
        if (!panel) return;
        
        const isVisible = !panel.classList.contains('hidden');
        const shouldShow = show !== null ? show : !isVisible;
        
        if (shouldShow) {
            panel.classList.remove('hidden');
        } else {
            panel.classList.add('hidden');
        }
    }

    /**
     * 设置动画
     */
    setupAnimations() {
        // 页面加载动画
        const elements = document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-scale-in');
        
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
        });
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 智能转换按钮
        const convertBtn = document.querySelector('.smart-convert-btn');
        if (convertBtn) {
            convertBtn.addEventListener('click', () => this.handleConvert());
        }
        
        // 应用建议按钮
        const applySuggestion = document.querySelector('.apply-suggestion');
        if (applySuggestion) {
            applySuggestion.addEventListener('click', () => this.applySuggestion());
        }
    }

    /**
     * 处理转换
     */
    async handleConvert() {
        if (!this.state.content.trim()) {
            this.showToast('请先输入内容', 'warning');
            return;
        }
        
        const convertBtn = document.querySelector('.smart-convert-btn');
        const originalHTML = convertBtn.innerHTML;
        
        // 显示加载状态
        convertBtn.innerHTML = `
            <svg class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
            转换中...
        `;
        convertBtn.disabled = true;
        
        try {
            // 模拟转换过程
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showToast('转换完成！文件已生成', 'success');
            
        } catch (error) {
            this.showToast('转换失败，请重试', 'error');
        } finally {
            // 恢复按钮状态
            convertBtn.innerHTML = originalHTML;
            convertBtn.disabled = false;
        }
    }

    /**
     * 应用建议
     */
    applySuggestion() {
        if (!this.state.suggestion) return;
        
        const formatInput = document.querySelector(`input[value="${this.state.suggestion.format}"]`);
        if (formatInput) {
            formatInput.checked = true;
            formatInput.dispatchEvent(new Event('change'));
        }
        
        this.showToast(`已应用建议：${this.state.suggestion.title}`, 'success');
    }

    /**
     * 显示提示消息
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 animate-slide-up max-w-sm`;
        
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-white',
            info: 'bg-blue-500 text-white'
        };
        
        toast.className += ` ${colors[type]}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ElegantUIController;
} else if (typeof window !== 'undefined') {
    window.ElegantUIController = ElegantUIController;
}

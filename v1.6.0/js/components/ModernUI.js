/**
 * Modern UI Components - 基于Shadcn/UI和Motion的现代化组件系统
 * 灵感来源: Shadcn/UI + Framer Motion + Tailwind CSS
 */

class ModernUIController {
    constructor() {
        this.components = new Map();
        this.animations = new Map();
        this.state = {
            theme: 'light',
            mode: 'simple',
            isAdvancedOpen: false
        };
        
        this.init();
    }

    /**
     * 初始化现代化UI系统
     */
    init() {
        this.createLayout();
        this.initializeComponents();
        this.setupAnimations();
        this.bindEvents();
        
        console.log('🎨 Modern UI System initialized');
    }

    /**
     * 创建现代化布局
     */
    createLayout() {
        const app = document.getElementById('app');
        if (!app) return;

        app.innerHTML = `
            <div class="min-h-screen" style="background: linear-gradient(135deg, hsl(210 40% 98%) 0%, hsl(220 60% 97%) 100%);">
                <!-- 现代化头部 -->
                <header class="glass-effect border-b border-white/20 sticky top-0 z-50">
                    <div class="container">
                        <div class="flex items-center justify-between py-4">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-lg">
                                    <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h1 class="text-xl font-bold gradient-text">AI内容转换工具</h1>
                                    <p class="text-sm text-muted">智能 • 高效 • 专业</p>
                                </div>
                            </div>
                            
                            <div class="flex items-center gap-3">
                                <div class="px-3 py-1 bg-white/50 rounded-full text-sm font-medium border border-white/20">
                                    v1.6.0
                                </div>
                                <div class="mode-indicator px-3 py-1 bg-white/30 rounded-full text-sm font-medium border border-white/20">
                                    简单模式
                                </div>
                                <button class="theme-toggle btn btn-ghost btn-sm rounded-full w-10 h-10 p-0">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                <!-- 主要内容区域 -->
                <main class="container py-8">
                    <div class="max-w-4xl mx-auto">
                        <!-- 智能输入卡片 -->
                        <div class="card mb-8 animate-fade-in">
                            <div class="text-center mb-6">
                                <h2 class="text-2xl font-bold mb-2">粘贴您的AI对话内容</h2>
                                <p class="text-muted">支持ChatGPT、Claude、文心一言等AI工具的对话内容</p>
                            </div>
                            
                            <div class="smart-input-wrapper relative">
                                <textarea 
                                    class="smart-input w-full min-h-[200px] p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    placeholder="Ctrl+V 粘贴内容，我们会自动识别最佳格式..."
                                ></textarea>
                                
                                <div class="flex items-center justify-between mt-4 text-sm text-muted">
                                    <div class="flex items-center gap-2">
                                        <div class="status-dot w-2 h-2 rounded-full bg-gray-300 transition-all"></div>
                                        <span class="status-text">等待输入</span>
                                    </div>
                                    <div class="char-count">0 字符</div>
                                </div>
                            </div>
                        </div>

                        <!-- 操作按钮区域 -->
                        <div class="text-center mb-8">
                            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                                <button class="smart-convert-btn btn btn-primary btn-lg hover-lift">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                                    </svg>
                                    智能转换
                                </button>
                                
                                <button class="advanced-toggle btn btn-secondary hover-lift">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                    高级选项
                                </button>
                            </div>
                            
                            <button class="mode-switch text-sm text-muted hover:text-primary transition-colors">
                                切换到高级模式
                            </button>
                        </div>

                        <!-- 智能建议卡片 -->
                        <div class="suggestion-card hidden card animate-scale-in" style="background: linear-gradient(135deg, hsl(142 76% 36%) 0%, hsl(158 64% 52%) 100%); color: white; border: none;">
                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <h3 class="font-semibold mb-1">建议生成Excel表格</h3>
                                    <p class="text-white/80 text-sm mb-3">检测到规整的表格数据，Excel格式最适合数据展示和分析</p>
                                    <div class="flex items-center gap-2">
                                        <span class="px-2 py-1 bg-white/20 rounded text-xs">表格数据</span>
                                        <span class="px-2 py-1 bg-white/20 rounded text-xs">95% 匹配</span>
                                    </div>
                                </div>
                                <button class="apply-suggestion btn btn-ghost text-white border-white/20 hover:bg-white/10">
                                    应用建议
                                </button>
                            </div>
                        </div>

                        <!-- 高级选项面板 -->
                        <div class="advanced-panel hidden">
                            <div class="card animate-slide-up">
                                <div class="flex items-center justify-between mb-6">
                                    <h3 class="text-lg font-semibold">高级选项</h3>
                                    <button class="close-advanced btn btn-ghost btn-sm">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>
                                
                                <div class="grid gap-6">
                                    <!-- 格式选择 -->
                                    <div>
                                        <label class="block text-sm font-medium mb-3">输出格式</label>
                                        <div class="grid sm:grid-cols-3 gap-3">
                                            <label class="format-option relative cursor-pointer">
                                                <input type="radio" name="format" value="docx" class="sr-only" checked>
                                                <div class="format-card p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-all">
                                                    <div class="flex items-center gap-3">
                                                        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            📄
                                                        </div>
                                                        <span class="font-medium">Word文档</span>
                                                    </div>
                                                </div>
                                            </label>
                                            
                                            <label class="format-option relative cursor-pointer">
                                                <input type="radio" name="format" value="xlsx" class="sr-only">
                                                <div class="format-card p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-all">
                                                    <div class="flex items-center gap-3">
                                                        <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                                            📊
                                                        </div>
                                                        <span class="font-medium">Excel表格</span>
                                                    </div>
                                                </div>
                                            </label>
                                            
                                            <label class="format-option relative cursor-pointer">
                                                <input type="radio" name="format" value="pdf" class="sr-only">
                                                <div class="format-card p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-all">
                                                    <div class="flex items-center gap-3">
                                                        <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                                            📄
                                                        </div>
                                                        <span class="font-medium">PDF文档</span>
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <!-- 模板选择 -->
                                    <div>
                                        <label class="block text-sm font-medium mb-3">文档模板</label>
                                        <select class="input w-full">
                                            <option value="professional">专业模板</option>
                                            <option value="simple">简约模板</option>
                                            <option value="academic">学术模板</option>
                                            <option value="creative">创意模板</option>
                                        </select>
                                    </div>

                                    <!-- 文件名设置 -->
                                    <div>
                                        <label class="block text-sm font-medium mb-3">文件名</label>
                                        <input type="text" class="input w-full" placeholder="自动生成文件名">
                                    </div>

                                    <!-- 高级设置 -->
                                    <div>
                                        <label class="block text-sm font-medium mb-3">高级设置</label>
                                        <div class="space-y-3">
                                            <label class="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" class="w-4 h-4 text-blue-600 rounded">
                                                <span class="text-sm">保留原始格式</span>
                                            </label>
                                            <label class="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" class="w-4 h-4 text-blue-600 rounded">
                                                <span class="text-sm">包含元数据</span>
                                            </label>
                                            <label class="flex items-center gap-2 cursor-pointer">
                                                <input type="checkbox" class="w-4 h-4 text-blue-600 rounded">
                                                <span class="text-sm">移动端优化</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <!-- 现代化底部 -->
                <footer class="glass-effect border-t border-white/20 mt-16">
                    <div class="container py-4">
                        <div class="flex items-center justify-between text-sm text-muted">
                            <div>系统就绪 • 基于最新AI技术</div>
                            <div>今日转换: <span class="font-medium">0</span> 次</div>
                        </div>
                    </div>
                </footer>
            </div>
        `;
    }

    /**
     * 初始化组件
     */
    initializeComponents() {
        // 智能输入框
        this.initSmartInput();
        
        // 格式选择器
        this.initFormatSelector();
        
        // 主题切换
        this.initThemeToggle();
        
        // 模式切换
        this.initModeToggle();
    }

    /**
     * 初始化智能输入框
     */
    initSmartInput() {
        const input = document.querySelector('.smart-input');
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        const charCount = document.querySelector('.char-count');

        if (!input) return;

        input.addEventListener('input', (e) => {
            const content = e.target.value;
            const length = content.length;
            
            // 更新字符计数
            charCount.textContent = `${length} 字符`;
            
            // 更新状态
            if (length === 0) {
                statusDot.className = 'status-dot w-2 h-2 rounded-full bg-gray-300 transition-all';
                statusText.textContent = '等待输入';
            } else if (length < 50) {
                statusDot.className = 'status-dot w-2 h-2 rounded-full bg-yellow-400 transition-all';
                statusText.textContent = '内容较少';
            } else {
                statusDot.className = 'status-dot w-2 h-2 rounded-full bg-green-500 transition-all animate-pulse';
                statusText.textContent = '正在分析...';
                
                // 模拟分析过程
                setTimeout(() => {
                    statusDot.className = 'status-dot w-2 h-2 rounded-full bg-blue-500 transition-all';
                    statusText.textContent = '准备转换';
                    this.showSuggestion();
                }, 1500);
            }
        });
    }

    /**
     * 显示智能建议
     */
    showSuggestion() {
        const suggestionCard = document.querySelector('.suggestion-card');
        if (suggestionCard) {
            suggestionCard.classList.remove('hidden');
        }
    }

    /**
     * 初始化格式选择器
     */
    initFormatSelector() {
        const formatOptions = document.querySelectorAll('.format-option');
        
        formatOptions.forEach(option => {
            const input = option.querySelector('input');
            const card = option.querySelector('.format-card');
            
            input.addEventListener('change', () => {
                // 重置所有选项
                formatOptions.forEach(opt => {
                    opt.querySelector('.format-card').className = 'format-card p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-all';
                });
                
                // 高亮选中项
                if (input.checked) {
                    card.className = 'format-card p-4 border-2 border-blue-500 rounded-lg bg-blue-50 transition-all';
                }
            });
        });
    }

    /**
     * 初始化主题切换
     */
    initThemeToggle() {
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
        const isDark = html.classList.contains('dark');
        
        if (isDark) {
            html.classList.remove('dark');
            this.state.theme = 'light';
        } else {
            html.classList.add('dark');
            this.state.theme = 'dark';
        }
        
        this.showMessage(`已切换到${this.state.theme === 'dark' ? '暗色' : '亮色'}主题`, 'info');
    }

    /**
     * 初始化模式切换
     */
    initModeToggle() {
        const modeSwitch = document.querySelector('.mode-switch');
        const advancedToggle = document.querySelector('.advanced-toggle');
        const modeIndicator = document.querySelector('.mode-indicator');
        
        if (modeSwitch) {
            modeSwitch.addEventListener('click', () => {
                this.toggleMode();
            });
        }
        
        if (advancedToggle) {
            advancedToggle.addEventListener('click', () => {
                this.toggleAdvancedPanel();
            });
        }
    }

    /**
     * 切换模式
     */
    toggleMode() {
        const modeSwitch = document.querySelector('.mode-switch');
        const modeIndicator = document.querySelector('.mode-indicator');
        
        if (this.state.mode === 'simple') {
            this.state.mode = 'advanced';
            modeSwitch.textContent = '切换到简单模式';
            modeIndicator.textContent = '高级模式';
            this.toggleAdvancedPanel(true);
        } else {
            this.state.mode = 'simple';
            modeSwitch.textContent = '切换到高级模式';
            modeIndicator.textContent = '简单模式';
            this.toggleAdvancedPanel(false);
        }
        
        this.showMessage(`已切换到${this.state.mode === 'simple' ? '简单' : '高级'}模式`, 'info');
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
            this.state.isAdvancedOpen = true;
        } else {
            panel.classList.add('hidden');
            this.state.isAdvancedOpen = false;
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
        
        // 关闭高级面板
        const closeAdvanced = document.querySelector('.close-advanced');
        if (closeAdvanced) {
            closeAdvanced.addEventListener('click', () => this.toggleAdvancedPanel(false));
        }
    }

    /**
     * 处理转换
     */
    async handleConvert() {
        const input = document.querySelector('.smart-input');
        const content = input?.value?.trim();
        
        if (!content) {
            this.showMessage('请先输入内容', 'warning');
            return;
        }
        
        const convertBtn = document.querySelector('.smart-convert-btn');
        const originalText = convertBtn.innerHTML;
        
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
            
            this.showMessage('转换完成！文件已生成', 'success');
            
        } catch (error) {
            this.showMessage('转换失败，请重试', 'error');
        } finally {
            // 恢复按钮状态
            convertBtn.innerHTML = originalText;
            convertBtn.disabled = false;
        }
    }

    /**
     * 应用建议
     */
    applySuggestion() {
        // 自动选择Excel格式
        const excelOption = document.querySelector('input[value="xlsx"]');
        if (excelOption) {
            excelOption.checked = true;
            excelOption.dispatchEvent(new Event('change'));
        }
        
        this.showMessage('已应用建议：Excel表格格式', 'success');
    }

    /**
     * 显示消息
     */
    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 animate-slide-up`;
        
        const colors = {
            success: 'bg-green-500 text-white',
            error: 'bg-red-500 text-white',
            warning: 'bg-yellow-500 text-white',
            info: 'bg-blue-500 text-white'
        };
        
        messageEl.className += ` ${colors[type]}`;
        messageEl.textContent = message;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ModernUIController;
} else if (typeof window !== 'undefined') {
    window.ModernUIController = ModernUIController;
}

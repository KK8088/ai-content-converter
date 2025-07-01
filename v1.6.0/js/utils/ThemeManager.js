/**
 * 主题管理器
 * 支持亮色主题和Dark Cyber主题切换
 */

class ThemeManager {
    constructor() {
        this.themes = {
            light: {
                name: 'Fluid Design 2025',
                description: '现代化亮色主题',
                cssFile: 'css/fluid-design.css',
                icon: '☀️'
            },
            dark: {
                name: 'Dark Cyber 2025',
                description: '酷炫黑色赛博朋克主题',
                cssFile: 'css/dark-cyber-theme.css',
                icon: '🌙'
            }
        };
        
        this.currentTheme = 'light';
        this.themeToggleBtn = null;
        this.callbacks = {
            onThemeChange: []
        };
        
        this.init();
    }

    /**
     * 初始化主题管理器
     */
    init() {
        this.loadSavedTheme();
        this.createThemeToggle();
        this.bindEvents();
    }

    /**
     * 创建主题切换按钮
     */
    createThemeToggle() {
        // 查找合适的位置插入主题切换按钮
        const versionInfo = document.querySelector('.version-info');
        if (versionInfo) {
            this.themeToggleBtn = document.createElement('button');
            this.themeToggleBtn.className = 'theme-toggle-btn';
            this.themeToggleBtn.innerHTML = this.getToggleButtonHTML();
            
            versionInfo.appendChild(this.themeToggleBtn);
            
            // 添加样式
            this.addToggleButtonStyles();
        }
    }

    /**
     * 获取切换按钮HTML
     */
    getToggleButtonHTML() {
        const nextTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        const nextThemeInfo = this.themes[nextTheme];
        
        return `
            <span class="theme-icon">${nextThemeInfo.icon}</span>
            <span class="theme-text">${nextThemeInfo.name}</span>
        `;
    }

    /**
     * 添加切换按钮样式
     */
    addToggleButtonStyles() {
        if (!document.getElementById('theme-toggle-styles')) {
            const styles = document.createElement('style');
            styles.id = 'theme-toggle-styles';
            styles.textContent = `
                .theme-toggle-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: var(--glass-bg, rgba(255, 255, 255, 0.8));
                    border: 1px solid var(--border-light, #e5e7eb);
                    border-radius: 20px;
                    font-family: inherit;
                    font-size: 12px;
                    font-weight: 500;
                    color: var(--text-secondary, #6b7280);
                    cursor: pointer;
                    transition: all 0.3s ease;
                    backdrop-filter: blur(20px);
                }

                .theme-toggle-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    border-color: var(--primary-solid, #6366f1);
                    color: var(--primary-solid, #6366f1);
                }

                .theme-icon {
                    font-size: 14px;
                }

                .theme-text {
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                /* Dark主题下的样式 */
                [data-theme="dark"] .theme-toggle-btn {
                    background: var(--glass-bg);
                    border-color: var(--border-primary);
                    color: var(--text-secondary);
                }

                [data-theme="dark"] .theme-toggle-btn:hover {
                    border-color: var(--neon-blue);
                    color: var(--neon-blue);
                    box-shadow: var(--glow-blue);
                }
            `;
            document.head.appendChild(styles);
        }
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // 键盘快捷键 Ctrl+Shift+T
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    /**
     * 切换主题
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    }

    /**
     * 设置主题
     * @param {string} themeName - 主题名称
     */
    setTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`主题 "${themeName}" 不存在`);
            return;
        }

        const oldTheme = this.currentTheme;
        this.currentTheme = themeName;

        // 更新CSS
        this.updateThemeCSS(themeName);
        
        // 更新HTML属性
        document.documentElement.setAttribute('data-theme', themeName);
        document.body.setAttribute('data-theme', themeName);
        
        // 更新切换按钮
        this.updateToggleButton();
        
        // 保存主题偏好
        this.saveTheme();
        
        // 显示切换消息
        this.showThemeChangeMessage(themeName);
        
        // 触发回调
        this.triggerCallback('onThemeChange', {
            oldTheme,
            newTheme: themeName,
            themeInfo: this.themes[themeName]
        });
    }

    /**
     * 更新主题CSS
     * @param {string} themeName - 主题名称
     */
    updateThemeCSS(themeName) {
        const themeInfo = this.themes[themeName];
        
        // 移除旧的主题CSS
        const existingThemeLink = document.querySelector('link[data-theme-css]');
        if (existingThemeLink) {
            existingThemeLink.remove();
        }
        
        // 添加新的主题CSS
        if (themeName === 'dark') {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = themeInfo.cssFile;
            link.setAttribute('data-theme-css', 'true');
            document.head.appendChild(link);
        }
    }

    /**
     * 更新切换按钮
     */
    updateToggleButton() {
        if (this.themeToggleBtn) {
            this.themeToggleBtn.innerHTML = this.getToggleButtonHTML();
        }
    }

    /**
     * 显示主题切换消息
     * @param {string} themeName - 主题名称
     */
    showThemeChangeMessage(themeName) {
        const themeInfo = this.themes[themeName];
        const message = `已切换到 ${themeInfo.name}`;
        
        // 创建消息元素
        const messageEl = document.createElement('div');
        messageEl.className = this.currentTheme === 'dark' 
            ? 'message-cyber info' 
            : 'message message-info';
        messageEl.textContent = message;
        
        // 添加样式
        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '8px',
            fontWeight: '600',
            zIndex: '1000',
            animation: 'slideIn 0.3s ease-out'
        });
        
        document.body.appendChild(messageEl);
        
        // 自动移除
        setTimeout(() => {
            messageEl.remove();
        }, 2000);
    }

    /**
     * 保存主题偏好
     */
    saveTheme() {
        try {
            localStorage.setItem('theme_preference', JSON.stringify({
                theme: this.currentTheme,
                timestamp: Date.now()
            }));
        } catch (error) {
            console.warn('保存主题偏好失败:', error);
        }
    }

    /**
     * 加载保存的主题
     */
    loadSavedTheme() {
        try {
            const saved = localStorage.getItem('theme_preference');
            if (saved) {
                const preference = JSON.parse(saved);
                if (this.themes[preference.theme]) {
                    this.setTheme(preference.theme);
                }
            }
        } catch (error) {
            console.warn('加载主题偏好失败:', error);
        }
    }

    /**
     * 获取当前主题
     * @returns {string} 当前主题名称
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * 获取主题信息
     * @param {string} themeName - 主题名称
     * @returns {Object} 主题信息
     */
    getThemeInfo(themeName) {
        return this.themes[themeName] || null;
    }

    /**
     * 获取所有主题
     * @returns {Object} 所有主题信息
     */
    getAllThemes() {
        return { ...this.themes };
    }

    /**
     * 注册主题切换回调
     * @param {Function} callback - 回调函数
     */
    onThemeChange(callback) {
        if (typeof callback === 'function') {
            this.callbacks.onThemeChange.push(callback);
        }
    }

    /**
     * 触发回调
     * @param {string} event - 事件名称
     * @param {*} data - 数据
     */
    triggerCallback(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`主题回调执行失败 (${event}):`, error);
                }
            });
        }
    }

    /**
     * 检测系统主题偏好
     * @returns {string} 系统偏好的主题
     */
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    /**
     * 自动跟随系统主题
     * @param {boolean} enable - 是否启用
     */
    setAutoFollowSystem(enable) {
        if (enable) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            
            const handleChange = (e) => {
                const systemTheme = e.matches ? 'dark' : 'light';
                this.setTheme(systemTheme);
            };
            
            mediaQuery.addListener(handleChange);
            
            // 立即应用系统主题
            const systemTheme = this.detectSystemTheme();
            this.setTheme(systemTheme);
            
            // 保存监听器引用以便后续移除
            this._systemThemeListener = handleChange;
            this._systemMediaQuery = mediaQuery;
        } else {
            // 移除系统主题监听
            if (this._systemMediaQuery && this._systemThemeListener) {
                this._systemMediaQuery.removeListener(this._systemThemeListener);
                this._systemThemeListener = null;
                this._systemMediaQuery = null;
            }
        }
    }

    /**
     * 销毁主题管理器
     */
    destroy() {
        // 移除切换按钮
        if (this.themeToggleBtn) {
            this.themeToggleBtn.remove();
            this.themeToggleBtn = null;
        }
        
        // 移除样式
        const styles = document.getElementById('theme-toggle-styles');
        if (styles) {
            styles.remove();
        }
        
        // 移除系统主题监听
        this.setAutoFollowSystem(false);
        
        // 清空回调
        this.callbacks = { onThemeChange: [] };
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
} else if (typeof window !== 'undefined') {
    window.ThemeManager = ThemeManager;
}

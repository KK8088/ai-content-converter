/**
 * 双语切换器脚本文件
 * 
 * @description 为README.md双语切换功能提供交互支持
 * @version 1.0.0
 * @author zk0x01
 */

class LanguageSwitcher {
    constructor() {
        this.currentLanguage = 'zh';
        this.supportedLanguages = ['zh', 'en'];
        this.animationDuration = 300;
        this.init();
    }

    /**
     * 初始化语言切换器
     */
    init() {
        this.loadSavedLanguage();
        this.bindEvents();
        this.setupKeyboardShortcuts();
        this.setupAccessibility();
        
        // 确保页面加载完成后设置正确的语言
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.switchLanguage(this.currentLanguage, false);
            });
        } else {
            this.switchLanguage(this.currentLanguage, false);
        }
    }

    /**
     * 加载保存的语言设置
     */
    loadSavedLanguage() {
        const savedLang = localStorage.getItem('preferred-language');
        const browserLang = navigator.language.toLowerCase();
        
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.currentLanguage = savedLang;
        } else if (browserLang.startsWith('zh')) {
            this.currentLanguage = 'zh';
        } else {
            this.currentLanguage = 'en';
        }
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 为语言按钮绑定点击事件
        this.supportedLanguages.forEach(lang => {
            const button = document.getElementById(`lang-${lang}`);
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.switchLanguage(lang);
                });
            }
        });

        // 监听浏览器语言变化
        window.addEventListener('languagechange', () => {
            this.loadSavedLanguage();
            this.switchLanguage(this.currentLanguage);
        });
    }

    /**
     * 设置键盘快捷键
     */
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + 1: 切换到中文
            if ((e.ctrlKey || e.metaKey) && e.key === '1') {
                e.preventDefault();
                this.switchLanguage('zh');
                this.showShortcutFeedback('中文');
            }
            // Ctrl/Cmd + 2: 切换到英文
            else if ((e.ctrlKey || e.metaKey) && e.key === '2') {
                e.preventDefault();
                this.switchLanguage('en');
                this.showShortcutFeedback('English');
            }
            // Alt + L: 切换语言
            else if (e.altKey && e.key.toLowerCase() === 'l') {
                e.preventDefault();
                const nextLang = this.currentLanguage === 'zh' ? 'en' : 'zh';
                this.switchLanguage(nextLang);
            }
        });
    }

    /**
     * 设置无障碍访问
     */
    setupAccessibility() {
        // 为语言按钮添加ARIA属性
        this.supportedLanguages.forEach(lang => {
            const button = document.getElementById(`lang-${lang}`);
            if (button) {
                button.setAttribute('role', 'button');
                button.setAttribute('aria-pressed', lang === this.currentLanguage);
                button.setAttribute('tabindex', '0');
                
                // 添加键盘导航支持
                button.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.switchLanguage(lang);
                    }
                });
            }
        });
    }

    /**
     * 切换语言
     * @param {string} targetLang - 目标语言代码
     * @param {boolean} animate - 是否使用动画
     */
    switchLanguage(targetLang, animate = true) {
        if (!this.supportedLanguages.includes(targetLang)) {
            console.warn(`Unsupported language: ${targetLang}`);
            return;
        }

        if (targetLang === this.currentLanguage && animate) {
            return; // 已经是当前语言，无需切换
        }

        const currentContent = document.getElementById(`content-${this.currentLanguage}`);
        const targetContent = document.getElementById(`content-${targetLang}`);

        if (!targetContent) {
            console.error(`Content for language ${targetLang} not found`);
            return;
        }

        if (animate && currentContent) {
            this.animateLanguageSwitch(currentContent, targetContent, targetLang);
        } else {
            this.setLanguageContent(targetLang);
        }
    }

    /**
     * 动画切换语言内容
     * @param {HTMLElement} currentContent - 当前内容元素
     * @param {HTMLElement} targetContent - 目标内容元素
     * @param {string} targetLang - 目标语言代码
     */
    animateLanguageSwitch(currentContent, targetContent, targetLang) {
        // 添加淡出动画
        currentContent.classList.add('fade-out');
        
        setTimeout(() => {
            this.setLanguageContent(targetLang);
            
            // 移除动画类
            setTimeout(() => {
                currentContent.classList.remove('fade-out');
            }, 50);
        }, this.animationDuration);
    }

    /**
     * 设置语言内容显示
     * @param {string} targetLang - 目标语言代码
     */
    setLanguageContent(targetLang) {
        // 隐藏所有语言内容
        this.supportedLanguages.forEach(lang => {
            const content = document.getElementById(`content-${lang}`);
            if (content) {
                content.style.display = 'none';
            }
        });

        // 显示目标语言内容
        const targetContent = document.getElementById(`content-${targetLang}`);
        if (targetContent) {
            targetContent.style.display = 'block';
        }

        // 更新按钮状态
        this.updateButtonStates(targetLang);

        // 更新当前语言
        this.currentLanguage = targetLang;

        // 保存用户选择
        this.saveLanguagePreference(targetLang);

        // 更新页面标题
        this.updatePageTitle(targetLang);

        // 平滑滚动到顶部
        this.scrollToTop();

        // 触发语言切换事件
        this.dispatchLanguageChangeEvent(targetLang);
    }

    /**
     * 更新按钮状态
     * @param {string} activeLang - 激活的语言代码
     */
    updateButtonStates(activeLang) {
        this.supportedLanguages.forEach(lang => {
            const button = document.getElementById(`lang-${lang}`);
            if (button) {
                if (lang === activeLang) {
                    button.classList.add('active');
                    button.setAttribute('aria-pressed', 'true');
                } else {
                    button.classList.remove('active');
                    button.setAttribute('aria-pressed', 'false');
                }
            }
        });
    }

    /**
     * 保存语言偏好设置
     * @param {string} lang - 语言代码
     */
    saveLanguagePreference(lang) {
        try {
            localStorage.setItem('preferred-language', lang);
        } catch (e) {
            console.warn('Unable to save language preference:', e);
        }
    }

    /**
     * 更新页面标题
     * @param {string} lang - 语言代码
     */
    updatePageTitle(lang) {
        const titles = {
            zh: '🚀 AI内容格式转换工具 - 开源版',
            en: '🚀 AI Content Format Converter - Open Source Edition'
        };

        if (titles[lang]) {
            document.title = titles[lang];
        }
    }

    /**
     * 平滑滚动到顶部
     */
    scrollToTop() {
        if (window.scrollY > 100) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    /**
     * 显示快捷键反馈
     * @param {string} langName - 语言名称
     */
    showShortcutFeedback(langName) {
        // 创建反馈提示
        const feedback = document.createElement('div');
        feedback.textContent = `Switched to ${langName}`;
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(102, 126, 234, 0.9);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
        `;

        document.body.appendChild(feedback);

        // 3秒后移除反馈
        setTimeout(() => {
            feedback.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(feedback);
            }, 300);
        }, 2000);
    }

    /**
     * 触发语言切换事件
     * @param {string} lang - 新语言代码
     */
    dispatchLanguageChangeEvent(lang) {
        const event = new CustomEvent('languagechange', {
            detail: {
                language: lang,
                previousLanguage: this.currentLanguage
            }
        });
        window.dispatchEvent(event);
    }

    /**
     * 获取当前语言
     * @returns {string} 当前语言代码
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * 获取支持的语言列表
     * @returns {string[]} 支持的语言代码数组
     */
    getSupportedLanguages() {
        return [...this.supportedLanguages];
    }
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// 全局实例
let languageSwitcher;

// 初始化语言切换器
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        languageSwitcher = new LanguageSwitcher();
    });
} else {
    languageSwitcher = new LanguageSwitcher();
}

// 导出全局函数以保持向后兼容
window.switchLanguage = function(lang) {
    if (languageSwitcher) {
        languageSwitcher.switchLanguage(lang);
    }
};

// 导出类以供其他脚本使用
window.LanguageSwitcher = LanguageSwitcher;

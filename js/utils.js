/**
 * AI内容格式转换工具 - 工具函数库
 * 
 * @description 通用工具函数和辅助方法
 * @version 1.4.0
 * @author zk0x01
 */

/**
 * 工具函数命名空间
 */
const Utils = {
    
    /**
     * 字符串处理工具
     */
    string: {
        /**
         * 清理单元格内容
         * @param {string} content - 原始内容
         * @returns {string} 清理后的内容
         */
        cleanCellContent(content) {
            if (!content) return '';

            // 确保输入是字符串
            let cleaned = String(content).trim();

            // 防止XSS攻击 - 移除潜在的脚本标签
            cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            cleaned = cleaned.replace(/javascript:/gi, '');
            cleaned = cleaned.replace(/on\w+\s*=/gi, '');

            // 移除Markdown格式标记
            cleaned = cleaned
                .replace(/\*\*(.*?)\*\*/g, '$1')     // 移除加粗标记
                .replace(/\*(.*?)\*/g, '$1')         // 移除斜体标记
                .replace(/`(.*?)`/g, '$1')           // 移除代码标记
                .replace(/~~(.*?)~~/g, '$1')         // 移除删除线标记
                .replace(/__(.*?)__/g, '$1')         // 移除下划线加粗
                .replace(/_(.*?)_/g, '$1');          // 移除下划线斜体

            // 移除HTML标记（保留安全的实体）
            cleaned = cleaned.replace(/<[^>]*>/g, '');

            // 处理HTML实体
            const entityMap = {
                '&nbsp;': ' ',
                '&amp;': '&',
                '&lt;': '<',
                '&gt;': '>',
                '&quot;': '"',
                '&#39;': "'"
            };

            Object.keys(entityMap).forEach(entity => {
                cleaned = cleaned.replace(new RegExp(entity, 'g'), entityMap[entity]);
            });

            // 移除多余的空白字符
            cleaned = cleaned.replace(/\s+/g, ' ').trim();

            // 限制长度防止过长内容
            if (cleaned.length > 10000) {
                cleaned = cleaned.substring(0, 10000) + '...';
            }

            return cleaned;
        },

        /**
         * 生成智能文件名
         * @param {string} content - 文档内容
         * @param {string} format - 输出格式
         * @returns {string} 生成的文件名
         */
        generateFileName(content, format) {
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
            
            // 尝试从内容中提取标题
            const titleMatch = content.match(/^#\s+(.+)$/m);
            if (titleMatch) {
                const title = titleMatch[1].trim().slice(0, 30);
                const cleanTitle = title.replace(/[^\w\u4e00-\u9fa5\s-]/g, '').trim();
                if (cleanTitle) {
                    return `${cleanTitle}_${timestamp}.${format}`;
                }
            }
            
            // 默认文件名
            return `AI转换文档_${timestamp}.${format}`;
        },

        /**
         * 截断文本
         * @param {string} text - 原始文本
         * @param {number} maxLength - 最大长度
         * @param {string} suffix - 后缀
         * @returns {string} 截断后的文本
         */
        truncate(text, maxLength = 100, suffix = '...') {
            if (!text || text.length <= maxLength) return text;
            return text.slice(0, maxLength - suffix.length) + suffix;
        },

        /**
         * 统计文本信息 - 增强版
         * @param {string} text - 文本内容
         * @returns {object} 统计信息
         */
        getTextStats(text) {
            if (!text) return {
                chars: 0,
                words: 0,
                lines: 0,
                tables: 0,
                codeBlocks: 0,
                links: 0,
                images: 0,
                headings: 0,
                lists: 0
            };

            const chars = text.length;
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            const lines = text.split('\n').length;

            // 表格统计（更精确）
            const tableRows = text.match(/^\|.*\|$/gm) || [];
            const tables = Math.max(0, Math.floor(tableRows.length / 2)); // 假设表格至少有2行

            // 代码块统计
            const codeBlocks = (text.match(/```[\s\S]*?```/g) || []).length +
                              (text.match(/`[^`\n]+`/g) || []).length;

            // 链接统计
            const links = (text.match(/\[.*?\]\(.*?\)/g) || []).length;

            // 图片统计
            const images = (text.match(/!\[.*?\]\(.*?\)/g) || []).length;

            // 标题统计
            const headings = (text.match(/^#{1,6}\s+.*/gm) || []).length;

            // 列表统计
            const lists = (text.match(/^[\s]*[-*+]\s+/gm) || []).length +
                         (text.match(/^[\s]*\d+\.\s+/gm) || []).length;

            return {
                chars,
                words,
                lines,
                tables,
                codeBlocks,
                links,
                images,
                headings,
                lists
            };
        }
    },

    /**
     * 数据类型检测工具
     */
    dataType: {
        /**
         * 检测是否为数字
         * @param {string} str - 待检测字符串
         * @returns {boolean} 是否为数字
         */
        isNumeric(str) {
            if (!str || typeof str !== 'string') return false;
            
            // 移除常见的非数字字符但保留数字结构
            const cleanStr = str.replace(/[¥$€£₹₽,\s]/g, '').replace(/[()]/g, '');
            
            // 检查百分比
            if (cleanStr.endsWith('%')) {
                const numPart = cleanStr.slice(0, -1);
                return !isNaN(numPart) && !isNaN(parseFloat(numPart)) && numPart !== '';
            }
            
            // 检查普通数字（包括负数和小数）
            if (/^-?\d+(\.\d+)?$/.test(cleanStr)) {
                return true;
            }
            
            // 检查科学计数法
            if (/^-?\d+(\.\d+)?[eE][+-]?\d+$/.test(cleanStr)) {
                return true;
            }
            
            return false;
        },

        /**
         * 提取数字值
         * @param {string} str - 包含数字的字符串
         * @returns {number|null} 提取的数字值
         */
        extractNumericValue(str) {
            if (!str || typeof str !== 'string') return null;
            
            // 处理百分比
            if (str.includes('%')) {
                const numStr = str.replace(/[¥$€£₹₽,\s%]/g, '');
                const num = parseFloat(numStr);
                return isNaN(num) ? null : num / 100; // 转换为小数
            }
            
            // 处理负数（括号表示）
            let cleanStr = str;
            let isNegative = false;
            if (str.includes('(') && str.includes(')')) {
                cleanStr = str.replace(/[()]/g, '');
                isNegative = true;
            }
            
            // 移除货币符号和逗号，保留小数点和负号
            cleanStr = cleanStr.replace(/[¥$€£₹₽,\s]/g, '');
            
            const num = parseFloat(cleanStr);
            if (isNaN(num)) return null;
            
            return isNegative ? -Math.abs(num) : num;
        },

        /**
         * 检测货币类型
         * @param {string} str - 待检测字符串
         * @returns {string|null} 货币符号
         */
        getCurrencyType(str) {
            if (!str || typeof str !== 'string') return null;
            
            // 按优先级检测货币符号
            if (str.includes('¥')) return '¥';
            if (str.includes('$')) return '$';
            if (str.includes('€')) return '€';
            if (str.includes('£')) return '£';
            if (str.includes('₹')) return '₹';
            if (str.includes('₽')) return '₽';
            
            // 检测货币单位词
            if (/元|人民币/i.test(str)) return '¥';
            if (/dollar|usd/i.test(str)) return '$';
            if (/euro|eur/i.test(str)) return '€';
            if (/pound|gbp/i.test(str)) return '£';
            
            return null;
        },

        /**
         * 检测是否为有效日期
         * @param {string} dateString - 日期字符串
         * @returns {boolean} 是否为有效日期
         */
        isValidDate(dateString) {
            if (!dateString || typeof dateString !== 'string') return false;
            
            const trimmed = dateString.trim();
            
            // 常见日期格式模式
            const datePatterns = [
                /^\d{4}[-/]\d{1,2}[-/]\d{1,2}$/,           // 2024-01-15, 2024/1/15
                /^\d{1,2}[-/]\d{1,2}[-/]\d{4}$/,           // 15-01-2024, 1/15/2024
                /^\d{4}年\d{1,2}月\d{1,2}日$/,             // 2024年1月15日
                /^\d{1,2}月\d{1,2}日$/,                    // 1月15日
                /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/,  // 2024-01-15 10:30:00
                /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/,   // 2024-01-15T10:30:00
            ];
            
            // 检查是否匹配日期模式
            const matchesPattern = datePatterns.some(pattern => pattern.test(trimmed));
            if (!matchesPattern) return false;
            
            // 尝试解析日期
            let date;
            try {
                // 处理中文日期格式
                if (trimmed.includes('年') && trimmed.includes('月')) {
                    const cleaned = trimmed.replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, '');
                    date = new Date(cleaned);
                } else {
                    date = new Date(trimmed);
                }
                
                // 检查日期是否有效且在合理范围内
                if (date instanceof Date && !isNaN(date)) {
                    const year = date.getFullYear();
                    return year >= 1900 && year <= 2100; // 合理的年份范围
                }
            } catch (e) {
                return false;
            }
            
            return false;
        },

        /**
         * 检测数据格式类型
         * @param {string} str - 待检测字符串
         * @returns {string} 数据类型
         */
        detectDataFormat(str) {
            if (!str || typeof str !== 'string') return 'text';
            
            const trimmed = str.trim();
            
            // 检测百分比
            if (trimmed.includes('%') && this.isNumeric(trimmed)) {
                return 'percentage';
            }
            
            // 检测货币
            if (this.getCurrencyType(trimmed) && this.isNumeric(trimmed)) {
                return 'currency';
            }
            
            // 检测日期
            if (this.isValidDate(trimmed)) {
                return 'date';
            }
            
            // 检测数字
            if (this.isNumeric(trimmed)) {
                const num = this.extractNumericValue(trimmed);
                if (num !== null) {
                    return num % 1 === 0 ? 'integer' : 'decimal';
                }
            }
            
            // 检测布尔值
            if (/^(true|false|是|否|有|无|√|×)$/i.test(trimmed)) {
                return 'boolean';
            }
            
            return 'text';
        }
    },

    /**
     * 文件处理工具
     */
    file: {
        /**
         * 格式化文件大小
         * @param {number} bytes - 字节数
         * @returns {string} 格式化后的大小
         */
        formatFileSize(bytes) {
            if (bytes === 0) return '0 B';
            
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        /**
         * 检查文件类型
         * @param {File} file - 文件对象
         * @returns {boolean} 是否支持
         */
        isFileTypeSupported(file) {
            const supportedTypes = ['.md', '.txt'];
            const fileName = file.name.toLowerCase();
            return supportedTypes.some(type => fileName.endsWith(type));
        },

        /**
         * 读取文件内容
         * @param {File} file - 文件对象
         * @returns {Promise<string>} 文件内容
         */
        readFileContent(file) {
            return new Promise((resolve, reject) => {
                if (!file || !(file instanceof File)) {
                    reject(new Error('无效的文件对象'));
                    return;
                }

                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target && e.target.result) {
                        resolve(e.target.result);
                    } else {
                        reject(new Error('文件内容为空'));
                    }
                };
                reader.onerror = () => reject(new Error('文件读取失败'));
                reader.readAsText(file, 'UTF-8');
            });
        }
    },

    /**
     * 本地存储工具
     */
    storage: {
        /**
         * 设置存储项
         * @param {string} key - 键名
         * @param {any} value - 值
         */
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('本地存储失败:', e);
            }
        },

        /**
         * 获取存储项
         * @param {string} key - 键名
         * @param {any} defaultValue - 默认值
         * @returns {any} 存储的值
         */
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.warn('本地存储读取失败:', e);
                return defaultValue;
            }
        },

        /**
         * 移除存储项
         * @param {string} key - 键名
         */
        remove(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('本地存储删除失败:', e);
            }
        },

        /**
         * 清空所有存储
         */
        clear() {
            try {
                localStorage.clear();
            } catch (e) {
                console.warn('本地存储清空失败:', e);
            }
        }
    },

    /**
     * 日期时间工具
     */
    date: {
        /**
         * 格式化日期
         * @param {Date} date - 日期对象
         * @param {string} format - 格式字符串
         * @returns {string} 格式化后的日期
         */
        format(date, format = 'YYYY-MM-DD HH:mm:ss') {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            
            return format
                .replace('YYYY', year)
                .replace('MM', month)
                .replace('DD', day)
                .replace('HH', hours)
                .replace('mm', minutes)
                .replace('ss', seconds);
        },

        /**
         * 获取相对时间
         * @param {Date} date - 日期对象
         * @returns {string} 相对时间描述
         */
        getRelativeTime(date) {
            const now = new Date();
            const diff = now - date;
            const seconds = Math.floor(diff / 1000);
            const minutes = Math.floor(seconds / 60);
            const hours = Math.floor(minutes / 60);
            const days = Math.floor(hours / 24);
            
            if (days > 0) return `${days}天前`;
            if (hours > 0) return `${hours}小时前`;
            if (minutes > 0) return `${minutes}分钟前`;
            return '刚刚';
        }
    },

    /**
     * 防抖函数
     * @param {Function} func - 要防抖的函数
     * @param {number} wait - 等待时间
     * @returns {Function} 防抖后的函数
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
    },

    /**
     * 节流函数
     * @param {Function} func - 要节流的函数
     * @param {number} limit - 限制时间
     * @returns {Function} 节流后的函数
     */
    throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * 深拷贝对象
     * @param {any} obj - 要拷贝的对象
     * @returns {any} 拷贝后的对象
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }
};

// 导出工具函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}

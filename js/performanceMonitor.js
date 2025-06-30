/**
 * AI内容格式转换工具 - 性能监控模块
 * 
 * @description 监控应用性能，收集性能指标和用户体验数据
 * @version 1.4.0
 * @author zk0x01
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.observers = [];
        this.isEnabled = true;
        this.reportInterval = 30000; // 30秒报告一次
        this.maxMetrics = 1000; // 最大保存的指标数量
        
        this.init();
    }

    /**
     * 初始化性能监控
     */
    init() {
        if (!this.isEnabled) return;

        // 监控页面加载性能
        this.monitorPageLoad();
        
        // 监控用户交互性能
        this.monitorUserInteractions();
        
        // 监控内存使用
        this.monitorMemoryUsage();
        
        // 监控网络性能
        this.monitorNetworkPerformance();
        
        // 设置定期报告
        this.setupPeriodicReporting();
        
        console.log('📊 性能监控系统已启动');
    }

    /**
     * 监控页面加载性能
     */
    monitorPageLoad() {
        if (typeof window === 'undefined') return;

        window.addEventListener('load', () => {
            // 获取导航时间
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                this.recordMetric('page_load', {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
                    totalTime: navigation.loadEventEnd - navigation.fetchStart,
                    dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
                    tcpConnect: navigation.connectEnd - navigation.connectStart,
                    serverResponse: navigation.responseEnd - navigation.requestStart,
                    domProcessing: navigation.domComplete - navigation.domLoading
                });
            }

            // 获取资源加载时间
            const resources = performance.getEntriesByType('resource');
            const resourceMetrics = {
                totalResources: resources.length,
                slowResources: resources.filter(r => r.duration > 1000).length,
                averageLoadTime: resources.reduce((sum, r) => sum + r.duration, 0) / resources.length
            };
            
            this.recordMetric('resource_load', resourceMetrics);
        });
    }

    /**
     * 监控用户交互性能
     */
    monitorUserInteractions() {
        if (typeof window === 'undefined') return;

        // 监控点击事件
        document.addEventListener('click', (event) => {
            const startTime = performance.now();
            
            // 使用requestAnimationFrame来测量响应时间
            requestAnimationFrame(() => {
                const responseTime = performance.now() - startTime;
                this.recordMetric('click_response', {
                    responseTime: responseTime,
                    target: event.target.tagName,
                    timestamp: Date.now()
                });
            });
        });

        // 监控输入事件
        document.addEventListener('input', this.debounce((event) => {
            const startTime = performance.now();
            
            requestAnimationFrame(() => {
                const responseTime = performance.now() - startTime;
                this.recordMetric('input_response', {
                    responseTime: responseTime,
                    inputType: event.target.type || 'text',
                    timestamp: Date.now()
                });
            });
        }, 100));
    }

    /**
     * 监控内存使用
     */
    monitorMemoryUsage() {
        if (typeof window === 'undefined' || !window.performance.memory) return;

        const checkMemory = () => {
            const memory = window.performance.memory;
            this.recordMetric('memory_usage', {
                usedJSHeapSize: memory.usedJSHeapSize,
                totalJSHeapSize: memory.totalJSHeapSize,
                jsHeapSizeLimit: memory.jsHeapSizeLimit,
                usagePercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
                timestamp: Date.now()
            });
        };

        // 立即检查一次
        checkMemory();
        
        // 每10秒检查一次
        setInterval(checkMemory, 10000);
    }

    /**
     * 监控网络性能
     */
    monitorNetworkPerformance() {
        if (typeof navigator === 'undefined' || !navigator.connection) return;

        const connection = navigator.connection;
        
        this.recordMetric('network_info', {
            effectiveType: connection.effectiveType,
            downlink: connection.downlink,
            rtt: connection.rtt,
            saveData: connection.saveData,
            timestamp: Date.now()
        });

        // 监听网络变化
        connection.addEventListener('change', () => {
            this.recordMetric('network_change', {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                timestamp: Date.now()
            });
        });
    }

    /**
     * 记录性能指标
     * @param {string} name - 指标名称
     * @param {Object} data - 指标数据
     */
    recordMetric(name, data) {
        if (!this.metrics.has(name)) {
            this.metrics.set(name, []);
        }

        const metricArray = this.metrics.get(name);
        metricArray.push({
            ...data,
            timestamp: data.timestamp || Date.now()
        });

        // 限制数组大小
        if (metricArray.length > this.maxMetrics) {
            metricArray.shift();
        }

        // 触发性能警告
        this.checkPerformanceThresholds(name, data);
    }

    /**
     * 检查性能阈值
     * @param {string} name - 指标名称
     * @param {Object} data - 指标数据
     */
    checkPerformanceThresholds(name, data) {
        const thresholds = {
            click_response: { responseTime: 100 }, // 100ms
            input_response: { responseTime: 50 },  // 50ms
            memory_usage: { usagePercentage: 80 }, // 80%
            page_load: { totalTime: 3000 }         // 3秒
        };

        const threshold = thresholds[name];
        if (!threshold) return;

        for (const [key, limit] of Object.entries(threshold)) {
            if (data[key] > limit) {
                this.triggerPerformanceWarning(name, key, data[key], limit);
            }
        }
    }

    /**
     * 触发性能警告
     * @param {string} metric - 指标名称
     * @param {string} key - 具体指标
     * @param {number} value - 当前值
     * @param {number} threshold - 阈值
     */
    triggerPerformanceWarning(metric, key, value, threshold) {
        const message = `性能警告: ${metric}.${key} (${value.toFixed(2)}) 超过阈值 (${threshold})`;
        
        if (typeof errorHandler !== 'undefined') {
            errorHandler.warn(message);
        } else {
            console.warn(message);
        }

        // 记录性能问题
        this.recordMetric('performance_warning', {
            metric: metric,
            key: key,
            value: value,
            threshold: threshold,
            timestamp: Date.now()
        });
    }

    /**
     * 测量函数执行时间
     * @param {string} name - 测量名称
     * @param {Function} fn - 要测量的函数
     * @returns {*} 函数返回值
     */
    async measureFunction(name, fn) {
        const startTime = performance.now();
        
        try {
            const result = await fn();
            const duration = performance.now() - startTime;
            
            this.recordMetric('function_performance', {
                name: name,
                duration: duration,
                success: true,
                timestamp: Date.now()
            });
            
            return result;
        } catch (error) {
            const duration = performance.now() - startTime;
            
            this.recordMetric('function_performance', {
                name: name,
                duration: duration,
                success: false,
                error: error.message,
                timestamp: Date.now()
            });
            
            throw error;
        }
    }

    /**
     * 获取性能报告
     * @returns {Object} 性能报告
     */
    getPerformanceReport() {
        const report = {
            timestamp: Date.now(),
            summary: {},
            details: {},
            recommendations: []
        };

        // 生成各项指标的摘要
        for (const [name, metrics] of this.metrics.entries()) {
            if (metrics.length === 0) continue;

            const latest = metrics[metrics.length - 1];
            const average = this.calculateAverage(metrics);
            
            report.summary[name] = {
                count: metrics.length,
                latest: latest,
                average: average
            };
            
            report.details[name] = metrics.slice(-10); // 最近10条记录
        }

        // 生成性能建议
        report.recommendations = this.generatePerformanceRecommendations(report.summary);

        return report;
    }

    /**
     * 计算平均值
     * @param {Array} metrics - 指标数组
     * @returns {Object} 平均值对象
     */
    calculateAverage(metrics) {
        if (metrics.length === 0) return {};

        const keys = Object.keys(metrics[0]).filter(key => 
            typeof metrics[0][key] === 'number' && key !== 'timestamp'
        );

        const averages = {};
        for (const key of keys) {
            const values = metrics.map(m => m[key]).filter(v => typeof v === 'number');
            if (values.length > 0) {
                averages[key] = values.reduce((sum, val) => sum + val, 0) / values.length;
            }
        }

        return averages;
    }

    /**
     * 生成性能建议
     * @param {Object} summary - 性能摘要
     * @returns {Array} 建议列表
     */
    generatePerformanceRecommendations(summary) {
        const recommendations = [];

        // 检查页面加载性能
        if (summary.page_load && summary.page_load.average.totalTime > 3000) {
            recommendations.push({
                type: 'page_load',
                priority: 'high',
                message: '页面加载时间过长，建议优化资源加载和代码执行效率'
            });
        }

        // 检查内存使用
        if (summary.memory_usage && summary.memory_usage.average.usagePercentage > 70) {
            recommendations.push({
                type: 'memory',
                priority: 'medium',
                message: '内存使用率较高，建议检查是否存在内存泄漏'
            });
        }

        // 检查交互响应
        if (summary.click_response && summary.click_response.average.responseTime > 100) {
            recommendations.push({
                type: 'interaction',
                priority: 'medium',
                message: '点击响应时间较慢，建议优化事件处理逻辑'
            });
        }

        return recommendations;
    }

    /**
     * 设置定期报告
     */
    setupPeriodicReporting() {
        setInterval(() => {
            const report = this.getPerformanceReport();
            console.log('📊 性能报告:', report);
            
            // 可以在这里发送报告到服务器
            this.sendReportToServer(report);
        }, this.reportInterval);
    }

    /**
     * 发送报告到服务器（可选）
     * @param {Object} report - 性能报告
     */
    sendReportToServer(report) {
        // 这里可以实现发送到服务器的逻辑
        // 例如使用fetch API发送到分析服务
        console.log('📤 性能报告已准备发送（当前为模拟）');
    }

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
    }

    /**
     * 启用/禁用性能监控
     * @param {boolean} enabled - 是否启用
     */
    setEnabled(enabled) {
        this.isEnabled = enabled;
        if (enabled) {
            console.log('📊 性能监控已启用');
        } else {
            console.log('📊 性能监控已禁用');
        }
    }

    /**
     * 清空性能数据
     */
    clearMetrics() {
        this.metrics.clear();
        console.log('📊 性能数据已清空');
    }
}

// 创建全局实例
const performanceMonitor = new PerformanceMonitor();

// 导出模块
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceMonitor;
}

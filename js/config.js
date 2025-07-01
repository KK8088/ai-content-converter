/**
 * AI内容格式转换工具 - 配置文件
 * 
 * @description 全局配置和常量定义
 * @version 1.4.0
 * @author AI Content Converter Team
 */

// 应用配置
const APP_CONFIG = {
    // 应用信息
    name: 'AI内容格式转换工具',
    version: '1.5.5',
    description: '将AI对话内容完美转换为专业的Word和Excel文档',
    author: 'zk0x01',
    license: 'MIT',
    
    // GitHub信息
    github: {
        owner: 'KK8088',
        repo: 'ai-content-converter',
        url: 'https://github.com/KK8088/ai-content-converter'
    },
    
    // 功能限制（开源版）
    limits: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxDailyConversions: 50,
        maxTablesPerDocument: 10,
        maxRowsPerTable: 1000,
        maxCharacters: 100000,
        // 大文件处理配置
        chunkSize: 1024 * 1024, // 1MB 分片大小
        maxChunks: 50, // 最大分片数量
        memoryThreshold: 50 * 1024 * 1024, // 50MB 内存阈值
        progressUpdateInterval: 100 // 进度更新间隔(ms)
    },
    
    // 支持的文件格式
    supportedFormats: {
        input: ['.md', '.txt'],
        output: ['docx', 'xlsx', 'pdf', 'html']
    },
    
    // 默认设置
    defaults: {
        contentType: 'auto',
        outputFormat: 'docx',
        templateStyle: 'professional',
        theme: 'light',
        language: 'zh-CN'
    },
    
    // API配置
    api: {
        baseUrl: 'https://api.aiconverter.com',
        timeout: 30000,
        retryAttempts: 3
    },
    
    // 统计配置
    analytics: {
        enabled: true,
        trackingId: 'GA-XXXXXXXXX'
    }
};

// 模板配置
const TEMPLATE_CONFIG = {
    professional: {
        name: '💼 专业商务',
        description: '适合商务报告、项目文档',
        colors: {
            primary: '#6366f1',
            secondary: '#f59e0b',
            text: '#1f2937'
        },
        fonts: {
            heading: '微软雅黑',
            body: '微软雅黑',
            code: 'Consolas'
        },
        spacing: {
            paragraph: 120,
            line: 276
        }
    },
    academic: {
        name: '🎓 学术论文',
        description: '适合学术论文、研究报告',
        colors: {
            primary: '#059669',
            secondary: '#0891b2',
            text: '#1f2937'
        },
        fonts: {
            heading: '宋体',
            body: '宋体',
            code: 'Times New Roman'
        },
        spacing: {
            paragraph: 140,
            line: 300
        }
    },
    simple: {
        name: '📝 简洁清爽',
        description: '适合日常文档、笔记整理',
        colors: {
            primary: '#6b7280',
            secondary: '#9ca3af',
            text: '#1f2937'
        },
        fonts: {
            heading: '微软雅黑',
            body: '微软雅黑',
            code: 'Consolas'
        },
        spacing: {
            paragraph: 100,
            line: 240
        }
    },
    colorful: {
        name: '🎨 彩色活泼',
        description: '适合创意文档、演示材料',
        colors: {
            primary: '#ec4899',
            secondary: '#8b5cf6',
            text: '#1f2937'
        },
        fonts: {
            heading: '微软雅黑',
            body: '微软雅黑',
            code: 'Consolas'
        },
        spacing: {
            paragraph: 120,
            line: 276
        }
    }
};

// 数据类型配置
const DATA_TYPE_CONFIG = {
    currency: {
        patterns: [
            /¥[\d,]+\.?\d*/g,
            /\$[\d,]+\.?\d*/g,
            /€[\d,]+\.?\d*/g,
            /£[\d,]+\.?\d*/g,
            /₹[\d,]+\.?\d*/g,
            /₽[\d,]+\.?\d*/g
        ],
        formats: {
            '¥': '¥#,##0.00',
            '$': '$#,##0.00',
            '€': '€#,##0.00',
            '£': '£#,##0.00',
            '₹': '₹#,##0.00',
            '₽': '₽#,##0.00'
        }
    },
    percentage: {
        patterns: [/\d+\.?\d*%/g],
        format: '0.00%'
    },
    date: {
        patterns: [
            /\d{4}[-/]\d{1,2}[-/]\d{1,2}/g,
            /\d{1,2}[-/]\d{1,2}[-/]\d{4}/g,
            /\d{4}年\d{1,2}月\d{1,2}日/g
        ],
        formats: {
            'iso': 'yyyy-mm-dd',
            'us': 'mm/dd/yyyy',
            'cn': 'yyyy年mm月dd日'
        }
    },
    number: {
        patterns: [/[\d,]+\.?\d*/g],
        formats: {
            integer: '#,##0',
            decimal: '#,##0.00'
        }
    }
};

// 错误消息配置
const ERROR_MESSAGES = {
    FILE_TOO_LARGE: '文件大小超过限制（最大10MB）',
    UNSUPPORTED_FORMAT: '不支持的文件格式',
    CONVERSION_FAILED: '转换失败，请检查内容格式',
    NETWORK_ERROR: '网络连接错误，请稍后重试',
    QUOTA_EXCEEDED: '今日转换次数已达上限',
    INVALID_CONTENT: '内容格式无效，请检查输入',
    BROWSER_NOT_SUPPORTED: '浏览器不支持此功能',
    STORAGE_FULL: '本地存储空间不足'
};

// 成功消息配置
const SUCCESS_MESSAGES = {
    CONVERSION_COMPLETE: '转换完成！文件已开始下载',
    FILE_UPLOADED: '文件上传成功',
    SETTINGS_SAVED: '设置已保存',
    CONTENT_CLEARED: '内容已清空',
    PREVIEW_GENERATED: '预览已生成'
};

// 示例内容配置
const EXAMPLE_CONTENT = {
    table: `# 销售数据报告

## 产品销售统计

| 产品名称 | 销售数量 | 单价 | 总销售额 | 状态 |
|----------|----------|------|----------|------|
| iPhone 15 Pro | 1,250 | ¥8,999.00 | ¥11,248,750.00 | 有货 |
| MacBook Air | 850 | $1,299.99 | $1,104,991.50 | 有货 |
| iPad Pro | 650 | €999.50 | €649,675.00 | 缺货 |
| AirPods Pro | 2,100 | ¥1,999.00 | ¥4,197,900.00 | 有货 |`,

    code: `# 代码示例文档

## JavaScript函数

\`\`\`javascript
function processData(data) {
    return data.map(item => ({
        id: item.id,
        value: parseFloat(item.value),
        status: item.status === 'active'
    }));
}
\`\`\`

## Python脚本

\`\`\`python
def calculate_total(items):
    """计算总价"""
    return sum(item.price * item.quantity for item in items)
\`\`\``,

    list: `# 项目管理清单

## 开发任务

- [x] 需求分析和用户调研
- [x] 系统架构设计
- [ ] 前端界面开发
- [ ] 后端API开发
- [ ] 数据库设计
- [ ] 测试用例编写

## 优先级排序

1. **高优先级** - 核心功能开发
2. **中优先级** - 用户体验优化
3. **低优先级** - 附加功能开发

> **重要提示**: 请确保在每个里程碑完成后进行代码审查。`,

    format: `# 格式化文本示例

这是一个包含多种格式的文档示例：

**加粗文本** 用于强调重要内容
*斜体文本* 用于标注特殊说明
\`行内代码\` 用于技术术语
~~删除线~~ 表示已废弃内容

[链接文本](https://example.com) 可以跳转到外部资源

## 引用示例

> 这是一个重要的引用内容，通常用于突出显示关键信息或者引用其他来源的内容。

---

分隔线用于分割不同的内容区域。`
};

// 本地存储键名
const STORAGE_KEYS = {
    USER_SETTINGS: 'ai_converter_settings',
    CONVERSION_HISTORY: 'ai_converter_history',
    DAILY_USAGE: 'ai_converter_daily_usage',
    THEME_PREFERENCE: 'ai_converter_theme',
    LAST_CONTENT: 'ai_converter_last_content'
};

// 事件名称
const EVENTS = {
    CONTENT_CHANGED: 'contentChanged',
    CONVERSION_STARTED: 'conversionStarted',
    CONVERSION_COMPLETED: 'conversionCompleted',
    CONVERSION_FAILED: 'conversionFailed',
    PREVIEW_UPDATED: 'previewUpdated',
    SETTINGS_CHANGED: 'settingsChanged',
    THEME_CHANGED: 'themeChanged',
    FILE_UPLOADED: 'fileUploaded'
};

// 导出配置对象
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        APP_CONFIG,
        TEMPLATE_CONFIG,
        DATA_TYPE_CONFIG,
        ERROR_MESSAGES,
        SUCCESS_MESSAGES,
        EXAMPLE_CONTENT,
        STORAGE_KEYS,
        EVENTS
    };
}

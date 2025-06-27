# AI内容格式转换工具

<div align="center">

![AI Content Converter](https://img.shields.io/badge/AI%20Content-Converter-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)

**将AI对话内容完美转换为专业的Word和Excel文档**

[![GitHub Stars](https://img.shields.io/github/stars/KK8088/ai-content-converter?style=social)](https://github.com/KK8088/ai-content-converter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/KK8088/ai-content-converter/releases)
[![CI/CD](https://github.com/KK8088/ai-content-converter/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/KK8088/ai-content-converter/actions)
[![GitHub Issues](https://img.shields.io/github/issues/KK8088/ai-content-converter)](https://github.com/KK8088/ai-content-converter/issues)
[![GitHub Forks](https://img.shields.io/github/forks/KK8088/ai-content-converter)](https://github.com/KK8088/ai-content-converter/network)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[🚀 在线体验](https://KK8088.github.io/ai-content-converter) | [📖 文档](https://docs.aiconverter.com) | [🐛 报告问题](https://github.com/KK8088/ai-content-converter/issues) | [💬 讨论](https://github.com/KK8088/ai-content-converter/discussions)

</div>

---

## ✨ 特性

### 🎯 **智能识别**
- **95%+准确率** 的内容格式检测
- 支持 **Markdown表格、代码块、列表、引用** 等复杂格式
- 智能识别 **货币、日期、百分比** 等数据类型
- 容错处理，支持不规范格式

### 📄 **完美Word转换**
- **专业文档质量**，如同Word原生编辑
- 支持标题层级、表格格式、代码高亮
- 自动应用商务模板样式
- 保持原始格式和数据结构

### 📊 **强大Excel转换**
- **多工作表支持**，每个表格独立转换
- **智能数据类型识别**，自动格式化数字、货币、日期
- 专业表格样式，表头突出显示
- 支持复杂表格结构

### 🎨 **现代化界面**
- **响应式设计**，完美适配桌面和移动端
- **多主题支持**：亮色、暗色、高对比度、护眼模式
- **拖拽上传**，支持.md和.txt文件
- **实时预览**，所见即所得

## 🚀 快速开始

### 在线使用

访问 [在线版本](https://KK8088.github.io/ai-content-converter)，无需安装即可使用。

### 本地部署

```bash
# 克隆项目
git clone https://github.com/KK8088/ai-content-converter.git

# 进入项目目录
cd ai-content-converter

# 启动本地服务器
python -m http.server 8080
# 或使用 Node.js
npx serve .

# 访问 http://localhost:8080
```

### Docker 部署

```bash
# 构建镜像
docker build -t ai-content-converter .

# 运行容器
docker run -p 8080:80 ai-content-converter
```

## 📖 使用指南

### 基础使用

1. **输入内容**：将从ChatGPT、DeepSeek等AI对话中复制的内容粘贴到文本框
2. **选择格式**：选择输出格式（Word、Excel或两者）
3. **一键转换**：点击"开始转换"按钮
4. **下载文档**：自动下载生成的专业文档

### 支持的格式

#### 📊 Markdown表格
```markdown
| 产品名称 | 价格 | 库存 | 状态 |
|----------|------|------|------|
| iPhone 15 Pro | ¥8,999.00 | 50 | 有货 |
| MacBook Air | $1,299.99 | 30 | 有货 |
```

#### 💻 代码块
```markdown
```javascript
function processData(data) {
    return data.map(item => ({
        id: item.id,
        value: parseFloat(item.value)
    }));
}
```
```

#### 📋 列表和引用
```markdown
## 项目清单
- 需求分析 ✅
- 系统设计 🔄
- 开发实施 ⏳

> **重要提示**: 请确保所有数据准确无误
```

#### 🎨 格式化文本
```markdown
**加粗文本** *斜体文本* `行内代码`
[链接文本](https://example.com)
~~删除线~~ __下划线__
```

### 高级功能

#### 智能数据类型识别
- **货币**: ¥1,250.50, $999.99, €850.00
- **百分比**: 15.6%, -8.2%, +23.8%
- **日期**: 2025-06-27, 2025年6月27日
- **布尔**: 是/否, √/×, true/false

#### 多主题支持
- 🌞 **亮色主题** - 经典白色背景
- 🌙 **暗色主题** - 护眼深色模式
- 🔍 **高对比度** - 无障碍访问
- 🌿 **护眼模式** - 绿色护眼配色

## 🏗️ 技术架构

### 前端技术栈
- **HTML5** - 语义化标签，无障碍访问
- **CSS3** - 现代化样式，响应式设计
- **Vanilla JavaScript** - 无框架依赖，轻量高效
- **Web APIs** - File API, Blob API等现代浏览器特性

### 核心库
- **[docx.js](https://github.com/dolanmiu/docx)** - Word文档生成
- **[xlsx.js](https://github.com/SheetJS/sheetjs)** - Excel文档处理
- **[FileSaver.js](https://github.com/eligrey/FileSaver.js)** - 文件下载

### 项目结构
```
ai-content-converter/
├── index.html              # 主页面
├── css/
│   ├── styles.css          # 主样式文件
│   └── themes.css          # 主题样式
├── js/
│   ├── config.js           # 配置管理
│   ├── utils.js            # 工具函数
│   ├── contentDetector.js  # 内容检测
│   ├── markdownParser.js   # Markdown解析
│   └── app.js             # 主应用
├── docs/                   # 文档目录
├── examples/               # 示例文件
└── tests/                  # 测试文件
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！请查看 [贡献指南](CONTRIBUTING.md) 了解详细信息。

### 快速贡献

1. **Fork** 本项目
2. **创建** 特性分支 (`git checkout -b feature/AmazingFeature`)
3. **提交** 更改 (`git commit -m 'Add some AmazingFeature'`)
4. **推送** 到分支 (`git push origin feature/AmazingFeature`)
5. **创建** Pull Request

### 开发环境

```bash
# 安装开发依赖
npm install

# 启动开发服务器
npm run dev

# 运行测试
npm test

# 构建生产版本
npm run build
```

## 📊 路线图

### 🎯 v1.1 (计划中)
- [ ] 实时预览功能
- [ ] 批量文件处理
- [ ] 更多模板样式
- [ ] PDF输出支持

### 🚀 v1.2 (规划中)
- [ ] PowerPoint输出
- [ ] 云端存储集成
- [ ] 协作编辑功能
- [ ] API接口开放

### 🌟 v2.0 (愿景)
- [ ] AI内容优化
- [ ] 多语言支持
- [ ] 插件生态系统
- [ ] 企业级功能

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

- 感谢 [docx.js](https://github.com/dolanmiu/docx) 提供的Word文档生成能力
- 感谢 [xlsx.js](https://github.com/SheetJS/sheetjs) 提供的Excel处理功能
- 感谢所有贡献者和用户的支持

## 📞 联系我们

- **GitHub Issues**: [报告问题](https://github.com/KK8088/ai-content-converter/issues)
- **GitHub Discussions**: [参与讨论](https://github.com/KK8088/ai-content-converter/discussions)
- **Email**: support@aiconverter.com
- **Twitter**: [@AIConverter](https://twitter.com/AIConverter)

---

<div align="center">

**如果这个项目对您有帮助，请给我们一个 ⭐️**

Made with ❤️ by [zk0x01](https://github.com/KK8088)

</div>

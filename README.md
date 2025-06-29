# 🚀 AI内容格式转换工具

<div align="center">

![AI Content Converter](https://img.shields.io/badge/AI%20Content-Converter-6366f1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)

**将AI对话内容完美转换为专业的Word和Excel文档**

📖 **[English Version](README_EN.md)** | 🌐 **[在线演示](https://KK8088.github.io/ai-content-converter)**

[![GitHub Stars](https://img.shields.io/github/stars/KK8088/ai-content-converter?style=social)](https://github.com/KK8088/ai-content-converter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/badge/version-v1.4.0-blue.svg)](https://github.com/KK8088/ai-content-converter/releases)
[![GitHub Issues](https://img.shields.io/github/issues/KK8088/ai-content-converter)](https://github.com/KK8088/ai-content-converter/issues)
[![GitHub Forks](https://img.shields.io/github/forks/KK8088/ai-content-converter)](https://github.com/KK8088/ai-content-converter/network)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[🚀 在线体验](https://KK8088.github.io/ai-content-converter) | [🐛 报告问题](https://github.com/KK8088/ai-content-converter/issues) | [💬 讨论](https://github.com/KK8088/ai-content-converter/discussions)

</div>

---

## ✨ 功能特色

### 🎯 核心功能
- 📄 **Word文档(.docx)** - 专业文档生成，支持丰富格式
- 📊 **Excel表格(.xlsx)** - 多工作表支持，智能数据类型识别
- 🤖 **智能内容检测** - 95%+准确率的格式识别
- 🎯 **智能决策系统** - 6种专业转换策略自动选择 (v1.4.0新增!)
- 💡 **格式推荐系统** - 基于内容特征的智能格式推荐 (v1.4.0新增!)
- 👁️ **实时预览** - 转换前可视化预览效果

### 🔥 实时预览系统 (v1.1.0)
- **结构预览** - 智能检测结果和表格结构展示
- **Word预览** - 专业Word文档样式模拟
- **Excel预览** - 完整Excel工作表格式预览
- **无缝切换** - 三种预览模式流畅切换

### 📋 支持格式
- **Markdown表格** - 标准和非标准表格格式
- **代码块** - 多语言语法高亮支持
- **列表** - 有序和无序列表处理
- **引用块** - 保持引用格式和层次
- **标题** - 自动识别H1-H6标题级别
- **行内格式** - 粗体、斜体、代码、链接等

### 🧠 智能数据类型识别
- **货币** - ¥、$、€、£、₹、₽等多种货币
- **百分比** - 自动检测和格式化百分比数据
- **日期** - ISO、中文、美式、欧式日期格式
- **数字** - 整数、小数、科学计数法
- **布尔值** - 是/否、√/×、true/false等

## 🚀 快速开始

### 在线使用
访问：https://KK8088.github.io/ai-content-converter

### 本地部署
```bash
# 克隆仓库
git clone https://github.com/KK8088/ai-content-converter.git

# 进入目录
cd ai-content-converter

# 启动本地服务器
python -m http.server 8080

# 打开浏览器
# 访问：http://localhost:8080
```

## 📖 使用指南

### 基础使用
1. **输入内容** - 粘贴AI对话内容或Markdown表格
2. **实时预览** - 点击"👁️ 实时预览"查看转换效果
3. **选择选项** - 选择内容类型、输出格式和模板
4. **开始转换** - 点击"🚀 开始转换"生成文件

### 高级功能

#### 智能数据类型识别
- **货币**: ¥1,250.50, $999.99, €850.00
- **百分比**: 15.6%, -8.2%, +23.8%
- **日期**: 2025-06-28, 2025年6月28日
- **布尔值**: 是/否, √/×, true/false

#### 多主题支持
- 🌞 **浅色主题** - 经典白色背景
- 🌙 **深色主题** - 护眼深色模式

#### 模板选项
- 💼 **专业商务** - 企业文档风格
- 🎓 **学术论文** - 学术格式标准
- 📝 **简洁清爽** - 极简主义设计
- 🎨 **多彩活泼** - 创意生动风格

## 🎯 使用场景

### 📊 数据分析报告
将ChatGPT分析结果转换为专业Excel报表
```markdown
| 产品 | 销量 | 增长率 |
|------|------|--------|
| iPhone | 1200 | +15% |
| MacBook | 800 | +8% |
```

### 📄 会议纪要
将AI整理的会议内容转换为Word文档
```markdown
# 会议纪要 - 项目评审
## 参会人员
- 张三（项目经理）
- 李四（开发工程师）

## 行动项目
1. 完成功能开发
2. 进行测试验证
```

### 📈 财务报告
将财务数据转换为格式化Excel表格
```markdown
| 季度 | 收入 | 利润 | 利润率 |
|------|------|------|--------|
| Q1 2025 | ¥120万 | ¥24万 | 20% |
| Q2 2025 | ¥150万 | ¥30万 | 20% |
```

## 🔧 技术特性

### 🏗️ 架构设计
- **纯前端** - 无需服务器，完全在浏览器中运行
- **本地处理** - 数据安全保障，无上传风险
- **模块化设计** - 代码结构清晰，易于维护
- **响应式UI** - 完美适配各种设备

### 🛡️ 安全与隐私
- **本地处理** - 所有数据在本地处理
- **无数据上传** - 内容永不离开您的设备
- **XSS防护** - HTML转义防止脚本攻击
- **输入验证** - 增强的用户输入验证

### ⚡ 性能表现
- **快速处理** - 大部分内容瞬间转换
- **内存高效** - 针对大文档优化
- **浏览器兼容** - 支持所有现代浏览器

## 📊 版本历史

### v1.1.1 (2025-06-28) - 项目整理和重新发布
- 🧹 **项目结构优化** - 文件整理和标准化
- 📧 **联系方式统一** - 统一邮箱为admin@zk0x01.com
- 📁 **文档完善** - 改进项目文档和结构说明
- 🔧 **维护性改进** - 符合开源项目最佳实践

### v1.1.0 (2025-06-27) - 重大功能更新
- ✨ **实时预览系统** - 完整的预览功能
- 🎯 **用户体验革命** - 转换前可视化预览
- 🔧 **技术架构改进** - 增强错误处理和安全性
- 📈 **性能提升** - 预览功能100%改进

### v1.0.0 (2025-06-26) - 首次发布
- 🎉 **首次发布** - AI内容格式转换工具开源版
- 📄 **Word生成** - 专业Word文档输出
- 📊 **Excel转换** - 多工作表智能数据识别
- 🎨 **现代界面** - 响应式设计，支持主题切换

## 🤝 参与贡献

我们欢迎各种形式的贡献！请查看我们的[贡献指南](CONTRIBUTING.md)了解详情。

### 开发环境搭建
```bash
# Fork并克隆仓库
git clone https://github.com/YOUR_USERNAME/ai-content-converter.git

# 创建功能分支
git checkout -b feature/your-feature-name

# 进行修改并提交
git commit -m "feat: add your feature"

# 推送并创建Pull Request
git push origin feature/your-feature-name
```

## 📄 开源协议

本项目采用MIT协议 - 查看[LICENSE](LICENSE)文件了解详情。

## 🙏 致谢

- 感谢所有用户的支持和反馈
- 特别感谢开源社区的贡献
- 感谢AI内容处理需求的启发

## 📞 联系支持

### 问题报告
- [GitHub Issues](https://github.com/KK8088/ai-content-converter/issues)

### 功能建议
- [GitHub Discussions](https://github.com/KK8088/ai-content-converter/discussions)

### 联系方式
- **邮箱**: admin@zk0x01.com
- **GitHub**: [@KK8088](https://github.com/KK8088)

## 🔮 发展路线图

### v1.2.0 (计划2025年7月)
- 📄 **PDF输出** - 高质量PDF文档生成
- 🎨 **PowerPoint转换** - PPT幻灯片生成
- 📁 **批量处理** - 多文件转换支持
- 🎯 **更多模板** - 商务、学术、创意模板

### v2.0.0 (未来)
- 🔌 **插件系统** - 可扩展架构
- 🌐 **API访问** - 开发者友好的API
- 🤝 **协作功能** - 实时协作编辑

---

**🌟 如果这个项目对您有帮助，请给我们一个Star！**

**Made with ❤️ by [@KK8088](https://github.com/KK8088)**

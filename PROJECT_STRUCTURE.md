# 项目结构说明

## 📁 核心项目文件

```
ai-content-converter/
├── 📄 index.html                 # 主应用页面
├── 📁 css/                       # 样式文件
│   ├── styles.css               # 主样式
│   └── themes.css               # 主题样式
├── 📁 js/                        # JavaScript模块
│   ├── app.js                   # 主应用逻辑
│   ├── config.js                # 配置文件
│   ├── contentDetector.js       # 内容检测模块
│   ├── markdownParser.js        # Markdown解析器
│   └── utils.js                 # 工具函数
└── 📁 scripts/                   # 实用脚本
    ├── init-git.bat             # Windows Git初始化
    └── init-git.sh              # Linux/Mac Git初始化
```

## 📚 文档文件

```
├── 📄 README.md                  # 项目介绍和使用指南
├── 📄 LICENSE                    # MIT开源许可证
├── 📄 CONTRIBUTING.md            # 贡献指南
├── 📄 CHANGELOG.md               # 版本更新日志
├── 📄 ROADMAP.md                 # 项目路线图
├── 📄 SECURITY.md                # 安全策略
├── 📄 CODE_OF_CONDUCT.md         # 行为准则
└── 📁 docs/                      # 详细文档
    ├── DEPLOYMENT.md            # 部署指南
    └── PROMOTION.md             # 推广策略
```

## ⚙️ 配置文件

```
├── 📄 package.json               # 项目配置和依赖
├── 📄 package-lock.json          # 依赖锁定文件
├── 📄 .gitignore                 # Git忽略规则
└── 📁 .github/                   # GitHub配置
    ├── 📁 workflows/            # GitHub Actions
    │   └── ci.yml               # CI/CD流水线
    ├── 📁 ISSUE_TEMPLATE/       # Issue模板
    │   ├── bug_report.md        # Bug报告模板
    │   └── feature_request.md   # 功能请求模板
    ├── 📁 DISCUSSION_TEMPLATE/  # 讨论模板
    │   └── ideas.yml            # 想法讨论模板
    ├── pull_request_template.md # PR模板
    └── FUNDING.yml              # 资助配置
```

## 🎯 文件用途说明

### 核心应用文件
- **index.html**: 单页应用的主入口
- **css/**: 所有样式文件，支持多主题
- **js/**: 模块化的JavaScript代码
- **scripts/**: 项目初始化和部署脚本

### 开源社区文件
- **README.md**: 项目的门面，包含所有重要信息
- **LICENSE**: 法律保护和使用条款
- **CONTRIBUTING.md**: 帮助新贡献者参与项目
- **CODE_OF_CONDUCT.md**: 维护健康的社区环境

### 项目管理文件
- **CHANGELOG.md**: 追踪所有版本变更
- **ROADMAP.md**: 项目发展方向和计划
- **SECURITY.md**: 安全漏洞报告流程

### GitHub集成文件
- **.github/**: GitHub平台特定配置
- **workflows/**: 自动化CI/CD流程
- **ISSUE_TEMPLATE/**: 标准化问题报告
- **DISCUSSION_TEMPLATE/**: 促进社区讨论

## 🧹 已清理的文件

以下文件已被清理，不再包含在项目中：

### 临时修复脚本
- ~~final-fix.bat~~
- ~~fix-ci.bat~~
- ~~fix-security-*.bat~~
- ~~quick-fix.bat~~
- ~~update-github-account.bat~~
- ~~complete-opensource-setup.bat~~

### 开发过程文件
- ~~RELEASE_CHECKLIST.md~~

## 📏 项目规模

- **总文件数**: ~25个核心文件
- **代码文件**: 6个 (HTML, CSS, JS)
- **文档文件**: 8个 (Markdown)
- **配置文件**: 11个 (JSON, YAML, 模板)

## 🎨 设计原则

1. **简洁性**: 只保留必要文件
2. **模块化**: 清晰的文件分离
3. **标准化**: 遵循开源最佳实践
4. **可维护性**: 良好的文档和注释
5. **专业性**: 企业级项目结构

## 🔄 维护建议

1. **定期清理**: 删除临时和测试文件
2. **文档更新**: 保持文档与代码同步
3. **版本管理**: 及时更新CHANGELOG
4. **依赖管理**: 定期检查和更新依赖

---

这个结构确保项目保持清洁、专业和易于维护。

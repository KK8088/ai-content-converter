# 📁 项目结构说明

## 🎯 **核心项目文件**

### **📄 主要文件**
```
├── index.html              # 主页面入口
├── package.json            # 项目配置和依赖
├── package-lock.json       # 依赖版本锁定
├── LICENSE                 # MIT开源许可证
├── README.md               # 项目说明（中文）
├── README_EN.md            # 项目说明（英文）
└── .gitignore              # Git忽略文件配置
```

### **📋 项目文档**
```
├── CHANGELOG.md            # 版本更新日志
├── CODE_OF_CONDUCT.md      # 社区行为准则
├── CONTRIBUTING.md         # 贡献指南
├── SECURITY.md             # 安全政策
├── ROADMAP.md              # 产品路线图
└── ROADMAP_v1.2.0.md       # v1.2.0版本规划
```

### **💻 源代码**
```
├── css/                    # 样式文件
│   ├── styles.css          # 主样式文件
│   └── themes.css          # 主题样式文件
└── js/                     # JavaScript文件
    ├── app.js              # 主应用逻辑
    ├── config.js           # 配置文件
    ├── contentDetector.js  # 内容检测器
    ├── markdownParser.js   # Markdown解析器
    └── utils.js            # 工具函数
```

## 🗂️ **开发文档归档**

### **📦 archive/ 文件夹**
> **注意**: 此文件夹不会同步到GitHub开源项目中

```
archive/
├── 📊 开发报告
│   ├── FUNCTION_CHECK_REPORT.md      # 功能检查报告
│   ├── PREVIEW_FINAL_REPORT.md       # 预览功能最终报告
│   ├── PREVIEW_OPTIMIZATION_REPORT.md # 预览优化报告
│   ├── PREVIEW_SUCCESS_REPORT.md     # 预览成功报告
│   ├── PROGRESS_REPORT.md            # 项目进度报告
│   ├── RELEASE_SUCCESS_REPORT.md     # 发布成功报告
│   └── TECHNICAL_NOTES.md            # 技术笔记
│
├── 📢 推广材料
│   ├── ANNOUNCEMENT_v1.1.0.md        # v1.1.0发布公告
│   ├── GITHUB_RELEASE_GUIDE.md       # GitHub发布指南
│   ├── GITHUB_RELEASE_v1.1.0.md      # GitHub发布内容
│   ├── PROMOTION_PLAN.md             # 推广计划
│   ├── RELEASE_NOTES_v1.1.0.md       # 发布说明
│   └── VERSION_STRATEGY.md           # 版本策略
│
├── 🔧 开发工具
│   ├── fix-issues.bat                # 问题修复脚本
│   ├── release-version.bat           # 版本发布脚本
│   └── scripts/                      # 初始化脚本
│       ├── init-git.bat
│       └── init-git.sh
│
├── 📝 开发记录
│   ├── CHAT_BACKUP.md                # 对话备份
│   ├── FEEDBACK_COLLECTION_SYSTEM.md # 反馈收集系统
│   ├── FINAL_STRUCTURE.md            # 最终结构文档
│   └── docs/                         # 开发文档
│       ├── DEPLOYMENT.md
│       └── PROMOTION.md
│
└── 🗃️ 临时文件
    ├── 部署测试网页应用程序__2025-06-27T07-31-58.md
    └── 部署测试网页应用程序__2025-06-27T07-33-34.md
```

## 🎯 **文件分类原则**

### **✅ 保留在根目录的文件**
- **核心功能文件** - 直接影响项目运行的文件
- **标准开源文件** - LICENSE、README、CONTRIBUTING等
- **用户文档** - 面向最终用户的文档
- **源代码** - css/、js/ 目录

### **📦 移入archive的文件**
- **开发过程记录** - 各种报告和笔记
- **推广材料** - 发布公告、推广计划等
- **开发工具脚本** - 临时使用的脚本文件
- **临时文档** - 开发过程中的临时文件
- **中文文件名** - 不符合国际化标准的文件

## 🔒 **Git同步策略**

### **同步到GitHub的内容**
```
✅ 所有根目录文件
✅ css/ 和 js/ 源代码
✅ 项目文档和说明
✅ 开源项目标准文件
```

### **不同步的内容**
```
❌ archive/ 整个文件夹
❌ 开发过程文档
❌ 临时脚本和工具
❌ 个人开发记录
```

## 📋 **维护建议**

### **日常开发**
1. **新的开发文档** → 直接放入 `archive/`
2. **临时脚本** → 放入 `archive/scripts/`
3. **测试文件** → 放入 `archive/` 或使用 `.gitignore`

### **版本发布**
1. **更新核心文档** - README、CHANGELOG等
2. **检查文件结构** - 确保核心文件在根目录
3. **清理临时文件** - 移动到archive或删除

### **项目清理**
1. **定期整理** - 每个版本发布后整理文件
2. **归档原则** - 开发文档归档，用户文档保留
3. **保持简洁** - 根目录只保留必要文件

---

## 🎉 **整理效果**

### **整理前**
- 根目录文件混乱，开发文档和核心文件混在一起
- 难以区分哪些文件需要同步到开源项目
- 项目结构不够专业和清晰

### **整理后**
- ✅ **根目录简洁** - 只包含核心项目文件
- ✅ **结构清晰** - 文件分类明确，易于维护
- ✅ **开源友好** - 符合开源项目最佳实践
- ✅ **维护方便** - 开发文档归档，不影响项目发布

**🎯 现在项目结构专业、清晰，完全符合开源项目标准！**

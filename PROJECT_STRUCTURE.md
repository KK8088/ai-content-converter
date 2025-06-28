# 📁 项目结构说明

## 🎯 **项目概述**

AI内容格式转换工具是一个纯前端的开源项目，专注于将AI对话内容转换为专业的Word和Excel文档。

## 📂 **核心项目文件**

### **📄 主要文件**
```
📁 AI内容格式转换工具/
├── 📄 index.html              # 主页面入口
├── 📄 package.json            # 项目配置和依赖
├── 📄 package-lock.json       # 依赖版本锁定
├── 📄 LICENSE                 # MIT开源许可证
├── 📄 README.md               # 项目说明（中文）
├── 📄 README_EN.md            # 项目说明（英文）
└── 📄 .gitignore              # Git忽略文件配置
```

### **📋 项目文档**
```
├── 📄 CHANGELOG.md            # 版本更新日志
├── 📄 CODE_OF_CONDUCT.md      # 社区行为准则
├── 📄 CONTRIBUTING.md         # 贡献指南
├── 📄 SECURITY.md             # 安全政策
├── 📄 ROADMAP.md              # 产品路线图
└── 📄 PROJECT_STRUCTURE.md    # 项目结构说明（本文件）
```

### **💻 源代码**
```
├── 📁 css/                    # 样式文件
│   ├── 📄 styles.css          # 主样式文件
│   └── 📄 themes.css          # 主题样式文件
└── 📁 js/                     # JavaScript文件
    ├── 📄 app.js              # 主应用逻辑
    ├── 📄 config.js           # 配置文件
    ├── 📄 contentDetector.js  # 内容检测器
    ├── 📄 markdownParser.js   # Markdown解析器
    └── 📄 utils.js            # 工具函数
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
│   ├── RELEASE_NOTES_v1.1.0.md       # v1.1.0发布说明
│   ├── RELEASE_NOTES_v1.1.1.md       # v1.1.1发布说明
│   ├── VERSION_STRATEGY.md           # 版本策略
│   └── ROADMAP_v1.2.0.md             # v1.2.0版本规划
│
├── 🔧 开发工具
│   ├── fix-issues.bat                # 问题修复脚本
│   ├── release-v1.1.1.bat           # v1.1.1版本发布脚本
│   ├── release-version.bat          # 版本发布脚本
│   ├── language-switcher.css        # 语言切换器样式（已废弃）
│   ├── language-switcher.js         # 语言切换器脚本（已废弃）
│   └── scripts/                     # 初始化脚本
│       ├── init-git.bat
│       └── init-git.sh
│
├── 📝 开发记录
│   ├── CHAT_BACKUP.md                # 对话备份
│   ├── FEEDBACK_COLLECTION_SYSTEM.md # 反馈收集系统
│   ├── FINAL_STRUCTURE.md            # 最终结构文档
│   ├── PROJECT_STRUCTURE.md          # 旧版项目结构文档
│   ├── BILINGUAL_README_GUIDE.md     # 双语README指南
│   └── docs/                         # 开发文档
│       ├── DEPLOYMENT.md
│       ├── PROMOTION.md
│       └── README.html
│
├── 📋 文档备份
│   ├── README_OLD.md                 # 原中文README备份
│   ├── README_EN_OLD.md              # 原英文README备份
│   └── test-bilingual.html           # 双语功能测试页面
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
- **项目配置** - package.json、.gitignore等

### **📦 移入archive的文件**
- **开发过程记录** - 各种报告和笔记
- **推广材料** - 发布公告、推广计划等
- **开发工具脚本** - 临时使用的脚本文件
- **过时文档** - 已过时的项目文档
- **废弃代码** - 不再使用的CSS/JS文件
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
❌ 废弃的代码文件
```

## 📋 **维护建议**

### **日常开发**
1. **新的开发文档** → 直接放入 `archive/`
2. **临时脚本** → 放入 `archive/` 或使用 `.gitignore`
3. **测试文件** → 放入 `archive/` 或删除
4. **废弃代码** → 移动到 `archive/` 保留历史

### **版本发布**
1. **更新核心文档** - README、CHANGELOG、ROADMAP等
2. **检查文件结构** - 确保核心文件在根目录
3. **清理临时文件** - 移动到archive或删除
4. **更新版本号** - package.json、config.js等

### **项目清理**
1. **定期整理** - 每个版本发布后整理文件
2. **归档原则** - 开发文档归档，用户文档保留
3. **保持简洁** - 根目录只保留必要文件
4. **文档同步** - 确保中英文文档内容一致

## 🎉 **清理效果**

### **清理前**
- 根目录文件混乱，开发文档和核心文件混在一起
- 过时文档和废弃代码占用空间
- 项目结构不够专业和清晰
- 难以区分哪些文件需要同步到开源项目

### **清理后**
- ✅ **根目录简洁** - 只包含核心项目文件
- ✅ **结构清晰** - 文件分类明确，易于维护
- ✅ **开源友好** - 符合开源项目最佳实践
- ✅ **维护方便** - 开发文档归档，不影响项目发布
- ✅ **专业标准** - 达到企业级项目标准

## 📊 **项目统计**

### **核心文件数量**
- **根目录**: 8个核心文件
- **源代码**: 7个JS/CSS文件
- **项目文档**: 6个标准文档

### **归档文件数量**
- **开发文档**: 35+个文件
- **脚本工具**: 10+个文件
- **临时文件**: 5+个文件

### **项目规模**
- **总代码行数**: ~3000行
- **文档字数**: ~50000字
- **支持语言**: 中文、英文

---

## 🎯 **总结**

**🎉 项目现在拥有了专业、清晰、符合开源标准的文件结构！**

这样的组织方式既保持了开源项目的专业性，又保留了完整的开发历史记录，是最佳的项目管理实践。

**维护原则**: 核心文件保持简洁，开发文档完整归档，确保项目长期可维护性。

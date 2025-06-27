# 贡献指南

感谢您对AI内容格式转换工具的关注！我们欢迎所有形式的贡献，包括但不限于：

- 🐛 报告Bug
- 💡 提出新功能建议
- 📝 改进文档
- 🔧 提交代码修复
- 🌟 添加新功能
- 🎨 改进UI/UX设计

## 🚀 快速开始

### 开发环境要求

- **浏览器**: 支持ES6+的现代浏览器
- **Node.js**: 16.0+ (用于开发工具)
- **Git**: 最新版本

### 本地开发设置

1. **Fork 项目**
   ```bash
   # 在GitHub上点击Fork按钮
   ```

2. **克隆到本地**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-content-converter.git
   cd ai-content-converter
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   # 或使用Python
   python -m http.server 8080
   ```

5. **访问应用**
   ```
   http://localhost:8080
   ```

## 📋 贡献流程

### 1. 创建Issue

在开始编码之前，请先创建一个Issue来描述您要解决的问题或添加的功能：

- **Bug报告**: 使用Bug报告模板
- **功能请求**: 使用功能请求模板
- **文档改进**: 使用文档改进模板

### 2. 创建分支

```bash
# 创建并切换到新分支
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 3. 编写代码

#### 代码规范

- **JavaScript**: 使用ES6+语法，遵循[Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- **CSS**: 使用BEM命名规范，保持样式模块化
- **HTML**: 使用语义化标签，确保无障碍访问

#### 代码质量要求

- **注释**: 为复杂逻辑添加清晰的注释
- **函数**: 保持函数简洁，单一职责
- **变量**: 使用有意义的变量名
- **错误处理**: 添加适当的错误处理

#### 示例代码风格

```javascript
/**
 * 解析Markdown表格
 * @param {string} content - Markdown内容
 * @returns {Array} 解析后的表格数组
 */
function parseMarkdownTables(content) {
    if (!content || typeof content !== 'string') {
        throw new Error('内容必须是非空字符串');
    }
    
    const tables = [];
    // 实现逻辑...
    
    return tables;
}
```

### 4. 测试

#### 手动测试

- 测试所有主要功能
- 验证不同浏览器兼容性
- 检查响应式设计
- 测试错误处理

#### 测试用例

```javascript
// 示例测试用例
describe('内容检测器', () => {
    test('应该正确识别Markdown表格', () => {
        const content = '| 列1 | 列2 |\n|-----|-----|\n| 值1 | 值2 |';
        const result = contentDetector.detectContentType(content);
        expect(result).toBe('markdown');
    });
});
```

### 5. 提交代码

#### 提交信息规范

使用[Conventional Commits](https://www.conventionalcommits.org/)规范：

```bash
# 功能添加
git commit -m "feat: 添加实时预览功能"

# Bug修复
git commit -m "fix: 修复表格解析中的空单元格问题"

# 文档更新
git commit -m "docs: 更新API文档"

# 样式调整
git commit -m "style: 优化按钮样式"

# 重构
git commit -m "refactor: 重构内容检测模块"

# 测试
git commit -m "test: 添加表格解析测试用例"
```

### 6. 创建Pull Request

1. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **创建PR**
   - 在GitHub上创建Pull Request
   - 使用PR模板填写详细信息
   - 关联相关Issue

3. **PR描述模板**
   ```markdown
   ## 变更类型
   - [ ] Bug修复
   - [ ] 新功能
   - [ ] 文档更新
   - [ ] 样式调整
   - [ ] 重构
   
   ## 变更描述
   简要描述您的变更...
   
   ## 测试
   - [ ] 已进行手动测试
   - [ ] 已添加/更新测试用例
   - [ ] 所有测试通过
   
   ## 截图
   如果涉及UI变更，请提供截图
   
   ## 关联Issue
   Closes #123
   ```

## 🐛 Bug报告

### Bug报告模板

```markdown
**Bug描述**
简要描述遇到的问题

**复现步骤**
1. 进入页面
2. 点击按钮
3. 查看结果

**期望行为**
描述您期望发生的情况

**实际行为**
描述实际发生的情况

**环境信息**
- 操作系统: [例如 Windows 10]
- 浏览器: [例如 Chrome 91.0]
- 版本: [例如 v1.0.0]

**截图**
如果适用，请添加截图

**附加信息**
其他相关信息
```

## 💡 功能请求

### 功能请求模板

```markdown
**功能描述**
简要描述您希望添加的功能

**使用场景**
描述这个功能的使用场景

**解决方案**
描述您希望的解决方案

**替代方案**
描述您考虑过的替代方案

**附加信息**
其他相关信息
```

## 📚 文档贡献

### 文档类型

- **README.md**: 项目介绍和快速开始
- **API文档**: 函数和模块文档
- **用户指南**: 详细使用说明
- **开发文档**: 开发和部署指南

### 文档规范

- 使用清晰的标题层级
- 提供代码示例
- 添加截图说明
- 保持内容更新

## 🎨 设计贡献

### UI/UX改进

- 提供设计稿或原型
- 说明设计理念
- 考虑无障碍访问
- 保持品牌一致性

### 图标和素材

- 使用SVG格式
- 提供多种尺寸
- 确保版权清晰
- 符合项目风格

## 🏷️ 版本发布

### 版本号规范

遵循[语义化版本](https://semver.org/)规范：

- **主版本号**: 不兼容的API修改
- **次版本号**: 向下兼容的功能性新增
- **修订号**: 向下兼容的问题修正

### 发布流程

1. 更新版本号
2. 更新CHANGELOG.md
3. 创建Release标签
4. 发布Release说明

## 🤝 社区准则

### 行为准则

- 尊重所有参与者
- 使用包容性语言
- 专注于建设性讨论
- 接受建设性批评

### 沟通渠道

- **GitHub Issues**: 报告问题和功能请求
- **GitHub Discussions**: 一般讨论和问答
- **Pull Requests**: 代码审查和讨论

## 🎖️ 贡献者认可

我们会在以下地方认可贡献者：

- README.md中的贡献者列表
- 发布说明中的感谢
- 项目网站的贡献者页面

## 📞 获取帮助

如果您在贡献过程中遇到问题，可以通过以下方式获取帮助：

- 在相关Issue中提问
- 创建新的Discussion
- 发送邮件至 contribute@aiconverter.com

---

再次感谢您的贡献！每一个贡献都让这个项目变得更好。🙏

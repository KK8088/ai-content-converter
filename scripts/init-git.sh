#!/bin/bash

# AI内容格式转换工具 - Git初始化脚本
# 用于快速初始化Git仓库并推送到GitHub

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 项目信息
PROJECT_NAME="ai-content-converter"
GITHUB_USERNAME="your-username"  # 请替换为您的GitHub用户名
REPO_URL="https://github.com/${GITHUB_USERNAME}/${PROJECT_NAME}.git"

echo -e "${BLUE}🚀 AI内容格式转换工具 - Git初始化脚本${NC}"
echo -e "${BLUE}================================================${NC}"

# 检查是否已经是Git仓库
if [ -d ".git" ]; then
    echo -e "${YELLOW}⚠️  检测到已存在的Git仓库${NC}"
    read -p "是否要重新初始化？(y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${YELLOW}🗑️  删除现有Git仓库...${NC}"
        rm -rf .git
    else
        echo -e "${GREEN}✅ 保持现有Git仓库${NC}"
        exit 0
    fi
fi

# 初始化Git仓库
echo -e "${BLUE}📦 初始化Git仓库...${NC}"
git init

# 配置Git用户信息（如果未配置）
if [ -z "$(git config user.name)" ]; then
    echo -e "${YELLOW}⚙️  配置Git用户信息${NC}"
    read -p "请输入您的姓名: " git_name
    read -p "请输入您的邮箱: " git_email
    git config user.name "$git_name"
    git config user.email "$git_email"
fi

# 创建.gitignore文件
echo -e "${BLUE}📝 创建.gitignore文件...${NC}"
cat > .gitignore << 'EOF'
# 依赖
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# 构建输出
dist/
build/
*.tgz
*.tar.gz

# 运行时数据
pids
*.pid
*.seed
*.pid.lock

# 覆盖率目录
coverage/
.nyc_output

# 环境变量
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# 操作系统
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# 临时文件
*.tmp
*.temp
*.log

# 测试
.jest/
test-results/

# 部署
.vercel
.netlify

# 本地配置
config.local.js
EOF

# 添加所有文件
echo -e "${BLUE}📁 添加项目文件...${NC}"
git add .

# 创建初始提交
echo -e "${BLUE}💾 创建初始提交...${NC}"
git commit -m "feat: 初始化AI内容格式转换工具开源项目

✨ 功能特性:
- 智能内容检测算法，95%+准确率
- 专业Word文档生成
- 强大Excel表格转换
- 现代化响应式界面
- 多主题支持系统
- 模块化代码架构

🎯 开源版本特性:
- MIT开源协议
- 完整项目文档
- CI/CD自动化流程
- 社区贡献指南
- GitHub Pages部署

📦 技术栈:
- HTML5, CSS3, Vanilla JavaScript
- docx.js, xlsx.js, FileSaver.js
- 模块化架构，无框架依赖

🌟 立即体验: https://${GITHUB_USERNAME}.github.io/${PROJECT_NAME}"

# 设置主分支
echo -e "${BLUE}🌿 设置主分支...${NC}"
git branch -M main

# 提示用户创建GitHub仓库
echo -e "${YELLOW}⚠️  请先在GitHub上创建仓库${NC}"
echo -e "${BLUE}📋 操作步骤:${NC}"
echo "1. 访问 https://github.com/new"
echo "2. 仓库名称: ${PROJECT_NAME}"
echo "3. 描述: 将AI对话内容完美转换为专业的Word和Excel文档"
echo "4. 选择 Public（公开）"
echo "5. 不要初始化README、.gitignore或LICENSE（我们已经有了）"
echo "6. 点击 'Create repository'"
echo ""

read -p "已创建GitHub仓库？按Enter继续..." -r

# 添加远程仓库
echo -e "${BLUE}🔗 添加远程仓库...${NC}"
echo "请输入您的GitHub仓库URL（例如: https://github.com/username/ai-content-converter.git）"
read -p "仓库URL: " repo_url

if [ -z "$repo_url" ]; then
    repo_url=$REPO_URL
    echo -e "${YELLOW}使用默认URL: ${repo_url}${NC}"
fi

git remote add origin "$repo_url"

# 推送到GitHub
echo -e "${BLUE}🚀 推送到GitHub...${NC}"
echo -e "${YELLOW}注意: 如果需要身份验证，请使用Personal Access Token${NC}"

if git push -u origin main; then
    echo -e "${GREEN}✅ 成功推送到GitHub!${NC}"
    echo ""
    echo -e "${GREEN}🎉 恭喜！您的项目已成功发布到GitHub${NC}"
    echo -e "${BLUE}📋 下一步操作:${NC}"
    echo "1. 访问您的GitHub仓库页面"
    echo "2. 在Settings > Pages中启用GitHub Pages"
    echo "3. 选择 'Deploy from a branch' > 'main' > '/ (root)'"
    echo "4. 等待几分钟后访问在线演示"
    echo ""
    echo -e "${BLUE}🌐 预期的在线地址:${NC}"
    echo "https://$(echo $repo_url | sed 's/https:\/\/github.com\///g' | sed 's/\.git//g' | sed 's/\//.github.io\//g')"
    echo ""
    echo -e "${GREEN}🚀 项目发布完成！开始您的开源之旅吧！${NC}"
else
    echo -e "${RED}❌ 推送失败${NC}"
    echo -e "${YELLOW}💡 可能的解决方案:${NC}"
    echo "1. 检查网络连接"
    echo "2. 确认GitHub仓库已创建"
    echo "3. 检查仓库URL是否正确"
    echo "4. 确认GitHub身份验证（使用Personal Access Token）"
    echo ""
    echo -e "${BLUE}🔧 手动推送命令:${NC}"
    echo "git remote add origin $repo_url"
    echo "git push -u origin main"
fi

echo ""
echo -e "${BLUE}📚 有用的Git命令:${NC}"
echo "git status          # 查看仓库状态"
echo "git log --oneline   # 查看提交历史"
echo "git remote -v       # 查看远程仓库"
echo "git push            # 推送更改"
echo "git pull            # 拉取更新"

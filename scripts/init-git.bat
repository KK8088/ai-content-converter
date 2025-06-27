@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: AI内容格式转换工具 - Git初始化脚本 (Windows版)
:: 用于快速初始化Git仓库并推送到GitHub

title AI内容格式转换工具 - Git初始化

:: 项目信息
set PROJECT_NAME=ai-content-converter
set GITHUB_USERNAME=your-username
set REPO_URL=https://github.com/%GITHUB_USERNAME%/%PROJECT_NAME%.git

echo.
echo 🚀 AI内容格式转换工具 - Git初始化脚本
echo ================================================
echo.

:: 检查Git是否安装
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误: 未检测到Git，请先安装Git
    echo 📥 下载地址: https://git-scm.com/download/win
    pause
    exit /b 1
)

:: 检查是否已经是Git仓库
if exist ".git" (
    echo ⚠️  检测到已存在的Git仓库
    set /p "reinit=是否要重新初始化？(y/N): "
    if /i "!reinit!"=="y" (
        echo 🗑️  删除现有Git仓库...
        rmdir /s /q .git
    ) else (
        echo ✅ 保持现有Git仓库
        pause
        exit /b 0
    )
)

:: 初始化Git仓库
echo 📦 初始化Git仓库...
git init

:: 配置Git用户信息（如果未配置）
for /f "tokens=*" %%i in ('git config user.name 2^>nul') do set git_name=%%i
if "!git_name!"=="" (
    echo ⚙️  配置Git用户信息
    set /p "git_name=请输入您的姓名: "
    set /p "git_email=请输入您的邮箱: "
    git config user.name "!git_name!"
    git config user.email "!git_email!"
)

:: 创建.gitignore文件
echo 📝 创建.gitignore文件...
(
echo # 依赖
echo node_modules/
echo npm-debug.log*
echo yarn-debug.log*
echo yarn-error.log*
echo.
echo # 构建输出
echo dist/
echo build/
echo *.tgz
echo *.tar.gz
echo.
echo # 运行时数据
echo pids
echo *.pid
echo *.seed
echo *.pid.lock
echo.
echo # 覆盖率目录
echo coverage/
echo .nyc_output
echo.
echo # 环境变量
echo .env
echo .env.local
echo .env.development.local
echo .env.test.local
echo .env.production.local
echo.
echo # IDE
echo .vscode/
echo .idea/
echo *.swp
echo *.swo
echo *~
echo.
echo # 操作系统
echo .DS_Store
echo .DS_Store?
echo ._*
echo .Spotlight-V100
echo .Trashes
echo ehthumbs.db
echo Thumbs.db
echo.
echo # 临时文件
echo *.tmp
echo *.temp
echo *.log
echo.
echo # 测试
echo .jest/
echo test-results/
echo.
echo # 部署
echo .vercel
echo .netlify
echo.
echo # 本地配置
echo config.local.js
) > .gitignore

:: 添加所有文件
echo 📁 添加项目文件...
git add .

:: 创建初始提交
echo 💾 创建初始提交...
git commit -m "feat: 初始化AI内容格式转换工具开源项目

✨ 功能特性:
- 智能内容检测算法，95%%+准确率
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

🌟 立即体验: https://%GITHUB_USERNAME%.github.io/%PROJECT_NAME%"

:: 设置主分支
echo 🌿 设置主分支...
git branch -M main

:: 提示用户创建GitHub仓库
echo.
echo ⚠️  请先在GitHub上创建仓库
echo 📋 操作步骤:
echo 1. 访问 https://github.com/new
echo 2. 仓库名称: %PROJECT_NAME%
echo 3. 描述: 将AI对话内容完美转换为专业的Word和Excel文档
echo 4. 选择 Public（公开）
echo 5. 不要初始化README、.gitignore或LICENSE（我们已经有了）
echo 6. 点击 'Create repository'
echo.
pause

:: 添加远程仓库
echo 🔗 添加远程仓库...
echo 请输入您的GitHub仓库URL（例如: https://github.com/username/ai-content-converter.git）
set /p "repo_url=仓库URL: "

if "!repo_url!"=="" (
    set repo_url=%REPO_URL%
    echo 使用默认URL: !repo_url!
)

git remote add origin "!repo_url!"

:: 推送到GitHub
echo 🚀 推送到GitHub...
echo ⚠️  注意: 如果需要身份验证，请使用Personal Access Token

git push -u origin main
if errorlevel 1 (
    echo.
    echo ❌ 推送失败
    echo 💡 可能的解决方案:
    echo 1. 检查网络连接
    echo 2. 确认GitHub仓库已创建
    echo 3. 检查仓库URL是否正确
    echo 4. 确认GitHub身份验证（使用Personal Access Token）
    echo.
    echo 🔧 手动推送命令:
    echo git remote add origin !repo_url!
    echo git push -u origin main
) else (
    echo.
    echo ✅ 成功推送到GitHub!
    echo.
    echo 🎉 恭喜！您的项目已成功发布到GitHub
    echo 📋 下一步操作:
    echo 1. 访问您的GitHub仓库页面
    echo 2. 在Settings ^> Pages中启用GitHub Pages
    echo 3. 选择 'Deploy from a branch' ^> 'main' ^> '/ (root)'
    echo 4. 等待几分钟后访问在线演示
    echo.
    echo 🌐 预期的在线地址:
    for /f "tokens=3,4 delims=/" %%a in ("!repo_url!") do (
        set domain=%%a
        set repo=%%b
    )
    for /f "tokens=1 delims=." %%c in ("!repo!") do set clean_repo=%%c
    echo https://!domain!.github.io/!clean_repo!
    echo.
    echo 🚀 项目发布完成！开始您的开源之旅吧！
)

echo.
echo 📚 有用的Git命令:
echo git status          # 查看仓库状态
echo git log --oneline   # 查看提交历史
echo git remote -v       # 查看远程仓库
echo git push            # 推送更改
echo git pull            # 拉取更新
echo.

pause

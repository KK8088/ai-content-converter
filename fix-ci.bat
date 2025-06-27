@echo off
chcp 65001 >nul
echo 🔧 修复CI/CD配置...

echo 📝 添加修复的文件...
git add .github/workflows/ci.yml
git add package.json
git add package-lock.json

echo 💾 提交修复...
git commit -m "fix: 修复CI/CD配置错误

🔧 修复内容:
- 简化GitHub Actions配置，适配纯前端项目
- 移除Node.js依赖检查，改为基础文件检查
- 添加HTML语法检查和服务器响应测试
- 简化package.json，移除不必要的依赖
- 添加package-lock.json文件

✅ 现在CI/CD应该可以正常运行了"

echo 🚀 推送到GitHub...
git push

echo ✅ 修复完成！请检查GitHub Actions状态
pause

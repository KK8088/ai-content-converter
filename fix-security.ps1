# AI内容格式转换工具 - 安全修复脚本
Write-Host "🔒 修复安全扫描警告..." -ForegroundColor Blue

Write-Host "📝 添加安全修复的文件..." -ForegroundColor Yellow
git add js/utils.js
git add js/app.js

Write-Host "💾 提交安全修复..." -ForegroundColor Yellow
git commit -m "fix: 修复CodeQL安全扫描警告

🔒 安全修复内容:
- 增强文件上传验证和错误处理
- 添加XSS防护，过滤潜在的脚本内容
- 改进DOM操作的空值检查
- 增强文件下载的错误处理
- 添加输入长度限制防止过长内容
- 改进HTML实体处理的安全性

✅ 提升代码安全性和健壮性"

Write-Host "🚀 推送到GitHub..." -ForegroundColor Yellow
git push

Write-Host "✅ 安全修复完成！CodeQL扫描应该通过了" -ForegroundColor Green
Write-Host "🌐 请检查GitHub Actions状态和在线演示" -ForegroundColor Green

Read-Host "按Enter键退出"

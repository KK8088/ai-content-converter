# AI Content Converter - Project Cleanup Script
Write-Host "Cleaning up project files..." -ForegroundColor Blue

Write-Host "Step 1: Removing temporary fix scripts..." -ForegroundColor Yellow
$filesToRemove = @(
    "final-fix.bat",
    "fix-ci.bat", 
    "fix-security-win.bat",
    "fix-security.bat",
    "fix-security.ps1",
    "quick-fix.bat",
    "update-github-account.bat",
    "complete-opensource-setup.bat",
    "RELEASE_CHECKLIST.md"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item $file
        Write-Host "- Removed $file" -ForegroundColor Green
    }
}

Write-Host "Step 2: Removing temporary files..." -ForegroundColor Yellow
Get-ChildItem -Path . -Include "*.tmp", "*.temp", "*.log" -Recurse | Remove-Item -Force
Write-Host "- Removed temporary files" -ForegroundColor Green

Write-Host "Step 3: Adding cleaned project to git..." -ForegroundColor Yellow
git add .
git add -u

Write-Host "Step 4: Committing cleanup..." -ForegroundColor Yellow
git commit -m "chore: Clean up project files

- Removed temporary and development files
- Removed temporary fix scripts
- Removed development process files  
- Added project organization files
- Added .gitignore for future protection
- Added PROJECT_STRUCTURE.md documentation

Project is now clean and production-ready!"

Write-Host "Step 5: Pushing to GitHub..." -ForegroundColor Yellow
git push

Write-Host "SUCCESS: Project cleanup completed!" -ForegroundColor Green
Write-Host "Project is now clean, professional, and production-ready" -ForegroundColor Green

Read-Host "Press Enter to exit"

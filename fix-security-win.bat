@echo off
setlocal enabledelayedexpansion

echo.
echo [INFO] Fixing CodeQL security warnings...
echo.

echo [STEP 1] Adding modified files...
git add js/utils.js js/app.js

if errorlevel 1 (
    echo [ERROR] Failed to add files
    pause
    exit /b 1
)

echo [STEP 2] Committing security fixes...
git commit -m "fix: Fix CodeQL security warnings - Enhanced input validation and XSS protection - Improved error handling for file operations - Added length limits for content processing - Strengthened DOM manipulation safety"

if errorlevel 1 (
    echo [ERROR] Failed to commit changes
    pause
    exit /b 1
)

echo [STEP 3] Pushing to GitHub...
git push

if errorlevel 1 (
    echo [ERROR] Failed to push to GitHub
    echo [INFO] Please check your network connection and GitHub credentials
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Security fixes completed successfully!
echo [INFO] Please check GitHub Actions status
echo [INFO] CodeQL scan should now pass
echo.

pause

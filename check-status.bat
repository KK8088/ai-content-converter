@echo off
chcp 65001 >nul

echo [INFO] Checking project status after directory rename...

echo [CURRENT DIRECTORY]
echo %cd%

echo.
echo [GIT STATUS]
git status

echo.
echo [GIT REMOTE]
git remote -v

echo.
echo [BACKUP FILES CHECK]
if exist "CHAT_BACKUP.md" (
    echo ✅ CHAT_BACKUP.md exists
) else (
    echo ❌ CHAT_BACKUP.md missing
)

if exist "TECHNICAL_NOTES.md" (
    echo ✅ TECHNICAL_NOTES.md exists  
) else (
    echo ❌ TECHNICAL_NOTES.md missing
)

echo.
echo [PROJECT FILES CHECK]
if exist "index.html" (
    echo ✅ index.html exists
) else (
    echo ❌ index.html missing
)

if exist "js\app.js" (
    echo ✅ js\app.js exists
) else (
    echo ❌ js\app.js missing
)

if exist "README.md" (
    echo ✅ README.md exists
) else (
    echo ❌ README.md missing
)

echo.
echo [RECOMMENDATIONS]
echo 1. If you renamed the folder, Augment may need to reconnect
echo 2. All your project files and Git history are preserved
echo 3. Use CHAT_BACKUP.md to review conversation history
echo 4. Use TECHNICAL_NOTES.md for technical details
echo 5. Continue development in this directory

echo.
echo [NEXT STEPS]
echo - Review backup files for conversation history
echo - Test the application: python -m http.server 8080
echo - Continue development with full project context
echo.
pause

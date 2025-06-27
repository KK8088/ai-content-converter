@echo off
chcp 65001 >nul

echo [INFO] Creating chat backup...

echo [STEP 1] Adding backup files to git...
git add CHAT_BACKUP.md
git add TECHNICAL_NOTES.md

echo [STEP 2] Committing backup...
git commit -m "docs: Add comprehensive chat and technical backup

- CHAT_BACKUP.md: Complete conversation history and project summary
- TECHNICAL_NOTES.md: Key technical implementation details
- Includes development process, decisions, and lessons learned
- Preserves important knowledge for future reference"

echo [STEP 3] Pushing backup to GitHub...
git push

echo [SUCCESS] Chat backup completed!
echo.
echo [BACKUP FILES CREATED]:
echo - CHAT_BACKUP.md (Complete conversation summary)
echo - TECHNICAL_NOTES.md (Technical implementation details)
echo.
echo [BACKUP LOCATION]:
echo - Local: Current project folder
echo - Remote: GitHub repository
echo - Online: https://github.com/KK8088/ai-content-converter
echo.
pause

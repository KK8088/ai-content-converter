@echo off
echo Adding files...
git add .

echo Committing changes...
git commit -m "fix: security improvements"

echo Pushing to GitHub...
git push

echo Done! Check GitHub Actions.
pause

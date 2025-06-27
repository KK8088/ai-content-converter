@echo off
echo [INFO] Updating GitHub account to KK8088...

echo [STEP 1] Adding updated files...
git add js/config.js
git add package.json
git add README.md

echo [STEP 2] Committing changes...
git commit -m "fix: Update GitHub account to KK8088

- Updated all GitHub URLs from your-username to KK8088
- Fixed repository URLs in package.json
- Updated README.md links and badges
- Updated config.js GitHub information
- Fixed homepage and issues URLs

This should resolve GitHub Pages deployment issues."

echo [STEP 3] Pushing to GitHub...
git push

echo [SUCCESS] GitHub account updated successfully!
echo [INFO] GitHub Pages should now deploy correctly
echo [INFO] Online demo will be available at: https://KK8088.github.io/ai-content-converter
pause

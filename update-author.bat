@echo off
chcp 65001 >nul

echo [INFO] Updating author information to zk0x01...

echo [STEP 1] Adding updated files...
git add package.json
git add js/config.js
git add js/app.js
git add js/utils.js
git add js/contentDetector.js
git add js/markdownParser.js
git add LICENSE
git add README.md
git add TECHNICAL_NOTES.md

echo [STEP 2] Committing author update...
git commit -m "chore: Update author information to zk0x01

- Updated package.json author field
- Updated js/config.js author configuration
- Updated all JavaScript module headers (@author)
- Updated LICENSE copyright holder
- Updated README.md attribution
- Updated TECHNICAL_NOTES.md examples

All project files now consistently show zk0x01 as the author."

echo [STEP 3] Pushing changes to GitHub...
git push

echo [SUCCESS] Author information updated successfully!
echo.
echo [UPDATED FILES]:
echo - package.json (author field)
echo - js/config.js (author configuration)
echo - js/app.js (@author header)
echo - js/utils.js (@author header)
echo - js/contentDetector.js (@author header)
echo - js/markdownParser.js (@author header)
echo - LICENSE (copyright holder)
echo - README.md (attribution)
echo - TECHNICAL_NOTES.md (examples)
echo.
echo [AUTHOR INFO NOW SHOWS]: zk0x01
echo.
pause

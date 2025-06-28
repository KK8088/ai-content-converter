@echo off
chcp 65001 >nul

echo [INFO] Releasing version 1.1.1 - Project Cleanup and Reorganization...

echo [STEP 1] Checking current status...
git status

echo.
echo [STEP 2] Adding all changes...
git add .

echo.
echo [STEP 3] Committing version 1.1.1...
git commit -m "release: Version 1.1.1 - Project Cleanup and Reorganization

🧹 Project Structure Optimization - Version 1.1.1

📁 File Organization:
- Move development documents to archive/ folder (not synced to GitHub)
- Keep only core project files in root directory
- Maintain clean and professional project structure
- Add PROJECT_STRUCTURE.md for documentation

📧 Contact Information Standardization:
- Update all email addresses to admin@zk0x01.com
- Standardize contact information across all documents
- Ensure consistent communication channels

📋 Documentation Updates:
- Update CHANGELOG.md with v1.1.1 release notes
- Update version numbers in package.json, config.js, index.html
- Create comprehensive release notes for v1.1.1

🎯 Benefits:
- Professional open source project structure
- Compliant with open source best practices
- Clean repository with only essential files
- Unified contact information for better support
- Improved maintainability and navigation

🔧 Technical Details:
- All core functionality remains unchanged
- Complete backward compatibility maintained
- No impact on user experience or performance
- Enhanced project organization for future development

This is a maintenance release focused on project organization and standardization,
preparing the foundation for future feature development."

echo.
echo [STEP 4] Creating Git tag for v1.1.1...
git tag -a v1.1.1 -m "Version 1.1.1: Project Cleanup and Reorganization

Maintenance release focusing on:
- Project structure optimization and file organization
- Contact information standardization (admin@zk0x01.com)
- Documentation updates and improvements
- Clean repository structure following open source best practices

All core functionality preserved with complete backward compatibility.
This release establishes a solid foundation for future development."

echo.
echo [STEP 5] Pushing to GitHub with tags...
git push origin main
git push origin v1.1.1

echo.
echo [SUCCESS] Version 1.1.1 released successfully!
echo.
echo [RELEASE SUMMARY]:
echo - Version: 1.1.1
echo - Release Date: 2025-06-28
echo - Type: Maintenance Release (Project Cleanup)
echo - Focus: Structure Optimization and Contact Standardization
echo.
echo [KEY IMPROVEMENTS]:
echo 1. Clean project structure with archive/ for development docs
echo 2. Unified contact email: admin@zk0x01.com
echo 3. Professional open source project organization
echo 4. Enhanced documentation and maintenance guidelines
echo.
echo [NEXT STEPS]:
echo 1. Create GitHub release page using RELEASE_NOTES_v1.1.1.md
echo 2. Update project documentation if needed
echo 3. Begin planning v1.2.0 with new features
echo 4. Collect user feedback on improved structure
echo.
echo [ONLINE DEMO]: https://KK8088.github.io/ai-content-converter
echo [REPOSITORY]: https://github.com/KK8088/ai-content-converter
echo [RELEASES]: https://github.com/KK8088/ai-content-converter/releases
echo [CONTACT]: admin@zk0x01.com
echo.
pause

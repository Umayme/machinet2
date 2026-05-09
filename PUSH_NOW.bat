@echo off
cd /d "%~dp0"
echo Pushing to GitHub...
git push origin main
echo.
echo Done! Check Vercel for the build status.
pause

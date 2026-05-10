@echo off
cd /d "%~dp0"
echo Pushing fix to GitHub...
git push origin main --force
echo.
echo Done!
pause

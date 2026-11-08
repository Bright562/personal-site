@echo off
cd /d "%~dp0"
echo.
echo   Personal Profile - starting local server...
echo.
echo   Open in browser:  http://127.0.0.1:8900
echo   Close this window to stop the server.
echo.
start "" /min cmd /c "timeout /t 2 >nul && start http://127.0.0.1:8900/"
python -m http.server 8900 --bind 127.0.0.1

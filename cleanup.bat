@echo off
echo Stopping Node.js processes...
taskkill /F /IM node.exe >nul 2>&1

echo Removing node_modules and lock files...
rmdir /s /q node_modules >nul 2>&1
del /f /q package-lock.json >nul 2>&1
del /f /q pnpm-lock.yaml >nul 2>&1
del /f /q yarn.lock >nul 2>&1

echo Clearing npm cache...
npm cache clean --force >nul 2>&1

echo Reinstalling dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo Failed to install dependencies. Please try running as Administrator.
    pause
    exit /b 1
)

echo Installing Vite and core dependencies...
call npm install --save-dev vite @vitejs/plugin-vue
call npm install core-js@3

if %ERRORLEVEL% NEQ 0 (
    echo Failed to install additional dependencies.
    pause
    exit /b 1
)

echo Installing PDF libraries...
call npm install jspdf@2.5.1 jspdf-autotable@3.8.2

echo.
echo Cleanup and reinstallation complete!
pause

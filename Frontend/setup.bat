@echo off
REM Quick Start Guide for Integrated Auth Canvas Project

echo.
echo ========================================
echo   Auth Canvas - Integrated Full-Stack Project
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed.
    echo   Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo + Node.js version:
node -v
echo + npm version:
npm -v
echo.

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file from .env.example...
    copy .env.example .env
    echo + .env file created. Please edit it with your GitHub OAuth credentials.
    echo.
    echo To get GitHub OAuth credentials:
    echo 1. Go to GitHub Settings ^> Developer settings ^> OAuth apps
    echo 2. Create a new OAuth application
    echo 3. Set Authorization callback URL to: http://localhost:5173/api/auth/github-callback
    echo 4. Copy Client ID and Client Secret to .env
    echo.
)

REM Install dependencies
echo Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo + Setup complete!
echo.
echo === Next steps ===
echo 1. Edit .env file with your configuration:
echo    - GITHUB_CLIENT_ID
echo    - GITHUB_CLIENT_SECRET
echo    - JWT_SECRET (optional, will use default in dev)
echo.
echo 2. Start the development server:
echo    npm run dev
echo.
echo 3. Open your browser:
echo    http://localhost:5173
echo.
echo === Documentation ===
echo - INTEGRATION_GUIDE.md - Full integration documentation
echo - MIGRATION_GUIDE.md - Migration from separate projects
echo - API endpoints in src/routes/api/auth/
echo.
pause

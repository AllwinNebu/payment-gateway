@echo off
TITLE Fullstack Project Launcher
ECHO Starting Fullstack Project Components...

REM 1. Start Python Backend
ECHO [1/3] Starting Python Backend...
start "Python Backend" cmd /k "cd payment-gateway\pqc-enabaled-dual-device-payment-gateway\Primary\Backend && echo Activating Conda Environment... && call conda activate pqc_backend && echo Installing Python dependencies... && pip install -r ../requirements.txt && python primary_backend.py"

REM 2. Start Node Backend
ECHO [2/3] Starting Node Backend...
start "Node Backend" cmd /k "cd payment-gateway\banking && echo Checking Node dependencies... && call npm install && node server/index.js"

REM 3. Start React Frontend
ECHO [3/3] Starting React Frontend...
start "React Frontend" cmd /k "cd payment-gateway\banking && echo Checking React dependencies... && call npm install && npm run dev"

ECHO All components have been launched in separate windows.
ECHO - Python Backend: Conda 'pqc_backend'
ECHO - Node Backend: npm install + node server
ECHO - React Frontend: npm install + npm run dev
ECHO.
PAUSE

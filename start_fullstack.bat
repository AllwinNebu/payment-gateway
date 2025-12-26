@echo off
TITLE Fullstack Project Launcher
ECHO Starting Fullstack Project Components...

REM 1. Start Python Backend (Primary)
ECHO [1/4] Starting Python Primary Backend...
start "Python Primary" cmd /k "cd payment-gateway\pqc-enabaled-dual-device-payment-gateway\Primary\Backend && echo Activating Conda Environment... && call conda activate pqc_backend && echo Installing Python dependencies... && pip install -r ../requirements.txt && python primary_backend.py"

REM 2. Start Python Gateway
ECHO [2/4] Starting Python Gateway...
start "Python Gateway" cmd /k "cd payment-gateway\pqc-enabaled-dual-device-payment-gateway\Primary\gateway && echo Activating Conda Environment... && call conda activate pqc_backend && python gateway.py"

REM 3. Start Node Backend
ECHO [3/4] Starting Node Backend...
start "Node Backend" cmd /k "cd payment-gateway\banking && echo Checking Node dependencies... && call npm install && node server/index.js"

REM 4. Start React Frontend
ECHO [4/4] Starting React Frontend...
start "React Frontend" cmd /k "cd payment-gateway\banking && echo Checking React dependencies... && call npm install && npm run dev"

ECHO All components have been launched in separate windows.
ECHO - Python Primary: Port 7001
ECHO - Python Gateway: Port 5001
ECHO - Node Backend: Port 3000 (usually)
ECHO - React Frontend: npm run dev
ECHO.
PAUSE

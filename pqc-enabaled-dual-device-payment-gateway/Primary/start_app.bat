@echo off
echo Starting Secure Banking System...

REM 
echo Starting backend...
start cmd /k "cd backend && python primary_backend.py"

REM 
timeout /t 3 >nul

REM 
echo Starting gateway...
start cmd /k "cd gateway && python gateway.py"

REM 
echo Opening website...
start http://localhost:3000

echo System is running.
echo User only needs to use the website.
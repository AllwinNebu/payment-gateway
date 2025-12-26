@echo off
TITLE Fullstack Project Setup
ECHO ==========================================
ECHO      Fullstack Project Initial Setup
ECHO ==========================================
ECHO.
ECHO This script will:
ECHO 1. Create the 'pqc_backend' Conda environment.
ECHO 2. Install Python dependencies.
ECHO 3. Install Node.js dependencies for Frontend and Backend.
ECHO.
PAUSE

REM --- 1. Python/Conda Setup ---
ECHO.
ECHO [1/3] Setting up Python Environment...
call conda --version >nul 2>&1
IF %ERRORLEVEL% NEQ 0 (
    ECHO [ERROR] Conda is not found in your PATH. Please install Anaconda or Miniconda first.
    PAUSE
    EXIT /B 1
)

ECHO Checking for environment 'pqc_backend'...
call conda env list | findstr "pqc_backend" >nul
IF %ERRORLEVEL% EQU 0 (
    ECHO Environment 'pqc_backend' already exists. Skipping creation.
) ELSE (
    ECHO Creating Conda environment 'pqc_backend'...
    call conda create -n pqc_backend python=3.9 -y
)

ECHO Installing Python dependencies...
REM Activate env - complex in batch, usually requires calling activate.bat depending on install
REM simpler to use 'conda run' for installation if possible, or try activating.
call conda activate pqc_backend
IF %ERRORLEVEL% NEQ 0 (
    ECHO Failed to activate conda env. Trying to run pip via conda run...
    call conda run -n pqc_backend pip install -r "pqc-enabaled-dual-device-payment-gateway\Primary\requirements.txt"
) ELSE (
    call pip install -r "pqc-enabaled-dual-device-payment-gateway\Primary\requirements.txt"
)

REM --- 2. Node Backend Setup ---
ECHO.
ECHO [2/3] Installing Node Backend Dependencies...
cd "banking"
call npm install
cd "..\.."

REM --- 3. React Frontend Setup ---
ECHO.
ECHO [3/3] Installing React Frontend Dependencies...
ECHO (Note: This uses the same package.json as the backend folder in this project structure)
REM In this specific project, the frontend (vite) and backend (express) seem to be in the same 'banking' package.json
REM If they were separate, we'd cd to the other folder. 
REM Since they are shared/SAME folder:
ECHO Dependencies already installed in step 2.

ECHO.
ECHO ==========================================
ECHO           Setup Complete!
ECHO ==========================================
ECHO You can now run 'start_fullstack.bat' to launch the system.
PAUSE

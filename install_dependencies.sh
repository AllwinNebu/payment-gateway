#!/bin/bash

# Configuration
PROJECT_ROOT="$(pwd)"
PYTHON_SETUP_SCRIPT="payment-gateway/pqc-enabaled-dual-device-payment-gateway/Primary/setup_env.sh"
BANKING_DIR="payment-gateway/banking"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Starting Fullstack Project Setup ===${NC}"

# 1. Python Setup
echo -e "\n${BLUE}[1/2] Setting up Python Environment...${NC}"
if [ -f "$PYTHON_SETUP_SCRIPT" ]; then
    chmod +x "$PYTHON_SETUP_SCRIPT"
    # Execute the existing setup script
    (cd "$(dirname "$PYTHON_SETUP_SCRIPT")" && ./setup_env.sh)
else
    echo "Error: Python setup script not found at $PYTHON_SETUP_SCRIPT"
    exit 1
fi

# 2. Node Setup
echo -e "\n${BLUE}[2/2] Installing Node/React Dependencies...${NC}"
if [ -d "$BANKING_DIR" ]; then
    cd "$BANKING_DIR"
    echo "Running npm install in $BANKING_DIR..."
    npm install
    cd "$PROJECT_ROOT"
else
    echo "Error: Banking directory not found at $BANKING_DIR"
fi

echo -e "\n${GREEN}=== Setup Complete! ===${NC}"
echo "You can now run './start_fullstack.sh' to launch the system."

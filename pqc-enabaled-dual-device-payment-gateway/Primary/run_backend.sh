#!/bin/bash

# Configuration
ENV_NAME="pqc_backend"
PRIMARY_PORT=7001
GATEWAY_PORT=5001

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Cleanup function to kill background processes on exit
cleanup() {
    echo -e "\n${RED}Stopping services...${NC}"
    kill $PID_PRIMARY 2>/dev/null
    kill $PID_GATEWAY 2>/dev/null
    
    # Force kill conflicting ports just in case
    lsof -ti:$PRIMARY_PORT | xargs kill -9 2>/dev/null
    lsof -ti:$GATEWAY_PORT | xargs kill -9 2>/dev/null
    
    exit
}

# Trap SIGINT (Ctrl+C)
trap cleanup SIGINT

echo -e "${GREEN}Starting PQC Payment Gateway Backend...${NC}"

# Pre-cleanup: Ensure ports are free
echo -e "${BLUE}Ensuring ports $PRIMARY_PORT and $GATEWAY_PORT are free...${NC}"
lsof -ti:$PRIMARY_PORT | xargs kill -9 2>/dev/null
lsof -ti:$GATEWAY_PORT | xargs kill -9 2>/dev/null

# Check Conda Env
if ! conda env list | grep -q "$ENV_NAME"; then
    echo -e "${RED}Error: Conda environment '$ENV_NAME' not found.${NC}"
    echo "Run ./setup_env.sh first."
    exit 1
fi

# Start Primary Backend
echo -e "${BLUE}Starting Primary Backend (Port $PRIMARY_PORT)...${NC}"
# Use nohup or just backgrounding? Just backgrounding is fine for interactive use.
# We change directory to ensure relative paths (keys, etc.) work if any.
(cd Backend && conda run -n "$ENV_NAME" python primary_backend.py) & 
PID_PRIMARY=$!
echo "Primary Backend PID: $PID_PRIMARY"

# Wait a bit for Primary to initialize
sleep 2

# Start Gateway
echo -e "${BLUE}Starting Gateway Service (Port $GATEWAY_PORT)...${NC}"
(cd gateway && conda run -n "$ENV_NAME" python gateway.py) &
PID_GATEWAY=$!
echo "Gateway PID: $PID_GATEWAY"

echo -e "${GREEN}All services started.${NC}"
echo -e "Primary Backend: http://127.0.0.1:$PRIMARY_PORT"
echo -e "Gateway Service: http://127.0.0.1:$GATEWAY_PORT"
echo -e "${BLUE}Press Ctrl+C to stop all services.${NC}"

# Wait for processes
wait $PID_PRIMARY $PID_GATEWAY

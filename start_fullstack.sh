#!/bin/bash

# Configuration
PROJECT_ROOT="$(pwd)"
BANKING_DIR="banking"
PYTHON_DIR="pqc-enabaled-dual-device-payment-gateway/Primary"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}Starting Fullstack Project...${NC}"

# Check which OS
OS="$(uname)"

start_tab_macos() {
    local TITLE=$1
    local CMD=$2
    local DIR=$3
    
    osascript -e "tell application \"Terminal\" to do script \"cd \\\"$PROJECT_ROOT/$DIR\\\" && $CMD\""
}

start_linux() {
    # Try common terminal emulators
    local TITLE=$1
    local CMD=$2
    local DIR=$3
    
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --title="$TITLE" -- bash -c "cd \"$PROJECT_ROOT/$DIR\"; $CMD; exec bash"
    elif command -v konsole &> /dev/null; then
        konsole --new-tab --workdir "$PROJECT_ROOT/$DIR" -e bash -c "$CMD; exec bash"
    elif command -v xterm &> /dev/null; then
        xterm -T "$TITLE" -e "cd \"$PROJECT_ROOT/$DIR\"; $CMD; exec bash" &
    else
        echo "No suitable terminal emulator found. Running in background."
        (cd "$PROJECT_ROOT/$DIR" && eval "$CMD") &
    fi
}

# 1. Start Node Backend
echo -e "${BLUE}Launching Node Backend...${NC}"
CMD_NODE="node server/index.js"
if [ "$OS" == "Darwin" ]; then
    start_tab_macos "Node Backend" "$CMD_NODE" "$BANKING_DIR"
else
    start_linux "Node Backend" "$CMD_NODE" "$BANKING_DIR"
fi

# 2. Start React Frontend
echo -e "${BLUE}Launching React Frontend...${NC}"
CMD_REACT="npm run dev"
if [ "$OS" == "Darwin" ]; then
    start_tab_macos "React Frontend" "$CMD_REACT" "$BANKING_DIR"
else
    start_linux "React Frontend" "$CMD_REACT" "$BANKING_DIR"
fi

# 3. Start Python Backend (using existing run_backend.sh)
echo -e "${BLUE}Launching Python Backend System...${NC}"
# run_backend.sh expects to be run from its own directory usually to find 'Backend' and 'gateway' folders relative to it.
CMD_PYTHON="./run_backend.sh"
if [ "$OS" == "Darwin" ]; then
    start_tab_macos "Python Backend" "$CMD_PYTHON" "$PYTHON_DIR"
else
    start_linux "Python Backend" "$CMD_PYTHON" "$PYTHON_DIR"
fi

echo -e "${GREEN}All commands issued.${NC}"
echo "Check the opened Terminal windows/tabs for logs."

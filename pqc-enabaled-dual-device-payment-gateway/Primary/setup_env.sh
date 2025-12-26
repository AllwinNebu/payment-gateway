#!/bin/bash

# Configuration
ENV_NAME="pqc_backend"
PYTHON_VERSION="3.9"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting setup for ${ENV_NAME}...${NC}"

# Check for Conda
if ! command -v conda &> /dev/null; then
    echo "Conda is not installed. Please install Anaconda or Miniconda first."
    exit 1
fi

# Create Environment
if conda info --envs | grep -q "$ENV_NAME"; then
    echo -e "${YELLOW}Environment $ENV_NAME already exists.${NC}"
    read -p "Do you want to recreate it? (y/N) " response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        echo "Removing existing environment..."
        conda env remove -n "$ENV_NAME" -y
        echo "Creating new environment..."
        conda create -n "$ENV_NAME" python="$PYTHON_VERSION" -y
    else
        echo "Skipping creation."
    fi
else
    echo "Creating environment $ENV_NAME..."
    conda create -n "$ENV_NAME" python="$PYTHON_VERSION" -y
fi

# Install Dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
if [ -f "requirements.txt" ]; then
    conda run -n "$ENV_NAME" pip install -r requirements.txt
    echo -e "${GREEN}Dependencies installed successfully.${NC}"
else
    echo -e "${YELLOW}requirements.txt not found in current directory.${NC}"
fi

echo -e "${GREEN}Setup complete!${NC}"
echo -e "To activate the environment, run: ${YELLOW}conda activate $ENV_NAME${NC}"

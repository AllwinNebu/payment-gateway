# Fullstack Banking Project

This project consists of three main components:
1. **React Frontend** (`banking`)
2. **Node.js Backend** (`banking/server`)
3. **Python PQC Backend** (`pqc-enabaled-dual-device-payment-gateway/Primary`)

## �️ Setup Instructions

Before running the application, you need to manually install the dependencies.

### 1. Install Node.js Dependencies
Open a terminal in the `banking` folder and run:
```bash
cd banking
npm install
```
*This installs dependencies for both the React frontend and Node backend.*

### 2. Set up Python Environment (Conda)
You need to create a Conda environment named `pqc_backend` and install the requirements.

**Open a terminal and run:**
```bash
# Create the environment
conda create -n pqc_backend python=3.9 -y

# Activate it
conda activate pqc_backend

# Install dependencies
# (Adjust path if you are not in the root 'payment-gateway' folder)
pip install -r pqc-enabaled-dual-device-payment-gateway/Primary/requirements.txt
```

---

## ▶️ Running the App

Once you have installed the dependencies and created the Conda environment, you can run the entire system using the provided start script.

### 🪟 Windows
Double-click **`start_fullstack.bat`**.
*This launches 4 terminal windows handling all backend and frontend services.*

### 🍎 macOS / 🐧 Linux
Run the following in the terminal:
```bash
./start_fullstack.sh
```
*This opens separate tabs/windows for each service.*

open the localhost link

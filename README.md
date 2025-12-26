# Fullstack Banking Project

This project consists of three main components:
1. **React Frontend** (`payment-gateway/banking`)
2. **Node.js Backend** (`payment-gateway/banking/server`)
3. **Python PQC Backend** (`payment-gateway/pqc-enabaled-dual-device-payment-gateway/Primary`)

## 🚀 Setup (First Run Only)

Before running the application on a new device, you must install the dependencies (Python Conda Environment + Node Modules).

### 🪟 Windows
1. Double-click **`install_dependencies.bat`**.
2. Follow the on-screen instructions. It will:
   - Check for Conda (Anaconda/Miniconda).
   - Create the `pqc_backend` environment.
   - Install Python libraries.
   - Install Node.js libraries (`npm install`).

### 🍎 macOS / 🐧 Linux
1. Open a terminal.
2. Run the setup script:
   ```bash
   chmod +x install_dependencies.sh
   ./install_dependencies.sh
   ```

---

## ▶️ Running the App

Once setup is complete:

### 🪟 Windows
Double-click **`start_fullstack.bat`**.
*This launches 4 terminal windows handling all backend and frontend services.*

### 🍎 macOS / 🐧 Linux
Run:
```bash
./start_fullstack.sh
```
*This opens separate tabs/windows for each service.*

## Manual Notes
- The Python environment is named `pqc_backend`.
- Python version required: 3.9.
- If scripts fail, ensure you are in the root directory of the project.

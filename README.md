# Cyberpunk RED & 2077 // Omni-Deck Companion App

A modern, tactile, COMP/CON-inspired companion web app and GM operations hub for **Cyberpunk RED** and **Cyberpunk 2077 (Edgerunners Mission Kit)**.

---

## 🚀 Quick Start

### 1. Run the App (One-Click)
Double-click `start_app.bat` or run:
```bash
cd frontend
npm run dev
```
The app will open automatically at `http://localhost:5173/`.

### 2. Extract / Update Data Packs from PDFs
Double-click `run_extractors.bat` or run:
```bash
.\.venv\Scripts\python.exe scripts\extract_core_pack.py
```

---

## 📁 Project Architecture & Clean Sandbox

Everything is 100% self-contained in this single folder:
```
cpr-omni-deck/
├── .venv/               # Isolated Python virtual environment (pypdf)
├── data/                # Extracted modular .cprpack JSON bundles
├── frontend/            # React 18 + Vite + TypeScript + Tailwind CSS PWA
├── scripts/             # Python PDF extractors reading from your PDF library
├── start_app.bat        # 1-click Windows launcher
├── run_extractors.bat   # 1-click data extraction runner
├── Dockerfile           # Docker container configuration
├── docker-compose.yml   # Multi-platform Docker runner
└── .gitignore           # Prevents uploading large PDFs or local node_modules
```

### 🗑️ Complete Uninstallation / Zero Footprint
To completely remove the app and all its dependencies from your computer with zero leftover files or registry entries:
Simply delete the `C:\Users\TeseoHeracles\cpr-omni-deck` folder.

---

## 🌐 Connecting to GitHub
To push this project to your GitHub:
1. Create a new repository on [GitHub](https://github.com/new) (e.g. `cpr-omni-deck`).
2. Run these commands inside this folder:
```bash
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git branch -M main
git push -u origin main
```
The `.gitignore` is already configured to keep your repository lightweight and legal by excluding copyrighted raw PDF binaries.

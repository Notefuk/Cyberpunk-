@echo off
title CPR Pack Extractor
echo ===================================================
echo   CYBERPUNK RED // PDF DATA PACK EXTRACTOR
echo ===================================================
cd /d "%~dp0"
.\.venv\Scripts\python.exe scripts\extract_core_pack.py
echo.
echo Process complete. Press any key to exit.
pause > nul

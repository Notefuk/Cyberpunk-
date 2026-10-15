@echo off
title Cyberpunk Omni-Deck
echo ===================================================
echo   CYBERPUNK RED & 2077 // OMNI-DECK WEB APP
echo ===================================================
echo Starting local development server and opening browser...
cd /d "%~dp0frontend"
cmd /c "npm.cmd run dev -- --open"
pause

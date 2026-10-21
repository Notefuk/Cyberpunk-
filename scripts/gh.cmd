@echo off
rem GitHub CLI portable: binario y configuracion viven en .tools\ del repo (ignorado por git).
rem Nada se instala en el sistema. Ver CLAUDE.md, seccion "GitHub CLI portable".
setlocal
set "GH_CONFIG_DIR=%~dp0..\.tools\gh-config"
set "GH_NO_UPDATE_NOTIFIER=1"
"%~dp0..\.tools\gh\bin\gh.exe" %*

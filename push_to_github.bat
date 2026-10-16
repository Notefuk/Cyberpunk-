@echo off
title Cyberpunk RED Omni-Deck - GitHub Sync
color 0b
echo =================================================================
echo   CYBERPUNK RED OMNI-DECK - SINCRONIZACION CON GITHUB
echo =================================================================
cd /d "%~dp0"
echo.
echo Repositorio Remoto: https://github.com/Notefuk/Cyberpunk-.git
echo Rama Local: main
echo.
echo [1/3] Configurando rama principal...
git branch -M main
echo [2/3] Subiendo commits a GitHub...
git push -u origin main
if %ERRORLEVEL% equ 0 goto SUCCESS

echo.
echo -----------------------------------------------------------------
echo AVISO: Si fallo porque el repositorio remoto ya tenia un README o
echo archivos iniciales, sincronizando con el remoto...
echo -----------------------------------------------------------------
git pull origin main --allow-unrelated-histories --no-rebase -m "Merge remote repository initial state"
git push -u origin main
if %ERRORLEVEL% equ 0 goto SUCCESS

echo.
echo =================================================================
echo   HUBO UN ERROR AL SUBIR.
echo =================================================================
echo Posibles causas:
echo 1. Si salto una ventana del navegador de GitHub, haz clic en 'Authorize/Sign in'.
echo 2. Verifica si el repositorio 'Cyberpunk-' esta creado en https://github.com/Notefuk/Cyberpunk-
echo 3. Si el repo es privado o necesitas un token, puedes ingresar tu Personal Access Token.
echo.
pause
exit /b 1

:SUCCESS
echo.
echo =================================================================
echo   EXITO: Todos los commits se han subido a GitHub correctamente!
echo   Ver repositorio: https://github.com/Notefuk/Cyberpunk-
echo =================================================================
echo.
pause

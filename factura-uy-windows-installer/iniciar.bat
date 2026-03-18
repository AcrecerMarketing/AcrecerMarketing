@echo off
title Factura-UY

set APP_DIR=%LOCALAPPDATA%\Factura-UY

:: Verificar instalacion
if not exist "%APP_DIR%\backend\server.js" (
    echo [ERROR] Factura-UY no esta instalado.
    echo Ejecuta instalar.bat primero.
    pause
    exit /b 1
)

echo ================================================
echo   Factura-UY - Iniciando...
echo ================================================
echo.

:: Detener instancia anterior si corre
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
)

:: Iniciar backend
start "Factura-UY Backend" /min cmd /c "cd /d "%APP_DIR%\backend" && node server.js"

:: Esperar que el servidor levante
echo Esperando que el servidor inicie...
timeout /t 4 /nobreak >nul

:: Abrir navegador
start "" "http://localhost:3001"

echo.
echo Factura-UY corriendo en http://localhost:3001
echo Contrasena por defecto: factura2024
echo Para detener: cierra la ventana del servidor o ejecuta detener.bat
echo.
pause

@echo off
chcp 65001 >nul
title Factura-UY

set APP_DIR=%LOCALAPPDATA%\Factura-UY

:: Verificar instalación
if not exist "%APP_DIR%\backend\server.js" (
    echo [ERROR] Factura-UY no está instalado.
    echo Ejecuta instalar.bat primero.
    pause
    exit /b 1
)

echo ================================================
echo   Factura-UY — Iniciando...
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

:: Verificar que levantó
curl -s http://localhost:3001/api/health >nul 2>&1
if %errorLevel% neq 0 (
    timeout /t 3 /nobreak >nul
)

:: Abrir navegador
start "" "http://localhost:3001"

echo.
echo ✓ Factura-UY corriendo en http://localhost:3001
echo.
echo   Contraseña por defecto: factura2024
echo   Para detener: cierra esta ventana o ejecuta detener.bat
echo.
pause

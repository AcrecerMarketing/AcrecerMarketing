@echo off
title Factura-UY Instalador

echo.
echo ============================================================
echo   Factura-UY - Sistema de Facturacion Electronica Uruguay
echo   Instalador para Windows
echo ============================================================
echo.

:: Verificar si se ejecuta como administrador
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Solicitando permisos de administrador...
    powershell -Command "Start-Process -FilePath '%~f0' -Verb RunAs"
    exit /b
)

:: Ejecutar el instalador PowerShell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0instalar.ps1" -InstallerDir "%~dp0"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] La instalacion tuvo problemas. Revisa el log arriba.
    pause
    exit /b 1
)

pause

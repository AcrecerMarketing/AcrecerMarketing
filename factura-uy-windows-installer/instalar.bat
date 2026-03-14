@echo off
chcp 65001 >nul
title Factura-UY — Instalador

:: Verificar si se está ejecutando como administrador
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Solicitando permisos de administrador...
    powershell -Command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

cls
echo ============================================================
echo   Factura-UY — Sistema de Facturación Electrónica Uruguay
echo   Instalador para Windows
echo ============================================================
echo.

:: Ejecutar el instalador PowerShell
powershell -ExecutionPolicy Bypass -File "%~dp0instalar.ps1" -InstallerDir "%~dp0"

if %errorLevel% neq 0 (
    echo.
    echo [ERROR] La instalacion tuvo problemas. Revisa el log arriba.
    pause
    exit /b 1
)

pause

@echo off
chcp 65001 >nul
title Factura-UY — Detener

echo Deteniendo Factura-UY...

set encontrado=0
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001 2^>nul') do (
    taskkill /PID %%a /F >nul 2>&1
    set encontrado=1
)

if %encontrado%==1 (
    echo ✓ Servidor detenido.
) else (
    echo · El servidor no estaba corriendo.
)

timeout /t 2 /nobreak >nul

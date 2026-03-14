#Requires -Version 5.1
param(
    [string]$InstallerDir = $PSScriptRoot
)

$ErrorActionPreference = "Stop"
$Host.UI.RawUI.WindowTitle = "Factura-UY — Instalador"

# ── Colores y utilidades ─────────────────────────────────────────────────────

function Write-Header($text) {
    Write-Host ""
    Write-Host "══════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host "══════════════════════════════════════════════════" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Step($num, $text) {
    Write-Host "[$num] $text" -ForegroundColor Yellow
}

function Write-OK($text) {
    Write-Host "  ✓ $text" -ForegroundColor Green
}

function Write-Info($text) {
    Write-Host "  · $text" -ForegroundColor Gray
}

function Write-Fail($text) {
    Write-Host "  ✗ $text" -ForegroundColor Red
}

# ── Variables ────────────────────────────────────────────────────────────────

$AppName    = "Factura-UY"
$AppDir     = "$env:LOCALAPPDATA\$AppName"
$AppSource  = Join-Path $InstallerDir "app"
$DesktopDir = [Environment]::GetFolderPath("Desktop")
$NodeMinVer = [Version]"18.0.0"

Write-Header "Factura-UY — Sistema de Facturación Electrónica Uruguay"
Write-Host "  Instalador v1.0 — Mercado uruguayo, cumple normativa DGI" -ForegroundColor White
Write-Host ""

# ── PASO 1: Verificar Node.js ────────────────────────────────────────────────

Write-Step "1/6" "Verificando Node.js..."

$nodeOk = $false
try {
    $nodeVersionStr = (node --version 2>&1).ToString().TrimStart('v')
    $nodeVersion = [Version]$nodeVersionStr
    if ($nodeVersion -ge $NodeMinVer) {
        Write-OK "Node.js $nodeVersionStr detectado"
        $nodeOk = $true
    } else {
        Write-Fail "Node.js $nodeVersionStr es muy antiguo. Se requiere v18 o superior."
    }
} catch {
    Write-Fail "Node.js no encontrado."
}

if (-not $nodeOk) {
    Write-Host ""
    Write-Host "  Node.js 18+ es necesario para ejecutar Factura-UY." -ForegroundColor Yellow
    Write-Host "  Descargalo desde: https://nodejs.org/en/download" -ForegroundColor Cyan
    Write-Host ""
    $resp = Read-Host "  Presiona Enter para abrir el sitio de descarga, o escribe 'salir' para cancelar"
    if ($resp -ne "salir") {
        Start-Process "https://nodejs.org/en/download"
    }
    Write-Host ""
    Write-Fail "Instalacion cancelada. Volvé a ejecutar instalar.bat luego de instalar Node.js."
    exit 1
}

# ── PASO 2: Copiar archivos de la aplicación ─────────────────────────────────

Write-Step "2/6" "Copiando archivos de la aplicacion a $AppDir ..."

if (-not (Test-Path $AppSource)) {
    Write-Fail "No se encontró la carpeta 'app' junto al instalador."
    Write-Fail "Asegurate de que el ZIP del instalador esté completo y descomprimido."
    exit 1
}

if (Test-Path $AppDir) {
    Write-Info "Directorio existente detectado. Actualizando archivos..."
    # Preservar el .env si existe
    $envBackup = $null
    if (Test-Path "$AppDir\backend\.env") {
        $envBackup = Get-Content "$AppDir\backend\.env" -Raw
        Write-Info ".env existente guardado para restaurar después."
    }
    Remove-Item $AppDir -Recurse -Force
}

Copy-Item -Path $AppSource -Destination $AppDir -Recurse -Force
Write-OK "Archivos copiados a $AppDir"

# ── PASO 3: Configurar variables de entorno (.env) ───────────────────────────

Write-Step "3/6" "Configurando archivo de entorno..."

$envPath     = "$AppDir\backend\.env"
$envExample  = "$AppDir\backend\.env.example"

if ($envBackup) {
    # Restaurar .env previo (actualización)
    Set-Content -Path $envPath -Value $envBackup -Encoding UTF8
    Write-OK "Configuracion anterior restaurada."
} elseif (-not (Test-Path $envPath)) {
    if (-not (Test-Path $envExample)) {
        Write-Fail "No se encontró .env.example en el backend."
        exit 1
    }

    # Generar secretos aleatorios
    $jwtSecret  = -join ((1..48) | ForEach-Object { [char](Get-Random -Min 65 -Max 91) + [char](Get-Random -Min 97 -Max 123) } | Select-Object -First 32)
    $certEncKey = -join ((0..31) | ForEach-Object { '{0:x2}' -f (Get-Random -Max 256) })

    $envContent = Get-Content $envExample -Raw
    $envContent = $envContent -replace 'cambiar_por_secreto_largo_aleatorio_minimo_32_chars', $jwtSecret
    $envContent = $envContent -replace 'cambiar_por_clave_aes256_32_bytes_hex', $certEncKey
    $envContent = $envContent -replace 'DB_PATH=\./factura-uy\.db', "DB_PATH=$($AppDir.Replace('\','/'))/factura-uy.db"

    Set-Content -Path $envPath -Value $envContent -Encoding UTF8
    Write-OK ".env creado con secretos generados automáticamente."
} else {
    Write-OK ".env ya existía, conservado sin cambios."
}

# ── PASO 4: Instalar dependencias npm ───────────────────────────────────────

Write-Step "4/6" "Instalando dependencias del backend..."
Push-Location "$AppDir\backend"
try {
    $npmOut = npm install --omit=dev 2>&1
    if ($LASTEXITCODE -ne 0) { throw "npm install backend falló" }
    Write-OK "Dependencias del backend instaladas."
} catch {
    Write-Fail "Error instalando dependencias del backend:"
    Write-Host $npmOut -ForegroundColor Red
    Pop-Location; exit 1
}
Pop-Location

Write-Info "Instalando dependencias del frontend..."
Push-Location "$AppDir\frontend"
try {
    $npmOut = npm install 2>&1
    if ($LASTEXITCODE -ne 0) { throw "npm install frontend falló" }
    Write-OK "Dependencias del frontend instaladas."
} catch {
    Write-Fail "Error instalando dependencias del frontend:"
    Write-Host $npmOut -ForegroundColor Red
    Pop-Location; exit 1
}
Pop-Location

# ── PASO 5: Compilar frontend (build de producción) ──────────────────────────

Write-Step "5/6" "Compilando interfaz (esto puede demorar 1-2 minutos)..."
Push-Location "$AppDir\frontend"
try {
    $npmOut = npm run build 2>&1
    if ($LASTEXITCODE -ne 0) { throw "npm run build falló" }
    Write-OK "Interfaz compilada correctamente."
} catch {
    Write-Fail "Error compilando el frontend:"
    Write-Host $npmOut -ForegroundColor Red
    Pop-Location; exit 1
}
Pop-Location

# ── PASO 6: Crear accesos directos y scripts de inicio ───────────────────────

Write-Step "6/6" "Creando accesos directos..."

# Script de inicio
$iniciarScript = @"
@echo off
chcp 65001 >nul
title Factura-UY
cd /d "$AppDir"

echo Iniciando Factura-UY...
echo.

:: Iniciar backend en segundo plano
start "Factura-UY Backend" /min cmd /c "cd /d "$AppDir\backend" && node server.js"

:: Esperar a que el backend esté listo
timeout /t 3 /nobreak >nul

:: Abrir el navegador
start "" "http://localhost:3001"

echo Factura-UY está corriendo en http://localhost:3001
echo Para detener el servidor, cierra las ventanas de comando o ejecuta detener.bat
echo.
pause
"@

$detenerScript = @"
@echo off
chcp 65001 >nul
title Factura-UY — Detener
echo Deteniendo Factura-UY...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do (
    taskkill /PID %%a /F >nul 2>&1
)
echo Servidor detenido.
timeout /t 2 /nobreak >nul
"@

Set-Content -Path "$AppDir\iniciar.bat"  -Value $iniciarScript  -Encoding ASCII
Set-Content -Path "$AppDir\detener.bat"  -Value $detenerScript  -Encoding ASCII

# Acceso directo en el escritorio
$WshShell = New-Object -ComObject WScript.Shell
$shortcut = $WshShell.CreateShortcut("$DesktopDir\Factura-UY.lnk")
$shortcut.TargetPath       = "$AppDir\iniciar.bat"
$shortcut.WorkingDirectory = $AppDir
$shortcut.Description      = "Sistema de Facturación Electrónica — DGI Uruguay"
$shortcut.IconLocation     = "shell32.dll,22"
$shortcut.Save()
Write-OK "Acceso directo creado en el escritorio."

# Acceso directo en menú inicio
$startMenuDir = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Factura-UY"
New-Item -ItemType Directory -Path $startMenuDir -Force | Out-Null
$sc2 = $WshShell.CreateShortcut("$startMenuDir\Factura-UY.lnk")
$sc2.TargetPath       = "$AppDir\iniciar.bat"
$sc2.WorkingDirectory = $AppDir
$sc2.Description      = "Sistema de Facturación Electrónica — DGI Uruguay"
$sc2.IconLocation     = "shell32.dll,22"
$sc2.Save()
$sc3 = $WshShell.CreateShortcut("$startMenuDir\Desinstalar Factura-UY.lnk")
$sc3.TargetPath       = "$AppDir\desinstalar.bat"
$sc3.WorkingDirectory = $AppDir
$sc3.Save()
Write-OK "Accesos directos en Menú Inicio creados."

# Script de desinstalación
$desinstalarScript = @"
@echo off
chcp 65001 >nul
echo ¿Estás seguro de que querés desinstalar Factura-UY?
echo Se eliminarán todos los archivos pero NO la base de datos.
set /p confirm=Escribí SI para confirmar:
if /i "%confirm%"=="SI" (
    :: Detener servidor si corre
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /PID %%a /F >nul 2>&1
    :: Eliminar carpeta de instalación (excepto la BD)
    if exist "$AppDir\factura-uy.db" copy "$AppDir\factura-uy.db" "%USERPROFILE%\Desktop\factura-uy-backup.db" >nul
    rmdir /s /q "$AppDir"
    del "%USERPROFILE%\Desktop\Factura-UY.lnk" >nul 2>&1
    rmdir /s /q "%APPDATA%\Microsoft\Windows\Start Menu\Programs\Factura-UY" >nul 2>&1
    echo.
    echo Factura-UY desinstalado. La base de datos fue copiada al escritorio como factura-uy-backup.db
)
pause
"@
Set-Content -Path "$AppDir\desinstalar.bat" -Value $desinstalarScript -Encoding ASCII

# ── FINALIZADO ───────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "══════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✓ INSTALACIÓN COMPLETADA EXITOSAMENTE" -ForegroundColor Green
Write-Host "══════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "  Instalado en : $AppDir" -ForegroundColor White
Write-Host "  URL          : http://localhost:3001" -ForegroundColor White
Write-Host "  Contraseña   : factura2024  (cambiar en .env → APP_PASSWORD)" -ForegroundColor White
Write-Host ""
Write-Host "  Hacé doble clic en 'Factura-UY' en el escritorio para iniciar." -ForegroundColor Cyan
Write-Host ""

$resp = Read-Host "  ¿Querés iniciar Factura-UY ahora? (S/N)"
if ($resp -match '^[Ss]') {
    Start-Process "$AppDir\iniciar.bat"
}

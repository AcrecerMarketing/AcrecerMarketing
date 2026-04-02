#!/bin/bash
# =============================================================================
# build-apk.sh — Construye Factura-UY APK para Android
# =============================================================================
# Requiere: Node.js 18+, Java 17+, Android SDK con gradle
# Ejecutar desde la carpeta factura-uy-android/
# =============================================================================

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "================================================"
echo "  Factura-UY — Build APK Android"
echo "================================================"
echo ""

# ── 1. Instalar dependencias Capacitor ────────────────────────────────────────
echo "[1/5] Instalando dependencias de Capacitor..."
npm install

# ── 2. Compilar el frontend React ────────────────────────────────────────────
echo "[2/5] Compilando frontend React..."
FRONTEND_DIR="$SCRIPT_DIR/../factura-uy-windows-installer/app/frontend"
cd "$FRONTEND_DIR"
npm install
npm run build
cd "$SCRIPT_DIR"

# ── 3. Instalar dependencias del backend Android ──────────────────────────────
echo "[3/5] Instalando dependencias del backend (nodejs-project)..."
cd nodejs-project
npm install --omit=dev
# Eliminar archivos no necesarios de sql.js para reducir tamaño
cd node_modules/sql.js/dist 2>/dev/null || true
rm -f sql-asm*.js worker.*.js sql-wasm-browser* sql-wasm-debug* 2>/dev/null || true
cd "$SCRIPT_DIR"

# ── 4. Sincronizar Capacitor con Android ──────────────────────────────────────
echo "[4/5] Sincronizando Capacitor → Android..."
# Copiar nodejs-project actualizado a los assets
rm -rf android/app/src/main/assets/nodejs-project
mkdir -p android/app/src/main/assets/nodejs-project
cp -r nodejs-project/. android/app/src/main/assets/nodejs-project/

npx cap sync android

# ── 5. Construir APK con Gradle ───────────────────────────────────────────────
echo "[5/5] Construyendo APK..."
cd android
chmod +x gradlew
./gradlew assembleRelease 2>&1

echo ""
echo "================================================"
APK_PATH=$(find . -name "*.apk" -path "*/release/*" 2>/dev/null | head -1)
if [ -n "$APK_PATH" ]; then
    cp "$APK_PATH" "$SCRIPT_DIR/Factura-UY.apk"
    echo "  APK listo: $SCRIPT_DIR/Factura-UY.apk"
    du -sh "$SCRIPT_DIR/Factura-UY.apk"
else
    echo "  APK generado en: android/app/build/outputs/apk/release/"
    find . -name "*.apk" 2>/dev/null
fi
echo "================================================"

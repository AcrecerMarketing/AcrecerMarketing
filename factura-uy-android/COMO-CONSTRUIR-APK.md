# Factura-UY — Como construir el APK

## Arquitectura

La app Android combina:
- **Frontend**: React 19 compilado y servido desde los assets de la app (WebView)
- **Backend**: Node.js 18 corriendo dentro de la app via `@choreruiz/capacitor-node-js`
- **Base de datos**: `sql.js` (SQLite puro JS, sin módulos nativos)
- **Servidor**: Express en `http://localhost:3001` (solo accesible dentro del dispositivo)

## Requisitos para construir

1. **Android Studio** (descargá desde developer.android.com/studio)
   - Durante la instalación instala Android SDK API 35
   - Android Build Tools 8.7+
   - NDK (requerido por nodejs-mobile para compilar el wrapper nativo)

2. **Node.js 18+**
3. **Java 17+** (viene con Android Studio)

## Pasos para construir el APK

### Opcion A: Android Studio (recomendada)

1. Abrir Android Studio
2. `File → Open` → seleccionar la carpeta `factura-uy-android/`
3. Esperar que Gradle sincronice (descarga dependencias automaticamente)
4. Si pide instalar SDK/NDK, aceptar
5. `Build → Build Bundle(s) / APK(s) → Build APK(s)`
6. El APK queda en `android/app/build/outputs/apk/release/`

### Opcion B: Linea de comandos

```bash
# Desde la carpeta factura-uy-android/
./build-apk.sh
```

O manualmente:
```bash
# 1. Compilar frontend
cd ../factura-uy-windows-installer/app/frontend
npm install && npm run build
cd ../../factura-uy-android

# 2. Dependencias del backend Android
cd nodejs-project && npm install --omit=dev && cd ..

# 3. Copiar backend a Android assets
rm -rf android/app/src/main/assets/nodejs-project
cp -r nodejs-project android/app/src/main/assets/

# 4. Sincronizar Capacitor
npm install
npx cap sync android

# 5. Construir APK
cd android
./gradlew assembleRelease
```

## Instalar el APK en el celular

1. Copiar el archivo `Factura-UY.apk` al celular
2. En el celular: `Configuracion → Seguridad → Instalar apps de fuentes desconocidas` (activar)
3. Abrir el APK desde el explorador de archivos
4. Instalar

### Via USB (mas facil):
```bash
# Con el celular conectado y depuracion USB activada:
adb install Factura-UY.apk
```

## Como funciona en Android

1. Al abrir la app, Node.js arranca el servidor en `http://localhost:3001`
2. El WebView carga la interfaz React
3. La interfaz llama al API en `http://localhost:3001/api/...`
4. Los datos se guardan en `/sdcard/Android/data/uy.factura.app/files/factura-uy.db`
5. Los PDFs se guardan en el mismo directorio

## Notas importantes

- **Sin internet**: La app funciona completamente offline en modo `mock` (sin envio a DGI)
- **Modo produccion DGI**: Configurar en la app → Configuracion → Ambiente → Produccion
- **Datos persistentes**: Se guardan en almacenamiento interno, NO se borran al cerrar la app
- **Tamano del APK**: ~200-300 MB (incluye Node.js 18 y todas las dependencias)

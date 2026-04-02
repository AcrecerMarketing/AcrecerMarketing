'use strict'

/**
 * Factura-UY — Entry point para Android (nodejs-mobile)
 * @choreruiz/capacitor-node-js ejecuta este archivo automáticamente al iniciar la app.
 */

const path = require('path')
const fs = require('fs')

// ── Rutas de datos en Android ────────────────────────────────────────────────
// ANDROID_DATA se establece por el sistema Android. Si no está, estamos en
// entorno de desarrollo local.
const isAndroid = !!process.env.ANDROID_DATA

let dataDir
if (isAndroid) {
  // Almacenamiento interno de la app: /data/data/<package>/files/
  // nodejs-mobile pone el cwd en el directorio de assets; los datos
  // deben ir a un directorio persistente.
  const extStorage = process.env.EXTERNAL_STORAGE || '/sdcard'
  dataDir = path.join(extStorage, 'Android', 'data', 'uy.factura.app', 'files')
} else {
  dataDir = path.join(__dirname, 'data')
}

// Crear directorios necesarios
for (const dir of [dataDir, path.join(dataDir, 'pdfs'), path.join(dataDir, 'uploads')]) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

// Configurar env antes de cargar el servidor
process.env.PORT = '3001'
process.env.NODE_ENV = 'production'
process.env.DB_PATH = path.join(dataDir, 'factura-uy.db')
process.env.UPLOADS_DIR = path.join(dataDir, 'uploads')
process.env.PDFS_DIR = path.join(dataDir, 'pdfs')
process.env.DGI_MODE = process.env.DGI_MODE || 'mock'

// ── Inicializar sql.js antes de cargar Express ────────────────────────────────
// sql.js necesita inicialización asíncrona para cargar el WASM binario.
// Una vez resuelto, guardamos la instancia en global para que database.js
// la use sincrónicamente.
const initSqlJs = require('sql.js')

initSqlJs({
  // sql.js incluye el WASM en node_modules; indicar la ruta explícitamente
  // para que nodejs-mobile lo encuentre en los assets de la app.
  locateFile: file => path.join(__dirname, 'node_modules', 'sql.js', 'dist', file),
}).then(SQL => {
  global.sqlJsLib = SQL
  console.log('[Factura-UY] sql.js inicializado, arrancando servidor...')
  require('./server.js')
}).catch(err => {
  console.error('[Factura-UY] Error iniciando sql.js:', err)
  process.exit(1)
})

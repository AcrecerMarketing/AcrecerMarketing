'use strict'

require('dotenv').config()

const express = require('express')
const cors = require('cors')
const path = require('path')

const errorHandler = require('./middleware/errorHandler')
const { getDb } = require('./config/database')

// Inicializar BD al arrancar
getDb()

const app = express()
const PORT = process.env.PORT || 3001

// ── Middleware global ──────────────────────────────────────────────────────
const frontendOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  `http://localhost:${process.env.PORT || 3001}`,
  `http://127.0.0.1:${process.env.PORT || 3001}`,
  // Capacitor Android WebView origin
  'https://localhost',
  'capacitor://localhost',
  'http://localhost',
]
app.use(cors({
  origin: frontendOrigins,
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Servir uploads (logos, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// Servir frontend compilado (para modo producción / instalador Windows)
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist')
if (require('fs').existsSync(frontendDist)) {
  app.use(express.static(frontendDist))
}

// ── Rutas ──────────────────────────────────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'))
app.use('/api/empresa',      require('./routes/empresa'))
app.use('/api/clientes',     require('./routes/clientes'))
app.use('/api/cfe',          require('./routes/cfe'))
app.use('/api/cae',          require('./routes/cae'))
app.use('/api/certificados', require('./routes/certificados'))
app.use('/api/pdf',          require('./routes/pdf'))
app.use('/api/email',        require('./routes/email'))
app.use('/api/dashboard',    require('./routes/dashboard'))

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    ok: true,
    version: '1.0.0',
    modo: process.env.DGI_MODE || 'mock',
    timestamp: new Date().toISOString(),
  })
})

// Fallback: devolver index.html del frontend para rutas del cliente
if (require('fs').existsSync(frontendDist)) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'))
  })
}

// ── Error handler ──────────────────────────────────────────────────────────
app.use(errorHandler)

// ── Arranque ───────────────────────────────────────────────────────────────
// On Android (nodejs-mobile) bind to all interfaces so WebView can reach us
const host = process.env.ANDROID_DATA ? '0.0.0.0' : '127.0.0.1'
app.listen(PORT, host, () => {
  console.log(`\n✅ Factura-UY backend iniciado`)
  console.log(`   URL: http://localhost:${PORT}`)
  console.log(`   Modo DGI: ${process.env.DGI_MODE || 'mock'}`)
  console.log(`   BD: ${process.env.DB_PATH || './factura-uy.db'}\n`)
})

module.exports = app

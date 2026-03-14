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
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Servir uploads (logos, etc.)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

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

// ── Error handler ──────────────────────────────────────────────────────────
app.use(errorHandler)

// ── Arranque ───────────────────────────────────────────────────────────────
app.listen(PORT, '127.0.0.1', () => {
  console.log(`\n✅ Factura-UY backend iniciado`)
  console.log(`   URL: http://localhost:${PORT}`)
  console.log(`   Modo DGI: ${process.env.DGI_MODE || 'mock'}`)
  console.log(`   BD: ${process.env.DB_PATH || './factura-uy.db'}\n`)
})

module.exports = app

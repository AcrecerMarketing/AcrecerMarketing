'use strict'

const Database = require('better-sqlite3')
const path = require('path')
const fs = require('fs')

let db

function getDb() {
  if (db) return db

  const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'factura-uy.db')
  db = new Database(dbPath)

  // WAL mode + FK enforcement
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')

  // Correr schema si las tablas no existen
  const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf8')
  db.exec(schema)

  // Insertar empresa por defecto si no existe
  const existing = db.prepare('SELECT id FROM empresa WHERE id = 1').get()
  if (!existing) {
    db.prepare(`
      INSERT INTO empresa (id, ruc, razon_social, domicilio_fiscal, ciudad, departamento)
      VALUES (1, '', 'Mi Empresa', '', 'Montevideo', 'Montevideo')
    `).run()
  }

  return db
}

module.exports = { getDb }

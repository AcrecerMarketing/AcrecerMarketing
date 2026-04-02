'use strict'

/**
 * Adaptador SQLite para Android usando sql.js (pure JS, no native modules).
 * Reemplaza better-sqlite3 que requiere compilación nativa con Android NDK.
 *
 * API compatible con better-sqlite3:
 *   db.prepare(sql).run(params)    → { changes, lastInsertRowid }
 *   db.prepare(sql).get(params)    → row | undefined
 *   db.prepare(sql).all(params)    → row[]
 *   db.exec(sql)
 *   db.pragma(statement)
 *   db.transaction(fn)             → wrapped function
 */

const path = require('path')
const fs = require('fs')

let dbInstance

// ── Normalizar parámetros: better-sqlite3 recibe {name: val} para @name params
// sql.js necesita {'@name': val}
function normalizeParams(sql, params) {
  if (params === undefined || params === null) return []
  if (Array.isArray(params)) return params

  if (typeof params === 'object') {
    const result = {}
    for (const key of Object.keys(params)) {
      // Si la clave ya tiene prefijo, usarla tal cual
      if (key.startsWith('@') || key.startsWith(':') || key.startsWith('$')) {
        result[key] = params[key]
      } else {
        // Detectar qué prefijo usa el SQL para este parámetro
        if (sql.includes(`@${key}`)) {
          result[`@${key}`] = params[key]
        } else if (sql.includes(`:${key}`)) {
          result[`:${key}`] = params[key]
        } else if (sql.includes(`$${key}`)) {
          result[`$${key}`] = params[key]
        } else {
          result[`@${key}`] = params[key] // fallback
        }
      }
    }
    return result
  }

  // Valor escalar → array de un elemento (para params `?`)
  return [params]
}

class Statement {
  constructor(rawDb, sql, dbWrapper) {
    this._rawDb = rawDb
    this._sql = sql
    this._wrapper = dbWrapper
  }

  run(...args) {
    const params = args.length === 1 ? args[0] : args
    const normalized = normalizeParams(this._sql, params.length === 0 ? undefined : params)
    try {
      this._rawDb.run(this._sql, normalized)
    } catch (e) {
      throw e
    }
    const changes = this._rawDb.getRowsModified()
    let lastInsertRowid = 0
    try {
      const res = this._rawDb.exec('SELECT last_insert_rowid()')
      lastInsertRowid = res[0]?.values[0]?.[0] ?? 0
    } catch (_) {}
    this._wrapper._persist()
    return { changes, lastInsertRowid }
  }

  get(...args) {
    const params = args.length === 1 ? args[0] : args
    const normalized = normalizeParams(this._sql, params.length === 0 ? undefined : params)
    let stmt
    try {
      stmt = this._rawDb.prepare(this._sql)
      stmt.bind(normalized)
      if (stmt.step()) {
        const row = stmt.getAsObject()
        // sql.js puede devolver {} vacío si no hay columnas; normalizar undefined
        return Object.keys(row).length === 0 ? undefined : row
      }
      return undefined
    } finally {
      if (stmt) stmt.free()
    }
  }

  all(...args) {
    const params = args.length === 1 ? args[0] : args
    const normalized = normalizeParams(this._sql, params.length === 0 ? undefined : params)
    let stmt
    const rows = []
    try {
      stmt = this._rawDb.prepare(this._sql)
      stmt.bind(normalized)
      while (stmt.step()) {
        rows.push(stmt.getAsObject())
      }
    } finally {
      if (stmt) stmt.free()
    }
    return rows
  }
}

class SqlJsDatabase {
  constructor(SQL, data) {
    this._db = data ? new SQL.Database(data) : new SQL.Database()
    this._dbPath = null
    this._inTransaction = false
  }

  setPath(dbPath) {
    this._dbPath = dbPath
  }

  _persist() {
    if (this._dbPath && !this._inTransaction) {
      const data = this._db.export()
      fs.writeFileSync(this._dbPath, Buffer.from(data))
    }
  }

  prepare(sql) {
    return new Statement(this._db, sql, this)
  }

  exec(sql) {
    this._db.run(sql)
    this._persist()
    return this
  }

  pragma(statement) {
    // WAL no está soportado en sql.js; ignorar silenciosamente
    if (/journal_mode\s*=\s*WAL/i.test(statement)) return this
    try {
      this._db.run(`PRAGMA ${statement}`)
    } catch (_) {}
    return this
  }

  transaction(fn) {
    const self = this
    return function (...args) {
      self._db.run('BEGIN')
      self._inTransaction = true
      try {
        const result = fn(...args)
        self._db.run('COMMIT')
        self._inTransaction = false
        self._persist()
        return result
      } catch (e) {
        try { self._db.run('ROLLBACK') } catch (_) {}
        self._inTransaction = false
        throw e
      }
    }
  }
}

function getDb() {
  if (dbInstance) return dbInstance

  const SQL = global.sqlJsLib
  if (!SQL) throw new Error('sql.js no inicializado. El servidor debe arrancarse desde main.js')

  const dbPath = process.env.DB_PATH || path.join(__dirname, '..', 'factura-uy.db')

  let data
  if (fs.existsSync(dbPath)) {
    data = fs.readFileSync(dbPath)
  }

  dbInstance = new SqlJsDatabase(SQL, data)
  dbInstance.setPath(dbPath)

  // FK enforcement (WAL se ignora en sql.js)
  dbInstance.pragma('foreign_keys = ON')

  // Crear tablas según schema
  const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql')
  const schema = fs.readFileSync(schemaPath, 'utf8')
  dbInstance.exec(schema)

  // Empresa por defecto
  const existing = dbInstance.prepare('SELECT id FROM empresa WHERE id = 1').get()
  if (!existing) {
    dbInstance.prepare(`
      INSERT INTO empresa (id, ruc, razon_social, domicilio_fiscal, ciudad, departamento)
      VALUES (1, '', 'Mi Empresa', '', 'Montevideo', 'Montevideo')
    `).run()
  }

  return dbInstance
}

module.exports = { getDb }

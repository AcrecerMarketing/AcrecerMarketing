'use strict'

const { getDb } = require('../config/database')

const Cliente = {
  findAll({ q, tipo, page = 1, limit = 50 } = {}) {
    const db = getDb()
    let where = '1=1'
    const params = {}
    if (q) { where += ' AND (razon_social LIKE @q OR documento LIKE @q OR nombre_comercial LIKE @q)'; params.q = `%${q}%` }
    if (tipo) { where += ' AND tipo = @tipo'; params.tipo = tipo }
    const offset = (page - 1) * limit
    const rows = db.prepare(`SELECT * FROM clientes WHERE ${where} ORDER BY razon_social LIMIT ${limit} OFFSET ${offset}`).all(params)
    const { total } = db.prepare(`SELECT COUNT(*) as total FROM clientes WHERE ${where}`).get(params)
    return { rows, total, page, limit }
  },

  findById(id) {
    return getDb().prepare('SELECT * FROM clientes WHERE id = ?').get(id)
  },

  findByDoc(documento) {
    return getDb().prepare('SELECT * FROM clientes WHERE documento = ?').get(documento)
  },

  create(data) {
    const db = getDb()
    const { lastInsertRowid } = db.prepare(`
      INSERT INTO clientes (tipo, tipo_doc, documento, razon_social, nombre_comercial,
        domicilio, ciudad, departamento, pais, email, telefono, exento_iva, notas)
      VALUES (@tipo, @tipo_doc, @documento, @razon_social, @nombre_comercial,
        @domicilio, @ciudad, @departamento, @pais, @email, @telefono, @exento_iva, @notas)
    `).run({
      tipo: data.tipo || 'cliente',
      tipo_doc: data.tipo_doc || 'RUT',
      documento: data.documento || '',
      razon_social: data.razon_social,
      nombre_comercial: data.nombre_comercial || null,
      domicilio: data.domicilio || null,
      ciudad: data.ciudad || null,
      departamento: data.departamento || null,
      pais: data.pais || 'UY',
      email: data.email || null,
      telefono: data.telefono || null,
      exento_iva: data.exento_iva ? 1 : 0,
      notas: data.notas || null,
    })
    return this.findById(lastInsertRowid)
  },

  update(id, data) {
    const db = getDb()
    const fields = ['tipo', 'tipo_doc', 'documento', 'razon_social', 'nombre_comercial',
      'domicilio', 'ciudad', 'departamento', 'pais', 'email', 'telefono', 'exento_iva', 'notas']
    const updates = fields.filter(f => data[f] !== undefined)
    if (!updates.length) return this.findById(id)
    db.prepare(`UPDATE clientes SET ${updates.map(f => `${f} = @${f}`).join(', ')} WHERE id = @id`).run({ ...data, id })
    return this.findById(id)
  },

  delete(id) {
    return getDb().prepare('DELETE FROM clientes WHERE id = ?').run(id)
  },
}

module.exports = Cliente

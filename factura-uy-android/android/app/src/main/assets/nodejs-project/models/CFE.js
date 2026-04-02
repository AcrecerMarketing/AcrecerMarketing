'use strict'

const { getDb } = require('../config/database')

const CFE = {
  findAll({ tipo_cfe, estado, cliente_id, fecha_desde, fecha_hasta, page = 1, limit = 50 } = {}) {
    const db = getDb()
    let where = '1=1'
    const params = {}
    if (tipo_cfe)    { where += ' AND c.tipo_cfe = @tipo_cfe';   params.tipo_cfe = tipo_cfe }
    if (estado)      { where += ' AND c.estado = @estado';        params.estado = estado }
    if (cliente_id)  { where += ' AND c.cliente_id = @cli';       params.cli = cliente_id }
    if (fecha_desde) { where += ' AND c.fecha_emision >= @fd';    params.fd = fecha_desde }
    if (fecha_hasta) { where += ' AND c.fecha_emision <= @fh';    params.fh = fecha_hasta }
    const offset = (page - 1) * limit
    const rows = db.prepare(`
      SELECT c.*, cl.razon_social as cliente_nombre
      FROM cfe c LEFT JOIN clientes cl ON c.cliente_id = cl.id
      WHERE ${where}
      ORDER BY c.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `).all(params)
    const { total } = db.prepare(`SELECT COUNT(*) as total FROM cfe c WHERE ${where}`).get(params)
    return { rows, total, page, limit }
  },

  findById(id) {
    const db = getDb()
    const cfe = db.prepare(`
      SELECT c.*, cl.razon_social as cliente_nombre, cl.email as cliente_email
      FROM cfe c LEFT JOIN clientes cl ON c.cliente_id = cl.id
      WHERE c.id = ?
    `).get(id)
    if (!cfe) return null
    cfe.items = db.prepare('SELECT * FROM cfe_items WHERE cfe_id = ? ORDER BY orden').all(id)
    return cfe
  },

  create(data) {
    const db = getDb()
    const insert = db.transaction((d) => {
      const { lastInsertRowid } = db.prepare(`
        INSERT INTO cfe (tipo_cfe, serie, cliente_id, receptor_nombre, receptor_doc_tipo,
          receptor_doc, receptor_email, receptor_domicilio, fecha_emision, fecha_vencimiento,
          moneda, tipo_cambio, monto_neto, monto_iva_22, monto_iva_10, monto_exento,
          monto_total, medio_pago, referencia_cfe_id, referencia_motivo, notas)
        VALUES (@tipo_cfe, @serie, @cliente_id, @receptor_nombre, @receptor_doc_tipo,
          @receptor_doc, @receptor_email, @receptor_domicilio, @fecha_emision, @fecha_vencimiento,
          @moneda, @tipo_cambio, @monto_neto, @monto_iva_22, @monto_iva_10, @monto_exento,
          @monto_total, @medio_pago, @referencia_cfe_id, @referencia_motivo, @notas)
      `).run({
        tipo_cfe: d.tipo_cfe,
        serie: d.serie || 'A',
        cliente_id: d.cliente_id || null,
        receptor_nombre: d.receptor_nombre || '',
        receptor_doc_tipo: d.receptor_doc_tipo || 'RUT',
        receptor_doc: d.receptor_doc || null,
        receptor_email: d.receptor_email || null,
        receptor_domicilio: d.receptor_domicilio || null,
        fecha_emision: d.fecha_emision || new Date().toISOString().split('T')[0],
        fecha_vencimiento: d.fecha_vencimiento || null,
        moneda: d.moneda || 'UYU',
        tipo_cambio: d.tipo_cambio || 1.0,
        monto_neto: d.monto_neto || 0,
        monto_iva_22: d.monto_iva_22 || 0,
        monto_iva_10: d.monto_iva_10 || 0,
        monto_exento: d.monto_exento || 0,
        monto_total: d.monto_total || 0,
        medio_pago: d.medio_pago || 'efectivo',
        referencia_cfe_id: d.referencia_cfe_id || null,
        referencia_motivo: d.referencia_motivo || null,
        notas: d.notas || null,
      })
      const cfeId = lastInsertRowid
      if (d.items && d.items.length) {
        const stmt = db.prepare(`
          INSERT INTO cfe_items (cfe_id, orden, descripcion, cantidad, precio_unitario,
            tasa_iva, descuento_pct, monto_item, monto_iva_item)
          VALUES (@cfe_id, @orden, @descripcion, @cantidad, @precio_unitario,
            @tasa_iva, @descuento_pct, @monto_item, @monto_iva_item)
        `)
        d.items.forEach((item, i) => {
          stmt.run({
            cfe_id: cfeId,
            orden: i + 1,
            descripcion: item.descripcion,
            cantidad: item.cantidad || 1,
            precio_unitario: item.precio_unitario || 0,
            tasa_iva: item.tasa_iva ?? 22,
            descuento_pct: item.descuento_pct || 0,
            monto_item: item.monto_item || 0,
            monto_iva_item: item.monto_iva_item || 0,
          })
        })
      }
      return cfeId
    })
    const id = insert(data)
    return this.findById(id)
  },

  updateEstado(id, estado, extras = {}) {
    const db = getDb()
    const fields = { estado, ...extras }
    const sets = Object.keys(fields).map(k => `${k} = @${k}`).join(', ')
    db.prepare(`UPDATE cfe SET ${sets} WHERE id = @id`).run({ ...fields, id })
    return this.findById(id)
  },

  updateXml(id, xmlSinFirma, xmlFirmado) {
    getDb().prepare('UPDATE cfe SET xml_sin_firma = ?, xml_firmado = ? WHERE id = ?').run(xmlSinFirma, xmlFirmado, id)
  },

  setPdfPath(id, pdfPath) {
    getDb().prepare('UPDATE cfe SET pdf_path = ? WHERE id = ?').run(pdfPath, id)
  },

  markEmailSent(id) {
    getDb().prepare('UPDATE cfe SET enviado_email = 1 WHERE id = ?').run(id)
  },

  stats({ mes, anio } = {}) {
    const db = getDb()
    const now = new Date()
    const m = mes ?? (now.getMonth() + 1)
    const a = anio ?? now.getFullYear()
    const prefix = `${a}-${String(m).padStart(2, '0')}`

    const totales = db.prepare(`
      SELECT
        COUNT(*) as total_cfe,
        SUM(CASE WHEN estado='emitido' THEN 1 ELSE 0 END) as emitidos,
        SUM(CASE WHEN estado='borrador' THEN 1 ELSE 0 END) as borradores,
        SUM(CASE WHEN estado='rechazado' THEN 1 ELSE 0 END) as rechazados,
        SUM(CASE WHEN estado='emitido' THEN monto_total ELSE 0 END) as facturado,
        SUM(CASE WHEN estado='emitido' THEN monto_iva_22+monto_iva_10 ELSE 0 END) as iva_total
      FROM cfe
      WHERE fecha_emision LIKE @prefix
    `).get({ prefix: `${prefix}%` })

    const porTipo = db.prepare(`
      SELECT tipo_cfe, COUNT(*) as cantidad, SUM(monto_total) as total
      FROM cfe WHERE estado='emitido' AND fecha_emision LIKE @prefix
      GROUP BY tipo_cfe
    `).all({ prefix: `${prefix}%` })

    return { totales, porTipo, mes: m, anio: a }
  },
}

module.exports = CFE

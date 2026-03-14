'use strict'

const { getDb } = require('../config/database')

const CAESequence = {
  findActivo(tipoCfe, serie = 'A') {
    return getDb().prepare(`
      SELECT * FROM cae_sequences
      WHERE tipo_cfe = ? AND serie = ? AND estado = 'activo'
        AND date(fecha_vencimiento) >= date('now')
      ORDER BY id ASC LIMIT 1
    `).get(tipoCfe, serie)
  },

  findAll() {
    return getDb().prepare('SELECT * FROM cae_sequences ORDER BY tipo_cfe, serie, id DESC').all()
  },

  create(data) {
    const db = getDb()
    const { lastInsertRowid } = db.prepare(`
      INSERT INTO cae_sequences
        (tipo_cfe, serie, numero_desde, numero_hasta, numero_siguiente, fecha_vencimiento, estado, xml_cae)
      VALUES (@tipo_cfe, @serie, @numero_desde, @numero_hasta, @numero_siguiente, @fecha_vencimiento, 'activo', @xml_cae)
    `).run({
      tipo_cfe: data.tipo_cfe,
      serie: data.serie || 'A',
      numero_desde: data.numero_desde,
      numero_hasta: data.numero_hasta,
      numero_siguiente: data.numero_desde,
      fecha_vencimiento: data.fecha_vencimiento,
      xml_cae: data.xml_cae || null,
    })
    return db.prepare('SELECT * FROM cae_sequences WHERE id = ?').get(lastInsertRowid)
  },

  // Retorna el próximo número y lo incrementa (transacción atómica)
  nextNumero(tipoCfe, serie = 'A') {
    const db = getDb()
    return db.transaction(() => {
      const seq = this.findActivo(tipoCfe, serie)
      if (!seq) throw new Error(`Sin CAE activo para tipo ${tipoCfe} serie ${serie}`)
      if (seq.numero_siguiente > seq.numero_hasta) {
        db.prepare("UPDATE cae_sequences SET estado='agotado' WHERE id=?").run(seq.id)
        throw new Error(`CAE agotado para tipo ${tipoCfe} serie ${serie}. Solicitá un nuevo CAE.`)
      }
      const numero = seq.numero_siguiente
      const nuevoSiguiente = numero + 1
      const nuevoEstado = nuevoSiguiente > seq.numero_hasta ? 'agotado' : 'activo'
      db.prepare('UPDATE cae_sequences SET numero_siguiente=?, estado=? WHERE id=?')
        .run(nuevoSiguiente, nuevoEstado, seq.id)
      return { numero, caeId: seq.id }
    })()
  },

  // Crea rangos demo/mock para testing sin DGI real
  seedMock() {
    const db = getDb()
    const tipos = [101, 102, 103, 111, 112, 113, 124, 182]
    const venc = new Date()
    venc.setFullYear(venc.getFullYear() + 1)
    const fechaVenc = venc.toISOString().split('T')[0]
    const existing = db.prepare("SELECT COUNT(*) as c FROM cae_sequences WHERE estado='activo'").get()
    if (existing.c > 0) return
    tipos.forEach((tipo, i) => {
      db.prepare(`
        INSERT INTO cae_sequences (tipo_cfe, serie, numero_desde, numero_hasta, numero_siguiente, fecha_vencimiento, estado, xml_cae)
        VALUES (?, 'A', 1, 9999, 1, ?, 'activo', 'MOCK-CAE')
      `).run(tipo, fechaVenc)
    })
  },
}

module.exports = CAESequence

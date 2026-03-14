'use strict'

const { getDb } = require('../config/database')

const Certificado = {
  findActivo() {
    return getDb().prepare("SELECT * FROM certificados WHERE activo=1 ORDER BY id DESC LIMIT 1").get()
  },

  findAll() {
    return getDb().prepare('SELECT id, thumbprint, subject_cn, not_before, not_after, activo, created_at FROM certificados ORDER BY id DESC').all()
  },

  save({ thumbprint, subject_cn, not_before, not_after, cert_pem_enc, key_pem_enc }) {
    const db = getDb()
    // Desactivar todos los anteriores
    db.prepare('UPDATE certificados SET activo=0').run()
    const { lastInsertRowid } = db.prepare(`
      INSERT INTO certificados (thumbprint, subject_cn, not_before, not_after, cert_pem_enc, key_pem_enc, activo)
      VALUES (?, ?, ?, ?, ?, ?, 1)
    `).run(thumbprint, subject_cn, not_before, not_after, cert_pem_enc, key_pem_enc)
    return db.prepare('SELECT * FROM certificados WHERE id=?').get(lastInsertRowid)
  },

  delete(id) {
    return getDb().prepare('DELETE FROM certificados WHERE id=?').run(id)
  },
}

module.exports = Certificado

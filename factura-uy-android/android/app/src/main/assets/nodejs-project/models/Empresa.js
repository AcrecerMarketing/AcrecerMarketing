'use strict'

const { getDb } = require('../config/database')

const Empresa = {
  get() {
    return getDb().prepare('SELECT * FROM empresa WHERE id = 1').get()
  },

  update(data) {
    const db = getDb()
    const fields = [
      'ruc', 'razon_social', 'nombre_comercial', 'domicilio_fiscal',
      'ciudad', 'departamento', 'codigo_actividad', 'email_empresa',
      'telefono', 'logo_path', 'moneda_default', 'ambiente',
      'dgi_usuario', 'dgi_password_enc', 'smtp_host', 'smtp_port',
      'smtp_user', 'smtp_pass_enc', 'smtp_from',
    ]
    const updates = fields.filter(f => data[f] !== undefined)
    if (!updates.length) return this.get()
    const sql = `UPDATE empresa SET ${updates.map(f => `${f} = @${f}`).join(', ')} WHERE id = 1`
    db.prepare(sql).run(data)
    return this.get()
  },
}

module.exports = Empresa

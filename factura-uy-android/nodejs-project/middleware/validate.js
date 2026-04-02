'use strict'

const Joi = require('joi')

function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true })
    if (error) {
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: error.details.map(d => d.message),
      })
    }
    req.body = value
    next()
  }
}

// ── Schemas de validación ──────────────────────────────────────────────────

const schemas = {
  login: Joi.object({
    password: Joi.string().required(),
  }),

  empresa: Joi.object({
    ruc: Joi.string().max(20),
    razon_social: Joi.string().max(200),
    nombre_comercial: Joi.string().max(200).allow('', null),
    domicilio_fiscal: Joi.string().max(300).allow('', null),
    ciudad: Joi.string().max(100).allow('', null),
    departamento: Joi.string().max(100).allow('', null),
    codigo_actividad: Joi.string().max(10).allow('', null),
    email_empresa: Joi.string().email().allow('', null),
    telefono: Joi.string().max(30).allow('', null),
    moneda_default: Joi.string().valid('UYU', 'USD', 'EUR'),
    ambiente: Joi.string().valid('mock', 'homologacion', 'produccion'),
    dgi_usuario: Joi.string().max(100).allow('', null),
    dgi_password_enc: Joi.string().allow('', null),
    smtp_host: Joi.string().max(100).allow('', null),
    smtp_port: Joi.number().integer().min(1).max(65535).allow(null),
    smtp_user: Joi.string().max(100).allow('', null),
    smtp_pass_enc: Joi.string().allow('', null),
    smtp_from: Joi.string().max(200).allow('', null),
  }),

  cliente: Joi.object({
    tipo: Joi.string().valid('cliente', 'proveedor', 'ambos'),
    tipo_doc: Joi.string().valid('RUT', 'CI', 'Pasaporte', 'Otro'),
    documento: Joi.string().max(30).allow('', null),
    razon_social: Joi.string().max(200).required(),
    nombre_comercial: Joi.string().max(200).allow('', null),
    domicilio: Joi.string().max(300).allow('', null),
    ciudad: Joi.string().max(100).allow('', null),
    departamento: Joi.string().max(100).allow('', null),
    pais: Joi.string().length(2).default('UY'),
    email: Joi.string().email().allow('', null),
    telefono: Joi.string().max(30).allow('', null),
    exento_iva: Joi.boolean().default(false),
    notas: Joi.string().max(500).allow('', null),
  }),

  cfe: Joi.object({
    tipo_cfe: Joi.number().valid(101, 102, 103, 111, 112, 113, 124, 182).required(),
    serie: Joi.string().max(1).default('A'),
    cliente_id: Joi.number().integer().allow(null),
    receptor_nombre: Joi.string().max(200).allow('', null),
    receptor_doc_tipo: Joi.string().valid('RUT', 'CI', 'Pasaporte', 'Otro').default('RUT'),
    receptor_doc: Joi.string().max(30).allow('', null),
    receptor_email: Joi.string().email().allow('', null),
    receptor_domicilio: Joi.string().max(300).allow('', null),
    fecha_emision: Joi.string().isoDate(),
    fecha_vencimiento: Joi.string().isoDate().allow(null),
    moneda: Joi.string().valid('UYU', 'USD', 'EUR').default('UYU'),
    tipo_cambio: Joi.number().min(0).default(1),
    medio_pago: Joi.string().valid('efectivo', 'credito', 'debito', 'transferencia', 'cheque', 'otros').default('efectivo'),
    referencia_cfe_id: Joi.number().integer().allow(null),
    referencia_motivo: Joi.string().max(500).allow('', null),
    notas: Joi.string().max(500).allow('', null),
    items: Joi.array().items(Joi.object({
      descripcion: Joi.string().max(500).required(),
      cantidad: Joi.number().min(0).default(1),
      precio_unitario: Joi.number().min(0).required(),
      tasa_iva: Joi.number().valid(0, 10, 22).default(22),
      descuento_pct: Joi.number().min(0).max(100).default(0),
    })).min(1).required(),
  }),
}

module.exports = { validate, schemas }

'use strict'

const express = require('express')
const auth = require('../middleware/auth')
const CFE = require('../models/CFE')
const CAESequence = require('../models/CAESequence')
const Certificado = require('../models/Certificado')
const router = express.Router()

router.get('/stats', auth, (req, res) => {
  const { mes, anio } = req.query
  const stats = CFE.stats({ mes: mes ? +mes : undefined, anio: anio ? +anio : undefined })

  // Alertas
  const alertas = []
  const cert = Certificado.findActivo()
  if (!cert) {
    alertas.push({ tipo: 'danger', mensaje: 'Sin certificado digital. Subí tu archivo .p12 en Configuración.' })
  } else {
    const diasRestantes = Math.floor((new Date(cert.not_after) - new Date()) / 86400000)
    if (diasRestantes < 30) alertas.push({ tipo: 'warning', mensaje: `Certificado digital vence en ${diasRestantes} días.` })
  }

  const caes = CAESequence.findAll()
  const sinCae = [101, 111].filter(t => !caes.find(c => c.tipo_cfe === t && c.estado === 'activo'))
  if (sinCae.length) alertas.push({ tipo: 'warning', mensaje: `Sin CAE activo para tipos: ${sinCae.join(', ')}. Solicitá nuevos rangos.` })

  const ambiente = require('../models/Empresa').get()?.ambiente || 'mock'
  if (ambiente === 'mock') alertas.push({ tipo: 'info', mensaje: 'Modo simulador activo. Los comprobantes NO son válidos ante DGI.' })

  res.json({ ...stats, alertas })
})

module.exports = router

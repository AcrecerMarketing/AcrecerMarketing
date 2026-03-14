'use strict'

const express = require('express')
const auth = require('../middleware/auth')
const CAESequence = require('../models/CAESequence')
const DgiSubmitter = require('../services/dgi/DgiSubmitter')
const router = express.Router()

router.get('/', auth, (req, res) => {
  res.json(CAESequence.findAll())
})

router.post('/solicitar', auth, async (req, res, next) => {
  try {
    const { tipo_cfe, serie, cantidad } = req.body
    if (!tipo_cfe) return res.status(400).json({ error: 'tipo_cfe requerido' })
    const cae = await DgiSubmitter.solicitarCAE({ tipo_cfe, serie: serie || 'A', cantidad: cantidad || 200 })
    res.status(201).json(cae)
  } catch (e) { next(e) }
})

// En modo mock: crear CAE simulado
router.post('/mock', auth, (req, res) => {
  const { tipo_cfe, serie, numero_desde, numero_hasta, fecha_vencimiento } = req.body
  if (!tipo_cfe || !numero_desde || !numero_hasta || !fecha_vencimiento) {
    return res.status(400).json({ error: 'Campos requeridos: tipo_cfe, numero_desde, numero_hasta, fecha_vencimiento' })
  }
  const cae = CAESequence.create({ tipo_cfe, serie: serie || 'A', numero_desde, numero_hasta, fecha_vencimiento, xml_cae: 'MOCK' })
  res.status(201).json(cae)
})

module.exports = router

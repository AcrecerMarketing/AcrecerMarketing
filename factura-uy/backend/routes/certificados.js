'use strict'

const express = require('express')
const multer = require('multer')
const auth = require('../middleware/auth')
const Certificado = require('../models/Certificado')
const CertificateService = require('../services/certificate/CertificateService')
const router = express.Router()

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } })

router.get('/estado', auth, (req, res) => {
  res.json(CertificateService.getEstado())
})

router.get('/', auth, (req, res) => {
  res.json(Certificado.findAll())
})

router.post('/', auth, upload.single('certificado'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Archivo .p12 requerido' })
    const password = req.body.password || ''
    const cert = CertificateService.importP12(req.file.buffer, password)
    res.status(201).json(cert)
  } catch (e) { next(e) }
})

router.delete('/:id', auth, (req, res) => {
  Certificado.delete(+req.params.id)
  res.json({ ok: true })
})

module.exports = router

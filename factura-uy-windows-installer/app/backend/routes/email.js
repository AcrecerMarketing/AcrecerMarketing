'use strict'

const express = require('express')
const fs = require('fs')
const auth = require('../middleware/auth')
const CFE = require('../models/CFE')
const Empresa = require('../models/Empresa')
const { generatePdf } = require('../services/pdf/PdfGenerator')
const { sendCfePdf } = require('../services/email/EmailService')
const router = express.Router()

router.post('/:id', auth, async (req, res, next) => {
  try {
    const cfe = CFE.findById(+req.params.id)
    if (!cfe) return res.status(404).json({ error: 'CFE no encontrado' })
    const empresa = Empresa.get()

    const emailDestino = req.body.email || cfe.receptor_email
    if (!emailDestino) return res.status(400).json({ error: 'Email del receptor no disponible' })

    // Obtener PDF
    let pdfBuffer
    if (cfe.pdf_path && fs.existsSync(cfe.pdf_path)) {
      pdfBuffer = fs.readFileSync(cfe.pdf_path)
    } else {
      pdfBuffer = await generatePdf(cfe, empresa, cfe.items || [])
    }

    await sendCfePdf({ ...cfe, receptor_email: emailDestino }, pdfBuffer, empresa)
    CFE.markEmailSent(cfe.id)
    res.json({ ok: true, enviado_a: emailDestino })
  } catch (e) { next(e) }
})

module.exports = router

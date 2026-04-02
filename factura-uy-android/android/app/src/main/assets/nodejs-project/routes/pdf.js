'use strict'

const express = require('express')
const fs = require('fs')
const path = require('path')
const auth = require('../middleware/auth')
const CFE = require('../models/CFE')
const Empresa = require('../models/Empresa')
const { generatePdf } = require('../services/pdf/PdfGenerator')
const router = express.Router()

router.get('/:id', auth, async (req, res, next) => {
  try {
    const cfe = CFE.findById(+req.params.id)
    if (!cfe) return res.status(404).json({ error: 'CFE no encontrado' })
    const empresa = Empresa.get()

    // Si ya existe el PDF guardado, servirlo directamente
    if (cfe.pdf_path && fs.existsSync(cfe.pdf_path)) {
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', `inline; filename="cfe_${cfe.tipo_cfe}_${cfe.serie}${cfe.numero}.pdf"`)
      return fs.createReadStream(cfe.pdf_path).pipe(res)
    }

    // Si no existe, generar on the fly
    const items = cfe.items || []
    const pdfBuffer = await generatePdf(cfe, empresa, items)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `inline; filename="cfe_${cfe.tipo_cfe}_${cfe.serie}${cfe.numero || 'borrador'}.pdf"`)
    res.send(pdfBuffer)
  } catch (e) { next(e) }
})

router.get('/:id/xml', auth, (req, res) => {
  const cfe = CFE.findById(+req.params.id)
  if (!cfe) return res.status(404).json({ error: 'CFE no encontrado' })
  if (!cfe.xml_firmado) return res.status(404).json({ error: 'XML no disponible. El CFE debe ser emitido primero.' })
  res.setHeader('Content-Type', 'application/xml; charset=utf-8')
  res.setHeader('Content-Disposition', `attachment; filename="cfe_${cfe.tipo_cfe}_${cfe.serie}${cfe.numero}.xml"`)
  res.send(cfe.xml_firmado)
})

module.exports = router

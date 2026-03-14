'use strict'

const express = require('express')
const path = require('path')
const fs = require('fs')
const auth = require('../middleware/auth')
const { validate, schemas } = require('../middleware/validate')
const CFE = require('../models/CFE')
const Cliente = require('../models/Cliente')
const Empresa = require('../models/Empresa')
const CAESequence = require('../models/CAESequence')
const TaxCalculator = require('../services/tax/TaxCalculator')
const { buildCfe } = require('../services/cfe/CfeBuilder')
const { signCfe, signCfeMock } = require('../services/cfe/CfeSigner')
const { submitCfe } = require('../services/dgi/DgiSubmitter')
const { generatePdf } = require('../services/pdf/PdfGenerator')
const { CFE_ESTADOS } = require('../config/constants')
const router = express.Router()

const PDF_DIR = path.join(__dirname, '..', 'pdfs')
if (!fs.existsSync(PDF_DIR)) fs.mkdirSync(PDF_DIR, { recursive: true })

router.get('/', auth, (req, res) => {
  const { tipo_cfe, estado, cliente_id, fecha_desde, fecha_hasta, page, limit } = req.query
  res.json(CFE.findAll({ tipo_cfe: tipo_cfe ? +tipo_cfe : undefined, estado, cliente_id: cliente_id ? +cliente_id : undefined, fecha_desde, fecha_hasta, page: +page || 1, limit: +limit || 50 }))
})

router.get('/:id', auth, (req, res) => {
  const cfe = CFE.findById(+req.params.id)
  if (!cfe) return res.status(404).json({ error: 'CFE no encontrado' })
  res.json(cfe)
})

router.post('/', auth, validate(schemas.cfe), (req, res) => {
  const data = req.body
  const totales = TaxCalculator.calcTotales(data.items)
  const cfe = CFE.create({ ...data, ...totales, items: totales.items })
  res.status(201).json(cfe)
})

router.post('/:id/emitir', auth, async (req, res, next) => {
  try {
    const cfe = CFE.findById(+req.params.id)
    if (!cfe) return res.status(404).json({ error: 'CFE no encontrado' })
    if (cfe.estado !== CFE_ESTADOS.BORRADOR) return res.status(400).json({ error: 'Solo se pueden emitir comprobantes en estado borrador' })

    const empresa = Empresa.get()
    if (!empresa?.ruc) return res.status(400).json({ error: 'Configurá los datos de tu empresa antes de emitir' })

    const mode = process.env.DGI_MODE || 'mock'

    // 1. Asignar número correlativo (CAE)
    if (mode === 'mock') {
      // En mock, si no hay CAE, crearlos automáticamente
      CAESequence.seedMock()
    }
    const { numero, caeId } = CAESequence.nextNumero(cfe.tipo_cfe, cfe.serie)

    // 2. Construir XML
    const items = cfe.items || []
    const xmlSinFirma = buildCfe({ ...cfe, numero }, empresa, items)

    // 3. Firmar
    const xmlFirmado = mode === 'mock'
      ? signCfeMock(xmlSinFirma)
      : await signCfe(xmlSinFirma)

    // 4. Guardar XML
    CFE.updateXml(cfe.id, xmlSinFirma, xmlFirmado)

    // 5. Enviar a DGI
    const dgiResp = await submitCfe(xmlFirmado, empresa)

    // 6. Actualizar estado
    const nuevoEstado = dgiResp.ok ? CFE_ESTADOS.EMITIDO : CFE_ESTADOS.RECHAZADO
    const cfeActualizado = CFE.updateEstado(cfe.id, nuevoEstado, {
      numero,
      cae_id: caeId,
      dgi_response_code: dgiResp.codigo,
      dgi_response_msg: dgiResp.mensaje,
      dgi_timestamp: dgiResp.timestamp,
    })

    // 7. Generar PDF
    if (dgiResp.ok) {
      try {
        const pdfBuffer = await generatePdf({ ...cfeActualizado, items }, empresa, items)
        const pdfPath = path.join(PDF_DIR, `cfe_${cfe.id}.pdf`)
        fs.writeFileSync(pdfPath, pdfBuffer)
        CFE.setPdfPath(cfe.id, pdfPath)
        cfeActualizado.pdf_path = pdfPath
      } catch (pdfErr) {
        console.error('Error generando PDF:', pdfErr.message)
      }
    }

    res.json({ ...cfeActualizado, dgi: dgiResp })
  } catch (e) { next(e) }
})

router.post('/:id/anular', auth, (req, res) => {
  const cfe = CFE.findById(+req.params.id)
  if (!cfe) return res.status(404).json({ error: 'CFE no encontrado' })
  if (cfe.estado !== CFE_ESTADOS.EMITIDO) return res.status(400).json({ error: 'Solo se pueden anular comprobantes emitidos' })
  res.json(CFE.updateEstado(cfe.id, CFE_ESTADOS.ANULADO, { notas: req.body.motivo || 'Anulado por el usuario' }))
})

module.exports = router

'use strict'

const PDFDocument = require('pdfkit')
const { generateQr } = require('./QrGenerator')
const { CFE_TIPOS } = require('../../config/constants')

const COLORS = {
  primary: '#2563eb',
  dark:    '#111827',
  gray:    '#6b7280',
  light:   '#f9fafb',
  border:  '#e5e7eb',
  red:     '#dc2626',
}

/**
 * Genera el PDF de representación impresa de un CFE.
 * Cumple con el formato requerido por DGI Uruguay.
 * @returns {Buffer} PDF buffer
 */
async function generatePdf(cfe, empresa, items) {
  return new Promise(async (resolve, reject) => {
    try {
      const qrBuffer = await generateQr(cfe, empresa)
      const tipoCfe = CFE_TIPOS[cfe.tipo_cfe] || { nombre: `Tipo ${cfe.tipo_cfe}`, abrev: 'CFE' }
      const docNum = `${cfe.serie}-${String(cfe.numero).padStart(7, '0')}`
      const isMock = (process.env.DGI_MODE || 'mock') === 'mock'

      const chunks = []
      const doc = new PDFDocument({ size: 'A4', margins: { top: 40, bottom: 40, left: 40, right: 40 } })
      doc.on('data', c => chunks.push(c))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      const W = doc.page.width - 80   // ancho útil

      // ── WATERMARK modo mock ────────────────────────────────────────────────
      if (isMock) {
        doc.save()
        doc.fontSize(60).fillColor('#f3f4f6').opacity(0.3)
        doc.rotate(-45, { origin: [300, 400] })
        doc.text('SIMULACIÓN - NO VÁLIDO', 50, 350)
        doc.restore()
        doc.opacity(1)
      }

      // ── HEADER ─────────────────────────────────────────────────────────────
      doc.rect(40, 40, W, 80).fill(COLORS.primary)
      doc.fillColor('#fff').fontSize(18).font('Helvetica-Bold')
      doc.text(empresa.nombre_comercial || empresa.razon_social, 55, 55, { width: W - 150 })
      doc.fontSize(9).font('Helvetica').fillColor('#dbeafe')
      doc.text(`RUC: ${empresa.ruc}`, 55, 80)
      doc.text(empresa.domicilio_fiscal || '', 55, 92)

      // Número de comprobante (derecha)
      doc.rect(W - 60, 45, 125, 70).fill('#1d4ed8')
      doc.fillColor('#fff').fontSize(8).font('Helvetica-Bold').text(tipoCfe.nombre.toUpperCase(), W - 55, 52, { width: 115, align: 'center' })
      doc.fontSize(16).text(docNum, W - 55, 70, { width: 115, align: 'center' })

      let y = 135

      // ── DATOS DEL COMPROBANTE ──────────────────────────────────────────────
      doc.rect(40, y, W, 55).fill(COLORS.light).stroke(COLORS.border)
      doc.fillColor(COLORS.dark).fontSize(8).font('Helvetica-Bold')
      doc.text('FECHA DE EMISIÓN', 50, y + 8)
      doc.text('FECHA VENCIMIENTO', 230, y + 8)
      doc.text('MONEDA', 420, y + 8)
      doc.font('Helvetica').fillColor(COLORS.gray)
      doc.text(cfe.fecha_emision?.slice(0, 10) || '-', 50, y + 22)
      doc.text(cfe.fecha_vencimiento?.slice(0, 10) || '-', 230, y + 22)
      doc.text(cfe.moneda || 'UYU', 420, y + 22)

      // ── EMISOR / RECEPTOR ──────────────────────────────────────────────────
      y += 65
      const halfW = (W - 10) / 2
      ;[
        { label: 'EMISOR', x: 40, data: { nombre: empresa.razon_social, doc: `RUC: ${empresa.ruc}`, dir: empresa.domicilio_fiscal } },
        { label: 'RECEPTOR', x: 50 + halfW, data: { nombre: cfe.receptor_nombre || 'Consumidor Final', doc: cfe.receptor_doc ? `${cfe.receptor_doc_tipo}: ${cfe.receptor_doc}` : '', dir: cfe.receptor_domicilio } },
      ].forEach(({ label, x, data }) => {
        doc.rect(x, y, halfW, 65).fill(COLORS.light).stroke(COLORS.border)
        doc.fillColor(COLORS.primary).fontSize(8).font('Helvetica-Bold').text(label, x + 8, y + 8)
        doc.fillColor(COLORS.dark).font('Helvetica').fontSize(9)
        doc.text(data.nombre || '', x + 8, y + 20, { width: halfW - 16 })
        doc.fillColor(COLORS.gray).fontSize(8)
        doc.text(data.doc || '', x + 8, y + 34, { width: halfW - 16 })
        doc.text(data.dir || '', x + 8, y + 46, { width: halfW - 16 })
      })

      // ── TABLA DE ÍTEMS ─────────────────────────────────────────────────────
      y += 75
      const colWidths = [20, W - 300, 60, 80, 50, 80]
      const colX = colWidths.reduce((acc, w, i) => { acc.push(i === 0 ? 40 : acc[i - 1] + colWidths[i - 1]); return acc }, [])
      const headers = ['#', 'Descripción', 'Cant.', 'Precio Unit.', 'IVA %', 'Subtotal']

      // Header tabla
      doc.rect(40, y, W, 18).fill(COLORS.primary)
      doc.fillColor('#fff').fontSize(8).font('Helvetica-Bold')
      headers.forEach((h, i) => {
        doc.text(h, colX[i] + 3, y + 5, { width: colWidths[i] - 6, align: i > 1 ? 'right' : 'left' })
      })
      y += 18

      // Filas
      items.forEach((item, idx) => {
        const bg = idx % 2 === 0 ? '#fff' : COLORS.light
        doc.rect(40, y, W, 18).fill(bg).stroke(COLORS.border)
        doc.fillColor(COLORS.dark).font('Helvetica').fontSize(8)
        const cells = [
          idx + 1,
          item.descripcion,
          Number(item.cantidad).toFixed(2),
          `$${Number(item.precio_unitario).toLocaleString('es-UY', { minimumFractionDigits: 2 })}`,
          item.tasa_iva === 0 ? 'Exento' : `${item.tasa_iva}%`,
          `$${Number(item.monto_item).toLocaleString('es-UY', { minimumFractionDigits: 2 })}`,
        ]
        cells.forEach((c, i) => {
          doc.text(String(c), colX[i] + 3, y + 5, { width: colWidths[i] - 6, align: i > 1 ? 'right' : 'left' })
        })
        y += 18
      })

      // ── TOTALES ────────────────────────────────────────────────────────────
      y += 10
      const totX = 40 + W - 220
      const totals = [
        ['Neto s/IVA:', cfe.monto_neto],
        ['IVA 22%:', cfe.monto_iva_22],
        ['IVA 10%:', cfe.monto_iva_10],
        ['Exento:', cfe.monto_exento],
      ].filter(([, v]) => v > 0)

      totals.forEach(([label, val]) => {
        doc.fillColor(COLORS.gray).font('Helvetica').fontSize(9)
        doc.text(label, totX, y, { width: 110, align: 'right' })
        doc.fillColor(COLORS.dark)
        doc.text(`$${Number(val).toLocaleString('es-UY', { minimumFractionDigits: 2 })}`, totX + 115, y, { width: 100, align: 'right' })
        y += 14
      })

      // Total final
      doc.rect(totX - 10, y, 225, 24).fill(COLORS.primary)
      doc.fillColor('#fff').font('Helvetica-Bold').fontSize(11)
      doc.text('TOTAL:', totX, y + 6, { width: 110, align: 'right' })
      doc.text(`$${Number(cfe.monto_total).toLocaleString('es-UY', { minimumFractionDigits: 2 })}`, totX + 115, y + 6, { width: 100, align: 'right' })
      y += 34

      // ── QR + PIE ───────────────────────────────────────────────────────────
      const qrY = doc.page.height - 140
      doc.image(qrBuffer, 40, qrY, { width: 80, height: 80 })
      doc.fillColor(COLORS.gray).font('Helvetica').fontSize(7)
      doc.text('Escaneá el QR para verificar este comprobante en el portal DGI.', 130, qrY + 5, { width: 200 })
      doc.text('www.efactura.dgi.gub.uy/principal/verificacioncfe', 130, qrY + 20)

      if (isMock) {
        doc.fillColor(COLORS.red).font('Helvetica-Bold').fontSize(8)
        doc.text('DOCUMENTO DE MUESTRA — MODO SIMULADOR — NO VÁLIDO ANTE DGI', 40, qrY + 50, { width: W, align: 'center' })
      }

      doc.fillColor(COLORS.gray).font('Helvetica').fontSize(7)
      doc.text(`Generado el ${new Date().toLocaleString('es-UY')} | Factura-UY`, 40, doc.page.height - 30, { width: W, align: 'center' })

      doc.end()
    } catch (e) { reject(e) }
  })
}

module.exports = { generatePdf }

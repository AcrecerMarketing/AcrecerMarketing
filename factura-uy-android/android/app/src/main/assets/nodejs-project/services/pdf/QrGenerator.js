'use strict'

const QRCode = require('qrcode')

/**
 * Genera el QR obligatorio para representación impresa de CFE.
 * El contenido del QR sigue el formato requerido por DGI Uruguay.
 * @returns {Buffer} PNG buffer del QR
 */
async function generateQr(cfe, empresa) {
  // Formato QR DGI Uruguay:
  // RUC|TipoCFE|Serie|Numero|MontoTotal|FechaEmision
  const content = [
    empresa.ruc,
    cfe.tipo_cfe,
    cfe.serie,
    cfe.numero,
    Number(cfe.monto_total).toFixed(2),
    (cfe.fecha_emision || '').slice(0, 10),
  ].join('|')

  const buffer = await QRCode.toBuffer(content, {
    errorCorrectionLevel: 'M',
    type: 'png',
    width: 120,
    margin: 1,
  })
  return buffer
}

module.exports = { generateQr }

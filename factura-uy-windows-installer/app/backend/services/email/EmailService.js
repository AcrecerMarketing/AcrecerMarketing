'use strict'

const nodemailer = require('nodemailer')
const Empresa = require('../../models/Empresa')
const CertificateEncryptor = require('../certificate/CertificateEncryptor')

async function sendCfePdf(cfe, pdfBuffer, empresa) {
  const e = empresa || Empresa.get()
  if (!e?.smtp_host) throw Object.assign(new Error('Sin configuración SMTP. Configurá el email en Configuración.'), { status: 400 })
  if (!cfe.receptor_email) throw Object.assign(new Error('El receptor no tiene email registrado.'), { status: 400 })

  let pass = ''
  try { pass = e.smtp_pass_enc ? CertificateEncryptor.decrypt(e.smtp_pass_enc) : '' } catch {}

  const transporter = nodemailer.createTransport({
    host: e.smtp_host,
    port: e.smtp_port || 587,
    secure: e.smtp_port === 465,
    auth: { user: e.smtp_user, pass },
  })

  const tipoCfe = cfe.tipo_cfe
  const docNum = `${cfe.serie}-${String(cfe.numero).padStart(7, '0')}`
  const tipoNombre = {
    101: 'e-Ticket', 102: 'Nota de Crédito', 103: 'Nota de Débito',
    111: 'e-Factura', 112: 'Nota de Crédito', 113: 'Nota de Débito',
    124: 'e-Remito', 182: 'e-Resguardo',
  }[tipoCfe] || 'Comprobante'

  await transporter.sendMail({
    from: e.smtp_from || e.email_empresa || e.smtp_user,
    to: cfe.receptor_email,
    subject: `${tipoNombre} ${docNum} - ${e.razon_social}`,
    text: `Adjunto encontrará el ${tipoNombre} N° ${docNum} emitido por ${e.razon_social}.`,
    html: `<p>Estimado/a <b>${cfe.receptor_nombre || 'Cliente'}</b>,</p>
           <p>Adjunto encontrará el <b>${tipoNombre} N° ${docNum}</b> emitido por <b>${e.razon_social}</b>.</p>
           <p>Ante cualquier consulta, no dude en contactarnos.</p>
           <p>Saludos,<br>${e.razon_social}</p>`,
    attachments: [{
      filename: `${tipoNombre.replace(/ /g, '_')}_${docNum}.pdf`,
      content: pdfBuffer,
      contentType: 'application/pdf',
    }],
  })
}

module.exports = { sendCfePdf }

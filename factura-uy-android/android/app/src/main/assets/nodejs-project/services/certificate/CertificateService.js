'use strict'

const forge = require('node-forge')
const Certificado = require('../../models/Certificado')
const { encrypt } = require('./CertificateEncryptor')

/**
 * Procesa un archivo .p12 subido por el usuario.
 * Extrae el certificado X.509 y la clave privada, los encripta y guarda en BD.
 * @param {Buffer} p12Buffer - contenido del archivo .p12
 * @param {string} password - contraseña del .p12 (puede ser vacía)
 */
function importP12(p12Buffer, password = '') {
  let p12Asn1, p12
  try {
    p12Asn1 = forge.asn1.fromDer(p12Buffer.toString('binary'))
    p12 = forge.pkcs12.pkcs12FromAsn1(p12Asn1, false, password)
  } catch (e) {
    throw Object.assign(new Error('No se pudo leer el archivo .p12. Verificá la contraseña.'), { status: 400 })
  }

  // Extraer certificado
  const certBags = p12.getBags({ bagType: forge.pki.oids.certBag })
  const certBag = certBags[forge.pki.oids.certBag]?.[0]
  if (!certBag) throw Object.assign(new Error('El .p12 no contiene certificado.'), { status: 400 })
  const cert = certBag.cert

  // Extraer clave privada
  const keyBags = p12.getBags({ bagType: forge.pki.oids.pkcs8ShroudedKeyBag })
  const keyBag = keyBags[forge.pki.oids.pkcs8ShroudedKeyBag]?.[0]
  if (!keyBag) throw Object.assign(new Error('El .p12 no contiene clave privada.'), { status: 400 })
  const privateKey = keyBag.key

  // Metadata
  const thumbprintDer = forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).bytes()
  const thumbprint = forge.md.sha1.create().update(thumbprintDer).digest().toHex()
  const subject_cn = cert.subject.getField('CN')?.value || 'Desconocido'
  const not_before = cert.validity.notBefore.toISOString()
  const not_after  = cert.validity.notAfter.toISOString()

  // Encriptar y guardar
  const cert_pem_enc = encrypt(forge.pki.certificateToPem(cert))
  const key_pem_enc  = encrypt(forge.pki.privateKeyToPem(privateKey))

  return Certificado.save({ thumbprint, subject_cn, not_before, not_after, cert_pem_enc, key_pem_enc })
}

function getEstado() {
  const cert = Certificado.findActivo()
  if (!cert) return { activo: false, mensaje: 'Sin certificado digital' }
  const diasRestantes = Math.floor((new Date(cert.not_after) - new Date()) / 86400000)
  return {
    activo: true,
    subject_cn: cert.subject_cn,
    not_before: cert.not_before,
    not_after: cert.not_after,
    dias_restantes: diasRestantes,
    vencido: diasRestantes < 0,
    por_vencer: diasRestantes < 30 && diasRestantes >= 0,
  }
}

module.exports = { importP12, getEstado }

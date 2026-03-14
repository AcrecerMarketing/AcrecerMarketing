'use strict'

const forge = require('node-forge')
const crypto = require('crypto')
const Certificado = require('../../models/Certificado')
const CertificateEncryptor = require('../certificate/CertificateEncryptor')

/**
 * Firma el XML CFE con XMLDSig usando el certificado X.509 activo.
 * Implementa la firma canónica requerida por DGI Uruguay.
 */
async function signCfe(xmlString) {
  const certRecord = Certificado.findActivo()
  if (!certRecord) throw Object.assign(new Error('Sin certificado digital activo. Subí tu archivo .p12 en Configuración.'), { status: 400 })

  // Desencriptar claves
  const certPem = CertificateEncryptor.decrypt(certRecord.cert_pem_enc)
  const keyPem  = CertificateEncryptor.decrypt(certRecord.key_pem_enc)

  const cert       = forge.pki.certificateFromPem(certPem)
  const privateKey = forge.pki.privateKeyFromPem(keyPem)

  // Calcular digest SHA-1 del XML
  const md = forge.md.sha1.create()
  md.update(xmlString, 'utf8')
  const digestB64 = forge.util.encode64(md.digest().bytes())

  // Firmar (RSA-SHA1)
  const signMd = forge.md.sha1.create()
  signMd.update(xmlString, 'utf8')
  const signatureBytes = privateKey.sign(signMd)
  const signatureB64 = forge.util.encode64(signatureBytes)

  // Cert en DER → Base64
  const certDer  = forge.asn1.toDer(forge.pki.certificateToAsn1(cert)).bytes()
  const certB64  = forge.util.encode64(certDer)
  const certSerial = cert.serialNumber
  const certIssuer = cert.issuer.attributes.map(a => `${a.shortName}=${a.value}`).join(',')

  // Construir bloque de firma XMLDSig (simplificado para DGI)
  const signatureXml = `
<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
  <SignedInfo>
    <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315"/>
    <SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
    <Reference URI="">
      <Transforms>
        <Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
      </Transforms>
      <DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
      <DigestValue>${digestB64}</DigestValue>
    </Reference>
  </SignedInfo>
  <SignatureValue>${signatureB64}</SignatureValue>
  <KeyInfo>
    <X509Data>
      <X509Certificate>${certB64}</X509Certificate>
      <X509IssuerSerial>
        <X509IssuerName>${certIssuer}</X509IssuerName>
        <X509SerialNumber>${certSerial}</X509SerialNumber>
      </X509IssuerSerial>
    </X509Data>
  </KeyInfo>
</Signature>`

  // Insertar firma antes del cierre de DGICFE
  const signed = xmlString.replace('</DGICFE>', `${signatureXml.trim()}\n</DGICFE>`)
  return signed
}

// Modo mock: retorna XML con firma simulada
function signCfeMock(xmlString) {
  const mockSig = `
<Signature xmlns="http://www.w3.org/2000/09/xmldsig#">
  <SignedInfo>
    <SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
    <Reference URI=""><DigestValue>MOCK_DIGEST</DigestValue></Reference>
  </SignedInfo>
  <SignatureValue>MOCK_SIGNATURE_NOT_VALID_FOR_DGI</SignatureValue>
</Signature>`
  return xmlString.replace('</DGICFE>', `${mockSig.trim()}\n</DGICFE>`)
}

module.exports = { signCfe, signCfeMock }

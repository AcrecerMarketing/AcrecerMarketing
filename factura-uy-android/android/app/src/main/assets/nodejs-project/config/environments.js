'use strict'

// URLs oficiales de los web services DGI Uruguay
// Fuente: https://www.efactura.dgi.gub.uy/principal/ampliacion_de_contenido/documentos-de-interes

const DGI_URLS = {
  homologacion: {
    auth:    'https://efactura.dgi.gub.uy/eFact_HOMOG/ws_autenticar.cgi',
    envio:   'https://efactura.dgi.gub.uy/eFact_HOMOG/ws_recepcion.cgi',
    consulta:'https://efactura.dgi.gub.uy/eFact_HOMOG/ws_consulta.cgi',
    cae:     'https://efactura.dgi.gub.uy/eFact_HOMOG/ws_cae.cgi',
    verif:   'https://www.efactura.dgi.gub.uy/principal/verificacioncfe',
  },
  produccion: {
    auth:    'https://efactura.dgi.gub.uy/eFact/ws_autenticar.cgi',
    envio:   'https://efactura.dgi.gub.uy/eFact/ws_recepcion.cgi',
    consulta:'https://efactura.dgi.gub.uy/eFact/ws_consulta.cgi',
    cae:     'https://efactura.dgi.gub.uy/eFact/ws_cae.cgi',
    verif:   'https://www.efactura.dgi.gub.uy/principal/verificacioncfe',
  },
}

function getDgiUrls() {
  const mode = process.env.DGI_MODE || 'mock'
  if (mode === 'mock') return DGI_URLS.homologacion // mock usa homologación URLs pero no llama
  return DGI_URLS[mode] || DGI_URLS.homologacion
}

module.exports = { DGI_URLS, getDgiUrls }

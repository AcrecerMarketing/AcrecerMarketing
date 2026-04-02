'use strict'

const axios = require('axios')
const { getDgiUrls } = require('../../config/environments')
const DgiAuth = require('./DgiAuth')
const CAESequence = require('../../models/CAESequence')

/**
 * Envía un CFE firmado al web service DGI y retorna la respuesta.
 * En modo mock: retorna respuesta simulada exitosa.
 */
async function submitCfe(xmlFirmado, empresa) {
  const mode = process.env.DGI_MODE || 'mock'

  if (mode === 'mock') {
    return {
      ok: true,
      codigo: '0',
      mensaje: '[SIMULADOR] CFE aceptado (modo mock — NO válido ante DGI)',
      timestamp: new Date().toISOString(),
    }
  }

  const token = await DgiAuth.getToken()
  const urls = getDgiUrls()

  try {
    const resp = await axios.post(urls.envio, {
      TipoDoc: 'CFE',
      Contenido: Buffer.from(xmlFirmado, 'utf8').toString('base64'),
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    })

    const data = resp.data
    return {
      ok: data.Estado === 'AC' || data.Estado === '0',
      codigo: String(data.Estado || data.Codigo || '0'),
      mensaje: data.Mensaje || data.Descripcion || 'Procesado',
      timestamp: new Date().toISOString(),
    }
  } catch (e) {
    if (e.response?.status === 401) {
      DgiAuth.clearCache()
      throw new Error('Credenciales DGI rechazadas. Verificá tu usuario y contraseña en Configuración.')
    }
    throw new Error(`Error DGI ${e.response?.status || 'red'}: ${e.message}`)
  }
}

/**
 * Solicita un nuevo rango CAE al web service DGI.
 * En modo mock: crea un CAE simulado local.
 */
async function solicitarCAE({ tipo_cfe, serie = 'A', cantidad = 200 }) {
  const mode = process.env.DGI_MODE || 'mock'

  if (mode === 'mock') {
    // Calcular siguiente número desde el último rango
    const todos = CAESequence.findAll().filter(c => c.tipo_cfe === tipo_cfe && c.serie === serie)
    const ultimo = todos.length ? Math.max(...todos.map(c => c.numero_hasta)) : 0
    const desde = ultimo + 1
    const hasta = desde + cantidad - 1
    const venc = new Date()
    venc.setFullYear(venc.getFullYear() + 1)
    return CAESequence.create({
      tipo_cfe,
      serie,
      numero_desde: desde,
      numero_hasta: hasta,
      fecha_vencimiento: venc.toISOString().split('T')[0],
      xml_cae: 'MOCK-CAE-SIMULADO',
    })
  }

  const token = await DgiAuth.getToken()
  const urls = getDgiUrls()
  try {
    const resp = await axios.post(urls.cae, {
      TipoCFE: tipo_cfe,
      Serie: serie,
      Cantidad: cantidad,
    }, {
      headers: { 'Authorization': `Bearer ${token}` },
      timeout: 15000,
    })
    // Parsear respuesta DGI y guardar CAE
    const data = resp.data
    return CAESequence.create({
      tipo_cfe,
      serie,
      numero_desde: data.NroDesde,
      numero_hasta: data.NroHasta,
      fecha_vencimiento: data.FchVenc,
      xml_cae: JSON.stringify(data),
    })
  } catch (e) {
    throw new Error(`Error solicitando CAE: ${e.message}`)
  }
}

module.exports = { submitCfe, solicitarCAE }

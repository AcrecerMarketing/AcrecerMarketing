'use strict'

const axios = require('axios')
const { getDgiUrls } = require('../../config/environments')
const Empresa = require('../../models/Empresa')

let tokenCache = { token: null, expireAt: 0 }

/**
 * Obtiene Bearer token del web service DGI.
 * Cachea el token hasta 5 minutos antes de vencer.
 */
async function getToken() {
  const mode = process.env.DGI_MODE || 'mock'

  // Modo mock: token simulado
  if (mode === 'mock') return 'MOCK_TOKEN_NOT_VALID_FOR_DGI'

  // Usar token cacheado si no expiró
  if (tokenCache.token && Date.now() < tokenCache.expireAt) return tokenCache.token

  const empresa = Empresa.get()
  if (!empresa?.dgi_usuario) throw new Error('Sin credenciales DGI configuradas. Configurá usuario DGI en Configuración > Empresa.')

  const urls = getDgiUrls()
  try {
    const resp = await axios.post(urls.auth, {
      Usuario: empresa.dgi_usuario,
      Password: empresa.dgi_password_enc, // ya se envía como está (encriptado desde UI)
    }, { timeout: 15000 })

    const token = resp.data?.Token || resp.data?.token
    if (!token) throw new Error('DGI no retornó token de autenticación')

    // Cache por 50 minutos (DGI tokens típicamente 60min)
    tokenCache = { token, expireAt: Date.now() + 50 * 60 * 1000 }
    return token
  } catch (e) {
    if (e.response) throw new Error(`DGI auth error ${e.response.status}: ${JSON.stringify(e.response.data)}`)
    throw e
  }
}

function clearCache() { tokenCache = { token: null, expireAt: 0 } }

module.exports = { getToken, clearCache }

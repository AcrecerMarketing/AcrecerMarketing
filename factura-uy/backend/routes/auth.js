'use strict'

const express = require('express')
const jwt = require('jsonwebtoken')
const { validate, schemas } = require('../middleware/validate')
const router = express.Router()

// Password simple (1 empresa, 1 usuario = propietario)
// En producción el hash se guarda en la BD. Aquí usamos env var o default.
const PASSWORD = process.env.APP_PASSWORD || 'factura2024'
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'
const JWT_EXPIRES = '8h'

router.post('/login', validate(schemas.login), (req, res) => {
  const { password } = req.body
  if (password !== PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta' })
  }
  const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
  res.json({ token, expiresIn: JWT_EXPIRES })
})

router.post('/refresh', (req, res) => {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Token requerido' })
  try {
    const old = jwt.verify(header.slice(7), JWT_SECRET)
    const token = jwt.sign({ role: old.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES })
    res.json({ token, expiresIn: JWT_EXPIRES })
  } catch {
    res.status(401).json({ error: 'Token inválido' })
  }
})

module.exports = router

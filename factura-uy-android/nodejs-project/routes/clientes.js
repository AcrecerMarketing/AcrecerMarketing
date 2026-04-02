'use strict'

const express = require('express')
const auth = require('../middleware/auth')
const { validate, schemas } = require('../middleware/validate')
const Cliente = require('../models/Cliente')
const router = express.Router()

router.get('/', auth, (req, res) => {
  const { q, tipo, page, limit } = req.query
  res.json(Cliente.findAll({ q, tipo, page: +page || 1, limit: +limit || 50 }))
})

router.post('/', auth, validate(schemas.cliente), (req, res) => {
  const cliente = Cliente.create(req.body)
  res.status(201).json(cliente)
})

router.get('/:id', auth, (req, res) => {
  const cliente = Cliente.findById(+req.params.id)
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' })
  res.json(cliente)
})

router.put('/:id', auth, validate(schemas.cliente), (req, res) => {
  const existing = Cliente.findById(+req.params.id)
  if (!existing) return res.status(404).json({ error: 'Cliente no encontrado' })
  res.json(Cliente.update(+req.params.id, req.body))
})

router.delete('/:id', auth, (req, res) => {
  const existing = Cliente.findById(+req.params.id)
  if (!existing) return res.status(404).json({ error: 'Cliente no encontrado' })
  Cliente.delete(+req.params.id)
  res.json({ ok: true })
})

module.exports = router

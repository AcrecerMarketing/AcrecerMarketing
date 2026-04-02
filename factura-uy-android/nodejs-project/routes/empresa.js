'use strict'

const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const auth = require('../middleware/auth')
const { validate, schemas } = require('../middleware/validate')
const Empresa = require('../models/Empresa')
const router = express.Router()

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true })

const upload = multer({
  dest: UPLOADS_DIR,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/svg+xml'].includes(file.mimetype)) cb(null, true)
    else cb(new Error('Solo se permiten imágenes JPG, PNG o SVG'))
  },
})

router.get('/', auth, (req, res) => {
  const empresa = Empresa.get()
  // No exponer passwords
  const safe = { ...empresa }
  delete safe.dgi_password_enc
  delete safe.smtp_pass_enc
  res.json(safe)
})

router.put('/', auth, validate(schemas.empresa), (req, res) => {
  const updated = Empresa.update(req.body)
  res.json(updated)
})

router.post('/logo', auth, upload.single('logo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Archivo requerido' })
  const ext = path.extname(req.file.originalname) || '.png'
  const dest = path.join(UPLOADS_DIR, `logo${ext}`)
  fs.renameSync(req.file.path, dest)
  Empresa.update({ logo_path: dest })
  res.json({ logo_path: dest, url: `/uploads/logo${ext}` })
})

module.exports = router

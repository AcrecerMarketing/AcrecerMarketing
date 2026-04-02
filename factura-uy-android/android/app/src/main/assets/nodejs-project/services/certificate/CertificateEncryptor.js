'use strict'

const crypto = require('crypto')

const ALG = 'aes-256-cbc'
const KEY_HEX = process.env.CERT_ENCRYPTION_KEY || '0'.repeat(64) // 32 bytes hex

function getKey() {
  return Buffer.from(KEY_HEX, 'hex')
}

function encrypt(text) {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(ALG, getKey(), iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  return iv.toString('hex') + ':' + encrypted.toString('hex')
}

function decrypt(stored) {
  const [ivHex, encHex] = stored.split(':')
  const iv = Buffer.from(ivHex, 'hex')
  const enc = Buffer.from(encHex, 'hex')
  const decipher = crypto.createDecipheriv(ALG, getKey(), iv)
  return Buffer.concat([decipher.update(enc), decipher.final()]).toString('utf8')
}

module.exports = { encrypt, decrypt }

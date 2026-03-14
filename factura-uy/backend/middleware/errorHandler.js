'use strict'

function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500
  const message = err.message || 'Error interno del servidor'
  const isDev = process.env.NODE_ENV !== 'production'
  console.error(`[ERROR] ${req.method} ${req.path} →`, message)
  res.status(status).json({
    error: message,
    ...(isDev && err.stack ? { stack: err.stack.split('\n').slice(0, 5) } : {}),
  })
}

module.exports = errorHandler

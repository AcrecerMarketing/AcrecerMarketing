'use strict'

// ── Tipos de CFE (Comprobantes Fiscales Electrónicos) ──────────────────────
const CFE_TIPOS = {
  101: { codigo: 101, nombre: 'e-Ticket',                    abrev: 'eTicket',    operacion: 'B2C' },
  102: { codigo: 102, nombre: 'Nota de Crédito de e-Ticket', abrev: 'NCTicket',   operacion: 'B2C' },
  103: { codigo: 103, nombre: 'Nota de Débito de e-Ticket',  abrev: 'NDTicket',   operacion: 'B2C' },
  111: { codigo: 111, nombre: 'e-Factura',                   abrev: 'eFactura',   operacion: 'B2B' },
  112: { codigo: 112, nombre: 'Nota de Crédito de e-Factura',abrev: 'NCFactura',  operacion: 'B2B' },
  113: { codigo: 113, nombre: 'Nota de Débito de e-Factura', abrev: 'NDFactura',  operacion: 'B2B' },
  124: { codigo: 124, nombre: 'e-Remito',                    abrev: 'eRemito',    operacion: 'LOG' },
  182: { codigo: 182, nombre: 'e-Resguardo',                 abrev: 'eResguardo', operacion: 'RES' },
}

// ── Tasas IVA Uruguay ──────────────────────────────────────────────────────
const IVA_TASAS = {
  22: 0.22,   // IVA básico (la mayoría de bienes/servicios)
  10: 0.10,   // IVA mínimo (alimentos, medicamentos, etc.)
  0:  0.00,   // Exento
}

// ── Series válidas ─────────────────────────────────────────────────────────
const SERIES_VALIDAS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']

// ── Monedas ────────────────────────────────────────────────────────────────
const MONEDAS = {
  UYU: { codigo: 'UYU', nombre: 'Peso Uruguayo',    simbolo: '$' },
  USD: { codigo: 'USD', nombre: 'Dólar Estadounidense', simbolo: 'U$S' },
  EUR: { codigo: 'EUR', nombre: 'Euro',              simbolo: '€' },
}

// ── Departamentos Uruguay ──────────────────────────────────────────────────
const DEPARTAMENTOS = [
  'Artigas', 'Canelones', 'Cerro Largo', 'Colonia', 'Durazno', 'Flores',
  'Florida', 'Lavalleja', 'Maldonado', 'Montevideo', 'Paysandú', 'Río Negro',
  'Rivera', 'Rocha', 'Salto', 'San José', 'Soriano', 'Tacuarembó',
  'Treinta y Tres',
]

// ── Códigos de actividad DGI (parcial — los más comunes para software) ─────
const ACTIVIDADES_COMUNES = {
  '6201': 'Actividades de programación informática',
  '6202': 'Actividades de consultoría de informática',
  '6209': 'Otras actividades de tecnología de la información',
  '6311': 'Procesamiento de datos',
  '6312': 'Portales web',
  '7010': 'Actividades de oficinas principales',
  '7490': 'Otras actividades profesionales, científicas y técnicas n.c.p.',
}

// ── Estados CFE ────────────────────────────────────────────────────────────
const CFE_ESTADOS = {
  BORRADOR:   'borrador',
  EMITIDO:    'emitido',
  RECHAZADO:  'rechazado',
  ANULADO:    'anulado',
}

// ── Ambientes DGI ──────────────────────────────────────────────────────────
const DGI_AMBIENTES = {
  MOCK:         'mock',
  HOMOLOGACION: 'homologacion',
  PRODUCCION:   'produccion',
}

// ── Tipos de documento receptor ────────────────────────────────────────────
const TIPOS_DOC_RECEPTOR = {
  RUT:       '2',   // RUT Uruguay (empresas)
  CI:        '3',   // Cédula de Identidad
  PASAPORTE: '4',   // Pasaporte
  OTRO:      '9',   // Otros documentos
}

// ── Medios de pago (CFE v23-2 obligatorio desde 3/3/2026) ─────────────────
const MEDIOS_PAGO = {
  'efectivo':        { codigo: '1', descripcion: 'Efectivo' },
  'credito':         { codigo: '2', descripcion: 'Crédito' },
  'debito':          { codigo: '3', descripcion: 'Débito' },
  'transferencia':   { codigo: '4', descripcion: 'Transferencia bancaria' },
  'cheque':          { codigo: '5', descripcion: 'Cheque' },
  'otros':           { codigo: '90', descripcion: 'Otros' },
}

module.exports = {
  CFE_TIPOS,
  IVA_TASAS,
  SERIES_VALIDAS,
  MONEDAS,
  DEPARTAMENTOS,
  ACTIVIDADES_COMUNES,
  CFE_ESTADOS,
  DGI_AMBIENTES,
  TIPOS_DOC_RECEPTOR,
  MEDIOS_PAGO,
}

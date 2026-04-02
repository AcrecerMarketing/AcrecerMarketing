'use strict'

// Cálculo de IVA según normativa DGI Uruguay
// IVA básico: 22%, IVA mínimo: 10%, Exento: 0%
// Los montos en el CFE son NETOS (sin IVA), el IVA se especifica separado

const TASAS = { 22: 0.22, 10: 0.10, 0: 0 }

function roundCents(n) {
  return Math.round(n * 100) / 100
}

/**
 * Calcula un ítem individual
 * @param {object} item - { precio_unitario, cantidad, tasa_iva, descuento_pct }
 * @returns {object} - { monto_bruto, descuento, monto_neto, iva, total }
 */
function calcItem(item) {
  const { precio_unitario = 0, cantidad = 1, tasa_iva = 22, descuento_pct = 0 } = item
  const tasa = TASAS[tasa_iva] ?? TASAS[22]
  const monto_bruto = roundCents(precio_unitario * cantidad)
  const descuento = roundCents(monto_bruto * (descuento_pct / 100))
  const monto_neto = roundCents(monto_bruto - descuento)
  const iva = roundCents(monto_neto * tasa)
  return {
    monto_bruto,
    descuento,
    monto_item: monto_neto,       // neto sin IVA (lo que va al XML)
    monto_iva_item: iva,
    total: roundCents(monto_neto + iva),
  }
}

/**
 * Calcula totales de una lista de ítems
 * @param {Array} items - lista de ítems con { precio_unitario, cantidad, tasa_iva, descuento_pct }
 * @returns {object} - { monto_neto, monto_iva_22, monto_iva_10, monto_exento, monto_total, items }
 */
function calcTotales(items) {
  let monto_neto = 0
  let monto_iva_22 = 0
  let monto_iva_10 = 0
  let monto_exento = 0

  const calculados = items.map(item => {
    const calc = calcItem(item)
    monto_neto += calc.monto_item
    if (item.tasa_iva === 22) monto_iva_22 += calc.monto_iva_item
    else if (item.tasa_iva === 10) monto_iva_10 += calc.monto_iva_item
    else monto_exento += calc.monto_item  // exento: monto_neto = monto_exento
    return { ...item, ...calc }
  })

  monto_neto = roundCents(monto_neto)
  monto_iva_22 = roundCents(monto_iva_22)
  monto_iva_10 = roundCents(monto_iva_10)
  monto_exento = roundCents(monto_exento)
  const monto_total = roundCents(monto_neto + monto_iva_22 + monto_iva_10)

  return {
    monto_neto,
    monto_iva_22,
    monto_iva_10,
    monto_exento,
    monto_total,
    items: calculados,
  }
}

module.exports = { calcItem, calcTotales, roundCents }

'use strict'

const { create } = require('xmlbuilder2')
const { TIPOS_DOC_RECEPTOR, MEDIOS_PAGO } = require('../../config/constants')

// Formateadores
const fmtDate = (d) => d ? d.slice(0, 10) : new Date().toISOString().slice(0, 10)
const fmtNum = (n, dec = 2) => Number(n).toFixed(dec)
const padNum = (n, len = 7) => String(n).padStart(len, '0')

/**
 * Construye el XML CFE según formato versión 23-2 DGI Uruguay
 * XSD schema 1.43.5
 */
function buildCfe(cfe, empresa, items) {
  const tipoCfe = cfe.tipo_cfe
  const medioPago = MEDIOS_PAGO[cfe.medio_pago] || MEDIOS_PAGO['efectivo']
  const tipoDocReceptor = TIPOS_DOC_RECEPTOR[cfe.receptor_doc_tipo] || '2'
  const esBilateral = [111, 112, 113].includes(tipoCfe)
  const esNota = [102, 103, 112, 113].includes(tipoCfe)

  // ── Encabezado del CFE ────────────────────────────────────────────────────
  const encabezado = {
    IdDoc: {
      TipoCFE: tipoCfe,
      Serie: cfe.serie,
      Nro: cfe.numero,
      MntBruto: 1,          // 1 = los montos son netos (sin IVA)
      FchEmis: fmtDate(cfe.fecha_emision),
      FmaPago: medioPago.codigo,  // Obligatorio CFE v23-2
      ...(cfe.fecha_vencimiento ? { FchVenc: fmtDate(cfe.fecha_vencimiento) } : {}),
    },
    Emisor: {
      RUCEmisor: empresa.ruc,
      RznSoc: empresa.razon_social,
      ...(empresa.nombre_comercial ? { NomComercial: empresa.nombre_comercial } : {}),
      CdgDGISucur: '0',   // 0 = casa central
      DomFiscal: empresa.domicilio_fiscal || '',
      Ciudad: empresa.ciudad || '',
      Depto: empresa.departamento || 'Montevideo',
    },
  }

  // ── Receptor (solo para e-Factura y B2B) ──────────────────────────────────
  let receptor = null
  if (esBilateral && (cfe.receptor_doc || cfe.receptor_nombre)) {
    receptor = {
      TipoDocRecep: tipoDocReceptor,
      ...(cfe.receptor_doc ? { DocRecep: cfe.receptor_doc } : {}),
      RznSocRecep: cfe.receptor_nombre || '',
      ...(cfe.receptor_domicilio ? { DomRecep: cfe.receptor_domicilio } : {}),
    }
  }

  // ── Referencia (notas de crédito/débito) ──────────────────────────────────
  let referencia = null
  if (esNota && cfe.referencia_cfe_id) {
    referencia = {
      Referencia: {
        NroLinRef: 1,
        TpoDocRef: cfe.referencia_tipo_cfe || tipoCfe === 102 || tipoCfe === 103 ? 101 : 111,
        IndFact: 3,  // 3 = anula comprobante referenciado
        ...(cfe.referencia_serie ? { SerieRef: cfe.referencia_serie } : {}),
        NroRef: cfe.referencia_numero || 0,
        ...(cfe.referencia_motivo ? { CodRef: '1', DescuentoRef: cfe.referencia_motivo } : {}),
      },
    }
  }

  // ── Detalle (líneas) ──────────────────────────────────────────────────────
  const detalle = items.map((item, i) => ({
    Item: {
      NroLinDet: i + 1,
      NomItem: item.descripcion,
      ...(item.cantidad !== 1 ? { Cantidad: fmtNum(item.cantidad, 4) } : {}),
      PrecioUnitario: fmtNum(item.precio_unitario, 4),
      ...(item.descuento_pct > 0 ? {
        DescuentoPct: fmtNum(item.descuento_pct, 2),
        DescuentoMonto: fmtNum(item.monto_item * (item.descuento_pct / 100), 2),
      } : {}),
      MontoItem: fmtNum(item.monto_item, 2),
      ...(item.tasa_iva === 0 ? { IndFact: 1 } : { TasaImp: fmtNum(item.tasa_iva === 22 ? 1 : 2, 0) }),
    },
  }))

  // ── Totales ────────────────────────────────────────────────────────────────
  const totales = {
    TpoMoneda: cfe.moneda || 'UYU',
    ...(cfe.moneda !== 'UYU' ? { TpoCambio: fmtNum(cfe.tipo_cambio, 4) } : {}),
    MntNoGrav: fmtNum(cfe.monto_exento, 2),
    MntIVATasa1: fmtNum(cfe.monto_iva_10, 2),
    MntIVATasa2: fmtNum(cfe.monto_iva_22, 2),
    MntTotal: fmtNum(cfe.monto_total, 2),
    CantLinDet: items.length,
    MontoNF: fmtNum(cfe.monto_neto, 2),
  }

  // ── Construcción XML ───────────────────────────────────────────────────────
  const root = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('DGICFE', {
      'xmlns': 'http://cfe.dgi.gub.uy',
      'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
      'version': '23.2',
    })
    .ele('CFE', { version: '23.2' })
    .ele('Encabezado')

  // Encabezado
  addObj(root, { IdDoc: encabezado.IdDoc })
  addObj(root, { Emisor: encabezado.Emisor })
  if (receptor) addObj(root, { Receptor: receptor })
  root.up() // Cierra Encabezado

  // Detalle
  const det = root.ele('Detalle')
  detalle.forEach(d => addObj(det, d))
  det.up()

  // Totales
  addObj(root.ele('Totales'), totales)
  root.up()  // CFE
  root.up()  // DGICFE

  return root.end({ prettyPrint: false })
}

// Utilidad: convierte objeto a nodos XML recursivamente
function addObj(parent, obj) {
  for (const [key, val] of Object.entries(obj)) {
    if (val === null || val === undefined) continue
    if (typeof val === 'object' && !Array.isArray(val)) {
      const child = parent.ele(key)
      addObj(child, val)
      child.up()
    } else if (Array.isArray(val)) {
      val.forEach(v => {
        const child = parent.ele(key)
        if (typeof v === 'object') addObj(child, v)
        else child.txt(String(v))
        child.up()
      })
    } else {
      parent.ele(key).txt(String(val)).up()
    }
  }
}

module.exports = { buildCfe }

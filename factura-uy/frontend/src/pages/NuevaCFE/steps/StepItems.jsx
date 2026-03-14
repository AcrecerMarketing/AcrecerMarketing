import { useEffect } from 'react'

const newItem = () => ({ descripcion: '', cantidad: 1, precio_unitario: 0, tasa_iva: 22, descuento_pct: 0 })

function calcItem(item) {
  const tasa = { 22: 0.22, 10: 0.10, 0: 0 }[item.tasa_iva] ?? 0.22
  const bruto = item.precio_unitario * item.cantidad
  const desc = bruto * (item.descuento_pct / 100)
  const neto = Math.round((bruto - desc) * 100) / 100
  const iva = Math.round(neto * tasa * 100) / 100
  return { ...item, monto_item: neto, monto_iva_item: iva }
}

function calcTotales(items) {
  const calc = items.map(calcItem)
  const neto = calc.reduce((s, i) => s + i.monto_item, 0)
  const iva22 = calc.filter(i => i.tasa_iva === 22).reduce((s, i) => s + i.monto_iva_item, 0)
  const iva10 = calc.filter(i => i.tasa_iva === 10).reduce((s, i) => s + i.monto_iva_item, 0)
  const exento = calc.filter(i => i.tasa_iva === 0).reduce((s, i) => s + i.monto_item, 0)
  const total = Math.round((neto + iva22 + iva10) * 100) / 100
  return { monto_neto: Math.round(neto*100)/100, monto_iva_22: Math.round(iva22*100)/100, monto_iva_10: Math.round(iva10*100)/100, monto_exento: Math.round(exento*100)/100, monto_total: total, items: calc }
}

function fmt(n) { return Number(n||0).toLocaleString('es-UY', { minimumFractionDigits: 2 }) }

export default function StepItems({ form, update }) {
  const items = form.items.length ? form.items : [newItem()]

  useEffect(() => {
    if (!form.items.length) update({ items: [newItem()] })
  }, [])

  const setItems = (newItems) => {
    const totales = calcTotales(newItems)
    update(totales)
  }

  const addItem = () => setItems([...items, newItem()])
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i))
  const updateItem = (i, field, val) => {
    const newItems = items.map((it, idx) => idx === i ? { ...it, [field]: field === 'descripcion' ? val : +val } : it)
    setItems(newItems)
  }

  const totales = calcTotales(items)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>Líneas del comprobante</h3>
        <button className="btn btn-secondary btn-sm" onClick={addItem}>+ Agregar línea</button>
      </div>

      <div className="table-wrap" style={{ marginBottom: 12 }}>
        <table className="items-table">
          <thead>
            <tr>
              <th style={{ width: '35%' }}>Descripción</th>
              <th style={{ width: '8%' }}>Cant.</th>
              <th style={{ width: '14%' }}>Precio unit. (sin IVA)</th>
              <th style={{ width: '10%' }}>IVA %</th>
              <th style={{ width: '8%' }}>Desc. %</th>
              <th style={{ width: '13%' }}>Subtotal</th>
              <th style={{ width: '5%' }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const calc = calcItem(item)
              return (
                <tr key={i}>
                  <td><input value={item.descripcion} onChange={e => updateItem(i, 'descripcion', e.target.value)} placeholder="Descripción del producto o servicio" style={{ width: '100%' }} /></td>
                  <td><input type="number" min="0.01" step="0.01" value={item.cantidad} onChange={e => updateItem(i, 'cantidad', e.target.value)} style={{ width: 70 }} /></td>
                  <td><input type="number" min="0" step="0.01" value={item.precio_unitario} onChange={e => updateItem(i, 'precio_unitario', e.target.value)} style={{ width: 100 }} /></td>
                  <td>
                    <select value={item.tasa_iva} onChange={e => updateItem(i, 'tasa_iva', e.target.value)} style={{ width: 70 }}>
                      <option value={22}>22%</option>
                      <option value={10}>10%</option>
                      <option value={0}>Exento</option>
                    </select>
                  </td>
                  <td><input type="number" min="0" max="100" step="0.01" value={item.descuento_pct} onChange={e => updateItem(i, 'descuento_pct', e.target.value)} style={{ width: 60 }} /></td>
                  <td style={{ fontWeight: 600 }}>${fmt(calc.monto_item + calc.monto_iva_item)}</td>
                  <td>
                    {items.length > 1 && (
                      <button onClick={() => removeItem(i)} style={{ background: 'none', border: 'none', color: 'var(--err)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div className="items-totales">
        {totales.monto_iva_22 > 0 && <div className="total-line"><span style={{ color: 'var(--tm)' }}>Neto grabado 22%:</span><span>${fmt(totales.monto_neto - totales.monto_iva_10/0.1*1 + totales.monto_iva_22 - totales.monto_iva_22)}</span></div>}
        {totales.monto_iva_22 > 0 && <div className="total-line"><span style={{ color: 'var(--tm)' }}>IVA 22%:</span><span>${fmt(totales.monto_iva_22)}</span></div>}
        {totales.monto_iva_10 > 0 && <div className="total-line"><span style={{ color: 'var(--tm)' }}>IVA 10%:</span><span>${fmt(totales.monto_iva_10)}</span></div>}
        {totales.monto_exento > 0 && <div className="total-line"><span style={{ color: 'var(--tm)' }}>Exento:</span><span>${fmt(totales.monto_exento)}</span></div>}
        <div className="total-line total-final" style={{ marginTop: 8 }}>
          <span>TOTAL:</span><span>${fmt(totales.monto_total)}</span>
        </div>
      </div>
    </div>
  )
}

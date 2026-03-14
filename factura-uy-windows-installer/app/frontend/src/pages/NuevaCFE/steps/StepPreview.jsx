const CFE_NOMBRES = { 101:'e-Ticket',102:'NC Ticket',103:'ND Ticket',111:'e-Factura',112:'NC Factura',113:'ND Factura',124:'e-Remito',182:'e-Resguardo' }
function fmt(n) { return Number(n||0).toLocaleString('es-UY', { minimumFractionDigits: 2 }) }

export default function StepPreview({ form }) {
  const tipo = CFE_NOMBRES[form.tipo_cfe] || `Tipo ${form.tipo_cfe}`
  return (
    <div>
      <div className="alert alert-info" style={{ marginBottom: 16 }}>
        ℹ️ Revisá los datos antes de emitir. Una vez emitido, el comprobante queda registrado ante la DGI y no se puede modificar (solo anular con nota de crédito).
      </div>

      <div className="grid-2" style={{ gap: 16 }}>
        <div>
          <div className="card-title">Tipo de comprobante</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--p)', marginBottom: 4 }}>{tipo}</div>
          <div style={{ fontSize: 13, color: 'var(--tm)' }}>Serie {form.serie} | {form.fecha_emision}</div>
        </div>
        <div>
          <div className="card-title">Receptor</div>
          <div style={{ fontWeight: 600 }}>{form.receptor_nombre || 'Consumidor Final'}</div>
          {form.receptor_doc && <div style={{ fontSize: 13, color: 'var(--tm)' }}>{form.receptor_doc_tipo}: {form.receptor_doc}</div>}
          {form.receptor_email && <div style={{ fontSize: 13, color: 'var(--tm)' }}>✉️ {form.receptor_email}</div>}
        </div>
      </div>

      <div className="divider" />

      {/* Ítems */}
      <div className="card-title">Líneas del comprobante</div>
      <div className="table-wrap" style={{ marginBottom: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: 'var(--s2)' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 700, color: 'var(--tm)', fontSize: 11 }}>Descripción</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--tm)', fontSize: 11 }}>Cant.</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--tm)', fontSize: 11 }}>P. Unit.</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--tm)', fontSize: 11 }}>IVA</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: 'var(--tm)', fontSize: 11 }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {form.items.map((it, i) => (
              <tr key={i} style={{ borderTop: '1px solid var(--b)' }}>
                <td style={{ padding: '8px 12px' }}>{it.descripcion}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>{it.cantidad}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>${fmt(it.precio_unitario)}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>{it.tasa_iva === 0 ? 'Exento' : `${it.tasa_iva}%`}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>${fmt(it.monto_item + it.monto_iva_item)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totales */}
      <div style={{ textAlign: 'right', fontSize: 14, lineHeight: 2 }}>
        {form.monto_iva_22 > 0 && <div>IVA 22%: <strong>${fmt(form.monto_iva_22)}</strong></div>}
        {form.monto_iva_10 > 0 && <div>IVA 10%: <strong>${fmt(form.monto_iva_10)}</strong></div>}
        {form.monto_exento > 0 && <div>Exento: <strong>${fmt(form.monto_exento)}</strong></div>}
        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--p)', marginTop: 4 }}>
          TOTAL: ${fmt(form.monto_total)} {form.moneda}
        </div>
      </div>

      <div className="divider" />
      <div style={{ display: 'flex', gap: 16, fontSize: 13, color: 'var(--tm)', flexWrap: 'wrap' }}>
        <span>💳 Pago: {form.medio_pago}</span>
        <span>💱 Moneda: {form.moneda}</span>
        {form.fecha_vencimiento && <span>📅 Vence: {form.fecha_vencimiento}</span>}
      </div>
    </div>
  )
}

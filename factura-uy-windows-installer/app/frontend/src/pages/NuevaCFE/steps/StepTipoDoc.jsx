const TIPOS = [
  { codigo: 111, nombre: 'e-Factura', desc: 'Ventas a empresas (B2B)', icon: '📄', color: '#dbeafe' },
  { codigo: 101, nombre: 'e-Ticket', desc: 'Ventas a consumidor final', icon: '🎫', color: '#d1fae5' },
  { codigo: 112, nombre: 'NC e-Factura', desc: 'Nota de crédito (B2B)', icon: '↩️', color: '#fef3c7' },
  { codigo: 102, nombre: 'NC e-Ticket', desc: 'Nota de crédito (B2C)', icon: '↩️', color: '#fef3c7' },
  { codigo: 113, nombre: 'ND e-Factura', desc: 'Nota de débito (B2B)', icon: '↪️', color: '#fee2e2' },
  { codigo: 103, nombre: 'ND e-Ticket', desc: 'Nota de débito (B2C)', icon: '↪️', color: '#fee2e2' },
  { codigo: 124, nombre: 'e-Remito', desc: 'Traslado de mercadería', icon: '🚚', color: '#e0e7ff' },
  { codigo: 182, nombre: 'e-Resguardo', desc: 'Pagos a no-IVA', icon: '🛡️', color: '#f5f3ff' },
]

export default function StepTipoDoc({ form, update }) {
  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>¿Qué tipo de comprobante querés emitir?</h3>
      <div className="tipo-grid">
        {TIPOS.map(t => (
          <div key={t.codigo}
            className={`tipo-card${form.tipo_cfe === t.codigo ? ' selected' : ''}`}
            style={{ borderColor: form.tipo_cfe === t.codigo ? 'var(--p)' : 'var(--b)', background: form.tipo_cfe === t.codigo ? 'var(--pl)' : '#fff' }}
            onClick={() => update({ tipo_cfe: t.codigo })}>
            <div className="tipo-icon">{t.icon}</div>
            <div className="tipo-name">{t.nombre}</div>
            <div className="tipo-op">{t.desc}</div>
          </div>
        ))}
      </div>
      {form.tipo_cfe && (
        <div className="alert alert-info" style={{ marginTop: 16 }}>
          ✅ Seleccionaste: <strong>{TIPOS.find(t => t.codigo === form.tipo_cfe)?.nombre}</strong>
        </div>
      )}
    </div>
  )
}

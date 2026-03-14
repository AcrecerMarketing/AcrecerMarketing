import { useState, useEffect } from 'react'
import api from '../../../api/client'

export default function StepReceptor({ form, update }) {
  const [q, setQ] = useState('')
  const [clientes, setClientes] = useState([])
  const [searching, setSearching] = useState(false)
  const esB2B = [111, 112, 113].includes(form.tipo_cfe)
  const esTicket = [101, 102, 103].includes(form.tipo_cfe)

  useEffect(() => {
    if (!q || q.length < 2) { setClientes([]); return }
    const t = setTimeout(() => {
      setSearching(true)
      api.get('/clientes', { params: { q, limit: 8 } }).then(r => setClientes(r.rows || [])).finally(() => setSearching(false))
    }, 300)
    return () => clearTimeout(t)
  }, [q])

  const selectCliente = (c) => {
    update({
      cliente_id: c.id,
      receptor_nombre: c.razon_social,
      receptor_doc_tipo: c.tipo_doc,
      receptor_doc: c.documento,
      receptor_email: c.email || '',
      receptor_domicilio: c.domicilio || '',
    })
    setQ(c.razon_social)
    setClientes([])
  }

  if (esTicket) {
    return (
      <div>
        <div className="alert alert-info" style={{ marginBottom: 16 }}>
          ℹ️ Para <strong>e-Ticket</strong> el receptor es opcional (consumidor final anónimo).
        </div>
        <div className="form-row cols-2">
          <div className="form-group">
            <label>Nombre del receptor (opcional)</label>
            <input value={form.receptor_nombre} onChange={e => update({ receptor_nombre: e.target.value })} placeholder="Consumidor Final" />
          </div>
          <div className="form-group">
            <label>Email (opcional, para envío PDF)</label>
            <input type="email" value={form.receptor_email} onChange={e => update({ receptor_email: e.target.value })} placeholder="email@ejemplo.com" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Datos del receptor</h3>

      {/* Búsqueda de cliente */}
      <div className="form-group" style={{ position: 'relative' }}>
        <label>Buscar cliente existente</label>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Nombre o RUC del cliente…" />
        {searching && <div style={{ position: 'absolute', right: 12, top: 34, fontSize: 12, color: 'var(--tm)' }}>Buscando…</div>}
        {clientes.length > 0 && (
          <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1.5px solid var(--p)', borderRadius: 'var(--rs)', zIndex: 50, maxHeight: 200, overflowY: 'auto', boxShadow: 'var(--shm)' }}>
            {clientes.map(c => (
              <div key={c.id} onClick={() => selectCliente(c)}
                style={{ padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--b)', fontSize: 14 }}
                onMouseEnter={e => e.target.style.background = 'var(--pll)'}
                onMouseLeave={e => e.target.style.background = ''}>
                <strong>{c.razon_social}</strong>
                <span style={{ color: 'var(--tm)', marginLeft: 8, fontSize: 12 }}>{c.tipo_doc}: {c.documento}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="divider" />

      {/* Datos manuales */}
      <div className="form-row cols-2">
        <div className="form-group">
          <label>Razón social <span className="req">*</span></label>
          <input value={form.receptor_nombre} onChange={e => update({ receptor_nombre: e.target.value })} placeholder="Nombre o razón social" required />
        </div>
        <div className="form-group">
          <label>Tipo de documento</label>
          <select value={form.receptor_doc_tipo} onChange={e => update({ receptor_doc_tipo: e.target.value })}>
            <option value="RUT">RUT</option>
            <option value="CI">Cédula de Identidad</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="form-group">
          <label>Número de documento</label>
          <input value={form.receptor_doc} onChange={e => update({ receptor_doc: e.target.value })} placeholder="Ej: 210000000001" />
        </div>
        <div className="form-group">
          <label>Email (para envío del comprobante)</label>
          <input type="email" value={form.receptor_email} onChange={e => update({ receptor_email: e.target.value })} placeholder="email@empresa.com" />
        </div>
        <div className="form-group" style={{ gridColumn: '1/-1' }}>
          <label>Domicilio</label>
          <input value={form.receptor_domicilio} onChange={e => update({ receptor_domicilio: e.target.value })} placeholder="Dirección del receptor" />
        </div>
      </div>
    </div>
  )
}

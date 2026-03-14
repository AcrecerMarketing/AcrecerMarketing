import { useEffect, useState } from 'react'
import api from '../../api/client'
import { useToast } from '../../context/ToastContext'

const TIPO_LABEL = { cliente:'Cliente', proveedor:'Proveedor', ambos:'Cliente/Proveedor' }

function Modal({ title, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={e => e.target.className.includes('overlay') && onClose()}>
      <div className="modal">
        <div className="modal-title">{title}</div>
        {children}
      </div>
    </div>
  )
}

function ClienteForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({ tipo:'cliente', tipo_doc:'RUT', documento:'', razon_social:'', nombre_comercial:'', domicilio:'', ciudad:'', departamento:'', pais:'UY', email:'', telefono:'', exento_iva:false, notas:'', ...initial })
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.razon_social) { toast('Razón social requerida', 'err'); return }
    await onSave(form)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row cols-2">
        <div className="form-group">
          <label>Razón social <span className="req">*</span></label>
          <input value={form.razon_social} onChange={e => upd('razon_social', e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Nombre comercial</label>
          <input value={form.nombre_comercial} onChange={e => upd('nombre_comercial', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Tipo</label>
          <select value={form.tipo} onChange={e => upd('tipo', e.target.value)}>
            <option value="cliente">Cliente</option>
            <option value="proveedor">Proveedor</option>
            <option value="ambos">Ambos</option>
          </select>
        </div>
        <div className="form-group">
          <label>Tipo de documento</label>
          <select value={form.tipo_doc} onChange={e => upd('tipo_doc', e.target.value)}>
            <option value="RUT">RUT</option>
            <option value="CI">Cédula de Identidad</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div className="form-group">
          <label>Número de documento</label>
          <input value={form.documento} onChange={e => upd('documento', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={form.email} onChange={e => upd('email', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Teléfono</label>
          <input value={form.telefono} onChange={e => upd('telefono', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Domicilio</label>
          <input value={form.domicilio} onChange={e => upd('domicilio', e.target.value)} />
        </div>
        <div className="form-group">
          <label><input type="checkbox" checked={form.exento_iva} onChange={e => upd('exento_iva', e.target.checked)} style={{ width:'auto', marginRight:6 }} />Exento de IVA</label>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Guardar</button>
      </div>
    </form>
  )
}

export default function ClientesPage() {
  const toast = useToast()
  const [data, setData] = useState({ rows: [], total: 0 })
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const load = (query = '') => {
    setLoading(true)
    api.get('/clientes', { params: query ? { q: query } : {} }).then(setData).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const t = setTimeout(() => load(q), 300)
    return () => clearTimeout(t)
  }, [q])

  const handleSave = async (form) => {
    try {
      if (editing?.id) await api.put(`/clientes/${editing.id}`, form)
      else await api.post('/clientes', form)
      toast(`Cliente ${editing?.id ? 'actualizado' : 'creado'} correctamente`, 'ok')
      setModalOpen(false); setEditing(null); load(q)
    } catch (e) { toast(`Error: ${e.error || 'No se pudo guardar'}`, 'err') }
  }

  const handleDelete = async (c) => {
    if (!confirm(`¿Eliminar a ${c.razon_social}?`)) return
    try { await api.delete(`/clientes/${c.id}`); toast('Cliente eliminado', 'info'); load(q) }
    catch (e) { toast(`Error: ${e.error || 'No se pudo eliminar'}`, 'err') }
  }

  return (
    <div>
      <div className="topbar">
        <h2>Clientes y Proveedores</h2>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setModalOpen(true) }}>+ Nuevo</button>
      </div>
      <div className="page">
        <div className="card" style={{ marginBottom: 16 }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre, RUC…" />
        </div>

        {loading ? <div className="spinner" /> : data.rows.length === 0 ? (
          <div className="empty-state">
            <div className="icon">👥</div>
            <h3>Sin clientes</h3>
            <p>Agregá clientes para autocompletar receptor al emitir CFE.</p>
            <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={() => { setEditing(null); setModalOpen(true) }}>+ Agregar cliente</button>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Razón social</th><th>Documento</th><th>Tipo</th><th>Email</th><th></th></tr></thead>
              <tbody>
                {data.rows.map(c => (
                  <tr key={c.id}>
                    <td><div style={{ fontWeight: 600 }}>{c.razon_social}</div>{c.nombre_comercial && <div style={{ fontSize:12, color:'var(--tm)' }}>{c.nombre_comercial}</div>}</td>
                    <td className="td-mono">{c.tipo_doc}: {c.documento || '-'}</td>
                    <td><span className="badge badge-blue">{TIPO_LABEL[c.tipo]}</span></td>
                    <td className="td-muted">{c.email || '-'}</td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditing(c); setModalOpen(true) }}>Editar</button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c)}>×</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing?.id ? 'Editar cliente' : 'Nuevo cliente'} onClose={() => { setModalOpen(false); setEditing(null) }}>
          <ClienteForm initial={editing || {}} onSave={handleSave} onCancel={() => { setModalOpen(false); setEditing(null) }} />
        </Modal>
      )}
    </div>
  )
}

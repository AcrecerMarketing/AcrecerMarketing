import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/client'

const CFE_N = { 101:'e-Ticket',102:'NC Ticket',103:'ND Ticket',111:'e-Factura',112:'NC Factura',113:'ND Factura',124:'e-Remito',182:'e-Resguardo' }
const ESTADO_CLASS = { emitido:'badge-ok', borrador:'badge-gray', rechazado:'badge-err', anulado:'badge-warn' }

function fmt(n) { return Number(n||0).toLocaleString('es-UY', { minimumFractionDigits: 2 }) }

export default function HistorialPage() {
  const [data, setData] = useState({ rows: [], total: 0 })
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ tipo_cfe: '', estado: '', fecha_desde: '', fecha_hasta: '', page: 1 })

  useEffect(() => {
    setLoading(true)
    const params = Object.fromEntries(Object.entries(filters).filter(([,v]) => v))
    api.get('/cfe', { params }).then(setData).catch(console.error).finally(() => setLoading(false))
  }, [filters])

  const setF = (k, v) => setFilters(f => ({ ...f, [k]: v, page: 1 }))

  return (
    <div>
      <div className="topbar">
        <h2>Historial de CFE</h2>
        <Link to="/nueva" className="btn btn-primary">+ Nueva CFE</Link>
      </div>
      <div className="page">
        {/* Filtros */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="form-row cols-3" style={{ gap: 10 }}>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Tipo de comprobante</label>
              <select value={filters.tipo_cfe} onChange={e => setF('tipo_cfe', e.target.value)}>
                <option value="">Todos</option>
                {Object.entries(CFE_N).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Estado</label>
              <select value={filters.estado} onChange={e => setF('estado', e.target.value)}>
                <option value="">Todos</option>
                <option value="borrador">Borrador</option>
                <option value="emitido">Emitido</option>
                <option value="rechazado">Rechazado</option>
                <option value="anulado">Anulado</option>
              </select>
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Fecha desde</label>
              <input type="date" value={filters.fecha_desde} onChange={e => setF('fecha_desde', e.target.value)} />
            </div>
            <div className="form-group" style={{ margin: 0 }}>
              <label>Fecha hasta</label>
              <input type="date" value={filters.fecha_hasta} onChange={e => setF('fecha_hasta', e.target.value)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', marginBottom: 14 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setFilters({ tipo_cfe:'', estado:'', fecha_desde:'', fecha_hasta:'', page:1 })}>
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {loading ? <div className="spinner" /> : (
          <>
            <div style={{ fontSize: 13, color: 'var(--tm)', marginBottom: 10 }}>{data.total} comprobante{data.total !== 1 ? 's' : ''} encontrado{data.total !== 1 ? 's' : ''}</div>
            {data.rows.length === 0 ? (
              <div className="empty-state">
                <div className="icon">📋</div>
                <h3>Sin comprobantes</h3>
                <p>Aún no emitiste ningún comprobante electrónico.<br/>Hacé clic en "Nueva CFE" para comenzar.</p>
                <Link to="/nueva" className="btn btn-primary" style={{ marginTop: 16 }}>+ Nueva CFE</Link>
              </div>
            ) : (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Número</th>
                      <th>Tipo</th>
                      <th>Receptor</th>
                      <th>Fecha</th>
                      <th>Total</th>
                      <th>Estado</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.rows.map(cfe => (
                      <tr key={cfe.id}>
                        <td className="td-mono">{cfe.numero ? `${cfe.serie}-${String(cfe.numero).padStart(7,'0')}` : '-'}</td>
                        <td>{CFE_N[cfe.tipo_cfe]||`Tipo ${cfe.tipo_cfe}`}</td>
                        <td>{cfe.cliente_nombre || cfe.receptor_nombre || 'Consumidor Final'}</td>
                        <td className="td-muted">{cfe.fecha_emision}</td>
                        <td style={{ fontWeight: 600 }}>$ {fmt(cfe.monto_total)}</td>
                        <td><span className={`badge ${ESTADO_CLASS[cfe.estado]||'badge-gray'}`}>{cfe.estado}</span></td>
                        <td>
                          <Link to={`/historial/${cfe.id}`} className="btn btn-secondary btn-sm">Ver</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Paginación */}
            {data.total > 50 && (
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
                <button className="btn btn-secondary btn-sm" disabled={filters.page <= 1} onClick={() => setF('page', filters.page - 1)}>← Anterior</button>
                <span style={{ padding: '6px 12px', fontSize: 13, color: 'var(--tm)' }}>Página {filters.page}</span>
                <button className="btn btn-secondary btn-sm" disabled={filters.page * 50 >= data.total} onClick={() => setF('page', filters.page + 1)}>Siguiente →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

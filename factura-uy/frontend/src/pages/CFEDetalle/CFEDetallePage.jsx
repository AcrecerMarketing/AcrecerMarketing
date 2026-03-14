import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import api from '../../api/client'
import { useToast } from '../../context/ToastContext'

const CFE_N = { 101:'e-Ticket',102:'NC Ticket',103:'ND Ticket',111:'e-Factura',112:'NC Factura',113:'ND Factura',124:'e-Remito',182:'e-Resguardo' }
const ESTADO_CLASS = { emitido:'badge-ok', borrador:'badge-gray', rechazado:'badge-err', anulado:'badge-warn' }
function fmt(n) { return Number(n||0).toLocaleString('es-UY', { minimumFractionDigits: 2 }) }

export default function CFEDetallePage() {
  const { id } = useParams()
  const nav = useNavigate()
  const toast = useToast()
  const [cfe, setCfe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [emailInput, setEmailInput] = useState('')
  const [sendingEmail, setSendingEmail] = useState(false)
  const [emitting, setEmitting] = useState(false)

  useEffect(() => {
    api.get(`/cfe/${id}`).then(data => { setCfe(data); setEmailInput(data.receptor_email || '') }).catch(() => nav('/historial')).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="spinner" />
  if (!cfe) return null

  const pdfUrl = `/api/pdf/${id}`
  const xmlUrl = `/api/pdf/${id}/xml`

  const handleEmitir = async () => {
    setEmitting(true)
    try {
      const result = await api.post(`/cfe/${id}/emitir`)
      setCfe({ ...result, items: cfe.items })
      toast(result.estado === 'emitido' ? '✅ CFE emitido correctamente' : '❌ Rechazado por DGI: ' + result.dgi_response_msg, result.estado === 'emitido' ? 'ok' : 'err')
    } catch (e) { toast(`Error: ${e.error || 'No se pudo emitir'}`, 'err') }
    finally { setEmitting(false) }
  }

  const handleSendEmail = async () => {
    setSendingEmail(true)
    try {
      await api.post(`/email/${id}`, { email: emailInput })
      toast('✅ Email enviado a ' + emailInput, 'ok')
    } catch (e) { toast(`Error: ${e.error || 'No se pudo enviar'}`, 'err') }
    finally { setSendingEmail(false) }
  }

  const handleAnular = async () => {
    if (!confirm('¿Confirmás la anulación? Esta acción no se puede deshacer.')) return
    try {
      const result = await api.post(`/cfe/${id}/anular`)
      setCfe({ ...result, items: cfe.items })
      toast('Comprobante anulado', 'info')
    } catch (e) { toast(`Error: ${e.error || 'No se pudo anular'}`, 'err') }
  }

  const docNum = cfe.numero ? `${cfe.serie}-${String(cfe.numero).padStart(7,'0')}` : 'Borrador'

  return (
    <div>
      <div className="topbar">
        <div>
          <Link to="/historial" style={{ color:'var(--tm)', fontSize:13, textDecoration:'none' }}>← Historial</Link>
          <h2 style={{ marginTop:4 }}>{CFE_N[cfe.tipo_cfe]||`Tipo ${cfe.tipo_cfe}`} — {docNum}</h2>
        </div>
        <div className="topbar-actions">
          <span className={`badge ${ESTADO_CLASS[cfe.estado]||'badge-gray'}`} style={{ fontSize:13, padding:'6px 14px' }}>{cfe.estado}</span>
          {cfe.estado === 'borrador' && (
            <button className="btn btn-primary" onClick={handleEmitir} disabled={emitting}>
              {emitting ? 'Emitiendo…' : '🚀 Emitir'}
            </button>
          )}
          {cfe.estado === 'emitido' && (
            <>
              <a href={pdfUrl} target="_blank" rel="noreferrer" className="btn btn-secondary">📄 Ver PDF</a>
              <a href={xmlUrl} download className="btn btn-secondary">⬇️ XML</a>
              <button className="btn btn-danger btn-sm" onClick={handleAnular}>Anular</button>
            </>
          )}
        </div>
      </div>

      <div className="page">
        {cfe.dgi_response_msg && (
          <div className={`alert ${cfe.estado === 'rechazado' ? 'alert-err' : 'alert-ok'}`} style={{ marginBottom: 16 }}>
            {cfe.estado === 'rechazado' ? '❌' : 'ℹ️'} <strong>DGI:</strong> {cfe.dgi_response_msg}
          </div>
        )}

        <div className="grid-2" style={{ marginBottom: 16 }}>
          {/* Emisor / Receptor */}
          <div className="card">
            <div className="card-title">Receptor</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{cfe.receptor_nombre || 'Consumidor Final'}</div>
            {cfe.receptor_doc && <div style={{ color:'var(--tm)', fontSize:13, marginTop:4 }}>{cfe.receptor_doc_tipo}: {cfe.receptor_doc}</div>}
            {cfe.receptor_email && <div style={{ color:'var(--tm)', fontSize:13 }}>✉️ {cfe.receptor_email}</div>}
            {cfe.receptor_domicilio && <div style={{ color:'var(--tm)', fontSize:13 }}>📍 {cfe.receptor_domicilio}</div>}
          </div>
          <div className="card">
            <div className="card-title">Detalles</div>
            {[
              ['Fecha emisión', cfe.fecha_emision],
              ['Fecha vencimiento', cfe.fecha_vencimiento || '-'],
              ['Moneda', cfe.moneda],
              ['Medio de pago', cfe.medio_pago],
              ['CAE ID', cfe.cae_id || '-'],
            ].map(([k,v]) => (
              <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6 }}>
                <span style={{ color:'var(--tm)' }}>{k}:</span>
                <span style={{ fontWeight:600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ítems */}
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-title">Líneas del comprobante</div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th style={{textAlign:'right'}}>Cant.</th>
                  <th style={{textAlign:'right'}}>P. Unit.</th>
                  <th style={{textAlign:'right'}}>IVA</th>
                  <th style={{textAlign:'right'}}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {(cfe.items||[]).map((it,i) => (
                  <tr key={i}>
                    <td>{it.descripcion}</td>
                    <td style={{textAlign:'right'}}>{it.cantidad}</td>
                    <td style={{textAlign:'right'}}>${fmt(it.precio_unitario)}</td>
                    <td style={{textAlign:'right'}}>{it.tasa_iva === 0 ? 'Exento' : `${it.tasa_iva}%`}</td>
                    <td style={{textAlign:'right', fontWeight:600}}>${fmt(it.monto_item + it.monto_iva_item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ textAlign:'right', marginTop:12, lineHeight:1.9, fontSize:14 }}>
            {cfe.monto_iva_22 > 0 && <div>IVA 22%: <strong>${fmt(cfe.monto_iva_22)}</strong></div>}
            {cfe.monto_iva_10 > 0 && <div>IVA 10%: <strong>${fmt(cfe.monto_iva_10)}</strong></div>}
            {cfe.monto_exento > 0 && <div>Exento: <strong>${fmt(cfe.monto_exento)}</strong></div>}
            <div style={{ fontSize:18, fontWeight:800, color:'var(--p)', marginTop:4 }}>TOTAL: ${fmt(cfe.monto_total)} {cfe.moneda}</div>
          </div>
        </div>

        {/* Envío por email */}
        {cfe.estado === 'emitido' && (
          <div className="card">
            <div className="card-title">Enviar PDF por email</div>
            <div style={{ display:'flex', gap:10 }}>
              <input value={emailInput} onChange={e => setEmailInput(e.target.value)} type="email" placeholder="email@receptor.com" style={{ flex:1 }} />
              <button className="btn btn-primary" onClick={handleSendEmail} disabled={!emailInput || sendingEmail}>
                {sendingEmail ? 'Enviando…' : '📧 Enviar'}
              </button>
            </div>
            {cfe.enviado_email ? <div style={{ fontSize:12, color:'var(--ok)', marginTop:6 }}>✓ Email ya enviado anteriormente</div> : null}
          </div>
        )}
      </div>
    </div>
  )
}

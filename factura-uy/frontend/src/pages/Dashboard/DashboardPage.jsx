import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/client'

const CFE_NOMBRES = { 101:'e-Ticket',102:'NC Ticket',103:'ND Ticket',111:'e-Factura',112:'NC Factura',113:'ND Factura',124:'e-Remito',182:'e-Resguardo' }
const ESTADOS_COLOR = { emitido:'badge-ok', borrador:'badge-gray', rechazado:'badge-err', anulado:'badge-warn' }

function fmt(n) { return Number(n||0).toLocaleString('es-UY',{minimumFractionDigits:2}) }

export default function DashboardPage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/stats').then(setData).catch(console.error).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="spinner" />

  const { totales = {}, porTipo = [], alertas = [], mes, anio } = data || {}

  // Donut SVG simple
  const chartData = porTipo.filter(t => t.total > 0)
  const totalChart = chartData.reduce((s,c) => s+c.total, 0)
  const COLORS = ['#2563eb','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#06b6d4','#84cc16']
  let offset = 0
  const R = 60, CIRC = 2*Math.PI*R

  return (
    <div>
      <div className="topbar">
        <h2>Dashboard</h2>
        <div className="topbar-actions">
          <Link to="/nueva" className="btn btn-primary">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nueva CFE
          </Link>
        </div>
      </div>

      <div className="page">
        {/* Alertas */}
        {alertas.map((a, i) => (
          <div key={i} className={`alert alert-${a.tipo==='danger'?'err':a.tipo==='warning'?'warn':a.tipo}`}>
            <span>{a.tipo==='danger'?'🔴':a.tipo==='warning'?'⚠️':'ℹ️'}</span>
            <span>{a.mensaje}</span>
          </div>
        ))}

        {/* Stats */}
        <div className="stats-grid">
          {[
            { label: 'Facturado este mes', value: `$${fmt(totales.facturado)}`, sub: `${totales.emitidos||0} comprobantes emitidos`, color: 'var(--p)' },
            { label: 'IVA del mes', value: `$${fmt(totales.iva_total)}`, sub: 'Total IVA a declarar', color: 'var(--ok)' },
            { label: 'Borradores', value: totales.borradores||0, sub: 'Pendientes de emitir', color: 'var(--warn)' },
            { label: 'Rechazados DGI', value: totales.rechazados||0, sub: 'Requieren corrección', color: 'var(--err)' },
          ].map((s, i) => (
            <div key={i} className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Gráfico + tabla por tipo */}
        <div className="grid-2">
          <div className="card">
            <div className="card-title">Distribución por tipo — {['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'][(mes||1)-1]} {anio}</div>
            {chartData.length === 0 ? (
              <div className="empty-state" style={{padding:'20px 0'}}>
                <div className="icon">📊</div>
                <p>Sin datos este mes</p>
              </div>
            ) : (
              <div style={{display:'flex',alignItems:'center',gap:20,flexWrap:'wrap'}}>
                <svg width="140" height="140" viewBox="0 0 140 140">
                  {chartData.map((c, i) => {
                    const len = (c.total/totalChart)*CIRC
                    const seg = <circle key={i} cx="70" cy="70" r={R} fill="none" stroke={COLORS[i%COLORS.length]}
                      strokeWidth="22" strokeDasharray={`${len} ${CIRC-len}`}
                      strokeDashoffset={-offset} style={{transformOrigin:'70px 70px',transform:'rotate(-90deg)'}}/>
                    offset += len; return seg
                  })}
                </svg>
                <div style={{fontSize:12,lineHeight:1.9}}>
                  {chartData.map((c,i) => (
                    <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:10,height:10,borderRadius:'50%',background:COLORS[i%COLORS.length],flexShrink:0}}/>
                      <span style={{color:'var(--tm)'}}>{CFE_NOMBRES[c.tipo_cfe]||`Tipo ${c.tipo_cfe}`}</span>
                      <strong>${fmt(c.total)}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <div className="card-title">Acceso rápido</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[
                { to:'/nueva', label:'Emitir e-Factura', icon:'📄', desc:'Para ventas a empresas (B2B)' },
                { to:'/nueva', label:'Emitir e-Ticket', icon:'🎫', desc:'Para ventas a consumidor final' },
                { to:'/historial', label:'Ver historial completo', icon:'📋', desc:'Todos los comprobantes' },
                { to:'/clientes', label:'Directorio de clientes', icon:'👥', desc:'Gestionar clientes y proveedores' },
                { to:'/configuracion', label:'Configuración', icon:'⚙️', desc:'Empresa, certificado, CAE' },
              ].map((item, i) => (
                <Link key={i} to={item.to} style={{display:'flex',alignItems:'center',gap:12,padding:'10px 12px',
                  borderRadius:'var(--rs)',border:'1px solid var(--b)',textDecoration:'none',color:'var(--t)',
                  background:'var(--s2)',transition:'all .15s'}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor='var(--p)'}
                  onMouseLeave={e=>e.currentTarget.style.borderColor='var(--b)'}>
                  <span style={{fontSize:22}}>{item.icon}</span>
                  <div>
                    <div style={{fontWeight:600,fontSize:14}}>{item.label}</div>
                    <div style={{fontSize:12,color:'var(--tm)'}}>{item.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

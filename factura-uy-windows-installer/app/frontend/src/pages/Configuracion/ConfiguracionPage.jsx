import { useEffect, useState } from 'react'
import api from '../../api/client'
import { useToast } from '../../context/ToastContext'

const TABS = ['🏢 Empresa', '📜 Certificado', '🔑 CAE', '📧 Email', '⚙️ Ambiente']

export default function ConfiguracionPage() {
  const toast = useToast()
  const [tab, setTab] = useState(0)
  const [empresa, setEmpresa] = useState(null)
  const [cert, setCert] = useState(null)
  const [caes, setCaes] = useState([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api.get('/empresa').then(setEmpresa).catch(() => {})
    api.get('/certificados/estado').then(setCert).catch(() => {})
    api.get('/cae').then(setCaes).catch(() => {})
  }, [])

  const saveEmpresa = async (data) => {
    setSaving(true)
    try { const r = await api.put('/empresa', data); setEmpresa(r); toast('Configuración guardada', 'ok') }
    catch (e) { toast(`Error: ${e.error || 'No se pudo guardar'}`, 'err') }
    finally { setSaving(false) }
  }

  return (
    <div>
      <div className="topbar"><h2>Configuración</h2></div>
      <div className="page">
        {/* Tabs */}
        <div style={{ display:'flex', gap:0, marginBottom:20, border:'1px solid var(--b)', borderRadius:'var(--r)', overflow:'hidden', background:'var(--s)' }}>
          {TABS.map((t,i) => (
            <button key={i} onClick={() => setTab(i)} style={{ flex:1, padding:'11px 8px', border:'none', borderRight: i<TABS.length-1?'1px solid var(--b)':'none', background: i===tab?'var(--p)':'transparent', color: i===tab?'#fff':'var(--tm)', fontWeight: i===tab?700:500, fontSize:13, cursor:'pointer', fontFamily:'inherit' }}>{t}</button>
          ))}
        </div>

        {/* Tab Empresa */}
        {tab === 0 && empresa && (
          <div className="card">
            <h3 style={{ marginBottom:16, fontWeight:700 }}>Datos de la empresa</h3>
            <EmpresaForm data={empresa} onSave={saveEmpresa} saving={saving} />
          </div>
        )}

        {/* Tab Certificado */}
        {tab === 1 && (
          <div className="card">
            <h3 style={{ marginBottom:16, fontWeight:700 }}>Certificado digital X.509</h3>
            <CertTab cert={cert} onRefresh={() => api.get('/certificados/estado').then(setCert)} toast={toast} />
          </div>
        )}

        {/* Tab CAE */}
        {tab === 2 && (
          <div className="card">
            <h3 style={{ marginBottom:16, fontWeight:700 }}>Rangos CAE (Constancias de Autorización de Emisión)</h3>
            <CaeTab caes={caes} onRefresh={() => api.get('/cae').then(setCaes)} empresa={empresa} toast={toast} />
          </div>
        )}

        {/* Tab Email */}
        {tab === 3 && empresa && (
          <div className="card">
            <h3 style={{ marginBottom:16, fontWeight:700 }}>Configuración de email</h3>
            <EmailTab data={empresa} onSave={saveEmpresa} saving={saving} />
          </div>
        )}

        {/* Tab Ambiente */}
        {tab === 4 && empresa && (
          <div className="card">
            <h3 style={{ marginBottom:16, fontWeight:700 }}>Ambiente DGI</h3>
            <AmbienteTab data={empresa} onSave={saveEmpresa} saving={saving} />
          </div>
        )}
      </div>
    </div>
  )
}

function EmpresaForm({ data, onSave, saving }) {
  const [form, setForm] = useState(data)
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }}>
      <div className="form-row cols-2">
        {[
          ['ruc', 'RUC (12 dígitos)', 'text'],
          ['razon_social', 'Razón social', 'text'],
          ['nombre_comercial', 'Nombre comercial', 'text'],
          ['domicilio_fiscal', 'Domicilio fiscal', 'text'],
          ['ciudad', 'Ciudad', 'text'],
          ['departamento', 'Departamento', 'text'],
          ['codigo_actividad', 'Código de actividad DGI', 'text'],
          ['email_empresa', 'Email de la empresa', 'email'],
          ['telefono', 'Teléfono', 'tel'],
        ].map(([k, l, t]) => (
          <div key={k} className="form-group">
            <label>{l}</label>
            <input type={t} value={form[k]||''} onChange={e => upd(k, e.target.value)} />
          </div>
        ))}
      </div>
      <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar cambios'}</button>
    </form>
  )
}

function CertTab({ cert, onRefresh, toast }) {
  const [file, setFile] = useState(null)
  const [pass, setPass] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) { toast('Seleccioná un archivo .p12', 'err'); return }
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('certificado', file)
      fd.append('password', pass)
      await api.post('/certificados', fd)
      toast('✅ Certificado importado correctamente', 'ok')
      onRefresh()
    } catch (err) { toast(`Error: ${err.error || 'No se pudo importar el certificado'}`, 'err') }
    finally { setUploading(false) }
  }

  return (
    <div>
      {cert?.activo ? (
        <div className={`alert ${cert.vencido?'alert-err':cert.por_vencer?'alert-warn':'alert-ok'}`} style={{ marginBottom:20 }}>
          {cert.vencido ? '🔴' : cert.por_vencer ? '⚠️' : '✅'}
          <div>
            <strong>{cert.subject_cn}</strong><br/>
            Válido: {cert.not_before?.slice(0,10)} — {cert.not_after?.slice(0,10)}<br/>
            {cert.vencido ? <strong>VENCIDO</strong> : `${cert.dias_restantes} días restantes`}
          </div>
        </div>
      ) : (
        <div className="alert alert-err" style={{ marginBottom:20 }}>🔴 Sin certificado digital activo. Subí tu archivo .p12 obtenido en ABITAB/Correos.</div>
      )}

      <form onSubmit={handleUpload}>
        <div className="form-group">
          <label>Archivo .p12 (certificado digital)</label>
          <input type="file" accept=".p12,.pfx" onChange={e => setFile(e.target.files[0])} style={{ width:'auto' }} />
        </div>
        <div className="form-group">
          <label>Contraseña del .p12 (si tiene)</label>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Dejar vacío si no tiene contraseña" />
        </div>
        <button className="btn btn-primary" type="submit" disabled={uploading}>{uploading ? 'Importando…' : 'Importar certificado'}</button>
      </form>

      <div style={{ marginTop:20, padding:16, background:'var(--pll)', borderRadius:'var(--rs)', fontSize:13 }}>
        <strong>¿Dónde obtengo el certificado?</strong><br/>
        El certificado X.509 para facturación electrónica se obtiene en:
        <ul style={{ marginTop:8, paddingLeft:20, lineHeight:2 }}>
          <li><a href="https://iddigital.com.uy" target="_blank" rel="noreferrer">ABITAB — ID Digital (iddigital.com.uy)</a></li>
          <li>Correos Uruguay</li>
          <li>ANTEL</li>
        </ul>
        Pedí un certificado de <strong>empresa</strong> para facturación electrónica. Costo aprox. USD 50-100/año.
      </div>
    </div>
  )
}

function CaeTab({ caes, onRefresh, empresa, toast }) {
  const [tipo, setTipo] = useState(111)
  const [loading, setLoading] = useState(false)
  const TIPOS = { 101:'e-Ticket', 102:'NC Ticket', 103:'ND Ticket', 111:'e-Factura', 112:'NC Factura', 113:'ND Factura', 124:'e-Remito', 182:'e-Resguardo' }
  const isMock = empresa?.ambiente === 'mock'

  const solicitarCae = async () => {
    setLoading(true)
    try {
      await api.post('/cae/solicitar', { tipo_cfe: tipo, serie:'A', cantidad:200 })
      toast('CAE solicitado correctamente', 'ok')
      onRefresh()
    } catch (e) { toast(`Error: ${e.error || 'No se pudo solicitar CAE'}`, 'err') }
    finally { setLoading(false) }
  }

  return (
    <div>
      {isMock && <div className="alert alert-warn" style={{ marginBottom:16 }}>⚠️ En modo simulador los CAE se generan localmente. Para CAE reales, cambiá a modo Homologación o Producción.</div>}

      <div style={{ display:'flex', gap:10, marginBottom:20, alignItems:'flex-end' }}>
        <div className="form-group" style={{ margin:0, flex:1 }}>
          <label>Tipo de comprobante</label>
          <select value={tipo} onChange={e => setTipo(+e.target.value)}>
            {Object.entries(TIPOS).map(([k,v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={solicitarCae} disabled={loading}>{loading ? 'Solicitando…' : `Solicitar CAE${isMock?' (simulador)':''}`}</button>
      </div>

      {caes.length === 0 ? (
        <div className="alert alert-warn">Sin rangos CAE. Solicitá al menos uno para e-Ticket (101) y e-Factura (111).</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Tipo</th><th>Serie</th><th>Rango</th><th>Próximo</th><th>Vencimiento</th><th>Estado</th></tr></thead>
            <tbody>
              {caes.map(c => (
                <tr key={c.id}>
                  <td>{TIPOS[c.tipo_cfe]||`Tipo ${c.tipo_cfe}`}</td>
                  <td className="td-mono">{c.serie}</td>
                  <td className="td-mono">{c.numero_desde} — {c.numero_hasta}</td>
                  <td className="td-mono" style={{ fontWeight:600 }}>{c.numero_siguiente}</td>
                  <td className="td-muted">{c.fecha_vencimiento}</td>
                  <td><span className={`badge ${c.estado==='activo'?'badge-ok':c.estado==='agotado'?'badge-warn':'badge-err'}`}>{c.estado}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function EmailTab({ data, onSave, saving }) {
  const [form, setForm] = useState({ smtp_host: data.smtp_host||'', smtp_port: data.smtp_port||587, smtp_user: data.smtp_user||'', smtp_from: data.smtp_from||'' })
  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }}>
      <div className="alert alert-info" style={{ marginBottom:16 }}>ℹ️ Configuración SMTP para envío de PDF por email. Podés usar Gmail (smtp.gmail.com:587) con una contraseña de aplicación.</div>
      <div className="form-row cols-2">
        <div className="form-group">
          <label>Servidor SMTP</label>
          <input value={form.smtp_host} onChange={e => upd('smtp_host', e.target.value)} placeholder="smtp.gmail.com" />
        </div>
        <div className="form-group">
          <label>Puerto</label>
          <input type="number" value={form.smtp_port} onChange={e => upd('smtp_port', +e.target.value)} />
        </div>
        <div className="form-group">
          <label>Usuario SMTP</label>
          <input value={form.smtp_user} onChange={e => upd('smtp_user', e.target.value)} placeholder="tu@email.com" />
        </div>
        <div className="form-group">
          <label>Email de origen (From)</label>
          <input value={form.smtp_from} onChange={e => upd('smtp_from', e.target.value)} placeholder="Tu Empresa &lt;noreply@empresa.com&gt;" />
        </div>
      </div>
      <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar'}</button>
    </form>
  )
}

function AmbienteTab({ data, onSave, saving }) {
  const [amb, setAmb] = useState(data.ambiente || 'mock')
  const [dgiUser, setDgiUser] = useState(data.dgi_usuario || '')
  const INFO = {
    mock: { color:'#fef3c7', label:'🟡 Modo Simulador', desc:'Los CFE se generan localmente y NO se envían a DGI. Ideal para probar el sistema sin credenciales reales.' },
    homologacion: { color:'#e0e7ff', label:'🔵 Homologación DGI', desc:'Ambiente de pruebas oficial de DGI. Los CFE se envían a DGI pero NO tienen validez fiscal. Requiere credenciales DGI.' },
    produccion: { color:'#d1fae5', label:'🟢 Producción DGI', desc:'Ambiente real. Los CFE emitidos tienen validez fiscal plena. Solo activar cuando todo esté homologado.' },
  }
  const info = INFO[amb]

  return (
    <div>
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        {['mock','homologacion','produccion'].map(a => (
          <button key={a} onClick={() => setAmb(a)} style={{ flex:1, padding:'14px 8px', border:`2px solid ${a===amb?'var(--p)':'var(--b)'}`, borderRadius:'var(--r)', background: a===amb?'var(--pl)':'#fff', cursor:'pointer', fontWeight: a===amb?700:400, fontSize:13, fontFamily:'inherit' }}>
            {INFO[a].label}
          </button>
        ))}
      </div>

      <div style={{ padding:16, borderRadius:'var(--rs)', background:info.color, marginBottom:20, fontSize:14 }}>{info.desc}</div>

      {amb !== 'mock' && (
        <div className="form-row cols-2" style={{ marginBottom:16 }}>
          <div className="form-group"><label>Usuario DGI (web services)</label><input value={dgiUser} onChange={e => setDgiUser(e.target.value)} placeholder="UsuarioDGI" /></div>
          <div className="form-group"><label>Contraseña DGI</label><input type="password" placeholder="Solo se guarda si completás este campo" /></div>
        </div>
      )}

      {amb === 'produccion' && (
        <div className="alert alert-err" style={{ marginBottom:16 }}>⚠️ <strong>¡Atención!</strong> En modo Producción los CFE emitidos tienen validez legal y fiscal. Asegurate de haber completado la homologación ante DGI.</div>
      )}

      <button className="btn btn-primary" disabled={saving} onClick={() => onSave({ ambiente: amb, dgi_usuario: dgiUser })}>
        {saving ? 'Guardando…' : 'Guardar configuración'}
      </button>
    </div>
  )
}

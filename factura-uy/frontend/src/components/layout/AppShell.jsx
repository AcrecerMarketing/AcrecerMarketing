import { Outlet, NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState, useEffect } from 'react'
import api from '../../api/client'

const IcoDash    = () => <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
const IcoPlus    = () => <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
const IcoList    = () => <svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
const IcoUsers   = () => <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
const IcoCog     = () => <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
const IcoLogout  = () => <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>

export default function AppShell() {
  const { logout } = useAuth()
  const [empresa, setEmpresa] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    api.get('/empresa').then(setEmpresa).catch(() => {})
  }, [])

  const modo = empresa?.ambiente || 'mock'
  const modoLabel = { mock: '🟡 Simulador', homologacion: '🔵 Homologación', produccion: '🟢 Producción' }

  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: <IcoDash /> },
    { to: '/nueva', label: 'Nueva CFE', icon: <IcoPlus /> },
    { to: '/historial', label: 'Historial', icon: <IcoList /> },
    { to: '/clientes', label: 'Clientes', icon: <IcoUsers /> },
    { to: '/configuracion', label: 'Configuración', icon: <IcoCog /> },
  ]

  return (
    <div className="app-shell">
      {/* Overlay móvil */}
      {menuOpen && <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,.4)',zIndex:90 }} onClick={() => setMenuOpen(false)} />}

      <aside className={`sidebar${menuOpen ? ' open' : ''}`}>
        <div className="sb-brand">
          <h1>🧾 Factura-UY</h1>
          <span>{empresa?.nombre_comercial || empresa?.razon_social || 'Sistema de CFE'}</span>
        </div>
        <nav className="sb-nav">
          <div className="sb-section">Principal</div>
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => `sb-link${isActive ? ' act' : ''}`} onClick={() => setMenuOpen(false)}>
              {l.icon}{l.label}
            </NavLink>
          ))}
        </nav>
        <div className="sb-bottom">
          <div className={`env-badge ${modo}`} style={{ marginBottom: 10 }}>{modoLabel[modo]}</div>
          <button className="sb-link" onClick={logout}><IcoLogout />Cerrar sesión</button>
        </div>
      </aside>

      <div className="main-content">
        {/* Mobile topbar */}
        <div style={{ display:'none', padding:'12px 16px', background:'#fff', borderBottom:'1px solid var(--b)', alignItems:'center', gap:12, '@media(max-width:768px)':{display:'flex'} }}>
          <button className="btn-icon" onClick={() => setMenuOpen(!menuOpen)}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
          <span style={{ fontWeight: 800, fontSize: 16 }}>🧾 Factura-UY</span>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

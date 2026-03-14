import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const { login, isAuth } = useAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuth) return <Navigate to="/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(password)
    } catch {
      setError('Contraseña incorrecta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-logo">🧾</div>
        <h1>Factura-UY</h1>
        <p className="sub">Sistema de Facturación Electrónica para Uruguay</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Tu contraseña" autoFocus required />
          </div>
          {error && <div className="alert alert-err" style={{ marginBottom: 12 }}>{error}</div>}
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
        <p style={{ fontSize: 12, color: 'var(--tm)', marginTop: 20, textAlign: 'center' }}>
          Contraseña por defecto: <code>factura2024</code><br/>
          <span style={{ color: 'var(--err)' }}>Cambiá esto en el .env antes de usar en producción.</span>
        </p>
      </div>
    </div>
  )
}

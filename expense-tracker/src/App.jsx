import { useState, useEffect, useRef, useCallback } from 'react'
import './index.css'

// ── Constants ──────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'food',       label: 'Comida',       emoji: '🍔', color: '#f97316', bg: '#fff7ed' },
  { id: 'transport',  label: 'Transporte',   emoji: '🚌', color: '#3b82f6', bg: '#eff6ff' },
  { id: 'coffee',     label: 'Café',         emoji: '☕', color: '#92400e', bg: '#fef3c7' },
  { id: 'shopping',   label: 'Compras',      emoji: '🛍️', color: '#ec4899', bg: '#fdf2f8' },
  { id: 'health',     label: 'Salud',        emoji: '💊', color: '#10b981', bg: '#f0fdf4' },
  { id: 'leisure',    label: 'Ocio',         emoji: '🎮', color: '#8b5cf6', bg: '#f5f3ff' },
  { id: 'bills',      label: 'Facturas',     emoji: '📄', color: '#ef4444', bg: '#fff1f2' },
  { id: 'other',      label: 'Otro',         emoji: '💸', color: '#6b7280', bg: '#f9fafb' },
]

const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.id, c]))

const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const BANKS = [
  { id: 'mercadopago', name: 'Mercado Pago',  emoji: '💙', desc: 'Cuenta digital y tarjeta',   color: '#009ee3', connected: false },
  { id: 'bbva',        name: 'BBVA',           emoji: '🏦', desc: 'Cuenta bancaria y crédito',  color: '#004481', connected: false },
  { id: 'santander',   name: 'Santander',      emoji: '🏛️', desc: 'Cuenta bancaria y crédito',  color: '#ec0000', connected: false },
  { id: 'galicia',     name: 'Galicia',        emoji: '🟡', desc: 'Cuenta bancaria y crédito',  color: '#ffcc00', connected: false },
  { id: 'naranja',     name: 'Naranja X',      emoji: '🟠', desc: 'Tarjeta de crédito',         color: '#ff6600', connected: false },
  { id: 'uala',        name: 'Ualá',           emoji: '💳', desc: 'Cuenta digital prepaga',     color: '#7b2d8b', connected: false },
]

// ── Voice command parser ──────────────────────────────────────────────────
function parseVoiceCommand(text) {
  const lower = text.toLowerCase()

  // Detect amount
  const amountMatch = lower.match(/(\d+(?:[.,]\d+)?)\s*(?:pesos?|peso|\$)?/)
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(',', '.')) : null

  // Detect category by keywords
  let category = 'other'
  if (/café|cafecito|cortado|latte|expreso/.test(lower)) category = 'coffee'
  else if (/comida|almuerzo|cena|desayuno|hamburgues|pizza|restaurante|sushi|empanada/.test(lower)) category = 'food'
  else if (/colectivo|taxi|uber|subte|nafta|combustible|estacionamiento|peaje|tren/.test(lower)) category = 'transport'
  else if (/compra|ropa|zapatilla|mercado|supermercado|shopping/.test(lower)) category = 'shopping'
  else if (/farmacia|médico|doctor|salud|pastilla|medicamento/.test(lower)) category = 'health'
  else if (/cine|juego|netflix|spotify|entretenimiento|ocio/.test(lower)) category = 'leisure'
  else if (/factura|servicio|luz|gas|internet|agua/.test(lower)) category = 'bills'

  // Description: remove amount and currency
  const desc = text.replace(/\d+(?:[.,]\d+)?\s*(?:pesos?|peso|\$)?/i, '').replace(/\bgasté\b|\bgasto\b|\bpagué\b|\bpagué\b/i, '').trim()

  return { amount, category, desc: desc || CAT_MAP[category].label }
}

// ── Donut Chart (SVG) ────────────────────────────────────────────────────
function DonutChart({ data, total }) {
  const size = 180
  const r = 68
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * r
  let offset = 0

  const segments = data.map(d => {
    const pct = total > 0 ? d.amount / total : 0
    const length = pct * circumference
    const seg = { ...d, dasharray: `${length} ${circumference - length}`, offset }
    offset += length
    return seg
  })

  return (
    <div className="donut-wrapper">
      <div className="donut-chart">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {total === 0 ? (
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth="22" />
          ) : segments.map((seg, i) => (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="22"
              strokeDasharray={seg.dasharray}
              strokeDashoffset={-seg.offset}
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
            />
          ))}
        </svg>
        <div className="donut-center">
          <div className="total">${total.toLocaleString()}</div>
          <div className="label">este mes</div>
        </div>
      </div>
    </div>
  )
}

// ── Home Screen ───────────────────────────────────────────────────────────
function HomeScreen({ expenses, onAdd, onDelete, showToast }) {
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [form, setForm] = useState({ desc: '', amount: '', category: 'food' })
  const [filterCat, setFilterCat] = useState('all')
  const recognitionRef = useRef(null)

  const totalMonth = expenses
    .filter(e => {
      const d = new Date(e.date)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((s, e) => s + e.amount, 0)

  const today = expenses
    .filter(e => new Date(e.date).toDateString() === new Date().toDateString())
    .reduce((s, e) => s + e.amount, 0)

  // Voice recognition
  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      showToast('Tu navegador no soporta reconocimiento de voz. Probá Chrome.')
      return
    }

    const rec = new SpeechRecognition()
    rec.lang = 'es-AR'
    rec.continuous = false
    rec.interimResults = true

    rec.onstart = () => setListening(true)
    rec.onend = () => {
      setListening(false)
      recognitionRef.current = null
    }

    rec.onresult = (e) => {
      const text = Array.from(e.results).map(r => r[0].transcript).join('')
      setTranscript(text)
      if (e.results[e.results.length - 1].isFinal) {
        const parsed = parseVoiceCommand(text)
        if (parsed.amount) {
          onAdd({ ...parsed, source: 'voice' })
          showToast(`✅ Gasto registrado\n${parsed.desc} — $${parsed.amount}`)
          setTranscript('')
        } else {
          showToast('No detecté un monto. Decí algo como "gasté 500 en café"')
        }
      }
    }

    rec.onerror = (e) => {
      setListening(false)
      showToast('Error de micrófono: ' + e.error)
    }

    recognitionRef.current = rec
    rec.start()
  }, [onAdd, showToast])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  const handleVoiceBtn = () => {
    if (listening) stopListening()
    else startListening()
  }

  const handleManualAdd = (e) => {
    e.preventDefault()
    if (!form.desc || !form.amount) return
    onAdd({ desc: form.desc, amount: parseFloat(form.amount), category: form.category, source: 'manual' })
    showToast(`✅ Gasto agregado: $${form.amount}`)
    setForm({ desc: '', amount: '', category: 'food' })
  }

  const filtered = filterCat === 'all'
    ? expenses
    : expenses.filter(e => e.category === filterCat)

  const recent = filtered.slice(0, 20)

  return (
    <div className="screen">
      {/* Header */}
      <div className="header">
        <div className="header-top">
          <div>
            <h2>Mis Gastos</h2>
            <div className="balance">${totalMonth.toLocaleString()}</div>
            <div className="balance-label">gastado este mes</div>
          </div>
          <div className="avatar">MG</div>
        </div>
        <div className="stats-row">
          <div className="stat-card">
            <div className="label">Hoy</div>
            <div className="value expense">${today.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="label">Gastos registrados</div>
            <div className="value">{expenses.length}</div>
          </div>
        </div>
      </div>

      {/* Voice Button */}
      <div className="voice-section">
        <div className={`voice-btn-wrapper ${listening ? 'listening' : ''}`}>
          <div className="voice-ring r1" />
          <div className="voice-ring r2" />
          <div className="voice-ring r3" />
          <button className={`voice-btn ${listening ? 'listening' : ''}`} onClick={handleVoiceBtn}>
            {listening ? (
              <svg viewBox="0 0 24 24" fill="white" stroke="none">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V5a3 3 0 0 1 3-3z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            )}
          </button>
        </div>
        <div className="voice-hint">
          {listening ? '🔴 Hablando... tocá para detener' : 'Tocá el micrófono y dictá tu gasto'}
        </div>
      </div>

      {(listening || transcript) && (
        <div className="voice-transcript">
          {transcript || '🎙️ Escuchando... Ej: "Gasté 350 en café"'}
        </div>
      )}

      {/* Quick Add */}
      <div className="quick-add">
        <div className="quick-add-title">Agregar manualmente</div>
        <form className="quick-form" onSubmit={handleManualAdd}>
          <div className="form-group">
            <input
              className="form-input"
              placeholder="Descripción"
              value={form.desc}
              onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
            />
          </div>
          <div className="form-group" style={{ minWidth: 90 }}>
            <input
              className="form-input"
              type="number"
              placeholder="$0"
              value={form.amount}
              onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <select
              className="category-select"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="add-btn">+ Agregar</button>
        </form>
      </div>

      {/* Category filter */}
      <div className="section">
        <div className="section-header">
          <span className="section-title">Movimientos</span>
        </div>
        <div className="category-chips" style={{ marginBottom: 14 }}>
          <button className={`chip ${filterCat === 'all' ? 'active' : ''}`} onClick={() => setFilterCat('all')}>
            Todos
          </button>
          {CATEGORIES.map(c => (
            <button
              key={c.id}
              className={`chip ${filterCat === c.id ? 'active' : ''}`}
              onClick={() => setFilterCat(c.id)}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        {recent.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">🎙️</div>
            <p>Sin gastos aún.<br />Usá el micrófono o agregá uno manualmente.</p>
          </div>
        ) : (
          recent.map(e => {
            const cat = CAT_MAP[e.category] || CAT_MAP.other
            const d = new Date(e.date)
            return (
              <div className="expense-item" key={e.id}>
                <div className="expense-icon" style={{ background: cat.bg }}>
                  {cat.emoji}
                </div>
                <div className="expense-info">
                  <div className="expense-name">{e.desc}</div>
                  <div className="expense-meta">
                    {cat.label} · {d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}
                    {e.source === 'voice' && ' 🎙️'}
                  </div>
                </div>
                <div className="expense-amount">-${e.amount.toLocaleString()}</div>
                <button className="delete-btn" onClick={() => onDelete(e.id)}>✕</button>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

// ── Summary Screen ────────────────────────────────────────────────────────
function SummaryScreen({ expenses }) {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())

  const monthExp = expenses.filter(e => {
    const d = new Date(e.date)
    return d.getMonth() === month && d.getFullYear() === year
  })

  const total = monthExp.reduce((s, e) => s + e.amount, 0)

  const byCategory = CATEGORIES.map(cat => {
    const amount = monthExp.filter(e => e.category === cat.id).reduce((s, e) => s + e.amount, 0)
    return { ...cat, amount }
  }).filter(c => c.amount > 0).sort((a, b) => b.amount - a.amount)

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  return (
    <div className="summary-screen">
      <h1>Resumen</h1>

      <div className="month-selector">
        <button className="month-btn" onClick={prevMonth}>‹</button>
        <span className="month-label">{MONTHS[month]} {year}</span>
        <button className="month-btn" onClick={nextMonth}>›</button>
      </div>

      <DonutChart data={byCategory} total={total} />

      {byCategory.length === 0 ? (
        <div className="empty-state">
          <div className="emoji">📊</div>
          <p>Sin gastos en {MONTHS[month]}.</p>
        </div>
      ) : (
        <div className="legend-grid">
          {byCategory.map(cat => (
            <div className="legend-item" key={cat.id}>
              <div className="legend-dot" style={{ background: cat.color }} />
              <div className="legend-info">
                <div className="cat-name">{cat.emoji} {cat.label}</div>
                <div className="cat-amount">${cat.amount.toLocaleString()}</div>
                <div className="cat-pct">{total > 0 ? Math.round(cat.amount / total * 100) : 0}%</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Daily breakdown */}
      {monthExp.length > 0 && (
        <>
          <div className="section-header" style={{ padding: '0 0 14px' }}>
            <span className="section-title">Detalle diario</span>
          </div>
          {Object.entries(
            monthExp.reduce((acc, e) => {
              const key = new Date(e.date).toLocaleDateString('es-AR', { weekday: 'long', day: '2-digit', month: 'short' })
              if (!acc[key]) acc[key] = { items: [], total: 0 }
              acc[key].items.push(e)
              acc[key].total += e.amount
              return acc
            }, {})
          ).map(([day, data]) => (
            <div key={day} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{day}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--danger)' }}>-${data.total.toLocaleString()}</span>
              </div>
              {data.items.map(e => {
                const cat = CAT_MAP[e.category] || CAT_MAP.other
                return (
                  <div className="expense-item" key={e.id}>
                    <div className="expense-icon" style={{ background: cat.bg }}>{cat.emoji}</div>
                    <div className="expense-info">
                      <div className="expense-name">{e.desc}</div>
                      <div className="expense-meta">{cat.label}</div>
                    </div>
                    <div className="expense-amount">-${e.amount.toLocaleString()}</div>
                  </div>
                )
              })}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ── Banks Screen ──────────────────────────────────────────────────────────
function BanksScreen({ showToast }) {
  const [connected, setConnected] = useState({})

  const toggle = (id) => {
    setConnected(prev => {
      const next = { ...prev, [id]: !prev[id] }
      if (next[id]) showToast(`✅ Conectado con ${BANKS.find(b => b.id === id).name}`)
      else showToast(`🔌 Desconectado`)
      return next
    })
  }

  return (
    <div className="banks-screen">
      <h1>Cuentas y Bancos</h1>
      <p className="subtitle">
        Conectá tus cuentas bancarias y tarjetas para importar gastos automáticamente.{' '}
        <strong>Próximamente disponible</strong> — las conexiones reales requieren Open Banking API.
      </p>

      <div className="info-box">
        <p>
          <strong>🔒 Seguridad:</strong> La integración real usará <strong>OAuth 2.0</strong> y APIs de Open Banking.
          Tus credenciales nunca se almacenarán en la app. Podés desconectar en cualquier momento.
        </p>
      </div>

      {BANKS.map(bank => (
        <div className="bank-card" key={bank.id}>
          <div className="bank-logo" style={{ background: bank.color + '22' }}>
            {bank.emoji}
          </div>
          <div className="bank-info">
            <div className="bank-name">{bank.name}</div>
            <div className="bank-desc">{bank.desc}</div>
            <div className={`bank-status ${connected[bank.id] ? 'connected' : ''}`}>
              {connected[bank.id] ? '● Conectado' : '○ No conectado'}
            </div>
          </div>
          {connected[bank.id] ? (
            <button
              className="connect-btn connected"
              onClick={() => toggle(bank.id)}
            >
              ✓ Activo
            </button>
          ) : (
            <button
              className="connect-btn"
              onClick={() => toggle(bank.id)}
            >
              Conectar
            </button>
          )}
        </div>
      ))}

      <div style={{ marginTop: 24 }}>
        <div className="section-header">
          <span className="section-title">Próximas integraciones</span>
          <span className="coming-badge">BETA</span>
        </div>
        <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
          ✦ Importación automática de extractos CSV / PDF<br/>
          ✦ Sincronización en tiempo real via Open Banking<br/>
          ✦ Detección de gastos recurrentes<br/>
          ✦ Alertas de presupuesto por categoría<br/>
          ✦ Exportar a Excel / Google Sheets
        </div>
      </div>
    </div>
  )
}

// ── Bottom Nav ────────────────────────────────────────────────────────────
function BottomNav({ screen, setScreen }) {
  const tabs = [
    {
      id: 'home', label: 'Inicio',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      )
    },
    {
      id: 'summary', label: 'Resumen',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
          <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
      )
    },
    {
      id: 'banks', label: 'Bancos',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22">
          <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      )
    },
  ]

  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`nav-btn ${screen === t.id ? 'active' : ''}`}
          onClick={() => setScreen(t.id)}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </nav>
  )
}

// ── App Root ──────────────────────────────────────────────────────────────
const SEED_EXPENSES = [
  { id: 1, desc: 'Café en el trabajo', amount: 350, category: 'coffee', date: new Date().toISOString(), source: 'manual' },
  { id: 2, desc: 'Almuerzo', amount: 1800, category: 'food', date: new Date().toISOString(), source: 'manual' },
  { id: 3, desc: 'Colectivo', amount: 200, category: 'transport', date: new Date(Date.now() - 86400000).toISOString(), source: 'manual' },
  { id: 4, desc: 'Netflix', amount: 2500, category: 'leisure', date: new Date(Date.now() - 86400000 * 2).toISOString(), source: 'manual' },
  { id: 5, desc: 'Farmacia', amount: 900, category: 'health', date: new Date(Date.now() - 86400000 * 3).toISOString(), source: 'manual' },
]

export default function App() {
  const [screen, setScreen] = useState('home')
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('mg_expenses')
      return saved ? JSON.parse(saved) : SEED_EXPENSES
    } catch { return SEED_EXPENSES }
  })
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    localStorage.setItem('mg_expenses', JSON.stringify(expenses))
  }, [expenses])

  const showToast = useCallback((msg) => {
    clearTimeout(toastTimer.current)
    setToast(msg)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }, [])

  const onAdd = useCallback((data) => {
    setExpenses(prev => [{
      id: Date.now(),
      desc: data.desc,
      amount: data.amount,
      category: data.category,
      date: new Date().toISOString(),
      source: data.source || 'manual',
    }, ...prev])
  }, [])

  const onDelete = useCallback((id) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
    showToast('Gasto eliminado')
  }, [showToast])

  return (
    <>
      {screen === 'home' && <HomeScreen expenses={expenses} onAdd={onAdd} onDelete={onDelete} showToast={showToast} />}
      {screen === 'summary' && <SummaryScreen expenses={expenses} />}
      {screen === 'banks' && <BanksScreen showToast={showToast} />}
      <BottomNav screen={screen} setScreen={setScreen} />
      {toast && <div className="toast">{toast}</div>}
    </>
  )
}

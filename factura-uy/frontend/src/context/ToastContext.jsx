import { createContext, useContext, useState, useCallback } from 'react'

const Ctx = createContext(null)

let id = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = useCallback((msg, type = 'ok', duration = 3500) => {
    const tid = ++id
    setToasts(t => [...t, { id: tid, msg, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== tid)), duration)
  }, [])

  return (
    <Ctx.Provider value={show}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)

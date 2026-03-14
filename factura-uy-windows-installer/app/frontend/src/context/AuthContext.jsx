import { createContext, useContext, useState } from 'react'
import api from '../api/client'

const Ctx = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('fuy_token'))

  const login = async (password) => {
    const data = await api.post('/auth/login', { password })
    localStorage.setItem('fuy_token', data.token)
    setToken(data.token)
  }

  const logout = () => {
    localStorage.removeItem('fuy_token')
    setToken(null)
  }

  return <Ctx.Provider value={{ token, login, logout, isAuth: !!token }}>{children}</Ctx.Provider>
}

export const useAuth = () => useContext(Ctx)

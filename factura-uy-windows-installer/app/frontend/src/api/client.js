import axios from 'axios'

// When running inside Capacitor (Android/iOS WebView), we must use the full
// URL because the WebView origin (https://localhost) differs from the Node.js
// backend (http://localhost:3001).
const isCapacitor = typeof window !== 'undefined' && !!(window.Capacitor)
const baseURL = isCapacitor ? 'http://localhost:3001/api' : '/api'

const api = axios.create({ baseURL, timeout: 30000 })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('fuy_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  r => r.data,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('fuy_token')
      window.location.href = '/login'
    }
    return Promise.reject(err.response?.data || err)
  }
)

export default api

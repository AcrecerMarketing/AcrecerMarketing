import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import AppShell from './components/layout/AppShell'
import LoginPage from './pages/Login/LoginPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import NuevaCFEPage from './pages/NuevaCFE/NuevaCFEPage'
import HistorialPage from './pages/Historial/HistorialPage'
import CFEDetallePage from './pages/CFEDetalle/CFEDetallePage'
import ClientesPage from './pages/Clientes/ClientesPage'
import ConfiguracionPage from './pages/Configuracion/ConfiguracionPage'

function PrivateRoute({ children }) {
  const { isAuth } = useAuth()
  return isAuth ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<PrivateRoute><AppShell /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="nueva" element={<NuevaCFEPage />} />
        <Route path="historial" element={<HistorialPage />} />
        <Route path="historial/:id" element={<CFEDetallePage />} />
        <Route path="clientes" element={<ClientesPage />} />
        <Route path="configuracion" element={<ConfiguracionPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

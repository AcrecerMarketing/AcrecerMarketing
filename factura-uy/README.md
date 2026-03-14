# 🧾 Factura-UY — Sistema de Facturación Electrónica Uruguay

Sistema completo de facturación electrónica para Uruguay, cumple con normativa DGI (CFE versión 23-2, XSD 1.43.5).

## Requisitos

- Node.js 18+
- npm 9+

## Instalación

```bash
# 1. Instalar dependencias del backend
cd backend
npm install

# 2. Configurar variables de entorno
cp .env.example .env
# Editá .env con tus valores

# 3. Instalar dependencias del frontend
cd ../frontend
npm install
```

## Desarrollo

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# → http://localhost:3001

# Terminal 2 — Frontend
cd frontend
npm run dev
# → http://localhost:5173
```

**Contraseña por defecto:** `factura2024` (cambiá `APP_PASSWORD` en `.env`)

## Modos de operación DGI

Configurar en `backend/.env`:

| `DGI_MODE` | Descripción |
|-----------|-------------|
| `mock` (default) | Simulador local — sin credenciales DGI |
| `homologacion` | Ambiente de pruebas DGI — requiere credenciales |
| `produccion` | Ambiente real DGI — validez fiscal plena |

## Estructura

```
factura-uy/
├── GUIA-EMPRESARIO-UY.md   ← Guía legal y fiscal completa
├── backend/                ← Node.js + Express + SQLite
│   ├── services/cfe/       ← Motor de generación XML CFE
│   ├── services/dgi/       ← Integración web services DGI
│   ├── services/pdf/       ← Generación PDF + QR
│   └── server.js           ← Entry point
└── frontend/               ← React 19 + Vite
    └── src/pages/          ← Dashboard, Nueva CFE, Historial, etc.
```

## Documentación completa

Ver [GUIA-EMPRESARIO-UY.md](./GUIA-EMPRESARIO-UY.md) para el proceso legal completo.

## Tipos de CFE soportados

| Código | Tipo |
|--------|------|
| 111 | e-Factura |
| 101 | e-Ticket |
| 112/102 | Notas de Crédito |
| 113/103 | Notas de Débito |
| 124 | e-Remito |
| 182 | e-Resguardo |

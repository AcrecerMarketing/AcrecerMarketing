# Factura-UY — Instalador para Windows

Sistema de facturación electrónica para Uruguay, cumple con normativa DGI (CFE versión 23-2).

---

## Requisitos

- **Windows 10 / 11** (64-bit)
- **Node.js 18 o superior** — [Descargar en nodejs.org](https://nodejs.org/en/download)

> Si no tenés Node.js instalado, el instalador detectará la situación y abrirá automáticamente el sitio de descarga.

---

## Instalación (primera vez)

1. **Descomprimí** el ZIP en cualquier carpeta (ej: `C:\Descargas\factura-uy-installer\`)
2. **Hacé doble clic** en `instalar.bat`
3. Aceptá el diálogo de control de cuentas de usuario (UAC) si aparece
4. Esperá mientras el instalador:
   - Verifica Node.js
   - Copia los archivos a `%LOCALAPPDATA%\Factura-UY`
   - Crea el archivo de configuración `.env` con secretos aleatorios
   - Instala las dependencias npm
   - Compila la interfaz web (tarda ~2 min)
   - Crea un acceso directo en el escritorio y el Menú Inicio
5. Al finalizar podés elegir iniciar la aplicación inmediatamente

---

## Uso diario

### Iniciar

- Hacé doble clic en **Factura-UY** en el escritorio, o
- Ejecutá `iniciar.bat` desde la carpeta del instalador

El sistema abre automáticamente el navegador en `http://localhost:3001`.

### Detener

- Cerrá la ventana de comando del servidor, o
- Ejecutá `detener.bat`

---

## Credenciales por defecto

| Campo | Valor |
|---|---|
| URL | http://localhost:3001 |
| Contraseña | `factura2024` |

Para cambiar la contraseña: editá `%LOCALAPPDATA%\Factura-UY\backend\.env` y modificá `APP_PASSWORD`.

---

## Modos de operación DGI

La aplicación arranca en **modo simulador** (sin credenciales DGI reales).

Para cambiar el modo, editá `%LOCALAPPDATA%\Factura-UY\backend\.env`:

```
DGI_MODE=mock          # Simulador local (default)
DGI_MODE=homologacion  # Pruebas DGI — requiere credenciales
DGI_MODE=produccion    # Real DGI — validez fiscal plena
```

También podés cambiar el modo desde la UI en **Configuración → Ambiente**.

---

## Actualizar

Para actualizar a una nueva versión:

1. Descomprimí el nuevo instalador
2. Hacé doble clic en `instalar.bat`
3. El instalador detectará la instalación existente, **preservará tu `.env` y base de datos**, y actualizará solo el código

---

## Desinstalar

1. Abrí **Menú Inicio → Factura-UY → Desinstalar Factura-UY**
2. Escribí `SI` para confirmar
3. La base de datos se copiará al escritorio como `factura-uy-backup.db` antes de eliminar

---

## Estructura instalada

```
%LOCALAPPDATA%\Factura-UY\
├── backend\
│   ├── server.js
│   ├── .env          ← Configuración (editá aquí contraseña y modo DGI)
│   ├── factura-uy.db ← Base de datos SQLite (NO eliminar)
│   └── ...
├── frontend\
│   └── dist\         ← Interfaz compilada
├── iniciar.bat
└── detener.bat
```

---

## Soporte y documentación

- Guía legal completa: ver `app\GUIA-EMPRESARIO-UY.md` (incluida en el instalador)
- Portal DGI eFatura: https://www.efactura.dgi.gub.uy/
- Certificado digital (para modo real): https://iddigital.com.uy/

---

## Resolución de problemas

### El navegador no abre automáticamente
Abrí manualmente `http://localhost:3001` en tu navegador.

### Error "node no se reconoce como comando"
Node.js no está instalado o no está en el PATH. Reinstalá Node.js y reiniciá Windows antes de volver a ejecutar el instalador.

### Puerto 3001 en uso
Otro programa está usando el puerto. Cambiá `PORT=3001` por otro número (ej: `3002`) en el `.env` y accedé por `http://localhost:3002`.

### La base de datos está corrupta
Copiá un backup de `factura-uy.db` si tenés uno. La aplicación crea una nueva base vacía si no existe el archivo.

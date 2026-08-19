- 👋 Hi, I’m @AcrecerMarketing
- 👀 I’m interested in Digital Marketing, and developing software focused in marketing development
- 🌱 I’m currently learning Kotlin
- 💞️ I’m looking to collaborate on android developing
- 📫 How to reach me by mail mmarcher85@gmail.com

<!---
AcrecerMarketing/AcrecerMarketing is a ✨ special ✨ repository because its `README.md` (this file) appears on your GitHub profile.
You can click the Preview link to take a look at your changes.
--->

---

## 🚀 AcrecerMarketing — Plataforma de crecimiento para influencers y marcas

Este repositorio también contiene una aplicación web completa: una plataforma
de crecimiento orgánico e influencer marketing (al estilo Pixie / Path Social),
pensada para dos tipos de clientes:

- **Influencers y creadores** que quieren crecer su cuenta de Instagram de forma
  orgánica, con targeting por hashtags/ubicación/competidores y un growth
  manager dedicado.
- **Marcas** que buscan crecer su propia cuenta o gestionar campañas de
  influencer marketing con creadores verificados.

### Qué incluye

- **Sitio de marketing** (`/`, `/servicios`, `/precios`, `/nosotros`, `/contacto`)
  con landing, planes por audiencia (influencer / marca), testimonios, FAQ y
  formulario de contacto funcional.
- **Autenticación** (registro, login) con NextAuth + credenciales, y un flujo
  de **onboarding** que captura la cuenta de Instagram, nicho, targeting
  inicial y plan elegido.
- **Dashboard de cliente** (`/dashboard`) con métricas de crecimiento
  (seguidores, engagement, visitas al perfil) graficadas en el tiempo,
  configuración de targeting, facturación (cambio de plan) y soporte.
- **Panel de administración** (`/admin`) con listado de clientes, MRR estimado
  y gestión de precios de los planes.

### Stack técnico

Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma (SQLite en
desarrollo) + NextAuth + Recharts.

### Cómo correrlo localmente

```bash
npm install
cp .env.example .env      # ya incluido con valores de desarrollo
npm run db:push           # crea el esquema en prisma/dev.db
npm run db:seed           # datos de demo (planes, cliente y admin)
npm run dev
```

Cuentas de demostración (creadas por el seed):

| Rol     | Email                          | Contraseña |
| ------- | ------------------------------- | ---------- |
| Cliente | demo@acrecermarketing.com       | demo1234   |
| Admin   | admin@acrecermarketing.com      | admin1234  |

> Nota: el crecimiento que ofrece esta plataforma es 100% orgánico
> (targeting + estrategia, sin bots ni automatización de acciones en
> Instagram), tal como se comunica en el sitio.

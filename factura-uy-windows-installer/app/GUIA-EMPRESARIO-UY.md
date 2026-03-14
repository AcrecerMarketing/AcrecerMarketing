# 🇺🇾 Guía Completa: Facturación Electrónica para Empresarios Uruguayos
## Cómo crear tu empresa, registrarte en DGI y salir a vender software de facturación

> **Actualizada:** Marzo 2026 · Normativa DGI CFE versión 23-2 · Obligatorio desde enero 2025

---

## Índice

1. [¿Por qué facturación electrónica?](#1-por-qué-facturación-electrónica)
2. [Crear la empresa](#2-crear-la-empresa)
3. [Inscripción en DGI como contribuyente IVA](#3-inscripción-en-dgi-como-contribuyente-iva)
4. [Ingreso al régimen de facturación electrónica](#4-ingreso-al-régimen-de-facturación-electrónica)
5. [Obtener el certificado digital X.509](#5-obtener-el-certificado-digital-x509)
6. [Homologación ante DGI (proceso de pruebas)](#6-homologación-ante-dgi-proceso-de-pruebas)
7. [Registro como Proveedor Habilitado DGI](#7-registro-como-proveedor-habilitado-dgi)
8. [Obligaciones fiscales continuas](#8-obligaciones-fiscales-continuas)
9. [Modelo de negocio y precios de mercado](#9-modelo-de-negocio-y-precios-de-mercado)
10. [Recursos y enlaces oficiales](#10-recursos-y-enlaces-oficiales)

---

## 1. ¿Por qué facturación electrónica?

Desde **enero 2025**, la facturación electrónica es **obligatoria para todos los contribuyentes del IVA** en Uruguay (Resolución DGI N° 798/012 y modificaciones).

### ¿Quiénes están obligados?
- Empresas con ingresos anuales superiores a **305.000 Unidades Indexadas (UI)**
- Todos los contribuyentes del IVA en general
- Desde enero 2025: incluyendo quienes pagan IVA mínimo

### ¿Quiénes están exentos?
- Contribuyentes **Monotributo**
- **Monotributo Social MIDES** (MSM)
- Contribuyentes **Aporte Social Único** (PPL)
- Contribuyentes de **IRNR** (Impuesto a la Renta de No Residentes)
- Productores agropecuarios con ingresos < 4.000.000 UI

### Tipos de comprobantes (CFE — Comprobantes Fiscales Electrónicos)

| Código | Nombre | Uso |
|--------|--------|-----|
| 111 | e-Factura | Ventas a empresas (B2B) |
| 101 | e-Ticket | Ventas a consumidores finales (B2C) |
| 112 | Nota de Crédito e-Factura | Ajuste/devolución de e-Factura |
| 102 | Nota de Crédito e-Ticket | Ajuste/devolución de e-Ticket |
| 113 | Nota de Débito e-Factura | Cargo adicional a e-Factura |
| 103 | Nota de Débito e-Ticket | Cargo adicional a e-Ticket |
| 124 | e-Remito | Traslado de mercadería |
| 182 | e-Resguardo | Pagos a proveedores no-IVA |

---

## 2. Crear la empresa

### Opciones de forma jurídica

Para vender un software de facturación, te recomendamos:

#### 🥇 SAS (Sociedad por Acciones Simplificada) — RECOMENDADA
- **Ventajas:** Constitución en 24-72 horas, sin escribano, 100% online
- **Capital mínimo:** No se exige capital mínimo en efectivo
- **Responsabilidad:** Limitada al capital aportado
- **Dónde:** Portal [empresas.gub.uy](https://empresas.gub.uy)
- **Costo:** ~UYU 5.000-8.000 (tasa BCU + gastos)

#### Alternativas
- **SRL** (Sociedad de Responsabilidad Limitada): Más tradicional, requiere escribano
- **Unipersonal**: Para empezar solo, sin socios; no separa patrimonio personal

### Pasos para crear una SAS online

1. **Portal BCU:** Acceder a [empresas.gub.uy](https://empresas.gub.uy) con tu cédula de identidad digital
2. **Completar el formulario:** Denominación social, objeto (ej: "Desarrollo y comercialización de software"), domicilio fiscal, accionistas
3. **Pagar la tasa BCU:** Aprox. USD 130 (varía según padrón)
4. **Publicación en el Diario Oficial:** Automática (costo incluido)
5. **Inscripción en el BCU:** Automática
6. Recibís el **RUC provisional** en el momento

> **Tip:** Elegí un nombre que refleje tecnología y sea memorable. Verificá disponibilidad en el [Buscador BCU](https://www.bcu.gub.uy/Servicios-Financieros-SSF/Paginas/RegistroEmpresas.aspx).

### Apertura de cuenta bancaria empresarial

Con el RUC de la SAS, podés abrir cuentas en:
- **Banco República (BROU):** Gratuita para empresas pequeñas
- **Itaú, Santander, BBVA:** Cuentas para PyMEs
- **Cuenta digital:** Mercado Pago o Ualá Business (sin visita al banco)

---

## 3. Inscripción en DGI como contribuyente IVA

### Pasos

1. **Portal DGI Online:** [servicios.dgi.gub.uy](https://servicios.dgi.gub.uy/serviciosenlinea)
2. **Formulario 6351:** "Inscripción de empresas — IVA e IRAE"
3. Completar:
   - RUC de la empresa
   - Actividad económica: **Código 6201** — "Actividades de programación informática" (o 6202 para consultoría)
   - Domicilio fiscal
   - Fecha de inicio de actividades
4. Recibís:
   - **RUC definitivo** (12 dígitos: tipo + número + dígito verificador)
   - **Contraseña del BPS** (para declarar aportes patronales)

### Obligaciones como contribuyente IVA

| Obligación | Periodicidad | Vencimiento |
|-----------|--------------|-------------|
| Declaración IVA | Mensual | Día 20 del mes siguiente |
| Anticipo IRAE | Mensual | Día 20 del mes siguiente |
| BPS (aportes) | Mensual | Según categoría |
| IRAE (renta) | Anual | 4 meses después del cierre |
| Declaración jurada IVA | Anual | Junto con IRAE |

### Tasas impositivas clave

- **IVA básico:** 22% (mayoría de servicios y bienes)
- **IVA mínimo:** 10% (alimentos básicos, medicamentos)
- **IRAE:** 25% sobre renta neta
- **BPS patronal:** Varía; aprox. 7.5% sobre sueldos

> **Recomendación:** Contratá un contador desde el inicio. El costo (USD 100-200/mes) es mucho menor que las multas por errores.

---

## 4. Ingreso al régimen de facturación electrónica

### Proceso paso a paso

#### Paso 1: Solicitud de acceso al portal DGI eFactura
1. Ir a [servicios.dgi.gub.uy](https://servicios.dgi.gub.uy/serviciosenlinea)
2. Con tu RUC + contraseña DGI
3. Sección: "Facturación Electrónica → Solicitar acceso"
4. Recibirás credenciales para los **web services DGI** (usuario y contraseña para WSDL)

#### Paso 2: Obtener certificado digital (ver Sección 5)

#### Paso 3: Solicitar CAE (Constancia de Autorización de Emisión)
- El CAE es un rango de números autorizados para cada tipo de CFE
- Se solicita desde el portal DGI o vía web service
- Sin CAE no podés numerar tus comprobantes
- Solicitá al menos para tipos 101 (e-Ticket) y 111 (e-Factura)

#### Paso 4: Configurar el ambiente de homologación
- Todos los emisores deben **primero operar en homologación** (ambiente de pruebas)
- URL homologación: `https://efactura.dgi.gub.uy/eFact_HOMOG/`
- En homologación los CFE no tienen validez fiscal pero prueban que tu sistema funciona

#### Paso 5: Pasar a producción
- Tras completar las pruebas de homologación, solicitás acceso a producción
- DGI verifica que tu sistema emitió correctamente los 8 tipos de CFE
- URL producción: `https://efactura.dgi.gub.uy/eFact/`

---

## 5. Obtener el certificado digital X.509

El certificado digital es **obligatorio** para firmar electrónicamente los CFE. Sin él no podés emitir.

### ¿Qué es?
- Certificado de **firma electrónica avanzada** para empresas
- Estándar **X.509 con clave RSA de mínimo 1024 bits**
- Garantiza autenticidad, integridad y no-repudio del documento
- El archivo que recibirás es un **`.p12`** (también llamado `.pfx`) con:
  - El certificado público
  - La clave privada (protegida por contraseña)

### Dónde obtenerlo en Uruguay

| Proveedor | Sitio | Precio aprox. | Tiempo |
|-----------|-------|---------------|--------|
| **ABITAB** (ID Digital) | [iddigital.com.uy](https://iddigital.com.uy) | USD 60-80/año | 1-3 días |
| **Correos Uruguay** | correo.com.uy | USD 70-90/año | 3-5 días |
| **ANTEL** | antel.com.uy | USD 80-100/año | 3-7 días |

### Proceso en ABITAB (recomendado por ser el más ágil)

1. Ir a [iddigital.com.uy](https://iddigital.com.uy/es/solicitud-de-certificado/empresa/facturacion_electronica/)
2. Completar formulario con datos de la empresa
3. Pagar la tasa (efectivo en local ABITAB o tarjeta online)
4. Presentarte en local ABITAB con:
   - Cédula de identidad del representante legal
   - Formulario de solicitud impreso y firmado
   - Constancia de RUC
5. En 1-3 días hábiles recibís el `.p12` por email

> **Importante:** Guardá el archivo `.p12` y la contraseña en un lugar seguro. Si los perdés, tendrás que solicitar un nuevo certificado (costo adicional).

### Validez y renovación
- **1 año:** Precio estándar
- **2 años:** Disponible con descuento (recomendado para reducir trámites)
- El software te avisará cuando el certificado está por vencer (30 días antes)
- La renovación se hace volviendo al emisor (ABITAB, Correos, etc.)

---

## 6. Homologación ante DGI (proceso de pruebas)

La homologación es el proceso de **certificación de tu software** ante DGI. Es obligatoria antes de operar en producción.

### ¿Qué se prueba?
DGI verifica que tu sistema pueda:
1. Generar XML de CFE válido (según XSD versión 1.43.5)
2. Aplicar correctamente la firma digital XMLDSig
3. Enviar y recibir correctamente los archivos al web service DGI
4. Gestionar los 8 tipos de CFE con sus variantes
5. Numeración y series correctas según CAE asignado

### Proceso de homologación

```
1. Solicitar acceso al ambiente de homologación (portal DGI)
2. Obtener certificado digital (puede ser el mismo del paso 5)
3. Solicitar CAE de homologación
4. Emitir al menos 1 CFE de cada tipo en homologación:
   - e-Ticket (101)
   - NC e-Ticket (102)
   - ND e-Ticket (103)
   - e-Factura (111)
   - NC e-Factura (112)
   - ND e-Factura (113)
   - e-Remito (124)
   - e-Resguardo (182)
5. DGI verifica y aprueba
6. Solicitar acceso a producción
```

### Tiempo estimado
- **Para emisor (usar el software):** 2-4 semanas
- **Para proveedor habilitado (vender el software):** 3-6 meses

### Verificación de CFE emitidos
Podés verificar cualquier CFE en: [efactura.dgi.gub.uy/principal/verificacioncfe](https://www.efactura.dgi.gub.uy/principal/verificacioncfe)

---

## 7. Registro como Proveedor Habilitado DGI

Este es el trámite más importante para **poder vender tu software** legalmente como solución de facturación electrónica en Uruguay.

> **Diferencia clave:**
> - **Ser emisor electrónico:** Usar el software para facturar tu propia empresa → más simple
> - **Ser Proveedor Habilitado DGI:** Ofrecer el software a terceros como solución de facturación → requiere registro especial

### Marco legal
**Resolución DGI N° 3573/2019** — establece el "Registro de Proveedores de Software de Facturación Electrónica".

### Requisitos para inscribirse

1. ✅ **Ser emisor electrónico activo** (tu empresa ya emite CFE)
2. ✅ **Ser declarado por al menos 5 emisores electrónicos** (5 clientes reales usando tu software)
3. ✅ **Superar las pruebas de homologación** para los 8 tipos de CFE
4. ✅ **Mantener la Certificación de Validez Anual (CVA)**
5. ✅ **Ofrecer servicios EDI** (Electronic Document Interchange): envío y recepción de documentos electrónicos, ya sea propio o subcontratado

### Proceso de solicitud

1. Reunir toda la documentación
2. Presentar solicitud en: [efactura.dgi.gub.uy/principal/factura-electronica-registro-de-proveedores-habilitado](https://www.efactura.dgi.gub.uy/principal/factura-electronica-registro-de-proveedores-habilitado)
3. DGI evalúa la solicitud (puede tomar semanas)
4. Auditoría técnica del software
5. Aprobación e inclusión en el **Registro Oficial de Proveedores Habilitados** (actualmente hay ~77 proveedores)

### Certificación de Validez Anual (CVA)

- Renovación **obligatoria cada año**
- DGI verifica que tu software sigue cumpliendo los estándares actualizados
- Si no renovás la CVA, te sacan del registro de proveedores habilitados
- Implicación: actualizarte con cada cambio de normativa DGI (como el cambio a v23-2 del 3/3/2026)

### Estrategia para conseguir los 5 primeros clientes

Para cumplir el requisito de 5 declarantes antes de tener el registro, podés:
1. Ofrecerle el software **gratis o a precio de costo** a 5 amigos/conocidos empresarios
2. Contactar **asociaciones de PyMEs** (CNCS, ACDE, etc.) y ofrecer prueba gratuita
3. Hacer acuerdos con **estudios contables** para que lo prueben con sus clientes
4. Publicar en **LinkedIn** buscando beta testers

---

## 8. Obligaciones fiscales continuas

### Como empresa emisora
| Obligación | Frecuencia | Responsable |
|-----------|------------|-------------|
| Declaración IVA mensual | Mensual | Vos + contador |
| Anticipos IRAE | Mensual | Vos + contador |
| Renovación certificado digital | Anual (o cada 2 años) | Vos |
| Mantener backups de CFE emitidos | Permanente | Vos |

### Como proveedor habilitado DGI
| Obligación | Frecuencia | Detalle |
|-----------|------------|---------|
| Renovar CVA | Anual | Ante DGI |
| Actualizar XSD/normativa | Según DGI | Seguir efactura.dgi.gub.uy |
| Soporte a clientes | Continuo | SLA recomendado: < 24hs |
| Backups de operaciones | Permanente | Legal + buenas prácticas |

### Cambios normativos a tener en cuenta (2026)

- **3 de marzo de 2026:** Nuevos campos obligatorios en CFE v23-2:
  - `FmaPago` (forma de pago) ahora obligatorio en todos los CFE
  - Validación extendida del campo `Serie`
  - Nuevos campos de tipo de operación
- **31 de diciembre de 2026:** Vence período de beneficios fiscales para emisores pequeños

> El software **Factura-UY** ya incluye todos los campos del v23-2.

---

## 9. Modelo de negocio y precios de mercado

### Competidores actuales (referencia de precios)

| Proveedor | Plan básico/mes | Observaciones |
|-----------|----------------|---------------|
| Pymo (pymo.uy) | USD 15-30 | Foco PyMEs |
| Fixed (fixed.uy) | USD 20-40 | Con soporte contable |
| Memory (memory.com.uy) | USD 15-25 | + ERP integrado |
| Factura.uy | USD 10-20 | Más económico |
| EDICOM | USD 50+ | Empresas medianas/grandes |

### Estrategia de precios recomendada

**Etapa 1 — Beta (primeros 5 clientes):**
- Precio: $0 (gratuito para conseguir los 5 declarantes para DGI)
- Duración: 3-6 meses

**Etapa 2 — Lanzamiento:**
- Plan Básico: USD 15/mes (hasta 100 CFE/mes)
- Plan Profesional: USD 30/mes (hasta 500 CFE/mes)
- Plan Empresas: USD 60/mes (ilimitado + soporte prioritario)

**Etapa 3 — Escalamiento:**
- Agregar módulos: Inventario, RRHH, Cuentas corrientes
- Integración contable (Bejerman, Soft Net, etc.)
- API para integradores

### Diferenciadores para competir

1. **Simplicidad:** UI más intuitiva que los competidores
2. **Precio:** Entrar por debajo del mercado
3. **Soporte local:** Atención en español uruguayo, horario local
4. **Sin límites de usuarios:** A diferencia de algunos competidores
5. **Modo standalone:** Funciona en PC local sin depender de internet (para zonas rurales)

### Proyección de ingresos (estimado conservador)

| Clientes | Ingreso mensual | Ingreso anual |
|---------|----------------|---------------|
| 10 | USD 200 | USD 2.400 |
| 50 | USD 1.000 | USD 12.000 |
| 100 | USD 2.000 | USD 24.000 |
| 300 | USD 7.500 | USD 90.000 |

Con 100 clientes a USD 20/mes ya se cubre un sueldo digno en Uruguay.

---

## 10. Recursos y enlaces oficiales

### DGI — Facturación Electrónica
- 🌐 **Portal principal:** [efactura.dgi.gub.uy](https://www.efactura.dgi.gub.uy/)
- 📋 **Documentos técnicos y XSD:** [efactura.dgi.gub.uy/principal/ampliacion_de_contenido/documentos-de-interes](https://www.efactura.dgi.gub.uy/principal/ampliacion_de_contenido/documentos-de-interes)
- 🏢 **Registro de proveedores habilitados:** [efactura.dgi.gub.uy/principal/factura-electronica-registro-de-proveedores-habilitado](https://www.efactura.dgi.gub.uy/principal/factura-electronica-registro-de-proveedores-habilitado)
- 📖 **Guía oficial de ingreso:** [gub.uy/direccion-general-impositiva/guia-ingreso-facturacion-electronica](https://www.gub.uy/direccion-general-impositiva/guia-ingreso-facturacion-electronica)
- 🔍 **Verificar CFE:** [efactura.dgi.gub.uy/principal/verificacioncfe](https://www.efactura.dgi.gub.uy/principal/verificacioncfe)
- 💻 **Servicios en línea DGI:** [servicios.dgi.gub.uy](https://servicios.dgi.gub.uy/serviciosenlinea)

### Certificados digitales
- **ABITAB — ID Digital:** [iddigital.com.uy](https://iddigital.com.uy/es/solicitud-de-certificado/empresa/facturacion_electronica/)
- **Trámite oficial certificado empresa:** [gub.uy/tramites/firma-digital-certificado-electronico-empresa](https://www.gub.uy/tramites/firma-digital-certificado-electronico-empresa)

### Constitución de empresa
- **Crear SAS:** [empresas.gub.uy](https://empresas.gub.uy)
- **BCU — Registro de empresas:** [bcu.gub.uy](https://www.bcu.gub.uy)

### Normativa legal
- Resolución DGI N° 798/012 — Marco legal facturación electrónica
- Resolución DGI N° 3573/2019 — Registro de proveedores habilitados
- Decreto 352/012 — Reglamentación general

### Herramientas técnicas (desarrollo)
- **XSD schema DGI v1.43.5:** Descargar desde [documentos de interés](https://www.efactura.dgi.gub.uy/principal/ampliacion_de_contenido/documentos-de-interes)
- **Referencia Python:** [github.com/reingart/py_efactura_uy](https://github.com/reingart/py_efactura_uy)
- **Formato CFE v23-2:** [efactura.dgi.gub.uy/principal/ampliacion_de_contenido/-25376](https://www.efactura.dgi.gub.uy/principal/ampliacion_de_contenido/-25376)

---

## ⚡ Resumen ejecutivo — Checklist

### Para usar el software (facturar tu empresa)
- [ ] Crear empresa (SAS recomendada)
- [ ] Inscribirse en DGI (RUC + IVA)
- [ ] Obtener certificado digital .p12 (ABITAB)
- [ ] Solicitar acceso a homologación DGI
- [ ] Solicitar CAE de homologación (tipos 101 y 111 mínimo)
- [ ] Configurar Factura-UY con certificado y credenciales DGI
- [ ] Emitir CFEs de prueba en homologación
- [ ] Solicitar acceso a producción DGI
- [ ] ¡Facturar!

### Para vender el software (ser proveedor habilitado)
- [ ] Todo lo anterior ✅
- [ ] Conseguir 5 clientes beta que declaren tu software ante DGI
- [ ] Completar pruebas de homologación para los 8 tipos de CFE
- [ ] Presentar solicitud de Proveedor Habilitado ante DGI
- [ ] Mantener CVA anual
- [ ] Actualizar software ante cambios de normativa DGI

---

> **Descargo de responsabilidad:** Esta guía es informativa y fue elaborada en base a fuentes oficiales de DGI Uruguay (marzo 2026). Para decisiones legales y fiscales, consultá siempre con un contador o asesor legal matriculado en Uruguay.

---

*Factura-UY — Software de facturación electrónica para Uruguay*
*Código fuente en: `/home/user/AcrecerMarketing/factura-uy/`*

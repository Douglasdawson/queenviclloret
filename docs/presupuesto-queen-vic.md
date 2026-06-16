# Presupuesto — Queen Vic Sports Bar

**Sitio web público multiidioma (SSR) — diseño y desarrollo a medida**

---

| | |
|---|---|
| **Cliente** | Queen Vic Sports Bar — Lloret de Mar (Costa Brava) |
| **Atención** | Ryan (propietario) |
| **Dirección** | Carrer de la Costa de Carbonell, 1 · Lloret de Mar |
| **Nº de presupuesto** | QV-2026-001 |
| **Fecha** | 16 de junio de 2026 |
| **Validez de la oferta** | 30 días |

---

## 1. Resumen ejecutivo

Diseño y desarrollo de un **sitio web a medida** para el Queen Vic Sports Bar: renderizado en
servidor (SSR) para máximo posicionamiento, **5 idiomas** (EN/ES/CA/FR/NL), diseño propio
"Heritage Audaz", contenido deportivo dinámico (incluida la página del **Mundial 2026 con
resultados en vivo**) y formularios de contacto y reservas.

Rendimiento auditado: **Lighthouse móvil 100/100/100** (Accesibilidad · Buenas prácticas · SEO).

> Este presupuesto cubre el **sitio público**. El panel de administración / CRM ya desarrollado
> queda reservado como **ampliación futura** (ver Anexo B).

---

## 2. Alcance entregado y valor de mercado

| # | Bloque | Detalle | Valor de mercado |
|:-:|--------|---------|-----------------:|
| 1 | **Web pública multiidioma (SSR)** | 10 páginas, 5 idiomas, diseño a medida "Heritage Audaz", optimización de imágenes (AVIF/WebP), SEO/GEO (JSON-LD, sitemap hreflang, robots.txt, llms.txt), Lighthouse 100 | 3.200 € |
| 2 | **Contenido deportivo dinámico** | Feed de eventos + página Mundial 2026 con resultados en vivo, importación automática desde TheSportsDB con auto-publicación + tareas programadas | 1.200 € |
| 3 | **Formularios públicos** | Contacto + reservas con consentimiento GDPR y notificación por email al local | 500 € |
| 4 | **Infraestructura, seguridad y puesta en marcha** | SSR, CSP/Helmet, rate limiting, despliegue Replit + BD Neon, configuración de producción | 700 € |
| | **Valor de mercado total** | | **5.600 €** |

*Referencia: una web profesional a medida en España se sitúa entre 2.000 € y 8.000 € (fuentes de
mercado 2025–2026). Un sitio SSR multiidioma con datos deportivos en vivo se ubica en la franja
media-alta de ese rango.*

---

## 3. Precio aplicado

Como **condición especial de lanzamiento (primer cliente)**, se aplica un precio único muy por
debajo del valor de mercado:

| Concepto | Valor de mercado | Precio aplicado |
|----------|-----------------:|----------------:|
| Desarrollo del sitio público (pago único) | 5.600 € | **1.200 €** |

> **Ahorro para el cliente: 4.400 €.** Precio aplicado en concepto de colaboración inicial; las
> ampliaciones futuras (CRM, nuevas funciones) se presupuestarán a tarifa estándar.

---

## 4. Mantenimiento mensual — elige plan

El sitio es **dinámico** (base de datos, tareas automáticas de fixtures, formularios, datos en
vivo), por lo que necesita supervisión continua para seguir online, seguro y al día. Dos opciones:

| | **Básico** | **Completo** |
|---|:---:|:---:|
| **Precio** | **60 €/mes** | **120 €/mes** |
| Hosting gestionado (Replit + Neon) | ✓ | ✓ |
| Monitorización (web, BD y crons de fixtures) | ✓ | ✓ |
| Parches de seguridad críticos + SSL | ✓ | ✓ |
| Copia de seguridad de la base de datos | ✓ | ✓ |
| Continuidad del feed deportivo en vivo | ✓ | ✓ |
| Soporte por email ante incidencias | ✓ | ✓ (prioritario) |
| Cambios de contenido incluidos (textos, fotos, horarios, precios) | — | hasta ~2 h/mes |
| Actualización proactiva de dependencias y mejoras menores | — | ✓ |

*El plan **Básico** mantiene el sitio vivo y seguro; el plan **Completo** añade trabajo activo
sobre la web (cambios y mejoras) sin facturar por horas. Se puede subir de Básico a Completo en
cualquier momento.*

---

## 5. Costes de terceros (aproximados, repercutidos)

- **Dominio:** ~12–15 €/año.
- **Hosting Replit Autoscale + base de datos Neon:** incluido en el mantenimiento mensual.
- **Email (Resend):** plan gratuito suficiente al inicio (necesario para los avisos de los formularios).
- **TheSportsDB (clave Patreon, opcional):** ~9 €/mes para listas completas de fixtures.

---

## 6. Totales

| Concepto | Importe |
|----------|--------:|
| **Desarrollo del sitio público (pago único)** | **1.200 €** |
| **Mantenimiento mensual — Básico** | **60 €/mes** |
| **Mantenimiento mensual — Completo** | **120 €/mes** |

> Todos los importes se expresan en euros y **no incluyen el 21 % de IVA**.
> Pago único con IVA: **1.452 €**. Mantenimiento con IVA: **72,60 €/mes** (Básico) ·
> **145,20 €/mes** (Completo).

---

## 7. Condiciones

- **Forma de pago:** 50 % a la aceptación y 50 % a la publicación en producción. El mantenimiento
  se abona por adelantado (mensual o trimestral).
- **Validez de la oferta:** 30 días desde la fecha indicada.
- **Garantía:** 30 días de corrección de errores sin coste tras el lanzamiento.
- **Propiedad:** el código y los contenidos del sitio público pasan a ser propiedad del cliente
  una vez liquidado el pago único.

---
---

## Anexo A — Inventario técnico del sitio público

**Frontend / SSR**
- 10 páginas renderizadas en servidor (React + SSR), con hidratación en cliente.
- Routing con prefijo de idioma y redirección automática por `Accept-Language`.
- Contenido deportivo dinámico (feed de eventos + Mundial 2026 en vivo).

**Sistema de diseño a medida ("Heritage Audaz")**
- Paleta propia en OKLCH, tipografía variable autoalojada (Bricolage Grotesque).
- Componentes propios: paneles flotantes, cabecera píldora sticky, sellos perforados, laurel de
  aniversario, tickets de programa para fixtures. Documentado en `PRODUCT.md` / `DESIGN.md`.

**Internacionalización (i18n)**
- 5 idiomas completos (EN/ES/CA/FR/NL), ~169 cadenas por idioma (≈845 traducciones).
- Cambio de idioma como navegación real (SEO-friendly) + validador de consistencia de claves.

**SEO / GEO**
- JSON-LD (BarOrPub + eventos), `sitemap.xml` con hreflang, `robots.txt` (permite bots de IA),
  `llms.txt`. Lighthouse móvil 100/100/100.

**Backend / API**
- Express 5 + TypeScript, render SSR cacheado por idioma+ruta con nonce CSP por petición.
- API pública (eventos, Mundial en vivo, contacto, reservas, baja GDPR), capa DAO y validación Zod.

**Base de datos (PostgreSQL / Neon)**
- Esquema Drizzle ORM, borrado lógico (soft delete) y registro de auditoría inmutable.

**Integraciones**
- TheSportsDB (import automático de fixtures con upsert idempotente).
- Proveedores de email (Resend) y WhatsApp (Cloud API) listos para activar.

**Automatización**
- Tareas programadas (sincronización de fixtures, limpieza) protegidas con advisory locks de
  Postgres (seguras en Autoscale).

**Seguridad**
- Helmet + CSP con nonce, rate limiting en 3 capas, sesiones seguras, hashing bcrypt, logs Pino
  con redacción de credenciales y PII.

**Infraestructura / DevOps**
- Despliegue en Replit Autoscale + BD Neon. Pipeline de optimización de imágenes (AVIF/WebP, 3
  tamaños responsivos, manifest tipado). Build dual cliente + SSR.

**Calidad**
- Tests Vitest (unitarios) + Playwright (e2e).

---

## Anexo B — Ampliación futura (ya desarrollada, fuera del alcance actual)

Panel de administración / CRM completo, disponible para activar más adelante:
- **Leads / CRM:** vista tabla + tablero kanban (arrastrar y soltar), ficha detallada con
  etiquetas, notas y línea de tiempo de actividad, atribución UTM y consentimiento GDPR.
- **Eventos:** alta/edición, publicación, destacados, sincronización de fixtures.
- **Reservas:** gestión, confirmación/cancelación, aforo.
- **Campañas:** email/WhatsApp con segmentación y seguimiento de envíos.
- **Dashboard** y **login con control de acceso por roles**.

*Valor de mercado de referencia de un CRM a medida en España: desde 8.000 €. Se presupuestará
por separado cuando se decida activarlo.*

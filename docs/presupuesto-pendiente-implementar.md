# Queen Vic — Presupuesto a Ryan: alcance comprometido y pendiente de implementar

> Estado: **presupuesto enviado** (16/06/2026). Este documento recoge **qué se ha prometido y
> presupuestado** para poder implementarlo *si Ryan acepta*. Documentos comerciales:
> `docs/presupuesto-queen-vic.html` (diseñado, 3 páginas, marca Dawson Webs) y
> `docs/presupuesto-queen-vic.md` (texto plano).

## Marco comercial
- **Proveedor:** Dawson Webs — dawsonwebs.com · ivanrd9@me.com (marca del usuario).
- **Cliente:** Ryan, propietario de Queen Vic Sports Bar (Lloret de Mar).
- **Alcance vendido = SOLO SITIO PÚBLICO.** El panel admin/CRM (ya construido) queda **fuera**,
  como ampliación futura (valor de mercado de referencia desde 8.000 €).
- **Enfoque estrella: GEO** (Generative Engine Optimization) — aparecer en respuestas de
  ChatGPT/Perplexity/Google AI/Gemini. Es lo que más le interesa a Ryan.
- **Precios (sin IVA):**
  - Desarrollo sitio público: **1.200 €** aplicado (valor de mercado 5.600 €, descuento "primer cliente").
  - Mantenimiento **Básico 40 €/mes** · **Completo 80 €/mes** (incluye dominio + HTTPS + hosting + copias).
  - Add-on **GEO Monitor automatizado: 450 € (pago único)**, sin Google AI Overviews.
- Pago 50 % aceptación / 50 % publicación. Mantenimiento por adelantado. Validez 30 días.

## Pendiente de IMPLEMENTAR / VERIFICAR si acepta

### 1. GEO Monitor automatizado — NUEVO desarrollo (add-on 450 €) — **no existe aún**
Cron periódico (mensual/trimestral) usando la infra de crons + advisory locks ya existente:
- Set fijo de consultas en **5 idiomas** ("dónde ver el partido en Lloret", "best sports bar Lloret"…).
- Consultar vía API: **Perplexity (Sonar)** + **Claude/OpenAI con búsqueda web** (proveedor IA de
  Anthropic ya cableado en `server/ai/`; hoy es noop → requiere `AI_PROVIDER=anthropic` + claves).
- Detectar menciones y **citas de `queenviclloret.com`** en las respuestas.
- Guardar **histórico en BD** (nueva tabla vía DAO) + generar **informe automático** (% aparición,
  citado/no, evolución vs. periodo anterior) y entregarlo por **email/WhatsApp** (+ PDF opcional).
- **SIN Google AI Overviews** (descartado para evitar proveedor SERP de pago ~15–30 €/mes).
- El informe queda incluido en el **plan Completo** tras la entrega.
- Coste de terceros: llamadas a APIs ≈ 2–5 €/ejecución (pass-through).

### 2. Notificaciones de reserva/contacto por **WhatsApp** (no email) — verificar/cablear
El presupuesto promete **notificación por WhatsApp al local** en las peticiones de reserva.
- Usar el proveedor `server/services/providers/whatsapp/` (Cloud API) ya existente.
- Requiere alta de **número de WhatsApp Business + cuenta Meta**. Coste Meta mínimo por
  conversación (franja mensual gratuita) — pass-through.

### 3. Fixtures visibles **sin** panel admin
Como el CRM queda fuera del alcance, los eventos deben publicarse solos:
- Poner **`FIXTURES_AUTO_PUBLISH=true`** para que el feed de "Qué hay" y el Mundial 2026 se
  publiquen sin revisión manual en el admin.
- (Opcional) clave **Patreon de TheSportsDB** (~9 €/mes) para listas completas; el nivel gratis
  no tiene coste por llamada pero devuelve ~1 evento por liga.

### 4. GEO base — ya existe, verificar/reforzar antes de prometerlo
Ya implementado (confirmar que sigue OK): `llms.txt`, `robots.txt` permitiendo
GPTBot/ClaudeBot/PerplexityBot/Google-Extended, JSON-LD (BarOrPub + eventos), sitemap hreflang,
HTML semántico SSR, 5 idiomas, Lighthouse 100. Posible refuerzo futuro: FAQPage/Event schema,
ampliar `llms.txt`, alinear con Google Business Profile.

### 5. Puesta en marcha / hosting (incluido en mantenimiento)
Despliegue Replit Autoscale + Neon, dominio + HTTPS + copias. Configurar producción.

## Cuentas / claves de terceros necesarias
- Anthropic + Perplexity (+ OpenAI opcional) API keys → para el GEO Monitor.
- WhatsApp Business Cloud API (Meta) → notificaciones.
- TheSportsDB Patreon (opcional) → fixtures completos.
- Dominio + Replit + Neon → hosting.

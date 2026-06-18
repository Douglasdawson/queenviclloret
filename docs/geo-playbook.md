# Queen Vic — Playbook GEO (Mundial 2026)

Acciones para posicionar al Queen Vic en buscadores de IA (ChatGPT, Perplexity, Google AI,
Gemini) y en búsqueda local. La parte **on-site** está hecha y desplegada en dos rondas
(commit `3c09156` y la ronda de páginas por partido/equipo/deporte + schema + sitemap con
freshness). Este documento cubre lo que **da más resultado y vive fuera del código**.

> ⚠️ **La verdad incómoda:** para un local, ~**60–70%** de que una IA te cite es **off-site**
> (lo de este documento). La web ya es muy fuerte, pero el código es solo el ~25–30% — necesario
> pero **no suficiente** para ser top-1. Lo de abajo es lo que de verdad mueve la aguja.

---

## 0. Baseline medido (17/06/2026) — el "antes"

Búsqueda real de *"best sports bar Lloret de Mar watch football / World Cup"* y *"dónde ver el
fútbol en Lloret… pantalla grande"*:

- **El Queen Vic NO aparece** en los resultados de ninguna de las dos consultas.
- La lista de **Yelp "Best Sports Bars near Lloret de Mar"** lista Bar El Pirata, The Michael
  Collins (a 40 mi) y Futballarium — **sin el Queen Vic**.
- Hay una pregunta abierta en un **grupo de Facebook**: *"Good sports bar to watch FIFA World
  Cup?"* en la zona → oportunidad de respuesta directa.
- Dominan Instagram reels y listicles genéricos; **nadie "posee" la consulta en Lloret**.

> Conclusión: hueco abierto. Tras desplegar + ejecutar este playbook, repetir la medición
> (es la versión manual del GEO Monitor automatizado del presupuesto).

---

## 0.5 Dónde está la palanca (prioriza por peso)

Orden de impacto para un local en buscadores de IA (aprox., síntesis de la investigación):

| Palanca | Peso aprox. | Estado hoy |
|---|---|---|
| **Bing indexado** (alimenta ChatGPT) | *gating* | ❓ sin verificar → **si no estás en Bing, ChatGPT no te cita** |
| **Google Business Profile** completo | ~30% | ⚠️ incompleto |
| **Reseñas** (volumen + recientes + responder) | ~20% | ⚠️ pocas vs Piccadilly/El Pirata |
| **Citas externas + NAP consistente** (TripAdvisor, Yelp, Reddit) | ~15% | 🔴 teléfono mal en Yelp |
| **On-site** (schema, contenido, FAQ, llms.txt) | ~25–30% | ✅ hecho (2 rondas) |

**Conclusión:** el on-site ya está. Las 4 primeras filas son tuyas (Ryan) y son lo decisivo.
Empieza por **Bing + GBP + corregir el teléfono de Yelp** esta semana.

---

## 1. Desplegar (hecho a medias)
- ✅ Cambios en `main` (`3c09156`).
- 🔴 **Verificado 18/06/2026: `queenviclloret.com` da 404 — el sitio nuevo NO está desplegado.**
  La web viva sigue siendo la antigua de WordPress en `queenviclloret.es` (200). Hasta desplegar,
  **no apuntar el GBP ni los directorios a .com** (enlazaría a una página rota).
- ⏳ **Tú:** Replit → Pull → Deployments → Redeploy. Decidir dominio definitivo (.com vs .es) y 301s.
- Tras desplegar, comprobar en producción: `/_robots.txt_`, `/llms.txt`, y la ficha de
  `/en/world-cup-2026` (debe contener el JSON-LD BarOrPub + FAQPage).

---

## 2. Google Business Profile (GBP) — el mayor multiplicador
La IA y Google AI Overviews tiran masivamente de la ficha de Google para consultas locales.

> **Auditoría de la ficha pública (18/06/2026) — el "antes" real.** Ficha = "Queen Vic Terrace Pub",
> **4,3★ · 471 reseñas** (el dueño responde). Hallazgos críticos:
> - 🔴 **Categoría = "Pub"** (única). Competidores como *El Pub* y *Piccadilly Sports Bar* sí están
>   como **Bar deportivo** → el Queen Vic no compite por "dónde ver el fútbol/Mundial en Lloret".
> - 🔴 **Sin teléfono** ("Añadir número de teléfono del sitio").
> - 🔴 **Sin horario** ("Añadir horario") → tampoco hay horas especiales de día de partido.
> - ⚠️ **Web = `queenviclloret.es`** (WP antiguo); la nueva `.com` da 404 (ver §1).
> - ⚠️ **Nombre** "Terrace Pub" ≠ marca "Sports Bar" → decisión: usar el nombre del rótulo real
>   (cambiar a "Sports Bar" sin rótulo que lo respalde puede suspender la ficha).
> - ✅ Atributos ya muy completos (terraza, deportes, música/actuaciones en directo, karaoke, WiFi
>   gratis, grupos, turistas, reservas, accesible, pagos con tarjeta/NFC).
> Detalle completo y valores para aplicar en `docs/informe-gbp-ryan.md`. Evidencia en
> `docs/_gbp-evidence/`.

**Checklist:** *(aplicado 18/06/2026 vía panel GBP, en revisión de Google ~10 min)*
- [x] Categoría principal: **Sports bar** ✅ (Pub pasa a secundaria). Antes: solo "Pub".
- [x] Teléfono **+34 674 46 12 20** ✅ (antes: ausente). NAP dirección ya correcta.
- [x] Horario: a diario **19:00–03:00** ✅ (antes: ausente). Falta: horas especiales de día de partido.
- [x] Atributos ✅ ya muy completos (terraza, deportes, música en directo, WiFi, grupos, reservas…).
- [ ] Web: ⏸️ en pausa — `queenviclloret.com` da 404; la ficha sigue en `queenviclloret.es` (vivo).
- [ ] Fotos recientes de noche de partido / pantalla gigante → **acción de Ryan** (aportar material).
- [x] Descripción optimizada ✅ (antes: nota operativa pobre). **Post del Mundial** publicado ✅.
- [ ] **Sección Preguntas y respuestas**: pendiente (autorrespuesta; opcional).
- [x] Enlace de reseñas para el QR ✅ → `https://g.page/r/CZ81ipDBuhxrEBM/review`
- [ ] Nombre de la ficha: ⏸️ "Queen Vic Terrace Pub" — decidir según rótulo real (no forzar "Sports Bar").

### Texto de Post GBP (5 idiomas)
- **EN:** Watch every FIFA World Cup 2026 match LIVE at Queen Vic — Lloret's biggest outdoor
  screen (200"), a 1,250 m² terrace and room for 700+. English commentary on the big games.
  Book ahead for match days.
- **ES:** Vive todos los partidos del Mundial 2026 EN DIRECTO en el Queen Vic — la mayor
  pantalla exterior de Lloret (200"), 1.250 m² de terraza y aforo para 700+. Comentario en
  inglés en los partidos grandes. Reserva en días de partido.
- **CA:** Viu tots els partits del Mundial 2026 EN DIRECTE al Queen Vic — la pantalla exterior
  més gran de Lloret (200"), 1.250 m² de terrassa i aforament per a 700+. Reserva els dies de
  partit.
- **FR:** Vivez chaque match de la Coupe du Monde 2026 EN DIRECT au Queen Vic — le plus grand
  écran extérieur de Lloret (200"), 1 250 m² de terrasse, place pour 700+. Réservez les jours
  de match.
- **NL:** Bekijk elke WK-wedstrijd 2026 LIVE bij Queen Vic — Llorets grootste buitenscherm
  (200"), 1.250 m² terras en plek voor 700+. Reserveer op wedstrijddagen.

### Q&A para GBP (y reflejo del sitio)
1. **EN:** Where can I watch the World Cup in Lloret de Mar? → At Queen Vic Sports Bar. Every
   2026 match live on the biggest outdoor screen in town, 1,250 m² terrace, room for 700+.
2. **ES:** ¿Dónde ver el Mundial en Lloret de Mar? → En el Queen Vic Sports Bar. Todos los
   partidos de 2026 en directo en la mayor pantalla exterior, terraza de 1.250 m², aforo 700+.
3. **EN:** Do I need to book? → Recommended for big match days and groups.

---

## 3. Indexación rápida (Bing alimenta ChatGPT) — **empieza por aquí**
- [ ] **Bing Webmaster Tools** (gating de ChatGPT): verificar, enviar `sitemap.xml`, *Submit
      URLs*. **Si no estás indexado en Bing, ChatGPT no te puede citar.**
- [ ] **Google Search Console**: verificar dominio, enviar `sitemap.xml`, *Inspección de URL*.
- [ ] Solicitar indexación de las páginas nuevas de alto valor (en `/en` y un par de locales):
      - `/world-cup-2026` y partidos clave `/world-cup-2026/{equipo-v-equipo}`
      - equipos `/world-cup-2026/team/{england|spain|netherlands|france}`
      - deportes evergreen `/watch/{premier-league|formula-1|motogp|rugby-league}`
- El `sitemap.xml` ya incluye estas URLs con `<lastmod>` (señal de frescura) — solo hay que
  reenviarlo tras cada redeploy.

---

## 4. Directorios y consistencia NAP
- [ ] **Yelp**: reclamar/crear la ficha y entrar en la lista "Best Sports Bars near Lloret de
      Mar" (hoy no está). Corregir teléfono (Yelp mostraba 972 369 568 ≠ +34 674 46 12 20).
- [ ] **TripAdvisor**: mismo NAP, fotos, responder reseñas, mencionar "World Cup 2026 / big
      screen / terrace" en la descripción.
- [ ] **Facebook / Instagram**: bio con dirección + "Watch the World Cup — 200" screen, 700+".
- [ ] **MapQuest / Apple Maps / Bing Places**: NAP idéntico.
- [ ] Responder la pregunta del **grupo de Facebook** ("Good sports bar to watch FIFA World
      Cup?") recomendando el Queen Vic (de forma honesta y útil).

---

## 5. Reseñas (alimentan a Google y a los LLMs)
Pedir reseñas recientes que mencionen los términos clave. Tarjeta de mesa con **QR al enlace
de reseña de Google** (GBP → "Pide reseñas" da un enlace corto).

**Texto QR / tarjeta (5 idiomas):**
- **EN:** Enjoyed the match on the big screen? A 30-second Google review helps other fans find
  us. Thank you! → [QR]
- **ES:** ¿Has disfrutado del partido en la pantalla gigante? Una reseña en Google de 30
  segundos ayuda a otros aficionados a encontrarnos. ¡Gracias! → [QR]
- **CA:** T'ha agradat el partit a la pantalla gegant? Una ressenya a Google de 30 segons ens
  ajuda. Gràcies! → [QR]
- **FR:** Vous avez aimé le match sur grand écran ? Un avis Google de 30 secondes nous aide
  beaucoup. Merci ! → [QR]
- **NL:** Genoten van de wedstrijd op het grote scherm? Een Google-review van 30 seconden helpt
  ons enorm. Bedankt! → [QR]

---

## 6. Re-medir (cerrar el bucle)
A las ~2-4 semanas del despliegue + GBP, repetir las consultas en ChatGPT, Perplexity, Google
AI y Claude. Además del baseline, probar las nuevas intenciones que ahora cubre la web:
- **EN:** "where to watch the football / Premier League in Lloret de Mar", "where to watch
  England v {rival} in Lloret", "sports bar Lloret big screen tonight".
- **ES:** "dónde ver el fútbol / la Premier en Lloret de Mar", "dónde ver a España en Lloret".
- **NL:** "waar voetbal kijken Lloret de Mar"; **FR:** "où regarder le foot à Lloret de Mar".

Objetivo: que el Queen Vic aparezca citado en ≥50% de las consultas relevantes. Esto es
exactamente lo que automatiza el **GEO Monitor** del presupuesto.

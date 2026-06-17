# Queen Vic — Playbook GEO (Mundial 2026)

Acciones para posicionar al Queen Vic en buscadores de IA (ChatGPT, Perplexity, Google AI,
Gemini) y en búsqueda local. La parte **on-site** ya está hecha y desplegada (commit
`3c09156`). Este documento cubre lo que **da más resultado y vive fuera del código**.

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

## 1. Desplegar (hecho a medias)
- ✅ Cambios en `main` (`3c09156`).
- ⏳ **Tú:** Replit → Pull → Deployments → Redeploy.
- Tras desplegar, comprobar en producción: `/_robots.txt_`, `/llms.txt`, y la ficha de
  `/en/world-cup-2026` (debe contener el JSON-LD BarOrPub + FAQPage).

---

## 2. Google Business Profile (GBP) — el mayor multiplicador
La IA y Google AI Overviews tiran masivamente de la ficha de Google para consultas locales.

**Checklist:**
- [ ] Categoría principal: **Sports bar** (secundaria: Bar, Pub).
- [ ] NAP EXACTO igual que el sitio: `Carrer de la Costa de Carbonell, 1 · 17310 Lloret de Mar`
      · `+34 674 46 12 20`.
- [ ] Horario: a diario 19:00–03:00 (ajustar días de partido).
- [ ] Atributos: asiento exterior / terraza, deportes en directo en TV, pantalla grande,
      apto para grupos, accesible.
- [ ] Web: enlazar a `https://queenviclloret.com/`.
- [ ] Fotos recientes: terraza llena en noche de partido, la pantalla gigante encendida.
- [ ] **Post** (repetir semanal durante el torneo) — ver textos abajo.
- [ ] **Sección Preguntas y respuestas**: publicar tú mismo las 2-3 preguntas clave con su
      respuesta (ver abajo). Se puede preguntar y autorresponder.

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

## 3. Indexación rápida (Bing alimenta ChatGPT)
- [ ] **Google Search Console**: verificar dominio, enviar `sitemap.xml`, *Inspección de URL*
      → Solicitar indexación de `/` y `/en/world-cup-2026` (y un par de locales).
- [ ] **Bing Webmaster Tools**: verificar, enviar `sitemap.xml`, *Submit URLs*. (Bing potencia
      la búsqueda de ChatGPT → doble beneficio GEO.)

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
A las ~2-4 semanas del despliegue + GBP, repetir las consultas del baseline en ChatGPT,
Perplexity y Google. Objetivo: que el Queen Vic aparezca citado para *"dónde ver el Mundial en
Lloret de Mar"*. Esto es exactamente lo que automatiza el **GEO Monitor** del presupuesto.

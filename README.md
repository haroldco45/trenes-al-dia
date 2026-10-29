# Trenes al Día

App ciudadana (PWA) de **Vibras Positivas HM** para ver las vías reales de los trenes en España, por dónde va cada tren y el estado de la red, y para seguir el caso del choque de trenes de Urda (Toledo) del 28 de octubre de 2026. En español e inglés.

URL principal: **https://trenes-al-dia.netlify.app** (repo `haroldco45/trenes-al-dia`).

## Qué trae
- **Hoy**: cifras del caso, trenes en este momento, estado de la red, lo último y video. Se renueva cada vez que se vuelve a la app.
- **Mapa de vías**: vías reales (OpenRailwayMap), corredores Madrid–Andalucía, Toledo, Valencia y Barcelona, trenes de alta velocidad según horario oficial y Cercanías en vivo, más el lugar aproximado del choque.
- **Trenes**: busca tu tren por número, destino o línea, con su estado y avance.
- **El caso**: qué se sabe, la causa, cronología (hora España y Colombia), teléfonos para familiares y fuentes.
- **Noticias**: búsqueda en vivo al abrir y mientras escribes, más las del robot y videos.
- **Viaja seguro**: consejos prácticos para pasajeros.

## Archivos
| Archivo | Para qué |
|---|---|
| `index.html`, `styles.css`, `app.js` | La app |
| `manifest.json`, `sw.js`, `img/` | Instalable y sin conexión, imagen para compartir |
| `data/caso.json` | Hechos del caso y **estado de la red** (editar a mano cuando cambie) |
| `data/corredores.json` | Corredores y estaciones del mapa |
| `data/horarios-hoy.json` | Trenes de hoy (lo genera el robot cada mañana) |
| `data/noticias.json` | Noticias y videos (lo genera el robot cada 30 min) |
| `scripts/robot.mjs`, `scripts/horarios.mjs`, `scripts/lib.mjs` | El robot |
| `.github/workflows/robot.yml` | Corre el robot cada 30 minutos |
| `netlify/functions/trenes.mjs` | `/api/trenes`: Cercanías en vivo (Renfe GTFS-Realtime) |
| `netlify/functions/noticias.mjs` | `/api/noticias`: búsqueda en vivo |
| `netlify.toml`, `package.json` | Configuración de Netlify |

## Para que funcione completo
1. Subir todo al repo `haroldco45/trenes-al-dia` (rama `main`).
2. GitHub → Settings → Actions → General → **Read and write permissions**.
3. Actions → "Robot de noticias y horarios" → **Run workflow** la primera vez.
4. Netlify: sitio conectado al repo, nombre `trenes-al-dia`. Las funciones `/api/...` solo corren en Netlify; en GitHub Pages la app usa las de Netlify automáticamente.

## Límites honestos
Los trenes de alta velocidad se ubican por su **horario oficial**, no por GPS (Renfe no publica esas posiciones como datos abiertos). Cercanías sí es posición real. La app no es un sistema de seguridad ni reemplaza a Adif, Renfe, Iryo, Ouigo o el 112.

Datos: Renfe Data (CC BY 4.0), OpenStreetMap/OpenRailwayMap, Wikimedia Commons y los medios citados.

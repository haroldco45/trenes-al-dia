/* Trenes al Día — Vibras Positivas HM
   Mapa de vías reales, trenes en vivo (Cercanías) y estimados por horario oficial
   (alta velocidad y larga distancia), estado de la red y seguimiento del caso
   del choque de trenes de Urda (Toledo). */
'use strict';

// ---------- Textos ES / EN ----------
const T = {
  es: {
    lema: 'Vías, trenes y el caso de Toledo', hEspana: 'España', hColombia: 'Colombia', actualizar: 'Actualizar', actualizando: 'Actualizando…',
    tHoy: 'Hoy', tMapa: 'Mapa de vías', tTrenes: 'Trenes', tCaso: 'El caso', tNoticias: 'Noticias', tSeguro: 'Viaja seguro',
    enSeguimiento: 'En seguimiento', enEsteMomento: 'En este momento', estadoRed: 'Estado de la red', ultimas: 'Lo último', verTodas: 'Ver todas', videoDia: 'Video',
    dVivo: 'trenes de Cercanías con posición en vivo', dMarcha: 'trenes de larga distancia en marcha según horario', dSusp: 'trenes del día afectados por suspensión', dNoticias: 'noticias del caso en las últimas 24 horas',
    avisoTit: 'Esta app no es un sistema de seguridad.', avisoTxt: 'Muestra datos abiertos de Renfe y horarios oficiales. Las posiciones de alta velocidad son estimadas. Sigue siempre las indicaciones del personal, de Adif, de tu operador y del 112.',
    fVias: 'Vías reales', fEstimados: 'Larga distancia (estimado)', fVivo: 'Cercanías en vivo',
    lEst: 'Según horario', lVivo: 'Posición real', lRetraso: 'Con retraso', lChoque: 'Lugar del choque (aprox.)',
    notaMapa: 'Las vías son las reales (OpenRailwayMap). Los trenes de alta velocidad se ubican según su horario oficial, no por GPS. Para la posición oficial consulta el', visorRenfe: 'visor de Renfe en tiempo real',
    buscaTren: 'Busca tu tren: número, destino o línea', buscaNoticia: 'Buscar en vivo: víctimas, Adif, Iryo, investigación…',
    queSabe: 'Qué se sabe', causa: 'La causa', cronologia: 'Cronología', telefonos: 'Teléfonos para familiares', fuentes: 'Fuentes', videos: 'Videos',
    buscar: 'Buscar', hecho: 'Software por', verRenfe: 'Ver posición oficial en Renfe del', proxSalidas: 'Próximas salidas', sinSalidas: 'No hay más salidas hoy en esta estación.', noEncontrado: 'Ese tren no circula ahora o no está en los corredores de la app. Prueba en el visor oficial de Renfe.', buscaMapa: 'Número de tren o línea', creditos: 'Datos: Renfe Data (CC BY 4.0), OpenStreetMap y OpenRailwayMap (ODbL / CC BY-SA), fotos de Wikimedia Commons y de los medios citados.',
    e_en_marcha: 'En marcha', e_en_estacion: 'En estación', e_por_salir: 'Por salir', e_programado: 'Programado', e_llego: 'Llegó', e_suspendido: 'Suspendido', e_confirmar: 'Confirma con tu operador', e_llegando: 'Llegando', e_retraso: 'Retraso',
    todos: 'Todos', cercanias: 'Cercanías en vivo', proxima: 'Próxima parada', salida: 'Salida', llegada: 'Llegada', verMapa: 'Ver en el mapa', minRetraso: 'min de retraso', puntual: 'puntual',
    sinHorarios: 'Los horarios de hoy aparecen cuando el robot los baja de Renfe (cada mañana). Mientras tanto puedes ver los trenes de Cercanías en vivo y el estado de la red.',
    horariosDe: 'Horarios oficiales de Renfe del', sinVivo: 'La posición en vivo de Cercanías se muestra en la versión de Netlify.', vivoError: 'No se pudo leer la posición en vivo de Renfe ahora. Se reintenta sola.',
    vivoOk: 'Cercanías en vivo: datos abiertos de Renfe, actualizados', choque: 'Lugar aproximado del choque', choqueTxt: 'Km 118 de la línea Madrid–Sevilla, entre Mora, Los Yébenes y Urda.',
    hace: 'hace', min: 'min', h: 'h', ahora: 'ahora', nueva: 'Nueva', horaCO: 'h Colombia', horaES: 'h España', buscando: 'Buscando en vivo…', enVivo: 'resultados en vivo', sinRes: 'No hay noticias con esa búsqueda. Prueba otra palabra.', sinApi: 'Mostrando las noticias que trajo el robot.',
    aprox: 'aprox.', sinTrenes: 'No hay trenes con ese filtro ahora.', trenesDia: 'trenes hoy en los corredores', vigente: 'Vigente', desdeHasta: 'del', al: 'al',
    est_suspendido: 'Suspendido', est_alterado: 'Alterado', est_parcial: 'Servicio parcial', fechaHoy: 'Actualizado', cronoNota: 'Horas de España y de Colombia',
    guiaTit: 'Para viajar con más tranquilidad',
    guia: [
      ['Antes de salir', ['Consulta el estado de tu tren con tu operador (Renfe, Iryo, Ouigo) el mismo día.', 'Mira en "Estado de la red" si tu corredor tiene suspensiones o cambios.', 'Comparte con tu familia el número de tren y el número de coche y asiento.']],
      ['Al subir', ['Ubica las salidas de emergencia y los martillos rompecristales de tu coche.', 'Lee la tarjeta de seguridad y fíjate dónde está el intercomunicador con el personal.', 'Deja el pasillo libre de maletas: es la ruta de evacuación.']],
      ['Si algo pasa', ['Mantén la calma y sigue las instrucciones del personal del tren.', 'No bajes a la vía por tu cuenta: puede haber trenes y tensión eléctrica en la catenaria.', 'Llama al 112 y di el número de tren y el kilómetro o la estación más cercana.']],
      ['Si buscas a un familiar', ['Renfe: +34 900 10 10 20 · Iryo: +34 900 001 403.', '112 Castilla-La Mancha: +34 900 122 112.', 'Usa solo canales oficiales y desconfía de mensajes que piden dinero o datos.']]
    ]
  },
  en: {
    lema: 'Tracks, trains and the Toledo case', hEspana: 'Spain', hColombia: 'Colombia', actualizar: 'Refresh', actualizando: 'Refreshing…',
    tHoy: 'Today', tMapa: 'Track map', tTrenes: 'Trains', tCaso: 'The case', tNoticias: 'News', tSeguro: 'Travel safe',
    enSeguimiento: 'Following', enEsteMomento: 'Right now', estadoRed: 'Network status', ultimas: 'Latest', verTodas: 'See all', videoDia: 'Video',
    dVivo: 'commuter trains with live position', dMarcha: 'long-distance trains running by timetable', dSusp: 'trains today affected by suspensions', dNoticias: 'news stories in the last 24 hours',
    avisoTit: 'This app is not a safety system.', avisoTxt: 'It shows Renfe open data and official timetables. High-speed positions are estimated. Always follow instructions from staff, Adif, your operator and 112.',
    fVias: 'Real tracks', fEstimados: 'Long distance (estimated)', fVivo: 'Live commuter trains',
    lEst: 'By timetable', lVivo: 'Real position', lRetraso: 'Delayed', lChoque: 'Collision site (approx.)',
    notaMapa: 'Tracks are real (OpenRailwayMap). High-speed trains are placed using their official timetable, not GPS. For the official position check the', visorRenfe: 'Renfe live viewer',
    buscaTren: 'Find your train: number, destination or line', buscaNoticia: 'Live search: victims, Adif, Iryo, investigation…',
    queSabe: 'What we know', causa: 'The cause', cronologia: 'Timeline', telefonos: 'Phone lines for families', fuentes: 'Sources', videos: 'Videos',
    buscar: 'Search', hecho: 'Software by', verRenfe: 'See official Renfe position of', proxSalidas: 'Next departures', sinSalidas: 'No more departures today from this station.', noEncontrado: 'That train is not running now or is not on the app corridors. Try the official Renfe viewer.', buscaMapa: 'Train number or line', creditos: 'Data: Renfe Data (CC BY 4.0), OpenStreetMap and OpenRailwayMap (ODbL / CC BY-SA), photos from Wikimedia Commons and the media cited.',
    e_en_marcha: 'Running', e_en_estacion: 'At station', e_por_salir: 'Departing soon', e_programado: 'Scheduled', e_llego: 'Arrived', e_suspendido: 'Suspended', e_confirmar: 'Check with your operator', e_llegando: 'Arriving', e_retraso: 'Delay',
    todos: 'All', cercanias: 'Live commuter', proxima: 'Next stop', salida: 'Departure', llegada: 'Arrival', verMapa: 'Show on map', minRetraso: 'min late', puntual: 'on time',
    sinHorarios: "Today's timetables appear once the robot downloads them from Renfe (every morning). Meanwhile you can see live commuter trains and the network status.",
    horariosDe: 'Official Renfe timetables for', sinVivo: 'Live commuter positions are shown on the Netlify version.', vivoError: "Renfe's live feed could not be read right now. It will retry on its own.",
    vivoOk: 'Live commuter trains: Renfe open data, updated', choque: 'Approximate collision site', choqueTxt: 'Km 118 of the Madrid–Seville line, between Mora, Los Yébenes and Urda.',
    hace: '', min: 'min ago', h: 'h ago', ahora: 'now', nueva: 'New', horaCO: 'Colombia time', horaES: 'Spain time', buscando: 'Searching live…', enVivo: 'live results', sinRes: 'No news for that search. Try another word.', sinApi: 'Showing the news collected by the robot.',
    aprox: 'approx.', sinTrenes: 'No trains match this filter right now.', trenesDia: 'trains today on the corridors', vigente: 'In force', desdeHasta: 'from', al: 'to',
    est_suspendido: 'Suspended', est_alterado: 'Disrupted', est_parcial: 'Partial service', fechaHoy: 'Updated', cronoNota: 'Spain and Colombia times',
    guiaTit: 'Travel with more peace of mind',
    guia: [
      ['Before you leave', ['Check your train with your operator (Renfe, Iryo, Ouigo) on the day.', 'See "Network status" for suspensions or changes on your corridor.', 'Share your train, coach and seat number with your family.']],
      ['When you board', ['Locate the emergency exits and glass-breaking hammers in your coach.', 'Read the safety card and find the intercom to contact staff.', 'Keep the aisle free of luggage: it is the evacuation route.']],
      ['If something happens', ['Stay calm and follow the train staff instructions.', 'Do not step onto the track on your own: other trains and overhead power may be live.', 'Call 112 and give the train number and the nearest kilometre or station.']],
      ['If you are looking for a relative', ['Renfe: +34 900 10 10 20 · Iryo: +34 900 001 403.', '112 Castilla-La Mancha: +34 900 122 112.', 'Only use official channels and be wary of messages asking for money or data.']]
    ]
  }
};

// ---------- Estado ----------
const S = {
  lang: (() => { try { return localStorage.getItem('td-lang') || 'es'; } catch { return 'es'; } })(),
  caso: null, corredores: [], horarios: null, robot: { noticias: [], videos: [] },
  vivoNoticias: [], vivoNoticiasHora: null, apiNoticias: null,
  vivo: [], vivoHora: null, vivoOk: null,
  fotos: [], filtroCorr: new Set(), filtroEstado: 'todos', tab: 'hoy',
  mapa: null, capas: {}, marcas: new Map(), marcasVivo: new Map()
};
const API = /github\.io$/.test(location.hostname) ? 'https://trenes-al-dia.netlify.app/api' : '/api';
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const t = (k) => (T[S.lang][k] ?? T.es[k] ?? k);
const Lx = (o) => (o ? (o[S.lang] ?? o.es ?? '') : '');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const locale = () => (S.lang === 'en' ? 'en-GB' : 'es-CO');

// ---------- Tiempo ----------
function partes(d, tz) {
  return Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(d).map((p) => [p.type, p.value]));
}
function ahoraMadrid() {
  const p = partes(new Date(), 'Europe/Madrid');
  return { iso: `${p.year}-${p.month}-${p.day}`, min: Number(p.hour) * 60 + Number(p.minute) + Number(p.second) / 60 };
}
const hora = (d, tz) => new Intl.DateTimeFormat(locale(), { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d);
const fechaLarga = (d, tz) => new Intl.DateTimeFormat(locale(), { timeZone: tz, weekday: 'long', day: 'numeric', month: 'long' }).format(d);
const hhmm = (m) => { m = ((Math.round(m) % 1440) + 1440) % 1440; return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; };
function relativo(iso) {
  if (!iso) return '';
  const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (m < 2) return t('ahora');
  if (S.lang === 'en') return m < 60 ? `${m} ${t('min')}` : m < 1440 ? `${Math.round(m / 60)} ${t('h')}` : fechaLarga(new Date(iso), 'America/Bogota');
  return m < 60 ? `hace ${m} min` : m < 1440 ? `hace ${Math.round(m / 60)} h` : fechaLarga(new Date(iso), 'America/Bogota');
}

// ---------- Datos ----------
async function json(url, opciones) {
  const r = await fetch(url, { cache: 'no-store', ...opciones });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}
const marcaTiempo = () => `?v=${Date.now()}`;

async function cargarDatos() {
  const [caso, corr, hor, rob] = await Promise.allSettled([
    json('data/caso.json' + marcaTiempo()), json('data/corredores.json' + marcaTiempo()),
    json('data/horarios-hoy.json' + marcaTiempo()), json('data/noticias.json' + marcaTiempo())
  ]);
  if (caso.status === 'fulfilled') S.caso = caso.value;
  if (corr.status === 'fulfilled') {
    S.corredores = corr.value.corredores || [];
    if (!S.filtroCorr.size) S.corredores.forEach((c) => S.filtroCorr.add(c.id));
  }
  if (hor.status === 'fulfilled') S.horarios = hor.value;
  if (rob.status === 'fulfilled') S.robot = rob.value;
}

async function noticiasEnVivo(q = '') {
  const est = $('#estadoBusqueda');
  est.className = 'estado-busqueda cargando';
  est.textContent = t('buscando');
  try {
    const d = await json(`${API}/noticias?lang=${S.lang}&q=${encodeURIComponent(q)}`);
    if (!d.ok) throw new Error(d.error);
    S.vivoNoticias = d.noticias || [];
    S.vivoNoticiasHora = d.hora;
    S.apiNoticias = true;
    est.className = 'estado-busqueda';
    est.textContent = `${S.vivoNoticias.length} ${t('enVivo')} · ${hora(new Date(d.hora), 'America/Bogota')} ${t('horaCO')}`;
  } catch {
    S.apiNoticias = false;
    if (q) S.vivoNoticias = [];
    est.className = 'estado-busqueda';
    est.textContent = t('sinApi');
  }
  S.busqueda = q;
  pintarNoticias();
  pintarHoy();
}

async function trenesEnVivo() {
  try {
    const d = await json(`${API}/trenes`);
    if (!d.ok) throw new Error(d.error);
    S.vivo = d.trenes || [];
    S.vivoHora = d.hora;
    S.vivoOk = true;
  } catch {
    S.vivoOk = /github\.io$/.test(location.hostname) || location.protocol === 'file:' ? 'sin' : false;
  }
  pintarVivo();
  pintarTablero();
  if (S.tab === 'trenes' && S.filtroEstado === 'cercanias') pintarTrenes();
}

// Fotos reales de Wikimedia Commons (con autor y licencia)
async function fotosCommons(busqueda, n = 6) {
  const clave = `td-fotos-${busqueda}`;
  try {
    const c = JSON.parse(localStorage.getItem(clave) || 'null');
    if (c && Date.now() - c.t < 864e5 && c.f.length) return c.f;
  } catch {}
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=20' +
    `&gsrsearch=${encodeURIComponent(busqueda + ' filetype:bitmap')}&prop=imageinfo&iiprop=url|mime|size|extmetadata&iiurlwidth=1400`;
  try {
    const d = await json(url, { cache: 'default' });
    const f = Object.values(d.query?.pages || {})
      .map((p) => ({ p, i: p.imageinfo?.[0] }))
      .filter(({ i }) => i && /jpe?g/i.test(i.mime) && i.width >= 1000 && i.width > i.height)
      .slice(0, n)
      .map(({ p, i }) => ({
        src: i.thumburl || i.url,
        pagina: i.descriptionurl,
        autor: (i.extmetadata?.Artist?.value || '').replace(/<[^>]+>/g, '').trim().slice(0, 60),
        licencia: i.extmetadata?.LicenseShortName?.value || '',
        titulo: p.title
      }));
    try { localStorage.setItem(clave, JSON.stringify({ t: Date.now(), f })); } catch {}
    return f;
  } catch { return []; }
}
const credito = (f) => (f ? `<a href="${esc(f.pagina)}" target="_blank" rel="noopener">${esc(f.autor || 'Wikimedia Commons')}${f.licencia ? ' · ' + esc(f.licencia) : ''}</a>` : '');

// ---------- Trenes por horario ----------
function restriccion(v, fecha) {
  let r = null;
  const tipo = (v.tipo || '').toUpperCase();
  for (const e of S.caso?.estadoRed || []) {
    if (e.corredor !== v.corredor) continue;
    if ((e.desde && fecha < e.desde) || (e.hasta && fecha > e.hasta)) continue;
    if (e.tipos && !e.tipos.some((x) => tipo.includes(x))) continue;
    if (e.estado === 'suspendido' && !(e.exceptoTipos || []).some((x) => tipo.includes(x))) return 'suspendido';
    if (e.estado === 'alterado' || e.estado === 'parcial' || e.estado === 'suspendido') r = 'confirmar';
  }
  return r;
}

function situacion(v, ahora) {
  const P = S.horarios.paradas;
  const p = v.p.filter((x) => P[x[0]]);
  if (p.length < 2) return null;
  const nombre = (x) => P[x[0]][0];
  const coord = (x) => [P[x[0]][1], P[x[0]][2]];
  const ini = p[0][2], fin = p[p.length - 1][1];
  const base = { origen: nombre(p[0]), destino: v.destino || nombre(p[p.length - 1]), sale: ini, llega: fin, prog: 0 };
  const r = restriccion(v, ahora.iso);
  const m = ahora.min;
  let s;
  if (m < ini) s = { ...base, estado: ini - m <= 20 ? 'por_salir' : 'programado', pos: coord(p[0]), sig: nombre(p[0]), sigHora: ini, rumbo: rumbo(coord(p[0]), coord(p[1])) };
  else if (m >= fin) s = { ...base, estado: 'llego', pos: coord(p[p.length - 1]), prog: 1, sig: nombre(p[p.length - 1]), sigHora: fin, hace: m - fin };
  else {
    for (let i = 0; i < p.length; i++) {
      const [, ll, sa] = p[i];
      if (m >= ll && m <= sa) { s = { ...base, estado: 'en_estacion', pos: coord(p[i]), sig: nombre(p[i]), sigHora: sa, rumbo: p[i + 1] ? rumbo(coord(p[i]), coord(p[i + 1])) : null }; break; }
      const q = p[i + 1];
      if (q && m > sa && m < q[1]) {
        const f = (m - sa) / Math.max(1, q[1] - sa);
        const a = coord(p[i]), b = coord(q);
        s = { ...base, estado: 'en_marcha', pos: [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f], sig: nombre(q), sigHora: q[1], rumbo: rumbo(a, b) };
        break;
      }
    }
    if (!s) return null;
    s.prog = (m - ini) / Math.max(1, fin - ini);
  }
  if (r) { s.restriccion = r; if (r === 'suspendido') { s.estado = 'suspendido'; s.prog = 0; s.sig = s.origen; s.sigHora = s.sale; } }
  return s;
}

// Hacia dónde va el tren, en grados (0 = norte)
function rumbo(a, b) {
  const r = Math.PI / 180;
  const y = Math.sin((b[1] - a[1]) * r) * Math.cos(b[0] * r);
  const x = Math.cos(a[0] * r) * Math.sin(b[0] * r) - Math.sin(a[0] * r) * Math.cos(b[0] * r) * Math.cos((b[1] - a[1]) * r);
  return (Math.atan2(y, x) / r + 360) % 360;
}

function trenesDelDia() {
  const h = S.horarios;
  if (!h?.viajes?.length) return [];
  const ahora = ahoraMadrid();
  if (h.fecha !== ahora.iso) return [];
  return h.viajes.map((v) => ({ v, s: situacion(v, ahora) })).filter((x) => x.s);
}

const COLOR_ESTADO = { en_marcha: 'var(--verde)', en_estacion: 'var(--azul)', por_salir: 'var(--violeta)', programado: 'var(--suave)', llego: 'var(--suave)', suspendido: 'var(--rojo)', confirmar: 'var(--ambar)', llegando: 'var(--azul)' };
const colorCorr = (id) => S.corredores.find((c) => c.id === id)?.color || '#3e9bff';

// ---------- Pintar ----------
function traducir() {
  document.documentElement.lang = S.lang;
  $$('[data-t]').forEach((el) => { const v = t(el.dataset.t); if (typeof v === 'string') el.textContent = v; });
  $$('[data-tp]').forEach((el) => { el.placeholder = t(el.dataset.tp); });
  $('#btnIdioma').textContent = S.lang === 'es' ? 'EN' : 'ES';
}

function contar(el, hasta, mas) {
  const ini = performance.now(), dur = 1200;
  const paso = (ahora) => {
    const f = Math.min(1, (ahora - ini) / dur);
    el.textContent = Math.round(hasta * (1 - Math.pow(1 - f, 3))).toLocaleString(locale()) + (mas && f === 1 ? '+' : '');
    if (f < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

function pintarCaso() {
  const c = S.caso;
  if (!c) return;
  $('#casoTitulo').textContent = Lx(c.titulo);
  const colores = ['var(--rojo)', 'var(--ambar)', 'var(--azul)', 'var(--violeta)'];
  $('#cifras').innerHTML = c.cifras.map((x, i) => `<div class="cifra" style="--c:${colores[i % 4]}"><b data-n="${x.valor}" data-mas="${x.mas ? 1 : ''}">0</b><span>${esc(Lx(x))}</span></div>`).join('');
  $$('#cifras b').forEach((b) => contar(b, Number(b.dataset.n), !!b.dataset.mas));
  $('#casoResumen').textContent = Lx(c.resumen);
  $('#casoCausa').textContent = Lx(c.causa);
  $('#cronologia').innerHTML = c.cronologia.map((e, i) => {
    const d = new Date(e.hora);
    return `<li style="animation-delay:${i * 60}ms"><time>${hora(d, 'Europe/Madrid')} ${t('horaES')}<small>${hora(d, 'America/Bogota')} ${t('horaCO')}${e.aprox ? ' · ' + t('aprox') : ''}</small></time><p>${esc(Lx(e))}</p></li>`;
  }).join('');
  $('#telefonos').innerHTML = c.telefonos.map((x) => `<a class="telefono" href="tel:${x.numero.replace(/[^+\d]/g, '')}"><b>${esc(x.numero)}</b><span>${esc(Lx(x))}</span></a>`).join('');
  $('#casoFuentes').innerHTML = c.fuentes.map((f) => `<li><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.titulo)}</a></li>`).join('');
  const hoy = ahoraMadrid().iso;
  const vigentes = c.estadoRed.filter((e) => (!e.desde || hoy >= e.desde) && (!e.hasta || hoy <= e.hasta));
  const col = { suspendido: 'var(--rojo)', alterado: 'var(--ambar)', parcial: 'var(--azul)' };
  const corrNombre = (id) => Lx(S.corredores.find((x) => x.id === id)) || id;
  $('#estadoRed').innerHTML = (vigentes.length ? vigentes : c.estadoRed).map((e) => `
    <div class="estado" style="--c:${col[e.estado] || 'var(--azul)'}">
      <span class="etq">${esc(t('est_' + e.estado))}</span>
      <div><p>${esc(Lx(e))}</p><small>${esc(corrNombre(e.corredor))}${e.desde ? ` · ${t('desdeHasta')} ${esc(e.desde)}${e.hasta ? ` ${t('al')} ${esc(e.hasta)}` : ''}` : ''}</small></div>
    </div>`).join('');
}

function todasLasNoticias() {
  const vistos = new Set();
  const clave = (n) => n.titulo.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, '').split(' ').filter((w) => w.length > 3).slice(0, 7).join(' ');
  const base = S.busqueda ? S.vivoNoticias : [...S.vivoNoticias, ...(S.robot.noticias || [])];
  const fotosRobot = new Map((S.robot.noticias || []).filter((n) => n.imagen).map((n) => [clave(n), n.imagen]));
  return base.filter((n) => { const k = clave(n); if (vistos.has(k)) return false; vistos.add(k); return true; })
    .map((n) => ({ ...n, imagen: n.imagen || fotosRobot.get(clave(n)) || '' }))
    .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));
}

function tarjetaNoticia(n, i, destacada) {
  const foto = n.imagen || S.fotos[i % Math.max(1, S.fotos.length)]?.src || '';
  const nueva = n.fecha && Date.now() - new Date(n.fecha) < 3 * 3600e3;
  const horaCo = n.fecha ? ` · ${hora(new Date(n.fecha), 'America/Bogota')} ${t('horaCO')}` : '';
  return `<a class="noticia${destacada ? ' destacada' : ''}" href="${esc(n.url)}" target="_blank" rel="noopener" style="animation-delay:${Math.min(i, 10) * 50}ms">
    ${foto ? `<div class="foto" style="background-image:url('${esc(foto)}')">${nueva ? `<span class="nueva">${t('nueva')}</span>` : ''}</div>` : ''}
    <div class="cuerpo">${!foto && nueva ? `<span class="chip-rojo" style="margin-bottom:8px">${t('nueva')}</span>` : ''}<h3>${esc(n.titulo)}</h3><div class="meta">${esc(n.fuente || '')} · ${esc(relativo(n.fecha))}${horaCo}</div></div></a>`;
}

function pintarNoticias() {
  const lista = todasLasNoticias();
  $('#listaNoticias').innerHTML = lista.length ? lista.slice(0, 45).map((n, i) => tarjetaNoticia(n, i, i === 0)).join('') : `<div class="vacio">${t('sinRes')}</div>`;
  const vids = S.robot.videos || [];
  $('#videosBloque').hidden = !vids.length;
  $('#listaVideos').innerHTML = vids.slice(0, 12).map(tarjetaVideo).join('');
}

function tarjetaVideo(v) {
  return `<div class="video"><div class="marco" data-video="${esc(v.id)}" style="background-image:url('https://i.ytimg.com/vi/${esc(v.id)}/hqdefault.jpg')"></div>
    <p>${esc(v.titulo)}<small>${esc(v.canal || '')} · ${esc(relativo(v.fecha))}</small></p></div>`;
}

function pintarHoy() {
  const ahora = new Date();
  $('#hoyFecha').textContent = `${fechaLarga(ahora, 'Europe/Madrid')} · ${t('fechaHoy')} ${hora(ahora, 'America/Bogota')} ${t('horaCO')}`;
  $('#hoyHora').textContent = `${hora(ahora, 'Europe/Madrid')} ${t('horaES')}`;
  const lista = todasLasNoticias();
  $('#hoyNoticias').innerHTML = lista.slice(0, 6).map((n, i) => tarjetaNoticia(n, i, i === 0)).join('') || `<div class="vacio">${t('sinApi')}</div>`;
  const v = (S.robot.videos || [])[0];
  $('#hoyVideoBloque').hidden = !v;
  if (v) $('#hoyVideo').innerHTML = `<div class="videos" style="grid-template-columns:1fr">${tarjetaVideo(v)}</div>`;
  pintarTicker(lista);
  pintarTablero();
  $('#pieActualizado').textContent = S.robot.actualizado ? `${t('fechaHoy')}: ${relativo(S.robot.actualizado)}` : '';
}

function pintarTicker(lista) {
  const est = (S.caso?.estadoRed || []).filter((e) => { const h = ahoraMadrid().iso; return (!e.desde || h >= e.desde) && (!e.hasta || h <= e.hasta); })
    .map((e) => `<span><b>${esc(t('est_' + e.estado))}</b>${esc(Lx(e).split('. ')[0])}</span>`);
  const nots = lista.slice(0, 10).map((n) => `<a href="${esc(n.url)}" target="_blank" rel="noopener"><b>${esc(n.fuente || '')}</b>${esc(n.titulo)}</a>`);
  const items = [...est, ...nots].join('');
  $('#ticker').innerHTML = items + items;
}

function pintarTablero() {
  const dia = trenesDelDia();
  const set = (id, n) => { const el = $(id); if (el.dataset.v !== String(n)) { el.dataset.v = n; contar(el, n); } };
  set('#nVivo', S.vivo.length);
  set('#nMarcha', dia.filter((x) => x.s.estado === 'en_marcha' || x.s.estado === 'en_estacion').length);
  set('#nSusp', dia.filter((x) => x.s.estado === 'suspendido').length);
  set('#nHoyNot', todasLasNoticias().filter((n) => n.fecha && Date.now() - new Date(n.fecha) < 864e5).length);
}

// ---------- Mapa ----------
function iniciarMapa() {
  if (S.mapa || !window.L) return;
  const m = L.map('mapaVias', { zoomControl: false }).setView([39.9, -3.9], 6);
  S.mapa = m;
  L.control.zoom({ position: 'bottomright' }).addTo(m);
  const env = m.getContainer().parentElement;
  m.on('popupopen', () => env.classList.add('con-popup'));
  m.on('popupclose', () => env.classList.remove('con-popup'));
  // Mapa base claro sin clave (Esri); si falla, OpenStreetMap
  const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/';
  const base = L.tileLayer(ESRI + 'World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    maxNativeZoom: 16, maxZoom: 19, attribution: 'Mapa &copy; Esri, HERE, Garmin, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(m);
  const nombres = L.tileLayer(ESRI + 'World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxNativeZoom: 16, maxZoom: 19, pane: 'shadowPane' }).addTo(m);
  let fallos = 0;
  base.on('tileerror', () => {
    if (++fallos !== 6) return;
    m.removeLayer(base); m.removeLayer(nombres);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(m).bringToBack();
  });
  S.capas.vias = L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
    maxZoom: 19, subdomains: 'abc', opacity: 0.6, attribution: '<a href="https://www.openrailwaymap.org/">OpenRailwayMap</a> CC-BY-SA'
  }).addTo(m);
  S.capas.corr = {};
  for (const c of S.corredores) {
    const g = L.layerGroup();
    for (const tramo of [c.estaciones, ...(c.ramales || [])]) {
      L.polyline(tramo.map((e) => [e[1], e[2]]), { color: c.color, weight: 3, opacity: 0.45, dashArray: '2 8', lineCap: 'round' }).addTo(g);
    }
    g.addTo(m);
    S.capas.corr[c.id] = g;
  }
  S.capas.estaciones = L.layerGroup();
  pintarEstaciones();
  const verEstaciones = () => {
    m.getZoom() >= 7 ? S.capas.estaciones.addTo(m) : m.removeLayer(S.capas.estaciones);
    m.getContainer().classList.toggle('zoom-cerca', m.getZoom() >= 9);
  };
  m.on('zoomend', verEstaciones);
  verEstaciones();
  S.capas.est = L.layerGroup().addTo(m);
  S.capas.vivo = L.layerGroup().addTo(m);
  const pc = S.caso?.punto;
  if (pc) {
    L.marker([pc.lat, pc.lon], { icon: L.divIcon({ className: '', html: '<div class="marca-choque" style="width:14px;height:14px"></div>', iconSize: [14, 14] }), zIndexOffset: 1000 })
      .bindPopup(`<b>${esc(t('choque'))}</b><br>${esc(t('choqueTxt'))}`).addTo(m);
  }
  pintarFiltrosMapa();
  $('#buscaMapa').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); buscarEnMapa(e.target.value); } });
  $('#buscaMapa').addEventListener('search', (e) => buscarEnMapa(e.target.value));
  $('#btnBuscaMapa').onclick = () => buscarEnMapa($('#buscaMapa').value);
  $('#fVias').onchange = (e) => (e.target.checked ? S.capas.vias.addTo(m) : m.removeLayer(S.capas.vias));
  $('#fEstimados').onchange = (e) => (e.target.checked ? S.capas.est.addTo(m) : m.removeLayer(S.capas.est));
  $('#fVivo').onchange = (e) => (e.target.checked ? S.capas.vivo.addTo(m) : m.removeLayer(S.capas.vivo));
  moverTrenes();
  pintarVivo();
}

function pintarFiltrosMapa() {
  $('#filtrosCorredor').innerHTML = S.corredores.map((c) => `<button class="chip${S.filtroCorr.has(c.id) ? '' : ' apagado'}" data-corr="${c.id}" style="--c:${c.color}"><i></i>${esc(Lx(c))}</button>`).join('');
}

function popupTren(v, s) {
  const e = s.estado;
  return `<b>${esc(v.tipo)} ${esc(v.tren)}</b><br>${esc(s.origen)} → ${esc(s.destino)}<br>
    <span style="color:${COLOR_ESTADO[e]}">${esc(t('e_' + e))}</span>${s.restriccion === 'confirmar' ? ` · <span style="color:var(--ambar)">${esc(t('e_confirmar'))}</span>` : ''}<br>
    ${esc(t('proxima'))}: ${esc(s.sig)} · ${hhmm(s.sigHora)} ${esc(t('horaES'))}<br><span class="mini">${esc(t('lEst'))}</span>
    ${/renfe|ave|avlo|alvia|avant|md|regional|reg|euromed|intercity/i.test(v.tipo) ? `<a class="btn-renfe" href="https://tiempo-real.largorecorrido.renfe.com" target="_blank" rel="noopener">${esc(t('verRenfe'))} ${esc(v.tren)}</a>` : ''}`;
}

function moverTrenes() {
  if (!S.mapa) return;
  const dia = trenesDelDia();
  const vivos = new Set();
  for (const { v, s } of dia) {
    const visible = S.filtroCorr.has(v.corredor) && (s.estado === 'en_marcha' || s.estado === 'en_estacion' || s.estado === 'por_salir');
    if (!visible) continue;
    vivos.add(v.id);
    const cls = `tren-flecha${s.estado === 'en_estacion' ? ' parado' : ''}${s.estado === 'por_salir' ? ' espera' : ''}`;
    let mk = S.marcas.get(v.id);
    const icono = () => L.divIcon({ className: '', html: `<div class="${cls}" style="--c:${colorCorr(v.corredor)}"><i></i><b>${esc(v.tren)}</b></div>`, iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -10] });
    if (!mk) {
      mk = L.marker(s.pos, { icon: icono(), zIndexOffset: 500 }).bindPopup('', { autoPanPaddingTopLeft: [20, 90] }).addTo(S.capas.est);
      mk._cls = cls;
      mk._v = v;
      S.marcas.set(v.id, mk);
    } else {
      mk.setLatLng(s.pos);
      if (mk._cls !== cls) { mk.setIcon(icono()); mk._cls = cls; }
    }
    const flecha = mk.getElement()?.querySelector('i');
    if (flecha) { flecha.style.transform = `rotate(${s.rumbo ?? 0}deg)`; flecha.style.opacity = s.rumbo == null ? 0 : 1; }
    mk.setPopupContent(popupTren(v, s));
  }
  for (const [id, mk] of S.marcas) if (!vivos.has(id)) { S.capas.est.removeLayer(mk); S.marcas.delete(id); }
}

// Estaciones reales de los horarios de hoy, con sus próximas salidas
function pintarEstaciones() {
  const P = S.horarios?.paradas || {};
  S.capas.estaciones.clearLayers();
  const usadas = new Set((S.horarios?.viajes || []).flatMap((v) => v.p.map((x) => x[0])));
  for (const id of usadas) {
    const e = P[id];
    if (!e) continue;
    L.marker([e[1], e[2]], { icon: L.divIcon({ className: '', html: '<div class="pin-estacion"></div>', iconSize: [16, 20], iconAnchor: [8, 20], popupAnchor: [0, -18] }) })
      .bindTooltip(e[0], { className: 'etiqueta-mapa', direction: 'top', offset: [0, -18] })
      .bindPopup(() => popupEstacion(id))
      .addTo(S.capas.estaciones);
  }
}

function popupEstacion(id) {
  const P = S.horarios.paradas;
  const ahora = ahoraMadrid();
  const prox = trenesDelDia()
    .map(({ v, s }) => ({ v, s, x: v.p.find((q) => q[0] === id) }))
    .filter(({ x, s }) => x && x[2] >= ahora.min - 2 && s.estado !== 'llego')
    .sort((a, b) => a.x[2] - b.x[2]).slice(0, 6);
  const filas = prox.map(({ v, s, x }) => `<div class="fila-est"><span class="h">${hhmm(x[2])}</span><span>${esc(v.tipo)} ${esc(v.tren)} → ${esc(s.destino)}</span><span class="e" style="color:${COLOR_ESTADO[s.estado]}">${esc(t('e_' + s.estado))}</span></div>`).join('');
  return `<b>${esc(P[id][0])}</b><div class="mini" style="margin:2px 0 6px">${esc(t('proxSalidas'))} · ${esc(t('horaES'))}</div>${filas || `<span class="mini">${esc(t('sinSalidas'))}</span>`}`;
}

// Busca un tren por número (o línea de Cercanías) y lo muestra en el mapa
function buscarEnMapa(texto) {
  const q = String(texto || '').trim().toLowerCase();
  const nota = $('#notaBuscaMapa');
  if (!q) { nota.textContent = ''; return; }
  const dia = trenesDelDia();
  const hit = dia.find(({ v }) => v.tren === q || v.tren.replace(/^0+/, '') === q.replace(/^0+/, '')) ||
    dia.find(({ v }) => v.tren.includes(q));
  if (hit) {
    const { v, s } = hit;
    if (!S.filtroCorr.has(v.corredor)) { S.filtroCorr.add(v.corredor); S.capas.corr[v.corredor]?.addTo(S.mapa); pintarFiltrosMapa(); }
    if (!S.mapa.hasLayer(S.capas.est)) { S.capas.est.addTo(S.mapa); $('#fEstimados').checked = true; }
    moverTrenes();
    S.mapa.flyTo(s.pos, 10, { duration: 1.2 });
    const mk = S.marcas.get(v.id);
    if (mk) setTimeout(() => mk.openPopup(), 1300);
    else L.popup().setLatLng(s.pos).setContent(popupTren(v, s)).openOn(S.mapa);
    nota.textContent = `${v.tipo} ${v.tren} · ${t('e_' + s.estado)}`;
    return;
  }
  const vivo = S.vivo.find((x) => x.etiqueta.toLowerCase().includes(q) || (x.linea || '').toLowerCase() === q);
  if (vivo) {
    S.mapa.flyTo([vivo.lat, vivo.lon], 13, { duration: 1.2 });
    setTimeout(() => S.marcasVivo.get(vivo.id)?.openPopup(), 1300);
    nota.textContent = `${vivo.linea} ${vivo.etiqueta}`;
    return;
  }
  nota.textContent = t('noEncontrado');
}

function pintarVivo() {
  const nota = $('#notaVivo');
  if (S.vivoOk === 'sin') { nota.hidden = false; nota.innerHTML = `${esc(t('sinVivo'))} <a href="https://trenes-al-dia.netlify.app" target="_blank" rel="noopener">trenes-al-dia.netlify.app</a>`; }
  else if (S.vivoOk === false) { nota.hidden = false; nota.textContent = t('vivoError'); }
  else if (S.vivoOk) { nota.hidden = false; nota.textContent = `${t('vivoOk')} ${hora(new Date(S.vivoHora), 'Europe/Madrid')} ${t('horaES')} · ${hora(new Date(S.vivoHora), 'America/Bogota')} ${t('horaCO')}`; }
  if (!S.mapa) return;
  const vistos = new Set();
  for (const tr of S.vivo) {
    vistos.add(tr.id);
    const cls = `marca-tren vivo${tr.retraso > 3 ? ' retraso' : ''}`;
    const html = `<b>${esc(tr.linea || 'Cercanías')}</b> ${esc(tr.etiqueta)}<br>${esc(t('e_' + tr.estado))}${tr.retraso != null ? ` · ${tr.retraso > 0 ? `${tr.retraso} ${esc(t('minRetraso'))}` : esc(t('puntual'))}` : ''}<br><span class="mini">${esc(t('lVivo'))} · Renfe</span>`;
    let mk = S.marcasVivo.get(tr.id);
    if (!mk) {
      mk = L.marker([tr.lat, tr.lon], { icon: L.divIcon({ className: '', html: `<div class="${cls}" style="width:11px;height:11px"></div>`, iconSize: [11, 11] }) }).bindPopup(html).addTo(S.capas.vivo);
      mk._cls = cls;
      S.marcasVivo.set(tr.id, mk);
    } else {
      mk.setLatLng([tr.lat, tr.lon]).setPopupContent(html);
      if (mk._cls !== cls) { mk.setIcon(L.divIcon({ className: '', html: `<div class="${cls}" style="width:11px;height:11px"></div>`, iconSize: [11, 11] })); mk._cls = cls; }
    }
  }
  for (const [id, mk] of S.marcasVivo) if (!vistos.has(id)) { S.capas.vivo.removeLayer(mk); S.marcasVivo.delete(id); }
}

// ---------- Lista de trenes ----------
function pintarFiltrosEstado() {
  const op = ['todos', 'en_marcha', 'por_salir', 'suspendido', 'cercanias'];
  $('#filtrosEstado').innerHTML = op.map((o) => `<button class="chip${S.filtroEstado === o ? ' activa' : ''}" data-estado="${o}">${esc(o === 'todos' ? t('todos') : o === 'cercanias' ? t('cercanias') : t('e_' + o))}</button>`).join('') +
    S.corredores.map((c) => `<button class="chip${S.filtroCorr.has(c.id) ? '' : ' apagado'}" data-corr="${c.id}" style="--c:${c.color}"><i></i>${esc(Lx(c))}</button>`).join('');
}

function pintarTrenes() {
  const q = ($('#buscaTren').value || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const cont = $('#listaTrenes');
  if (S.filtroEstado === 'cercanias') {
    const l = S.vivo.filter((x) => !q || norm(`${x.linea} ${x.etiqueta}`).includes(q)).slice(0, 150);
    $('#trenesResumen').textContent = S.vivoOk === true ? `${S.vivo.length} · ${t('vivoOk')} ${hora(new Date(S.vivoHora), 'Europe/Madrid')} ${t('horaES')}` : (S.vivoOk === 'sin' ? t('sinVivo') : t('vivoError'));
    cont.innerHTML = l.length ? l.map((x) => `<div class="tren" style="--c:var(--verde)"><div class="fila"><h3>${esc(x.linea || 'Cercanías')}<small>${esc(x.etiqueta)}</small></h3>
      <span class="estado-tren" style="--e:${x.retraso > 3 ? 'var(--ambar)' : 'var(--verde)'}">${esc(x.retraso > 0 ? `${x.retraso} ${t('minRetraso')}` : t('e_' + x.estado))}</span></div>
      <div class="pie-tren"><span>${esc(t('lVivo'))}</span><button class="ver" data-ver="${x.lat},${x.lon}">${esc(t('verMapa'))}</button></div></div>`).join('') : `<div class="vacio">${t('sinTrenes')}</div>`;
    return;
  }
  const h = S.horarios;
  if (!h?.viajes?.length || h.fecha !== ahoraMadrid().iso) {
    $('#trenesResumen').textContent = '';
    cont.innerHTML = `<div class="vacio">${t('sinHorarios')}</div>`;
    return;
  }
  const dia = trenesDelDia();
  $('#trenesResumen').textContent = `${dia.length} ${t('trenesDia')} · ${t('horariosDe')} ${h.fecha}`;
  const orden = { en_marcha: 0, en_estacion: 0, por_salir: 1, suspendido: 2, programado: 3, llego: 4 };
  const l = dia.filter(({ v, s }) => S.filtroCorr.has(v.corredor) &&
    (S.filtroEstado === 'todos' || s.estado === S.filtroEstado || (S.filtroEstado === 'en_marcha' && s.estado === 'en_estacion')) &&
    (!q || norm(`${v.tren} ${v.tipo} ${s.origen} ${s.destino}`).includes(q)))
    .filter(({ s }) => !(s.estado === 'llego' && s.hace > 90))
    .sort((a, b) => (orden[a.s.estado] - orden[b.s.estado]) || (a.s.sale - b.s.sale)).slice(0, 120);
  cont.innerHTML = l.length ? l.map(({ v, s }) => `
    <div class="tren" style="--c:${colorCorr(v.corredor)}">
      <div class="fila"><h3>${esc(v.tipo)} ${esc(v.tren)}<small>${esc(Lx(S.corredores.find((c) => c.id === v.corredor)))}</small></h3>
        <span class="estado-tren" style="--e:${COLOR_ESTADO[s.estado]}">${esc(t('e_' + s.estado))}</span></div>
      <div class="ruta">${esc(s.origen)} → ${esc(s.destino)}${s.restriccion === 'confirmar' ? ` · <span style="color:var(--ambar)">${esc(t('e_confirmar'))}</span>` : ''}</div>
      <div class="progreso"><i style="width:${Math.round(s.prog * 100)}%"></i></div>
      <div class="pie-tren"><span>${esc(t('salida'))} ${hhmm(s.sale)} · ${esc(t('llegada'))} ${hhmm(s.llega)} ${esc(t('horaES'))}</span>
        ${s.estado === 'en_marcha' || s.estado === 'en_estacion' ? `<button class="ver" data-tren="${esc(v.tren)}">${esc(t('verMapa'))}</button>` : `<span>${esc(t('proxima'))}: ${esc(s.sig)}</span>`}</div>
    </div>`).join('') : `<div class="vacio">${t('sinTrenes')}</div>`;
}

// ---------- Viaja seguro ----------
async function pintarSeguro() {
  const g = t('guia');
  const fotos = await fotosCommons('Renfe AVE train interior seats', 4);
  const extra = fotos.length ? fotos : S.fotos;
  $('#seguroContenido').innerHTML = `<h2 style="margin-bottom:14px">${esc(t('guiaTit'))}</h2><div class="guia">` + g.map(([tit, items], i) => {
    const f = extra[i % Math.max(1, extra.length)];
    return `<div class="paso"><div class="foto" style="background-image:url('${esc(f?.src || '')}')"><div class="credito">${credito(f)}</div></div>
      <div class="cuerpo"><h3>${esc(tit)}</h3><ul>${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div></div>`;
  }).join('') + `</div><div class="aviso"><strong>${esc(t('avisoTit'))}</strong>${esc(t('avisoTxt'))}</div>`;
}

// ---------- Héroe ----------
async function pintarHeroe() {
  const grupos = await Promise.all([
    fotosCommons('Renfe class 112 AVE high speed train', 3),
    fotosCommons('Iryo Frecciarossa 1000 Spain', 3),
    fotosCommons('Madrid Puerta de Atocha station', 2),
    fotosCommons('Toledo Castilla-La Mancha landscape', 2)
  ]);
  const fotos = [];
  for (let i = 0; i < 3; i++) for (const g of grupos) if (g[i]) fotos.push(g[i]);
  S.fotos = fotos;
  if (!fotos.length) return;
  const cont = $('#heroeFotos');
  cont.innerHTML = fotos.map((f, i) => `<img src="${esc(f.src)}" alt="" ${i ? 'loading="lazy"' : ''}>`).join('');
  const imgs = $$('img', cont);
  let i = 0;
  const mostrar = () => {
    imgs.forEach((im, j) => im.classList.toggle('visible', j === i));
    $('#heroeCredito').innerHTML = credito(fotos[i]);
    i = (i + 1) % imgs.length;
  };
  mostrar();
  clearInterval(S.relojHeroe);
  S.relojHeroe = setInterval(mostrar, 7000);
  const fc = grupos[0][0] || fotos[0];
  $('#casoFoto').style.backgroundImage = `url('${fc.src}')`;
  $('#casoCredito').innerHTML = credito(fc);
  pintarNoticias();
  pintarHoy();
}

// ---------- Navegación y eventos ----------
function abrir(tab) {
  S.tab = tab;
  $$('#pestanas button').forEach((b) => b.classList.toggle('activa', b.dataset.tab === tab));
  $$('.vista').forEach((v) => v.classList.toggle('activa', v.id === tab));
  window.scrollTo({ top: 0, behavior: 'smooth' });
  if (tab === 'mapa') { iniciarMapa(); setTimeout(() => S.mapa?.invalidateSize(), 60); }
  if (tab === 'trenes') { pintarFiltrosEstado(); pintarTrenes(); }
  if (tab === 'seguro') pintarSeguro();
  if (tab === 'hoy') pintarHoy();
  try { history.replaceState(null, '', tab === 'hoy' ? location.pathname : `#${tab}`); } catch {}
}

document.addEventListener('click', (e) => {
  const b = e.target.closest('button, .marco');
  if (!b) return;
  if (b.dataset.tab) abrir(b.dataset.tab);
  else if (b.dataset.ir) abrir(b.dataset.ir);
  else if (b.dataset.corr) {
    const id = b.dataset.corr;
    S.filtroCorr.has(id) ? S.filtroCorr.delete(id) : S.filtroCorr.add(id);
    if (S.mapa) { const g = S.capas.corr[id]; S.filtroCorr.has(id) ? g.addTo(S.mapa) : S.mapa.removeLayer(g); pintarFiltrosMapa(); moverTrenes(); }
    if (S.tab === 'trenes') { pintarFiltrosEstado(); pintarTrenes(); }
  } else if (b.dataset.estado) { S.filtroEstado = b.dataset.estado; pintarFiltrosEstado(); pintarTrenes(); }
  else if (b.dataset.tren) { abrir('mapa'); $('#buscaMapa').value = b.dataset.tren; setTimeout(() => buscarEnMapa(b.dataset.tren), 150); }
  else if (b.dataset.ver) {
    const [la, lo] = b.dataset.ver.split(',').map(Number);
    abrir('mapa');
    setTimeout(() => S.mapa?.setView([la, lo], 11), 120);
  } else if (b.dataset.video) {
    b.classList.add('reproduciendo');
    b.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(b.dataset.video)}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="Video"></iframe>`;
  }
});

$('#btnIdioma').onclick = () => {
  S.lang = S.lang === 'es' ? 'en' : 'es';
  try { localStorage.setItem('td-lang', S.lang); } catch {}
  traducir(); pintarCaso(); pintarHoy(); pintarNoticias();
  if (S.mapa) pintarFiltrosMapa();
  if (S.tab === 'trenes') { pintarFiltrosEstado(); pintarTrenes(); }
  if (S.tab === 'seguro') pintarSeguro();
  noticiasEnVivo($('#buscaNoticia').value.trim());
};

let tBusca;
$('#buscaNoticia').addEventListener('input', (e) => { clearTimeout(tBusca); tBusca = setTimeout(() => noticiasEnVivo(e.target.value.trim()), 600); });
$('#buscaTren').addEventListener('input', () => pintarTrenes());

async function actualizarTodo() {
  const b = $('#btnActualizar');
  b.classList.add('girando');
  $('span[data-t="actualizar"]', b).textContent = t('actualizando');
  await cargarDatos();
  traducir(); pintarCaso(); pintarHoy(); pintarNoticias();
  await Promise.all([noticiasEnVivo($('#buscaNoticia').value.trim()), trenesEnVivo()]);
  if (S.tab === 'trenes') pintarTrenes();
  moverTrenes();
  b.classList.remove('girando');
  $('span[data-t="actualizar"]', b).textContent = t('actualizar');
}
$('#btnActualizar').onclick = actualizarTodo;

// La sección "Hoy" se renueva cada vez que se vuelve a la app
document.addEventListener('visibilitychange', () => { if (!document.hidden) actualizarTodo(); });

function relojes() {
  const d = new Date();
  $('#relojES').textContent = hora(d, 'Europe/Madrid');
  $('#relojCO').textContent = hora(d, 'America/Bogota');
}

async function iniciar() {
  traducir();
  relojes();
  await cargarDatos();
  pintarCaso();
  pintarHoy();
  pintarNoticias();
  const inicial = location.hash.slice(1);
  if (['mapa', 'trenes', 'caso', 'noticias', 'seguro'].includes(inicial)) abrir(inicial);
  noticiasEnVivo();
  trenesEnVivo();
  pintarHeroe();
  setInterval(() => { relojes(); moverTrenes(); }, 1000);
  setInterval(() => { if (S.tab === 'trenes' && S.filtroEstado !== 'cercanias') pintarTrenes(); pintarTablero(); }, 15000);
  setInterval(() => { if (!document.hidden) trenesEnVivo(); }, 30000);
  setInterval(async () => { if (document.hidden) return; await cargarDatos(); pintarHoy(); pintarNoticias(); }, 5 * 60000);
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
}
iniciar();

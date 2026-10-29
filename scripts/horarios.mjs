// Horarios del día: baja los horarios oficiales (GTFS) de Alta Velocidad y Larga
// Distancia de Renfe y guarda solo los trenes de HOY que pasan por los corredores
// de la app, en data/horarios-hoy.json. La app usa estos horarios para estimar
// dónde va cada tren. Solo se regenera una vez al día (hora de España).
import { readFile, writeFile, mkdtemp, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { traer } from './lib.mjs';

const SALIDA = new URL('../data/horarios-hoy.json', import.meta.url);
const CORREDORES = new URL('../data/corredores.json', import.meta.url);

// Fuentes oficiales, en orden. Si una falla se prueba la siguiente.
const FUENTES = [
  ['Renfe (AV, LD y MD)', 'https://ssl.renfe.com/gtransit/Fichero_AV_LD/google_transit.zip'],
  ['Renfe vía Mobility Database', 'https://files.mobilitydatabase.org/mdb-2620/latest.zip']
];

// Cómo reconocer cada estación en los nombres del GTFS
const CLAVES = {
  'Madrid-Puerta de Atocha': /atocha/,
  'Ciudad Real': /^ciudad real/,
  'Puertollano': /^puertollano/,
  'Villanueva de Córdoba-Los Pedroches': /pedroches/,
  'Córdoba': /^cordoba/,
  'Sevilla-Santa Justa': /santa justa/,
  'Puente Genil-Herrera': /puente genil/,
  'Antequera-Santa Ana': /antequera/,
  'Málaga-María Zambrano': /^malaga/,
  'Loja': /^loja/,
  'Granada': /^granada/,
  'Toledo': /^toledo/,
  'Cuenca Fernando Zóbel': /cuenca/,
  'Requena-Utiel': /requena/,
  'València-Joaquín Sorolla': /sorolla/,
  'Guadalajara-Yebes': /yebes/,
  'Calatayud': /^calatayud/,
  'Zaragoza-Delicias': /delicias/,
  'Lleida': /^lleida/,
  'Camp de Tarragona': /camp de tarragona/,
  'Barcelona-Sants': /sants/
};

export const normal = (s) => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s+/g, ' ').trim();

export function csv(texto) {
  const filas = [];
  let fila = [], campo = '', comillas = false;
  texto = texto.replace(/^﻿/, '');
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (comillas) {
      if (c === '"') { if (texto[i + 1] === '"') { campo += '"'; i++; } else comillas = false; }
      else campo += c;
    } else if (c === '"') comillas = true;
    else if (c === ',') { fila.push(campo); campo = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++;
      fila.push(campo); campo = '';
      if (fila.length > 1 || fila[0] !== '') filas.push(fila);
      fila = [];
    } else campo += c;
  }
  if (campo !== '' || fila.length) { fila.push(campo); filas.push(fila); }
  const cab = (filas.shift() || []).map((h) => h.trim());
  return filas.map((f) => Object.fromEntries(cab.map((h, i) => [h, (f[i] ?? '').trim()])));
}

export function hoyEnEspana(d = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' }).formatToParts(d).map((x) => [x.type, x.value]));
  return { iso: `${p.year}-${p.month}-${p.day}`, compacto: `${p.year}${p.month}${p.day}`, dia: p.weekday.toLowerCase() };
}

const minutos = (h) => {
  const [a, b] = String(h).split(':').map(Number);
  return Number.isFinite(a) && Number.isFinite(b) ? a * 60 + b : null;
};

export function serviciosDeHoy(calendar, calendarDates, hoy) {
  const activos = new Set();
  for (const c of calendar) {
    if (c.start_date <= hoy.compacto && c.end_date >= hoy.compacto && c[hoy.dia] === '1') activos.add(c.service_id);
  }
  for (const c of calendarDates) {
    if (c.date !== hoy.compacto) continue;
    if (c.exception_type === '1') activos.add(c.service_id);
    if (c.exception_type === '2') activos.delete(c.service_id);
  }
  return activos;
}

export function construir(tablas, corredores, hoy) {
  const { stops, routes, trips, stop_times, calendar = [], calendar_dates = [] } = tablas;
  const activos = serviciosDeHoy(calendar, calendar_dates, hoy);

  // estación clave -> stop_ids del GTFS
  const claveDeStop = new Map();
  const paradas = {};
  for (const s of stops) {
    const n = normal(s.stop_name);
    for (const [nombre, re] of Object.entries(CLAVES)) {
      if (re.test(n)) { claveDeStop.set(s.stop_id, nombre); break; }
    }
  }
  const estacionesCorredor = corredores.map((c) => ({
    id: c.id,
    set: new Set([...(c.estaciones || []), ...(c.ramales || []).flat()].map((e) => e[0]))
  }));

  const rutas = new Map(routes.map((r) => [r.route_id, r]));
  const viajesHoy = new Map(trips.filter((t) => activos.has(t.service_id)).map((t) => [t.trip_id, t]));
  const porViaje = new Map();
  for (const st of stop_times) {
    if (!viajesHoy.has(st.trip_id)) continue;
    if (!porViaje.has(st.trip_id)) porViaje.set(st.trip_id, []);
    porViaje.get(st.trip_id).push(st);
  }
  const stopsPorId = new Map(stops.map((s) => [s.stop_id, s]));

  const viajes = [];
  for (const [tripId, lista] of porViaje) {
    lista.sort((a, b) => Number(a.stop_sequence) - Number(b.stop_sequence));
    const claves = lista.map((x) => claveDeStop.get(x.stop_id)).filter(Boolean);
    if (claves.length < 2) continue;
    let mejor = null, puntos = 1;
    for (const c of estacionesCorredor) {
      const n = claves.filter((k) => c.set.has(k)).length;
      // Madrid–Toledo solo cuenta si el tren va a Toledo
      if (c.id === 'toledo' && !claves.includes('Toledo')) continue;
      if (n > puntos) { puntos = n; mejor = c.id; }
    }
    if (!mejor) continue;
    const t = viajesHoy.get(tripId);
    const r = rutas.get(t.route_id) || {};
    const p = [];
    for (const x of lista) {
      const s = stopsPorId.get(x.stop_id);
      if (!s) continue;
      const lat = Number(s.stop_lat), lon = Number(s.stop_lon);
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;
      paradas[x.stop_id] = [s.stop_name, +lat.toFixed(5), +lon.toFixed(5)];
      const ll = minutos(x.arrival_time), sa = minutos(x.departure_time);
      if (ll == null && sa == null) continue;
      p.push([x.stop_id, ll ?? sa, sa ?? ll]);
    }
    if (p.length < 2) continue;
    viajes.push({
      id: tripId,
      tren: t.trip_short_name || (tripId.match(/\d{4,5}/) || [''])[0],
      tipo: (r.route_short_name || r.route_long_name || '').trim(),
      destino: t.trip_headsign || paradas[p[p.length - 1][0]]?.[0] || '',
      corredor: mejor,
      p
    });
  }
  viajes.sort((a, b) => a.p[0][2] - b.p[0][2]);
  return { paradas, viajes };
}

async function leerTablas(dir) {
  const archivos = await readdir(dir);
  const t = {};
  for (const nombre of ['stops', 'routes', 'trips', 'stop_times', 'calendar', 'calendar_dates']) {
    const f = archivos.find((a) => a.toLowerCase() === `${nombre}.txt`);
    t[nombre] = f ? csv(await readFile(join(dir, f), 'utf8')) : [];
  }
  return t;
}

async function main() {
  const hoy = hoyEnEspana();
  let previo = {};
  try { previo = JSON.parse(await readFile(SALIDA, 'utf8')); } catch {}
  if (previo.fecha === hoy.iso && previo.viajes?.length && !process.argv.includes('--forzar')) {
    console.log(`Horarios de ${hoy.iso} ya están listos.`);
    return;
  }
  const { corredores } = JSON.parse(await readFile(CORREDORES, 'utf8'));
  for (const [nombre, url] of FUENTES) {
    try {
      console.log(`Bajando horarios: ${nombre}`);
      const zip = await traer(url, { tipo: 'buffer', timeout: 120000 });
      const dir = await mkdtemp(join(tmpdir(), 'gtfs-'));
      await writeFile(join(dir, 'gtfs.zip'), zip);
      execFileSync('unzip', ['-o', '-q', join(dir, 'gtfs.zip'), '-d', dir]);
      const tablas = await leerTablas(dir);
      const { paradas, viajes } = construir(tablas, corredores, hoy);
      if (!viajes.length) throw new Error('no hay trenes de hoy en los corredores');
      await writeFile(SALIDA, JSON.stringify({ fecha: hoy.iso, zona: 'Europe/Madrid', generado: new Date().toISOString(), fuente: nombre, fuenteUrl: url, paradas, viajes }) + '\n');
      console.log(`Listo: ${viajes.length} trenes de hoy (${hoy.iso}).`);
      return;
    } catch (e) {
      console.log(`  falló ${nombre}: ${e.message}`);
    }
  }
  console.log('No se pudieron bajar horarios; se deja el archivo anterior.');
}

if (import.meta.url === `file://${process.argv[1]}`) main().catch((e) => { console.error(e); process.exit(1); });

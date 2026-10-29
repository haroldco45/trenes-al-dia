// Trenes en vivo: posiciones reales de los trenes de Cercanías de Renfe (datos
// abiertos GTFS-Realtime, licencia CC BY 4.0). Se sirve en /api/trenes.
import GtfsRealtimeBindings from 'gtfs-realtime-bindings';
import { traer } from '../../scripts/lib.mjs';

const BASE = 'https://gtfsrt.renfe.com';
const FeedMessage = GtfsRealtimeBindings.transit_realtime.FeedMessage;

async function feed(nombre) {
  // Primero la versión JSON; si no existe, la binaria oficial (.pb)
  try {
    const j = await traer(`${BASE}/${nombre}.json`, { tipo: 'json', timeout: 9000 });
    if (j && Array.isArray(j.entity)) return j;
  } catch {}
  const buf = await traer(`${BASE}/${nombre}.pb`, { tipo: 'buffer', timeout: 9000 });
  return FeedMessage.toObject(FeedMessage.decode(new Uint8Array(buf)), { enums: String, longs: Number });
}

const ESTADOS = { 0: 'llegando', 1: 'en_estacion', 2: 'en_marcha', INCOMING_AT: 'llegando', STOPPED_AT: 'en_estacion', IN_TRANSIT_TO: 'en_marcha' };

export function compactar(posiciones, actualizaciones) {
  const retrasos = new Map();
  for (const e of actualizaciones?.entity || []) {
    const tu = e.tripUpdate || e.trip_update;
    if (!tu) continue;
    const tid = tu.trip?.tripId || tu.trip?.trip_id;
    let r = tu.delay;
    const stu = tu.stopTimeUpdate || tu.stop_time_update || [];
    if (r == null && stu.length) r = stu[0].arrival?.delay ?? stu[0].departure?.delay;
    if (tid && r != null) retrasos.set(tid, Math.round(Number(r) / 60));
  }
  const vistos = new Set();
  const trenes = [];
  for (const e of posiciones?.entity || []) {
    const v = e.vehicle;
    if (!v?.position) continue;
    const lat = Number(v.position.latitude), lon = Number(v.position.longitude);
    if (!lat || !lon) continue;
    const tid = v.trip?.tripId || v.trip?.trip_id || e.id;
    if (vistos.has(tid)) continue;
    vistos.add(tid);
    const etiqueta = v.vehicle?.label || '';
    const linea = (etiqueta.match(/^([A-Z]+\d+[a-z]?)/) || [])[1] || (v.trip?.routeId || '').replace(/^\d+/, '');
    trenes.push({
      id: tid,
      lat: +lat.toFixed(5),
      lon: +lon.toFixed(5),
      linea,
      etiqueta,
      estado: ESTADOS[v.currentStatus ?? v.current_status] || 'en_marcha',
      parada: v.stopId || v.stop_id || '',
      retraso: retrasos.get(tid) ?? null,
      hora: Number(v.timestamp) || null
    });
  }
  return trenes;
}

export default async () => {
  try {
    const [pos, tu] = await Promise.all([feed('vehicle_positions'), feed('trip_updates').catch(() => null)]);
    const trenes = compactar(pos, tu);
    return Response.json(
      { ok: true, fuente: 'Renfe GTFS-Realtime (Cercanías y Rodalies), CC BY 4.0', hora: new Date().toISOString(), trenes },
      { headers: { 'cache-control': 'public, max-age=15', 'access-control-allow-origin': '*' } }
    );
  } catch (e) {
    return Response.json({ ok: false, error: e.message, trenes: [] }, { status: 502, headers: { 'access-control-allow-origin': '*' } });
  }
};

export const config = { path: '/api/trenes' };

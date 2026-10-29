// Robot de noticias: trae noticias reales y videos del caso cada 30 minutos.
// Lo corre GitHub Actions (.github/workflows/robot.yml) y guarda data/noticias.json.
import { readFile, writeFile } from 'node:fs/promises';
import { traer, leerRss, googleNewsUrl, CONSULTAS, esDelCaso, unicos } from './lib.mjs';

const ARCHIVO = new URL('../data/noticias.json', import.meta.url);
const CANALES_ARCHIVO = new URL('../data/canales.json', import.meta.url);

// Medios de España con RSS que traen foto de cada noticia
const MEDIOS = [
  ['RTVE', 'https://api2.rtve.es/rss/temas_noticias.xml'],
  ['El País', 'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada'],
  ['El Mundo', 'https://e00-elmundo.uecdn.es/elmundo/rss/portada.xml'],
  ['ABC', 'https://www.abc.es/rss/2.0/portada/'],
  ['20minutos', 'https://www.20minutos.es/rss/'],
  ['Europa Press', 'https://www.europapress.es/rss/rss.aspx'],
  ['La Vanguardia', 'https://www.lavanguardia.com/rss/home.xml'],
  ['eldiario.es', 'https://www.eldiario.es/rss/'],
  ['Infobae', 'https://www.infobae.com/arc/outboundfeeds/rss/?outputType=xml'],
  ['El Confidencial', 'https://rss.elconfidencial.com/espana/'],
  ['La Tribuna de Toledo', 'https://www.latribunadetoledo.es/rss/'],
  ['encastillalamancha', 'https://www.encastillalamancha.es/feed/']
];

// Canales de YouTube de noticias de España (se buscan por su @nombre)
const CANALES = ['@rtvenoticias', '@antena3noticias', '@laSextaNoticias', '@informativostelecinco', '@EFEnoticias', '@elpais', '@europapress', '@elmundo', '@CMMediaes'];

async function leerJson(url, porDefecto) {
  try { return JSON.parse(await readFile(url, 'utf8')); } catch { return porDefecto; }
}

async function deMedios() {
  const res = await Promise.allSettled(MEDIOS.map(async ([nombre, url]) => leerRss(await traer(url), nombre)));
  return res.flatMap((r, i) => {
    if (r.status === 'rejected') { console.log(`  medio sin respuesta: ${MEDIOS[i][0]} (${r.reason.message})`); return []; }
    return r.value.map((n) => ({ ...n, fuente: MEDIOS[i][0] })).filter(esDelCaso);
  });
}

async function deGoogle(lang) {
  try {
    const lista = leerRss(await traer(googleNewsUrl(CONSULTAS[lang], lang)));
    return lista.filter(esDelCaso).map((n) => ({ ...n, idioma: lang }));
  } catch (e) {
    console.log(`  Google News (${lang}) sin respuesta: ${e.message}`);
    return [];
  }
}

// Foto real de la noticia: busca og:image en la página original
async function fotoDe(url) {
  if (/news\.google\./.test(url)) return '';
  try {
    const html = await traer(url, { timeout: 8000 });
    const m = html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
    return m ? m[1].replace(/&amp;/g, '&') : '';
  } catch { return ''; }
}

async function idCanal(handle, cache) {
  if (cache[handle]) return cache[handle];
  try {
    const html = await traer(`https://www.youtube.com/${handle}`, { timeout: 10000 });
    const m = html.match(/"externalId":"(UC[\w-]{22})"/) || html.match(/"channelId":"(UC[\w-]{22})"/) || html.match(/channel_id=(UC[\w-]{22})/);
    if (m) { cache[handle] = m[1]; return m[1]; }
  } catch (e) { console.log(`  canal ${handle}: ${e.message}`); }
  return null;
}

async function videos() {
  const cache = await leerJson(CANALES_ARCHIVO, {});
  const salida = [];
  for (const h of CANALES) {
    const id = await idCanal(h, cache);
    if (!id) continue;
    try {
      const xml = await traer(`https://www.youtube.com/feeds/videos.xml?channel_id=${id}`);
      const canal = (xml.match(/<author>\s*<name>([^<]+)<\/name>/) || [])[1] || h;
      for (const e of xml.match(/<entry>[\s\S]*?<\/entry>/g) || []) {
        const vid = (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1];
        const titulo = ((e.match(/<title>([^<]+)<\/title>/) || [])[1] || '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        const fecha = (e.match(/<published>([^<]+)<\/published>/) || [])[1];
        if (vid && esDelCaso({ titulo })) salida.push({ id: vid, titulo, canal, fecha });
      }
    } catch (e) { console.log(`  videos ${h}: ${e.message}`); }
  }
  await writeFile(CANALES_ARCHIVO, JSON.stringify(cache, null, 2) + '\n');
  return salida;
}

async function main() {
  const previo = await leerJson(ARCHIVO, { noticias: [], videos: [] });
  console.log('Buscando noticias…');
  const [medios, es, en, vids] = await Promise.all([deMedios(), deGoogle('es'), deGoogle('en'), videos()]);
  console.log(`  medios: ${medios.length}, Google ES: ${es.length}, Google EN: ${en.length}, videos: ${vids.length}`);

  // Primero las de medios (traen foto y enlace directo), luego Google News, luego las que ya teníamos
  let todas = unicos([...medios, ...es, ...en, ...(previo.noticias || [])]);
  const limite = Date.now() - 1000 * 60 * 60 * 24 * 45;
  todas = todas.filter((n) => !n.fecha || new Date(n.fecha).getTime() > limite);
  todas.sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0));
  todas = todas.slice(0, 80);

  // Completar fotos que falten (máximo 15 por vuelta para no tardar)
  let pedidas = 0;
  for (const n of todas) {
    if (n.imagen || pedidas >= 15) continue;
    pedidas++;
    n.imagen = await fotoDe(n.url);
  }

  const vistos = new Set();
  const listaVideos = [...vids, ...(previo.videos || [])]
    .filter((v) => (vistos.has(v.id) ? false : vistos.add(v.id)))
    .sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0))
    .slice(0, 24);

  const contenido = { noticias: todas, videos: listaVideos };
  const { actualizado, ...anterior } = previo;
  if (JSON.stringify(contenido) === JSON.stringify(anterior)) {
    console.log('Sin cambios.');
    return;
  }
  await writeFile(ARCHIVO, JSON.stringify({ actualizado: new Date().toISOString(), ...contenido }, null, 2) + '\n');
  console.log(`Guardado: ${todas.length} noticias, ${listaVideos.length} videos.`);
}

main().catch((e) => { console.error(e); process.exit(1); });

// Utilidades compartidas por el robot y las funciones de Netlify.

export const UA = 'Mozilla/5.0 (compatible; TrenesAlDia/1.0; +https://trenes-al-dia.netlify.app)';

export async function traer(url, { timeout = 15000, tipo = 'text', headers = {} } = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    const r = await fetch(url, { headers: { 'user-agent': UA, 'accept-language': 'es-ES,es;q=0.9,en;q=0.6', ...headers }, signal: ctrl.signal, redirect: 'follow' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    if (tipo === 'json') return await r.json();
    if (tipo === 'buffer') return Buffer.from(await r.arrayBuffer());
    return await r.text();
  } finally {
    clearTimeout(t);
  }
}

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
export function limpiar(s = '') {
  return String(s)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => {
      if (e[0] === '#') {
        const n = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
        return Number.isFinite(n) ? String.fromCodePoint(n) : m;
      }
      return ENT[e.toLowerCase()] ?? m;
    })
    .replace(/\s+/g, ' ')
    .trim();
}

function etiqueta(xml, nombre) {
  const m = xml.match(new RegExp(`<${nombre}(?:\\s[^>]*)?>([\\s\\S]*?)</${nombre}>`, 'i'));
  return m ? m[1] : '';
}

// Lee un RSS o Atom y devuelve {titulo, url, fuente, fecha, imagen, resumen}.
export function leerRss(xml, fuentePorDefecto = '') {
  const bloques = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  return bloques.map((b) => {
    let url = limpiar(etiqueta(b, 'link'));
    if (!url) {
      const m = b.match(/<link[^>]*href="([^"]+)"/i);
      if (m) url = m[1];
    }
    let titulo = limpiar(etiqueta(b, 'title'));
    let fuente = limpiar(etiqueta(b, 'source')) || fuentePorDefecto;
    // Google News pone " - Medio" al final del título
    if (/news\.google\./.test(url)) {
      const corte = titulo.lastIndexOf(' - ');
      if (corte > 20) {
        fuente = fuente || titulo.slice(corte + 3);
        titulo = titulo.slice(0, corte);
      }
    }
    const fecha = limpiar(etiqueta(b, 'pubDate') || etiqueta(b, 'published') || etiqueta(b, 'updated') || etiqueta(b, 'dc:date'));
    let imagen = '';
    const im =
      b.match(/<media:content[^>]*url="([^"]+)"[^>]*(?:medium="image"|type="image)/i) ||
      b.match(/<media:content[^>]*url="([^"]+\.(?:jpe?g|png|webp)[^"]*)"/i) ||
      b.match(/<media:thumbnail[^>]*url="([^"]+)"/i) ||
      b.match(/<enclosure[^>]*url="([^"]+)"[^>]*type="image/i) ||
      b.match(/<enclosure[^>]*type="image[^"]*"[^>]*url="([^"]+)"/i) ||
      b.match(/<img[^>]*src="([^"]+)"/i);
    if (im) imagen = im[1].replace(/&amp;/g, '&');
    const resumen = limpiar(etiqueta(b, 'description') || etiqueta(b, 'summary')).slice(0, 280);
    const d = new Date(fecha);
    return { titulo, url, fuente, fecha: Number.isNaN(d.getTime()) ? null : d.toISOString(), imagen, resumen };
  }).filter((n) => n.titulo && n.url);
}

export function googleNewsUrl(q, lang = 'es') {
  const p = lang === 'en' ? 'hl=en-GB&gl=GB&ceid=GB:en' : 'hl=es&gl=ES&ceid=ES:es';
  return `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&${p}`;
}

export const CONSULTAS = {
  es: 'tren Toledo Urda OR "Los Yébenes" OR Iryo OR AVE accidente when:7d',
  en: 'Toledo train collision OR crash Spain Iryo AVE when:7d'
};

// Una noticia es del caso si habla de trenes y del lugar o del accidente.
const A = /\b(tren|trenes|ferroviari\w*|AVE|Iryo|Adif|Renfe|train|trains|rail|railway|LZB|maquinista)\b/i;
const B = /\b(Toledo|Urda|Y[ée]benes|Mora|Orgaz|choque|colisi[óo]n|accidente|siniestro|v[íi]ctimas|fallecid\w*|muertos|crash|collision|derail\w*|dead|killed|tragedia)\b/i;
export function esDelCaso(n) {
  const t = `${n.titulo} ${n.resumen || ''}`;
  return A.test(t) && B.test(t);
}

export function claveTitulo(t) {
  return t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]/g, '').split(' ').filter((w) => w.length > 3).slice(0, 8).join(' ');
}

export function unicos(lista) {
  const vistos = new Set();
  return lista.filter((n) => {
    const k = claveTitulo(n.titulo);
    if (!k || vistos.has(k)) return false;
    vistos.add(k);
    return true;
  });
}

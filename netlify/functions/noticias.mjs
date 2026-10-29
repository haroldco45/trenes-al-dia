// Búsqueda en vivo de noticias del caso. Se sirve en /api/noticias?q=...&lang=es|en
import { traer, leerRss, googleNewsUrl, CONSULTAS, esDelCaso, unicos } from '../../scripts/lib.mjs';

export default async (req) => {
  const u = new URL(req.url);
  const lang = u.searchParams.get('lang') === 'en' ? 'en' : 'es';
  const extra = (u.searchParams.get('q') || '').slice(0, 80).replace(/[^\p{L}\p{N} "'-]/gu, ' ').trim();
  const q = extra ? `${CONSULTAS[lang].replace(/ when:7d$/, '')} ${extra} when:7d` : CONSULTAS[lang];
  try {
    let lista = leerRss(await traer(googleNewsUrl(q, lang), { timeout: 9000 }));
    if (!extra) lista = lista.filter(esDelCaso);
    lista = unicos(lista).sort((a, b) => new Date(b.fecha || 0) - new Date(a.fecha || 0)).slice(0, 30);
    return Response.json(
      { ok: true, hora: new Date().toISOString(), noticias: lista.map((n) => ({ ...n, idioma: lang })) },
      { headers: { 'cache-control': 'public, max-age=120', 'access-control-allow-origin': '*' } }
    );
  } catch (e) {
    return Response.json({ ok: false, error: e.message, noticias: [] }, { status: 502, headers: { 'access-control-allow-origin': '*' } });
  }
};

export const config = { path: '/api/noticias' };

/* Maho's Tours · app v2 */
(() => {
'use strict';
const N = window.NEGOCIO;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)');
const SVGNS = 'http://www.w3.org/2000/svg';
let lang = document.documentElement.lang || 'es';

const UI = {
  es: {
    compartido: 'Compartido', privado: 'Privado', yates: 'Yates privados', mixto: 'Compartido o privado', yates_c: 'Yate',
    adultos: 'Adultos', menores: 'Menores', personas: 'Personas', anglers: 'Pescadores',
    modo: 'Modalidad', barco: 'Barco', aprox: 'aprox.', variable: 'Variable',
    porconfirmar: 'por definir', regreso: 'Regreso a', playa: 'Playa a elegir: Punta Lupona, San Gabriel o La Bonanza',
    hasta: 'hasta', abierto: 'Contestando WhatsApp ahora', cerrado: 'Fuera de horario · te contestamos a las ',
    horario: 'Todos los días · 8:00 a 20:00 (horario de muestra)', yateChip: 'Yate de día completo',
    desde: 'Desde', por_persona: 'por persona', por_barco: 'por embarcación', total_est: 'total estimado',
    verruta: 'Ver ruta', reservar: 'Reservar', sale: 'Sale de', km: 'km del malecón', km_v: 'km desde La Ventana',
    msg: (t) => `Tour: ${t.tour}. Fecha: ${t.fecha}. ${t.gente}. Total estimado: ${t.total}.`,
    gente_ad: (a, m) => `Personas: ${a} adulto${a === 1 ? '' : 's'}${m ? `, ${m} menor${m === 1 ? '' : 'es'}` : ''}`,
    gente: (p) => `Personas: ${p}`
  },
  en: {
    compartido: 'Shared', privado: 'Private', yates: 'Private yachts', mixto: 'Shared or private', yates_c: 'Yacht',
    adultos: 'Adults', menores: 'Kids', personas: 'Guests', anglers: 'Anglers',
    modo: 'Type', barco: 'Boat', aprox: 'approx.', variable: 'Varies',
    porconfirmar: 'TBD', regreso: 'Back to', playa: 'Beach of your choice: Punta Lupona, San Gabriel or La Bonanza',
    hasta: 'up to', abierto: 'Answering WhatsApp now', cerrado: 'After hours · we reply at ',
    horario: 'Every day · 8 a.m. to 8 p.m. (sample hours)', yateChip: 'Full-day yacht',
    desde: 'From', por_persona: 'per person', por_barco: 'per boat', total_est: 'estimated total',
    verruta: 'See route', reservar: 'Book', sale: 'Departs', km: 'km from the boardwalk', km_v: 'km from La Ventana',
    msg: (t) => `Tour: ${t.tour}. Date: ${t.fecha}. ${t.gente}. Estimated total: ${t.total}.`,
    gente_ad: (a, m) => `Guests: ${a} adult${a === 1 ? '' : 's'}${m ? `, ${m} kid${m === 1 ? '' : 's'}` : ''}`,
    gente: (p) => `Guests: ${p}`
  }
};
const u = () => UI[lang];
const money = (n) => '$' + new Intl.NumberFormat(lang === 'en' ? 'en-US' : 'es-MX', { maximumFractionDigits: 0 }).format(n) + ' MXN';
const waLink = (extra = '') => `https://wa.me/${N.whatsapp}?text=${encodeURIComponent(N.wa_mensaje[lang] + (extra ? ' ' + extra : ''))}`;
const dirLink = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
function paintLinks() {
  $$('.js-wa').forEach(a => { a.href = waLink(a.dataset['waExtra' + (lang === 'en' ? 'En' : 'Es')] || ''); });
  $$('.js-tel').forEach(a => { a.href = `tel:${N.telefono}`; });
}

/* ---------- idioma ---------- */
const T = (() => {
  const orig = new Map(), origAttr = new Map();
  const origTitle = document.title;
  function apply(l) {
    lang = l;
    const dict = (window.I18N && window.I18N[l]) || null;
    $$('[data-t]').forEach(el => {
      if (!orig.has(el)) orig.set(el, el.textContent);
      el.textContent = dict && dict[el.dataset.t] ? dict[el.dataset.t] : orig.get(el);
    });
    $$('[data-t-attr]').forEach(el => {
      el.dataset.tAttr.split(';').forEach(pair => {
        const [attr, key] = pair.split(':');
        if (!origAttr.has(el)) origAttr.set(el, {});
        const store = origAttr.get(el);
        if (!(attr in store)) store[attr] = el.getAttribute(attr) || '';
        el.setAttribute(attr, dict && dict[key] ? dict[key] : store[attr]);
      });
    });
    document.title = dict && dict._title ? dict._title : origTitle;
    document.documentElement.lang = l;
    $$('.lang button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === l)));
    try { localStorage.setItem('lang', l); } catch (e) {}
    document.dispatchEvent(new CustomEvent('langchange', { detail: l }));
  }
  return { apply };
})();
$$('.lang button').forEach(b => b.addEventListener('click', () => T.apply(b.dataset.lang)));

/* ---------- datos de tours ---------- */
const YATES_TOUR = {
  id: 'yates', tipo: 'yates', duracion: 8, horario: null, salida: 'marina', ruta: N.yate_ruta,
  nombre: { es: 'Yate de día completo', en: 'Full-day yacht' },
  linea: { es: 'Ocho horas en tu propio barco: playa a elegir en Espíritu Santo, Balandra y los lobos de La Loberita.', en: 'Eight hours on your own boat: a beach of your choice on Espíritu Santo, then Balandra and the La Loberita sea lions.' },
  incluye: { es: N.yate_menu.es, en: N.yate_menu.en }
};
const TOURS = Object.fromEntries([...N.tours, YATES_TOUR].map(t => [t.id, t]));
const GAL = {
  'es-balandra': ['g-balandra-2', 't-es', 'v-amantes'],
  'es-privado': ['g-esp-privado', 't-esp'],
  'balandra-privado': ['g-balandra-1', 'g-balandra-2'],
  'pesca': ['t-pesca'],
  'cerralvo': ['g-cerralvo-2', 'g-cerralvo-1'],
  'tiburon': ['g-tiburon-1', 'g-tiburon-2'],
  'yates': ['t-yates']
};
const ORDER = ['es-balandra', 'tiburon', 'cerralvo', 'es-privado', 'balandra-privado', 'pesca', 'yates'];
const yateById = (id) => N.yates.find(y => y.id === id);
const yName = (y) => typeof y.nombre === 'string' ? y.nombre : y.nombre[lang];
const tipoLabel = (t) => t.id === 'cerralvo' ? u().mixto : u()[t.tipo];
const fromPrice = (t) => t.id === 'yates' ? Math.min(...N.yates.map(y => y.precio)) : t.precios[0].monto;
const perPerson = (t) => t.id === 'es-balandra' || t.id === 'tiburon' || t.id === 'cerralvo';
function totalFor(id, p, extra = {}) {
  const a = extra.adultos ?? p, m = extra.menores ?? 0;
  if (id === 'es-balandra') return a * 1300 + m * 1200;
  if (id === 'cerralvo') return extra.modo === 'privado' ? 10000 : p * 1600;
  if (id === 'tiburon') return p * 1600;
  if (id === 'pesca') return 6500 + Math.max(0, p - 2) * 500;
  if (id === 'yates') return yateById(extra.barco || 'sea-ray-40').precio;
  return TOURS[id].precios[0].monto;
}

/* ---------- mapa ---------- */
const W = 1000, H = 950;
const proj = (lat, lon) => [(lon + 110.5) / 0.75 * W, (24.65 - lat) / 0.65 * H];
const P = {};
Object.entries(N.paradas).forEach(([k, v]) => { P[k] = proj(v.lat, v.lon); });
const km = (a, b) => {
  const A = N.paradas[a], B = N.paradas[b], R = 6371, rad = Math.PI / 180;
  const dLat = (B.lat - A.lat) * rad, dLon = (B.lon - A.lon) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(A.lat * rad) * Math.cos(B.lat * rad) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
};
const COAST = {
  main: [[0,700],[60,694],[120,690],[180,694],[226,700],[214,708],[175,716],[150,728],[178,742],[212,744],[238,730],[249,716],[253,695],[251,668],[245,640],[239,610],[233,580],[230,555],[227,528],[224,504],[238,500],[250,492],[253,480],[245,471],[233,469],[237,459],[250,452],[262,444],[274,437],[300,442],[340,452],[400,468],[460,486],[520,505],[560,535],[600,580],[628,625],[648,680],[662,745],[675,815],[690,862],[712,872],[760,866],[820,862],[893,872],[940,895],[1000,915],[1000,950],[0,950]],
  espiritu: [[258,334],[262,316],[262,302],[270,290],[262,262],[246,226],[228,200],[214,184],[204,172],[198,176],[190,170],[196,150],[186,118],[172,92],[160,78],[148,76],[138,86],[134,104],[142,114],[140,128],[134,140],[140,152],[146,166],[150,180],[158,200],[162,224],[172,250],[178,276],[172,292],[182,300],[196,312],[194,326],[204,342],[220,348],[234,348],[248,342]],
  cerralvo: [[705,362],[724,360],[748,384],[778,420],[812,466],[846,515],[876,565],[905,615],[930,665],[948,715],[950,752],[934,758],[908,724],[880,680],[848,630],[814,580],[782,530],[752,476],[726,424],[708,390]]
};
const ISLETS = [[124,58,7],[118,66,4],[238,398,4.5]];
const SHOALS = [[240,486,34,22],[150,175,40,90],[195,320,28,40],[200,700,70,14],[930,740,40,30],[262,300,18,26]];
const VIA = {
  'muelle>balandra': [[222,690],[205,620],[206,540],[216,500]],
  'balandra>islotes': [[222,450],[214,410],[200,380],[160,330],[140,250],[115,170],[110,100]],
  'islotes>ensenada': [[112,92]],
  'ensenada>gabriel': [[118,150],[135,210],[158,280]],
  'gabriel>muelle': [[175,345],[205,385],[210,440],[205,540],[210,630],[222,690]],
  'marina>islotes': [[222,690],[205,620],[206,540],[214,460],[200,380],[160,330],[140,250],[115,170],[110,100]],
  'gabriel>lupona': [[195,345]],
  'lupona>marina': [[215,390],[208,440],[205,540],[210,630],[222,690]],
  'marina>balandra': [[222,690],[205,620],[206,540],[216,500]],
  'marina>pesca': [[222,690],[205,620],[206,540],[214,460],[240,415],[300,380],[350,345]],
  'muelle>ballena': [[236,702],[212,684]],
  'ventana>cerralvo': [[735,830],[752,720],[760,630]],
  'marina>gabriel': [[222,690],[205,620],[206,540],[210,440],[205,385],[175,345]],
  'gabriel>balandra': [[175,345],[205,385],[214,430],[222,460]],
  'balandra>loberita': [[224,452],[222,420]],
  'loberita>marina': [[214,420],[208,470],[205,540],[210,630],[222,690]]
};
/* destinos del mapa general */
const DESTS = [
  { k: 'balandra', tour: 'balandra-privado', es: ['Balandra', 'Agua turquesa a la rodilla y El Hongo'], en: ['Balandra', 'Knee-deep turquoise water and El Hongo'] },
  { k: 'gabriel', tour: 'es-balandra', es: ['Bahía San Gabriel', 'Isla Espíritu Santo · aves'], en: ['San Gabriel Bay', 'Espíritu Santo Island · seabirds'] },
  { k: 'ensenada', tour: 'es-balandra', es: ['Ensenada Grande', 'Lunch en la playa'], en: ['Ensenada Grande', 'Lunch on the beach'] },
  { k: 'islotes', tour: 'es-privado', es: ['Los Islotes', 'Colonia de lobos marinos'], en: ['Los Islotes', 'Sea lion colony'] },
  { k: 'ballena', tour: 'tiburon', es: ['Tiburón ballena', 'Dentro de la Bahía de La Paz'], en: ['Whale sharks', 'Inside the Bay of La Paz'] },
  { k: 'pesca', tour: 'pesca', es: ['Pesca deportiva', 'Mar abierto del Cortés'], en: ['Sportfishing', 'Open Sea of Cortez'] },
  { k: 'cerralvo', tour: 'cerralvo', from: 'ventana', es: ['Isla Cerralvo', 'Lobos, arrecifes, delfines'], en: ['Cerralvo Island', 'Sea lions, reefs, dolphins'] }
];

function svgEl(tag, attrs = {}, parent) {
  const el = document.createElementNS(SVGNS, tag);
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (parent) parent.appendChild(el);
  return el;
}
function smooth(pts, closed) {
  if (pts.length < 2) return '';
  const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < p.length - 2; i++) {
    const [x0, y0] = p[i - 1], [x1, y1] = p[i], [x2, y2] = p[i + 1], [x3, y3] = p[i + 2];
    const t = 0.5 / 3;
    d += ` C${(x1 + (x2 - x0) * t).toFixed(1)} ${(y1 + (y2 - y0) * t).toFixed(1)} ${(x2 - (x3 - x1) * t).toFixed(1)} ${(y2 - (y3 - y1) * t).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  return closed ? d + 'Z' : d;
}
const svg = $('.chart__svg');
const world = $('.world', svg);
function drawBase() {
  const grid = $('.chart__grid', svg), land = $('.chart__land', svg), shoals = $('.chart__shoals', svg);
  [[24 + 10 / 60, '24°10′N'], [24 + 20 / 60, '24°20′N'], [24.5, '24°30′N']].forEach(([lat, t]) => {
    const y = proj(lat, -110)[1];
    svgEl('line', { x1: 0, x2: W, y1: y, y2: y, class: 'grid-line', 'vector-effect': 'non-scaling-stroke' }, grid);
    svgEl('text', { x: 8, y: y - 6, class: 'grid-lab sc' }, grid).textContent = t;
  });
  [[-110 - 20 / 60, '110°20′W'], [-110 - 10 / 60, '110°10′W'], [-110, '110°00′W'], [-109 - 50 / 60, '109°50′W']].forEach(([lon, t]) => {
    const x = proj(24, lon)[0];
    svgEl('line', { x1: x, x2: x, y1: 0, y2: H, class: 'grid-line', 'vector-effect': 'non-scaling-stroke' }, grid);
    svgEl('text', { x: x + 6, y: 16, class: 'grid-lab sc' }, grid).textContent = t;
  });
  SHOALS.forEach(([cx, cy, rx, ry]) => svgEl('ellipse', { cx, cy, rx, ry, fill: 'url(#shoal)' }, shoals));
  Object.values(COAST).forEach(pts => {
    const d = smooth(pts, true);
    svgEl('path', { d, class: 'land', 'vector-effect': 'non-scaling-stroke' }, land);
    svgEl('path', { d, class: 'land-hatch' }, land);
  });
  ISLETS.forEach(([cx, cy, r]) => svgEl('circle', { cx, cy, r, class: 'land', 'vector-effect': 'non-scaling-stroke' }, land));
  svgEl('path', { d: 'M238 386l3 8h-6z', fill: '#6b5039' }, land);
}
const PLACES = {
  es: [['La Paz', 300, 724, 'place sc'], ['Bahía de La Paz', 30, 560, 'place place--sea sc'], ['Isla Espíritu Santo', 282, 222, 'place place--key sc'], ['Isla Partida', 205, 102, 'place sc'], ['Isla Cerralvo', 870, 470, 'place place--key sc', 55], ['Mar de Cortés', 470, 260, 'place place--sea sc'], ['La Ventana', 600, 912, 'place sc'], ['Pichilingue', 268, 590, 'place sc']],
  en: [['La Paz', 300, 724, 'place sc'], ['Bay of La Paz', 30, 560, 'place place--sea sc'], ['Espíritu Santo Island', 282, 222, 'place place--key sc'], ['Isla Partida', 205, 102, 'place sc'], ['Cerralvo Island', 870, 470, 'place place--key sc', 55], ['Sea of Cortez', 470, 260, 'place place--sea sc'], ['La Ventana', 600, 912, 'place sc'], ['Pichilingue', 268, 590, 'place sc']]
};
function drawPlaces() {
  const g = $('.chart__labels', svg); g.textContent = '';
  PLACES[lang].forEach(([t, x, y, cls, rot]) => {
    const el = svgEl('text', { x, y, class: cls }, g);
    if (rot) el.setAttribute('transform', `rotate(${rot} ${x} ${y})`);
    el.textContent = t;
  });
}

let scale = 1;
function fitTo(points) {
  if (!points) { scale = 1; world.style.transform = 'translate(0px, 0px) scale(1)'; sizeText(); return; }
  const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
  const pad = 70;
  const x0 = Math.min(...xs) - pad, x1 = Math.max(...xs) + pad * 2.2, y0 = Math.min(...ys) - pad, y1 = Math.max(...ys) + pad;
  let s = Math.max(1, Math.min(W / (x1 - x0), H / (y1 - y0), 2.6));
  const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  let tx = W / 2 - cx * s, ty = H / 2 - cy * s;
  tx = Math.min(0, Math.max(W - W * s, tx));
  ty = Math.min(0, Math.max(H - H * s, ty));
  scale = s;
  world.style.transform = `translate(${tx}px, ${ty}px) scale(${s})`;
  sizeText();
}
function sizeText() {
  const wpx = svg.getBoundingClientRect().width;
  const px = wpx / W || 0.5;
  const k = 1 / (scale * px);
  $('.chart').classList.toggle('compact', wpx > 0 && wpx < 620);
  svg.style.setProperty('--u', k.toFixed(4));
  $$('.stop circle', svg).forEach(c => c.setAttribute('r', (11 * k).toFixed(2)));
  $$('.stop .lab', svg).forEach(t => { t.setAttribute('dx', (16 * k).toFixed(2)); t.setAttribute('dy', (5 * k).toFixed(2)); });
  const cmp = wpx > 0 && wpx < 620;
  $$('.pin .dot', svg).forEach(c => c.setAttribute('r', ((c.closest('.pin--home') ? 8 : cmp ? 11 : 7) * k).toFixed(2)));
  $$('.pin .ring', svg).forEach(c => c.setAttribute('r', (8 * k).toFixed(2)));
  $$('.pin .lab', svg).forEach(t => { t.setAttribute('dx', (14 * k).toFixed(2)); t.setAttribute('dy', (1 * k).toFixed(2)); });
  $$('.pin .km', svg).forEach(t => { t.setAttribute('dx', (14 * k).toFixed(2)); t.setAttribute('dy', (15 * k).toFixed(2)); });
  const boat = $('.boat-shape', svg);
  if (boat) boat.setAttribute('transform', `scale(${(1.1 * k).toFixed(3)})`);
}

/* mapa general: pines que caen y líneas desde el malecón */
let pinsTimer = [];
function clearPins() { pinsTimer.forEach(clearTimeout); pinsTimer = []; $('.chart__pins', svg).textContent = ''; $('.chart__rays', svg).textContent = ''; }
function drawOverview(animate) {
  clearRoute();
  clearPins();
  fitTo(null);
  const pins = $('.chart__pins', svg), rays = $('.chart__rays', svg);
  const homes = [['muelle', lang === 'en' ? 'Boardwalk · departures' : 'Malecón · salidas'], ['ventana', 'La Ventana']];
  homes.forEach(([k, label], i) => {
    const [x, y] = P[k];
    const g = svgEl('g', { class: 'pin pin--home' + (animate ? '' : ' on'), transform: `translate(${x} ${y})` }, pins);
    const d = svgEl('g', { class: 'drop' }, g);
    svgEl('circle', { class: 'ring' }, d); svgEl('circle', { class: 'dot' }, d);
    const t = svgEl('text', { class: 'lab sc' }, d); t.textContent = label;
    if (animate) pinsTimer.push(setTimeout(() => g.classList.add('on'), 150 + i * 120));
  });
  DESTS.forEach((dst, i) => {
    const from = dst.from || 'muelle';
    const [x0, y0] = P[from], [x, y] = P[dst.k];
    const mx = (x0 + x) / 2 + (y - y0) * 0.12, my = (y0 + y) / 2 - (x - x0) * 0.12;
    const ray = svgEl('path', { d: `M${x0} ${y0} Q${mx} ${my} ${x} ${y}`, class: 'ray ray-draw', 'vector-effect': 'non-scaling-stroke' }, rays);
    const len = ray.getTotalLength(); ray.style.setProperty('--len', len.toFixed(1));
    const g = svgEl('g', { class: 'pin', transform: `translate(${x} ${y})`, tabindex: '-1', 'data-tour': dst.tour }, pins);
    const d = svgEl('g', { class: 'drop' }, g);
    svgEl('circle', { class: 'ring' }, d); svgEl('circle', { class: 'dot' }, d);
    const t = svgEl('text', { class: 'lab sc' }, d); t.textContent = dst[lang][0];
    const k = svgEl('text', { class: 'km sc' }, d); k.textContent = `${km(from, dst.k)} km`;
    const pn = svgEl('text', { class: 'pn sc' }, d); pn.textContent = String(i + 1);
    g.addEventListener('click', () => selectTour(dst.tour));
    if (animate && !RM.matches) {
      pinsTimer.push(setTimeout(() => { ray.classList.add('on'); }, 400 + i * 260));
      pinsTimer.push(setTimeout(() => { g.classList.add('on'); }, 900 + i * 260));
    } else { ray.classList.add('on'); g.classList.add('on'); }
  });
  sizeText();
}
function renderDests() {
  const ol = $('.js-dests'); ol.textContent = '';
  DESTS.forEach(dst => {
    const li = document.createElement('li');
    const b = document.createElement('button'); b.type = 'button';
    const from = dst.from || 'muelle';
    b.innerHTML = '<span class="n"></span><span class="k"></span>';
    b.firstChild.textContent = dst[lang][0];
    const sm = document.createElement('small'); sm.textContent = dst[lang][1]; b.firstChild.appendChild(sm);
    b.lastChild.textContent = `${km(from, dst.k)} km`;
    b.title = from === 'ventana' ? u().km_v : u().km;
    b.addEventListener('click', () => selectTour(dst.tour));
    li.appendChild(b); ol.appendChild(li);
  });
}

/* ruta de un tour */
let drawRaf = null;
function clearRoute() {
  if (drawRaf) cancelAnimationFrame(drawRaf); drawRaf = null;
  $$('.route', svg).forEach(p => p.setAttribute('d', ''));
  $('.chart__stops', svg).textContent = '';
  $('.chart__boat', svg).classList.remove('on');
}
function routePoints(ruta) {
  const pts = [P[ruta[0]]];
  for (let i = 1; i < ruta.length; i++) {
    const via = VIA[`${ruta[i - 1]}>${ruta[i]}`] || VIA[`${ruta[i]}>${ruta[i - 1]}`]?.slice().reverse() || [];
    pts.push(...via, P[ruta[i]]);
  }
  return pts;
}
function drawRoute(tour, instant) {
  clearPins();
  const ruta = tour.ruta;
  const pts = routePoints(ruta);
  const d = smooth(pts, false);
  const live = $('.route--live', svg), ghost = $('.route--ghost', svg);
  live.setAttribute('d', d); ghost.setAttribute('d', d);
  live.setAttribute('vector-effect', 'non-scaling-stroke'); ghost.setAttribute('vector-effect', 'non-scaling-stroke');
  const g = $('.chart__stops', svg); g.textContent = '';
  const uniq = [...new Set(ruta)];
  const alts = tour.id === 'yates' ? ['lupona', 'bonanza'] : [];
  [...uniq, ...alts].forEach((k, i) => {
    const isAlt = alts.includes(k);
    const [x, y] = P[k];
    const s = svgEl('g', { class: 'stop' + (isAlt ? ' stop--alt' : ''), transform: `translate(${x} ${y})` }, g);
    svgEl('circle', { r: 11, 'vector-effect': 'non-scaling-stroke' }, s);
    const n = svgEl('text', { class: 'n sc' }, s); n.textContent = isAlt ? '·' : String(i + 1);
    const lab = svgEl('text', { class: 'lab sc', dx: 16, dy: 5 }, s); lab.textContent = N.paradas[k][lang];
  });
  fitTo([...pts, ...alts.map(k => P[k])]);
  const len = live.getTotalLength();
  live.style.setProperty('--len', len.toFixed(1));
  const boat = $('.chart__boat', svg);
  const stops = $$('.stop', g);
  const stopAt = uniq.map((k, idx) => {
    if (idx === 0) return 0;
    let best = 0, bd = 1e9;
    for (let l = 0; l <= len; l += len / 240) { const p = live.getPointAtLength(l); const dd = (p.x - P[k][0]) ** 2 + (p.y - P[k][1]) ** 2; if (dd < bd) { bd = dd; best = l; } }
    return best;
  });
  if (drawRaf) cancelAnimationFrame(drawRaf);
  if (instant || RM.matches) {
    live.style.setProperty('--off', 0);
    stops.forEach(s => s.classList.add('on'));
    const p = live.getPointAtLength(len * 0.5);
    boat.setAttribute('transform', `translate(${p.x} ${p.y})`); boat.classList.add('on');
    return;
  }
  live.style.setProperty('--off', len.toFixed(1));
  const dur = Math.min(3400, 1500 + len * 1.6);
  let t0 = null;
  boat.classList.add('on');
  const step = (now) => {
    if (t0 === null) t0 = now + 350;      // deja que el zoom empiece primero
    const t = Math.max(0, Math.min(1, (now - t0) / dur));
    const e = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const l = len * e;
    live.style.setProperty('--off', (len - l).toFixed(1));
    const p = live.getPointAtLength(l), q = live.getPointAtLength(Math.min(len, l + 2));
    const ang = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
    boat.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
    stops.forEach((s, i) => { if (i >= stopAt.length || l >= stopAt[i] - 1) s.classList.add('on'); });
    if (t < 1) drawRaf = requestAnimationFrame(step); else drawRaf = null;
  };
  drawRaf = requestAnimationFrame(step);
}

/* ---------- detalle y cotizador ---------- */
const state = { tour: 'todos', fecha: '', adultos: 2, menores: 0, personas: 2, modo: 'compartido', barco: 'sea-ray-40' };
const detail = $('#detail');
function limits(t) {
  if (t.id === 'pesca') return [1, 4];
  if (t.id === 'balandra-privado') return [1, 6];
  if (t.id === 'cerralvo' && state.modo === 'privado') return [1, 6];
  if (t.id === 'yates') return [1, yateById(state.barco).personas];
  return [1, 20];
}
function stopName(k, i, ruta) {
  if (i === ruta.length - 1 && k === ruta[0]) return `${u().regreso} ${N.paradas[k][lang]}`;
  if (ruta === N.yate_ruta && k === 'gabriel') return u().playa;
  return N.paradas[k][lang];
}
function li(list, text) { const el = document.createElement('li'); el.textContent = text; list.appendChild(el); return el; }
function stepper(key, label, min, max) {
  const wrap = document.createElement('div'); wrap.className = 'stepper';
  const id = 'st-' + key;
  wrap.innerHTML = `<span id="${id}"></span><div class="stepper__ctl" role="group" aria-labelledby="${id}"><button type="button" aria-label="−">−</button><output aria-live="polite"></output><button type="button" aria-label="+">+</button></div>`;
  wrap.firstChild.textContent = label;
  const [minus, plus] = $$('button', wrap), out = $('output', wrap);
  const sync = () => { out.textContent = state[key]; minus.disabled = state[key] <= min; plus.disabled = state[key] >= max; };
  minus.addEventListener('click', () => { state[key] = Math.max(min, state[key] - 1); sync(); updateTotal(); });
  plus.addEventListener('click', () => { state[key] = Math.min(max, state[key] + 1); sync(); updateTotal(); });
  state[key] = Math.min(max, Math.max(min, state[key]));
  sync();
  return wrap;
}
function seg(label, key, options, onChange) {
  const wrap = document.createElement('div'); wrap.className = 'seg';
  const lab = document.createElement('span'); lab.textContent = label; wrap.appendChild(lab);
  const ctl = document.createElement('div'); ctl.className = 'seg__ctl'; ctl.setAttribute('role', 'group'); ctl.setAttribute('aria-label', label);
  options.forEach(([val, text]) => {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = text; b.setAttribute('aria-pressed', String(state[key] === val));
    b.addEventListener('click', () => { state[key] = val; onChange(); });
    ctl.appendChild(b);
  });
  wrap.appendChild(ctl);
  return wrap;
}
function renderControls(t) {
  const st = $('.js-steppers', detail), op = $('.js-options', detail);
  st.textContent = ''; op.textContent = '';
  if (t.id === 'cerralvo') op.appendChild(seg(u().modo, 'modo', [['compartido', u().compartido], ['privado', u().privado]], () => { renderControls(t); updateTotal(); }));
  if (t.id === 'yates') op.appendChild(seg(u().barco, 'barco', N.yates.map(y => [y.id, `${yName(y)} · ${y.personas}`]), () => { renderControls(t); renderPrices(t); renderIncluye(t); updateTotal(); }));
  const [mn, mx] = limits(t);
  if (t.id === 'es-balandra') {
    st.appendChild(stepper('adultos', u().adultos, 1, 20));
    st.appendChild(stepper('menores', u().menores, 0, 20));
  } else st.appendChild(stepper('personas', t.id === 'pesca' ? u().anglers : u().personas, mn, mx));
}
function renderPrices(t) {
  const box = $('.js-prices', detail); box.textContent = '';
  const items = t.id === 'yates'
    ? N.yates.map(y => ({ k: `${yName(y)} · ${u().hasta} ${y.personas}`, v: y.precio, on: y.id === state.barco }))
    : t.precios.map(p => ({ k: p.etiqueta[lang], v: p.monto, on: true }));
  items.forEach(it => {
    const d = document.createElement('div'); d.className = 'price';
    d.innerHTML = '<span class="price__k"></span><span class="price__v"></span>';
    d.firstChild.textContent = it.k;
    d.lastChild.textContent = money(it.v).replace(' MXN', '');
    const sm = document.createElement('small'); sm.textContent = 'MXN'; d.lastChild.appendChild(sm);
    if (!it.on) d.style.opacity = '.5';
    box.appendChild(d);
  });
}
function renderIncluye(t) {
  const inc = $('.js-incluye', detail); inc.textContent = '';
  const incl = t.id === 'yates' ? [...yateById(state.barco).a_bordo[lang], ...t.incluye[lang]] : t.incluye[lang];
  incl.forEach(x => li(inc, x));
}
function fmtFecha(v) {
  if (!v) return u().porconfirmar;
  const [y, m, d] = v.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(lang === 'en' ? 'en-US' : 'es-MX', { timeZone: 'UTC', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}
function tourLabel(t, modo, barco) {
  if (t.id === 'cerralvo') return `${t.nombre[lang]} (${modo === 'privado' ? u().privado : u().compartido})`;
  if (t.id === 'yates') return `${yName(yateById(barco))}, 8 h`;
  return t.nombre[lang];
}
function updateTotal() {
  const t = TOURS[state.tour]; if (!t) return;
  const tot = totalFor(t.id, state.personas, state);
  $('.js-total', detail).textContent = money(tot);
  const gente = t.id === 'es-balandra' ? u().gente_ad(state.adultos, state.menores) : u().gente(state.personas);
  $('.js-book', detail).href = waLink(u().msg({ tour: tourLabel(t, state.modo, state.barco), fecha: fmtFecha(state.fecha), gente, total: money(tot) }));
}
function renderDetail(animate) {
  const ov = $('.js-overview', detail), tw = $('.js-tour', detail);
  if (state.tour === 'todos') { ov.hidden = false; tw.hidden = true; renderDests(); }
  else {
    ov.hidden = true; tw.hidden = false;
    const t = TOURS[state.tour];
    $('.js-tipo', detail).textContent = tipoLabel(t);
    $('.js-name', detail).textContent = t.nombre[lang];
    $('.js-line', detail).textContent = t.linea[lang];
    $('.js-dur', detail).textContent = `${t.duracion} h`;
    $('.js-hor', detail).textContent = t.horario ? `${t.horario} ${u().aprox}` : u().variable;
    $('.js-sal', detail).textContent = N.salidas[t.salida].nombre[lang];
    const stops = $('.js-stops', detail); stops.textContent = '';
    t.ruta.forEach((k, i) => { if (i > 0 && i < t.ruta.length - 1 && t.ruta.indexOf(k) !== i) return; const el = li(stops, stopName(k, i, t.ruta)); if (i === t.ruta.length - 1 && k === t.ruta[0]) el.className = 'back'; });
    const acts = t.actividades ? t.actividades[lang] : [];
    const haces = $('.js-haces', detail); haces.textContent = '';
    $('.js-haces-wrap', detail).hidden = !acts.length;
    acts.forEach(x => li(haces, x));
    renderIncluye(t);
    const noW = $('.js-noincluye-wrap', detail), no = $('.js-noincluye', detail); no.textContent = '';
    if (t.noincluye) { noW.hidden = false; t.noincluye[lang].forEach(x => li(no, x)); } else noW.hidden = true;
    const nota = $('.js-nota', detail); nota.hidden = !t.nota; nota.textContent = t.nota ? t.nota[lang] : '';
    const mobile = matchMedia('(max-width: 720px)').matches;
    $$('.dsec', detail).forEach(d => { d.open = !mobile; });
    renderPrices(t); renderControls(t); updateTotal();
    $('.js-fecha', detail).value = state.fecha;
  }
  if (animate && !RM.matches) { detail.classList.remove('is-swap'); void detail.offsetWidth; detail.classList.add('is-swap'); }
}
function renderChips() {
  $$('.chip').forEach(c => {
    const t = TOURS[c.dataset.tour]; if (!t) return;
    $('.chip__name', c).textContent = t.id === 'yates' ? u().yateChip : t.nombre[lang];
    $('.chip__meta', c).textContent = `${t.id === 'yates' ? u().yates_c : tipoLabel(t)} · ${t.duracion} h · ${money(fromPrice(t)).replace(' MXN', '')}`;
  });
}
let chartSeen = false;
function selectTour(id, opts = {}) {
  state.tour = id;
  $$('.chip').forEach(c => c.setAttribute('aria-selected', String(c.dataset.tour === id)));
  renderDetail(!opts.silent);
  if (!chartSeen && !opts.instant) return;
  if (id === 'todos') drawOverview(!opts.instant); else drawRoute(TOURS[id], opts.instant);
  const chip = $(`.chip[data-tour="${id}"]`);
  if (chip && chip.parentElement.scrollWidth > chip.parentElement.clientWidth) chip.parentElement.scrollTo({ left: chip.offsetLeft - 16, behavior: RM.matches ? 'auto' : 'smooth' });
}
function pushNav(id) {
  try {
    history.replaceState({ mt: 1, tour: state.tour, y: scrollY }, '');
    history.pushState({ mt: 1, tour: id, y: null }, '');
  } catch (e) {}
}
function goToTour(id) {
  pushNav(id);
  chartSeen = true;
  selectTour(id);
  $('#carta').scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth' });
}
addEventListener('popstate', e => {
  const st = e.state;
  if (!st || !st.mt) return;
  chartSeen = true;
  selectTour(st.tour, { silent: true });
  if (st.y !== null && st.y !== undefined) scrollTo({ top: st.y, behavior: 'auto' });
});
try { history.replaceState({ mt: 1, tour: 'todos', y: 0 }, ''); } catch (e) {}
$('.js-back').addEventListener('click', () => {
  if (history.state && history.state.mt && history.state.y === null) { history.back(); return; }
  selectTour('todos');
  $('#carta').scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth' });
});
$$('.chip').forEach(c => c.addEventListener('click', () => {
  if (c.dataset.tour !== state.tour) pushNav(c.dataset.tour);
  selectTour(c.dataset.tour);
  if (matchMedia('(max-width: 820px)').matches) $('.chart').scrollIntoView({ behavior: RM.matches ? 'auto' : 'smooth', block: 'center' });
}));
$('.picker').addEventListener('keydown', e => {
  if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
  const chips = $$('.chip'); const i = chips.indexOf(document.activeElement); if (i < 0) return;
  e.preventDefault();
  const n = chips[(i + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : chips.length - 1)) % chips.length];
  n.focus(); selectTour(n.dataset.tour);
});
$$('[data-goto-tour]').forEach(b => b.addEventListener('click', () => goToTour(b.dataset.gotoTour)));
const today = (() => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: N.zona_horaria, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date()).map(x => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}`;
})();
$('.js-fecha').min = today;
$('.js-fecha').addEventListener('change', e => { state.fecha = e.target.value; updateTotal(); });

/* ---------- tarjetas de tours ---------- */
const ICO = {
  time: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  pin: '<svg viewBox="0 0 24 24"><path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  ppl: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.5"/><path d="M3 20c.5-4 3-6 6-6s5.5 2 6 6M16 4.5a3.5 3.5 0 0 1 0 7M18 14c2 .6 3 2.6 3.3 6"/></svg>'
};
function renderCards() {
  const ul = $('.js-cards'); ul.textContent = '';
  ORDER.forEach(id => {
    const t = TOURS[id];
    const liEl = document.createElement('li'); liEl.className = 'card';
    const priv = t.tipo !== 'compartido';
    const cap = t.id === 'yates' ? '8 · 12 · 15' : t.capacidad ? `${u().hasta} ${t.capacidad}` : '';
    const sal = t.id === 'cerralvo' ? 'La Ventana' : N.salidas[t.salida].nombre[lang];
    liEl.innerHTML = `
      <div class="card__img"><div class="gal">${GAL[id].map((g, n) => `<img src="assets/img/${g}.webp" alt="" loading="lazy" decoding="async" width="1200" height="900">`).join('')}</div>${GAL[id].length > 1 ? `<button type="button" class="gal__nav gal__nav--prev" tabindex="-1" aria-hidden="true">‹</button><button type="button" class="gal__nav gal__nav--next" tabindex="-1" aria-hidden="true">›</button><div class="gal__dots" aria-hidden="true">${GAL[id].map((_, n) => `<i class="${n ? '' : 'on'}"></i>`).join('')}</div>` : ''}<span class="card__tag${priv ? ' card__tag--priv' : ''}"></span></div>
      <div class="card__body">
        <h3 class="card__name"></h3>
        <p class="card__meta"><span>${ICO.time}<b class="m1"></b></span><span>${ICO.pin}<b class="m2"></b></span>${cap ? `<span>${ICO.ppl}<b class="m3"></b></span>` : ''}</p>
        <p class="card__price"><small></small><strong></strong><em></em></p>
        <div class="card__btns"><button type="button" class="btn btn--line js-route"></button><a class="btn btn--accent" target="_blank" rel="noopener"></a></div>
      </div>`;
    $('.card__tag', liEl).textContent = t.id === 'yates' ? u().yates_c : tipoLabel(t);
    $('.card__name', liEl).textContent = t.id === 'yates' ? u().yateChip : t.nombre[lang];
    $('.m1', liEl).textContent = `${t.duracion} h`;
    $('.m2', liEl).textContent = sal;
    if (cap) $('.m3', liEl).textContent = cap;
    $('.card__price small', liEl).textContent = u().desde;
    $('.card__price strong', liEl).textContent = money(fromPrice(t));
    $('.card__price em', liEl).textContent = perPerson(t) ? u().por_persona : u().por_barco;
    $$('.gal img', liEl).forEach((im, n) => { im.alt = `${t.nombre[lang]} · ${n + 1}/${GAL[id].length}`; });
    const gal = $('.gal', liEl), dots = $$('.gal__dots i', liEl);
    if (dots.length) {
      const cur = () => Math.round(gal.scrollLeft / gal.clientWidth);
      gal.addEventListener('scroll', () => { const k = cur(); dots.forEach((d, n) => d.classList.toggle('on', n === k)); }, { passive: true });
      const go = (d) => { const k = (cur() + d + dots.length) % dots.length; gal.scrollTo({ left: k * gal.clientWidth, behavior: RM.matches ? 'auto' : 'smooth' }); };
      $('.gal__nav--prev', liEl).addEventListener('click', e => { e.stopPropagation(); go(-1); });
      $('.gal__nav--next', liEl).addEventListener('click', e => { e.stopPropagation(); go(1); });
    }
    const rb = $('.js-route', liEl); rb.textContent = u().verruta; rb.addEventListener('click', () => goToTour(id));
    const a = $('a', liEl); a.textContent = u().reservar; a.href = waLink(`Tour: ${t.id === 'yates' ? u().yateChip : t.nombre[lang]}.`);
    ul.appendChild(liEl);
  });
}
const cardsEl = $('.js-cards');
const stepCards = (dir) => cardsEl.scrollBy({ left: dir * (cardsEl.querySelector('.card')?.offsetWidth + 18 || 320), behavior: RM.matches ? 'auto' : 'smooth' });
$('.js-prev').addEventListener('click', () => stepCards(-1));
$('.js-next').addEventListener('click', () => stepCards(1));

/* ---------- planeador del hero ---------- */
const PLAN = () => [
  ...ORDER.filter(id => id !== 'yates').map(id => ({ v: id, t: TOURS[id].nombre[lang] + (id === 'cerralvo' ? ` (${u().compartido})` : '') })),
  ...N.yates.map(y => ({ v: 'yate:' + y.id, t: `${yName(y)} · ${u().hasta} ${y.personas}` }))
];
const planSel = $('.js-plan-tour'), planP = $('.js-plan-personas'), planF = $('.js-plan-fecha');
planF.min = today;
function renderPlanOptions() {
  const cur = planSel.value || 'es-balandra';
  planSel.textContent = '';
  PLAN().forEach(o => { const op = document.createElement('option'); op.value = o.v; op.textContent = o.t; planSel.appendChild(op); });
  planSel.value = cur;
  updatePlan();
}
function planInfo() {
  const v = planSel.value || 'es-balandra';
  const p = +planP.value;
  if (v.startsWith('yate:')) { const b = v.slice(5); return { id: 'yates', barco: b, p, tot: yateById(b).precio, label: `${yName(yateById(b))}, 8 h` }; }
  const t = TOURS[v];
  return { id: v, p, tot: totalFor(v, p, { modo: 'compartido' }), label: tourLabel(t, 'compartido') };
}
function updatePlan() {
  const i = planInfo();
  $('.js-plan-precio').textContent = money(i.tot);
  $('.js-plan-por').textContent = u().total_est;
  $('.js-plan-go').href = waLink(u().msg({ tour: i.label, fecha: fmtFecha(planF.value), gente: u().gente(i.p), total: money(i.tot) }));
}
[planSel, planP, planF].forEach(el => el.addEventListener('change', updatePlan));
$('.js-plan-map').addEventListener('click', () => {
  const i = planInfo();
  state.fecha = planF.value; state.personas = i.p; state.adultos = i.p; state.menores = 0;
  if (i.barco) state.barco = i.barco;
  goToTour(i.id);
});

/* ---------- preguntas: una abierta a la vez ---------- */
$$('.faq details').forEach(d => d.addEventListener('toggle', () => {
  if (!d.open) return;
  $$('.faq details').forEach(o => { if (o !== d) o.open = false; });
  const top = d.getBoundingClientRect().top;
  if (top < 80) scrollBy({ top: top - 90, behavior: RM.matches ? 'auto' : 'smooth' });
}));

/* ---------- salida, mapa, horario ---------- */
let punto = 'muelle';
const iframe = $('.mapa');
function paintPunto() {
  $$('.punto').forEach(b => b.setAttribute('aria-selected', String(b.dataset.punto === punto)));
  const q = N.salidas[punto].query;
  $('.js-dir').href = dirLink(q);
  if (iframe.dataset.loaded) iframe.src = iframe.dataset.src.replace('QUERY', encodeURIComponent(q));
}
$$('.punto').forEach(b => b.addEventListener('click', () => { punto = b.dataset.punto; paintPunto(); }));
new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { iframe.dataset.loaded = '1'; paintPunto(); o.disconnect(); } }, { rootMargin: '400px' }).observe(iframe);
function ahoraEn(tz) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short', hourCycle: 'h23' }).formatToParts(new Date()).map(x => [x.type, x.value]));
  const dow = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
  return { fecha: `${p.year}-${p.month}-${p.day}`, dow, min: (+p.hour) * 60 + (+p.minute) };
}
const aMin = h => { const [a, b] = h.split(':').map(Number); return a * 60 + b; };
function estadoAhora() {
  const { fecha, dow, min } = ahoraEn(N.zona_horaria);
  const hoy = (N.cierres_especiales && fecha in N.cierres_especiales) ? N.cierres_especiales[fecha] : (N.horario[dow] || []);
  for (const [ab, ci] of hoy) { const a = aMin(ab), c = aMin(ci); if (c > a ? (min >= a && min < c) : (min >= a)) return { abierto: true }; }
  const sig = hoy.find(([ab]) => aMin(ab) > min) || (N.horario[(dow + 1) % 7] || [])[0];
  return { abierto: false, abre: sig ? sig[0] : null };
}
function fmtHora(h) {
  if (lang !== 'en') return h;
  const [a, b] = h.split(':').map(Number);
  return `${((a + 11) % 12) + 1}${b ? ':' + String(b).padStart(2, '0') : ''} ${a < 12 ? 'a.m.' : 'p.m.'}`;
}
function paintHours() {
  const e = estadoAhora();
  $('.hours').classList.toggle('is-closed', !e.abierto);
  $('.js-estado').textContent = e.abierto ? u().abierto : u().cerrado + fmtHora(e.abre || '08:00');
  $('.js-horario').textContent = u().horario;
}
setInterval(paintHours, 60000);

/* ---------- hero: acercamiento con el scroll ---------- */
const heroImg = $('.hero__img'), hero = $('.hero');
const DESK = matchMedia('(min-width: 721px)');
let heroRaf = null, heroOn = true;
addEventListener('scroll', () => {
  if (heroRaf || RM.matches || !DESK.matches || !heroOn) return;
  heroRaf = requestAnimationFrame(() => {
    heroRaf = null;
    heroImg.style.setProperty('--hp', Math.min(1, Math.max(0, scrollY / (hero.offsetHeight || 1))).toFixed(3));
  });
}, { passive: true });
const bar = $('.actionbar');
new IntersectionObserver(([e]) => { heroOn = e.isIntersecting; bar.classList.toggle('show', !e.isIntersecting); }, { threshold: 0.05 }).observe(hero);

const rev = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
$$('.reveal').forEach((el, i) => { el.style.transitionDelay = `${(i % 4) * 90}ms`; rev.observe(el); el.addEventListener('transitionend', () => { el.style.transitionDelay = '0s'; }, { once: true }); });

new IntersectionObserver((es, o) => {
  if (es[0].isIntersecting) {
    o.disconnect();
    if (chartSeen) return;
    chartSeen = true;
    if (state.tour === 'todos') drawOverview(true); else drawRoute(TOURS[state.tour]);
  }
}, { threshold: 0.3 }).observe($('.chart'));
addEventListener('resize', () => sizeText());
document.addEventListener('visibilitychange', () => document.body.classList.toggle('paused', document.hidden));
RM.addEventListener('change', () => { if (chartSeen) selectTour(state.tour, { instant: true, silent: true }); heroImg.style.removeProperty('--hp'); });

document.addEventListener('langchange', () => {
  paintLinks(); renderChips(); renderCards(); renderPlanOptions(); renderDetail(false); drawPlaces(); paintHours();
  if (chartSeen) selectTour(state.tour, { instant: true, silent: true });
});
drawBase();
let start = 'es';
try {
  const q = new URLSearchParams(location.search).get('lang');
  const saved = localStorage.getItem('lang');
  start = q === 'en' || q === 'es' ? q : saved || ((navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'es');
} catch (e) {}
T.apply(start);
const firma = $('.js-firma'); if (firma && N.firma) firma.textContent = N.firma;
})();

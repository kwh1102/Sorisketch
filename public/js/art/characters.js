// 인물 그림 — 머리·얼굴(표정)·옷(전통/현대/미래)을 조합해 SVG로 그린다.
// viewBox 0 0 200 320, 발 끝이 y≈314. 휴대폰에서도 표정이 보이도록 머리를 크게 잡은 민화풍 인물.

import { CHARACTERS } from '../data/works.js';

const INK = '#2a2522';
const LINE = `stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;
const THIN = `stroke="${INK}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"`;

// ---------- 얼굴 ----------
function face(cx, cy, expr, { blind = false, scale = 1, cheek = '#e88f7a' } = {}) {
  const ex = 16 * scale;
  const ey = cy + 4 * scale;
  const L = cx - ex;
  const R = cx + ex;
  let eyes = '';
  let brows = '';
  let mouth = '';
  let extra = '';
  const dot = (x, ry = 4.6) => `<ellipse cx="${x}" cy="${ey}" rx="${3.6 * scale}" ry="${ry * scale}" fill="${INK}"/>`;
  const closed = (x) => `<path d="M${x - 6 * scale} ${ey} q${6 * scale} ${3 * scale} ${12 * scale} 0" fill="none" ${THIN}/>`;
  const smileEye = (x) => `<path d="M${x - 6 * scale} ${ey + 2} q${6 * scale} ${-8 * scale} ${12 * scale} 0" fill="none" ${LINE}/>`;
  const brow = (x, tilt, lift = 0) =>
    `<path d="M${x - 7 * scale} ${ey - 12 * scale - lift + tilt} L${x + 7 * scale} ${ey - 12 * scale - lift - tilt}" fill="none" ${LINE}/>`;
  const my = cy + 22 * scale;

  switch (expr) {
    case 'happy':
      eyes = blind ? closed(L) + closed(R) : smileEye(L) + smileEye(R);
      brows = brow(L, 0, 3) + brow(R, 0, 3);
      mouth = `<path d="M${cx - 10 * scale} ${my - 3} Q${cx} ${my + 12 * scale} ${cx + 10 * scale} ${my - 3} Z" fill="#9b3b32" ${THIN}/>`;
      extra = `<ellipse cx="${L - 6}" cy="${ey + 12}" rx="7" ry="4" fill="${cheek}" opacity=".55"/><ellipse cx="${R + 6}" cy="${ey + 12}" rx="7" ry="4" fill="${cheek}" opacity=".55"/>`;
      break;
    case 'sad':
      eyes = blind ? closed(L) + closed(R) : dot(L, 4) + dot(R, 4);
      brows = brow(L, -3) + brow(R, 3);
      mouth = `<path d="M${cx - 8 * scale} ${my + 4} Q${cx} ${my - 5 * scale} ${cx + 8 * scale} ${my + 4}" fill="none" ${LINE}/>`;
      extra = `<path d="M${R + 3} ${ey + 6} q-3 7 0 10 q3 -3 0 -10" fill="#7fb2d6" opacity=".9"/>`;
      break;
    case 'angry':
      eyes = blind ? closed(L) + closed(R) : dot(L, 3.6) + dot(R, 3.6);
      brows = brow(L, 4) + brow(R, -4);
      mouth = `<path d="M${cx - 9 * scale} ${my + 3} L${cx - 3} ${my - 1} L${cx + 3} ${my + 2} L${cx + 9 * scale} ${my - 1}" fill="none" ${LINE}/>`;
      extra = `<path d="M${R + 10} ${cy - 30} l6 -3 m-6 3 l3 6 m-3 -6 l-4 -4" ${THIN} fill="none" stroke="#b03a2e"/>`;
      break;
    case 'surprised':
      eyes = blind
        ? closed(L) + closed(R)
        : `<circle cx="${L}" cy="${ey}" r="${6 * scale}" fill="#fff" ${THIN}/><circle cx="${L}" cy="${ey}" r="${2.8 * scale}" fill="${INK}"/><circle cx="${R}" cy="${ey}" r="${6 * scale}" fill="#fff" ${THIN}/><circle cx="${R}" cy="${ey}" r="${2.8 * scale}" fill="${INK}"/>`;
      brows = brow(L, 0, 7) + brow(R, 0, 7);
      mouth = `<ellipse cx="${cx}" cy="${my + 2}" rx="${5.5 * scale}" ry="${7 * scale}" fill="#9b3b32" ${THIN}/>`;
      break;
    case 'sly':
      eyes = blind
        ? closed(L) + closed(R)
        : `<path d="M${L - 6} ${ey} h12" ${LINE}/><path d="M${R - 6} ${ey} h12" ${LINE}/><circle cx="${L + 2}" cy="${ey + 2}" r="2.4" fill="${INK}"/><circle cx="${R + 2}" cy="${ey + 2}" r="2.4" fill="${INK}"/>`;
      brows = brow(L, 2, 0) + brow(R, -2, 5);
      mouth = `<path d="M${cx - 9 * scale} ${my} Q${cx + 2} ${my + 7 * scale} ${cx + 11 * scale} ${my - 5}" fill="none" ${LINE}/>`;
      break;
    case 'worried':
      eyes = blind ? closed(L) + closed(R) : dot(L, 3.6) + dot(R, 3.6);
      brows = `<path d="M${L - 7} ${ey - 13} q4 -5 13 0" fill="none" ${LINE}/><path d="M${R - 6} ${ey - 13} q9 -5 13 0" fill="none" ${LINE}/>`;
      mouth = `<path d="M${cx - 9 * scale} ${my + 1} q4.5 -4 9 0 t9 0" fill="none" ${LINE}/>`;
      extra = `<path d="M${L - 20} ${cy - 18} q-4 8 0 11 q4 -3 0 -11" fill="#9cc6e3"/>`;
      break;
    case 'determined':
      eyes = blind ? closed(L) + closed(R) : dot(L, 4.2) + dot(R, 4.2);
      brows = brow(L, 3, 1) + brow(R, -3, 1);
      mouth = `<path d="M${cx - 9 * scale} ${my + 1} h${18 * scale}" ${LINE}/>`;
      break;
    default:
      eyes = blind ? closed(L) + closed(R) : dot(L) + dot(R);
      brows = brow(L, 0) + brow(R, 0);
      mouth = `<path d="M${cx - 7 * scale} ${my} q${7 * scale} ${6 * scale} ${14 * scale} 0" fill="none" ${LINE}/>`;
  }
  const cheeks = expr === 'happy' ? '' : `<ellipse cx="${L - 5}" cy="${ey + 13}" rx="6" ry="3.5" fill="${cheek}" opacity=".35"/><ellipse cx="${R + 5}" cy="${ey + 13}" rx="6" ry="3.5" fill="${cheek}" opacity=".35"/>`;
  return `<g class="face">${cheeks}${brows}${eyes}${mouth}${extra}</g>`;
}

// ---------- 머리 모양 ----------
function hairBack(a, costume) {
  const c = a.elder ? '#b9b4ab' : '#26211f';
  const style = costume === 'traditional' ? a.hair : modernHair(a.hair, a.sex);
  if (style === 'braid')
    return `<path d="M128 100 q20 60 6 120" fill="none" stroke="${c}" stroke-width="12" stroke-linecap="round"/><path d="M126 218 l14 14 l-4 -18 z" fill="#c8463d"/>`;
  if (style === 'ponytail') return `<path d="M132 70 q30 30 14 90" fill="none" stroke="${c}" stroke-width="14" stroke-linecap="round"/>`;
  if (style === 'chignon') return `<circle cx="100" cy="132" r="15" fill="${c}"/><path d="M76 132 h48" ${THIN}/>`;
  if (style === 'long') return `<path d="M58 90 q-6 70 10 100 h64 q16 -30 10 -100 z" fill="${c}"/>`;
  return '';
}
function modernHair(h, sex) {
  if (h === 'braid') return 'ponytail';
  if (h === 'topknot') return sex === 'f' ? 'bob' : 'short';
  return h;
}
function hairFront(a, costume) {
  const c = a.elder ? '#b9b4ab' : '#26211f';
  const style = costume === 'traditional' ? a.hair : modernHair(a.hair, a.sex);
  switch (style) {
    case 'topknot':
      return `<path d="M56 86 q2 -42 44 -44 q42 2 44 44 q-10 -22 -44 -24 q-34 2 -44 24z" fill="${c}"/><ellipse cx="100" cy="40" rx="10" ry="12" fill="${c}"/>`;
    case 'braid':
    case 'chignon':
      return `<path d="M54 98 q-2 -54 46 -56 q48 2 46 56 q-8 -30 -46 -34 q-38 4 -46 34z" fill="${c}"/><path d="M100 44 v22" stroke="#efe4cc" stroke-width="1.5" opacity=".4"/>`;
    case 'ponytail':
      return `<path d="M54 92 q0 -50 46 -50 q46 0 46 50 q-14 -26 -46 -26 q-32 0 -46 26z" fill="${c}"/>`;
    case 'bob':
      return `<path d="M52 112 q-6 -70 48 -70 q54 0 48 70 q-6 -8 -8 -34 q-18 -16 -40 -12 q-22 -4 -40 12 q-2 26 -8 34z" fill="${c}"/>`;
    case 'short':
      return `<path d="M55 90 q-2 -48 45 -48 q47 0 45 48 q-6 -18 -18 -22 q-8 8 -27 6 q-20 2 -30 -6 q-12 4 -15 22z" fill="${c}"/>`;
    case 'long':
      return `<path d="M54 100 q-4 -58 46 -58 q50 0 46 58 q-10 -28 -46 -30 q-36 2 -46 30z" fill="${c}"/>`;
    default:
      return '';
  }
}

// ---------- 모자 ----------
function hat(kind, robe2) {
  switch (kind) {
    case 'gat':
      return `<g opacity=".92"><ellipse cx="100" cy="56" rx="78" ry="10" fill="${INK}" fill-opacity=".78"/><path d="M78 56 v-34 q22 -8 44 0 v34z" fill="${INK}" fill-opacity=".85"/><path d="M60 60 q-4 50 14 70 M140 60 q4 50 -14 70" fill="none" stroke="${INK}" stroke-width="1.6" stroke-dasharray="2 3"/></g>`;
    case 'samo':
      return `<path d="M64 62 q2 -30 36 -32 q34 2 36 32z" fill="${INK}"/><ellipse cx="50" cy="52" rx="20" ry="7" fill="${INK}" transform="rotate(-8 50 52)"/><ellipse cx="150" cy="52" rx="20" ry="7" fill="${INK}" transform="rotate(8 150 52)"/><path d="M84 36 q16 -14 32 0" fill="${INK}"/>`;
    case 'bokgeon':
      return `<path d="M58 70 q0 -42 42 -44 q42 2 42 44 q-20 -12 -42 -12 q-22 0 -42 12z" fill="${INK}"/><path d="M138 64 q20 10 16 40" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>`;
    case 'helmet':
      return `<path d="M54 74 q2 -50 46 -52 q44 2 46 52 l-8 2 q-4 -36 -38 -38 q-34 2 -38 38z" fill="#6d6a63" ${THIN}/><path d="M100 22 q-6 -18 4 -24 q6 12 -4 24" fill="${robe2 || '#b03a2e'}"/><path d="M56 74 h88" ${LINE}/>`;
    case 'headband':
      return `<path d="M56 76 q44 -12 88 0" fill="none" stroke="#efe4cc" stroke-width="8"/><path d="M142 74 l14 8 l-12 4" fill="#efe4cc"/>`;
    case 'yunggeon':
      return `<path d="M70 62 v-36 q30 -10 60 0 v36z" fill="${INK}"/><path d="M70 40 h60" stroke="#555" stroke-width="2"/>`;
    case 'crown':
      return `<path d="M66 50 h68 l-6 -18 l-10 10 l-18 -18 l-18 18 l-10 -10z" fill="#e2b23c" ${THIN}/><rect x="60" y="48" width="80" height="8" fill="${INK}"/><path d="M64 56 v14 M78 56 v18 M122 56 v18 M136 56 v14" stroke="#c8463d" stroke-width="2" stroke-dasharray="3 3"/>`;
    default:
      return '';
  }
}

function beard(kind, elder) {
  const c = elder ? '#d8d3c8' : INK;
  switch (kind) {
    case 'mustache':
      return `<path d="M84 118 q8 -6 16 -1 q8 -5 16 1 q-8 4 -16 0 q-8 4 -16 0z" fill="${c}"/>`;
    case 'goatee':
      return `<path d="M86 118 q14 -6 28 0 M94 132 q6 18 12 0" fill="${c}" stroke="${c}" stroke-width="3"/>`;
    case 'long':
      return `<path d="M80 118 q20 -8 40 0 q-2 30 -20 58 q-18 -28 -20 -58z" fill="${c}"/>`;
    case 'thin':
      return `<path d="M88 118 q12 -5 24 0 M100 128 q-2 24 0 30" fill="none" stroke="${c}" stroke-width="2.4"/>`;
    case 'stubble':
      return `<path d="M76 116 q24 24 48 0" fill="none" stroke="${INK}" stroke-width="5" stroke-dasharray="1.5 3" opacity=".5"/>`;
    default:
      return '';
  }
}

// ---------- 몸(옷) ----------
function body(a, costume, skin) {
  const robe = a.robe || '#8a7a5c';
  const robe2 = a.robe2 || '#efe4cc';
  const hand = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="${skin}" ${THIN}/>`;
  if (costume === 'modern') {
    const top = a.sex === 'f' ? robe : robe;
    const lower = a.sex === 'f'
      ? `<path d="M66 232 h68 l10 50 h-88z" fill="${shade(robe2, -0.35)}" ${LINE}/><path d="M76 282 v26 M124 282 v26" ${LINE}/>`
      : `<path d="M68 230 h64 l2 80 h-26 l-6 -52 l-6 52 h-26z" fill="#3a3d48" ${LINE}/>`;
    return `${lower}<path d="M82 304 h-18 q-4 8 4 10 h16z M118 304 h18 q4 8 -4 10 h-16z" fill="${INK}"/>
      <path d="M62 150 q38 -14 76 0 l6 84 h-88z" fill="${top}" ${LINE}/>
      <path d="M86 140 q14 16 28 0" fill="none" stroke="${robe2}" stroke-width="5"/>
      <path d="M96 160 v40 M104 160 v40" stroke="${robe2}" stroke-width="2" opacity=".8"/>
      <path d="M62 152 q-22 30 -16 74" fill="none" stroke="${top}" stroke-width="20" stroke-linecap="round"/><path d="M62 152 q-22 30 -16 74" fill="none" ${THIN} opacity=".6"/>
      <path d="M138 152 q22 30 16 74" fill="none" stroke="${top}" stroke-width="20" stroke-linecap="round"/><path d="M138 152 q22 30 16 74" fill="none" ${THIN} opacity=".6"/>
      ${hand(46, 232)}${hand(154, 232)}`;
  }
  if (costume === 'future') {
    return `<path d="M70 230 h60 l4 80 h-26 l-8 -50 l-8 50 h-26z" fill="#2b3040" ${LINE}/>
      <path d="M60 150 q40 -16 80 0 l8 86 h-96z" fill="${shade(robe, -0.2)}" ${LINE}/>
      <path d="M78 134 l22 20 l22 -20 v14 l-22 18 l-22 -18z" fill="#dfe7ee" ${THIN}/>
      <path d="M66 200 h68" stroke="#5ee0d6" stroke-width="4" opacity=".9"/><path d="M100 168 v62" stroke="#5ee0d6" stroke-width="2.5" opacity=".8"/>
      <path d="M60 154 q-20 34 -14 74" fill="none" stroke="${shade(robe, -0.2)}" stroke-width="20" stroke-linecap="round"/>
      <path d="M140 154 q20 34 14 74" fill="none" stroke="${shade(robe, -0.2)}" stroke-width="20" stroke-linecap="round"/>
      <path d="M82 304 h-18 q-4 8 4 10 h16z M118 304 h18 q4 8 -4 10 h-16z" fill="#5ee0d6"/>
      ${hand(46, 232)}${hand(154, 232)}`;
  }
  // 전통 한복
  const belly = a.belly ? 16 : 0;
  const patches = a.patched
    ? `<rect x="70" y="250" width="16" height="14" fill="${shade(robe, -0.15)}" stroke="${INK}" stroke-width="1.5" stroke-dasharray="3 2" transform="rotate(-8 78 257)"/><rect x="116" y="196" width="14" height="12" fill="${shade(robe, 0.12)}" stroke="${INK}" stroke-width="1.5" stroke-dasharray="3 2"/>`
    : '';
  if (a.sex === 'f') {
    return `<path d="M68 176 q-30 70 -32 136 h128 q-2 -66 -32 -136z" fill="${robe}" ${LINE}/>
      <path d="M58 248 q40 10 84 0" fill="none" stroke="${shade(robe, -0.15)}" stroke-width="3" opacity=".7"/>
      <path d="M66 148 q34 -12 68 0 l6 32 h-80z" fill="${robe2}" ${LINE}/>
      <path d="M86 140 l14 22 l14 -22" fill="none" stroke="#fffaf0" stroke-width="6"/>
      <path d="M100 166 q-4 18 -12 30 M100 166 q4 16 10 24" fill="none" stroke="${robe}" stroke-width="4" stroke-linecap="round"/>
      <path d="M66 152 q-20 26 -18 62" fill="none" stroke="${robe2}" stroke-width="20" stroke-linecap="round"/>
      <path d="M134 152 q20 26 18 62" fill="none" stroke="${robe2}" stroke-width="20" stroke-linecap="round"/>
      <path d="M40 210 h16 M144 210 h16" stroke="${robe}" stroke-width="6"/>
      ${patches}${hand(48, 222)}${hand(152, 222)}`;
  }
  return `<path d="M64 150 q-${18 + belly} 80 -22 160 h116 q${belly - 4} -80 -22 -160z" fill="${robe}" ${LINE}/>
    <path d="M100 150 l-14 160" fill="none" stroke="${shade(robe, -0.2)}" stroke-width="2.5"/>
    <path d="M84 140 l16 26 l16 -26" fill="none" stroke="#fffaf0" stroke-width="7"/>
    <path d="M66 214 q34 10 68 0" fill="none" stroke="${robe2}" stroke-width="6"/>
    <path d="M96 216 q-6 26 -14 40 M100 218 q4 22 2 38" fill="none" stroke="${robe2}" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M66 156 q-26 30 -24 70" fill="none" stroke="${robe}" stroke-width="24" stroke-linecap="round"/><path d="M66 156 q-26 30 -24 70" fill="none" ${THIN} opacity=".45"/>
    <path d="M134 156 q26 30 24 70" fill="none" stroke="${robe}" stroke-width="24" stroke-linecap="round"/><path d="M134 156 q26 30 24 70" fill="none" ${THIN} opacity=".45"/>
    <path d="M78 306 h-14 q-6 8 4 10 h14z M122 306 h14 q6 8 -4 10 h-14z" fill="#efe4cc" ${THIN}/>
    ${patches}${hand(42, 234)}${hand(158, 234)}`;
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(v + (amt > 0 ? (255 - v) * amt : v * amt))));
  const r = f(n >> 16);
  const g = f((n >> 8) & 255);
  const b = f(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

// ---------- 인물 종류별 ----------
function human(a, expr, costume) {
  const skin = a.skin || '#f3d6bb';
  const h = costume === 'traditional' ? hat(a.hat, a.robe2) : '';
  const wrinkles = a.elder ? `<path d="M74 70 q8 -4 14 0 M112 70 q8 -4 14 0" fill="none" stroke="${INK}" stroke-width="1.4" opacity=".5"/>` : '';
  const fanProp = a.fan && costume === 'traditional'
    ? `<path d="M158 230 l-6 -60 q20 -14 40 4z" fill="#f4f1ea" ${THIN}/><path d="M158 230 l8 -58 M158 230 l20 -52" stroke="${INK}" stroke-width="1.2"/>`
    : '';
  return `${hairBack(a, costume)}${body(a, costume, skin)}
    <rect x="90" y="124" width="20" height="22" fill="${skin}"/>
    <ellipse cx="100" cy="90" rx="46" ry="48" fill="${skin}" ${LINE}/>
    <path d="M54 92 q-8 0 -6 10 q2 8 8 6 M146 92 q8 0 6 10 q-2 8 -8 6" fill="${skin}" ${THIN}/>
    ${hairFront(a, costume)}${wrinkles}${face(100, 90, expr, { blind: a.blind })}${beard(a.beard, a.elder)}${h}${fanProp}`;
}

function rabbit(a, expr, costume) {
  const fur = '#f6f2e9';
  const look = { ...a, sex: 'm' };
  return `<g><ellipse cx="78" cy="22" rx="13" ry="40" fill="${fur}" ${LINE} transform="rotate(-12 78 40)"/><ellipse cx="78" cy="26" rx="6" ry="28" fill="#f1b7b0" transform="rotate(-12 78 40)"/>
    <ellipse cx="124" cy="22" rx="13" ry="40" fill="${fur}" ${LINE} transform="rotate(14 124 40)"/><ellipse cx="124" cy="26" rx="6" ry="28" fill="#f1b7b0" transform="rotate(14 124 40)"/></g>
    ${costume === 'traditional'
      ? `<path d="M64 150 q-14 80 -18 160 h108 q-4 -80 -18 -160z" fill="${fur}" ${LINE}/><path d="M64 150 h72 l6 70 h-84z" fill="${a.robe}" ${LINE}/><path d="M100 150 v70" stroke="${a.robe2}" stroke-width="4"/><circle cx="100" cy="262" r="20" fill="#fff" opacity=".7"/>
         <path d="M64 156 q-22 30 -20 66" fill="none" stroke="${fur}" stroke-width="20" stroke-linecap="round"/><path d="M136 156 q22 30 20 66" fill="none" stroke="${fur}" stroke-width="20" stroke-linecap="round"/>
         <circle cx="44" cy="226" r="9" fill="${fur}" ${THIN}/><circle cx="156" cy="226" r="9" fill="${fur}" ${THIN}/><ellipse cx="74" cy="310" rx="18" ry="7" fill="${fur}" ${THIN}/><ellipse cx="126" cy="310" rx="18" ry="7" fill="${fur}" ${THIN}/>`
      : body(look, costume, fur)}
    <rect x="88" y="124" width="24" height="24" fill="${fur}"/>
    <ellipse cx="100" cy="92" rx="48" ry="44" fill="${fur}" ${LINE}/>
    ${face(100, 88, expr, { cheek: '#f09a9a' })}
    <path d="M96 108 l4 4 l4 -4z" fill="#d8707a"/><path d="M60 108 h22 M60 116 l22 -4 M140 108 h-22 M140 116 l-22 -4" stroke="${INK}" stroke-width="1.2" opacity=".6"/>`;
}

function turtle(a, expr, costume) {
  const sk = '#8fb07e';
  const shell = `<ellipse cx="100" cy="212" rx="70" ry="84" fill="#6f7f45" ${LINE}/><path d="M100 140 l26 30 l0 50 l-26 30 l-26 -30 l0 -50z M126 170 l38 -6 M126 220 l38 14 M74 170 l-38 -6 M74 220 l-38 14 M100 250 v42" fill="#8c9a57" ${THIN}/>`;
  const look = { ...a, sex: 'm', robe: costume === 'traditional' ? a.robe : '#2f3442', robe2: '#efe4cc', hat: 'samo' };
  const tie = costume === 'modern' ? `<path d="M100 146 l-6 8 l6 40 l6 -40z" fill="#b03a2e"/>` : '';
  return `${shell}${body(look, costume, sk)}${tie}
    <rect x="88" y="120" width="24" height="28" fill="${sk}" ${THIN}/>
    <ellipse cx="100" cy="94" rx="50" ry="40" fill="${sk}" ${LINE}/>
    <path d="M70 72 q30 -10 60 0" fill="none" stroke="#6f8f5e" stroke-width="3"/>
    ${face(100, 88, expr, { cheek: '#c98a6a' })}
    ${costume === 'traditional' ? hat('samo') : ''}`;
}

function dragon(a, expr, costume) {
  const skin = '#e9cfa9';
  const look = { ...a, sex: 'm', robe: costume === 'traditional' ? a.robe : '#24324a', robe2: '#e2b23c', belly: true };
  const horns = `<path d="M70 52 q-14 -24 -6 -44 q4 12 14 16 q-4 -12 4 -20 q2 18 8 30z M130 52 q14 -24 6 -44 q-4 12 -14 16 q4 -12 -4 -20 q-2 18 -8 30z" fill="#d8a43a" ${THIN}/>`;
  const whiskers = `<path d="M80 116 q-30 0 -44 26 M120 116 q30 0 44 26" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
  const scales = costume === 'traditional' ? `<path d="M70 250 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0 q8 -8 16 0" fill="none" stroke="#e2b23c" stroke-width="2.5"/>` : '';
  return `${body(look, costume, skin)}${scales}
    <rect x="90" y="124" width="20" height="22" fill="${skin}"/>
    ${horns}
    <ellipse cx="100" cy="90" rx="46" ry="48" fill="${skin}" ${LINE}/>
    <path d="M56 86 q2 -40 44 -42 q42 2 44 42 q-14 -18 -44 -20 q-30 2 -44 20z" fill="#2f4f5a"/>
    ${face(100, 90, expr)}${beard('long')}${whiskers}
    ${costume === 'traditional' ? hat('crown') : `<path d="M74 44 l8 -10 l8 8 l10 -12 l10 12 l8 -8 l8 10z" fill="#e2b23c" ${THIN}/>`}`;
}

function swallow(a, expr, costume) {
  const robot = costume !== 'traditional';
  const bodyC = robot ? '#aab4bf' : '#1f2a3c';
  const eye = expr === 'happy'
    ? `<path d="M110 128 q6 -6 12 0" fill="none" ${LINE}/>`
    : expr === 'surprised'
      ? `<circle cx="116" cy="128" r="6" fill="#fff" ${THIN}/><circle cx="116" cy="128" r="2.5" fill="${INK}"/>`
      : expr === 'sad' || expr === 'worried'
        ? `<circle cx="116" cy="130" r="3.5" fill="${robot ? '#5ee0d6' : INK}"/><path d="M108 120 l14 4" ${THIN}/>`
        : `<circle cx="116" cy="128" r="4" fill="${robot ? '#5ee0d6' : INK}"/>`;
  const rotors = robot
    ? `<path d="M60 92 v-12 M140 92 v-12" ${THIN}/><ellipse cx="60" cy="78" rx="26" ry="4" fill="#5ee0d6" opacity=".55" class="spin"/><ellipse cx="140" cy="78" rx="26" ry="4" fill="#5ee0d6" opacity=".55" class="spin"/><rect x="84" y="176" width="34" height="22" rx="4" fill="#c8463d" ${THIN}/><path d="M92 182 h18" stroke="#fff" stroke-width="2"/>`
    : '';
  return `<g class="bird">${rotors}
    <path d="M70 160 l-40 40 l26 -6 l-14 30 l38 -44z" fill="${bodyC}" ${LINE}/>
    <ellipse cx="100" cy="148" rx="44" ry="30" fill="${bodyC}" ${LINE}/>
    <path d="M70 150 q28 30 64 8 q-20 18 -64 -8z" fill="#f4f1ea"/>
    <path d="M96 132 q-40 -50 -70 -40 q26 4 36 40z" fill="${shade(bodyC, 0.15)}" ${LINE} class="wing"/>
    <circle cx="122" cy="132" r="22" fill="${bodyC}" ${LINE}/>
    <path d="M118 146 q10 6 16 -2 q-4 10 -16 2z" fill="#c8463d"/>
    <path d="M142 128 l18 6 l-18 4z" fill="#d8a43a" ${THIN}/>
    ${eye}</g>`;
}

function robot(a, expr) {
  const scr = '#1d2b33';
  const ey = expr === 'happy' ? `<path d="M80 92 q6 -8 12 0 M108 92 q6 -8 12 0" fill="none" stroke="#5ee0d6" stroke-width="3"/>`
    : expr === 'angry' ? `<path d="M78 84 l14 6 M122 84 l-14 6" stroke="#ff7a6a" stroke-width="3"/><circle cx="86" cy="94" r="4" fill="#ff7a6a"/><circle cx="114" cy="94" r="4" fill="#ff7a6a"/>`
      : expr === 'sad' ? `<path d="M80 96 q6 -6 12 0 M108 96 q6 -6 12 0" fill="none" stroke="#5ee0d6" stroke-width="3" transform="rotate(180 100 94)"/>`
        : expr === 'surprised' ? `<circle cx="86" cy="92" r="7" fill="none" stroke="#5ee0d6" stroke-width="3"/><circle cx="114" cy="92" r="7" fill="none" stroke="#5ee0d6" stroke-width="3"/>`
          : `<rect x="80" y="88" width="12" height="8" rx="2" fill="#5ee0d6"/><rect x="108" y="88" width="12" height="8" rx="2" fill="#5ee0d6"/>`;
  return `<path d="M100 40 v-16" ${LINE}/><circle cx="100" cy="20" r="6" fill="#c8463d" ${THIN}/>
    <rect x="66" y="160" width="68" height="96" rx="12" fill="#b8c2cc" ${LINE}/><circle cx="100" cy="196" r="12" fill="#5ee0d6" opacity=".7"/>
    <path d="M66 176 h-24 v60 M134 176 h24 v60" fill="none" stroke="#8d98a3" stroke-width="12" stroke-linecap="round"/>
    <path d="M80 256 v52 M120 256 v52" stroke="#8d98a3" stroke-width="14" stroke-linecap="round"/>
    <rect x="56" y="44" width="88" height="96" rx="18" fill="#c9d2da" ${LINE}/><rect x="66" y="64" width="68" height="56" rx="10" fill="${scr}"/>${ey}
    <path d="M92 108 h16" stroke="#5ee0d6" stroke-width="2.5"/>`;
}

// 공개 함수: 인물 하나의 SVG 문자열
export function characterSVG(id, { expression = 'neutral', costume = 'traditional' } = {}) {
  const c = CHARACTERS[id];
  if (!c) return '';
  const a = c.art || {};
  let inner;
  switch (c.kind) {
    case 'rabbit': inner = rabbit(a, expression, costume); break;
    case 'turtle': inner = turtle(a, expression, costume); break;
    case 'dragon': inner = dragon(a, expression, costume); break;
    case 'swallow': inner = swallow(a, expression, costume); break;
    case 'robot': inner = robot(a, expression); break;
    default: inner = human(a, expression, costume);
  }
  return `<svg viewBox="0 0 200 320" xmlns="http://www.w3.org/2000/svg" class="char-svg kind-${c.kind}" role="img" aria-label="${c.name}">${inner}</svg>`;
}

// 배경 그림 — 한지 바탕에 먹선과 절제된 오방색으로 그린 민화풍 장면들 (viewBox 0 0 400 300)

const INK = '#2a2522';
const S = `stroke="${INK}" stroke-linecap="round" stroke-linejoin="round"`;

const cloud = (x, y, s = 1, fill = '#f7f0df') =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0 10 q6 -14 20 -8 q8 -14 24 -4 q16 -6 20 8 q10 2 6 12 h-70 q-8 -4 0 -8z M14 16 q8 -6 16 0 M40 14 q8 -6 14 2" fill="${fill}" ${S} stroke-width="1.6"/>`;
const pine = (x, y, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 q-6 -40 6 -90 q4 -20 -4 -40" fill="none" ${S} stroke-width="7" stroke="#5a4636"/>
   <path d="M-34 -96 q30 -16 64 0 q-30 8 -64 0z M-26 -120 q26 -14 50 0 q-26 8 -50 0z M-10 -66 q30 -14 56 0 q-28 8 -56 0z" fill="#3f6b4a" ${S} stroke-width="1.4"/></g>`;
const mountain = (pts, fill, op = 1) => `<path d="${pts}" fill="${fill}" opacity="${op}" ${S} stroke-width="1.6"/>`;
const waves = (y, color = '#3e6f8e', amp = 8, op = 1) => {
  let d = `M-10 ${y}`;
  for (let x = -10; x < 420; x += 40) d += ` q10 -${amp} 20 0 t20 0`;
  return `<path d="${d} V300 H-10z" fill="${color}" opacity="${op}" ${S} stroke-width="1.4"/>
    <path d="M0 ${y + 18} ${Array.from({ length: 10 }, (_, i) => `M${i * 44 + 8} ${y + 20} q8 -10 16 0 q-6 -2 -8 4`).join(' ')}" fill="none" stroke="#f7f0df" stroke-width="1.6" opacity=".8"/>`;
};
const roof = (x, y, w, color = '#3d3a3a') =>
  `<path d="M${x - 14} ${y + 18} q${w / 2 + 14} -34 ${w + 28} 0 q-10 -4 -14 -10 h-${w} q-4 6 -14 10z" fill="${color}" ${S} stroke-width="1.6"/>`;
const flowers = (x, y, c = '#d9686b') =>
  `<g transform="translate(${x} ${y})"><circle r="7" fill="${c}"/><circle cx="-9" cy="4" r="6" fill="${c}"/><circle cx="9" cy="4" r="6" fill="${c}"/><circle cx="0" cy="2" r="3" fill="#f2c94c"/></g>`;
const ground = (color = '#d8c7a0') => `<path d="M0 238 q100 -10 200 0 t200 0 V300 H0z" fill="${color}" ${S} stroke-width="1.4"/>`;
const sun = (x, y, r = 22, c = '#d8573f') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity=".9"/>`;

const BG = {
  gwanghallu: () => `
    <rect width="400" height="300" fill="#f0e6cf"/>
    ${mountain('M-10 170 q60 -70 120 -40 q40 -40 90 -10 q60 -50 120 0 q40 -10 90 20 V240 H-10z', '#b9c7a8', 0.8)}
    ${cloud(30, 30, 0.9)}${cloud(250, 18, 1.1)}
    <g transform="translate(220 92)"><rect x="10" y="40" width="120" height="78" fill="#c8463d" opacity=".15"/>
      ${roof(10, 30, 120, '#4a4442')}<path d="M18 50 v70 M58 50 v70 M98 50 v70 M128 50 v70" ${S} stroke-width="5" stroke="#b03a2e"/>
      <path d="M10 92 h130" ${S} stroke-width="4"/><path d="M14 98 h122" stroke="#e2b23c" stroke-width="2" stroke-dasharray="4 4"/></g>
    ${ground('#cfd9a8')}
    <g transform="translate(70 60)"><path d="M10 180 q-4 -70 6 -150" fill="none" ${S} stroke-width="9" stroke="#5a4636"/>
      <path d="M14 40 q40 -10 80 6" fill="none" ${S} stroke-width="6" stroke="#5a4636"/>
      <path d="M60 46 v90 M80 50 v86" stroke="#7a5b3c" stroke-width="2"/><rect x="54" y="134" width="32" height="6" fill="#7a5b3c"/>
      ${flowers(0, 34, '#e6a0a8')}${flowers(30, 24, '#e6a0a8')}${flowers(62, 34, '#e6a0a8')}${flowers(-14, 60, '#e6a0a8')}</g>`,

  village: () => `
    <rect width="400" height="300" fill="#efe5cc"/>
    ${mountain('M-10 160 q80 -80 160 -30 q60 -50 140 -10 q60 -20 120 20 V240 H-10z', '#c3c9a0', 0.75)}
    ${sun(320, 60, 20, '#d8573f')}${cloud(40, 40, 0.8)}
    ${[30, 210].map((x) => `<g transform="translate(${x} 128)"><path d="M0 50 q80 -60 160 0 q-80 -20 -160 0z" fill="#c9a86a" ${S} stroke-width="1.6"/><path d="M14 46 q66 -40 132 0" fill="none" stroke="#a3854d" stroke-width="2"/><rect x="20" y="48" width="120" height="58" fill="#e8dcc0" ${S} stroke-width="1.6"/><rect x="66" y="64" width="28" height="42" fill="#8d6c45" ${S} stroke-width="1.4"/><path d="M30 64 h24 v20 h-24z M106 64 h24 v20 h-24z" fill="#f7f0df" ${S} stroke-width="1.2"/></g>`).join('')}
    ${ground('#d6c398')}
    <path d="M0 250 ${Array.from({ length: 21 }, (_, i) => `M${i * 20} 262 v-26`).join(' ')} M0 244 h400 M0 254 h400" stroke="#8d6c45" stroke-width="2"/>`,

  room: () => `
    <rect width="400" height="300" fill="#e9dcbc"/>
    <rect x="0" y="0" width="400" height="40" fill="#8d6c45"/>
    <g transform="translate(30 50)" ${S} stroke-width="1.6"><rect width="130" height="140" fill="#f7f0df"/>
      ${Array.from({ length: 5 }, (_, i) => `<path d="M${i * 26} 0 v140" stroke="#8d6c45" stroke-width="3"/>`).join('')}
      ${Array.from({ length: 6 }, (_, i) => `<path d="M0 ${i * 28} h130" stroke="#8d6c45" stroke-width="3"/>`).join('')}</g>
    <g transform="translate(200 54)">${[0, 1, 2, 3].map((i) => `<rect x="${i * 44}" y="0" width="44" height="150" fill="#f3e9d2" ${S} stroke-width="1.6"/><path d="M${i * 44 + 10} 120 q12 -60 24 -90" fill="none" stroke="#3f6b4a" stroke-width="2"/>${flowers(i * 44 + 22, 40 + (i % 2) * 30, ['#d9686b', '#e2b23c', '#6d8fb3', '#d9686b'][i])}`).join('')}</g>
    <rect x="0" y="210" width="400" height="90" fill="#c7a26a"/><path d="M0 210 h400" ${S} stroke-width="2"/>
    <path d="M0 236 h400 M0 264 h400" stroke="#b08a52" stroke-width="1.5"/>`,

  prison: () => `
    <rect width="400" height="300" fill="#4a423a"/>
    <rect x="0" y="0" width="400" height="300" fill="url(#ink-fade)" opacity=".4"/>
    <rect x="260" y="40" width="70" height="60" fill="#8f8a7e" opacity=".6"/>
    <path d="M272 40 v60 M288 40 v60 M304 40 v60 M320 40 v60" stroke="#2a2522" stroke-width="5"/>
    ${Array.from({ length: 11 }, (_, i) => `<rect x="${i * 38 + 6}" y="0" width="14" height="300" fill="#6b4f36" ${S} stroke-width="1.4"/>`).join('')}
    <path d="M0 70 h400 M0 220 h400" stroke="#5a4130" stroke-width="12"/>
    <rect x="0" y="246" width="400" height="54" fill="#3b342e"/><path d="M20 266 q30 -6 60 0 M200 276 q40 -8 80 0" stroke="#7a6a52" stroke-width="2" fill="none"/>`,

  palace: () => `
    <rect width="400" height="300" fill="#efe3c7"/>
    ${cloud(20, 20, 0.9)}${cloud(300, 30, 0.8)}
    <g transform="translate(40 60)">${roof(20, 0, 280, '#3d3a3a')}
      <rect x="20" y="26" width="280" height="14" fill="#3f6b4a"/><path d="M20 33 h280" stroke="#e2b23c" stroke-width="3" stroke-dasharray="6 6"/>
      ${[30, 100, 170, 240, 290].map((x) => `<rect x="${x}" y="40" width="12" height="130" fill="#b03a2e" ${S} stroke-width="1.4"/>`).join('')}
      <rect x="20" y="168" width="290" height="14" fill="#cbb98f" ${S} stroke-width="1.4"/></g>
    <g transform="translate(120 112)" opacity=".85"><rect width="160" height="80" fill="#2f4f5a"/>${sun(50, 30, 14, '#e8e1d0')}${sun(118, 26, 12, '#d8573f')}<path d="M0 80 l30 -40 l20 26 l30 -46 l30 40 l20 -20 l30 40z" fill="#3f6b4a"/></g>
    <rect x="0" y="244" width="400" height="56" fill="#d8c7a0"/><path d="M0 244 h400" ${S} stroke-width="2"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 50} 244 l-20 56" stroke="#bfa877" stroke-width="1.5"/>`).join('')}`,

  market: () => `
    <rect width="400" height="300" fill="#f0e2c2"/>
    ${sun(60, 50, 18, '#e2b23c')}
    ${[0, 140, 270].map((x, i) => `<g transform="translate(${x} 90)"><path d="M0 30 l70 -30 l70 30z" fill="${['#c8463d', '#3e6f8e', '#7aa66b'][i]}" ${S} stroke-width="1.6"/><path d="M10 30 v110 M130 30 v110" ${S} stroke-width="4"/><rect x="10" y="96" width="120" height="16" fill="#c9a86a" ${S} stroke-width="1.4"/><circle cx="40" cy="90" r="9" fill="#e2b23c"/><circle cx="62" cy="88" r="9" fill="#d8573f"/><circle cx="96" cy="90" r="9" fill="#7aa66b"/></g>`).join('')}
    <path d="M0 40 q200 40 400 0" fill="none" stroke="${INK}" stroke-width="1.4"/>${[40, 110, 200, 290, 360].map((x) => `<g transform="translate(${x} ${48 + Math.round(Math.sin(x) * 6)})"><path d="M0 0 v6" stroke="${INK}"/><ellipse cy="16" rx="8" ry="11" fill="#d8573f" ${S} stroke-width="1.2"/></g>`).join('')}
    ${ground('#d6c398')}`,

  mountain: () => `
    <rect width="400" height="300" fill="#ece4cf"/>
    ${sun(300, 60, 26, '#f3ecd6')}<circle cx="300" cy="60" r="26" fill="none" stroke="${INK}" stroke-width="1.4"/>
    ${mountain('M-10 220 q30 -150 90 -180 q20 60 60 80 q30 -80 80 -100 q40 90 90 110 q40 -30 100 -10 V300 H-10z', '#7f9c84', 0.9)}
    ${mountain('M-10 250 q60 -80 140 -60 q60 -60 140 -20 q60 -20 130 10 V300 H-10z', '#5f7f68')}
    <path d="M214 120 q-4 60 2 120" stroke="#f7f0df" stroke-width="8" fill="none" opacity=".9"/><path d="M214 120 q-4 60 2 120" stroke="${INK}" stroke-width="1" fill="none"/>
    ${cloud(40, 100, 1, '#f7f0dfcc')}${cloud(250, 150, 0.8, '#f7f0dfcc')}
    ${pine(60, 280, 1)}${pine(350, 290, 0.9)}`,

  seashore: () => `
    <rect width="400" height="300" fill="#f1e7cf"/>
    ${sun(280, 70, 30, '#d8573f')}${cloud(40, 30, 1)}
    ${waves(150, '#5b8aa6', 6, 0.9)}
    <path d="M0 200 q80 -20 140 6 q60 26 120 10 q70 -20 140 0 V300 H0z" fill="#e3d2a5" ${S} stroke-width="1.6"/>
    <path d="M20 210 q20 -50 60 -40 q30 10 20 50z" fill="#8a8578" ${S} stroke-width="1.6"/><path d="M300 220 q10 -40 50 -40 q30 6 30 44z" fill="#8a8578" ${S} stroke-width="1.6"/>
    <path d="M330 190 q4 -30 -4 -50" fill="none" stroke="#3f6b4a" stroke-width="3"/><path d="M60 182 q-8 -30 4 -50" fill="none" stroke="#3f6b4a" stroke-width="3"/>`,

  riverboat: () => `
    <rect width="400" height="300" fill="#e6e1d3"/>
    ${cloud(20, 30, 1.1, '#f1ece0')}${cloud(260, 50, 0.9, '#f1ece0')}
    ${waves(170, '#4a7894', 10)}
    <g transform="translate(120 96)"><path d="M0 84 h170 l-24 36 h-122z" fill="#8d6c45" ${S} stroke-width="2"/>
      <path d="M84 84 v-90" ${S} stroke-width="5"/><path d="M88 -2 q50 30 0 80z" fill="#efe4cc" ${S} stroke-width="1.6"/><path d="M80 0 q-40 30 0 76z" fill="#efe4cc" ${S} stroke-width="1.6"/>
      <path d="M140 84 v-30 h30" fill="none" ${S} stroke-width="3"/></g>
    ${waves(232, '#2f5d78', 12)}`,

  undersea: () => `
    <rect width="400" height="300" fill="#2f5d72"/>
    <rect width="400" height="300" fill="url(#sea-light)"/>
    <g transform="translate(120 70)" opacity=".95">${roof(0, 0, 160, '#2a3f4a')}
      <rect x="0" y="24" width="160" height="110" fill="#c8463d" opacity=".25"/>
      ${[6, 56, 104, 150].map((x) => `<rect x="${x}" y="24" width="10" height="110" fill="#c8463d" ${S} stroke-width="1.2"/>`).join('')}
      <path d="M0 40 h170" stroke="#e2b23c" stroke-width="3"/></g>
    ${[[40, 240, '#e07a63'], [330, 250, '#e6a0a8'], [80, 260, '#e2b23c'], [300, 262, '#d8573f']].map(([x, y, c]) => `<path d="M${x} ${y} q-14 -30 -6 -60 M${x} ${y} q4 -40 22 -58 M${x} ${y - 20} q-16 -14 -20 -30 M${x + 8} ${y - 34} q14 -8 18 -22" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`).join('')}
    <path d="M0 262 q100 -16 200 0 t200 0 V300 H0z" fill="#d9c79c" ${S} stroke-width="1.4"/>
    ${[[30, 60], [360, 90], [210, 40], [70, 150]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="none" stroke="#e8f4f2" stroke-width="1.5"/>`).join('')}
    <path d="M20 120 q40 -10 60 10 q-30 10 -60 -10z" fill="#e2b23c" opacity=".7"/><circle cx="72" cy="126" r="1.6" fill="${INK}"/>`,

  battlefield: () => `
    <rect width="400" height="300" fill="#e7d8bd"/>
    <rect width="400" height="160" fill="#c96b4a" opacity=".35"/>
    ${mountain('M-10 140 q40 -60 90 -30 q30 -40 70 -10 V180 H-10z', '#7a5a4a', 0.85)}
    ${mountain('M260 150 q40 -70 80 -40 q30 -20 70 10 V180 H260z', '#7a5a4a', 0.85)}
    <path d="M150 100 q-10 -40 10 -60 q0 30 20 40 q10 -30 0 -50 q30 30 20 70z" fill="#d8573f" opacity=".85"/>
    ${waves(170, '#45677a', 8)}
    ${[[40, 168], [170, 180], [290, 172]].map(([x, y]) => `<g transform="translate(${x} ${y - 70})"><path d="M0 60 h90 l-14 22 h-62z" fill="#5a4636" ${S} stroke-width="1.6"/><path d="M44 60 v-56" ${S} stroke-width="3"/><path d="M46 6 h30 v40 h-30z" fill="#efe4cc" ${S} stroke-width="1.4"/><path d="M50 14 q12 6 20 0 M50 26 q12 6 20 0" stroke="#b03a2e" stroke-width="2" fill="none"/></g>`).join('')}
    ${waves(240, '#2f4f5e', 10)}`,

  campus: () => `
    <rect width="400" height="300" fill="#eef0ea"/>
    ${cloud(30, 30, 0.9, '#ffffff')}${cloud(270, 20, 1, '#ffffff')}
    <g ${S} stroke-width="1.6"><rect x="40" y="70" width="150" height="150" fill="#d9cdb6"/>${Array.from({ length: 12 }, (_, i) => `<rect x="${52 + (i % 4) * 34}" y="${84 + Math.floor(i / 4) * 40}" width="22" height="26" fill="#a9c3d6"/>`).join('')}
      <path d="M30 70 l85 -30 l85 30z" fill="#b03a2e"/><circle cx="115" cy="56" r="9" fill="#f7f0df"/>
      <rect x="230" y="110" width="140" height="110" fill="#e8dcc0"/>${Array.from({ length: 6 }, (_, i) => `<rect x="${244 + (i % 3) * 42}" y="${124 + Math.floor(i / 3) * 44}" width="28" height="28" fill="#a9c3d6"/>`).join('')}</g>
    <rect x="0" y="220" width="400" height="80" fill="#b9cf9a"/><path d="M150 300 q40 -50 60 -80 h20 q10 30 50 80z" fill="#e3d6b8" ${S} stroke-width="1.4"/>
    <g transform="translate(330 300)"><path d="M0 0 v-60" ${S} stroke-width="6" stroke="#5a4636"/><circle cy="-80" r="34" fill="#7aa66b" ${S} stroke-width="1.6"/></g>
    <path d="M40 258 h70 M46 258 v14 M104 258 v14" ${S} stroke-width="4"/>`,

  classroom: () => `
    <rect width="400" height="300" fill="#efe9da"/>
    <rect x="40" y="40" width="250" height="120" fill="#2f4f45" ${S} stroke-width="3"/>
    <path d="M60 70 h80 M60 92 h120 M60 114 h60" stroke="#e8e1d0" stroke-width="2.5" opacity=".7"/><path d="M200 70 l20 30 l20 -16 l20 30" fill="none" stroke="#e2b23c" stroke-width="2"/>
    <rect x="310" y="40" width="60" height="120" fill="#a9c3d6" ${S} stroke-width="2"/><path d="M340 40 v120 M310 100 h60" ${S} stroke-width="2"/>
    <rect x="0" y="200" width="400" height="100" fill="#c9a86a"/>
    ${[30, 160, 290].map((x) => `<g transform="translate(${x} 218)"><rect width="90" height="12" fill="#8d6c45" ${S} stroke-width="1.4"/><path d="M8 12 v50 M82 12 v50" ${S} stroke-width="4"/></g>`).join('')}`,

  office: () => `
    <rect width="400" height="300" fill="#e8ebee"/>
    <rect x="20" y="20" width="360" height="180" fill="#bcd0dc" ${S} stroke-width="2"/>
    ${[[30, 90, 40, 110], [80, 60, 50, 140], [140, 100, 40, 100], [190, 40, 60, 160], [260, 80, 50, 120], [320, 110, 50, 90]].map(([x, y, w, h]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#8aa0b0" opacity=".8"/>${Array.from({ length: Math.floor(h / 22) }, (_, i) => `<path d="M${x + 6} ${y + 10 + i * 22} h${w - 12}" stroke="#e8ebee" stroke-width="3" stroke-dasharray="5 4"/>`).join('')}`).join('')}
    <path d="M140 20 v180 M260 20 v180" ${S} stroke-width="3"/>
    <rect x="0" y="200" width="400" height="100" fill="#cfc6b6"/>
    <g transform="translate(250 190)"><rect width="130" height="12" fill="#5a4a3e"/><rect x="40" y="-44" width="60" height="40" rx="3" fill="#2a2e36"/><path d="M66 -4 v8" stroke="#2a2e36" stroke-width="4"/></g>
    <g transform="translate(40 300)"><rect x="-14" y="-40" width="28" height="40" fill="#b8865a"/><path d="M0 -40 q-20 -30 -6 -60 M0 -40 q10 -40 26 -50 M0 -40 q-30 -10 -34 -36" fill="none" stroke="#3f6b4a" stroke-width="6" stroke-linecap="round"/></g>`,

  cityNight: () => `
    <rect width="400" height="300" fill="#1f2433"/>
    ${sun(330, 50, 18, '#f1e7cf')}
    ${[[0, 100, 60], [60, 70, 50], [110, 120, 70], [180, 60, 60], [240, 110, 50], [290, 80, 60], [350, 120, 60]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="${240 - y}" fill="#2e3546" stroke="#151821" stroke-width="2"/>${Array.from({ length: 8 }, (_, i) => `<rect x="${x + 8 + (i % 2) * (w / 2 - 4)}" y="${y + 12 + Math.floor(i / 2) * 24}" width="10" height="10" fill="${i % 3 ? '#e2b23c' : '#5ee0d6'}" opacity="${0.4 + (i % 3) * 0.2}"/>`).join('')}`).join('')}
    <rect x="70" y="150" width="70" height="26" rx="4" fill="none" stroke="#ff7a8a" stroke-width="3"/><text x="105" y="169" fill="#ff7a8a" font-size="14" text-anchor="middle" font-family="sans-serif">야식</text>
    <rect x="0" y="240" width="400" height="60" fill="#3a3f4f"/><path d="M0 268 h400" stroke="#e2b23c" stroke-width="2" stroke-dasharray="20 14"/>`,

  futureCity: () => `
    <rect width="400" height="300" fill="#dfe8ec"/>
    <rect width="400" height="300" fill="url(#future-sky)"/>
    ${[[30, 60, 40], [90, 30, 30], [140, 90, 50], [220, 20, 36], [280, 70, 46], [340, 40, 34]].map(([x, y, w]) => `<path d="M${x} 240 V${y + 20} q${w / 2} -30 ${w} 0 V240z" fill="#9fb3bf" stroke="#2a2522" stroke-width="1.6"/><path d="M${x + w / 2} ${y - 4} v-16" stroke="#2a2522" stroke-width="2"/><circle cx="${x + w / 2}" cy="${y - 22}" r="3" fill="#5ee0d6"/>`).join('')}
    <path d="M-10 130 q210 -60 420 0" fill="none" stroke="#5ee0d6" stroke-width="6" opacity=".7"/><path d="M-10 130 q210 -60 420 0" fill="none" stroke="#2a2522" stroke-width="1.4"/>
    <rect x="150" y="86" width="34" height="14" rx="6" fill="#c8463d" stroke="#2a2522" stroke-width="1.4"/>
    ${cloud(40, 20, 0.7, '#ffffffcc')}
    <rect x="0" y="240" width="400" height="60" fill="#c3ced4"/><path d="M0 252 h400" stroke="#5ee0d6" stroke-width="2"/>`,
};

const DEFS = `<defs>
  <linearGradient id="sea-light" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fd0d8" stop-opacity=".55"/><stop offset="1" stop-color="#1c3a4a" stop-opacity=".4"/></linearGradient>
  <linearGradient id="future-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3d9c6" stop-opacity=".6"/><stop offset="1" stop-color="#bfe3e6" stop-opacity=".5"/></linearGradient>
  <radialGradient id="ink-fade"><stop offset=".4" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="1"/></radialGradient>
</defs>`;

export function backgroundSVG(id) {
  const draw = BG[id] || BG.village;
  return `<svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" class="bg-svg" aria-hidden="true">${DEFS}${draw()}</svg>`;
}

// 소품 아이콘 (viewBox 0 0 60 60)
const PROP_ART = {
  fan: `<path d="M30 54 L4 22 q26 -22 52 0z" fill="#f4f1ea" ${S} stroke-width="2"/><path d="M30 54 L14 14 M30 54 L30 8 M30 54 L46 14" stroke="${INK}" stroke-width="1.2"/><path d="M8 24 q22 -16 44 0" fill="none" stroke="#c8463d" stroke-width="3"/>`,
  scroll: `<rect x="12" y="10" width="36" height="40" fill="#f4ecd8" ${S} stroke-width="2"/><rect x="8" y="6" width="44" height="7" rx="3" fill="#8d6c45"/><rect x="8" y="47" width="44" height="7" rx="3" fill="#8d6c45"/><path d="M20 20 v22 M28 20 v18 M36 20 v24" stroke="${INK}" stroke-width="1.5"/>`,
  gourd: `<ellipse cx="30" cy="36" rx="22" ry="18" fill="#f0ead2" ${S} stroke-width="2"/><path d="M30 18 q2 -8 8 -10" fill="none" stroke="#3f6b4a" stroke-width="3"/><path d="M16 30 q14 -8 28 0" fill="none" stroke="#c9c1a4" stroke-width="2"/>`,
  seed: `<ellipse cx="30" cy="32" rx="10" ry="16" fill="#d9c79c" ${S} stroke-width="2" transform="rotate(20 30 32)"/><path d="M30 10 l4 -6 l4 6" stroke="#e2b23c" stroke-width="2" fill="none"/>`,
  coins: `${[[22, 40], [36, 42], [29, 30]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="11" fill="#d8a43a" ${S} stroke-width="2"/><rect x="${x - 3}" y="${y - 3}" width="6" height="6" fill="#efe4cc" stroke="${INK}"/>`).join('')}`,
  rice: `<path d="M10 52 q-4 -30 8 -40 h24 q12 10 8 40z" fill="#e8dcc0" ${S} stroke-width="2"/><path d="M14 12 q16 8 32 0" fill="none" ${S} stroke-width="2"/><path d="M18 30 h24" stroke="#c8463d" stroke-width="3"/>`,
  lantern: `<path d="M30 4 v6" ${S} stroke-width="2"/><rect x="16" y="10" width="28" height="38" rx="10" fill="#d8573f" ${S} stroke-width="2"/><path d="M16 22 h28 M16 36 h28" stroke="#e2b23c" stroke-width="2"/><path d="M24 48 v8 M30 48 v8 M36 48 v8" stroke="#c8463d" stroke-width="2"/>`,
  phone: `<rect x="18" y="6" width="24" height="48" rx="5" fill="#2a2e36" ${S} stroke-width="2"/><rect x="21" y="12" width="18" height="34" fill="#a9d6e0"/><path d="M24 22 h12 M24 28 h8" stroke="#fff" stroke-width="2"/>`,
  laptop: `<rect x="10" y="12" width="40" height="28" rx="2" fill="#2a2e36" ${S} stroke-width="2"/><rect x="13" y="15" width="34" height="22" fill="#a9d6e0"/><path d="M4 44 h52 l-4 6 h-44z" fill="#9aa4ae" ${S} stroke-width="2"/>`,
  contract: `<rect x="12" y="6" width="36" height="48" fill="#fbf7ec" ${S} stroke-width="2"/><path d="M18 16 h24 M18 24 h24 M18 32 h16" stroke="${INK}" stroke-width="1.6"/><circle cx="38" cy="44" r="6" fill="#c8463d"/>`,
  robotPart: `<circle cx="30" cy="30" r="14" fill="#aab4bf" ${S} stroke-width="2"/><circle cx="30" cy="30" r="5" fill="#2a2e36"/>${[0, 60, 120, 180, 240, 300].map((a) => `<rect x="27" y="10" width="6" height="8" fill="#aab4bf" stroke="${INK}" transform="rotate(${a} 30 30)"/>`).join('')}<path d="M44 44 l8 8" stroke="#d8573f" stroke-width="3"/>`,
  medicine: `<path d="M8 28 h44 q-2 22 -22 24 q-20 -2 -22 -24z" fill="#efe4cc" ${S} stroke-width="2"/><ellipse cx="30" cy="28" rx="22" ry="5" fill="#6b4a30"/><path d="M22 18 q4 -8 0 -14 M34 18 q4 -8 0 -14" fill="none" stroke="#9aa4ae" stroke-width="2"/>`,
  ship: `<path d="M6 38 h48 l-8 12 h-32z" fill="#8d6c45" ${S} stroke-width="2"/><path d="M30 38 v-30" ${S} stroke-width="2.5"/><path d="M32 10 q16 12 0 26z" fill="#efe4cc" ${S} stroke-width="1.6"/>`,
  sword: `<path d="M30 4 l4 38 h-8z" fill="#cfd6dc" ${S} stroke-width="2"/><rect x="18" y="42" width="24" height="5" fill="#d8a43a" ${S} stroke-width="1.6"/><rect x="27" y="47" width="6" height="10" fill="#5a4636"/>`,
  drum: `<ellipse cx="30" cy="22" rx="22" ry="8" fill="#efe4cc" ${S} stroke-width="2"/><path d="M8 22 v18 q22 14 44 0 v-18" fill="#c8463d" ${S} stroke-width="2"/><path d="M14 30 v10 M46 30 v10 M30 34 v12" stroke="#e2b23c" stroke-width="2"/>`,
};

export function propSVG(id) {
  return `<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" class="prop-svg" aria-hidden="true">${PROP_ART[id] || ''}</svg>`;
}

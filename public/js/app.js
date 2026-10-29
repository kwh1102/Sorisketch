// Sorisketch — 화면 흐름
// 시작 → 작품 선택 → 배경 설정 → 도입(원작 이야기·추임새 연습) → 장면 반복(아니리 → 창 → 해설 → 선택) → 결말 → 체험 결과

import { WORKS, WORK_IDS, CHARACTERS, SETTINGS } from './data/works.js';
import { JANGDAN, JO, ELEMENT_CARDS, PASSAGES, CHUIMSAE_WORDS, SOURCES, AUDIO_SOURCE, SORI_TRACKS } from './data/gugak.js';
import { SoriAudio } from './audio/engine.js';
import { Stage, miniScene } from './art/stage.js';
import { Director } from './story/director.js';
import { SCRIPTS } from './story/scripts.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const app = $('#app');
const audio = new SoriAudio();
const STROKE_WORD = { D: '덩', K: '쿵', T: '딱', t: '따', '-': '' };

// ---------- 설정(기기에만 저장) ----------
const prefs = { volume: 0.8, muted: false, tts: false, large: false, guide: true };
try {
  Object.assign(prefs, JSON.parse(localStorage.getItem('sorisketch:prefs') || '{}'));
} catch {
  // 저장소를 쓸 수 없는 환경이면 기본값으로
}
function savePrefs() {
  try {
    localStorage.setItem('sorisketch:prefs', JSON.stringify(prefs));
  } catch {
    // 무시
  }
}
function applyPrefs() {
  audio.setVolume(prefs.volume);
  audio.setMuted(prefs.muted);
  document.body.classList.toggle('large', prefs.large);
  document.body.classList.toggle('muted', prefs.muted);
  $('#btn-mute').setAttribute('aria-label', prefs.muted ? '소리 켜기' : '소리 끄기');
}

// ---------- 상태 ----------
const S = {
  ai: false,
  model: '',
  work: null,
  setting: 'original',
  custom: '',
  director: null,
  stage: null,
  forceScript: false,
  stats: null,
  lan: [],
  usedTracks: new Set(),
};
function resetStats() {
  S.stats = { jangdan: new Set(), cards: [], chuimsae: 0, good: 0, chang: 0, aniri: 0, choices: [], changsHeard: 0 };
}

// ---------- 공통 ----------
function show(html, cls = '') {
  audio.stop();
  stopSpeech();
  app.className = cls;
  app.innerHTML = html;
  window.scrollTo(0, 0);
  $('#topbar').hidden = cls === 'screen-home' || cls === 'screen-present';
  $('#mode-chip').textContent = S.ai && !S.forceScript ? 'AI 이야기' : '각본 모드';
}

function speak(text) {
  if (!prefs.tts || !('speechSynthesis' in window)) return;
  stopSpeech();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'ko-KR';
  u.rate = 1.02;
  u.volume = prefs.muted ? 0 : prefs.volume;
  window.speechSynthesis.speak(u);
}
function stopSpeech() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
}

function chip(text, kind = '') {
  return `<span class="chip ${kind}">${esc(text)}</span>`;
}

// 해설 카드 (검토된 국악 정보)
function cardHTML(learn, { compact = false } = {}) {
  if (!learn) return '';
  if (learn.type === 'jangdan') {
    const J = JANGDAN[learn.id];
    return `<article class="card learn-card">
      <div class="card-kicker">${chip('장단', 'ink')} ${chip('검토된 국악 정보', 'verified')}</div>
      <h3>${J.name} <small>${J.beatsLabel} · ${J.tempoWord}</small></h3>
      <p>${J.summary}</p>
      ${compact ? '' : `<p class="listen">🎧 ${J.listen}</p>`}
      ${J.examples.length ? `<p class="examples">이 장단이 쓰인 대목 예: ${J.examples.join(', ')}</p>` : ''}
      <div class="card-wheel">${wheelSVG(J.id, 120)}<div>
        <button class="btn small" data-demo-jangdan="${J.id}">🥁 실제 소리북 장단 듣기</button>
        <p class="credit">고수의 소리북 녹음: ${audioCredit()}</p></div></div>
    </article>`;
  }
  if (learn.type === 'passage') {
    const P = PASSAGES[learn.id];
    const J = P.jangdan ? JANGDAN[P.jangdan] : null;
    return `<article class="card learn-card original">
      <div class="card-kicker">${chip('원작 감상', 'red')} ${chip('검토된 국악 정보', 'verified')}</div>
      <h3>${WORKS[P.work].title} 「${P.title}」 ${J ? `<small>${J.name}</small>` : ''}</h3>
      <p>${P.context}</p>
      ${P.audio
        ? `<button class="btn small listen-btn" data-play-file="${esc(P.audio)}">▶ 원작 소리 듣기 <small>창 ${esc(P.singer)}</small></button>
           <p class="credit">「${esc(P.track)}」 앞부분 · 창 ${esc(P.singer)} · ${audioCredit()}</p>`
        : `<p class="placeholder-note">이 대목은 아직 공개 이용이 가능한 음원을 찾지 못했어요. 아래 버튼으로 이 대목의 장단을 들어 볼 수 있어요.</p>`}
      ${J ? `<button class="btn small" data-demo-jangdan="${J.id}">🥁 ${J.name} 장단(소리북) 들어 보기</button>` : ''}
    </article>`;
  }
  if (learn.type === 'jo') {
    const J = JO[learn.id];
    return `<article class="card learn-card">
      <div class="card-kicker">${chip('조(調)', 'ink')} ${chip('검토된 국악 정보', 'verified')}</div>
      <h3>${J.name}</h3><p>${J.summary}</p>
      <p class="examples">이번 장면은 ${J.name}의 느낌으로 쓴 사설이에요. 원작 소리에서 같은 조의 대목을 찾아 들어 보세요.</p>
    </article>`;
  }
  const E = ELEMENT_CARDS[learn.id];
  if (!E) return '';
  return `<article class="card learn-card">
    <div class="card-kicker">${chip('판소리 알기', 'ink')} ${chip('검토된 국악 정보', 'verified')}</div>
    <h3>${E.title}</h3><p>${E.body}</p>
  </article>`;
}

function audioCredit() {
  return `<a href="${AUDIO_SOURCE.url}" target="_blank" rel="noopener">${AUDIO_SOURCE.label}</a>, ${AUDIO_SOURCE.license}`;
}

// 카드 안의 "장단 들어 보기"·"음원 듣기" 버튼
document.addEventListener('click', (e) => {
  const demo = e.target.closest('[data-demo-jangdan]');
  if (demo) {
    const id = demo.dataset.demoJangdan;
    const playing = demo.classList.contains('playing');
    $$('.playing').forEach((b) => b.classList.remove('playing'));
    if (playing) return audio.stop();
    demo.classList.add('playing');
    const wheel = demo.closest('.card')?.querySelector('.wheel');
    const done = () => demo.classList.remove('playing');
    audio.playJangdan(id, 2, { step: (ev) => wheel && lightWheel(wheel, ev.step), end: done, stopped: done })
      .catch(() => {
        done();
        toast('장단을 재생할 수 없어요.');
      });
    S.stats?.jangdan.add(id);
  }
  const file = e.target.closest('[data-play-file]');
  if (file) {
    const playing = file.classList.contains('playing');
    $$('.playing').forEach((b) => b.classList.remove('playing'));
    if (playing) return audio.stop();
    file.classList.add('playing');
    const done = () => file.classList.remove('playing');
    audio.playTrack(file.dataset.playFile, { end: done, stopped: done }).catch(() => {
      done();
      toast('음원을 재생할 수 없어요.');
    });
    const jd = file.closest('.card')?.querySelector('[data-demo-jangdan]')?.dataset.demoJangdan;
    if (jd) S.stats?.jangdan.add(jd);
  }
});

// ---------- 장단 원 ----------
function wheelSVG(jangdanId, size = 150) {
  const J = JANGDAN[jangdanId];
  const n = J.pattern.length;
  const r = 60;
  let dots = '';
  let idx = 0;
  J.groups.forEach((g, gi) => {
    for (let k = 0; k < g; k++, idx++) {
      const a = (idx / n) * Math.PI * 2 - Math.PI / 2;
      const x = 80 + Math.cos(a) * r;
      const y = 80 + Math.sin(a) * r;
      const st = J.pattern[idx];
      const rad = st === 'D' ? 9 : st === 'K' ? 7 : st === 'T' ? 6 : st === 't' ? 4.5 : 3;
      dots += `<g class="wdot s-${st === '-' ? 'rest' : st}" data-step="${idx}"><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${rad}"/>${STROKE_WORD[st] ? `<text x="${(80 + Math.cos(a) * (r + 15)).toFixed(1)}" y="${(80 + Math.sin(a) * (r + 15) + 4).toFixed(1)}">${STROKE_WORD[st]}</text>` : ''}</g>`;
    }
    if (gi < J.groups.length - 1) {
      const a = (idx / n) * Math.PI * 2 - Math.PI / 2 - Math.PI / n;
      dots += `<path class="wsep" d="M${(80 + Math.cos(a) * 48).toFixed(1)} ${(80 + Math.sin(a) * 48).toFixed(1)} L${(80 + Math.cos(a) * 54).toFixed(1)} ${(80 + Math.sin(a) * 54).toFixed(1)}"/>`;
    }
  });
  return `<svg class="wheel" viewBox="-6 -6 172 172" width="${size}" height="${size}" role="img" aria-label="${J.name} 장단 원: ${J.beatsLabel}">
    <circle cx="80" cy="80" r="${r}" class="wring"/>${dots}
    <text x="80" y="78" class="wname">${J.name}</text><text x="80" y="96" class="wbeats">${J.pattern.length}칸</text></svg>`;
}
function lightWheel(wheel, step) {
  $$('.wdot.on', wheel).forEach((d) => d.classList.remove('on'));
  wheel.querySelector(`.wdot[data-step="${step}"]`)?.classList.add('on');
}

// ======================================================================
// 화면: 시작
// ======================================================================
function home() {
  show(`
  <section class="home">
    <div class="home-art">${miniScene({ background: 'undersea', characters: ['tokki', 'yongwang', 'jara'] })}</div>
    <div class="home-text">
      <p class="eyebrow">AI와 함께 그림으로 펼치는 인터랙티브 판소리</p>
      <h1 class="logo">Sorisketch<span>소리스케치</span></h1>
      <p class="sub">판을 바꾸다 — 내가 만드는 판소리 평행세계</p>
      <p class="lead">판소리 다섯 바탕 중 하나를 골라, 내 선택으로 새 이야기를 짜 보세요. 그림 속 인물이 움직이고, 북이 장단을 짚고, 여러분은 <b>추임새</b>로 소리판에 참여합니다.</p>
      <button class="btn primary big" id="start">소리판 열기</button>
      <p class="hint">🔊 소리를 켜고 시작해 주세요 · 설치·가입 없이 5분</p>
      <ol class="how">
        <li><b>고르기</b> 다섯 바탕과 무대가 될 세계</li>
        <li><b>듣기</b> 아니리(말)와 창(노래), 그리고 장단</li>
        <li><b>참여하기</b> 추임새를 넣고, 다음 이야기를 결정</li>
      </ol>
      <nav class="home-links"><a href="#about" id="go-about">이 소리판에 대하여</a> · <a href="?present" id="go-present">발표 모드</a></nav>
    </div>
  </section>`, 'screen-home');
  $('#start').onclick = () => {
    audio.ensure();
    audio.sfx('select');
    works();
  };
  $('#go-about').onclick = (e) => {
    e.preventDefault();
    about();
  };
}

// ======================================================================
// 화면: 작품 선택
// ======================================================================
function works() {
  show(`
  <section class="pick">
    <h2 class="title">어떤 바탕으로 판을 열까요?</h2>
    <p class="desc">지금까지 소리가 전해지는 판소리는 다섯 바탕이에요. 하나를 골라 이야기의 출발점으로 삼아요.</p>
    <div class="work-grid">
      ${WORK_IDS.map((id) => {
        const w = WORKS[id];
        return `<button class="work-card" data-work="${id}">
          ${miniScene(w.cover)}
          <div class="work-info"><h3>${w.title} <small>${w.hanja}</small></h3><p>${w.tagline}</p>
          <p class="cast">${w.characters.slice(0, 4).map((c) => CHARACTERS[c].name).join(' · ')}</p></div>
        </button>`;
      }).join('')}
    </div>
  </section>`, 'screen-pick');
  $$('[data-work]').forEach((b) => (b.onclick = () => {
    audio.sfx('select');
    S.work = b.dataset.work;
    settingScreen();
  }));
}

// ======================================================================
// 화면: 배경 설정
// ======================================================================
function settingScreen() {
  const w = WORKS[S.work];
  const ai = S.ai && !S.forceScript;
  const scripted = Object.keys(SCRIPTS[S.work]);
  show(`
  <section class="pick">
    <p class="crumb">${w.title}</p>
    <h2 class="title">무대가 될 세계를 정해요</h2>
    <p class="desc">원작 배경을 그대로 두고 이야기의 흐름만 바꿀 수도, 인물들을 완전히 새로운 세계로 데려갈 수도 있어요.</p>
    <div class="setting-list">
      ${Object.values(SETTINGS).map((s) => {
        const offlineOk = ai || scripted.includes(s.id);
        const disabled = s.id === 'custom' && !ai;
        return `<label class="setting ${disabled ? 'disabled' : ''}">
          <input type="radio" name="setting" value="${s.id}" ${s.id === S.setting ? 'checked' : ''} ${disabled ? 'disabled' : ''}>
          <span class="setting-body"><b>${s.name}</b><span>${s.desc}</span>
          ${!offlineOk && !disabled ? '<em>각본 모드에서는 원작 배경 이야기로 진행돼요</em>' : ''}${disabled ? '<em>AI 연결 시 사용할 수 있어요</em>' : ''}</span>
        </label>`;
      }).join('')}
      <input class="custom-input" id="custom" maxlength="60" placeholder="예: 우주 정거장, 조선 시대 시장, 아이돌 기획사…" value="${esc(S.custom)}" hidden>
    </div>
    <button class="btn primary big" id="go">이 세계로 판 열기</button>
  </section>`, 'screen-pick');
  const sync = () => {
    S.setting = $('input[name=setting]:checked')?.value || 'original';
    $('#custom').hidden = S.setting !== 'custom';
  };
  $$('input[name=setting]').forEach((r) => (r.onchange = sync));
  sync();
  $('#go').onclick = () => {
    S.custom = $('#custom').value.trim();
    if (S.setting === 'custom' && !S.custom) {
      $('#custom').focus();
      return;
    }
    intro();
  };
}

// ======================================================================
// 화면: 도입 — 원작 이야기 + 추임새 연습
// ======================================================================
function intro() {
  const w = WORKS[S.work];
  resetStats();
  show(`
  <section class="intro">
    <article class="card original">
      <div class="card-kicker">${chip('원작 이야기', 'red')}</div>
      <h2>${w.title} <small>${w.hanja}</small></h2>
      <p>${w.premise}</p>
      <p class="muted">원작의 결말: ${w.originalEnding}</p>
      <p class="muted">이번 판은 이 이야기에서 <b>출발</b>하지만, 여러분의 선택에 따라 전혀 다른 결말로 갈 수 있어요.</p>
      ${w.passages.some((p) => PASSAGES[p].audio) ? `<div class="orig-listen"><p><b>🎧 먼저 원작의 소리를 들어 보세요</b></p>
        ${w.passages.filter((p) => PASSAGES[p].audio).map((p) => `<button class="btn small" data-play-file="${PASSAGES[p].audio}">「${PASSAGES[p].title}」 <small>${JANGDAN[PASSAGES[p].jangdan]?.name || ''} · 창 ${esc(PASSAGES[p].singer)}</small></button>`).join('')}
        <p class="credit">${audioCredit()} · 각 대목의 앞부분 발췌</p></div>` : ''}
    </article>
    ${cardHTML({ type: 'element', id: 'pansori' })}
    <article class="card practice">
      <div class="card-kicker">${chip('연습', 'ink')}</div>
      <h3>추임새 넣어 보기</h3>
      <p>판소리에서는 듣는 사람도 "얼씨구!", "좋다!" 하며 소리판에 참여해요. 북 장단을 들으며, 한 바퀴가 <b>맺히는 자리</b>(원이 다시 위로 돌아오는 때)에 추임새를 넣어 보세요.</p>
      <div class="practice-row">${wheelSVG('jungjungmori', 140)}
        <div class="practice-side"><button class="btn" id="practice-play">🥁 중중모리 장단 듣기</button><p class="credit">고수의 소리북 녹음(국립국악원)</p><p class="feedback" id="practice-fb">버튼을 누르면 장단이 시작돼요.</p></div></div>
      ${chuimsaeBar()}
    </article>
    <article class="card how-card">
      <h3>이렇게 진행돼요</h3>
      <ul>
        <li>${chip('아니리')} 말로 이야기를 이어 가는 부분 — 화면을 눌러 넘겨요.</li>
        <li>${chip('창')} 장단에 얹어 노래하는 부분 — 북과 가락을 듣고 추임새를 넣어요.</li>
        <li>${chip('해설')} 방금 들은 소리를 짧게 알려 줘요.</li>
        <li>${chip('선택')} 다음 이야기를 정해요. ${S.ai && !S.forceScript ? '직접 행동을 적을 수도 있어요.' : ''}</li>
      </ul>
      <p class="muted">${S.ai && !S.forceScript ? `이야기는 AI(${esc(S.model)})가 여러분의 선택을 기억하며 매번 새로 지어요.` : 'AI가 연결되어 있지 않아 미리 쓴 각본으로 진행해요. 선택에 따라 전개와 결말이 달라져요.'}</p>
    </article>
    <button class="btn primary big" id="begin">판 시작하기</button>
  </section>`, 'screen-intro');

  let windows = [];
  const wheel = $('.practice .wheel');
  const fb = $('#practice-fb');
  const bar = $('.practice .chuimsae-bar');
  $('#practice-play').onclick = async () => {
    audio.ensure();
    fb.textContent = '원이 한 바퀴 도는 것을 지켜보세요…';
    const res = await audio.playJangdan('jungjungmori', 3, {
      step: (ev) => {
        lightWheel(wheel, ev.step);
        const now = audio.ctx.currentTime;
        bar.classList.toggle('hint', prefs.guide && windows.some(([a, b]) => now >= a && now <= b));
      },
      end: () => {
        bar.classList.remove('hint');
        fb.textContent = '잘했어요! 이제 판을 시작해 볼까요?';
      },
    });
    windows = res?.windows || [];
  };
  bindChuimsae(bar, () => windows, (good) => {
    fb.textContent = good ? '좋은 자리! 장단이 맺히는 곳에 딱 맞았어요.' : '조금 이르거나 늦었어요. 원이 맨 위로 돌아오는 순간을 노려 보세요.';
  });
  $('#begin').onclick = () => startStory();
}

function chuimsaeBar() {
  return `<div class="chuimsae-bar" role="group" aria-label="추임새">
    ${CHUIMSAE_WORDS.map((w) => `<button class="ch-btn" data-word="${w}">${w}</button>`).join('')}
  </div>`;
}
function bindChuimsae(bar, getWindows, onResult) {
  $$('.ch-btn', bar).forEach((b) => (b.onclick = () => {
    audio.ensure();
    const now = audio.ctx.currentTime;
    const good = getWindows().some(([a, z]) => now >= a && now <= z);
    audio.sfx(good ? 'good' : 'chuimsae');
    b.classList.remove('pop');
    void b.offsetWidth;
    b.classList.add('pop');
    S.stage?.chuimsae(b.dataset.word, good);
    if (S.stats) {
      S.stats.chuimsae += 1;
      if (good) S.stats.good += 1;
    }
    onResult?.(good, b.dataset.word);
  }));
}

// ======================================================================
// 화면: 이야기 진행
// ======================================================================
function startStory() {
  S.director = new Director({ work: S.work, setting: S.setting, customSetting: S.custom, ai: S.ai && !S.forceScript });
  show(`
  <section class="play">
    <div class="stage-wrap">
      <div class="stage" id="stage"></div>
      <div class="scene-head"><span class="badge" id="scene-badge"></span><h2 id="scene-title"></h2></div>
    </div>
    <div class="panel" id="panel"></div>
  </section>`, 'screen-play');
  S.stage = new Stage($('#stage'));
  audio.preload(Object.values(audio.cues.drums).map((d) => d.file));
  const w = WORKS[S.work];
  S.stage.render({ background: w.cover.background, tint: 'day', costume: 'traditional', characters: [], props: [], effect: 'none' });
  if (S.director.mode === 'script' && !S.director.isScriptSettingExact && S.setting !== 'original') {
    toast('각본 모드라 원작 배경 이야기로 진행해요.');
  }
  nextScene(null);
}

function toast(msg) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

const TIPS = Object.values(ELEMENT_CARDS);
async function nextScene(action) {
  const panel = $('#panel');
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
  panel.innerHTML = `<div class="loading">
    <div class="ink-loader" aria-hidden="true"><span></span><span></span><span></span></div>
    <p>${S.director.mode === 'ai' ? '소리꾼이 다음 대목을 짓는 중…' : '다음 대목을 펼치는 중…'}</p>
    <aside class="tip"><b>${tip.title}</b> ${tip.body}</aside></div>`;
  panel.scrollIntoView({ block: 'nearest' });
  try {
    const scene = await S.director.next(action);
    playScene(scene);
  } catch (err) {
    console.warn(err);
    panel.innerHTML = `<div class="error-box">
      <p>AI가 다음 장면을 만들지 못했어요. <small>(${esc(err.message)})</small></p>
      <button class="btn primary" id="retry">다시 시도</button>
      <button class="btn" id="to-script">미리 쓴 각본으로 이어 가기</button></div>`;
    $('#retry').onclick = () => nextScene(action);
    $('#to-script').onclick = () => {
      S.director.switchToScript();
      S.forceScript = true;
      $('#mode-chip').textContent = '각본 모드';
      nextScene(action && { ...action, type: 'choice' });
    };
  }
}

function playScene(scene) {
  const d = S.director;
  $('#scene-badge').textContent = `새로운 판 · ${d.sceneIndex}/${d.totalScenes}${scene.ending ? ' · 결말' : ''}`;
  $('#scene-title').textContent = scene.title;
  S.stage.render(scene.stage);
  audio.sfx('page');
  runAniri(scene, 0);
}

function speakerName(scene, id) {
  if (id === 'narrator') return '소리꾼';
  return scene.stage.characters.find((c) => c.id === id)?.name || CHARACTERS[id]?.name || '';
}

// 1) 아니리
function runAniri(scene, i) {
  const panel = $('#panel');
  if (i >= scene.aniri.length) {
    S.stage.setSpeaker(null);
    return scene.chang ? runChang(scene) : runLearn(scene);
  }
  const line = scene.aniri[i];
  S.stats.aniri += 1;
  S.stage.setSpeaker(line.speaker === 'narrator' ? null : line.speaker);
  panel.innerHTML = `<div class="aniri" role="button" tabindex="0" aria-label="다음으로">
    <div class="part-label">${chip('아니리', 'ink')} <span>말로 이어 가는 부분</span></div>
    <p class="speaker ${line.speaker === 'narrator' ? 'narr' : ''}">${esc(speakerName(scene, line.speaker))}</p>
    <p class="line"></p>
    <div class="aniri-foot"><span class="dots">${scene.aniri.map((_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</span><span class="next">눌러서 계속 ▸</span></div>
  </div>`;
  const box = $('.aniri', panel);
  const out = $('.line', box);
  const chars = [...line.text];
  let k = 0;
  let done = false;
  const timer = setInterval(() => {
    k += 2;
    out.textContent = chars.slice(0, k).join('');
    if (k >= chars.length) finish();
  }, 28);
  function finish() {
    clearInterval(timer);
    out.textContent = line.text;
    done = true;
  }
  speak(line.text);
  const advance = () => {
    if (!done) return finish();
    stopSpeech();
    audio.sfx('select');
    runAniri(scene, i + 1);
  };
  box.onclick = advance;
  box.onkeydown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      advance();
    }
  };
  box.focus({ preventScroll: true });
}

// 2) 창
// 기본: 장면의 장단과 같은 장단의 실제 판소리 녹음을 듣는다(같은 작품의 녹음을 먼저 고름).
// 「새 사설을 북 장단에 얹어 보기」: 실제 소리북 장단 위로 이 장면의 새 사설 자막이 장단에 맞춰 흐른다.
function pickTrack(jangdan, work) {
  const all = SORI_TRACKS.filter((t) => t.jangdan === jangdan);
  const fresh = all.filter((t) => !S.usedTracks.has(t.file));
  const pool = fresh.length ? fresh : all;
  const same = pool.filter((t) => t.work === work);
  const list = same.length ? same : pool;
  const t = list[Math.floor(Math.random() * list.length)];
  if (t) S.usedTracks.add(t.file);
  return t;
}

function runChang(scene, jangdanOverride = null) {
  const panel = $('#panel');
  const c = scene.chang;
  const jangdan = jangdanOverride || c.jangdan;
  const J = JANGDAN[jangdan];
  const isAI = S.director.mode === 'ai';
  const guided = prefs.guide && (S.stats.changsHeard < 2 || jangdanOverride);
  scene.tracks ||= {};
  const track = (scene.tracks[jangdan] ||= pickTrack(jangdan, S.work));
  panel.innerHTML = `<div class="chang">
    <div class="part-label">${chip('창', 'red')} <span>장단에 얹어 노래하는 부분</span></div>
    ${track ? `<div class="now-playing">
      <p class="np-head">🎙 지금 들리는 실제 판소리</p>
      <p class="np-title"><b>${WORKS[track.work].title} 「${esc(track.title)}」</b> · 창 ${esc(track.singer)} · ${J.name}</p>
      <div class="np-bar"><i></i></div>
      <p class="credit">원작의 사설로 부른 녹음이에요. 아래는 이 장면을 위해 새로 쓴 사설 — 같은 ${J.name} 장단에 얹어 부른다고 상상하며 들어 보세요. · ${audioCredit()}</p>
    </div>` : ''}
    <div class="chang-main">
      <div class="wheel-box">${wheelSVG(jangdan, 120)}<p class="jd-label"><b>${J.name}</b> ${J.beatsLabel}<br>${J.tempoWord}</p></div>
      <div class="lyrics static">
        <p class="lyrics-head">이 장면의 새 사설 <small>(창작 · ${esc(speakerName(scene, c.singer))}의 소리)</small></p>
        ${c.lines.map((l, li) => `<p class="lyric" data-line="${li}">${[...l].map((ch) => (ch === ' ' ? ' ' : `<span>${esc(ch)}</span>`)).join('')}</p>`).join('')}
      </div>
    </div>
    ${chuimsaeBar()}
    <p class="feedback" id="chang-fb">${guided ? '소리가 한 대목 맺히는 자리에 추임새 버튼이 반짝여요.' : '이번엔 안내 없이! 소리가 맺히는 자리에 추임새를 넣어 보세요.'}</p>
    ${jangdanOverride
      ? `<div class="why compare-q"><b>비교 감상</b> 이번엔 <b class="plain">${J.name}</b>(${J.tempoWord})의 실제 소리예요. 원래의 ${JANGDAN[c.jangdan].name}과 비교하면 이 장면의 느낌이 어떻게 달라질까요?</div>`
      : `<div class="why ${isAI ? 'ai' : ''}"><b>${isAI ? 'AI 창작 해석' : '연출 노트'}</b> ${esc(c.why || '')}</div>`}
    <div class="chang-actions">
      <button class="btn" id="replay">▶ 실제 소리 다시 듣기</button>
      <button class="btn" id="on-drum">🥁 새 사설을 북 장단에 얹어 보기</button>
      ${scene.compareJangdan && !jangdanOverride ? `<button class="btn" id="compare">${JANGDAN[scene.compareJangdan].name}로 바꿔 듣기</button>` : ''}
      ${jangdanOverride ? `<button class="btn" id="back-orig">원래 장단(${JANGDAN[c.jangdan].name})으로</button>` : ''}
      <button class="btn primary" id="chang-next">계속 ▸</button>
    </div>
  </div>`;
  S.stats.jangdan.add(jangdan);
  if (!jangdanOverride) S.stats.chang += 1;

  const wheel = $('.wheel', panel);
  const bar = $('.chuimsae-bar', panel);
  const fb = $('#chang-fb');
  const lyrics = $('.lyrics', panel);
  const progress = $('.np-bar i', panel);
  const tempo = J.bpm > 200 ? 'fast' : J.bpm < 80 ? 'slow' : 'mid';
  let windows = [];
  let hintTimers = [];

  const clearHints = () => {
    hintTimers.forEach(clearTimeout);
    hintTimers = [];
    bar.classList.remove('hint');
  };
  // 추임새 자리마다 버튼을 잠깐 반짝이게
  const scheduleHints = () => {
    if (!guided) return;
    const now = audio.ctx.currentTime;
    for (const [a, z] of windows) {
      if (z < now) continue;
      hintTimers.push(setTimeout(() => bar.classList.add('hint'), Math.max(0, (a - now) * 1000)));
      hintTimers.push(setTimeout(() => bar.classList.remove('hint'), (z - now) * 1000));
    }
  };
  const finished = () => {
    clearHints();
    S.stage.setSinging(false);
    $('#chang-next')?.classList.add('pulse');
    S.stats.changsHeard += 1;
  };
  const resetLyrics = () => {
    $$('.lyric span.on', panel).forEach((s) => s.classList.remove('on'));
    $$('.lyric.sung, .lyric.now', panel).forEach((s) => s.classList.remove('sung', 'now'));
  };

  // 실제 판소리 녹음
  const playSori = async () => {
    clearHints();
    lyrics.classList.add('static');
    resetLyrics();
    if (!track) return playDrum();
    S.stage.setSinging(true, c.singer === 'narrator' ? null : c.singer, tempo);
    try {
      const res = await audio.playTrack(track.file, {
        progress: (e) => (progress.style.width = `${e.ratio * 100}%`),
        end: finished,
        stopped: () => {
          clearHints();
          S.stage.setSinging(false);
        },
      });
      windows = res?.windows || [];
      scheduleHints();
    } catch {
      fb.textContent = '녹음을 불러오지 못해 북 장단으로 들려드려요.';
      playDrum();
    }
  };

  // 새 사설 + 실제 소리북 장단
  const playDrum = async () => {
    clearHints();
    lyrics.classList.remove('static');
    resetLyrics();
    if (progress) progress.style.width = '0';
    S.stage.setSinging(true, c.singer === 'narrator' ? null : c.singer, tempo);
    const res = await audio.playChang({ lines: c.lines, jangdan }, {
      step: (e) => {
        lightWheel(wheel, e.step);
        S.stage.beat(e.stroke);
      },
      lineStart: (e) => $$('.lyric', panel).forEach((p) => p.classList.toggle('now', +p.dataset.line === e.line)),
      syllable: (e) => $(`.lyric[data-line="${e.line}"]`, panel)?.querySelectorAll('span')[e.index]?.classList.add('on'),
      lineEnd: (e) => $(`.lyric[data-line="${e.line}"]`, panel)?.classList.add('sung'),
      end: finished,
      stopped: () => {
        clearHints();
        S.stage.setSinging(false);
      },
    });
    if (!res) {
      fb.textContent = '이 기기에서는 소리를 재생할 수 없어요. 사설을 읽으며 장단을 상상해 보세요.';
      lyrics.classList.add('static');
      return;
    }
    windows = res.windows;
    scheduleHints();
  };

  bindChuimsae(bar, () => windows, (good) => {
    fb.textContent = good ? '좋다! 소리가 맺히는 자리에 꼭 맞았어요.' : '소리를 가리지 않게, 한 대목이 맺히는 자리를 노려 보세요.';
  });
  $('#replay').onclick = playSori;
  $('#on-drum').onclick = playDrum;
  $('#compare')?.addEventListener('click', () => runChang(scene, scene.compareJangdan));
  $('#back-orig')?.addEventListener('click', () => runChang(scene));
  $('#chang-next').onclick = () => {
    clearHints();
    audio.stop();
    S.stage.setSinging(false);
    runLearn(scene);
  };
  playSori();
}

// 3) 해설
function runLearn(scene) {
  if (!scene.learn) return runChoose(scene);
  const panel = $('#panel');
  S.stats.cards.push(scene.learn);
  panel.innerHTML = `<div class="learn">${cardHTML(scene.learn)}
    <div class="chang-actions"><button class="btn primary" id="learn-next">${scene.ending ? '결말 보기 ▸' : '다음 이야기 고르기 ▸'}</button></div></div>`;
  $('#learn-next').onclick = () => {
    audio.stop();
    runChoose(scene);
  };
}

// 4) 선택
function runChoose(scene) {
  if (scene.ending) return results(scene);
  const panel = $('#panel');
  const ai = S.director.mode === 'ai';
  let choices = scene.choices;
  if (!choices.length) {
    choices = [
      { label: '지금 눈앞의 인물을 돕는다', hint: '관계가 바뀐다.' },
      { label: '숨겨진 사정을 캐 본다', hint: '새로운 정보를 얻는다.' },
      { label: '위험을 무릅쓰고 정면으로 맞선다', hint: '사건이 크게 움직인다.' },
    ];
  }
  const lg = S.director.ledger;
  const ledgerItems = [...lg.relationships, ...lg.items.map((x) => `가진 것: ${x}`), ...lg.unresolved.map((x) => `아직 풀리지 않음: ${x}`)];
  panel.innerHTML = `<div class="choose">
    <div class="part-label">${chip('선택', 'ink')} <span>다음 판을 정해 주세요</span></div>
    <div class="choice-list">
      ${choices.map((c, i) => `<button class="choice" data-i="${i}"><b>${esc(c.label)}</b>${c.hint ? `<span>${esc(c.hint)}</span>` : ''}</button>`).join('')}
    </div>
    ${ai ? `<form class="free" id="free"><input id="free-text" maxlength="80" placeholder="다른 행동 직접 적기 (예: 로봇 주인에게 연락한다)" aria-label="다른 행동 직접 적기"><button class="btn">이렇게 하기</button></form>` : ''}
    ${ledgerItems.length ? `<details class="ledger"><summary>지금까지의 기록</summary><ul>${ledgerItems.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></details>` : ''}
  </div>`;
  $$('.choice', panel).forEach((b) => (b.onclick = () => {
    const c = choices[+b.dataset.i];
    audio.sfx('select');
    S.stats.choices.push({ scene: scene.title, choice: c.label });
    nextScene({ type: 'choice', index: +b.dataset.i, text: c.label });
  }));
  $('#free')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = $('#free-text').value.trim();
    if (!text) return;
    S.stats.choices.push({ scene: scene.title, choice: `(직접) ${text}` });
    nextScene({ type: 'free', text });
  });
}

// ======================================================================
// 화면: 결말 + 체험 결과
// ======================================================================
function results(scene) {
  const w = WORKS[S.work];
  const st = S.stats;
  const e = scene.ending;
  const stageHTML = $('#stage').outerHTML;
  show(`
  <section class="results">
    <div class="stage-wrap small">${stageHTML}</div>
    <article class="card ending">
      <div class="card-kicker">${chip('새로운 판의 결말', 'red')}</div>
      <h2>${esc(e.title)}</h2>
      <p>${esc(e.summary)}</p>
    </article>
    <article class="card">
      <h3>원작과 달라진 점</h3>
      <div class="compare-cols">
        <div><p class="col-head">${chip('원작', 'red')}</p><p>${w.originalEnding}</p></div>
        <div><p class="col-head">${chip('내가 만든 판', 'ink')}</p><ul>${(e.changes.length ? e.changes : ['선택에 따라 새 결말에 이르렀어요']).map((c) => `<li>${esc(c)}</li>`).join('')}</ul></div>
      </div>
    </article>
    <article class="card">
      <h3>나의 선택</h3>
      <ol class="choice-log">${st.choices.map((c) => `<li><span>${esc(c.scene)}</span> → <b>${esc(c.choice)}</b></li>`).join('')}</ol>
    </article>
    <article class="card">
      <h3>이번 판에서 만난 국악</h3>
      <div class="stat-row">
        <div class="stat"><b>${st.chang}</b><span>창 대목</span></div>
        <div class="stat"><b>${st.aniri}</b><span>아니리</span></div>
        <div class="stat"><b>${st.jangdan.size}</b><span>장단</span></div>
        <div class="stat"><b>${st.good}/${st.chuimsae}</b><span>제자리 추임새</span></div>
      </div>
      <p class="muted">들은 장단을 눌러 다시 들어 보세요.</p>
      <div class="jd-chips">${[...st.jangdan].map((j) => `<button class="btn small" data-demo-jangdan="${j}">${JANGDAN[j].name} · ${JANGDAN[j].beatsLabel}</button>`).join('')}</div>
      ${st.chuimsae ? `<p class="muted">${st.good / st.chuimsae >= 0.5 ? '소리가 맺히는 자리를 잘 찾았어요. 훌륭한 귀명창이에요!' : '추임새는 소리를 가리지 않는 자리에 넣을 때 더 빛나요. 다음 판에서 다시 도전해 보세요.'}</p>` : '<p class="muted">다음 판에서는 추임새로 소리판에 참여해 보세요!</p>'}
    </article>
    ${st.cards.length ? `<details class="card"><summary><h3>다시 보는 해설 카드 (${st.cards.length})</h3></summary>${st.cards.map((c) => cardHTML(c, { compact: true })).join('')}</details>` : ''}
    <p class="disclaimer">이번 판의 사건·대사·창 사설은 ${S.director.mode === 'ai' ? 'AI가 여러분의 선택으로 새로 지은' : '미리 쓴'} <b>창작</b>이에요. "원작" 표시가 있는 내용만 실제 판소리의 이야기와 대목입니다. 창 부분에서 들은 실제 판소리는 원작 사설로 부른 녹음이고, 화면의 새 사설은 이번 판을 위해 쓴 창작이에요.</p>
    <div class="end-actions">
      <button class="btn primary big" id="again">같은 바탕, 다른 선택으로</button>
      <button class="btn big" id="other">다른 바탕 고르기</button>
    </div>
  </section>`, 'screen-results');
  $('#again').onclick = () => intro();
  $('#other').onclick = () => works();
}

// ======================================================================
// 화면: 이 소리판에 대하여 (기획 의도 · 출처 · AI 활용)
// ======================================================================
function about() {
  show(`
  <section class="about">
    <h2 class="title">이 소리판에 대하여</h2>
    <article class="card"><h3>기획 의도</h3>
      <p>국악을 처음 접하는 대학생이 판소리의 이야기를 직접 연출하며, 같은 상황도 소리와 장단의 표현에 따라 다르게 전달된다는 것을 경험하게 합니다. 과제 주제 「국악을 일상으로」에 맞춰, 휴대폰 하나로 5분 안에 소리판에 들어올 수 있게 만들었어요.</p></article>
    <article class="card"><h3>담은 국악 요소</h3>
      <ul><li><b>창과 아니리</b> — 매 장면이 말(아니리)과 노래(창)로 나뉘어 진행돼요.</li>
      <li><b>장단</b> — 진양조·중모리·중중모리·자진모리·휘모리·엇모리를 실제 소리북 녹음과 장단 원으로 보여 주고, 같은 장면을 다른 장단의 소리로 바꿔 들을 수 있어요.</li>
      <li><b>실제 소리</b> — 장면마다 같은 장단의 실제 판소리 녹음과 고수의 소리북 장단을 들려줘요.</li>
      <li><b>추임새</b> — 소리가 맺히는 자리에 맞춰 넣는 참여 체험.</li>
      <li><b>원작 대목</b> — 「사랑가」, 「범 내려온다」, 「박타령」 등 실제 대목의 맥락을 카드로 소개해요.</li></ul></article>
    <article class="card"><h3>원작과 창작의 구분</h3>
      <p>${chip('원작', 'red')} 표시는 실제 판소리의 줄거리·대목 정보, ${chip('검토된 국악 정보', 'verified')}는 자료로 확인해 미리 써 둔 설명입니다. 장면의 사건·대사·창 사설과 "AI 창작 해석"은 새로 만든 창작이에요. AI는 장단·대목의 사실을 지어내지 않도록, 미리 검토한 목록 안에서만 고르게 했습니다.</p></article>
    <article class="card"><h3>소리와 그림</h3>
      <p><b>원작 감상</b>과 <b>실제 소리북 장단</b>은 국립국악원 「국악 디지털 음원」의 악구 음원(공공누리 제1유형)을 이어 붙인 앞부분 발췌입니다. 새 이야기의 <b>창</b> 장면에서는 장면의 장단과 같은 장단의 실제 판소리 녹음(원작 사설)을 들려주고, 새로 쓴 사설은 자막으로 보여 주며 실제 소리북 장단 위에 얹어 볼 수 있습니다. 그림은 한지 질감·먹선·오방색을 살린 민화풍으로 배경·인물·표정·소품을 조합해 그립니다.</p></article>
    <article class="card"><h3>음원 출처</h3>
      <p class="muted">${audioCredit()} — 사용 목적: 비상업 · 교육용</p>
      <ul>${Object.values(PASSAGES).filter((p) => p.audio).map((p) => `<li>${WORKS[p.work].title} 「${esc(p.track)}」 — 창 ${esc(p.singer)}</li>`).join('')}
      ${SORI_TRACKS.filter((t) => !Object.values(PASSAGES).some((p) => p.audio === t.file)).map((t) => `<li>${WORKS[t.work].title} 「${esc(t.title)}」(${JANGDAN[t.jangdan].name}) — 창 ${esc(t.singer)}</li>`).join('')}
      <li>판소리 소리북 장단(진양·중모리·중중모리·자진모리·휘모리·엇모리)</li></ul></article>
    <article class="card"><h3>AI 활용 범위</h3>
      <p>${S.provider === 'anthropic' ? 'Anthropic의 Claude' : 'OpenAI의 GPT'}${S.model ? `(${esc(S.model)})` : ''}가 다음 장면의 사건·대사·창작 사설·무대 구성(배경·인물·표정)·장단 선택과 그 이유를 만듭니다. 선택 이력과 인물 관계 기록을 함께 보내 앞뒤가 맞게 이어지도록 했어요. AI 연결이 없거나 실패하면 미리 쓴 각본으로 진행됩니다. API 키는 서버에만 있고 브라우저로 전송되지 않아요.</p></article>
    <article class="card"><h3>참고 자료</h3>
      <ul>${SOURCES.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${s.label}</a></li>`).join('')}</ul>
      <p class="muted">장단의 박 구성과 대목의 장단은 판본(바디)과 소리꾼에 따라 다르게 부르기도 합니다. 체험용 북 패턴은 단순화한 것입니다.</p></article>
    <button class="btn primary" id="back">처음으로</button>
  </section>`, 'screen-about');
  $('#back').onclick = home;
}

// ======================================================================
// 발표 모드 — 큰 화면에 QR과 접속 주소, 대표 장면 시연
// ======================================================================
async function present() {
  // 발표용 컴퓨터에서 localhost로 열었다면, 휴대폰이 들어올 수 있는 같은 Wi-Fi 주소를 QR에 넣는다
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  const url = local && S.lan[0]
    ? `${location.protocol}//${S.lan[0]}${location.port ? `:${location.port}` : ''}${location.pathname}`
    : location.origin + location.pathname;
  show(`
  <section class="present">
    <div class="present-art">${miniScene({ background: 'gwanghallu', characters: ['chunhyang', 'heungbo', 'tokki'] })}</div>
    <div class="present-body">
      <h1 class="logo">Sorisketch<span>소리스케치</span></h1>
      <p class="sub">판을 바꾸다 — 내가 만드는 판소리 평행세계</p>
      <div class="qr" id="qr"></div>
      <p class="present-url">${esc(url)}</p>
      <p class="lead">휴대폰 카메라로 QR을 비추고, 소리를 켠 채 들어와 주세요.<br>함께 "얼씨구!" 하며 소리판을 만들어 봅시다.</p>
      <div class="end-actions"><button class="btn primary big" id="demo">대표 장면 시연 (수궁가)</button><button class="btn big" id="open">처음 화면</button></div>
    </div>
  </section>`, 'screen-present');
  $('#demo').onclick = () => {
    audio.ensure();
    S.work = 'sugung';
    S.setting = 'original';
    S.forceScript = true;
    resetStats();
    startStory();
  };
  $('#open').onclick = () => {
    history.replaceState(null, '', location.pathname);
    S.forceScript = false;
    home();
  };
  try {
    await loadScript('https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js');
    const qr = window.qrcode(0, 'M');
    qr.addData(url);
    qr.make();
    $('#qr').innerHTML = qr.createSvgTag({ cellSize: 8, margin: 2, scalable: true });
  } catch {
    $('#qr').textContent = 'QR을 불러오지 못했어요. 아래 주소로 접속해 주세요.';
  }
}
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

// ======================================================================
// 시작
// ======================================================================
function bindChrome() {
  $('#btn-home').onclick = () => {
    if (S.director && !confirm('처음 화면으로 돌아갈까요? 진행 중인 판은 사라져요.')) return;
    S.director = null;
    S.stage = null;
    S.forceScript = false;
    home();
  };
  $('#btn-mute').onclick = () => {
    prefs.muted = !prefs.muted;
    savePrefs();
    applyPrefs();
  };
  const dlg = $('#settings');
  $('#btn-settings').onclick = () => {
    $('#set-volume').value = prefs.volume;
    $('#set-tts').checked = prefs.tts;
    $('#set-large').checked = prefs.large;
    $('#set-guide').checked = prefs.guide;
    dlg.showModal();
  };
  $('#set-volume').oninput = (e) => {
    prefs.volume = +e.target.value;
    applyPrefs();
  };
  $('#set-tts').onchange = (e) => {
    prefs.tts = e.target.checked;
    if (!prefs.tts) stopSpeech();
  };
  $('#set-large').onchange = (e) => {
    prefs.large = e.target.checked;
    applyPrefs();
  };
  $('#set-guide').onchange = (e) => (prefs.guide = e.target.checked);
  dlg.addEventListener('close', savePrefs);
}

async function init() {
  bindChrome();
  applyPrefs();
  audio.loadCues();
  try {
    const res = await fetch('/api/status');
    const st = await res.json();
    S.ai = !!st.ai;
    S.model = st.model || '';
    S.lan = st.lan || [];
    S.provider = st.provider || '';
  } catch {
    S.ai = false; // 정적 호스팅만 된 경우 → 각본 모드
  }
  if (new URLSearchParams(location.search).has('present')) present();
  else if (location.hash === '#about') about();
  else home();
}

init();

// 무대 — 배경·인물·소품·효과를 겹쳐 한 장면을 만들고, 소리에 맞춰 움직인다.

import { backgroundSVG, propSVG } from './backgrounds.js';
import { characterSVG } from './characters.js';

const POS_X = { left: 22, center: 50, right: 78 };

export function miniScene({ background, characters = [], costume = 'traditional' }) {
  const n = characters.length;
  const xs = n === 1 ? [50] : n === 2 ? [32, 68] : [20, 50, 80];
  return `<div class="mini-scene">${backgroundSVG(background)}
    ${characters.map((id, i) => `<div class="mini-char" style="left:${xs[i]}%">${characterSVG(id, { expression: i === 0 ? 'happy' : 'neutral', costume })}</div>`).join('')}
    <div class="hanji"></div></div>`;
}

export class Stage {
  constructor(el) {
    this.el = el;
    el.innerHTML = `
      <div class="stage-camera">
        <div class="stage-bg"></div>
        <div class="stage-tint"></div>
        <div class="stage-props"></div>
        <div class="stage-chars"></div>
        <div class="stage-fx"></div>
      </div>
      <div class="hanji"></div>
      <div class="stage-burst" aria-live="polite"></div>`;
    this.camera = el.querySelector('.stage-camera');
    this.bg = el.querySelector('.stage-bg');
    this.tint = el.querySelector('.stage-tint');
    this.props = el.querySelector('.stage-props');
    this.chars = el.querySelector('.stage-chars');
    this.fx = el.querySelector('.stage-fx');
    this.burst = el.querySelector('.stage-burst');
    this.state = { background: null, costume: null, characters: new Map() };
  }

  render(stage) {
    // 배경: 바뀔 때만 교체(겹쳐서 서서히)
    if (stage.background !== this.state.background) {
      const layer = document.createElement('div');
      layer.className = 'bg-layer entering';
      layer.innerHTML = backgroundSVG(stage.background);
      this.bg.appendChild(layer);
      requestAnimationFrame(() => layer.classList.remove('entering'));
      const old = [...this.bg.children].slice(0, -1);
      setTimeout(() => old.forEach((o) => o.remove()), 900);
      this.state.background = stage.background;
    }
    this.tint.className = `stage-tint tint-${stage.tint}`;

    // 인물: id 기준으로 들어오고 나가고 표정을 바꾼다
    const costumeChanged = stage.costume !== this.state.costume;
    this.state.costume = stage.costume;
    const keep = new Set();
    for (const c of stage.characters) {
      keep.add(c.id);
      let node = this.state.characters.get(c.id);
      const fresh = !node;
      if (fresh) {
        node = document.createElement('div');
        node.className = 'char enter';
        node.dataset.id = c.id;
        node.innerHTML = `<div class="char-body"></div><div class="char-name"></div>`;
        this.chars.appendChild(node);
        this.state.characters.set(c.id, node);
        setTimeout(() => node.classList.remove('enter'), 50);
      }
      if (fresh || costumeChanged || node.dataset.expr !== c.expression) {
        node.querySelector('.char-body').innerHTML = characterSVG(c.id, { expression: c.expression, costume: stage.costume });
        node.dataset.expr = c.expression;
        if (!fresh) {
          node.classList.remove('react');
          void node.offsetWidth;
          node.classList.add('react');
        }
      }
      node.querySelector('.char-name').textContent = c.name;
      node.style.left = `${POS_X[c.position]}%`;
      node.classList.toggle('flip', c.position === 'right' && c.id === 'jebi');
      node.style.zIndex = c.position === 'center' ? 3 : 2;
    }
    for (const [id, node] of this.state.characters) {
      if (!keep.has(id)) {
        node.classList.add('leave');
        setTimeout(() => node.remove(), 600);
        this.state.characters.delete(id);
      }
    }

    // 소품
    this.props.innerHTML = stage.props
      .map((p, i) => `<div class="prop" style="left:${[36, 64, 50][i]}%;animation-delay:${i * 0.15}s">${propSVG(p)}</div>`)
      .join('');

    this.setEffect(stage.effect);
  }

  setEffect(effect) {
    this.fx.innerHTML = '';
    this.el.classList.toggle('fx-shake', effect === 'shake');
    if (effect === 'shake') setTimeout(() => this.el.classList.remove('fx-shake'), 900);
    const counts = { petals: 18, rain: 40, bubbles: 16, fire: 14, wind: 8, sparkle: 16, waves: 3, ink: 4 };
    const n = counts[effect] || 0;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      p.className = `fx fx-${effect}`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = effect === 'ink' || effect === 'sparkle' ? `${10 + Math.random() * 60}%` : '';
      p.style.animationDelay = `${(Math.random() * 4).toFixed(2)}s`;
      p.style.animationDuration = `${(effect === 'rain' ? 0.7 : 3 + Math.random() * 4).toFixed(2)}s`;
      if (effect === 'waves') p.style.top = `${60 + i * 12}%`;
      this.fx.appendChild(p);
    }
  }

  setSpeaker(id) {
    for (const [cid, node] of this.state.characters) {
      node.classList.toggle('speaking', cid === id);
      node.classList.toggle('dim', !!id && id !== 'narrator' && cid !== id);
    }
  }

  // 창이 시작되면 노래하는 인물(또는 장면 전체)을 천천히 당겨 보여 준다
  setSinging(on, singer, tempo = 'mid') {
    this.el.classList.toggle('singing', on);
    this.el.dataset.tempo = tempo;
    const node = singer && this.state.characters.get(singer);
    if (on && node) {
      const x = parseFloat(node.style.left) || 50;
      this.camera.style.transformOrigin = `${x}% 70%`;
    } else {
      this.camera.style.transformOrigin = '50% 70%';
    }
    for (const [cid, n] of this.state.characters) n.classList.toggle('singer', on && cid === singer);
  }

  // 북 한 번에 맞춰 살짝 들썩
  beat(stroke) {
    if (stroke !== 'D' && stroke !== 'K') return;
    this.el.classList.remove('beat');
    void this.el.offsetWidth;
    this.el.classList.add('beat');
  }

  chuimsae(word, good) {
    const s = document.createElement('span');
    s.className = `burst-word ${good ? 'good' : ''}`;
    s.textContent = word;
    s.style.left = `${18 + Math.random() * 64}%`;
    s.style.top = `${16 + Math.random() * 40}%`;
    s.style.setProperty('--rot', `${(Math.random() * 16 - 8).toFixed(1)}deg`);
    this.burst.appendChild(s);
    setTimeout(() => s.remove(), 1600);
    for (const n of this.state.characters.values()) {
      n.classList.remove('nod');
      void n.offsetWidth;
      n.classList.add('nod');
    }
  }
}

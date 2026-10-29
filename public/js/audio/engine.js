// 소리 엔진 (Web Audio)
// - 실제 소리: 국립국악원 「국악 디지털 음원」의 판소리 녹음(창)과 소리북 장단을 재생한다.
//   녹음의 악구가 바뀌는 시각(cues.json)을 알고 있어, 그 자리를 추임새 자리로 쓴다.
// - 새 사설 얹어 보기: 실제 소리북 한 바퀴를 끊김 없이 반복하며, 새 사설의 자막을 장단에 맞춰 흘린다.
// - 합성 북: 음원을 불러오지 못할 때만 쓰는 예비 소리.

import { JANGDAN } from '../data/gugak.js';

const BASE = 'assets/audio/';

export class SoriAudio {
  constructor() {
    this.ctx = null;
    this.volume = 0.8;
    this.muted = false;
    this.current = null;
    this.buffers = new Map();
    this.cues = { tracks: {}, drums: {} };
  }

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      this.master.connect(comp).connect(this.ctx.destination);
      this.master.gain.value = this.muted ? 0 : this.volume;
      this.noise = this.makeNoise();
    }
    if (this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }

  async loadCues() {
    try {
      this.cues = await fetch(`${BASE}cues.json`).then((r) => r.json());
    } catch {
      // 음원 정보가 없으면 합성 북으로만 동작
    }
    return this.cues;
  }

  setVolume(v) {
    this.volume = v;
    if (this.master) this.master.gain.setTargetAtTime(this.muted ? 0 : v, this.ctx.currentTime, 0.05);
    if (this.current?.audioEl) this.current.audioEl.volume = this.muted ? 0 : v;
  }

  setMuted(m) {
    this.muted = m;
    this.setVolume(this.volume);
  }

  makeNoise() {
    const len = this.ctx.sampleRate;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  async loadBuffer(file) {
    if (!this.buffers.has(file)) {
      const p = fetch(BASE + file)
        .then((r) => {
          if (!r.ok) throw new Error(`${file}: ${r.status}`);
          return r.arrayBuffer();
        })
        .then((ab) => new Promise((ok, no) => this.ctx.decodeAudioData(ab, ok, no)));
      this.buffers.set(file, p);
      p.catch(() => this.buffers.delete(file));
    }
    return this.buffers.get(file);
  }

  // 미리 받아 두기(장면이 시작되기 전에)
  preload(files) {
    if (!this.ensure()) return;
    files.filter(Boolean).forEach((f) => this.loadBuffer(f).catch(() => {}));
  }

  // ---------- 재생 버스 ----------
  newBus() {
    this.stop();
    const bus = this.ctx.createGain();
    bus.connect(this.master);
    return bus;
  }

  stop() {
    if (!this.current) return;
    const { bus, raf, audioEl } = this.current;
    cancelAnimationFrame(raf);
    if (bus) {
      const t = this.ctx.currentTime;
      bus.gain.cancelScheduledValues(t);
      bus.gain.setValueAtTime(bus.gain.value, t);
      bus.gain.linearRampToValueAtTime(0, t + 0.15);
      setTimeout(() => bus.disconnect(), 300);
    }
    if (audioEl) audioEl.pause();
    const done = this.current.onStop;
    this.current = null;
    if (done) done();
  }

  // 이벤트 목록을 화면 시간과 맞춰 돌린다
  runEvents(events, handlers, endTime) {
    events.sort((a, b) => a.time - b.time);
    let i = 0;
    const cur = this.current;
    const tick = () => {
      if (this.current !== cur) return;
      const now = this.ctx.currentTime;
      while (i < events.length && events[i].time <= now) {
        const e = events[i++];
        handlers[e.type]?.(e);
      }
      if (now >= endTime) {
        this.current = null;
        handlers.end?.();
        return;
      }
      cur.raf = requestAnimationFrame(tick);
    };
    cur.raf = requestAnimationFrame(tick);
  }

  play(buffer, t, bus, gain = 1, offset = 0) {
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    if (gain === 1) src.connect(bus);
    else {
      const g = this.ctx.createGain();
      g.gain.value = gain;
      src.connect(g).connect(bus);
    }
    src.start(t, offset);
    return src;
  }

  // ---------- 실제 판소리 녹음 ----------
  // handlers: { progress(e{ratio}), phrase(e{index}), end(), stopped() }
  // 반환: { duration, windows(추임새 자리, ctx 시간) }
  async playTrack(file, handlers = {}) {
    if (!this.ensure()) return null;
    const buffer = await this.loadBuffer(file);
    const bus = this.newBus();
    this.current = { bus, onStop: handlers.stopped };
    const t0 = this.ctx.currentTime + 0.08;
    this.play(buffer, t0, bus);
    const info = this.cues.tracks[file] || { duration: buffer.duration, phrases: [] };
    const phrases = info.phrases.filter((p) => p < buffer.duration);
    const events = phrases.map((p, index) => ({ type: 'phrase', time: t0 + p, index }));
    for (let k = 1; k <= 40; k++) events.push({ type: 'progress', time: t0 + (buffer.duration * k) / 40, ratio: k / 40 });
    this.runEvents(events, handlers, t0 + buffer.duration + 0.2);
    const windows = [...phrases, buffer.duration].map((p) => [t0 + p - 0.9, t0 + p + 0.5]);
    return { duration: buffer.duration, windows, startTime: t0 };
  }

  // ---------- 북 장단 위에 새 사설 얹기 ----------
  // 실제 소리북 한 바퀴(drum)를 반복하고, 줄마다 정해진 박 수만큼 자막을 흘린다.
  // handlers: { step(e), syllable(e), lineStart(e), lineEnd(e), end(), stopped() }
  async playChang({ lines, jangdan = 'jungmori' }, handlers = {}) {
    if (!this.ensure()) return null;
    const J = JANGDAN[jangdan];
    const drum = this.cues.drums[jangdan];
    let buffer = null;
    if (drum) {
      try {
        buffer = await this.loadBuffer(drum.file);
      } catch {
        buffer = null; // 아래에서 합성 북으로
      }
    }
    const bus = this.newBus();
    this.current = { bus, onStop: handlers.stopped };
    const ctx = this.ctx;

    // 실제 북 한 클립이 장단 몇 칸인지: 진양조 녹음은 한 각(6박), 나머지는 한 장단
    const stepsPerClip = jangdan === 'jinyang' ? 6 : J.pattern.length;
    const stepDur = buffer ? drum.cycle / stepsPerClip : 60 / J.bpm;
    const clipDur = stepsPerClip * stepDur;

    // 들어가는 북: 2초 이상, 클립(또는 묶음) 경계에 맞춤. 한 바퀴가 긴 장단(중모리·진양조)은 뒤쪽 반 바퀴만 들려준다.
    let introSteps = 0;
    let skip = 0;
    if (buffer) {
      introSteps = stepsPerClip * Math.max(1, Math.ceil(1.8 / clipDur));
      if (clipDur > 8) skip = stepsPerClip / 2;
    } else for (let gi = 0; introSteps * stepDur < 1.8; ) introSteps += J.groups[gi++ % J.groups.length];

    const t0 = ctx.currentTime + 0.12;
    const lineDur = J.stepsPerLine * stepDur;
    const singStart = t0 + (introSteps - skip) * stepDur;
    const totalSteps = introSteps + J.stepsPerLine * lines.length;
    const endT = t0 + (totalSteps - skip) * stepDur;
    const events = [];

    if (buffer) {
      this.play(buffer, t0, bus, 1, skip * stepDur);
      for (let t = t0 + (stepsPerClip - skip) * stepDur; t < endT - 0.01; t += clipDur) this.play(buffer, t, bus);
      this.drum('D', endT, bus, 0.9); // 맺는 북
    }
    for (let s = skip; s < totalSteps; s++) {
      const stroke = J.pattern[s % J.pattern.length];
      const t = t0 + (s - skip) * stepDur;
      if (!buffer && stroke !== '-') this.drum(stroke, t, bus, s % J.pattern.length === 0 ? 1 : 0.8);
      events.push({ type: 'step', time: t, step: s % J.pattern.length, stroke });
    }
    if (!buffer) this.drum('D', endT, bus, 1);
    events.push({ type: 'step', time: endT, step: 0, stroke: 'D', final: true });

    const windows = [];
    lines.forEach((line, li) => {
      const chars = [...line.replace(/\s+/g, '')];
      const ls = singStart + li * lineDur;
      events.push({ type: 'lineStart', time: ls, line: li });
      const n = chars.length || 1;
      const span = lineDur * 0.72;
      chars.forEach((_, k) => events.push({ type: 'syllable', time: ls + (k / Math.max(1, n - 1)) * span, line: li, index: k }));
      windows.push([ls + lineDur * 0.78, ls + lineDur + 0.35]);
      events.push({ type: 'lineEnd', time: ls + lineDur * 0.78, line: li });
    });

    this.runEvents(events, handlers, endT + 0.8);
    return { duration: endT - t0, windows, startTime: t0, stepDur, real: !!buffer };
  }

  // ---------- 장단만 듣기 ----------
  async playJangdan(jangdan, cycles = 2, handlers = {}) {
    return this.playChang({ lines: Array(cycles).fill(''), jangdan }, handlers);
  }

  // 합성 북(예비): D=덩, K=쿵, T=딱, t=약한 딱
  drum(stroke, t, bus, vel = 1) {
    const ctx = this.ctx;
    const out = bus || this.master;
    if (stroke === 'D' || stroke === 'K') {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.frequency.setValueAtTime(stroke === 'D' ? 120 : 105, t);
      o.frequency.exponentialRampToValueAtTime(52, t + 0.25);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.9 * vel, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      o.connect(g).connect(out);
      o.start(t);
      o.stop(t + 0.6);
    }
    if (stroke === 'D' || stroke === 'T' || stroke === 't') {
      const n = ctx.createBufferSource();
      n.buffer = this.noise;
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 2100;
      f.Q.value = 2.2;
      const g = ctx.createGain();
      g.gain.setValueAtTime((stroke === 't' ? 0.35 : 0.75) * vel, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
      n.connect(f).connect(g).connect(out);
      n.start(t, Math.random() * 0.5, 0.08);
    }
  }

  // ---------- 효과음 ----------
  sfx(kind) {
    if (!this.ensure()) return;
    const t = this.ctx.currentTime + 0.01;
    if (kind === 'chuimsae') {
      this.drum('T', t, this.master, 0.9);
      this.drum('K', t + 0.09, this.master, 0.5);
    } else if (kind === 'good') {
      this.drum('D', t, this.master, 0.9);
    } else if (kind === 'select') {
      this.drum('t', t, this.master, 0.8);
    } else if (kind === 'page') {
      this.drum('K', t, this.master, 0.5);
    }
  }
}

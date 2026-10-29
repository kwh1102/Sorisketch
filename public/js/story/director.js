// 이야기 진행 관리 — AI 모드(서버의 Claude)와 각본 모드를 같은 방식으로 다룬다.
// 선택 이력·기록(ledger)·보여 준 해설 카드를 들고 있다가 다음 장면 요청에 함께 보낸다.

import { WORKS } from '../data/works.js';
import { normalizeScene } from './schema.js';
import { pickScript } from './scripts.js';

const COSTUME = { original: 'traditional', campus: 'modern', company: 'modern', future: 'future', custom: 'modern' };

export class Director {
  constructor({ work, setting, customSetting = '', ai = false }) {
    this.work = work;
    this.setting = setting;
    this.customSetting = customSetting;
    this.mode = ai ? 'ai' : 'script';
    this.totalScenes = ai ? 5 : 4;
    this.sceneIndex = 0;
    this.history = [];
    this.ledger = { relationships: [], items: [], unresolved: [], facts: [] };
    this.shownCards = [];
    this.flags = {};
    this.current = null;
    this.script = pickScript(work, setting);
  }

  get isScriptSettingExact() {
    return this.script.exact;
  }

  normalize(raw) {
    const w = WORKS[this.work];
    return normalizeScene(raw, {
      workCharacters: w.characters,
      defaultBackground: w.cover.background,
      costume: COSTUME[this.mode === 'script' ? this.script.setting : this.setting],
    });
  }

  // action: { type: 'choice', index, text } | { type: 'free', text } | null(첫 장면)
  async next(action = null) {
    const nextIndex = this.sceneIndex + 1;
    let scene;
    if (this.mode === 'ai') {
      scene = await this.fromAI(nextIndex, action);
    } else {
      scene = this.fromScript(nextIndex, action);
    }
    this.commit(scene, action);
    return scene;
  }

  async fromAI(index, action) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 70_000);
    try {
      const res = await fetch('/api/story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: ctrl.signal,
        body: JSON.stringify({
          work: this.work,
          setting: this.setting,
          customSetting: this.customSetting,
          totalScenes: this.totalScenes,
          sceneIndex: index,
          history: this.history,
          ledger: this.ledger,
          action: action ? { type: action.type, text: action.text } : null,
          shownCards: this.shownCards,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.scene) throw new Error(data.error || 'AI 응답 오류');
      return this.normalize(data.scene);
    } finally {
      clearTimeout(timer);
    }
  }

  fromScript(index, action) {
    if (action && action.type === 'choice' && this.current?.choiceKeys) {
      this.flags[`s${index - 1}`] = this.current.choiceKeys[action.index];
    }
    const steps = this.script.steps;
    const step = steps[Math.min(index, steps.length) - 1];
    const raw = step(this.flags);
    const scene = this.normalize(raw);
    scene.choiceKeys = raw.choices.map((c) => c.key);
    return scene;
  }

  // AI가 실패했을 때: 지금 위치에서 각본으로 이어 간다
  switchToScript() {
    this.mode = 'script';
    this.totalScenes = this.script.steps.length;
    // 각본의 다음 장면 번호에 맞춘다
    this.sceneIndex = Math.min(this.sceneIndex, this.totalScenes - 1);
  }

  commit(scene, action) {
    if (action && this.history.length) this.history[this.history.length - 1].choice = action.text;
    this.sceneIndex += 1;
    this.history.push({ title: scene.title, summary: scene.summary, choice: '', jangdan: scene.chang?.jangdan || '' });
    const lg = scene.ledger;
    if (lg.relationships.length || lg.items.length || lg.unresolved.length || lg.facts.length) {
      if (this.mode === 'ai') this.ledger = lg;
      else {
        // 각본은 장면마다 새로 생긴 항목만 적으므로 합친다
        for (const k of Object.keys(this.ledger)) this.ledger[k] = [...new Set([...this.ledger[k], ...lg[k]])].slice(-8);
      }
    }
    if (scene.learn) this.shownCards.push(`${scene.learn.type}:${scene.learn.id}`);
    this.current = scene;
  }

  get isLast() {
    return !!this.current?.ending;
  }
}

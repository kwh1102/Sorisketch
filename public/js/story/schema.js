// 장면(scene) 데이터의 모양과 정리 함수. 서버(AI 응답 검증)와 브라우저(각본 모드)가 함께 쓴다.
//
// scene = {
//   title, summary,
//   stage:  { background, tint, costume, characters: [{ id, name, expression, position }], props, effect },
//   aniri:  [{ speaker, text }],                  // 말로 이어 가는 부분
//   chang:  { lines, jangdan, jo, singer, why } | null,   // 장단에 얹는 창(창작 사설)
//   compareJangdan, learn: { type, id } | null,
//   choices: [{ id, label, hint }],
//   ledger: { relationships, items, unresolved, facts },
//   ending: { title, summary, changes } | null,
// }

import { JANGDAN_IDS, JO_IDS, ELEMENT_IDS, PASSAGE_IDS } from '../data/gugak.js';
import {
  CHARACTERS, CHARACTER_IDS, BACKGROUND_IDS, TINTS, PROP_IDS, EFFECT_IDS, EXPRESSIONS, POSITIONS,
} from '../data/works.js';

const str = (v, max = 400, fallback = '') => (typeof v === 'string' ? v.trim().slice(0, max) : fallback);
const pick = (v, allowed, fallback) => (allowed.includes(v) ? v : fallback);
const strList = (v, maxItems, maxLen) =>
  (Array.isArray(v) ? v : []).map((s) => str(s, maxLen)).filter(Boolean).slice(0, maxItems);

export function normalizeScene(raw, { workCharacters = [], defaultBackground = 'village', costume = 'traditional' } = {}) {
  const r = raw && typeof raw === 'object' ? raw : {};
  const st = r.stage && typeof r.stage === 'object' ? r.stage : {};

  const usedPositions = new Set();
  const characters = (Array.isArray(st.characters) ? st.characters : [])
    .filter((c) => c && CHARACTER_IDS.includes(c.id))
    .slice(0, 3)
    .map((c, i) => {
      let position = pick(c.position, POSITIONS, POSITIONS[i] || 'center');
      if (usedPositions.has(position)) position = POSITIONS.find((p) => !usedPositions.has(p)) || position;
      usedPositions.add(position);
      return {
        id: c.id,
        name: str(c.name, 20) || CHARACTERS[c.id].name,
        expression: pick(c.expression, EXPRESSIONS, 'neutral'),
        position,
      };
    });
  if (!characters.length && workCharacters[0]) {
    characters.push({ id: workCharacters[0], name: CHARACTERS[workCharacters[0]].name, expression: 'neutral', position: 'center' });
  }

  const speakerIds = new Set(['narrator', ...characters.map((c) => c.id)]);
  const aniri = (Array.isArray(r.aniri) ? r.aniri : [])
    .map((a) => ({ speaker: speakerIds.has(a?.speaker) ? a.speaker : 'narrator', text: str(a?.text, 260) }))
    .filter((a) => a.text)
    .slice(0, 5);
  if (!aniri.length) aniri.push({ speaker: 'narrator', text: str(r.summary, 260) || '이야기가 이어집니다.' });

  let chang = null;
  if (r.chang && typeof r.chang === 'object') {
    const lines = strList(r.chang.lines, 4, 40);
    if (lines.length) {
      chang = {
        lines,
        jangdan: pick(r.chang.jangdan, JANGDAN_IDS, 'jungmori'),
        jo: pick(r.chang.jo, JO_IDS, 'gyemyeon'),
        singer: speakerIds.has(r.chang.singer) ? r.chang.singer : 'narrator',
        why: str(r.chang.why, 200),
      };
    }
  }

  let learn = null;
  if (r.learn && typeof r.learn === 'object') {
    const t = r.learn.type;
    if (t === 'element' && ELEMENT_IDS.includes(r.learn.id)) learn = { type: t, id: r.learn.id };
    if (t === 'passage' && PASSAGE_IDS.includes(r.learn.id)) learn = { type: t, id: r.learn.id };
    if (t === 'jangdan' && JANGDAN_IDS.includes(r.learn.id)) learn = { type: t, id: r.learn.id };
    if (t === 'jo' && JO_IDS.includes(r.learn.id)) learn = { type: t, id: r.learn.id };
  }

  const isEnding = !!(r.ending && typeof r.ending === 'object' && str(r.ending.title));
  const choices = isEnding
    ? []
    : (Array.isArray(r.choices) ? r.choices : [])
        .map((c, i) => ({ id: 'abc'[i] || String(i), label: str(c?.label, 90), hint: str(c?.hint, 90) }))
        .filter((c) => c.label)
        .slice(0, 3);

  const lg = r.ledger && typeof r.ledger === 'object' ? r.ledger : {};

  return {
    title: str(r.title, 40) || '이어지는 판',
    summary: str(r.summary, 200),
    stage: {
      background: pick(st.background, BACKGROUND_IDS, defaultBackground),
      tint: pick(st.tint, TINTS, 'day'),
      costume: pick(st.costume, ['traditional', 'modern', 'future'], costume),
      characters,
      props: (Array.isArray(st.props) ? st.props : []).filter((p) => PROP_IDS.includes(p)).slice(0, 3),
      effect: pick(st.effect, EFFECT_IDS, 'none'),
    },
    aniri,
    chang,
    compareJangdan: chang ? pick(r.compareJangdan, JANGDAN_IDS.filter((j) => j !== chang.jangdan), null) : null,
    learn,
    choices,
    ledger: {
      relationships: strList(lg.relationships, 8, 120),
      items: strList(lg.items, 8, 80),
      unresolved: strList(lg.unresolved, 6, 120),
      facts: strList(lg.facts, 10, 140),
    },
    ending: isEnding
      ? { title: str(r.ending.title, 40), summary: str(r.ending.summary, 400), changes: strList(r.ending.changes, 4, 160) }
      : null,
  };
}

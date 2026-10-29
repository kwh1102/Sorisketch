// AI 이야기 생성 — OpenAI(GPT) 또는 Anthropic(Claude)이 다음 장면을 "구조화된 JSON"으로 만든다.
// 서버에서만 실행되므로 API 키는 브라우저에 노출되지 않는다.
// 두 공급자 모두 같은 프롬프트·같은 출력 스키마를 쓰고, 결과는 normalizeScene()으로 똑같이 검증한다.

import Anthropic from '@anthropic-ai/sdk';
import { betaZodOutputFormat } from '@anthropic-ai/sdk/helpers/beta/zod';
import OpenAI from 'openai';
import { zodTextFormat } from 'openai/helpers/zod';
import * as z from 'zod/v4';

import { JANGDAN, JANGDAN_IDS, JO, JO_IDS, ELEMENT_CARDS, ELEMENT_IDS, PASSAGES, PASSAGE_IDS } from '../public/js/data/gugak.js';
import {
  WORKS, WORK_IDS, CHARACTERS, CHARACTER_IDS, SETTINGS, BACKGROUNDS, BACKGROUND_IDS, TINTS,
  PROPS, PROP_IDS, EFFECTS, EFFECT_IDS, EXPRESSIONS, POSITIONS,
} from '../public/js/data/works.js';
import { normalizeScene } from '../public/js/story/schema.js';

// 발표 중 대기 시간을 줄이기 위해 생성 노력 수준은 기본 low
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-opus-5-5';
const CLAUDE_EFFORT = process.env.CLAUDE_EFFORT || 'low';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5.4-mini';
const OPENAI_EFFORT = process.env.OPENAI_REASONING_EFFORT ?? 'low'; // 빈 값이면 reasoning 설정을 보내지 않음(추론 모델이 아닐 때)

// AI_PROVIDER로 직접 고르거나, 없으면 있는 키로 고른다(둘 다 있으면 OpenAI 우선).
function provider() {
  const p = (process.env.AI_PROVIDER || '').toLowerCase();
  if (p === 'openai' || p === 'anthropic') return p;
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN) return 'anthropic';
  return null;
}

let anthropic = null;
let openai = null;
const getAnthropic = () => (anthropic ||= new Anthropic({ timeout: 60_000, maxRetries: 1 }));
const getOpenAI = () => (openai ||= new OpenAI({ timeout: 60_000, maxRetries: 1 }));

export function aiStatus() {
  const p = provider();
  return {
    ai: !!p && process.env.SORISKETCH_OFFLINE !== '1',
    provider: p,
    model: p === 'openai' ? OPENAI_MODEL : p === 'anthropic' ? CLAUDE_MODEL : '',
  };
}

// ---------- 출력 스키마 ----------
const SceneSchema = z.object({
  title: z.string(),
  summary: z.string(),
  stage: z.object({
    background: z.enum(BACKGROUND_IDS),
    tint: z.enum(TINTS),
    costume: z.enum(['traditional', 'modern', 'future']),
    characters: z.array(z.object({
      id: z.enum(CHARACTER_IDS),
      name: z.string(),
      expression: z.enum(EXPRESSIONS),
      position: z.enum(POSITIONS),
    })),
    props: z.array(z.enum(PROP_IDS)),
    effect: z.enum(EFFECT_IDS),
  }),
  aniri: z.array(z.object({ speaker: z.string(), text: z.string() })),
  chang: z.object({
    lines: z.array(z.string()),
    jangdan: z.enum(JANGDAN_IDS),
    jo: z.enum(JO_IDS),
    singer: z.string(),
    why: z.string(),
  }).nullable(),
  compareJangdan: z.enum(JANGDAN_IDS).nullable(),
  learn: z.object({ type: z.enum(['element', 'passage', 'jangdan', 'jo']), id: z.string() }).nullable(),
  choices: z.array(z.object({ label: z.string(), hint: z.string() })),
  ledger: z.object({
    relationships: z.array(z.string()),
    items: z.array(z.string()),
    unresolved: z.array(z.string()),
    facts: z.array(z.string()),
  }),
  ending: z.object({ title: z.string(), summary: z.string(), changes: z.array(z.string()) }).nullable(),
});

// ---------- 시스템 프롬프트 (모든 요청에서 동일 → 프롬프트 캐시 대상) ----------
function catalogText() {
  const works = WORK_IDS.map((id) => {
    const w = WORKS[id];
    const cast = w.characters.map((c) => `${c}(${CHARACTERS[c].name}: ${CHARACTERS[c].role})`).join(', ');
    return `- ${id} 「${w.title}」 원작 줄거리: ${w.premise} / 원작 결말: ${w.originalEnding} / 인물: ${cast} / 관련 원작 대목 카드: ${w.passages.join(', ')}`;
  }).join('\n');
  const extras = CHARACTER_IDS.filter((c) => CHARACTERS[c].extra).map((c) => `${c}(${CHARACTERS[c].role})`).join(', ');
  const jangdan = JANGDAN_IDS.map((j) => `- ${j} ${JANGDAN[j].name}: ${JANGDAN[j].beatsLabel}, ${JANGDAN[j].tempoWord}. ${JANGDAN[j].summary}`).join('\n');
  const jo = JO_IDS.map((j) => `- ${j} ${JO[j].name}: ${JO[j].summary}`).join('\n');
  const elements = ELEMENT_IDS.map((e) => `${e}(${ELEMENT_CARDS[e].title})`).join(', ');
  const passages = PASSAGE_IDS.map((p) => `${p}(${WORKS[PASSAGES[p].work].title} 「${PASSAGES[p].title}」)`).join(', ');
  const list = (o) => Object.entries(o).map(([k, v]) => `${k}=${v}`).join(', ');
  return `## 작품
${works}

## 보조 인물(새 배경에서 이름을 붙여 쓸 수 있음)
${extras}

## 배경 그림 id
${list(BACKGROUNDS)}

## 소품 id
${list(PROPS)}

## 화면 효과 id
${list(EFFECTS)}

## 표정 id
${EXPRESSIONS.join(', ')}

## 장단 (검토된 설명 — 이 범위를 벗어난 사실을 지어내지 말 것)
${jangdan}

## 조
${jo}

## 해설 카드 id
- element: ${elements}
- passage: ${passages}
- jangdan: ${JANGDAN_IDS.join(', ')}
- jo: ${JO_IDS.join(', ')}`;
}

const SYSTEM = `너는 "Sorisketch"라는 그림 기반 인터랙티브 판소리 웹사이트의 소리판 연출가다.
국악을 처음 접하는 대학생이 휴대폰으로 판소리 다섯 바탕 중 하나를 골라, 자신의 선택으로 새롭게 펼쳐지는 "평행세계 판소리"를 그림·소리·자막으로 경험한다.
너는 매 요청마다 다음 장면 하나를 JSON으로 만든다. 화면은 이 JSON으로 그림을 조합하고, 창 부분은 장단과 함께 합성 가락으로 재생한다.

# 장면 구성
- aniri: 말로 이어 가는 부분. 1~4줄. 한 줄은 1~2문장, 짧고 쉬운 한국어. speaker는 "narrator"(소리꾼의 해설) 또는 stage.characters에 있는 인물 id. 판소리 아니리처럼 "~하것다", "이때 ~" 같은 말맛을 가볍게 섞되 읽기 쉽게.
- chang: 감정이 커지거나 장면을 그려 내는 순간을 창작 사설로 노래한다. 2~4줄, 한 줄은 7~13자 정도의 4·4조 느낌. 이 사설은 목소리로 불리므로 반드시 어절마다 띄어 쓴다(좋은 예: "푸른 물결 넘실넘실", 나쁜 예: "푸른물결넘실넘실"). 결말 장면이 아니라면 거의 모든 장면에 넣는다. singer는 "narrator" 또는 등장인물 id.
- chang.jangdan: 그 장면의 극적 속도와 호흡을 기준으로 고른다. 감정 하나에 장단 하나를 기계적으로 대응시키지 말고, 장면에서 무엇이 얼마나 빠르게 벌어지는지, 사설을 얼마나 또렷하게 들려줘야 하는지로 판단한다. 직전 장면들과 같은 장단만 반복하지 말고 이야기 전체에서 여러 장단을 경험하게 한다.
- chang.why: "이 장면에서는 …"으로 시작해, 왜 이 장단(빠르기·박 구조)이 이 장면에 어울리는지 1~2문장으로 쓴다. 이것은 화면에 "AI 창작 해석"으로 표시된다. 역사적 사실이나 명창·판본에 관한 주장은 쓰지 않는다.
- compareJangdan: 같은 사설을 다른 장단으로 다시 들어 보는 비교 감상용. 대비가 뚜렷한 장단 하나(예: 느린 장단 ↔ 빠른 장단) 또는 null.
- learn: 이 장면 직후 보여 줄 해설 카드 하나. 이미 보여 준 카드(shownCards)는 피한다. 첫 장면에서는 element:pansori나 그 작품의 passage를 권장. 원작과 이어지는 상황이면 해당 작품의 passage, 창이 처음 나오면 element:chang 또는 aniri, 추임새가 어울리는 흥겨운 장면이면 element:chuimsae.
- stage: 배경·시간대(tint)·의상(costume)·인물 최대 3명(위치가 겹치지 않게)·소품 최대 3개·효과 하나. 반드시 카탈로그 id만 쓴다. 새 배경에서는 원작 인물을 그 세계의 역할로 재해석하고, characters[].name에 그 세계에서의 호칭을 쓸 수 있다(예: "토끼 인턴"). 보조 인물이 필요하면 extra_* id에 name을 붙인다.
- choices: 결말이 아니면 정확히 3개. 말투나 분위기만 다른 선택지는 금지. 각 선택은 인물의 행동·목표, 인물 관계, 사건의 결과, 얻고 잃는 정보·물건·기회 중 적어도 하나를 실제로 바꾼다. 세 선택은 서로 다른 방향이어야 한다. label은 행동(25자 안팎), hint는 그 선택이 무엇을 걸게 되는지 한 문장.
- ledger: 지금까지의 인물 관계, 가진 물건·정보, 미해결 문제, 확정된 사실을 갱신한 전체 목록(각 짧은 문장). 다음 장면들은 이 기록과 모순되면 안 된다.
- summary: 이번 장면에서 벌어진 일을 한 문장으로.

# 이야기 원칙
- 원작은 출발점일 뿐 결말을 강제하지 않는다. 원작 배경을 유지해도 사용자의 선택에 따라 전혀 다른 전개와 결말로 갈 수 있다.
- 배경을 바꾼 경우 인물의 역할과 갈등을 그 세계에 맞게 재해석하되 원작의 인물 성격과 갈등의 씨앗은 살린다.
- 사용자의 직전 행동을 반드시 반영하고, 그 결과가 화면에 분명히 드러나게 한다. 이전 선택을 기억해 보상·갈등·관계에 반영한다.
- 이미 일어난 사건과 비슷한 사건을 되풀이하지 않는다. 매 장면 새로운 정보나 전환을 하나 이상 넣는다.
- sceneIndex가 totalScenes에 가까워지면 미해결 문제를 모아 절정으로 몰고 가고, sceneIndex가 totalScenes이면 반드시 결말 장면을 만든다: ending에 제목, 결말 요약(3~4문장), 원작과 달라진 점 2~4개(changes)를 쓰고 choices는 빈 배열. 결말 장면에도 마무리 창을 넣는다.
- 사용자가 직접 입력한 행동은 현재 세계와 인물 상황에 맞게 자연스럽게 해석한다. 이야기와 무관하거나 부적절한 입력은 이야기 안에서 재치 있게 다른 방향으로 돌린다.
- 수업 발표에서 함께 보는 콘텐츠다. 폭력·성적 묘사는 원작 수준 이하로 절제하고, 특정 실존 인물이나 집단을 비하하지 않는다.
- 국악 정보(장단의 박 수·빠르기, 대목의 원래 맥락)는 아래 카탈로그에 적힌 범위에서만 언급한다. 모르는 사실을 지어내지 않는다.

# 카탈로그
${catalogText()}`;

// ---------- 입력 정리 ----------
const s = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');
const sl = (v, items, n) => (Array.isArray(v) ? v : []).map((x) => s(x, n)).filter(Boolean).slice(0, items);

export function sanitizeRequest(body) {
  const b = body && typeof body === 'object' ? body : {};
  const work = WORK_IDS.includes(b.work) ? b.work : null;
  if (!work) throw new BadRequest('작품을 다시 선택해 주세요.');
  const setting = SETTINGS[b.setting] ? b.setting : 'original';
  const totalScenes = Math.min(7, Math.max(3, Number.parseInt(b.totalScenes, 10) || 5));
  const sceneIndex = Math.min(totalScenes, Math.max(1, Number.parseInt(b.sceneIndex, 10) || 1));
  const history = (Array.isArray(b.history) ? b.history : []).slice(-8).map((h) => ({
    title: s(h?.title, 40), summary: s(h?.summary, 200), choice: s(h?.choice, 120), jangdan: s(h?.jangdan, 20),
  }));
  const lg = b.ledger && typeof b.ledger === 'object' ? b.ledger : {};
  const action = b.action && typeof b.action === 'object'
    ? { type: b.action.type === 'free' ? 'free' : 'choice', text: s(b.action.text, 80) }
    : null;
  return {
    work,
    setting,
    customSetting: setting === 'custom' ? s(b.customSetting, 60) : '',
    totalScenes,
    sceneIndex,
    history,
    ledger: {
      relationships: sl(lg.relationships, 8, 120), items: sl(lg.items, 8, 80),
      unresolved: sl(lg.unresolved, 6, 120), facts: sl(lg.facts, 10, 140),
    },
    action: sceneIndex > 1 ? action : null,
    shownCards: sl(b.shownCards, 20, 40),
  };
}

export class BadRequest extends Error {}

function userPrompt(req) {
  const w = WORKS[req.work];
  const setting = req.setting === 'custom'
    ? `사용자가 정한 새 배경: "${req.customSetting || '자유로운 새 세계'}" (costume은 이 세계에 맞게 고를 것)`
    : req.setting === 'original'
      ? '원작 배경 유지 (costume: traditional). 배경은 그대로 두고 사건의 흐름만 바꾼다.'
      : `새 배경: ${SETTINGS[req.setting].name} — ${SETTINGS[req.setting].desc} (기본 costume: ${SETTINGS[req.setting].costume})`;
  const history = req.history.length
    ? req.history.map((h, i) => `${i + 1}. [${h.title}] ${h.summary}${h.choice ? ` → 사용자의 선택: ${h.choice}` : ''}${h.jangdan ? ` (창 장단: ${h.jangdan})` : ''}`).join('\n')
    : '(아직 없음 — 이번이 첫 장면이다)';
  const action = req.action
    ? `${req.action.type === 'free' ? '사용자가 직접 입력한 행동' : '사용자가 고른 선택지'}: "${req.action.text}"`
    : '첫 장면: 세계와 인물, 갈등의 씨앗을 소개하고 첫 선택을 제시한다.';
  return `작품: ${w.title} (${req.work})
배경: ${setting}
장면 번호: ${req.sceneIndex} / ${req.totalScenes}${req.sceneIndex === req.totalScenes ? ' — 이번이 결말 장면이다.' : ''}

지금까지의 이야기:
${history}

기록(ledger):
${JSON.stringify(req.ledger)}

이미 보여 준 해설 카드: ${req.shownCards.join(', ') || '없음'}

이번 입력 — ${action}

다음 장면을 만들어라.`;
}

// ---------- 생성 ----------
async function fromClaude(prompt) {
  const response = await getAnthropic().beta.messages.parse({
    model: CLAUDE_MODEL,
    max_tokens: 6000,
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    output_config: { effort: CLAUDE_EFFORT, format: betaZodOutputFormat(SceneSchema) },
    system: [{ type: 'text', text: SYSTEM, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: prompt }],
  });
  if (response.stop_reason === 'refusal') throw new Error('AI가 이 장면을 만들지 않았습니다.');
  if (response.stop_reason === 'max_tokens' || !response.parsed_output) throw new Error('AI 응답이 완성되지 않았습니다.');
  return response.parsed_output;
}

async function fromOpenAI(prompt, model = OPENAI_MODEL) {
  const started = Date.now();
  const response = await getOpenAI().responses.parse({
    model,
    instructions: SYSTEM,
    input: prompt,
    max_output_tokens: 8000,
    ...(OPENAI_EFFORT ? { reasoning: { effort: OPENAI_EFFORT } } : {}),
    text: { format: zodTextFormat(SceneSchema, 'scene') },
  });
  // 비용 확인용 한 줄 기록 (입력 중 캐시된 토큰은 할인됨)
  const u = response.usage;
  if (u) {
    console.log(`[story] ${model} 입력 ${u.input_tokens}(캐시 ${u.input_tokens_details?.cached_tokens ?? 0}) 출력 ${u.output_tokens}(추론 ${u.output_tokens_details?.reasoning_tokens ?? 0}) ${((Date.now() - started) / 1000).toFixed(1)}초`);
  }
  if (response.status === 'incomplete' || !response.output_parsed) throw new Error('AI 응답이 완성되지 않았습니다.');
  return response.output_parsed;
}

// 모델 비교용: scripts/compare-models.mjs에서 사용
export async function generateRawWithOpenAI(body, model) {
  return fromOpenAI(userPrompt(sanitizeRequest(body)), model);
}

export async function generateScene(body) {
  const req = sanitizeRequest(body);
  const prompt = userPrompt(req);
  const raw = provider() === 'openai' ? await fromOpenAI(prompt) : await fromClaude(prompt);

  const w = WORKS[req.work];
  const costume = req.setting === 'original' ? 'traditional' : SETTINGS[req.setting].costume;
  const scene = normalizeScene(raw, {
    workCharacters: w.characters,
    defaultBackground: w.cover.background,
    costume,
  });
  if (req.sceneIndex >= req.totalScenes && !scene.ending) {
    scene.ending = { title: scene.title, summary: scene.summary, changes: [] };
    scene.choices = [];
  }
  return scene;
}

// 새 사설 목소리 — OpenAI 음성 합성(gpt-4o-mini-tts)으로 이 장면의 새 사설을 판소리처럼 소리 내어 부른다.
// 화면에서는 실제 소리북 장단 위에 얹어 재생하고, "AI 음성(실제 소리꾼 가창 아님)"으로 표시한다.

import crypto from 'node:crypto';
import OpenAI from 'openai';

import { JANGDAN, JANGDAN_IDS, JO_IDS } from '../public/js/data/gugak.js';
import { CHARACTERS } from '../public/js/data/works.js';

const VOICE_MODEL = process.env.OPENAI_VOICE_MODEL || 'gpt-4o-mini-tts';

let openai = null;
const getOpenAI = () => (openai ||= new OpenAI({ timeout: 30_000, maxRetries: 1 }));

export function voiceAvailable() {
  // 읽기 모델이라 노래처럼 들리지 않아 기본은 끔. SORISKETCH_VOICE=1 일 때만 사용
  return !!process.env.OPENAI_API_KEY && process.env.SORISKETCH_OFFLINE !== '1' && process.env.SORISKETCH_VOICE === '1';
}

const TEMPO = {
  jinyang: '아주 느리게(진양조): 한 음절을 아주 길게 늘이고, 줄 끝을 길게 끌며 떨어 준다.',
  jungmori: '보통 빠르기(중모리): 걷는 듯 차분하게, 사연을 또렷이 들려준다.',
  jungjungmori: '조금 빠르게(중중모리): 어깨가 들썩이듯 흥겹게, 셋씩 묶어 굴리듯.',
  jajinmori: '빠르게(자진모리): 말을 쏟아내듯 숨 가쁘게 몰아치되 박자는 고르게.',
  hwimori: '아주 빠르게(휘모리): 숨 돌릴 틈 없이 휘몰아친다.',
  eotmori: '조금 빠르게(엇모리): 셋-둘-둘-셋으로 엇갈리는 걸음처럼, 신비롭고 낯설게.',
};
const MOOD = {
  gyemyeon: '슬프고 애절한 계면조의 느낌으로, 음을 크게 떨고 꺾어 내린다.',
  pyeong: '맑고 담담한 평조의 느낌으로.',
  u: '웅장하고 씩씩한 우조의 느낌으로, 소리를 크고 곧게 내지른다.',
};

function pickVoice(singer) {
  const c = CHARACTERS[singer];
  if (c?.art?.sex === 'f') return 'sage';
  return 'ash';
}

// 같은 사설·장단은 다시 만들지 않는다(메모리 캐시)
const cache = new Map();
const MAX_CACHE = 200;

export class VoiceError extends Error {}

export async function synthVoice(body) {
  const b = body && typeof body === 'object' ? body : {};
  const lines = (Array.isArray(b.lines) ? b.lines : []).map((l) => String(l).trim().slice(0, 40)).filter(Boolean).slice(0, 4);
  if (!lines.length) throw new VoiceError('사설이 없습니다.');
  const jangdan = JANGDAN_IDS.includes(b.jangdan) ? b.jangdan : 'jungmori';
  const jo = JO_IDS.includes(b.jo) ? b.jo : 'gyemyeon';
  const voice = pickVoice(b.singer);
  const key = crypto.createHash('sha1').update(JSON.stringify([lines, jangdan, jo, voice])).digest('hex');
  if (cache.has(key)) return cache.get(key);

  const instructions = `판소리 소리꾼처럼 노래하듯 소리를 뽑아라. 말하듯 읽지 말고, 한 음절 한 음절을 늘이고 줄 끝음을 떨거나 꺾어 내리며, 목을 쓰는 듯 굵고 깊은 소리로. 줄마다 숨을 쉬고, 뒤에 고수의 북 장단(${JANGDAN[jangdan].name})이 깔려 있다고 생각하며 일정한 박자로. ${TEMPO[jangdan]} ${MOOD[jo]}`;
  const res = await getOpenAI().audio.speech.create({
    model: VOICE_MODEL,
    voice,
    input: lines.join('\n'),
    instructions,
    response_format: 'mp3',
  });
  const buf = Buffer.from(await res.arrayBuffer());
  cache.set(key, buf);
  if (cache.size > MAX_CACHE) cache.delete(cache.keys().next().value);
  return buf;
}

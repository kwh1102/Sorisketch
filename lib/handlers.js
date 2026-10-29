// 로컬 서버(server.js)와 Vercel 함수(api/*.js)가 공유하는 요청 처리기.

import os from 'node:os';

import { aiStatus, generateScene, BadRequest } from './story.js';
import { voiceAvailable, synthVoice, VoiceError } from './voice.js';

// 발표장에서 한 사람이 과도하게 요청하지 않도록 하는 간단한 IP별 제한(메모리). 이야기와 목소리는 따로 센다.
const WINDOW_MS = 10 * 60 * 1000;
const LIMIT = Number(process.env.SORISKETCH_RATE_LIMIT || 40);
const hits = new Map();
function allow(ip, bucket) {
  const key = `${bucket}:${ip}`;
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= LIMIT) return false;
  list.push(now);
  hits.set(key, list);
  return true;
}
const clientIp = (req) => (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'local';

function send(res, status, data) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body; // Vercel이 미리 파싱한 경우
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 32_000) throw new BadRequest('요청이 너무 큽니다.');
  }
  try {
    return JSON.parse(raw || '{}');
  } catch {
    throw new BadRequest('잘못된 요청입니다.');
  }
}

// 로컬 실행일 때만: 발표 모드 QR에 넣을 같은 Wi-Fi 주소
function lanAddresses() {
  if (process.env.VERCEL) return [];
  return Object.values(os.networkInterfaces()).flat()
    .filter((n) => n && n.family === 'IPv4' && !n.internal)
    .map((n) => n.address)
    // 집·학교 Wi-Fi에서 흔한 사설 주소(192.168.x, 10.x, 172.16~31.x)를 앞에 둔다
    .sort((a, b) => Number(!/^(192\.168|10\.|172\.(1[6-9]|2\d|3[01]))/.test(a)) - Number(!/^(192\.168|10\.|172\.(1[6-9]|2\d|3[01]))/.test(b)));
}

export function statusHandler(req, res) {
  send(res, 200, { ...aiStatus(), voice: voiceAvailable(), lan: lanAddresses() });
}

// POST /api/voice { lines, jangdan, jo, singer } → audio/mpeg
export async function voiceHandler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST만 지원합니다.' });
  if (!voiceAvailable()) return send(res, 503, { error: '목소리 합성이 꺼져 있습니다.' });
  if (!allow(clientIp(req), 'voice')) return send(res, 429, { error: '잠시 후 다시 시도해 주세요.' });
  try {
    const audio = await synthVoice(await readJson(req));
    res.statusCode = 200;
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    res.end(audio);
  } catch (err) {
    if (err instanceof BadRequest || err instanceof VoiceError) return send(res, 400, { error: err.message });
    console.error('[voice]', err?.status || '', err?.message || err);
    send(res, 502, { error: '목소리를 만들지 못했습니다.' });
  }
}

export async function storyHandler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'POST만 지원합니다.' });
  if (!aiStatus().ai) return send(res, 503, { error: 'AI가 연결되어 있지 않습니다.', offline: true });
  if (!allow(clientIp(req), 'story')) return send(res, 429, { error: '잠시 후 다시 시도해 주세요.' });
  try {
    const body = await readJson(req);
    const scene = await generateScene(body);
    send(res, 200, { scene });
  } catch (err) {
    if (err instanceof BadRequest) return send(res, 400, { error: err.message });
    console.error('[story]', err?.status || '', err?.message || err);
    send(res, 502, { error: 'AI가 다음 장면을 만들지 못했습니다.' });
  }
}

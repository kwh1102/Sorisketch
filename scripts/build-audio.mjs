// 국립국악원 「국악 디지털 음원」(악구, 공공누리 제1유형)에서 악구 WAV를 받아
// 대목별로 이어 붙이고 MP3로 변환해 public/assets/audio/ 에 넣는다.
//
//   node scripts/build-audio.mjs              # 받기 + 변환
//   GUGAK_ORG="학교명" node scripts/build-audio.mjs
//
// - 다운로드 양식의 사용 목적은 "비상업용 · 교육용", 기관명은 GUGAK_ORG(기본 KAIST)로 적는다.
// - 받은 WAV는 저장소 밖 임시 폴더(GUGAK_CACHE, 기본: OS 임시 폴더)에 캐시한다.

import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as lame from '@breezystack/lamejs';

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(here, '..', 'public', 'assets', 'audio');
const CACHE = process.env.GUGAK_CACHE || path.join(os.tmpdir(), 'sorisketch-gugak-cache');
const ORG = process.env.GUGAK_ORG || 'KAIST';
const BASE = 'https://www.gugak.go.kr/digitaleum';
const RATE = 48000;

const manifest = JSON.parse(await fs.readFile(path.join(here, 'audio-manifest.json'), 'utf8'));

// ---------- 다운로드 ----------
let cookie = '';
async function session() {
  const res = await fetch(`${BASE}/front/phrase/list.do`);
  cookie = (res.headers.getSetCookie?.() || []).map((c) => c.split(';')[0]).join('; ');
}

async function download(code) {
  const file = path.join(CACHE, `${code}.wav`);
  try {
    await fs.access(file);
    return file;
  } catch {
    // 아직 없음 → 받기
  }
  const body = new URLSearchParams({
    id: code, arrId: code, usePurposeGb: '비상업용', usePurpose: '교육용', usePurposeDtl: '', companyName: ORG,
  });
  const res = await fetch(`${BASE}/cmmn/file/phrase/download.do`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Cookie: cookie },
    body,
  });
  const type = res.headers.get('content-type') || '';
  if (!res.ok || !type.includes('audio')) throw new Error(`${code}: 받기 실패 (${res.status} ${type})`);
  await fs.writeFile(file, Buffer.from(await res.arrayBuffer()));
  await new Promise((r) => setTimeout(r, 300)); // 서버에 부담 주지 않게
  return file;
}

// ---------- WAV 읽기 (PCM 16/24/32, float 32) → 48kHz 스테레오 Float32 ----------
function readWav(buf) {
  let o = 12;
  let fmt = null;
  while (o + 8 <= buf.length) {
    const id = buf.toString('ascii', o, o + 4);
    const size = buf.readUInt32LE(o + 4);
    if (id === 'fmt ') {
      let format = buf.readUInt16LE(o + 8);
      if (format === 0xfffe) format = buf.readUInt16LE(o + 8 + 24); // EXTENSIBLE → 실제 형식
      fmt = { format, ch: buf.readUInt16LE(o + 10), rate: buf.readUInt32LE(o + 12), bits: buf.readUInt16LE(o + 22) };
    }
    if (id === 'data') {
      const data = buf.subarray(o + 8, o + 8 + size);
      const bps = fmt.bits / 8;
      const frames = Math.floor(data.length / (bps * fmt.ch));
      const L = new Float32Array(frames);
      const R = new Float32Array(frames);
      const sample = (i) => {
        const p = i * bps;
        if (fmt.format === 3) return data.readFloatLE(p);
        if (fmt.bits === 16) return data.readInt16LE(p) / 32768;
        if (fmt.bits === 24) return data.readIntLE(p, 3) / 8388608;
        return data.readInt32LE(p) / 2147483648;
      };
      for (let f = 0; f < frames; f++) {
        L[f] = sample(f * fmt.ch);
        R[f] = fmt.ch > 1 ? sample(f * fmt.ch + 1) : L[f];
      }
      return resample([L, R], fmt.rate);
    }
    o += 8 + size + (size % 2);
  }
  throw new Error('WAV data 없음');
}

// 간단한 리샘플(정수배는 평균, 아니면 선형 보간)
function resample([L, R], rate) {
  if (rate === RATE) return [L, R];
  const ratio = rate / RATE;
  const n = Math.floor(L.length / ratio);
  const out = [new Float32Array(n), new Float32Array(n)];
  for (let c = 0; c < 2; c++) {
    const src = c ? R : L;
    for (let i = 0; i < n; i++) {
      if (Number.isInteger(ratio)) {
        let s = 0;
        for (let k = 0; k < ratio; k++) s += src[i * ratio + k];
        out[c][i] = s / ratio;
      } else {
        const x = i * ratio;
        const a = Math.floor(x);
        out[c][i] = src[a] + (src[Math.min(a + 1, src.length - 1)] - src[a]) * (x - a);
      }
    }
  }
  return out;
}

// 이어 붙이기(악구 사이 10ms 크로스페이드), 앞뒤 페이드, 피크 정규화
function join(list) {
  const xf = Math.floor(RATE * 0.01);
  const total = list.reduce((s, p) => s + p[0].length, 0) - xf * (list.length - 1);
  const out = [new Float32Array(total), new Float32Array(total)];
  let pos = 0;
  list.forEach((p, idx) => {
    for (let c = 0; c < 2; c++) {
      for (let i = 0; i < p[c].length; i++) {
        const fadeIn = idx > 0 && i < xf ? i / xf : 1;
        out[c][pos + i] = (i < xf && idx > 0 ? out[c][pos + i] * (1 - fadeIn) : 0) + p[c][i] * fadeIn;
      }
    }
    pos += p[0].length - xf;
  });
  const fade = Math.floor(RATE * 0.3);
  let peak = 0;
  for (let c = 0; c < 2; c++) {
    for (let i = 0; i < total; i++) {
      if (i < fade) out[c][i] *= i / fade;
      if (i > total - fade) out[c][i] *= (total - i) / fade;
      peak = Math.max(peak, Math.abs(out[c][i]));
    }
  }
  const gain = peak > 0 ? 0.89 / peak : 1;
  return out.map((ch) => ch.map((v) => v * gain));
}

function encodeMp3([L, R], kbps = 128) {
  const toInt = (a) => Int16Array.from(a, (v) => Math.max(-32768, Math.min(32767, Math.round(v * 32767))));
  const l = toInt(L);
  const r = toInt(R);
  const enc = new lame.Mp3Encoder(2, RATE, kbps);
  const chunks = [];
  for (let i = 0; i < l.length; i += 1152) {
    const b = enc.encodeBuffer(l.subarray(i, i + 1152), r.subarray(i, i + 1152));
    if (b.length) chunks.push(Buffer.from(b));
  }
  chunks.push(Buffer.from(enc.flush()));
  return Buffer.concat(chunks);
}

// ---------- 실행 ----------
await fs.mkdir(CACHE, { recursive: true });
await fs.mkdir(OUT, { recursive: true });
await session();
console.log(`캐시: ${CACHE}\n기관명: ${ORG}`);

// 북 장단 한 바퀴를 끊김 없이 반복하려고 WAV(모노 32kHz 16비트)로 저장한다. MP3는 앞뒤에 무음이 붙어 반복이 어긋난다.
function encodeWavMono([L, R], rate = 32000) {
  const ratio = RATE / rate;
  const n = Math.floor(L.length / ratio);
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(rate, 24); buf.writeUInt32LE(rate * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) {
    const x = i * ratio;
    const a = Math.floor(x);
    const v = ((L[a] + R[a]) / 2) * 0.95;
    buf.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(v * 32767))), 44 + i * 2);
  }
  return buf;
}

const codes = (p) => Array.from({ length: p.count }, (_, i) => `${p.prefix}-${String(i + 1).padStart(3, '0')}`);
const jobs = Object.entries({ ...manifest.passages, ...manifest.sori })
  .map(([id, p]) => ({ id, out: `${id}.mp3`, clips: codes(p) }));

// cues.json: 이어 붙인 음원 안에서 악구가 바뀌는 시각(초) → 추임새 자리, 북 한 바퀴 길이
const cues = { tracks: {}, drums: {} };
let bytes = 0;
for (const job of jobs) {
  const parts = [];
  for (const code of job.clips) {
    try {
      parts.push(readWav(await fs.readFile(await download(code))));
    } catch (err) {
      if (!parts.length) throw err;
      console.warn(`  (${code} 없음 — ${parts.length}개 악구로 만듦)`);
      break;
    }
  }
  const mp3 = encodeMp3(join(parts));
  await fs.writeFile(path.join(OUT, job.out), mp3);
  bytes += mp3.length;
  if (job.id) {
    const xf = 0.01;
    let t = 0;
    const bounds = parts.map((p) => (t += p[0].length / RATE - xf));
    cues.tracks[job.out] = { duration: +t.toFixed(3), phrases: bounds.slice(0, -1).map((b) => +b.toFixed(3)) };
  }
  const sec = (parts.reduce((s, p) => s + p[0].length, 0) / RATE).toFixed(1);
  console.log(`✓ ${job.out}  (${parts.length}개 악구, 원본 ${sec}초, ${(mp3.length / 1024).toFixed(0)}KB)`);
}
for (const [id, code] of Object.entries(manifest.drumLoops)) {
  const part = readWav(await fs.readFile(await download(code)));
  const wav = encodeWavMono(part);
  await fs.writeFile(path.join(OUT, `drum-${id}.wav`), wav);
  bytes += wav.length;
  cues.drums[id] = { file: `drum-${id}.wav`, cycle: +(part[0].length / RATE).toFixed(4) };
  console.log(`✓ drum-${id}.wav  (한 바퀴 ${cues.drums[id].cycle}초, ${(wav.length / 1024).toFixed(0)}KB)`);
}
await fs.writeFile(path.join(OUT, 'cues.json'), JSON.stringify(cues, null, 1));
console.log(`완료: 합계 ${(bytes / 1024 / 1024).toFixed(1)}MB`);

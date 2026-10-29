// 로컬 실행용 서버: 정적 파일(public/) + /api/status, /api/story
// 같은 Wi-Fi의 휴대폰에서도 접속할 수 있도록 0.0.0.0에서 듣고, 접속 주소를 출력한다.

import http from 'node:http';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
try {
  process.loadEnvFile(path.join(here, '.env'));
} catch {
  // .env가 없으면 환경 변수만 사용 (AI 없이도 각본 모드로 동작)
}

const { statusHandler, storyHandler, voiceHandler } = await import('./lib/handlers.js');

const PUBLIC = path.join(here, 'public');
const PORT = Number(process.env.PORT || 3000);
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.ogg': 'audio/ogg', '.m4a': 'audio/mp4', '.wav': 'audio/wav',
  '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json', '.md': 'text/markdown; charset=utf-8',
};

async function serveStatic(req, res) {
  const url = new URL(req.url, 'http://x');
  let rel = decodeURIComponent(url.pathname);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.normalize(path.join(PUBLIC, rel));
  if (!file.startsWith(PUBLIC)) {
    res.statusCode = 403;
    return res.end();
  }
  try {
    const data = await fs.readFile(file);
    res.setHeader('Content-Type', TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream');
    res.end(data);
  } catch {
    res.statusCode = 404;
    res.end('Not found');
  }
}

const server = http.createServer((req, res) => {
  const { pathname } = new URL(req.url, 'http://x');
  if (pathname === '/api/status') return statusHandler(req, res);
  if (pathname === '/api/story') return storyHandler(req, res);
  if (pathname === '/api/voice') return voiceHandler(req, res);
  return serveStatic(req, res);
});

server.listen(PORT, '0.0.0.0', async () => {
  const { aiStatus } = await import('./lib/story.js');
  const st = aiStatus();
  console.log(`\n  Sorisketch 소리판이 열렸습니다.`);
  console.log(`  - 이 컴퓨터:  http://localhost:${PORT}`);
  for (const nets of Object.values(os.networkInterfaces())) {
    for (const n of nets || []) {
      if (n.family === 'IPv4' && !n.internal) console.log(`  - 같은 Wi-Fi: http://${n.address}:${PORT}`);
    }
  }
  console.log(`  - 발표 모드:  http://localhost:${PORT}/?present`);
  console.log(`  - AI 이야기: ${st.ai ? `연결됨 (${st.provider} · ${st.model})` : '꺼짐 → 각본 모드로 동작 (.env에 OPENAI_API_KEY 또는 ANTHROPIC_API_KEY 설정)'}\n`);
});

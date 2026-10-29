# Sorisketch · 소리스케치

**판을 바꾸다 — 내가 만드는 판소리 평행세계**

판소리 다섯 바탕(춘향가·심청가·흥보가·수궁가·적벽가) 중 하나를 골라, 내 선택으로 새로 펼쳐지는 이야기를 **그림·장단·추임새**로 경험하는 인터랙티브 판소리 웹사이트입니다. 한국음악 수업 과제 「국악을 일상으로」를 위해 만들었습니다.

- 설치·회원가입 없이 휴대폰·태블릿·PC 브라우저에서 바로 체험
- 매 장면이 **아니리(말) → 창(장단에 얹은 노래) → 짧은 해설 → 선택**으로 진행
- 장단 원(북 패턴 시각화), 같은 사설을 다른 장단으로 바꿔 듣는 **비교 감상**, 소리가 맺히는 자리에 넣는 **추임새**
- **실제 소리**: 국립국악원 「국악 디지털 음원」의 실제 판소리 녹음 28곡(원작 감상 11곡 포함)과 소리북 장단 6종. 창 장면에서는 같은 장단의 실제 녹음을 들려줌
- AI(OpenAI GPT 또는 Claude)가 선택 이력과 인물 관계를 기억하며 매번 새 장면을 지음. AI가 없거나 실패하면 미리 쓴 **각본 모드**로 끝까지 진행
- 민화풍 그림: 배경·인물·표정·소품을 조합해 장면마다 다르게 구성

## 실행

```bash
npm install
```

```bash
npm start
```

- 이 컴퓨터: http://localhost:3000
- 같은 Wi-Fi의 휴대폰: 서버가 출력하는 `http://192.168.x.x:3000`
- 발표 모드(큰 화면용 QR): http://localhost:3000/?present — localhost로 열어도 QR에는 같은 Wi-Fi 주소가 들어갑니다.

### AI 이야기 켜기

`.env.example`을 `.env`로 복사하고 **`OPENAI_API_KEY`** 또는 `ANTHROPIC_API_KEY` 중 하나를 넣으면 AI 모드가 켜집니다. 키가 없으면 자동으로 각본 모드로 동작합니다. 키는 서버에만 있고 브라우저로 전달되지 않습니다.

| 변수 | 기본값 | 설명 |
|---|---|---|
| `AI_PROVIDER` | (자동) | `openai` 또는 `anthropic`. 비우면 있는 키로 고름(둘 다 있으면 OpenAI) |
| `OPENAI_API_KEY` | (없음) | OpenAI API 키 |
| `OPENAI_MODEL` | `gpt-5.4-mini` | OpenAI 장면 생성 모델. 더 자연스러운 문장이 필요하면 `gpt-5.5`(느리고 비쌈) |
| `OPENAI_REASONING_EFFORT` | `low` | 추론 노력 수준. 추론 모델이 아니면 비워 둘 것 |
| `OPENAI_VOICE_MODEL` | `gpt-4o-mini-tts` | 새 사설을 부르는 목소리 모델 |
| `SORISKETCH_VOICE` | `0` | `1`이면 새 사설을 AI 목소리로 읽어 줌(실험용, 노래가 아니라 낭독에 가까움) |
| `ANTHROPIC_API_KEY` | (없음) | Claude API 키 |
| `CLAUDE_MODEL` | `claude-opus-5-5` | Claude 장면 생성 모델 |
| `CLAUDE_EFFORT` | `low` | 생성 노력 수준. 대기 시간을 줄이려 기본 `low` |
| `SORISKETCH_OFFLINE` | `0` | `1`이면 키가 있어도 각본 모드 |
| `SORISKETCH_RATE_LIMIT` | `40` | IP당 10분에 허용할 AI 요청 수 |

### 배포 (발표용 공개 주소)

Vercel에 그대로 올릴 수 있게 구성했습니다(`vercel.json`, `api/*.js`). 환경 변수에 `OPENAI_API_KEY`(또는 `ANTHROPIC_API_KEY`)를 넣으면 됩니다. 정적 호스팅만 하면 각본 모드로 동작합니다.

## 폴더 구조

```
server.js              로컬 서버 (정적 파일 + /api)
api/                   Vercel 함수 (status, story)
lib/story.js           프롬프트·출력 스키마·장면 생성 (OpenAI / Claude)
lib/handlers.js        API 처리(요청 제한, 오류 처리)
public/
  index.html, css/style.css
  js/app.js            화면 흐름
  js/data/gugak.js     장단·조·판소리 요소·원작 대목 (검토된 국악 정보의 단일 출처)
  js/data/works.js     다섯 바탕·인물·배경·소품 카탈로그
  js/story/            장면 스키마, AI/각본 진행 관리, 각본 6편
  js/audio/engine.js   실제 녹음·소리북 장단 재생, 추임새 자리 계산(Web Audio)
  js/art/              민화풍 인물·배경·무대 연출(SVG)
  assets/audio/        원작 감상 음원·소리북 장단 (국립국악원, 공공누리 1유형)
scripts/build-audio.mjs 국립국악원 악구 음원 → 대목별 MP3 생성 (npm run audio)
docs/DESIGN.md         설계 문서 (화면·데이터·AI·음악·그림·개발 순서)
docs/ASSETS.md         자산 목록(넣은 음원, 남은 임시 자료)
```

## 꼭 알아 둘 점

- 새 이야기의 **창** 장면에서는 그 장면의 장단과 같은 장단의 **실제 판소리 녹음**(같은 작품의 녹음을 먼저 고름)을 들려주고, 새 사설은 자막으로 보여 줍니다. 「새 사설을 북 장단에 얹어 보기」로 실제 소리북 장단 위에 새 사설 자막을 흘려 볼 수 있습니다. (AI 목소리로 새 사설 읽기는 실험용으로 꺼 둠: `SORISKETCH_VOICE=1`)
- 합성음은 음원을 불러오지 못할 때 쓰는 예비 북소리뿐입니다.
- 모든 녹음과 소리북 장단은 국립국악원 「국악 디지털 음원」(https://www.gugak.go.kr/digitaleum/, 공공누리 제1유형·출처표시)에서 받은 악구를 이어 붙인 앞부분 발췌입니다. 다시 만들려면 `npm run audio`(설정: `scripts/audio-manifest.json`). 적벽화전·군사설움타령은 공개 음원을 찾지 못했습니다.
- `public/js/data/gugak.js`의 장단·대목 설명에는 `verify: true` 표시가 있습니다. 발표 전에 국립국악원 국악사전 등 원전으로 다시 확인하세요.

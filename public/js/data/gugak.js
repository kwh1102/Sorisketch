// 국악 지식 데이터 — 화면 해설과 AI 프롬프트가 함께 쓰는 "검토된 정보"의 단일 출처.
// AI는 여기 있는 id만 고를 수 있고, 장단·대목의 사실 설명은 반드시 이 파일의 문장을 그대로 보여준다.
// verify: true 인 항목은 발표 전 국립국악원 국악사전 등 원전으로 한 번 더 확인할 것을 권장한다.

export const JANGDAN = {
  jinyang: {
    id: 'jinyang',
    name: '진양조',
    beatsLabel: '6박 × 4각 = 24박',
    // 체험용 단순화 패턴: D=덩(북편+채), K=쿵(북편), T=딱(채), t=약한 딱, -=쉼
    pattern: 'D--T--K--T--K--T-KD-TK-T',
    groups: [6, 6, 6, 6],
    stepsPerLine: 6,
    bpm: 52, // 한 칸(박)의 빠르기. 실제 진양조는 이보다 더 느리게도 부른다.
    tempoWord: '가장 느림',
    listen: '한 장단이 매우 길어 소리꾼이 한 음 한 음을 길게 늘이고 꾸밀 여유가 생깁니다. 마지막 각에서 북이 조금 촘촘해지며 장단을 맺는 느낌을 들어 보세요.',
    summary: '판소리 장단 가운데 가장 느린 장단입니다. 서정적이거나 비장한 대목, 경치를 길게 그리는 대목에서 자주 쓰입니다.',
    examples: ['춘향가 「십장가」', '심청가 「범피중류」', '흥보가 「박타령」'],
    verify: true,
  },
  jungmori: {
    id: 'jungmori',
    name: '중모리',
    beatsLabel: '12박',
    pattern: 'D--K-TK-TT--',
    groups: [3, 3, 3, 3],
    stepsPerLine: 12,
    bpm: 84,
    tempoWord: '보통 빠르기',
    listen: '12박을 한 바퀴로 셉니다. 걷는 듯한 보통 빠르기라 사설(가사)이 또렷하게 들리고, 이야기를 차분히 풀어 가기에 알맞습니다.',
    summary: '보통 빠르기의 12박 장단입니다. 사연을 차분히 풀어 놓거나 인물의 마음을 담담히 그리는 대목에 널리 쓰입니다.',
    examples: ['춘향가 「쑥대머리」'],
    verify: true,
  },
  jungjungmori: {
    id: 'jungjungmori',
    name: '중중모리',
    beatsLabel: '12박 (3소박씩 4묶음으로 느끼기)',
    pattern: 'D-KT-KK-TT-t',
    groups: [3, 3, 3, 3],
    stepsPerLine: 12,
    bpm: 150,
    tempoWord: '조금 빠름',
    listen: '중모리보다 빨라지면서 어깨가 들썩이는 흥이 생깁니다. 셋씩 묶어 "덩-기 덕-쿵" 하고 몸을 흔들어 보면 리듬이 잘 느껴집니다.',
    summary: '중모리보다 조금 빠른 12박 장단입니다. 춤추듯 흥겨운 대목이나 무언가를 신나게 늘어놓는 대목에서 자주 들립니다.',
    examples: ['춘향가 「사랑가」', '수궁가 「고고천변」', '흥보가 「제비노정기」'],
    verify: true,
  },
  jajinmori: {
    id: 'jajinmori',
    name: '자진모리',
    beatsLabel: '4박 (한 박을 셋으로 나눔, 12소박)',
    pattern: 'D-KT-KK-T-T-',
    groups: [3, 3, 3, 3],
    stepsPerLine: 24,
    bpm: 300,
    tempoWord: '빠름',
    listen: '큰 박 네 개가 빠르게 돌아가며 말이 쏟아지듯 이어집니다. 사건이 한꺼번에 벌어지는 장면을 숨 가쁘게 몰아갑니다.',
    summary: '빠른 4박 장단(한 박이 셋으로 나뉨)입니다. 사건이 급하게 벌어지거나 여러 일을 숨 가쁘게 늘어놓는 대목에 자주 쓰입니다.',
    examples: ['춘향가 「어사출두」', '적벽가 「적벽화전」'],
    verify: true,
  },
  hwimori: {
    id: 'hwimori',
    name: '휘모리',
    beatsLabel: '4박 (가장 빠르게 몰아침)',
    pattern: 'D-TKK-TK',
    groups: [2, 2, 2, 2],
    stepsPerLine: 16,
    bpm: 330,
    tempoWord: '가장 빠름',
    listen: '자진모리보다 더 빠르게 휘몰아칩니다. 짧은 순간에 일이 끝나 버리는 긴박함을 들어 보세요.',
    summary: '판소리 장단 가운데 가장 빠른 장단입니다. 매우 급박한 장면을 짧고 강하게 몰아칠 때 쓰입니다.',
    examples: [],
    verify: true,
  },
  eotmori: {
    id: 'eotmori',
    name: '엇모리',
    beatsLabel: '10소박 (3+2+2+3)',
    pattern: 'D-KT-K-T-K',
    groups: [3, 2, 2, 3],
    stepsPerLine: 20,
    bpm: 270,
    tempoWord: '조금 빠름, 엇갈리는 박',
    listen: '셋-둘-둘-셋으로 박이 엇갈려 다리를 저는 듯 독특하게 걸어갑니다. 평범하지 않은 인물이 등장할 때의 신비롭고 낯선 느낌을 만듭니다.',
    summary: '3+2+2+3의 10소박이 엇갈리게 짜인 장단입니다. 범이나 도사·스님처럼 범상치 않은 인물이 등장하는 대목에 쓰인 예가 잘 알려져 있습니다.',
    examples: ['수궁가 「범 내려온다」', '심청가 「중 내려오는 대목」'],
    verify: true,
  },
};

export const JANGDAN_IDS = Object.keys(JANGDAN);

// 조(調): 선율의 분위기를 만드는 음 구성. 체험용 합성 가락의 음계를 고르는 데 쓴다.
export const JO = {
  gyemyeon: {
    id: 'gyemyeon',
    name: '계면조',
    summary: '슬프고 애절한 느낌을 주는 조입니다. 음을 크게 떨거나(떠는 목) 꺾어 내리는(꺾는 목) 시김새가 두드러집니다.',
  },
  pyeong: {
    id: 'pyeong',
    name: '평조',
    summary: '맑고 화평한 느낌의 조입니다. 담담하고 밝은 장면에 어울립니다.',
  },
  u: {
    id: 'u',
    name: '우조',
    summary: '웅장하고 씩씩한 느낌의 조입니다. 위엄 있는 인물이나 큰 장면에 어울립니다.',
  },
};
export const JO_IDS = Object.keys(JO);

// 판소리 요소 해설 카드
export const ELEMENT_CARDS = {
  pansori: {
    title: '판소리',
    body: '한 명의 소리꾼이 고수(북 치는 사람)의 장단에 맞추어 창(노래)·아니리(말)·발림(몸짓)을 섞어 가며 긴 이야기를 들려주는 공연 예술입니다. 2003년 유네스코 「인류 구전 및 무형유산 걸작」으로 선정되었습니다.',
  },
  chang: {
    title: '창(唱)',
    body: '장단에 얹어 노래로 부르는 부분입니다. 인물의 감정이 커지거나 장면을 길게 그려 낼 때 창으로 넘어갑니다.',
  },
  aniri: {
    title: '아니리',
    body: '장단 없이 말하듯 이야기를 이어 가는 부분입니다. 상황을 설명하거나 대화를 주고받고, 소리꾼이 숨을 고르는 역할도 합니다.',
  },
  ballim: {
    title: '발림(너름새)',
    body: '소리꾼이 부채나 손짓, 몸짓으로 장면을 그려 보이는 연기입니다. 이 사이트에서는 그림 속 인물의 움직임이 발림을 대신합니다.',
  },
  gosu: {
    title: '고수와 북',
    body: '고수는 북으로 장단을 짚고 추임새로 소리꾼을 북돋는 반주자입니다. "일고수 이명창(첫째가 고수, 둘째가 명창)"이라는 말이 있을 만큼 중요하게 여겨집니다.',
  },
  chuimsae: {
    title: '추임새',
    body: '"얼씨구", "좋다", "잘한다", "그렇지"처럼 고수와 청중이 소리에 호응하는 말입니다. 소리를 가리지 않도록 소리가 잠시 쉬는 자리나 한 대목이 맺히는 자리에 넣는 것이 어울립니다.',
  },
  sasul: {
    title: '사설',
    body: '판소리의 노랫말과 대사를 통틀어 이르는 말입니다. 4·4조처럼 글자 수가 맞아떨어지는 말이 많아 장단에 얹기 좋습니다.',
  },
  sigimsae: {
    title: '시김새',
    body: '음을 떨고, 꺾고, 밀어 올리고, 흘러내리게 하여 소리를 꾸미는 방법입니다. 같은 음이라도 시김새에 따라 느낌이 크게 달라집니다.',
  },
  batang: {
    title: '다섯 바탕',
    body: '판소리 작품을 "바탕"이라고 셉니다. 조선 후기의 여러 판소리 가운데 지금까지 소리가 전해지는 것은 춘향가·심청가·흥보가·수궁가·적벽가의 다섯 바탕입니다.',
  },
};
export const ELEMENT_IDS = Object.keys(ELEMENT_CARDS);

// 원작 대목 카드 — "원작 감상"으로 소개하는 실제 판소리 대목.
// audio: public/assets/audio/ 아래의 원작 음원(국립국악원 국악 디지털 음원 악구를 이어 붙인 앞부분 발췌).
// singer·track은 음원의 실제 창자와 악구 이름. 음원이 카드의 대목과 다른 부분이면 track에 그대로 밝힌다.
// 음원을 다시 만들려면: node scripts/build-audio.mjs (scripts/audio-manifest.json 참고)
export const PASSAGES = {
  sarangga: {
    work: 'chunhyang', title: '사랑가', jangdan: 'jungjungmori',
    context: '광한루에서 만난 춘향과 몽룡이 사랑을 나누며 부르는 대목입니다. "이리 오너라 업고 놀자"라는 노랫말로 널리 알려져 있습니다.',
    audio: 'sarangga.mp3', singer: '김수인', track: '사랑가', verify: true,
  },
  ssukdaemeori: {
    work: 'chunhyang', title: '쑥대머리', jangdan: 'jungmori',
    context: '변학도의 수청을 거절하고 옥에 갇힌 춘향이 흐트러진 머리로 몽룡을 그리워하는 대목입니다. 임방울 명창의 소리로 특히 유명합니다.',
    audio: 'ssukdaemeori.mp3', singer: '안숙선', track: '쑥대머리', verify: true,
  },
  eosachuldu: {
    work: 'chunhyang', title: '어사출두', jangdan: 'jajinmori',
    context: '변학도의 생일잔치에 암행어사가 된 몽룡이 출두하여 잔치판이 뒤집히는 대목입니다.',
    audio: 'eosachuldu.mp3', singer: '안숙선', track: '어사출도', verify: true,
  },
  beompijungnyu: {
    work: 'simcheong', title: '범피중류', jangdan: 'jinyang',
    context: '공양미 삼백 석에 몸을 판 심청이 뱃사람들과 인당수로 떠나는 뱃길의 풍경을 그리는 대목입니다.',
    audio: 'beompijungnyu.mp3', singer: '조정희', track: '진양조 범피중류', verify: true,
  },
  jungnaeryeoonda: {
    work: 'simcheong', title: '중 내려오는 대목', jangdan: 'eotmori',
    context: '몽운사 화주승이 산에서 내려오다 개천에 빠진 심봉사를 구하는 대목입니다. 이 만남에서 공양미 삼백 석 이야기가 시작됩니다.',
    audio: 'jungnaeryeoonda.mp3', singer: '조정희', track: '엇모리 중타령', verify: true,
  },
  baktaryeong: {
    work: 'heungbo', title: '박타령', jangdan: 'jinyang',
    context: '제비가 물어다 준 박씨가 자라 열린 박을 흥보 부부가 "시르렁 실근 톱질이야" 하며 타는 대목입니다.',
    audio: 'baktaryeong.mp3', audioJangdan: 'jungmori', singer: '김수인', track: '중모리 둘째 박 타는 대목', verify: true,
  },
  jebinojeonggi: {
    work: 'heungbo', title: '제비노정기', jangdan: 'jungjungmori',
    context: '흥보에게 은혜를 입은 제비가 강남에서 박씨를 물고 흥보 집까지 날아오는 길을 노래하는 대목입니다.',
    audio: 'jebinojeonggi.mp3', singer: '정순임', track: '제비노정기', verify: true,
  },
  beomnaeryeoonda: {
    work: 'sugung', title: '범 내려온다', jangdan: 'eotmori',
    context: '토끼를 찾아 뭍에 오른 자라가 "토 선생"을 부른다는 것이 "호 선생"으로 잘못 불러 범이 내려오는 대목입니다.',
    audio: 'beomnaeryeoonda.mp3', singer: '김수연', track: '범내려온다', verify: true,
  },
  gogocheonbyeon: {
    work: 'sugung', title: '고고천변', jangdan: 'jungjungmori',
    context: '용왕의 명을 받은 자라가 처음 뭍에 올라 세상 경치를 바라보며 감탄하는 대목입니다.',
    audio: 'gogocheonbyeon.mp3', singer: '염경애', track: '중중모리 고고천변', verify: true,
  },
  tokkihwasang: {
    work: 'sugung', title: '토끼화상', jangdan: 'jungjungmori',
    context: '토끼를 본 적 없는 자라를 위해 화공이 토끼의 생김새를 하나하나 그려 나가는 대목입니다.',
    audio: 'tokkihwasang.mp3', singer: '김수인', track: '중중모리 토끼화상', verify: true,
  },
  jeokbyeokhwajeon: {
    work: 'jeokbyeok', title: '적벽화전', jangdan: 'jajinmori',
    context: '동남풍을 타고 붙은 불길이 조조의 배들을 휩쓰는 적벽대전 장면입니다.',
    audio: null, verify: true,
  },
  hwaryongdo: {
    work: 'jeokbyeok', title: '화룡도', jangdan: 'jajinmori',
    context: '적벽에서 크게 패한 조조가 남은 군사를 이끌고 화용도(화룡도)로 달아나는 대목입니다. 쫓기는 다급함이 자진모리로 몰아쳐집니다.',
    audio: 'hwaryongdo.mp3', singer: '정회석', track: '자진모리 화룡도', verify: true,
  },
  gunsaseoreum: {
    work: 'jeokbyeok', title: '군사설움타령', jangdan: null,
    context: '적벽 싸움을 앞둔 조조 군사들이 저마다 고향과 가족을 그리며 신세를 한탄하는 대목입니다. 전쟁 속 평범한 사람들의 목소리가 담겨 있습니다.',
    audio: null, verify: true,
  },
};
export const PASSAGE_IDS = Object.keys(PASSAGES);

export const CHUIMSAE_WORDS = ['얼씨구', '좋다', '잘한다', '그렇지'];

// 창 장면에서 틀 실제 판소리 녹음 — 장단마다 여러 작품의 녹음을 두고, 장면의 작품과 같은 녹음을 먼저 고른다.
// 원작 대목 음원(PASSAGES)도 함께 쓴다. 녹음의 가사는 원작 사설이며 장면의 새 사설과 다르다(화면에 표시).
const EXTRA_TRACKS = [
  ['sori-sugung-jinyang', 'sugung', 'jinyang', '용왕득병 대목', '김수인'],
  ['sori-chunhyang-jinyang', 'chunhyang', 'jinyang', '이별가', '최호성'],
  ['sori-jeokbyeok-jinyang', 'jeokbyeok', 'jinyang', '삼고초려', '정회석'],
  ['sori-heungbo-jinyang', 'heungbo', 'jinyang', '진양조 대목', '유미리'],
  ['sori-jeokbyeok-jungmori', 'jeokbyeok', 'jungmori', '새타령', '정회석'],
  ['sori-sugung-jungmori', 'sugung', 'jungmori', '중모리 대목', '염경애'],
  ['sori-simcheong-jungmori', 'simcheong', 'jungmori', '중모리 대목', '조정희'],
  ['sori-simcheong-jungjungmori', 'simcheong', 'jungjungmori', '화초타령', '조정희'],
  ['sori-jeokbyeok-jungjungmori', 'jeokbyeok', 'jungjungmori', '중중모리 대목', '최호성'],
  ['sori-sugung-jajinmori', 'sugung', 'jajinmori', '약성가', '염경애'],
  ['sori-simcheong-jajinmori', 'simcheong', 'jajinmori', '심봉사 눈 뜨는 대목', '조정희'],
  ['sori-heungbo-jajinmori', 'heungbo', 'jajinmori', '흥보 매 맞는 대목', '김수인'],
  ['sori-chunhyang-hwimori', 'chunhyang', 'hwimori', '춘향 잡아 내리는 대목', '이주은'],
  ['sori-heungbo-hwimori', 'heungbo', 'hwimori', '흥보 밥 먹는 대목', '김수인'],
  ['sori-heungbo-eotmori', 'heungbo', 'eotmori', '중타령', '김수인'],
  ['sori-jeokbyeok-eotmori', 'jeokbyeok', 'eotmori', '현덕의 다짐', '정회석'],
  ['sori-chunhyang-eotmori', 'chunhyang', 'eotmori', '춘향 점치는 대목', '김수인'],
].map(([id, work, jangdan, title, singer]) => ({ file: `${id}.mp3`, work, jangdan, title, singer }));

export const SORI_TRACKS = [
  ...Object.values(PASSAGES)
    .filter((p) => p.audio)
    .map((p) => ({ file: p.audio, work: p.work, jangdan: p.audioJangdan || p.jangdan, title: p.track, singer: p.singer })),
  ...EXTRA_TRACKS,
];

// 원작 음원·소리북 장단의 출처 표시(공공누리 제1유형 조건)
export const AUDIO_SOURCE = {
  label: '국립국악원 「국악 디지털 음원」',
  license: '공공누리 제1유형(출처표시)',
  url: 'https://www.gugak.go.kr/digitaleum/',
};

export const SOURCES = [
  { label: '국립국악원 국악사전', url: 'https://www.gugak.go.kr/site/program/board/basicboard/list?boardtypeid=26&menuid=001003002005' },
  { label: '국립국악원 (판소리·장단 해설, 디지털 음원 공공누리 안내)', url: 'https://www.gugak.go.kr' },
  { label: '국가유산청 국가유산포털 — 판소리', url: 'https://www.heritage.go.kr' },
  { label: 'UNESCO Intangible Cultural Heritage — Pansori epic chant', url: 'https://ich.unesco.org/en/RL/pansori-epic-chant-00070' },
];

// 다섯 바탕 · 등장인물 · 배경 · 무대 소품 카탈로그.
// 그림(art/*)과 AI 프롬프트(lib/story.js)가 같은 id를 쓴다.

export const WORKS = {
  chunhyang: {
    id: 'chunhyang',
    title: '춘향가',
    hanja: '春香歌',
    tagline: '신분을 넘은 사랑, 부당한 권력에 맞선 약속',
    premise: '남원 광한루에서 만난 춘향과 이몽룡은 사랑을 약속하지만, 몽룡은 한양으로 떠나고 새로 온 사또 변학도가 춘향에게 수청을 강요합니다.',
    seed: '약속을 지키려는 마음과 부당한 요구 사이의 갈등',
    characters: ['chunhyang', 'mongryong', 'byeon', 'hyangdan', 'bangja'],
    cover: { background: 'gwanghallu', characters: ['chunhyang', 'mongryong'] },
    passages: ['sarangga', 'ssukdaemeori', 'eosachuldu'],
    originalEnding: '어사가 된 몽룡이 출두하여 변학도를 벌하고 춘향과 다시 만납니다.',
  },
  simcheong: {
    id: 'simcheong',
    title: '심청가',
    hanja: '沈淸歌',
    tagline: '눈먼 아버지를 위한 딸의 선택',
    premise: '앞 못 보는 아버지 심봉사를 모시고 사는 심청은, 공양미 삼백 석을 바치면 아버지가 눈을 뜰 수 있다는 말에 인당수 제물로 자신을 팝니다.',
    seed: '가족을 위한 희생과 그 희생을 요구하는 세상',
    characters: ['simcheong', 'simbongsa', 'ppaengdeok', 'seonin', 'yongwang'],
    cover: { background: 'riverboat', characters: ['simcheong', 'simbongsa'] },
    passages: ['beompijungnyu', 'jungnaeryeoonda'],
    originalEnding: '인당수에 몸을 던진 심청은 용궁에서 되살아나 왕비가 되고, 맹인 잔치에서 아버지를 만나 아버지가 눈을 뜹니다.',
  },
  heungbo: {
    id: 'heungbo',
    title: '흥보가',
    hanja: '興甫歌',
    tagline: '착한 동생, 욕심 많은 형, 그리고 제비',
    premise: '가난하지만 마음씨 고운 흥보는 다리 다친 제비를 고쳐 주고, 제비가 물어다 준 박씨에서 보물이 쏟아집니다. 이를 본 형 놀보도 제비 다리를 일부러 부러뜨리는데…',
    seed: '나눔과 욕심, 형제 사이의 도움과 이익',
    characters: ['heungbo', 'nolbo', 'jebi', 'heungbowife'],
    cover: { background: 'village', characters: ['heungbo', 'jebi', 'nolbo'] },
    passages: ['baktaryeong', 'jebinojeonggi'],
    originalEnding: '놀보의 박에서는 온갖 재앙이 쏟아져 망하지만, 흥보가 형을 거두어 함께 삽니다.',
  },
  sugung: {
    id: 'sugung',
    title: '수궁가',
    hanja: '水宮歌',
    tagline: '용왕의 병, 토끼의 간, 그리고 꾀',
    premise: '병든 용왕에게 토끼의 간이 약이라는 말에, 충직한 자라(별주부)가 뭍으로 나가 토끼를 꾀어 수궁으로 데려옵니다. 간을 내놓으라는 용왕 앞에서 토끼는 꾀를 냅니다.',
    seed: '달콤한 제안 속에 숨은 조건, 위기에서 살아남는 재치',
    characters: ['tokki', 'jara', 'yongwang'],
    cover: { background: 'undersea', characters: ['tokki', 'jara', 'yongwang'] },
    passages: ['gogocheonbyeon', 'tokkihwasang', 'beomnaeryeoonda'],
    originalEnding: '토끼는 간을 육지에 두고 왔다고 속여 뭍으로 돌아와 자라를 놀리고 달아납니다.',
  },
  jeokbyeok: {
    id: 'jeokbyeok',
    title: '적벽가',
    hanja: '赤壁歌',
    tagline: '거대한 전쟁 속, 영웅과 군사들의 목소리',
    premise: '『삼국지연의』의 적벽대전을 바탕으로 합니다. 백만 대군을 이끈 조조가 적벽에서 제갈량의 동남풍과 화공에 크게 패하고, 도망치던 길목에서 관우를 만납니다.',
    seed: '승리를 향한 욕심과 전쟁에 휘말린 사람들의 삶',
    characters: ['jojo', 'jegal', 'gwanu', 'gunsa'],
    cover: { background: 'battlefield', characters: ['jojo', 'jegal'] },
    passages: ['jeokbyeokhwajeon', 'hwaryongdo', 'gunsaseoreum'],
    originalEnding: '화용도에서 조조는 관우에게 옛정을 호소해 목숨을 건지고 달아납니다.',
  },
};
export const WORK_IDS = Object.keys(WORKS);

// 인물: 그림 파라미터(art)와 짧은 소개.
// kind: human | rabbit | turtle | dragon | swallow
export const CHARACTERS = {
  chunhyang: { name: '춘향', role: '퇴기 월매의 딸, 곧은 마음의 주인공', kind: 'human', art: { sex: 'f', hair: 'braid', robe: '#c8463d', robe2: '#f2c94c', skin: '#f6dcc3' } },
  mongryong: { name: '이몽룡', role: '남원 부사의 아들', kind: 'human', art: { sex: 'm', hair: 'topknot', hat: 'bokgeon', robe: '#5f86b5', robe2: '#e8e1d0', skin: '#f3d6bb' } },
  byeon: { name: '변학도', role: '새로 부임한 남원 사또', kind: 'human', art: { sex: 'm', hair: 'topknot', hat: 'samo', beard: 'mustache', robe: '#3d3a6b', robe2: '#c9a24a', skin: '#efcfae', belly: true } },
  hyangdan: { name: '향단', role: '춘향의 몸종이자 벗', kind: 'human', art: { sex: 'f', hair: 'braid', robe: '#7aa66b', robe2: '#f5ead0', skin: '#f4d8bd' } },
  bangja: { name: '방자', role: '몽룡의 시종, 넉살 좋은 수다쟁이', kind: 'human', art: { sex: 'm', hair: 'topknot', hat: 'none', robe: '#a07c4f', robe2: '#e6d8b8', skin: '#e9c49f' } },

  simcheong: { name: '심청', role: '효성 깊은 딸', kind: 'human', art: { sex: 'f', hair: 'braid', robe: '#e7e2d3', robe2: '#5d7fa3', skin: '#f6dcc3' } },
  simbongsa: { name: '심봉사', role: '앞을 보지 못하는 심청의 아버지', kind: 'human', art: { sex: 'm', hair: 'topknot', hat: 'gat', beard: 'long', robe: '#d8d0bd', robe2: '#8a7a5c', skin: '#ecc9a8', blind: true, elder: true } },
  ppaengdeok: { name: '뺑덕어멈', role: '심봉사의 재산을 노리는 이웃', kind: 'human', art: { sex: 'f', hair: 'chignon', robe: '#8c4a7a', robe2: '#e7c36b', skin: '#eac7a6' } },
  seonin: { name: '선인', role: '인당수 제물을 구하는 뱃사람', kind: 'human', art: { sex: 'm', hair: 'topknot', hat: 'headband', beard: 'stubble', robe: '#55707a', robe2: '#c9b48a', skin: '#d9ab84' } },

  heungbo: { name: '흥보', role: '가난하지만 마음씨 고운 동생', kind: 'human', art: { sex: 'm', hair: 'topknot', hat: 'gat', robe: '#d9cfb4', robe2: '#7b8c62', skin: '#efcca9', patched: true } },
  nolbo: { name: '놀보', role: '욕심 많고 심술궂은 형', kind: 'human', art: { sex: 'm', hair: 'topknot', hat: 'gat', beard: 'mustache', robe: '#7d3b34', robe2: '#d4a64a', skin: '#eac3a0', belly: true } },
  jebi: { name: '제비', role: '흥보에게 은혜를 입은 제비', kind: 'swallow', art: {} },
  heungbowife: { name: '흥보 아내', role: '흥보와 고생을 함께하는 아내', kind: 'human', art: { sex: 'f', hair: 'chignon', robe: '#c7b79a', robe2: '#a35d4a', skin: '#efcca9', patched: true } },

  tokki: { name: '토끼', role: '뭍에 사는 꾀 많은 토끼', kind: 'rabbit', art: { robe: '#e9b44c', robe2: '#c8463d' } },
  jara: { name: '자라(별주부)', role: '용왕의 충직한 신하', kind: 'turtle', art: { robe: '#3d6b5a', robe2: '#c9a24a' } },
  yongwang: { name: '용왕', role: '남해 수궁의 임금', kind: 'dragon', art: { robe: '#2f6e8f', robe2: '#e2b23c' } },

  jojo: { name: '조조', role: '백만 대군을 이끈 위나라의 장수', kind: 'human', art: { sex: 'm', hair: 'topknot', hat: 'helmet', beard: 'goatee', robe: '#4a4a52', robe2: '#b8892f', skin: '#e8c29c' } },
  jegal: { name: '제갈량', role: '바람을 읽는 촉나라의 책사', kind: 'human', art: { sex: 'm', hair: 'topknot', hat: 'yunggeon', beard: 'thin', robe: '#e4e0d2', robe2: '#3b5d7a', skin: '#f1d2b4', fan: true } },
  gwanu: { name: '관우', role: '의리를 지키는 촉나라의 장수', kind: 'human', art: { sex: 'm', hair: 'topknot', hat: 'helmet', beard: 'long', robe: '#2f6b47', robe2: '#c9a24a', skin: '#c9634a' } },
  gunsa: { name: '군사', role: '고향을 떠나 끌려온 조조의 병사', kind: 'human', art: { sex: 'm', hair: 'topknot', hat: 'helmet', robe: '#77705e', robe2: '#a8462f', skin: '#e3bb94' } },

  // 새 배경에서 AI가 이름을 붙여 쓸 수 있는 보조 인물
  extra_youth: { name: '친구', role: '보조 인물(젊은이)', kind: 'human', extra: true, art: { sex: 'f', hair: 'short', robe: '#6a9a9e', robe2: '#f1e6c8', skin: '#f2d3b6' } },
  extra_elder: { name: '어르신', role: '보조 인물(어른)', kind: 'human', extra: true, art: { sex: 'm', hair: 'topknot', hat: 'gat', beard: 'long', robe: '#b9ae95', robe2: '#5e5a4a', skin: '#e7c4a2', elder: true } },
  extra_official: { name: '관리', role: '보조 인물(관리·상사)', kind: 'human', extra: true, art: { sex: 'm', hair: 'topknot', hat: 'samo', beard: 'mustache', robe: '#4b5d7a', robe2: '#c9a24a', skin: '#ecc9a8' } },
  extra_robot: { name: '로봇', role: '보조 인물(기계·인공지능)', kind: 'robot', extra: true, art: {} },
};
export const CHARACTER_IDS = Object.keys(CHARACTERS);

// 배경 선택지. 'original'은 원작 배경 유지.
export const SETTINGS = {
  original: { id: 'original', name: '원작 배경 유지', desc: '원래의 시대와 세계에서 출발해, 이야기의 흐름만 바꿉니다.', costume: 'traditional' },
  campus: { id: 'campus', name: '현대 대학 캠퍼스', desc: '등록금, 조별 과제, 동아리… 인물들이 오늘의 대학생이 됩니다.', costume: 'modern' },
  company: { id: 'company', name: '회사', desc: '스타트업과 대기업, 인턴과 대표. 갈등이 일터로 옮겨 갑니다.', costume: 'modern' },
  future: { id: 'future', name: '미래 도시', desc: '로봇과 인공지능이 사는 2150년의 도시에서 이야기가 시작됩니다.', costume: 'future' },
  custom: { id: 'custom', name: '직접 정하기', desc: '원하는 세계를 한 줄로 적어 주세요. (AI 연결 시)', costume: 'modern' },
};

export const BACKGROUNDS = {
  gwanghallu: '광한루 누각과 그넷줄 매인 나무(봄)',
  village: '초가집 마을과 싸리 울타리',
  room: '방 안(문살 창, 병풍)',
  prison: '옥방(나무 창살, 어둠)',
  palace: '관아·궁궐 대청(기와, 붉은 기둥)',
  market: '장터 골목(천막, 등불)',
  mountain: '깊은 산중(소나무, 폭포, 달)',
  seashore: '바닷가(바위, 물결, 해)',
  riverboat: '바다 위 배(돛, 큰 물결)',
  undersea: '바닷속 수궁(산호, 물방울, 궁궐)',
  battlefield: '강 위의 전함들과 불길(적벽)',
  campus: '현대 대학 캠퍼스(건물, 나무, 벤치)',
  classroom: '강의실·동아리방(칠판, 책상)',
  office: '회사 사무실(유리창, 빌딩 숲)',
  cityNight: '도시의 밤거리(네온, 골목)',
  futureCity: '미래 도시(공중 궤도, 탑)',
};
export const BACKGROUND_IDS = Object.keys(BACKGROUNDS);

export const TINTS = ['day', 'dawn', 'dusk', 'night', 'storm'];

export const PROPS = {
  fan: '부채', scroll: '두루마리·편지', gourd: '박', seed: '박씨', coins: '엽전·돈',
  rice: '쌀가마', lantern: '등불', phone: '휴대폰', laptop: '노트북', contract: '계약서',
  robotPart: '부서진 기계 부품', medicine: '약사발', ship: '작은 배', sword: '칼', drum: '북',
};
export const PROP_IDS = Object.keys(PROPS);

export const EFFECTS = {
  none: '효과 없음', petals: '꽃잎이 흩날림', rain: '비', waves: '물결이 일렁임',
  bubbles: '물방울', fire: '불길', wind: '바람', sparkle: '반짝임', ink: '먹물 번짐', shake: '화면 흔들림',
};
export const EFFECT_IDS = Object.keys(EFFECTS);

export const EXPRESSIONS = ['neutral', 'happy', 'sad', 'angry', 'surprised', 'sly', 'worried', 'determined'];
export const POSITIONS = ['left', 'center', 'right'];

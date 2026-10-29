// 각본 모드 — AI가 연결되지 않았거나 응답에 실패했을 때 쓰는, 미리 쓴 짧은 평행세계 판소리.
// 각 이야기는 4장면(도입 → 전개 → 절정 → 결말)이고, 앞선 선택이 뒤 장면의 대사·결말에 반영된다.
// 장면 함수는 f(이전 선택 기록: { s1, s2, s3 })를 받아 장면 데이터를 돌려준다.

const N = 'narrator';

// 짧은 표기를 장면 데이터로 바꾸는 도우미
function scene({ title, summary, bg, tint = 'day', costume = 'traditional', cast, props = [], effect = 'none', aniri, chang, compare = null, learn = null, choices = [], ledger = {}, ending = null }) {
  return {
    title,
    summary,
    stage: {
      background: bg, tint, costume, props, effect,
      characters: cast.map(([id, expression, position, name]) => ({ id, expression, position, name })),
    },
    aniri: aniri.map(([speaker, text]) => ({ speaker, text })),
    chang: chang ? { lines: chang[0], jangdan: chang[1], jo: chang[2], singer: chang[3] || N, why: chang[4] } : null,
    compareJangdan: compare,
    learn: learn ? { type: learn[0], id: learn[1] } : null,
    choices: choices.map(([key, label, hint]) => ({ key, label, hint })),
    ledger: { relationships: [], items: [], unresolved: [], facts: [], ...ledger },
    ending,
  };
}
const by = (v, map) => map[v] ?? map._;

// ───────────────────────── 수궁가 · 원작 배경 ─────────────────────────
const sugungOriginal = [
  () => scene({
    title: '뭍에 오른 자라',
    summary: '용왕의 병을 고칠 토끼 간을 구하러 뭍에 오른 자라가 토끼를 만나 수궁 벼슬을 권했다.',
    bg: 'seashore', cast: [['jara', 'determined', 'left'], ['tokki', 'surprised', 'right']], props: ['scroll'], effect: 'waves',
    aniri: [
      [N, '남해 용왕이 깊은 병이 들었는데, 약은 오직 토끼의 간뿐이라 하것다.'],
      [N, '충직한 자라가 토끼 그림 한 장 품에 안고 처음으로 뭍에 오르는구나.'],
      ['jara', '여보시오, 토 선생! 수궁에 가시면 높은 벼슬에 산해진미가 기다린다오.'],
      ['tokki', '벼슬이라… 구미가 당기기는 하는데, 어째 말이 너무 달구먼.'],
    ],
    chang: [['푸른 물결 넘실넘실', '처음 보는 뭍 세상에', '자라 목을 길게 빼고', '토끼 찾아 두리번두리번'], 'jungjungmori', 'pyeong', 'jara',
      '이 장면에서는 처음 뭍에 오른 자라의 들뜬 마음을 따라가도록, 춤추듯 흥이 나는 중중모리로 경치를 늘어놓았습니다.'],
    compare: 'jinyang',
    learn: ['passage', 'gogocheonbyeon'],
    choices: [
      ['follow', '벼슬 약속을 믿고 자라 등에 올라탄다', '빠르게 수궁에 가지만, 아무 대비 없이 간다.'],
      ['contract', '벼슬을 문서로 써 달라고 요구한다', '자라와 줄다리기가 시작되고, 증표가 남는다.'],
      ['spy', '따라가는 척하며 수궁 사정을 캐묻는다', '자라의 속마음과 용왕의 병을 먼저 알게 된다.'],
    ],
    ledger: { relationships: ['자라는 토끼를 수궁으로 데려가야 한다'], unresolved: ['용왕의 병', '토끼 간을 노리는 진짜 목적'] },
  }),
  (f) => scene({
    title: '용궁의 큰 잔치, 그리고 칼',
    summary: '수궁에 도착한 토끼에게 용왕이 간을 내놓으라 명했다.',
    bg: 'undersea', tint: 'dusk', cast: [['yongwang', 'angry', 'center'], ['tokki', 'worried', 'left'], ['jara', 'worried', 'right']], props: ['sword', 'medicine'], effect: 'bubbles',
    aniri: [
      [N, by(f.s1, {
        follow: '자라 등에 덥석 올라탄 토끼, 바닷속 궁궐에 닿자마자 군사들에게 꽁꽁 묶이는구나.',
        contract: '벼슬 문서를 품에 넣고 당당히 들어선 토끼, 그런데 문서에 찍힌 도장이 어째 가짜로구나.',
        spy: '오는 길에 자라를 살살 구슬린 토끼는, 용왕이 간을 노린다는 것을 이미 알고 들어섰것다.',
      })],
      ['yongwang', '네 간이 과인의 병을 고칠 약이라 하니, 어서 배를 갈라 간을 내놓아라!'],
      ['tokki', by(f.s1, { spy: '(이미 알고 있었지만) 이제부터가 진짜 승부로구나.', _: '아이고, 벼슬은커녕 목숨이 위태롭게 되었구나!' })],
    ],
    chang: [['칼 든 군사 우루루루', '토끼 몸을 휘어잡고', '용왕 호령 벼락같다', '이 일을 어찌할꼬'], 'jajinmori', 'gyemyeon', N,
      '이 장면에서는 순식간에 궁궐이 칼끝으로 바뀌는 급박함을 살리려고, 말을 빠르게 몰아가는 자진모리를 골랐습니다.'],
    compare: 'jungmori',
    learn: ['jangdan', 'jajinmori'],
    choices: [
      ['trick', '"간은 뭍에 두고 왔다"고 능청을 떤다', '원작처럼 꾀로 버티지만, 이번 용왕은 의심이 많다.'],
      ['doctor', '용왕의 병을 진맥하겠다며 의원 행세를 한다', '간 대신 진짜 병의 원인을 찾아야 한다.'],
      ['ally', '자라에게 함께 살 길을 찾자고 속삭인다', '충신 자라를 내 편으로 만들 수 있을까?'],
    ],
    ledger: {
      relationships: ['용왕은 토끼의 간을 원한다', by(f.s1, { spy: '토끼는 자라의 속마음을 알고 있다', _: '자라는 토끼를 속였다' })],
      items: f.s1 === 'contract' ? ['가짜 도장이 찍힌 벼슬 문서'] : [],
      unresolved: ['용왕의 병', '토끼의 목숨'],
    },
  }),
  (f) => scene({
    title: '바닷속의 긴 밤',
    summary: '토끼의 한마디가 수궁을 뒤흔들었고, 마지막 결단의 밤이 찾아왔다.',
    bg: 'undersea', tint: 'night', cast: [['tokki', 'sad', 'center'], ['jara', by(f.s2, { ally: 'determined', _: 'worried' }), 'right']], props: ['lantern'], effect: 'bubbles',
    aniri: [
      [N, by(f.s2, {
        trick: '"간을 뭍에 두고 왔소!" 하는 말에 용왕은 반만 믿고, 토끼를 옥에 가둔 채 날이 밝기를 기다리는구나.',
        doctor: '토끼가 용왕의 맥을 짚어 보니, 병은 간이 아니라 밤낮 잔치에 기름진 음식 탓이었것다.',
        ally: '자라도 실은 용왕의 명이 옳은지 밤마다 괴로워하고 있었구나.',
      })],
      ['jara', by(f.s2, {
        trick: '토 선생, 날이 밝으면 군사들이 뭍까지 따라간다 하오. 거짓이 들통나면 끝이오.',
        doctor: '토 선생 말이 맞소. 허나 용왕께서 그 말을 들어주실지…',
        ally: '내 평생 충성만 알았는데, 남의 목숨으로 산다는 것이 충성이오?',
      })],
      ['tokki', '푸른 산 맑은 물, 두고 온 내 집이 오늘따라 그립구나.'],
    ],
    chang: [['청산은 멀어지고', '물빛만 깊어 가니', '두고 온 산골 집이', '꿈결같이 그립구나'], 'jinyang', 'gyemyeon', 'tokki',
      '이 장면에서는 갇힌 토끼의 그리움을 한 음 한 음 길게 늘여 들려주려고, 가장 느린 진양조를 골랐습니다.'],
    compare: 'jajinmori',
    learn: ['element', 'sigimsae'],
    choices: [
      ['crowd', '수궁 백성들 앞에서 용왕 병의 진실을 알린다', '용왕의 체면이 걸린 큰 판이 벌어진다.'],
      ['deal', '용왕과 단둘이 거래를 제안한다', '목숨 대신 내놓을 무언가가 필요하다.'],
      ['escape', '자라와 함께 몰래 수궁을 빠져나간다', '자라는 고향과 임금을 모두 등지게 된다.'],
    ],
    ledger: {
      facts: [by(f.s2, { doctor: '용왕의 병은 간이 아니라 과식과 향락 때문이다', trick: '토끼는 간을 뭍에 두고 왔다고 거짓말했다', ally: '자라는 용왕의 명에 의문을 품었다' })],
      unresolved: ['토끼가 살아서 뭍에 돌아갈 수 있을까', '용왕의 병'],
    },
  }),
  (f) => {
    const endings = {
      crowd: {
        title: '판을 바꾼 토끼의 소리', expr: 'happy', bg: 'undersea',
        summary: `토끼는 수궁 백성들 앞에서 ${f.s2 === 'doctor' ? '진맥한 결과를 낱낱이 밝히며' : '목청을 돋우어'} 용왕의 병이 남의 간이 아니라 스스로의 생활에서 왔다고 소리했다. 백성들이 "옳소!" 하며 추임새를 넣자 용왕도 고개를 숙이고 잔치를 줄이기로 약속했다. 토끼는 수궁의 명예 손님이 되어 당당히 뭍으로 돌아갔다.`,
        changes: ['꾀로 속이고 달아나는 대신, 진실을 소리로 알려 위기를 넘었다', '용왕이 스스로 잘못을 인정했다', '자라는 토끼를 배웅하는 벗이 되었다'],
      },
      deal: {
        title: '간 대신 내놓은 것', expr: 'sly', bg: 'seashore',
        summary: `토끼는 간 대신 뭍의 약초 지도를 내놓겠다고 거래했다. ${f.s1 === 'contract' ? '이번에는 가짜 도장이 아닌 진짜 옥새를 받아 두었으니 빈틈이 없었다.' : '용왕은 문서에 옥새를 꾹 찍었다.'} 자라는 지도를 들고 해마다 약초를 캐러 오고, 토끼는 수궁과 거래하는 뭍의 큰손이 되었다.`,
        changes: ['목숨을 건 속임수가 거래와 약속으로 바뀌었다', '토끼와 수궁이 계속 이어지는 관계가 되었다', '용왕은 간 대신 약초로 병을 다스리게 되었다'],
      },
      escape: {
        title: '둘이 떠난 바닷길', expr: 'determined', bg: 'seashore',
        summary: `달 없는 밤, 자라는 토끼를 등에 태우고 몰래 수궁을 빠져나왔다. ${f.s2 === 'ally' ? '처음부터 마음이 통했던 둘은 ' : '서로를 의심하던 둘은 바닷길에서 '}고향 이야기를 나누며 벗이 되었다. 뭍에 닿은 자라는 돌아갈 곳을 잃었지만, 토끼의 산골에서 새 삶을 시작했다.`,
        changes: ['토끼 혼자가 아니라 자라와 함께 탈출했다', '충신 자라가 명령보다 양심을 택했다', '토끼가 자라를 놀리는 대신 벗으로 맞았다'],
      },
    };
    const e = endings[f.s3] || endings.crowd;
    return scene({
      title: e.title,
      summary: e.summary,
      bg: e.bg, tint: f.s3 === 'escape' ? 'dawn' : 'day', cast: [['tokki', e.expr, 'left'], ['jara', 'happy', 'right'], ...(f.s3 === 'crowd' ? [['yongwang', 'worried', 'center']] : [])],
      props: f.s3 === 'deal' ? ['contract', 'medicine'] : [], effect: 'sparkle',
      aniri: [[N, e.summary.split('. ')[0] + '.'], ['tokki', '얼씨구나 좋을시고, 이것이 나의 판이로다!']],
      chang: [['얼씨구나 좋을시고', '살았구나 살았구나', '새로 짠 이 한바탕', '모두 함께 즐겨 보세'], 'jungjungmori', 'pyeong', 'tokki',
        '이 장면에서는 위기를 넘긴 기쁨을 함께 나누도록, 어깨가 들썩이는 중중모리로 마무리했습니다.'],
      learn: ['element', 'chuimsae'],
      ending: { title: e.title, summary: e.summary, changes: e.changes },
    });
  },
];

// ───────────────────────── 수궁가 · 회사 ─────────────────────────
const sugungCompany = [
  () => scene({
    title: '수궁 주식회사의 스카우트',
    summary: '수궁 주식회사 자라 팀장이 프리랜서 토끼에게 파격적인 인턴 제안을 했다.',
    bg: 'office', costume: 'modern', cast: [['jara', 'happy', 'left', '자라 팀장'], ['tokki', 'sly', 'right', '토끼']], props: ['contract', 'laptop'],
    aniri: [
      [N, '바다 건너 수궁 주식회사, 용왕 회장이 건강 악화로 쓰러졌것다.'],
      ['jara', '토끼 씨, 연봉 두 배에 회장님 직속 인턴! 계약서에 서명만 하시면 됩니다.'],
      ['tokki', '좋은 건 알겠는데… 계약서 맨 뒷장이 왜 이렇게 두꺼워요?'],
    ],
    chang: [['연봉 두 배 회장 직속', '꿈같은 말 솔깃하나', '깨알 같은 계약 조항', '토끼 눈이 가늘어진다'], 'jungmori', 'pyeong', N,
      '이 장면에서는 계약서 조항을 하나하나 짚어 보는 차분한 긴장을 살리려고, 사설이 또렷이 들리는 중모리를 골랐습니다.'],
    compare: 'jajinmori',
    learn: ['element', 'pansori'],
    choices: [
      ['sign', '일단 서명하고 회사에 들어가 본다', '빠르게 기회를 잡지만 숨은 조항을 모른다.'],
      ['read', '숨은 조항을 끝까지 읽고 수정을 요구한다', '자라 팀장과 협상이 시작된다.'],
      ['friend', '같은 제안을 받은 다른 동물들을 수소문한다', '혼자가 아니라 함께 판단할 수 있다.'],
    ],
    ledger: { relationships: ['자라 팀장은 토끼를 꼭 데려가야 한다'], items: ['수궁 주식회사 계약서'], unresolved: ['계약서 뒷장의 숨은 조항'] },
  }),
  (f) => scene({
    title: '"간 기증 동의서"',
    summary: '숨은 조항은 회장에게 간을 기증한다는 동의서였다.',
    bg: 'office', tint: 'dusk', costume: 'modern', cast: [['yongwang', 'surprised', 'center', '용왕 회장'], ['tokki', 'angry', 'left', '토끼'], ['jara', 'worried', 'right', '자라 팀장']], props: ['contract', 'medicine'], effect: 'shake',
    aniri: [
      [N, by(f.s1, {
        sign: '첫 출근 날, 인사팀이 내민 서류 맨 뒤에 "간 기증 동의서"가 끼워져 있었구나.',
        read: '토끼가 끝까지 읽어 보니, 맨 뒷장은 다름 아닌 "간 기증 동의서"였것다.',
        friend: '수소문해 보니, 작년 인턴 다람쥐도 같은 동의서를 받고 사라졌다 하는구나.',
      })],
      ['yongwang', '자네 간이 내게 맞는다는 검사 결과가 있네. 회사를 위해 결단해 주게.'],
      ['tokki', '회사를 위해서라면서, 왜 제 몸을 걸어야 합니까?'],
    ],
    chang: [['회장실 문 쾅 닫히고', '보안 요원 우르르르', '계약서는 바르르르', '토끼 심장 두근두근'], 'hwimori', 'gyemyeon', N,
      '이 장면에서는 문이 닫히고 사람들이 몰려드는 짧고 급박한 순간을 휘몰아치듯 들려주려고, 가장 빠른 휘모리를 골랐습니다.'],
    compare: 'jinyang',
    learn: ['jangdan', 'hwimori'],
    choices: [
      ['record', '대화를 몰래 녹음해 증거를 남긴다', '나중에 모두에게 진실을 알릴 무기가 된다.'],
      ['persuade', '자라 팀장에게 함께 문제를 제기하자고 설득한다', '자라의 회사 생활이 걸려 있다.'],
      ['bluff', '"제 간은 집 금고에 두고 왔다"며 시간을 번다', '원작의 꾀를 오늘식으로 써 본다.'],
    ],
    ledger: { facts: ['계약서 뒷장은 간 기증 동의서였다'], relationships: ['용왕 회장은 토끼의 간을 원한다'], unresolved: ['토끼가 회사를 무사히 나갈 수 있을까'] },
  }),
  (f) => scene({
    title: '야근하는 자라',
    summary: '밤늦은 사무실에서 자라 팀장이 자신의 고민을 털어놓았다.',
    bg: 'cityNight', tint: 'night', costume: 'modern', cast: [['jara', 'sad', 'center', '자라 팀장'], ['tokki', 'neutral', 'left', '토끼']], props: ['phone'],
    aniri: [
      [N, by(f.s2, {
        record: '토끼 휴대폰에는 회장의 목소리가 고스란히 담겼것다.',
        persuade: '자라 팀장은 한참을 말없이 모니터만 바라보았구나.',
        bluff: '"집 금고"라는 말에 회장은 내일 아침 함께 가자며 토끼를 놓아주었것다.',
      })],
      ['jara', '나도 이십 년을 이 회사에 바쳤소. 그런데 오늘은 내가 무엇을 지켜 온 건지 모르겠구려.'],
      ['tokki', '팀장님, 회사를 지키는 것과 사람을 지키는 건 다른 일 아닐까요?'],
    ],
    chang: [['불 꺼진 빌딩 숲에', '홀로 남은 자라 팀장', '이십 년 바친 세월이', '물거품만 같구나'], 'jinyang', 'gyemyeon', 'jara',
      '이 장면에서는 자라 팀장의 긴 한숨을 서두르지 않고 들려주려고, 느린 진양조에 떨고 꺾는 계면조 가락을 얹었습니다.'],
    compare: 'jungjungmori',
    learn: ['jo', 'gyemyeon'],
    choices: [
      ['public', '전 직원 회의에서 진실을 공개한다', '회사가 뒤집히지만 다시 일어설 수도 있다.'],
      ['cure', '회장의 진짜 치료법을 함께 찾아 나선다', '간 말고도 길이 있음을 증명해야 한다.'],
      ['leave', '자라 팀장과 함께 회사를 나와 새 일을 시작한다', '안정 대신 자유를 택한다.'],
    ],
    ledger: { relationships: ['자라 팀장은 회사에 회의를 느끼고 있다'], unresolved: ['회장의 건강', '토끼와 자라의 앞날'] },
  }),
  (f) => {
    const E = {
      public: ['소리판이 된 회의실', `토끼는 전 직원 회의에서 ${f.s2 === 'record' ? '녹음 파일을 틀어' : '자신이 겪은 일을 또박또박 말하며'} 숨은 조항을 밝혔다. 직원들의 박수와 추임새 속에 회장은 동의서를 없애겠다고 약속했고, 자라 팀장은 새 윤리위원장이 되었다.`, ['토끼 혼자 꾀로 빠져나가는 대신 모두 앞에서 진실을 밝혔다', '회사의 규칙 자체가 바뀌었다', '자라가 명령 대신 양심을 따랐다']],
      cure: ['간 없이 낫는 법', '토끼와 자라는 밤새 자료를 뒤져, 회장의 병이 과로와 회식 탓임을 밝혀냈다. 회장은 휴식과 산책을 시작했고, 토끼는 정식 직원이 되어 사내 건강 프로젝트를 이끌게 되었다.', ['간을 빼앗는 대신 병의 진짜 원인을 찾았다', '토끼가 회사에 남아 변화를 이끌었다', '용왕이 생활을 바꾸어 병을 다스렸다']],
      leave: ['토끼와 자라의 스타트업', '둘은 사표를 내고 작은 회사를 차렸다. 이름은 "판"—누구도 몸을 걸지 않아도 되는 일터를 만들겠다는 뜻이었다. 첫 고객은 놀랍게도 휴가 중인 용왕 회장이었다.', ['토끼가 자라를 놀리고 떠나는 대신 함께 새 길을 열었다', '거대한 회사가 아닌 작은 일터를 택했다', '용왕과도 새로운 관계를 맺었다']],
    }[f.s3] || null;
    const [title, summary, changes] = E || ['새로운 판', '토끼는 위기를 넘겼다.', []];
    return scene({
      title, summary, bg: f.s3 === 'leave' ? 'campus' : 'office', tint: 'dawn', costume: 'modern',
      cast: [['tokki', 'happy', 'left', '토끼'], ['jara', 'happy', 'right', '자라']], props: ['laptop'], effect: 'sparkle',
      aniri: [[N, summary.split('. ')[0] + '.'], ['tokki', '얼씨구! 오늘의 판은 우리가 짰구나!']],
      chang: [['얼씨구나 좋을씨고', '숨은 조항 사라지고', '토끼 자라 손을 잡고', '새 아침을 맞는구나'], 'jungjungmori', 'pyeong', 'tokki',
        '이 장면에서는 긴 밤이 끝난 홀가분함을 함께 즐기도록 흥겨운 중중모리로 맺었습니다.'],
      learn: ['element', 'chuimsae'],
      ending: { title, summary, changes },
    });
  },
];

// ───────────────────────── 흥보가 · 현대 대학 캠퍼스 ─────────────────────────
const heungboCampus = [
  () => scene({
    title: '고장 난 배달 로봇 "제비"',
    summary: '등록금 걱정에 아르바이트 가던 대학생 흥보가 고장 난 배달 로봇 제비를 발견했다.',
    bg: 'campus', costume: 'modern', cast: [['heungbo', 'worried', 'left', '대학생 흥보'], ['jebi', 'sad', 'right', '배달 로봇 제비']], props: ['robotPart', 'phone'],
    aniri: [
      [N, '등록금 납부를 사흘 앞둔 대학생 흥보, 편의점 아르바이트에 늦을세라 뛰어가는데.'],
      [N, '캠퍼스 화단에 다리 바퀴가 부러진 배달 로봇 하나가 삐익삐익 울고 있것다.'],
      ['jebi', '삐-익… 배터리 7%… 도움… 필요…'],
      ['heungbo', '고치면 지각이고, 그냥 가자니 발이 안 떨어지네.'],
    ],
    chang: [['등록금은 사흘 남고', '알바 시간 코앞인데', '화단 속에 우는 제비', '흥보 발길 멈추누나'], 'jungmori', 'gyemyeon', 'heungbo',
      '이 장면에서는 흥보가 망설이는 마음을 차근차근 따라가도록, 사설이 또렷한 중모리를 골랐습니다.'],
    compare: 'jajinmori',
    learn: ['element', 'pansori'],
    choices: [
      ['alone', '아르바이트를 포기하고 직접 고친다', '생활비가 줄지만 제비와 특별한 인연이 생긴다.'],
      ['club', '공학 동아리 친구들을 불러 함께 고친다', '함께 해결하지만 보상에도 여러 사람이 얽힌다.'],
      ['nolbo', '창업가 형 놀보에게 수리비를 부탁한다', '형은 도움의 대가로 조건을 내건다.'],
    ],
    ledger: { relationships: ['흥보와 놀보는 형제지만 사이가 멀다'], items: ['부러진 바퀴 부품'], unresolved: ['등록금', '제비의 주인'] },
  }),
  (f) => scene({
    title: '제비가 물어 온 것',
    summary: '수리된 제비가 이상한 "씨앗 칩"을 흥보에게 건넸다.',
    bg: by(f.s1, { club: 'classroom', nolbo: 'office', _: 'campus' }), costume: 'modern',
    cast: [['jebi', 'happy', 'center', '제비'], ['heungbo', 'surprised', 'left', '흥보'], ...(f.s1 === 'club' ? [['extra_youth', 'happy', 'right', '동아리 친구 박씨']] : f.s1 === 'nolbo' ? [['nolbo', 'sly', 'right', '놀보 대표']] : [])],
    props: ['seed'], effect: 'sparkle',
    aniri: [
      [N, by(f.s1, {
        alone: '밤새 납땜을 한 흥보, 알바는 잘렸지만 제비는 씽씽 날아올랐구나.',
        club: '동아리방에서 왁자지껄 고친 제비, 친구들이 저마다 "내가 고쳤다" 하며 웃는구나.',
        nolbo: '놀보 대표가 수리비를 내주며 말하기를, "이 로봇에서 나오는 건 반은 내 것이다."',
      })],
      ['jebi', '은혜 갚기 프로토콜 실행. 이 "씨앗 칩"을 드립니다.'],
      ['heungbo', '박씨… 아니 씨앗 칩? 이걸 꽂으면 뭐가 나오는데?'],
    ],
    chang: [['강남 서버 멀리 돌아', '제비 한 쌍 날아든다', '물고 온 건 씨앗 칩', '반짝반짝 빛나누나'], 'jungjungmori', 'pyeong', 'jebi',
      '이 장면에서는 제비가 날아드는 신나는 길을 늘어놓듯 그리려고, 흥겨운 중중모리를 골랐습니다.'],
    compare: 'jungmori',
    learn: ['passage', 'jebinojeonggi'],
    choices: [
      ['open', '씨앗 칩을 바로 노트북에 꽂아 본다', '무엇이 쏟아질지 아무도 모른다.'],
      ['share', '함께한 사람들과 칩을 어떻게 쓸지 회의한다', '나누는 방법부터 정해야 한다.'],
      ['owner', '제비의 원래 주인을 먼저 찾아 나선다', '칩의 정체와 제비의 사연을 알게 된다.'],
    ],
    ledger: { items: ['씨앗 칩'], relationships: [by(f.s1, { alone: '제비는 흥보를 특별히 따른다', club: '동아리 친구들도 제비와 인연이 생겼다', nolbo: '놀보는 칩의 절반을 요구한다' })], unresolved: ['씨앗 칩의 정체', '등록금'] },
  }),
  (f) => scene({
    title: '박 타는 밤',
    summary: '씨앗 칩에서 나온 것을 두고 사람들의 욕심과 마음이 엇갈렸다.',
    bg: 'cityNight', tint: 'night', costume: 'modern',
    cast: [['heungbo', 'worried', 'left', '흥보'], ['nolbo', by(f.s1, { nolbo: 'angry', _: 'sly' }), 'right', '놀보 대표'], ['jebi', 'neutral', 'center', '제비']],
    props: ['laptop', 'gourd'],
    aniri: [
      [N, by(f.s2, {
        open: '칩을 꽂자 화면 가득 "장학 재단 비밀 계좌"가 열렸것다.',
        share: '모두 둘러앉아 칩을 여니, 그 안엔 버려진 배달 로봇들을 살릴 설계도가 들어 있었구나.',
        owner: '주인을 찾아가 보니, 제비를 만든 노교수가 평생 모은 장학금을 맡길 사람을 찾고 있었구나.',
      })],
      ['nolbo', '그건 내 투자 덕분이야! 형한테 반은 넘겨야지.'],
      ['heungbo', '형, 이건 우리 둘만의 것이 아닌 것 같아.'],
    ],
    chang: [['시르렁 실근 톱질이야', '열어 보자 이 박 속을', '쏟아지는 것이 무엇이냐', '사람 마음 시험하네'], 'jinyang', 'gyemyeon', 'heungbo',
      '이 장면에서는 원작의 박타령처럼 한 톱 한 톱 천천히 켜는 긴장을 살리려고, 느린 진양조를 골랐습니다.'],
    compare: 'jajinmori',
    learn: ['passage', 'baktaryeong'],
    choices: [
      ['give', '모두 학교 친구들의 장학금으로 내놓는다', '흥보 몫은 줄지만 많은 사람이 웃는다.'],
      ['brother', '놀보 형과 함께 쓰되 조건을 건다', '형제 관계를 다시 써 볼 기회다.'],
      ['keep', '등록금만 쓰고 나머지는 제비에게 맡긴다', '제비가 스스로 선택하게 한다.'],
    ],
    ledger: { relationships: ['놀보는 칩의 몫을 요구하며 흥보와 맞선다'], unresolved: ['칩의 가치를 어떻게 나눌까', '형제 관계'] },
  }),
  (f) => {
    const E = {
      give: ['모두의 박', `흥보는 칩의 가치를 친구들의 장학금으로 내놓았다. ${f.s1 === 'club' ? '함께 제비를 고친 동아리 친구들이 장학 위원이 되었고' : '소문을 들은 학생들이 줄을 섰고'}, 학기 말 축제에서 모두가 흥보에게 추임새를 넣었다. 놀보도 멋쩍게 첫 기부자로 이름을 올렸다.`, ['박에서 나온 보물이 한 집이 아니라 모두에게 돌아갔다', '놀보가 벌을 받는 대신 스스로 나눔에 참여했다', '보상이 돈이 아니라 공동체의 기회로 바뀌었다']],
      brother: ['형제의 계약서', '흥보는 형과 함께 버려진 로봇을 고치는 회사를 차리되, "이익의 절반은 장학금"이라는 조건을 걸었다. 놀보는 투덜대면서도 서명했고, 형제는 처음으로 같은 편이 되었다.', ['놀보가 망하는 대신 동생과 손잡았다', '박의 보물이 사업 밑천이 되었다', '형제 관계가 조건이 있는 협력으로 바뀌었다']],
      keep: ['제비의 선택', '흥보는 등록금만큼만 쓰고 나머지를 제비에게 맡겼다. 제비는 캠퍼스를 날며 등록금이 모자란 학생들을 찾아 나섰고, 흥보는 그 길을 지도로 그려 주는 첫 번째 친구가 되었다.', ['보물의 쓰임을 사람이 아닌 제비가 정했다', '흥보가 제 몫을 욕심내지 않았다', '제비와 흥보가 은혜를 갚는 관계에서 동료가 되었다']],
    }[f.s3] || ['새로운 박', '흥보의 이야기는 새로운 판으로 이어졌다.', []];
    const [title, summary, changes] = E;
    return scene({
      title, summary, bg: 'campus', tint: 'dawn', costume: 'modern',
      cast: [['heungbo', 'happy', 'left', '흥보'], ['jebi', 'happy', 'center', '제비'], ['nolbo', f.s3 === 'brother' ? 'happy' : 'sly', 'right', '놀보']],
      props: ['gourd', 'coins'], effect: 'petals',
      aniri: [[N, summary.split('. ')[0] + '.'], ['heungbo', '얼씨구! 박 속보다 사람 속이 더 귀하구나!']],
      chang: [['얼씨구나 절씨구나', '박 속에서 나온 복을', '너도 나도 나눠 보세', '캠퍼스가 들썩인다'], 'jungjungmori', 'pyeong', 'heungbo',
        '이 장면에서는 나눔의 기쁨을 모두가 함께 즐기도록, 흥겨운 중중모리로 맺었습니다.'],
      learn: ['element', 'chuimsae'],
      ending: { title, summary, changes },
    });
  },
];

// ───────────────────────── 흥보가 · 원작 배경 ─────────────────────────
const heungboOriginal = [
  () => scene({
    title: '처마 밑의 제비',
    summary: '가난한 흥보가 다리 다친 제비를 발견했다.',
    bg: 'village', cast: [['heungbo', 'worried', 'left'], ['jebi', 'sad', 'center'], ['heungbowife', 'neutral', 'right']], props: ['rice'],
    aniri: [
      [N, '형 놀보에게 쫓겨난 흥보, 쌀 한 톨 없는 초가집에 자식들만 주렁주렁하것다.'],
      [N, '하루는 처마 밑 제비 새끼가 구렁이를 피하다 떨어져 다리가 부러졌구나.'],
      ['heungbowife', '여보, 우리 먹을 것도 없는데 저 제비를 어쩌시려오?'],
    ],
    chang: [['처마 끝에 떨어진 제비', '다리 하나 부러지고', '흥보 마음 쓰리구나', '어찌하면 살려 낼꼬'], 'jungmori', 'gyemyeon', 'heungbo',
      '이 장면에서는 흥보의 안타까운 마음을 차분히 풀어내려고, 중모리를 골랐습니다.'],
    compare: 'jajinmori',
    learn: ['element', 'pansori'],
    choices: [
      ['heal', '마지막 쌀을 팔아 제비 약을 산다', '식구들은 굶지만 제비는 살아난다.'],
      ['nolbo', '놀보 집에 가서 약값을 빌린다', '놀보가 조건을 내건다.'],
      ['village', '마을 사람들에게 함께 돌보자고 청한다', '흥보네 일이 마을의 일이 된다.'],
    ],
    ledger: { relationships: ['놀보는 흥보를 내쫓았다'], unresolved: ['흥보네 굶주림', '제비의 다리'] },
  }),
  (f) => scene({
    title: '강남 갔던 제비',
    summary: '이듬해 봄, 제비가 박씨를 물고 돌아왔다.',
    bg: 'village', tint: 'dawn', cast: [['jebi', 'happy', 'center'], ['heungbo', 'surprised', 'left'], ...(f.s1 === 'nolbo' ? [['nolbo', 'sly', 'right']] : [['heungbowife', 'happy', 'right']])], props: ['seed'], effect: 'petals',
    aniri: [
      [N, by(f.s1, {
        heal: '쌀을 판 흥보네는 겨울 내내 죽만 쑤어 먹었지만, 제비는 훨훨 강남으로 날아갔것다.',
        nolbo: '놀보는 약값을 내주며 "제비가 은혜를 갚거든 반은 내 것"이라 못을 박았구나.',
        village: '온 마을이 번갈아 제비를 돌보니, 흥보네 마당이 사랑방이 되었구나.',
      })],
      ['jebi', '지지배배, 은혜 갚으러 왔지요. 이 박씨를 심으세요.'],
    ],
    chang: [['강남서 떠난 제비', '바다 건너 산을 넘어', '흥보 집을 찾아드니', '봄빛이 완연하다'], 'jungjungmori', 'pyeong', 'jebi',
      '이 장면에서는 먼 길을 날아오는 제비의 가벼운 날갯짓을 그리려고 흥겨운 중중모리를 골랐습니다.'],
    compare: 'jinyang',
    learn: ['passage', 'jebinojeonggi'],
    choices: [
      ['plant', '박씨를 지붕 위에 심는다', '원작처럼 박이 열리기를 기다린다.'],
      ['ask', '제비에게 박씨의 정체를 묻는다', '숨은 사연을 먼저 듣는다.'],
      ['divide', '박씨를 쪼개 마을 밭에 나눠 심는다', '한 집이 아닌 마을의 박이 된다.'],
    ],
    ledger: { items: ['박씨'], unresolved: ['박 속에 무엇이 들었을까'] },
  }),
  (f) => scene({
    title: '시르렁 실근 톱질이야',
    summary: '박이 열리고, 톱질을 시작하려는데 놀보가 들이닥쳤다.',
    bg: 'village', tint: 'dusk', cast: [['heungbo', 'determined', 'left'], ['heungbowife', 'happy', 'center'], ['nolbo', 'angry', 'right']], props: ['gourd'],
    aniri: [
      [N, by(f.s2, {
        plant: '지붕 위에 박이 둥실둥실 열리니, 흥보 부부가 톱을 들고 올라앉았것다.',
        ask: '제비 말이, 이 박은 "가장 필요한 것"을 내어 주되 욕심을 내면 재앙이 된다 하는구나.',
        divide: '마을 밭마다 박이 열리니, 집집마다 톱 소리가 울려 퍼지는구나.',
      })],
      ['nolbo', '그 박, 내 것이다! 제비 다리는 원래 우리 집 처마에서 부러졌어!'],
    ],
    chang: [['시르렁 실근 톱질이야', '에여루 당거 주소', '이 박을 타거들랑', '밥 한 통만 나오너라'], 'jinyang', 'pyeong', 'heungbo',
      '이 장면에서는 한 톱 한 톱 박을 켜는 기대감을 천천히 쌓으려고, 원작의 박타령처럼 느린 진양조를 골랐습니다.'],
    compare: 'jajinmori',
    learn: ['passage', 'baktaryeong'],
    choices: [
      ['together', '놀보에게 함께 톱질하자고 손을 내민다', '형제가 같은 박을 탄다.'],
      ['refuse', '놀보를 돌려보내고 부부가 박을 탄다', '형과의 골은 깊어진다.'],
      ['judge', '마을 어른에게 박의 주인을 가려 달라 한다', '모두 앞에서 시비를 가린다.'],
    ],
    ledger: { relationships: ['놀보가 박을 자기 것이라 주장한다'], unresolved: ['박의 주인', '형제 관계'] },
  }),
  (f) => {
    const E = {
      together: ['한 박을 탄 형제', '흥보가 내민 톱 한쪽을 놀보가 마지못해 잡았다. 박에서 쌀과 비단이 쏟아지자 놀보는 처음으로 동생에게 "고맙다" 했다. 형제는 그 쌀로 마을 잔치를 열었다.', ['놀보가 제비 다리를 부러뜨려 망하는 대신, 동생과 함께 복을 받았다', '박의 보물이 마을 잔치로 이어졌다', '형제가 일찍 화해했다']],
      refuse: ['두 개의 박', '흥보 부부의 박에서는 밥과 옷이 나왔고, 샘이 난 놀보는 제 집에 몰래 박씨를 심었다. 그러나 놀보의 박에서는 빚 문서만 쏟아졌다. 흥보는 결국 형의 빚을 함께 갚기로 했다.', ['원작의 큰 흐름을 따르되, 흥보가 형의 빚을 갚는 방식으로 끝났다', '박 하나의 쓰임이 형제의 앞날을 갈랐다', '나눔이 늦게라도 이루어졌다']],
      judge: ['마을이 가린 시비', '마을 어른은 "제비를 살린 손이 박의 주인"이라 했다. 흥보는 박에서 나온 것을 마을과 나누고, 놀보에게는 제비 집을 지어 주는 일을 맡겼다. 놀보는 투덜대며 망치를 들었다.', ['형제 다툼을 마을 공동체가 풀었다', '놀보가 벌 대신 맡은 일로 관계를 회복했다', '박의 복이 나눔의 규칙이 되었다']],
    }[f.s3] || ['새로운 박', '흥보의 이야기는 새로운 판으로 이어졌다.', []];
    const [title, summary, changes] = E;
    return scene({
      title, summary, bg: 'village', tint: 'day',
      cast: [['heungbo', 'happy', 'left'], ['nolbo', f.s3 === 'refuse' ? 'sad' : 'happy', 'right'], ['jebi', 'happy', 'center']],
      props: ['gourd', 'rice', 'coins'], effect: 'petals',
      aniri: [[N, summary.split('. ')[0] + '.'], ['heungbo', '얼씨구나 좋다, 박 속에서 복이 터졌구나!']],
      chang: [['얼씨구나 좋을시고', '박 속에서 쌀이 나와', '온 동네가 배부르니', '이 아니 좋을쏘냐'], 'jungjungmori', 'pyeong', 'heungbo',
        '이 장면에서는 잔치의 흥을 함께 나누도록 중중모리로 맺었습니다.'],
      learn: ['element', 'chuimsae'],
      ending: { title, summary, changes },
    });
  },
];

// ───────────────────────── 춘향가 · 원작 배경 ─────────────────────────
const chunhyangOriginal = [
  () => scene({
    title: '광한루의 그네',
    summary: '단옷날 광한루에서 몽룡이 그네 뛰는 춘향을 보았다.',
    bg: 'gwanghallu', cast: [['chunhyang', 'happy', 'left'], ['mongryong', 'surprised', 'right'], ['bangja', 'sly', 'center']], props: ['fan'], effect: 'petals',
    aniri: [
      [N, '오월 단옷날, 남원 광한루에 봄바람이 살랑이는데.'],
      [N, '그넷줄 높이 차오르는 춘향을 보고, 부사 아들 이몽룡의 넋이 쏙 빠졌것다.'],
      ['bangja', '도련님, 저 아가씨는 퇴기 월매의 딸 춘향인데 콧대가 하늘 같답니다.'],
    ],
    chang: [['그넷줄 높이 차니', '치맛자락 펄렁펄렁', '꽃잎 같은 춘향이가', '구름 위로 오르는구나'], 'jungjungmori', 'pyeong', N,
      '이 장면에서는 그네가 오르내리는 흔들림과 설렘을 살리려고, 춤추듯 흥이 나는 중중모리를 골랐습니다.'],
    compare: 'jinyang',
    learn: ['element', 'pansori'],
    choices: [
      ['letter', '몽룡이 직접 편지를 써서 춘향에게 보낸다', '정식으로 마음을 전한다.'],
      ['bangja', '방자를 시켜 춘향을 불러오게 한다', '원작처럼 하인을 보내지만, 춘향이 불쾌해할 수도.'],
      ['ask', '몽룡이 춘향에게 다가가 그네를 함께 탄다', '신분을 내려놓고 먼저 다가간다.'],
    ],
    ledger: { relationships: ['몽룡은 춘향에게 반했다'], unresolved: ['신분 차이'] },
  }),
  (f) => scene({
    title: '새 사또의 생일잔치',
    summary: '몽룡이 한양으로 떠난 뒤, 새 사또 변학도가 춘향에게 수청을 강요했다.',
    bg: 'palace', tint: 'dusk', cast: [['byeon', 'angry', 'center'], ['chunhyang', 'determined', 'left'], ['hyangdan', 'worried', 'right']], props: ['scroll'],
    aniri: [
      [N, by(f.s1, {
        letter: '편지로 시작된 사랑은 굳은 약속이 되었지만, 몽룡은 아버지를 따라 한양으로 떠났것다.',
        bangja: '처음엔 하인을 보낸 몽룡을 꾸짖었던 춘향, 진심을 확인하고서야 마음을 열었는데, 몽룡은 곧 한양으로 떠났구나.',
        ask: '그네 위에서 시작된 인연, 둘은 혼인을 약속했지만 몽룡은 한양으로 떠나야 했구나.',
      })],
      ['byeon', '네 이년, 사또의 명을 거역하겠느냐! 오늘 밤 수청을 들라!'],
      ['chunhyang', '한 사람과 맺은 약속을 저버릴 수는 없사옵니다.'],
    ],
    chang: [['사또 호령 서릿발에', '대청마루 쩌렁쩌렁', '춘향이는 꼿꼿하게', '고개 한 번 숙이잖네'], 'jajinmori', 'u', N,
      '이 장면에서는 사또의 호령과 춘향의 맞섬이 빠르게 부딪히도록, 자진모리에 굳센 우조의 느낌을 얹었습니다.'],
    compare: 'jungmori',
    learn: ['passage', 'sarangga'],
    choices: [
      ['refuse', '끝까지 거절하고 옥에 갇힌다', '원작처럼 고난을 견딘다.'],
      ['village', '남원 사람들 앞에서 사또의 부당함을 알린다', '사또와 정면으로 맞선다.'],
      ['letter', '향단을 한양으로 보내 몽룡에게 알린다', '기다리는 대신 먼저 움직인다.'],
    ],
    ledger: { relationships: ['춘향과 몽룡은 혼인을 약속했다', '변학도는 춘향을 압박한다'], unresolved: ['변학도의 부당한 요구'] },
  }),
  (f) => scene({
    title: '쑥대머리',
    summary: '옥에 갇힌 춘향이 깊은 밤 몽룡을 그리워했다.',
    bg: 'prison', tint: 'night', cast: [['chunhyang', 'sad', 'center'], ['hyangdan', 'worried', 'left']], props: ['lantern'],
    aniri: [
      [N, by(f.s2, {
        refuse: '칼을 쓰고 옥에 갇힌 춘향, 긴 밤 내내 눈물로 지새우는구나.',
        village: '남원 사람들이 웅성였으나 사또는 춘향을 옥에 가두었것다. 그러나 옥문 앞엔 밤마다 사람들이 모여드는구나.',
        letter: '향단은 한양으로 떠났고, 홀로 남은 춘향은 옥에서 소식을 기다리는구나.',
      })],
      ['chunhyang', '서방님, 한양 천 리 길에 이 마음이 닿기는 하오리까.'],
    ],
    chang: [['쑥대머리 귀신 형용', '적막 옥방 찬 자리에', '생각나는 것은 임뿐이라', '보고지고 보고지고'], 'jungmori', 'gyemyeon', 'chunhyang',
      '이 장면에서는 그리움을 담담하게 풀어내려고, 원작 「쑥대머리」처럼 중모리에 계면조 가락을 얹었습니다. (첫 두 줄은 원작 사설을 빌려 쓴 부분입니다.)'],
    compare: 'jinyang',
    learn: ['passage', 'ssukdaemeori'],
    choices: [
      ['wait', '몽룡을 믿고 끝까지 기다린다', '약속의 힘을 믿는다.'],
      ['escape', '향단과 옥을 빠져나와 직접 한양으로 간다', '기다림 대신 길을 나선다.'],
      ['petition', '옥에서 사또의 비리를 적어 감영에 올린다', '글로 부당함에 맞선다.'],
    ],
    ledger: { unresolved: ['춘향은 옥에서 나올 수 있을까', '몽룡의 소식'] },
  }),
  (f) => {
    const E = {
      wait: ['어사출두', `생일잔치가 한창일 때 "암행어사 출두야!" 소리가 울렸다. 거지 차림으로 돌아온 몽룡이 어사가 되어 변학도를 벌하니, ${f.s2 === 'village' ? '춘향 편에 섰던 남원 사람들이 먼저 환호했다' : '잔치판이 뒤집혔다'}. 춘향과 몽룡은 약속대로 다시 만났다.`, ['큰 흐름은 원작과 같지만, 이번 판에서는 선택이 남원 사람들의 반응을 바꾸었다', '기다림이 약속의 힘으로 이어졌다', '사랑과 정의가 함께 이루어졌다']],
      escape: ['한양 가는 길', '옥을 빠져나온 춘향과 향단은 밤길을 걸어 한양에 닿았다. 그곳에서 어사 발령을 받은 몽룡을 만나 함께 남원으로 돌아와, 춘향이 직접 사또의 죄를 밝혔다.', ['춘향이 기다리기만 하지 않고 스스로 길을 나섰다', '어사출두에 춘향이 함께했다', '향단이 이야기의 주역이 되었다']],
      petition: ['붓으로 연 옥문', '춘향의 글이 감영에 닿자 조사가 시작되었고, 변학도의 비리가 줄줄이 드러났다. 어사가 되어 돌아온 몽룡이 본 것은 이미 옥문을 나선 춘향이었다.', ['춘향이 스스로 부당함을 고발해 풀려났다', '몽룡의 출두보다 춘향의 글이 먼저였다', '구원받는 인물에서 싸우는 인물이 되었다']],
    }[f.s3] || ['새로운 판', '춘향의 이야기는 새로운 판으로 이어졌다.', []];
    const [title, summary, changes] = E;
    return scene({
      title, summary, bg: 'palace', tint: 'day',
      cast: [['chunhyang', 'happy', 'left'], ['mongryong', 'determined', 'right'], ['byeon', 'surprised', 'center']],
      props: ['scroll'], effect: 'shake',
      aniri: [[N, summary.split('. ')[0] + '.'], ['chunhyang', '오늘의 판은 제 손으로 지켜 냈사옵니다.']],
      chang: [['암행어사 출두야', '역졸들이 우르르르', '잔치판이 뒤집히니', '남원 하늘 맑았구나'], 'jajinmori', 'u', N,
        '이 장면에서는 잔치판이 한순간에 뒤집히는 통쾌함을 살리려고, 원작 「어사출두」처럼 자진모리로 몰아쳤습니다.'],
      learn: ['passage', 'eosachuldu'],
      ending: { title, summary, changes },
    });
  },
];

// ───────────────────────── 심청가 · 원작 배경 ─────────────────────────
const simcheongOriginal = [
  () => scene({
    title: '개천에 빠진 심봉사',
    summary: '딸을 마중 나간 심봉사가 개천에 빠졌다가 몽운사 화주승에게 구조되었다.',
    bg: 'mountain', tint: 'dusk', cast: [['simbongsa', 'surprised', 'center'], ['extra_elder', 'neutral', 'right', '화주승']], effect: 'waves',
    aniri: [
      [N, '날이 저물도록 딸 심청이 돌아오지 않자, 심봉사가 지팡이를 짚고 마중을 나섰것다.'],
      [N, '그만 발을 헛디뎌 개천에 풍덩! 지나던 몽운사 화주승이 건져 내는데.'],
      ['extra_elder', '공양미 삼백 석을 부처님께 바치면, 눈을 뜰 수 있으리다.'],
    ],
    chang: [['중이 하나 내려온다', '얼씨구 엇박자로', '바랑 메고 지팡이 짚고', '구름같이 내려온다'], 'eotmori', 'pyeong', N,
      '이 장면에서는 범상치 않은 화주승의 등장을 엇갈리는 박으로 그리려고, 엇모리를 골랐습니다.'],
    compare: 'jungmori',
    learn: ['passage', 'jungnaeryeoonda'],
    choices: [
      ['promise', '심봉사가 덜컥 삼백 석을 약속한다', '원작처럼 무거운 약속이 생긴다.'],
      ['doubt', '심봉사가 약속하기 전 딸과 상의하겠다고 한다', '가족이 함께 결정한다.'],
      ['ask', '화주승에게 다른 방법은 없는지 묻는다', '삼백 석이 아닌 길을 찾는다.'],
    ],
    ledger: { relationships: ['심청은 아버지를 지극히 모신다'], unresolved: ['심봉사의 눈'] },
  }),
  (f) => scene({
    title: '삼백 석의 값',
    summary: '뱃사람들이 인당수 제물을 찾는다는 소식이 들려왔다.',
    bg: 'room', tint: 'night', cast: [['simcheong', 'worried', 'center'], ['simbongsa', 'sad', 'left'], ['seonin', 'neutral', 'right']], props: ['rice', 'lantern'],
    aniri: [
      [N, by(f.s1, {
        promise: '덜컥 약속은 했으나 삼백 석은 하늘의 별 따기. 심봉사는 밤새 한숨만 쉬는구나.',
        doubt: '아버지의 이야기를 들은 심청, "함께 방법을 찾아요" 하며 손을 꼭 잡았것다.',
        ask: '화주승은 "삼백 석이 아니어도 정성이면 된다" 했으나, 마을엔 이미 뱃사람들이 와 있었구나.',
      })],
      ['seonin', '인당수 물길이 험하여, 제물이 될 처녀를 찾소. 값은 쌀 삼백 석이오.'],
      ['simcheong', '(아버지 눈만 뜰 수 있다면…)'],
    ],
    chang: [['삼백 석이 무엇이냐', '아버지 눈 하나인데', '이 몸 하나 바치면은', '세상 빛을 보시려나'], 'jinyang', 'gyemyeon', 'simcheong',
      '이 장면에서는 심청이 마음속 결심을 오래 곱씹도록, 가장 느린 진양조에 애절한 계면조를 얹었습니다.'],
    compare: 'jajinmori',
    learn: ['jo', 'gyemyeon'],
    choices: [
      ['go', '심청이 뱃사람을 따라나선다', '원작처럼 자신을 희생한다.'],
      ['refuse', '심청이 제물을 거절하고 다른 길을 찾는다', '마을과 함께 삼백 석을 모은다.'],
      ['boat', '심청이 뱃사람이 되어 배를 지키겠다고 제안한다', '제물 대신 일꾼으로 바다에 나간다.'],
    ],
    ledger: { relationships: ['뱃사람은 인당수 제물을 구한다'], unresolved: ['공양미 삼백 석', '심청의 운명'] },
  }),
  (f) => scene({
    title: '인당수',
    summary: '바다 위, 거센 물결 속에서 운명의 순간이 왔다.',
    bg: 'riverboat', tint: 'storm', cast: [['simcheong', 'determined', 'center'], ['seonin', 'worried', 'right']], effect: 'rain',
    aniri: [
      [N, by(f.s2, {
        go: '뱃사람들과 떠난 심청, 배가 인당수에 이르자 하늘이 캄캄해지는구나.',
        refuse: '마을 사람들과 쌀을 모으던 심청, 쌀 실은 배를 지키러 함께 바다에 나섰는데 그만 풍랑을 만났것다.',
        boat: '노를 잡은 심청, 뱃사람들 틈에서 바다를 읽는 법을 배웠는데, 인당수에서 큰 풍랑이 이는구나.',
      })],
      ['seonin', '물결이 배를 삼키려 하오! 어찌해야 하오!'],
    ],
    chang: [['바람 불고 물결 치니', '배가 기우뚱 기우뚱', '인당수 깊은 물이', '입을 벌려 삼키려네'], 'hwimori', 'gyemyeon', N,
      '이 장면에서는 풍랑이 순식간에 배를 덮치는 긴박함을 살리려고, 가장 빠른 휘모리로 몰아쳤습니다.'],
    compare: 'jinyang',
    learn: ['passage', 'beompijungnyu'],
    choices: [
      ['jump', '심청이 물속으로 뛰어든다', '원작처럼 바다에 몸을 던진다.'],
      ['steer', '심청이 키를 잡고 배를 몰아 나간다', '배운 뱃길로 모두를 살린다.'],
      ['pray', '모두 함께 노를 저으며 소리를 맞춘다', '뱃노래로 힘을 모은다.'],
    ],
    ledger: { unresolved: ['풍랑 속 배의 운명'] },
  }),
  (f) => {
    const E = {
      jump: ['연꽃으로 돌아온 심청', '바다에 몸을 던진 심청은 용궁에서 되살아나 연꽃을 타고 돌아왔다. 왕비가 된 심청이 맹인 잔치를 열자 심봉사가 찾아왔고, "청아!" 하는 순간 눈을 번쩍 떴다.', ['원작의 큰 흐름을 따랐지만, 앞선 선택으로 가족이 함께 고민하는 장면이 더해졌다', '희생의 무게를 심청 스스로 선택했다', '부녀의 재회가 이루어졌다']],
      steer: ['인당수를 건넌 키잡이', '심청이 키를 잡고 물결을 비껴 나가자 배는 인당수를 무사히 건넜다. 뱃사람들은 제물 대신 심청을 키잡이로 모셨고, 그 품삯으로 공양미를 마련했다. 심봉사는 딸의 목소리를 들으며 눈물 속에 웃었다.', ['제물이 되는 대신 스스로 길을 열었다', '희생이 아니라 일과 연대로 공양미를 마련했다', '뱃사람들과의 관계가 바뀌었다']],
      pray: ['뱃노래가 된 소리', '모두가 한목소리로 노를 젓자 배는 풍랑을 뚫고 나아갔다. 이 노래는 남해 뱃사람들 사이에 퍼졌고, 마을 사람들이 모은 쌀로 공양을 올리던 날 심봉사는 딸의 손을 잡고 눈물을 흘렸다.', ['한 사람의 희생 대신 모두의 힘으로 위기를 넘었다', '심청의 이야기가 공동체의 노래가 되었다', '공양미를 마을이 함께 마련했다']],
    }[f.s3] || ['새로운 판', '심청의 이야기는 새로운 판으로 이어졌다.', []];
    const [title, summary, changes] = E;
    return scene({
      title, summary, bg: f.s3 === 'jump' ? 'palace' : 'seashore', tint: 'dawn',
      cast: [['simcheong', 'happy', 'left'], ['simbongsa', f.s3 === 'jump' ? 'surprised' : 'happy', 'right']],
      props: f.s3 === 'jump' ? [] : ['ship', 'rice'], effect: 'sparkle',
      aniri: [[N, summary.split('. ')[0] + '.'], ['simbongsa', '얼씨구나 좋을시고, 우리 청이 목소리로구나!']],
      chang: [['얼씨구나 좋을시고', '우리 딸 청이 왔네', '어둡던 세상 천지', '환하게 밝았구나'], 'jungjungmori', 'pyeong', 'simbongsa',
        '이 장면에서는 다시 만난 기쁨을 함께 들썩이며 나누도록, 중중모리로 맺었습니다.'],
      learn: ['element', 'chuimsae'],
      ending: { title, summary, changes },
    });
  },
];

// ───────────────────────── 적벽가 · 원작 배경 ─────────────────────────
const jeokbyeokOriginal = [
  () => scene({
    title: '적벽 강 위의 백만 대군',
    summary: '조조의 대군이 적벽 강에 배를 쇠사슬로 묶어 띄웠다.',
    bg: 'battlefield', tint: 'dusk', cast: [['jojo', 'sly', 'center'], ['gunsa', 'worried', 'left', '군사 길쭉이']], props: ['sword', 'drum'], effect: 'waves',
    aniri: [
      [N, '백만 대군을 이끈 조조, 적벽 강에 수천 척 배를 쇠사슬로 줄줄이 묶었것다.'],
      ['jojo', '배를 묶으니 땅처럼 평평하구나! 이번 싸움은 이긴 것이나 다름없다.'],
      ['gunsa', '(고향 떠난 지 삼 년… 어머니는 잘 계시려나.)'],
    ],
    chang: [['적벽 강에 배가 뜨니', '돛대마다 깃발이요', '백만 군사 함성 속에', '한 군사의 한숨 있네'], 'jungmori', 'u', N,
      '이 장면에서는 거대한 진영을 담담히 둘러보게 하려고, 보통 빠르기의 중모리에 웅장한 우조를 얹었습니다.'],
    compare: 'jajinmori',
    learn: ['element', 'pansori'],
    choices: [
      ['jojo', '조조의 곁에서 승리를 축하하는 잔치를 연다', '장수의 시선으로 전쟁을 본다.'],
      ['gunsa', '군사 길쭉이를 따라가 병사들의 이야기를 듣는다', '평범한 군사의 시선으로 전쟁을 본다.'],
      ['jegal', '강 건너 제갈량의 진영을 엿본다', '바람을 읽는 책사의 계획을 먼저 안다.'],
    ],
    ledger: { relationships: ['조조는 승리를 확신한다'], unresolved: ['쇠사슬로 묶은 배의 위험'] },
  }),
  (f) => scene({
    title: '군사들의 설움',
    summary: '싸움 전날 밤, 군사들이 저마다 고향 이야기를 꺼냈다.',
    bg: 'battlefield', tint: 'night', cast: [['gunsa', 'sad', 'center', '군사 길쭉이'], ...(f.s1 === 'jegal' ? [['jegal', 'neutral', 'right']] : [['jojo', 'neutral', 'right']])], props: ['lantern'],
    aniri: [
      [N, by(f.s1, {
        jojo: '잔치가 끝나고 장수들은 잠들었는데, 배 밑 칸에서는 군사들의 울음소리가 새어 나오는구나.',
        gunsa: '길쭉이를 따라 내려간 배 밑 칸, 군사들이 둘러앉아 고향 이야기를 하는구나.',
        jegal: '강 건너 제갈량은 하늘을 보며 "사흘 뒤 동남풍이 분다" 하였것다. 같은 밤, 조조 진영 군사들은 잠 못 이루는구나.',
      })],
      ['gunsa', '나는 장가든 지 사흘 만에 끌려왔소. 아내 얼굴도 가물가물하오.'],
    ],
    chang: [['고향 떠난 지 몇 해런고', '부모 처자 그리워라', '이 싸움이 끝나거든', '살아서나 돌아갈까'], 'jinyang', 'gyemyeon', 'gunsa',
      '이 장면에서는 군사의 설움을 서두르지 않고 길게 들려주려고, 느린 진양조에 계면조를 얹었습니다.'],
    compare: 'jungjungmori',
    learn: ['passage', 'gunsaseoreum'],
    choices: [
      ['warn', '길쭉이가 조조에게 "바람이 수상하다" 고한다', '장수가 병사의 말을 들을까?'],
      ['flee', '군사들이 몰래 작은 배로 고향을 향해 떠난다', '전쟁터를 떠나는 선택.'],
      ['chain', '쇠사슬을 몰래 풀어 둔다', '불이 나도 배들이 흩어질 수 있게 한다.'],
    ],
    ledger: { facts: ['사흘 뒤 동남풍이 분다'], unresolved: ['군사들의 운명'] },
  }),
  (f) => scene({
    title: '동남풍과 불길',
    summary: '동남풍이 불고, 적벽 강에 불길이 번졌다.',
    bg: 'battlefield', tint: 'storm', cast: [['jojo', 'surprised', 'center'], ['gunsa', 'determined', 'left', '군사 길쭉이']], props: ['ship'], effect: 'fire',
    aniri: [
      [N, by(f.s2, {
        warn: '길쭉이의 말에 조조는 코웃음을 쳤것다. 그런데 정말로 바람이 바뀌는구나!',
        flee: '작은 배들이 하나둘 진영을 빠져나가는 사이, 동남풍이 휘몰아치는구나.',
        chain: '군사들이 밤새 쇠사슬을 풀어 둔 그때, 동남풍과 함께 불화살이 날아드는구나.',
      })],
      ['jojo', '이, 이게 무슨 일이냐! 배를 빼라, 배를 빼!'],
    ],
    chang: [['불이 붙는다 불이 붙어', '돛대마다 화르르르', '강물 위에 불길 솟아', '천지가 붉었구나'], 'jajinmori', 'u', N,
      '이 장면에서는 불길이 번지며 일이 한꺼번에 벌어지는 모습을 쏟아내려고, 원작 「적벽화전」처럼 자진모리로 몰아쳤습니다.'],
    compare: 'jinyang',
    learn: ['passage', 'jeokbyeokhwajeon'],
    choices: [
      ['save', '길쭉이가 다친 군사들을 작은 배에 태운다', '장수보다 동료를 먼저 구한다.'],
      ['follow', '조조를 지켜 화용도로 달아난다', '원작처럼 조조의 도주 길을 따른다.'],
      ['surrender', '군사들과 함께 강 건너 진영에 항복한다', '싸움을 끝내는 길을 택한다.'],
    ],
    ledger: { unresolved: ['조조의 생사', '군사들의 생사'] },
  }),
  (f) => {
    const E = {
      save: ['군사의 이름으로', `길쭉이는 불길 속에서 동료들을 작은 배에 태워 강가로 건넸다. ${f.s2 === 'chain' ? '미리 풀어 둔 쇠사슬 덕에 배들이 흩어져 살아남은 이가 많았다.' : '살아남은 이들은 서로의 고향을 외우며 걸었다.'} 훗날 그들은 이 밤의 노래를 고향 마을에 전했다.`, ['영웅이 아니라 이름 없는 군사가 주인공이 되었다', '전쟁의 승패보다 사람들의 생존에 초점이 옮겨 갔다', '군사설움타령의 군사들이 살아서 돌아갔다']],
      follow: ['화용도의 관우', '조조를 따라 화용도에 이르니, 관우가 길을 막고 서 있었다. 조조는 옛정을 호소했고, 관우는 끝내 길을 열어 주었다. 길쭉이는 그 모습을 보며 "의리란 무엇인가" 오래 생각했다.', ['원작의 화용도 장면을 군사의 눈으로 다시 보았다', '조조 대신 군사의 생각으로 결말을 맺었다', '의리의 의미를 되묻는 판이 되었다']],
      surrender: ['싸움을 멈춘 사람들', '군사들은 무기를 내려놓고 강 건너로 건너갔다. 제갈량은 그들을 돌려보내며 "싸움은 장수가 하고 눈물은 군사가 흘리는구나" 하였다. 길쭉이는 사흘 신랑으로 떠났던 고향에 돌아갔다.', ['군사들이 스스로 싸움을 끝냈다', '제갈량이 군사들을 고향으로 돌려보냈다', '전쟁 이야기가 귀향 이야기로 바뀌었다']],
    }[f.s3] || ['새로운 판', '적벽의 이야기는 새로운 판으로 이어졌다.', []];
    const [title, summary, changes] = E;
    return scene({
      title, summary, bg: f.s3 === 'follow' ? 'mountain' : 'seashore', tint: 'dawn',
      cast: [['gunsa', 'happy', 'left', '군사 길쭉이'], ...(f.s3 === 'follow' ? [['gwanu', 'determined', 'center'], ['jojo', 'worried', 'right']] : f.s3 === 'surrender' ? [['jegal', 'neutral', 'right']] : [['extra_youth', 'happy', 'right', '동료 군사']])],
      props: [], effect: 'wind',
      aniri: [[N, summary.split('. ')[0] + '.'], ['gunsa', '살았구나, 살았어! 고향 가는 길이 이리 밝을 줄이야.']],
      chang: [['동녘 하늘 밝아 오니', '불길 잦고 바람 자네', '살아남은 사람들아', '고향으로 돌아가세'], 'jungmori', 'pyeong', 'gunsa',
        '이 장면에서는 긴 싸움이 끝난 뒤의 담담한 안도를 들려주려고, 차분한 중모리로 맺었습니다.'],
      learn: ['element', 'chuimsae'],
      ending: { title, summary, changes },
    });
  },
];

export const SCRIPTS = {
  sugung: { original: sugungOriginal, company: sugungCompany },
  heungbo: { original: heungboOriginal, campus: heungboCampus },
  chunhyang: { original: chunhyangOriginal },
  simcheong: { original: simcheongOriginal },
  jeokbyeok: { original: jeokbyeokOriginal },
};

// 고른 작품·배경에 맞는 각본을 고른다. 정확히 맞는 배경이 없으면 그 작품의 원작 배경 각본.
export function pickScript(work, setting) {
  const set = SCRIPTS[work];
  if (set[setting]) return { steps: set[setting], setting, exact: true };
  return { steps: set.original, setting: 'original', exact: setting === 'original' };
}

/* 센니 노트 — 기본 내장 노트 & 카테고리
 * 여기(notes/data.js)만 고치면 사이트에 바로 반영됩니다.
 * cat: cooking | beauty | living | memo   /   sub: 아래 subs 의 id
 */

window.SENNI_CATEGORIES = [
  {
    id: 'cooking', name: '요리·레시피', emoji: '🍳',
    color: '#6E8F6B', soft: '#E8F0E6', ink: '#41633F',
    subs: [
      { id: 'main',    name: '집밥·메인' },
      { id: 'snack',   name: '집밥·간식' },
      { id: 'ramen',   name: '라면·분식' },
      { id: 'sauce',   name: '소스·시즈닝' },
      { id: 'dessert', name: '디저트' },
      { id: 'storage', name: '보관법' }
    ]
  },
  {
    id: 'beauty', name: '미용·건강', emoji: '🧂',
    color: '#C0738C', soft: '#F7E6EC', ink: '#9C4E68',
    subs: [
      { id: 'body',       name: '바디·사우나' },
      { id: 'hair',       name: '헤어' },
      { id: 'supplement', name: '영양제' },
      { id: 'daisocosmetic', name: '다이소·코덕' }
    ]
  },
  {
    id: 'living', name: '살림·쇼핑', emoji: '🏠',
    color: '#B4883C', soft: '#F6EEDC', ink: '#8A6526',
    subs: [
      { id: 'compare', name: '쇼핑·비교' },
      { id: 'daiso',   name: '다이소·수납' },
      { id: 'daisolife', name: '다이소·생활' },
      { id: 'travel',  name: '여행·쇼핑' },
      { id: 'food',    name: '여행·맛집' },
      { id: 'tips',    name: '생활·꿀팁' },
      { id: 'claim',   name: '병원·보험' }
    ]
  },
  {
    id: 'insta', name: '인스타·부업', emoji: '📱',
    color: '#8A6FB0', soft: '#EFE8F6', ink: '#664A8A',
    subs: [
      { id: 'aivideo',  name: 'AI 영상 제작' },
      { id: 'script',   name: '대본·프롬프트' },
      { id: 'shorts',   name: '숏폼 제작' },
      { id: 'money',    name: '인스타 수익화' },
      { id: 'thread',   name: '스레드·제휴' },
      { id: 'automate', name: '편집 자동화' },
      { id: 'blog',     name: '블로그' }
    ]
  },
  {
    id: 'memo', name: '내 메모', emoji: '📝',
    color: '#6E7C9B', soft: '#E8ECF5', ink: '#4C5A7A',
    subs: []
  }
];

window.SENNI_NOTES = [

  /* ───────── 요리·레시피 ───────── */
  {
    id: 'n-su-yuk',
    cat: 'cooking', sub: 'main',
    title: '강레오 초간단 찜 수육',
    summary: '찜기 하나로. 중불 30분 → 중약불 45분, 두 단계 불 조절로 쫀득하게.',
    tags: ['수육', '찜기', '돼지고기', '집밥'],
    instaReady: true,
    instaHook: '불 조절 두 번이면 끝 — 찜기 하나로 쫀득 수육',
    date: '2026-11-26',
    blocks: [
      { type: 'p', text: '키친타월로 핏물을 빼고 찜기에 대파를 깔아 익히는 방식. 불 조절만 지키면 실패가 적어요.' },
      { type: 'h', text: '만드는 순서' },
      { type: 'ol', items: [
        '키친타월로 고기의 핏물을 제거한다.',
        '소금·후추로 밑간한다.',
        '찜기에 대파를 깔고 고기를 올린 뒤 <strong>중불 30분</strong> — 육즙을 가두는 단계.',
        '<strong>중약불 45분</strong> 더 익히기 — 쫀득하게 풀리는 단계.',
        '불을 끄고 5~10분 식힌 뒤 썬다.'
      ] },
      { type: 'callout', tone: 'info', icon: '💡', text: '중불 30분으로 겉을 잡고, 중약불 45분으로 속까지 풀어 주는 게 핵심이에요.' }
    ],
    links: [
      { label: '레시피 원문 보기', url: 'https://www.recipio.kr/recipes/WwYnD8XB', note: 'recipio.kr' }
    ]
  },
  {
    id: 'n-pho',
    cat: 'cooking', sub: 'main',
    title: '집밥 쌀국수 & 양파초절임',
    summary: '육수 반반 + 찬물 30분 불리기. 양파초절임은 식초·설탕·물 1:1:1.',
    tags: ['쌀국수', '양파초절임', '집밥', '고명'],
    instaReady: true,
    instaHook: '양파초절임 1:1:1만 알면 집에서 쌀국수집',
    date: '2026-11-26',
    blocks: [
      { type: 'h', text: '육수' },
      { type: 'p', text: '사골육수 + 쌀국수 전용육수를 <strong>반반</strong>으로. 전용육수만 단독으로 써도 OK.' },
      { type: 'h', text: '면' },
      { type: 'p', text: '건면은 <strong>찬물에 30분</strong> 불려 두기.' },
      { type: 'h', text: '양파초절임 황금비율' },
      { type: 'table', head: ['식초', '설탕', '물', '추가'], rows: [
        ['1', '1', '1', '소금 한 꼬집']
      ] },
      { type: 'h', text: '필수 고명' },
      { type: 'checklist', items: ['소고기', '숙주', '양파', '청경채', '스리라차 소스'] }
    ],
    links: [
      { label: '레시피 원문 보기', url: 'https://www.10000recipe.com/recipe/7047865', note: '10000recipe.com' }
    ]
  },
  {
    id: 'n-miyeok',
    cat: 'cooking', sub: 'main',
    title: '깔끔 초간단 미역국',
    summary: '미역 볶고 코인육수·어간장. 다진마늘 없이도 깔끔한 맛.',
    tags: ['미역국', '국물', '코인육수', '집밥'],
    instaReady: true,
    instaHook: '다진마늘 없이 15분, 깔끔한 미역국',
    date: '2026-11-26',
    blocks: [
      { type: 'ol', items: [
        '미역을 참기름에 볶는다.',
        '물을 붓고 코인육수 + 어간장을 넣는다.',
        '중약불에서 15~20분 푹 끓인다.',
        '소금 또는 국간장으로 간을 맞춘다.'
      ] },
      { type: 'callout', tone: 'info', icon: '💡', text: '코인육수와 어간장을 넣으면 다진마늘은 생략해도 됩니다.' }
    ],
    links: []
  },
  {
    id: 'n-mousse',
    cat: 'cooking', sub: 'dessert',
    title: '노오븐 딸기 생초코 무스 케이크',
    summary: '15cm 사각틀·오븐 없이. 오레오 바닥 + 생딸기 + 생초코 가나슈.',
    tags: ['노오븐', '딸기', '무스케이크', '디저트'],
    instaReady: true,
    instaHook: '오븐 없이 15cm 사각틀 하나로, 딸기 생초코 무스',
    date: '2026-11-26',
    blocks: [
      { type: 'p', text: '15cm 사각틀 기준. 오븐 없이 냉장으로 굳히는 케이크예요.' },
      { type: 'table', head: ['재료', '분량', '쓰임'], rows: [
        ['크림 뺀 오레오', '150g', '바닥'],
        ['무염버터', '50g', '바닥'],
        ['생딸기', '300g', '속재료'],
        ['다크초콜릿', '200g', '가나슈'],
        ['동물성 생크림', '200ml', '가나슈']
      ] },
      { type: 'h', text: '순서' },
      { type: 'ol', items: [
        '크림을 뺀 오레오 150g을 곱게 갈아 무염버터 50g과 섞고, 틀 바닥에 눌러 깐다.',
        '생딸기 300g을 올린다.',
        '다크초콜릿 200g에 동물성 생크림 200ml를 데워 부어 가나슈를 만든다.',
        '가나슈를 부어 굳히면 완성.'
      ] }
    ],
    links: [
      { label: '레시피 원문 보기', url: 'https://www.hemogry.com/recipes/a6060e05-59b9-490f-a155-4ef96797042e', note: 'hemogry.com' }
    ]
  },
  {
    id: 'n-garlic-cube',
    cat: 'cooking', sub: 'storage',
    title: '다진마늘 바둑판 큐브 보관법',
    summary: '지퍼백에 납작하게 펴고 칼등으로 금 긋기. 한 칸씩 톡 떼어 쓰기.',
    tags: ['다진마늘', '냉동', '보관', '꿀팁'],
    instaReady: true,
    instaHook: '다진마늘, 바둑판으로 얼리면 한 칸씩 톡',
    date: '2026-11-26',
    blocks: [
      { type: 'ol', items: [
        '다진 마늘을 지퍼백에 얇고 납작하게 편다.',
        '칼등으로 바둑판 모양으로 금을 긋는다.',
        '냉동 보관한다.',
        '필요할 때마다 한 칸씩 톡 떼어 쓴다.'
      ] },
      { type: 'callout', tone: 'info', icon: '💡', text: '얇게 펴 둘수록 잘 부서져서 칸마다 깔끔하게 분리돼요.' }
    ],
    links: []
  },
  {
    id: 'n-congnamul',
    cat: 'cooking', sub: 'sauce',
    title: '업소용 콩나물파채 & 마트 고기 시즈닝',
    summary: '맛소금 10g·미원 4g·설탕 5g·고춧가루 30g + 식초 1큰술.',
    tags: ['콩나물', '파채', '시즈닝', '업소용'],
    instaReady: true,
    instaHook: '업소용 콩나물파채 비율, 집에서 그대로',
    date: '2026-11-26',
    blocks: [
      { type: 'h', text: '콩나물파채 업그레이드' },
      { type: 'table', head: ['재료', '분량'], rows: [
        ['맛소금', '10g'],
        ['미원', '4g'],
        ['설탕', '5g'],
        ['고춧가루', '30g'],
        ['식초', '1큰술 (추가)']
      ] },
      { type: 'ul', items: [
        '파채는 찬물에 10분 담갔다가 물기를 완전히 제거한다.',
        '굵은 고춧가루와 고운 고춧가루를 반반 섞고 깨소금을 더한다.',
        '먹기 직전에 무친다.'
      ] },
      { type: 'h', text: '마트 시식코너 고기 시즈닝' },
      { type: 'table', head: ['배합', '비율'], rows: [
        ['A', '맛소금 2 : 양파분말 2 : 후추 1'],
        ['B', '맛소금 1 : 마늘분말 1 : 후추 0.5'],
        ['A+B', '반반 섞어도 좋음']
      ] },
      { type: 'callout', tone: 'info', icon: '🔥', text: '고기 한 면이 익고 기름이 올라온 뒤, 중약불에서 얇게 뿌리기.' }
    ],
    links: []
  },
  {
    id: 'n-bomdong',
    cat: 'cooking', sub: 'sauce',
    title: '임짱 봄동 비빔밥 소스 (3~4인분)',
    summary: '식초 3T·진간장 3.5T·물 5T·고춧가루 5.5T·설탕 2T·다진마늘 3/4T·고추장 1.5T.',
    tags: ['봄동', '비빔밥', '소스', '양념'],
    instaReady: true,
    instaHook: '봄동 비빔밥 소스, 계량만 따라 하면 끝',
    date: '2026-11-26',
    blocks: [
      { type: 'table', head: ['재료', '계량'], rows: [
        ['식초', '3T'],
        ['진간장', '3.5T'],
        ['물', '5T'],
        ['고춧가루', '5.5T'],
        ['설탕', '2T'],
        ['다진마늘', '3/4T'],
        ['고추장', '1.5T']
      ] },
      { type: 'callout', tone: 'info', icon: '💡', text: '참기름은 소스에 미리 넣지 말고, 먹을 만큼만 마지막에 따로 뿌려 먹기.' }
    ],
    links: []
  },

  /* ───────── 미용·건강 ───────── */
  {
    id: 'n-salt',
    cat: 'beauty', sub: 'body',
    title: '진실이네 빛소금 홈메이드 황금 레시피',
    summary: '마사지 소금 5큰술 + 알로에젤 3~4큰술 + 감자전분. 사우나 5~10분.',
    tags: ['빛소금', '사우나', '각질', '홈케어'],
    instaReady: true,
    instaHook: '사우나 빛소금, 집에서 5분 만에',
    date: '2026-11-26',
    blocks: [
      { type: 'h', text: '1회 전신용 비율' },
      { type: 'table', head: ['재료', '분량'], rows: [
        ['고운 마사지 소금', '5큰술'],
        ['순한 알로에 수딩젤', '3~4큰술'],
        ['감자전분', '1~1.5큰술'],
        ['함초가루 (선택)', '0.5~1작은술']
      ] },
      { type: 'h', text: '만드는 순서' },
      { type: 'ol', items: [
        '알로에 수딩젤 + 감자전분(+함초가루)을 먼저 섞어 크림 상태로 만든다.',
        '마지막에 소금 5큰술을 섞는다 — <strong>요거트 농도</strong>가 기준.',
        '샤워 후 물기가 살짝 있는 몸에 바른다. <strong>얼굴 제외!</strong>',
        '사우나·반신욕에서 5~10분.',
        '미지근한 물로 헹구고 보습제를 바른다.'
      ] },
      { type: 'h', text: '소금 구매처' },
      { type: 'table', head: ['구매처', '가격', '비고'], rows: [
        ['쿠팡 · 바다애 맛사지 미용염 500g', '1개 3,980원<br>2개 5,550원', '무료배송'],
        ['네이버 · 바른들식품 남문소금 500g', '3,500원 + 배송비 3,000원<br>= 6,500원', '']
      ] },
      { type: 'callout', tone: 'warn', icon: '⚠️', text: '얼굴·눈가·상처·면도 직후에는 쓰지 않기. 방부제가 없으니 1회분씩만 공병이나 지퍼백에 소분해 두세요.' }
    ],
    links: [
      { label: '쿠팡 · 바다애 마사지 미용염', url: 'https://www.coupang.com/vp/products/5010817484', note: 'coupang.com · 3,980원' }
    ]
  },
  {
    id: 'n-napukia',
    cat: 'beauty', sub: 'hair',
    title: '나푸키아 트리트먼트 150ml 케어 & 시세',
    summary: '노워시 헤어 케어. 정가 20,000원 → 13,000원 + 배송비 3,000원.',
    tags: ['나푸키아', '트리트먼트', '헤어', '가격'],
    instaReady: true,
    instaHook: '노워시 트리트먼트 150ml, 지금 13,000원대',
    date: '2026-11-26',
    blocks: [
      { type: 'p', text: '씻지 않고 쓰는 노워시 타입 헤어 트리트먼트, 150ml.' },
      { type: 'table', head: ['항목', '내용'], rows: [
        ['판매처', '네이버 브랜드스토어'],
        ['정가', '20,000원'],
        ['할인가', '13,000원 (35% 할인)'],
        ['배송비', '3,000원'],
        ['실결제', '16,000원']
      ] },
      { type: 'callout', tone: 'info', icon: '👀', text: '13,000원 미만 특가나 1+1 행사가 뜨는지 모니터링 중.' }
    ],
    links: []
  },
  {
    id: 'n-supplement',
    cat: 'beauty', sub: 'supplement',
    title: '임신 준비 부부 영양제 플랜',
    summary: '여성 4종 · 남편 3종. 시술 1주 전부터 오메가3·유비퀴놀 중단.',
    tags: ['임신준비', '영양제', '엽산', '오메가3'],
    instaReady: false,
    instaHook: null,
    date: '2026-11-26',
    blocks: [
      { type: 'h', text: '여성' },
      { type: 'checklist', items: [
        '쏜리서치 5-MTHF 1mg',
        '홀섬스토리 이노시톨 40:1',
        '스포츠리서치 rTG 오메가3',
        '비타민D3 2000 IU'
      ] },
      { type: 'h', text: '남편' },
      { type: 'checklist', items: [
        'NOW 아연',
        '유비퀴놀',
        '쏜 엽산'
      ] },
      { type: 'callout', tone: 'warn', icon: '⚠️', text: '시술 1주 전(11/30~)부터는 오메가3와 유비퀴놀을 중단하세요.' }
    ],
    links: []
  },

  /* ───────── 살림·쇼핑 ───────── */
  {
    id: 'n-cart-serve',
    cat: 'living', sub: 'compare',
    title: '가정용 블랙 서빙카트 비교 검증',
    summary: '하비티 57,990원 vs Bornoon 44,350원~. 해피홈 뱅크는 하중 10kg·파손 후기.',
    tags: ['서빙카트', '블랙', '가구', '최저가'],
    instaReady: true,
    instaHook: '3만 원대 서빙카트, 무거운 냄비엔 왜 안 될까',
    date: '2026-11-26',
    blocks: [
      { type: 'table', head: ['제품', '가격', '규격', '메모'], rows: [
        ['하비티 3단 블랙', '57,990원', '85×43×96cm', '스토퍼 없음'],
        ['Bornoon 접이식 3단', '44,350원~', '—', '접이식'],
        ['해피홈 뱅크', '29,900원', '—', '최대하중 10kg<br>바퀴·손잡이 파손 후기']
      ] },
      { type: 'callout', tone: 'warn', icon: '⚠️', text: '해피홈 뱅크는 무거운 냄비·요리용으로는 비추천. 하중 10kg에 바퀴·손잡이 파손 후기가 있었어요.' }
    ],
    links: [
      { label: '쿠팡 · 하비티 3단 서빙카트', url: 'https://www.coupang.com/vp/products/8631472066', note: 'coupang.com · 57,990원' }
    ]
  },
  {
    id: 'n-laundry',
    cat: 'living', sub: 'compare',
    title: '엠비코 라탄 빨래바구니 (화이트)',
    summary: '40L 슬림 14,900원 / 60L 대용량 16,900원. 둘 다 무료배송.',
    tags: ['빨래바구니', '엠비코', '라탄', '수납'],
    instaReady: true,
    instaHook: '40L 슬림 vs 60L 대용량, 우리 집엔 뭐가 맞을까',
    date: '2026-11-26',
    blocks: [
      { type: 'table', head: ['사이즈', '규격', '가격', '추천'], rows: [
        ['40L 슬림형', '45×27×61cm', '14,900원<br>무료배송', '수건만 따로 모으는 틈새용<br>(약간 좁아 넘어짐 주의)'],
        ['60L 대용량', '45×35×61cm', '16,900원<br>무료배송', '2인 가구·수건+옷 겸용<br>안정감']
      ] }
    ],
    links: [
      { label: '네이버 · 엠비코 공식 스토어', url: 'https://smartstore.naver.com/mbko/products/9604947140', note: 'smartstore.naver.com' }
    ]
  },
  {
    id: 'n-wedding-bag',
    cat: 'living', sub: 'tips',
    title: '결혼식 가방순이 필수템 체크리스트',
    summary: '예식 1시간 10분 전 도착 · 가방 2개 · 지인 식권 20~30장까지.',
    tags: ['결혼식', '가방순이', '체크리스트', '준비물'],
    instaReady: true,
    instaHook: '가방순이 필수템, 이거 없으면 진짜 난감해요',
    date: '2026-11-26',
    blocks: [
      { type: 'callout', tone: 'info', icon: '⏰', text: '예식 <strong>1시간 10분 전</strong> 도착 목표. 가방은 본인용·신부용 <strong>2개</strong> 모두 클로징 되는 걸로 챙기기.' },
      { type: 'checklist', items: [
        '본인용 가방 (클로징 되는 것)',
        '신부용 가방 (클로징 되는 것)',
        '편한 신발',
        '지인용 식권 20~30장 미리 챙기기',
        '마시는 청심환',
        '이클립스',
        '빨대 꽂은 물',
        '초콜릿·사탕',
        '축의금 봉투 (여분)',
        '작은 가위',
        '안전핀 (드레스·옷핀)',
        '보조배터리',
        '물티슈·티슈',
        '네임펜',
        '상비약 (두통약·밴드)',
        '립밤·거울'
      ] }
    ],
    links: []
  },
  {
    id: 'n-polyp-claim',
    cat: 'living', sub: 'claim',
    title: '자궁 폴립 수술 실비 · 낮병동 체크',
    summary: '한화생명 실손의료비Ⅱ: 입원 90% vs 통원 20만 원 한도.',
    tags: ['실비', '실손', '낮병동', '자궁폴립'],
    instaReady: false,
    instaHook: null,
    date: '2026-11-26',
    blocks: [
      { type: 'p', text: '한화생명 실손의료비Ⅱ 기준으로 정리.' },
      { type: 'table', head: ['구분', '보장'], rows: [
        ['입원', '90%'],
        ['통원', '20만 원 한도']
      ] },
      { type: 'callout', tone: 'warn', icon: '⚠️', text: '입원으로 인정받으려면 입원실(낮병동) 입실 수속부터 퇴실까지 6시간 이상이어야 해요.' }
    ],
    links: []
  },

  /* ───────── 추가: 요리·레시피 ───────── */
  {
    id: 'n-tamago',
    cat: 'cooking', sub: 'snack',
    title: '왕왕 통실한 전자레인지 타마고 산도',
    summary: '2인분 · 전자레인지 4분. 계란 8개로 두툼한 타마고를 통째로.',
    tags: ['타마고산도', '계란샌드위치', '전자레인지', '간식'],
    instaReady: true,
    instaHook: '전자레인지 4분이면 왕통실 타마고 산도',
    date: '2026-11-26',
    blocks: [
      { type: 'p', text: '<strong>2인분</strong> 기준 (gourmetment).' },
      { type: 'table', head: ['재료', '분량'], rows: [
        ['계란', '8개'],
        ['식빵', '2장'],
        ['설탕', '3큰술'],
        ['쯔유', '2큰술 (간장 대체 가능)'],
        ['미림', '2큰술'],
        ['물', '160ml'],
        ['마요네즈', '2큰술']
      ] },
      { type: 'table', head: ['스프레드', '분량'], rows: [
        ['마요네즈', '1큰술'],
        ['씨겨자', '1큰술 (일반·허니 머스터드 가능)']
      ] },
      { type: 'h', text: '만드는 순서' },
      { type: 'ol', items: [
        '계란 + 설탕 + 쯔유 + 미림 + 물 + 마요네즈를 섮어 체에 거른다.',
        '네모난 내열 용기에 붓고 전자레인지에 약 4분 — <strong>2분 지나면 꺼내 한 번 저어주기!</strong>',
        '포일에 올려 네모 모양을 잡고 10분 식힌다.',
        '식빵에 마요네즈·씨겨자를 바르고 타마고를 올려 자른다.'
      ] },
      { type: 'callout', tone: 'info', icon: '💡', text: '중간에 한 번 저어야 계란이 고루 익고 윗면이 매끈해져요.' }
    ],
    links: []
  },

  /* ───────── 추가: 살림·쇼핑 ───────── */
  {
    id: 'n-daiso',
    cat: 'living', sub: 'daiso',
    title: '테이블/침대 아래 딱 맞는 다이소 수납 꿀조합 품번',
    summary: '선반 1050811 + 바구니 중형 1028333 · 소형 1028334.',
    tags: ['다이소', '수납', '품번', '정리'],
    instaReady: true,
    instaHook: '다이소 품번 3개로 테이블 밑 수납 끝',
    date: '2026-11-26',
    blocks: [
      { type: 'table', head: ['품목', '품번', '메모'], rows: [
        ['선반', '1050811', '테이블·침대 아래 높이 맞춤'],
        ['바구니 중형', '1028333', ''],
        ['바구니 소형', '1028334', '']
      ] },
      { type: 'callout', tone: 'info', icon: '💡', text: '품번 그대로 매장 직원에게 말하거나 다이소 앱에 검색하면 바로 찾을 수 있어요.' }
    ],
    links: []
  },
  {
    id: 'n-kup',
    cat: 'living', sub: 'travel',
    title: "도쿄 여행 당일 호텔 배송 앱 'Kup' (Kup Express)",
    summary: '돈키호테·드럭스토어 인기템을 오프라인보다 저렴하게, 당일 호텔로.',
    tags: ['도쿄여행', 'Kup', '호텔배송', '면세'],
    instaReady: true,
    instaHook: '도쿄 여행 필수템, 호텔로 당일 배송되는 쇼핑앱',
    date: '2026-11-26',
    blocks: [
      { type: 'p', text: '돈키호테·드럭스토어·파미마 파우치 등 일본 인기템을 오프라인보다 저렴하게 주문해서 <strong>당일 호텔로</strong> 받는 쇼핑앱.' },
      { type: 'table', head: ['항목', '내용'], rows: [
        ['결제', '네이버페이 · 카카오페이 · 애플페이 모두 지원'],
        ['배송', '프로모션 기간 무료배송'],
        ['상품', '돈키호테 · 드럭스토어 · 파미마 파우치 등']
      ] },
      { type: 'callout', tone: 'info', icon: '🧳', text: '짐 들고 다니지 않고 호텔에서 받으면 동선이 확 줄어요.' }
    ],
    links: []
  },

  /* ───────── 추가: 인스타·부업 ───────── */
  {
    id: 'n-ai-video',
    cat: 'insta', sub: 'aivideo',
    title: '매일 크레딧 주는 무료 AI 영상 플랫폼 4곳',
    summary: '구글 Flow · Pickshot · Kling · Vidu. 매일 리필되는 무료 한도 비교.',
    tags: ['AI영상', 'Veo', '무료', '릴스'],
    instaReady: true,
    instaHook: '매일 크레딧 리필되는 무료 AI 영상 4곳',
    date: '2026-11-26',
    blocks: [
      { type: 'table', head: ['플랫폼', '무료 혜택', '메모'], rows: [
        ['구글 Flow (Veo 3.1)', '매일 50크레딧 리필', '영상 + 배경 사운드 동시 생성'],
        ['Pickshot', '매일 10편 무료 (5초/720p)', '워터마크 없음 · 개인/기업 구분 없음'],
        ['Kling AI (클링)', '매일 66크레딧 리필', '하루 5초 약 2개 · 고퀄 1티어'],
        ['Vidu (비두)', '새벽·비피크 시간대 무제한', '-']
      ] },
      { type: 'callout', tone: 'info', icon: '💡', text: '하루에 쓸 양이 정해져 있으니 밤에 하나씩 돌려놓고 아침에 모아 쓰는 식이 편해요.' }
    ],
    links: []
  },
  {
    id: 'n-instagram-money',
    cat: 'insta', sub: 'money',
    title: 'AI 영상·정보성 인스타 수익화 & 광고 단가 공식',
    summary: '조회수 수익은 없음 → 광고 단가 계산법과 CPP 플랫폼까지.',
    tags: ['인스타수익화', '광고단가', 'CPP', '계정관리'],
    instaReady: true,
    instaHook: '팔로워 1만, 광고 단가 계산하는 법',
    date: '2026-11-26',
    blocks: [
      { type: 'h', text: '수익 구조' },
      { type: 'p', text: '인스타는 조회수 자체로 돈이 되지 않아요. ① 광고(DM·메일 — <strong>스팸함도 확인!</strong>)나 ② 조회수 보상 플랫폼(CPP)을 씁니다.' },
      { type: 'p', text: 'CPP: <strong>domo · frameo · pixverse · capcut(크레딧)</strong>' },
      { type: 'h', text: '광고 단가 기준' },
      { type: 'ul', items: [
        '최신 릴스 10~12개의 조회수 <strong>중앙값</strong>을 본다 (5~6번째 영상 평균값).',
        '팔로워 1만 명부터 광고 문의가 시작된다.'
      ] },
      { type: 'callout', tone: 'warn', icon: '⚠️', text: '도우인·샤오홍슈 영상을 그대로 퍼오면 원작자 신고로 계정이 막힐 수 있어요. 직접 찍은 영상을 자동화로 편집하는 쪽이 오래 감니다.' }
    ],
    links: []
  },
  {
    id: 'n-claude-gpt',
    cat: 'insta', sub: 'automate',
    title: '클로드 + GPT 영상 편집 시간 단축 루틴',
    summary: '기존 2~3시간 편집 → 20분. GPT로 명령어 만들고 클로드에 넣기.',
    tags: ['클로드', 'GPT', 'CapCut', '자동화'],
    instaReady: true,
    instaHook: '편집 3시간을 20분으로 줄인 GPT×클로드 루틴',
    date: '2026-11-26',
    blocks: [
      { type: 'ol', items: [
        'GPT에게 원하는 기능을 설명한다 (영상 편집, CapCut 빌드, 자동 DM 등).',
        '그 기능을 구현할 <strong>클로드용 명령어</strong>를 만들어 달라고 요청한다.',
        '만든 명령어를 클로드에 붙여넣고 돌린다.',
        '테스트하고, 수정할 부분은 다시 GPT로 보내 명령어를 다듬는다.'
      ] },
      { type: 'callout', tone: 'info', icon: '⏱️', text: '기존 2~3시간 걸리던 편집이 20분으로 줄었어요.' }
    ],
    links: []
  },
  {
    id: 'n-blog-6',
    cat: 'insta', sub: 'blog',
    title: '네이버 블로그 수익화 6단계 순서',
    summary: '애드포스트 → 쇼핑커넥트 → CPA → 원고료 → 숏폼. 순서가 중요.',
    tags: ['블로그', '애드포스트', '쇼핑커넥트', '수익화'],
    instaReady: true,
    instaHook: '블로그 수익화는 순서가 반이에요 — 6단계 로드맵',
    date: '2026-11-26',
    blocks: [
      { type: 'ol', items: [
        '글을 20개쯤 쌓고 <strong>애드포스트</strong>를 신청한다.',
        '본문에 광고를 자연스럽게 배치한다.',
        '일 방문 100명을 넘기면 <strong>쇼핑커넥트(쇼커)</strong>.',
        '여행글에 <strong>CPA</strong>를 붙인다 (숙소·이심 제휴).',
        '원고료 제안을 기다린다.',
        '클립·숏폼 라인으로 확장한다.'
      ] },
      { type: 'callout', tone: 'warn', icon: '⚠️', text: '처음부터 광고판처럼 만들면 검색 노출이 떨어질 수 있어요. 순서를 지키는 게 답.' }
    ],
    links: []
  },
  /* ───────── 추가: 라면·분식 ───────── */
  {
    id: 'n-jjaegaechi',
    cat: 'cooking', sub: 'ramen',
    title: "전라도 아재 비법 '짜계치' 황금 레시피",
    summary: '물 300ml만. 액젓 반 숟갈·설탕 반 숟갈을 처음부터 넣고 같이 끓이기.',
    tags: ['짜계치', '라면', '짜장라면', '꿀조합'],
    instaReady: true,
    instaHook: '짜계치 물 300ml, 처음부터 다 넣고 끓이면 끝',
    date: '2026-11-26',
    blocks: [
      { type: 'p', text: '출처: feed.on.kr' },
      { type: 'table', head: ['재료', '분량'], rows: [
        ['물', '300ml'],
        ['참치액젓 (또는 꽃게·홍게 액젓)', '커피숟갈 1/2'],
        ['설탕', '커피숟갈 1/2'],
        ['들기름', '커피숟갈 1']
      ] },
      { type: 'h', text: '핵심 순서' },
      { type: 'ol', items: [
        '물은 <strong>300ml</strong>만 넣는다.',
        '가루스프 + 건더기스프 + 참치액젓 반 숟갈 + 설탕 반 숟갈을 <strong>처음부터 다</strong> 넣는다.',
        '같이 끓여서 면에 간이 배게 한다.',
        '마지막에 <strong>들기름 커피숟갈 1개</strong>를 뿌려 마무리한다.'
      ] },
      { type: 'callout', tone: 'info', icon: '✨', text: '들기름이 비린내를 잡고 감칠맛을 확 올려줘요.' }
    ],
    links: []
  },

  /* ───────── 추가: 인스타·부업 ───────── */
  {
    id: 'n-shorts-script',
    cat: 'insta', sub: 'script',
    title: '쇼핑 숏폼·릴스 터지는 4단계 대본 공식',
    summary: '경쟁 훅 10개 수집 → 리뷰 30개로 15초 대본 → 생활 장면으로 교체 → 3초 A/B 3세트.',
    tags: ['숏폼', '릴스', '대본', '후킹'],
    instaReady: true,
    instaHook: '쇼핑 숏폼 터지는 대본, 4단계면 됩니다',
    date: '2026-11-26',
    blocks: [
      { type: 'p', text: '출처: ai.balt' },
      { type: 'ol', items: [
        '웹 검색으로 잘 팔리는 경쟁 숏폼의 <strong>첫 3초 후킹 문장 10개</strong>와 <strong>패턴 5가지</strong>를 모은다.',
        '실제 제품 리뷰 30개를 붙여서 <strong>“지갑 연 이유 3가지”</strong>로 15초 대본을 짠다.',
        '광고 티 나는 지루한 설명은 잘라내고 <strong>“생활 속 장면 묘사 1줄”</strong>로 교체한다.',
        '첫 3초 <strong>A/B 테스트 3세트</strong>(공포형 · 숫자형 · 반전형)를 뽑아 둔다.'
      ] },
      { type: 'callout', tone: 'info', icon: '🎬', text: '첫 3초만 바꿔 3세트를 돌려 보면 어떤 훅이 먹히는지 데이터로 남아요.' }
    ],
    links: []
  },
  {
    id: 'n-ai-shopping-shorts',
    cat: 'insta', sub: 'shorts',
    title: 'AI 쇼핑 숏폼 8단계 프롬프트 & 레퍼런스',
    summary: '상품 사진 3장 → 15초 영상. 자막·하이라이트·색감까지 한 번에.',
    tags: ['숏폼', '프롬프트', '마브로', '쇼츠'],
    instaReady: true,
    instaHook: '상품 사진 3장으로 쇼핑 숏폼 만드는 순서',
    date: '2026-11-26',
    blocks: [
      { type: 'h', text: '프롬프트 흐름' },
      { type: 'ol', items: [
        '상품 사진 3장으로 <strong>15초 영상</strong>을 만든다.',
        '<strong>3초 훅 + 15초 구매 대본</strong>을 붙인다.',
        '음소거로 봐도 읽히게 <strong>큰 가격·할인율 자막</strong>을 넣는다.',
        '긴 리뷰에서 <strong>15초 하이라이트 5개</strong>를 추출한다.',
        '택배상자 배경을 지우고 색감을 보정한다.',
        '시리즈끼리 톤을 통일한다.'
      ] },
      { type: 'h', text: '레퍼런스' },
      { type: 'p', text: '<strong>마브로(mavro)</strong> — 반응 좋았던 브랜드 협찬 릴스·쇼츠를 품목별로 모아 둔 벤치마킹 사이트.' },
      { type: 'callout', tone: 'info', icon: '🔍', text: '유튜브 쇼츠는 크롬 시크릿모드로 “구독자 대비 조회수 높은 영상”을 찾아 그 편집법을 벤치마킹.' }
    ],
    links: []
  },

  /* ───────── 추가: 스레드·숏폼·요리 인스타 ───────── */
  {
    id: 'n-thread-affiliate',
    cat: 'insta', sub: 'thread',
    title: '스레드 제휴 글 터지는 8단계 AI 프롬프트',
    summary: '고민 캐내기 → 25자 오프닝 → 280자 본문 → 링크 유도 → 반박 대응.',
    tags: ['스레드', '제휴', '프롬프트', '280자'],
    instaReady: true,
    instaHook: '스레드 제휴 글, 이 8단계로 씁니다',
    date: '2026-11-26',
    blocks: [
      { type: 'p', text: '출처: playto876' },
      { type: 'ol', items: [
        '<strong>고민 캐내기</strong> — 타깃의 불평 5개를 뽑고 상품과 연결한다.',
        '<strong>문제제기 오프닝</strong> — 25자 이내로 장면·감정을 묘사하고, 해결책은 늦게 꺼낸다.',
        '<strong>3-1 사용 장면형</strong> — 메모를 기반으로 280자, “그 뒤로 이렇게 됐다”로 잇는다.',
        '<strong>3-2 안 써본 상품형</strong> — 스펙·Q&A를 생활 언어로 번역한다. 체험 표현은 금지.',
        '<strong>링크 유도</strong> — 자기선택형으로: “우리 집 크기에 맞는지 확인해 봐”.',
        '<strong>3단 가격 추천</strong> — 저·중·고로 나눠 제안한다.',
        '<strong>반박 댓글 대응</strong> — 제휴임을 솔직히 인정하고 단점 1개를 같이 쓴다.',
        '<strong>연재형</strong> — 1편에는 링크를 넣지 않는다.',
        '<strong>성과 비교 분석</strong> — 편별 반응을 비교해 다음 글에 반영한다.'
      ] },
      { type: 'callout', tone: 'info', icon: '🧵', text: '3-1(써본 상품)과 3-2(안 써본 상품) 중 뭘 쓸지 먼저 정하면 대본이 훨씬 빨라져요.' }
    ],
    links: []
  },
  {
    id: 'n-claude-capcut',
    cat: 'insta', sub: 'shorts',
    title: '클로드 + 캡컷 30초 여행·일상 쇼츠 루틴',
    summary: '클로드가 컷 설계, 캡컷은 자르기·자막. 영상 목록은 한 줄 메모로.',
    tags: ['클로드', '캡컷', '쇼츠', '여행영상'],
    instaReady: true,
    instaHook: '30초 쇼츠, 클로드+캡컷으로 20분에',
    date: '2026-11-26',
    blocks: [
      { type: 'p', text: '출처: th.aiinfo' },
      { type: 'table', head: ['도구', '역할'], rows: [
        ['클로드', '컷 설계'],
        ['캡컷', '자르기 · 자막'],
        ['영상 목록', '한 줄 메모']
      ] },
      { type: 'h', text: '클로드에 던지는 프롬프트' },
      { type: 'p', text: '“30초 쇼츠에 쓸 장면 7개 골라서 순서·초수·한 줄 자막 정해줘”' },
      { type: 'callout', tone: 'warn', icon: '💡', text: '영상 보면서 자르다 지치지 말고, 한 줄 메모로 장면을 먼저 고르세요.' }
    ],
    links: []
  },
  {
    id: 'n-cooking-insta-rules',
    cat: 'insta', sub: 'money',
    title: '요리 인스타 하면서 깨달은 10가지 룰',
    summary: '3시간 요리보다 10분 3분컷. 썸네일·계절감·냉털이 답.',
    tags: ['요리인스타', '릴스', '썸네일', '조회수'],
    instaReady: true,
    instaHook: '요리 인스타, 3시간 정성보다 3분컷이 터집니다',
    date: '2026-11-26',
    blocks: [
      { type: 'p', text: '출처: foodgasm.recipe · 캡처에서 확인된 5가지부터 정리.' },
      { type: 'ul', items: [
        '3시간 정성 요리보다 <strong>10분 자취생 3분컷</strong>이 조회수가 폭발한다.',
        '썸네일은 자극적으로 — “이거 넣었더니 대기업 맛남”.',
        '라면 + 불닭소스는 무적 치트키.',
        '계절감을 탄다 — 여름 열무국수, 겨울 붕어빵·고구마.',
        '냉털 요리가 잘 먹힌다.'
      ] }
    ],
    links: []
  },

  /* ───────── 추가: 미용·건강 ───────── */
  {
    id: 'n-bath-5',
    cat: 'beauty', sub: 'body',
    title: '피로·붓기·생리통 잡는 입욕제 5종 비교',
    summary: '근육 이완부터 쿨링·각질까지. 가격과 스쿱 양까지 정리.',
    tags: ['입욕제', '반신욕', '붓기', '생리통'],
    instaReady: true,
    instaHook: '붓기·생리통엔 이 입욕제, 가격별로 정리했어요',
    date: '2026-11-26',
    blocks: [
      { type: 'p', text: '출처: primmjena' },
      { type: 'table', head: ['제품', '가격', '사용량', '언제'], rows: [
        ['바스크린 초록이(마그네슘)·파랑이(칼슘)', '19,300원 / 9,900원', '뚜껑 1컵', '근육 이완'],
        ['오리지널 약탕 입욕제 박하뇌', '30,500원', '3스쿱', '시원한 쿨링 (과다 투입 시 추움 주의)'],
        ['딸라스파 발네오 배쓰 솔트', '67,000원', '2스쿱', '다리 부은 날 · 향기 최고'],
        ['딸락스파 엑스폴리에이팅 마린 솔트', '77,000원', '2스쿱', '반신욕 + 묵은 각질 관리'],
        ['휴온재 강화 어린약쑥 입욕제', '23,900원', '—', '몸 찬 날 · 생리 전후 찜질 느낌']
      ] },
      { type: 'callout', tone: 'info', icon: '🛁', text: '붓기엔 발네오, 찬 몸엔 어린약쑥, 각질엔 마린 솔트로 나눠 쓰면 좋아요.' }
    ],
    links: []
  },
  {
    id: 'n-daiso-palette',
    cat: 'beauty', sub: 'daisocosmetic',
    title: '다이소 1,000원 4구 커스텀 팔레트 품번',
    summary: '품번 343002431. 립·치크·크림 섀도우 소분해 들고 다니기.',
    tags: ['다이소', '팔레트', '품번', '소분'],
    instaReady: true,
    instaHook: '다이소 1,000원으로 4구 팔레트 만들기',
    date: '2026-11-26',
    blocks: [
      { type: 'table', head: ['품명', '내용'], rows: [
        ['제품', '커스텀 수납케이스 이너 B (일본제)'],
        ['품번', '343002431'],
        ['가격', '1,000원'],
        ['용도', '립 · 치크 · 크림 섀도우 소분 휴대용']
      ] },
      { type: 'callout', tone: 'info', icon: '💄', text: '품번 그대로 매장에 물어보거나 다이소 앱에 검색하면 바로 나와요.' }
    ],
    links: []
  },

  /* ───────── 추가: 살림·쇼핑 ───────── */
  {
    id: 'n-daiso-febreze',
    cat: 'living', sub: 'daisolife',
    title: '다이소 2,000원 향따템 페브리즈 다우니',
    summary: '비싼 니치 향수보다 반응 좋았던 가성비 섬유향수.',
    tags: ['다이소', '페브리즈', '섬유향수', '가성비'],
    instaReady: true,
    instaHook: '2,000원인데 향수보다 반응 좋은 섬유향수',
    date: '2026-11-26',
    blocks: [
      { type: 'p', text: '다이소 <strong>2,000원</strong> 페브리즈 핑크 다우니향. 비싼 니치 향수보다 반응이 좋았던 가성비 섬유향수.' },
      { type: 'table', head: ['제품', '가격', '구분'], rows: [
        ['페브리즈 핑크 다우니향', '2,000원', '섬유향수']
      ] }
    ],
    links: []
  },
  {
    id: 'n-ulsan-food',
    cat: 'living', sub: 'food',
    title: '울산 로컬 맛집 도장깨기 리스트',
    summary: '1점·2점·3점 단계별 29곳. 부라더고깃집부터 식신통삼겹구이까지.',
    tags: ['울산맛집', '로컬', '도장깨기', '리스트'],
    instaReady: true,
    instaHook: '울산 로컬 맛집, 이 순서로 도장깨기',
    date: '2026-11-26',
    blocks: [
      { type: 'p', text: '출처: hongyami_ · 가 본 곳은 체크해 두기.' },
      { type: 'h', text: '1점 — 먼저 갈 곳' },
      { type: 'checklist', items: [
        '부라더고깃집', '샤랑도', '하동식당', '원조대구막창', '뚱이한우국밥',
        '계원닭집', '조포닭발', '대밭골돼지국밥', '북경손짜장', '아키라'
      ] },
      { type: 'h', text: '2점' },
      { type: 'checklist', items: [
        '진미콩칼국수', '밀양시골밥상', '풍로옥', '산동만두', '연춘참숯석쇠구이',
        '미진돌곱창', '경주손칼국수', '종가돼지국밥', '83왕소금구이', '정자항산오징어'
      ] },
      { type: 'h', text: '3점' },
      { type: 'checklist', items: [
        '변강쇠숯불촌', '산정생불고기', '가무댕댕', '돌집민물장어', '언양기와집불고기',
        '청수골가든', '진하꽃게전문점', '거부돌곱창', '식신통삼겹구이'
      ] }
    ],
    links: []
  }
];

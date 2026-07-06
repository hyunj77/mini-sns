export const FOOD_CATEGORIES = ['전체', '밥/면류', '한식', '단백질', '채소/과일', '유제품', '간식', '음료', '건강식', '패스트푸드']

export const FOOD_DB = [
  // 밥/면류
  { id: 'f01', emoji: '🍚', name: '흰쌀밥',     calories: 300, serving: '1공기(200g)',  category: '밥/면류' },
  { id: 'f02', emoji: '🍚', name: '현미밥',     calories: 270, serving: '1공기(200g)',  category: '밥/면류' },
  { id: 'f03', emoji: '🍚', name: '잡곡밥',     calories: 280, serving: '1공기(200g)',  category: '밥/면류' },
  { id: 'f04', emoji: '🍜', name: '라면',       calories: 505, serving: '1봉지',        category: '밥/면류' },
  { id: 'f05', emoji: '🍜', name: '짜파게티',   calories: 500, serving: '1봉지',        category: '밥/면류' },
  { id: 'f06', emoji: '🍝', name: '짜장면',     calories: 680, serving: '1그릇',        category: '밥/면류' },
  { id: 'f07', emoji: '🍜', name: '짬뽕',       calories: 600, serving: '1그릇',        category: '밥/면류' },
  { id: 'f08', emoji: '🍳', name: '볶음밥',     calories: 500, serving: '1인분',        category: '밥/면류' },
  { id: 'f09', emoji: '🍱', name: '비빔밥',     calories: 550, serving: '1그릇',        category: '밥/면류' },
  { id: 'f10', emoji: '🍜', name: '우동',       calories: 450, serving: '1그릇',        category: '밥/면류' },
  { id: 'f11', emoji: '🍝', name: '파스타',     calories: 620, serving: '1인분',        category: '밥/면류' },

  // 한식
  { id: 'f12', emoji: '🍲', name: '김치찌개',   calories: 280, serving: '1인분',        category: '한식' },
  { id: 'f13', emoji: '🍲', name: '된장찌개',   calories: 200, serving: '1인분',        category: '한식' },
  { id: 'f14', emoji: '🍲', name: '순두부찌개', calories: 220, serving: '1인분',        category: '한식' },
  { id: 'f15', emoji: '🥩', name: '삼겹살',     calories: 500, serving: '200g',         category: '한식' },
  { id: 'f16', emoji: '🥩', name: '불고기',     calories: 350, serving: '1인분(200g)', category: '한식' },
  { id: 'f17', emoji: '🍖', name: '제육볶음',   calories: 400, serving: '1인분',        category: '한식' },
  { id: 'f18', emoji: '🍢', name: '떡볶이',     calories: 400, serving: '1인분',        category: '한식' },
  { id: 'f19', emoji: '🍗', name: '치킨(반마리)', calories: 850, serving: '반마리',    category: '한식' },
  { id: 'f20', emoji: '🥟', name: '군만두',     calories: 350, serving: '6개',          category: '한식' },
  { id: 'f21', emoji: '🍘', name: '김밥',       calories: 380, serving: '1줄',          category: '한식' },
  { id: 'f22', emoji: '🍜', name: '갈비탕',     calories: 480, serving: '1그릇',        category: '한식' },
  { id: 'f23', emoji: '🍖', name: '갈비구이',   calories: 600, serving: '1인분(300g)', category: '한식' },
  { id: 'f24', emoji: '🍚', name: '덮밥(소고기)', calories: 650, serving: '1그릇',     category: '한식' },

  // 단백질
  { id: 'f25', emoji: '🍗', name: '닭가슴살',     calories: 165, serving: '100g',        category: '단백질' },
  { id: 'f26', emoji: '🍗', name: '닭가슴살 구이', calories: 150, serving: '100g',       category: '단백질' },
  { id: 'f27', emoji: '🥚', name: '삶은 달걀',    calories: 78,  serving: '1개',         category: '단백질' },
  { id: 'f28', emoji: '🥚', name: '달걀프라이',   calories: 90,  serving: '1개',         category: '단백질' },
  { id: 'f29', emoji: '🐟', name: '연어구이',     calories: 250, serving: '150g',        category: '단백질' },
  { id: 'f30', emoji: '🐟', name: '고등어구이',   calories: 280, serving: '1마리',       category: '단백질' },
  { id: 'f31', emoji: '🐠', name: '참치캔',       calories: 110, serving: '1캔(100g)',   category: '단백질' },
  { id: 'f32', emoji: '🥩', name: '소고기 스테이크', calories: 350, serving: '150g',    category: '단백질' },
  { id: 'f33', emoji: '🍳', name: '두부구이',     calories: 120, serving: '100g',        category: '단백질' },
  { id: 'f34', emoji: '🥛', name: '프로틴쉐이크', calories: 130, serving: '1스쿱',      category: '단백질' },
  { id: 'f35', emoji: '🥩', name: '돼지 안심',    calories: 200, serving: '100g',        category: '단백질' },

  // 채소/과일
  { id: 'f36', emoji: '🥗', name: '그린 샐러드',  calories: 80,  serving: '1접시',       category: '채소/과일' },
  { id: 'f37', emoji: '🥦', name: '브로콜리',     calories: 35,  serving: '100g',        category: '채소/과일' },
  { id: 'f38', emoji: '🥕', name: '당근',         calories: 40,  serving: '100g',        category: '채소/과일' },
  { id: 'f39', emoji: '🍅', name: '방울토마토',   calories: 20,  serving: '10개',        category: '채소/과일' },
  { id: 'f40', emoji: '🥒', name: '오이',         calories: 15,  serving: '1개',         category: '채소/과일' },
  { id: 'f41', emoji: '🍌', name: '바나나',       calories: 90,  serving: '1개',         category: '채소/과일' },
  { id: 'f42', emoji: '🍎', name: '사과',         calories: 80,  serving: '1개(200g)',   category: '채소/과일' },
  { id: 'f43', emoji: '🍊', name: '귤',           calories: 45,  serving: '1개',         category: '채소/과일' },
  { id: 'f44', emoji: '🍇', name: '포도',         calories: 100, serving: '1송이',       category: '채소/과일' },
  { id: 'f45', emoji: '🍓', name: '딸기',         calories: 35,  serving: '10개',        category: '채소/과일' },
  { id: 'f46', emoji: '🥝', name: '키위',         calories: 60,  serving: '1개',         category: '채소/과일' },
  { id: 'f47', emoji: '🍠', name: '고구마',       calories: 130, serving: '1개(100g)',   category: '채소/과일' },
  { id: 'f48', emoji: '🫐', name: '블루베리',     calories: 57,  serving: '100g',        category: '채소/과일' },
  { id: 'f49', emoji: '🍋', name: '레몬',         calories: 20,  serving: '1개',         category: '채소/과일' },

  // 유제품
  { id: 'f50', emoji: '🥛', name: '우유',         calories: 130, serving: '200ml',       category: '유제품' },
  { id: 'f51', emoji: '🥣', name: '그릭요거트',   calories: 100, serving: '150g',        category: '유제품' },
  { id: 'f52', emoji: '🧀', name: '슬라이스 치즈', calories: 70, serving: '1장',         category: '유제품' },
  { id: 'f53', emoji: '🥣', name: '플레인 요거트', calories: 90, serving: '150g',        category: '유제품' },
  { id: 'f54', emoji: '🧈', name: '버터',         calories: 100, serving: '10g',         category: '유제품' },

  // 간식
  { id: 'f55', emoji: '🍫', name: '초콜릿',       calories: 250, serving: '50g',         category: '간식' },
  { id: 'f56', emoji: '🍪', name: '오레오',       calories: 160, serving: '4개',         category: '간식' },
  { id: 'f57', emoji: '🥜', name: '아몬드',       calories: 170, serving: '30g(한줌)',   category: '간식' },
  { id: 'f58', emoji: '🥜', name: '견과류 믹스',  calories: 180, serving: '30g',         category: '간식' },
  { id: 'f59', emoji: '🍰', name: '케이크',       calories: 400, serving: '1조각',       category: '간식' },
  { id: 'f60', emoji: '🍩', name: '도넛',         calories: 270, serving: '1개',         category: '간식' },
  { id: 'f61', emoji: '🍦', name: '아이스크림',   calories: 200, serving: '1개',         category: '간식' },
  { id: 'f62', emoji: '🍡', name: '떡',           calories: 200, serving: '100g',        category: '간식' },
  { id: 'f63', emoji: '🍿', name: '팝콘',         calories: 160, serving: '40g',         category: '간식' },

  // 음료
  { id: 'f64', emoji: '☕', name: '아메리카노',   calories: 10,  serving: '355ml',       category: '음료' },
  { id: 'f65', emoji: '☕', name: '카페라떼',     calories: 150, serving: '355ml',       category: '음료' },
  { id: 'f66', emoji: '🧃', name: '오렌지주스',   calories: 120, serving: '250ml',       category: '음료' },
  { id: 'f67', emoji: '🧃', name: '콜라',         calories: 140, serving: '355ml',       category: '음료' },
  { id: 'f68', emoji: '🍺', name: '맥주',         calories: 150, serving: '500ml',       category: '음료' },
  { id: 'f69', emoji: '🧃', name: '이온음료',     calories: 50,  serving: '500ml',       category: '음료' },
  { id: 'f70', emoji: '🧋', name: '버블티',       calories: 350, serving: '1잔',         category: '음료' },
  { id: 'f71', emoji: '🥛', name: '초코우유',     calories: 180, serving: '200ml',       category: '음료' },

  // 건강식
  { id: 'f72', emoji: '🥣', name: '오트밀',       calories: 150, serving: '40g(건조)',   category: '건강식' },
  { id: 'f73', emoji: '💊', name: '프로틴바',     calories: 200, serving: '1개(55g)',    category: '건강식' },
  { id: 'f74', emoji: '🥗', name: '닭가슴살 샐러드', calories: 250, serving: '1인분',   category: '건강식' },
  { id: 'f75', emoji: '🐟', name: '연어 포케볼',  calories: 420, serving: '1그릇',       category: '건강식' },
  { id: 'f76', emoji: '🥚', name: '에그 오믈렛',  calories: 150, serving: '2개 분량',    category: '건강식' },
  { id: 'f77', emoji: '🫘', name: '검은콩밥',     calories: 290, serving: '1공기',       category: '건강식' },

  // 패스트푸드
  { id: 'f78', emoji: '🍔', name: '빅맥',         calories: 550, serving: '1개',         category: '패스트푸드' },
  { id: 'f79', emoji: '🍟', name: '감자튀김(M)',  calories: 340, serving: '1개',         category: '패스트푸드' },
  { id: 'f80', emoji: '🍕', name: '피자(페페로니)', calories: 300, serving: '1조각',     category: '패스트푸드' },
  { id: 'f81', emoji: '🌮', name: '서브웨이',     calories: 380, serving: '15cm 1개',    category: '패스트푸드' },
  { id: 'f82', emoji: '🍗', name: '프라이드치킨', calories: 300, serving: '1조각',       category: '패스트푸드' },
  { id: 'f83', emoji: '🍔', name: '와퍼',         calories: 630, serving: '1개',         category: '패스트푸드' },
  { id: 'f84', emoji: '🍱', name: '편의점 도시락', calories: 550, serving: '1개',        category: '패스트푸드' },
  { id: 'f85', emoji: '🍙', name: '삼각김밥',     calories: 180, serving: '1개',         category: '패스트푸드' },
]

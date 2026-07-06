export const EXERCISE_CATEGORIES = ['전체', '가슴', '등', '하체', '어깨', '팔', '복근', '유산소', '전신']

export const EXERCISE_CATEGORY_EMOJI = {
  '전체': '🏋️', '가슴': '💪', '등': '🔙', '하체': '🦵',
  '어깨': '🙆', '팔': '💪', '복근': '🔥', '유산소': '🏃', '전신': '⚡',
}

export const EXERCISE_DB = [
  // 가슴
  { id: 'e01', emoji: '🏋️', name: '벤치프레스',          category: '가슴', defaultSets: '4', defaultReps: '8',    muscle: '대흉근', howTo: '벤치에 누워 바벨을 어깨 너비보다 약간 넓게 잡습니다. 가슴까지 천천히 내린 뒤 팔꿈치를 펴며 밀어 올립니다. 견갑골을 모아 고정한 상태를 유지하세요.' },
  { id: 'e02', emoji: '🏋️', name: '인클라인 벤치프레스', category: '가슴', defaultSets: '3', defaultReps: '10',   muscle: '상부흉근', howTo: '각도를 올린 벤치에서 진행해 가슴 상부를 집중적으로 자극합니다. 바를 쇄골 방향으로 내렸다가 밀어 올립니다. 어깨가 말리지 않도록 주의하세요.' },
  { id: 'e03', emoji: '🏋️', name: '디클라인 벤치프레스', category: '가슴', defaultSets: '3', defaultReps: '10',   muscle: '하부흉근', howTo: '각도를 낮춘 벤치에서 진행해 가슴 하부를 자극합니다. 바를 명치 쪽으로 내렸다가 수직으로 밀어 올립니다. 발을 고정해 안정성을 확보하세요.' },
  { id: 'e04', emoji: '🏋️', name: '덤벨 플라이',          category: '가슴', defaultSets: '3', defaultReps: '12',   muscle: '대흉근', howTo: '벤치에 누워 덤벨을 가슴 위로 든 뒤 팔꿈치를 살짝 굽힌 채 양옆으로 벌립니다. 가슴이 스트레칭되는 지점까지 내린 뒤 다시 모읍니다.' },
  { id: 'e05', emoji: '💪', name: '딥스',                 category: '가슴', defaultSets: '3', defaultReps: '15',   muscle: '대흉근/삼두', howTo: '평행봉을 잡고 몸을 지탱한 채 팔꿈치를 굽혀 상체를 내립니다. 가슴이 늘어나는 느낌이 들면 다시 밀어 올립니다. 상체를 살짝 숙이면 가슴에 더 집중됩니다.' },
  { id: 'e06', emoji: '💪', name: '푸쉬업',               category: '가슴', defaultSets: '3', defaultReps: '20',   muscle: '대흉근', howTo: '손을 어깨 너비로 짚고 몸을 일직선으로 유지한 채 가슴이 바닥에 가까워질 때까지 내립니다. 코어에 힘을 주고 팔을 펴며 올라옵니다.' },
  { id: 'e07', emoji: '🏋️', name: '케이블 크로스오버',   category: '가슴', defaultSets: '3', defaultReps: '15',   muscle: '대흉근 내측', howTo: '케이블을 양손으로 잡고 상체를 살짝 숙인 채 팔을 가슴 앞으로 모읍니다. 가슴 안쪽 수축을 느끼며 천천히 제자리로 돌아갑니다.' },

  // 등
  { id: 'e08', emoji: '🏋️', name: '데드리프트',          category: '등',   defaultSets: '4', defaultReps: '5',    muscle: '광배근/척추기립근', howTo: '바벨 앞에 서서 허리를 곧게 펴고 엉덩이를 뒤로 뺀 채 바를 잡습니다. 다리와 등 힘으로 바를 들어올려 완전히 일어섭니다. 허리가 굽지 않도록 유의하세요.' },
  { id: 'e09', emoji: '🏋️', name: '바벨 로우',           category: '등',   defaultSets: '4', defaultReps: '8',    muscle: '광배근/승모근', howTo: '상체를 45도 정도 숙인 채 바벨을 배꼽 쪽으로 당깁니다. 등 근육 수축을 느끼며 천천히 내립니다. 허리는 곧게 유지하세요.' },
  { id: 'e10', emoji: '🏋️', name: '랫 풀다운',           category: '등',   defaultSets: '3', defaultReps: '12',   muscle: '광배근', howTo: '그립을 넓게 잡고 바를 가슴 상부로 당깁니다. 팔이 아닌 등 근육으로 당기는 느낌에 집중하고, 천천히 원위치로 돌아갑니다.' },
  { id: 'e11', emoji: '💪', name: '풀업',                 category: '등',   defaultSets: '3', defaultReps: '실패', muscle: '광배근/이두', howTo: '봉을 어깨너비보다 넓게 잡고 턱이 봉 위로 올라올 때까지 몸을 끌어올립니다. 등 근육으로 당기고 천천히 내려옵니다.' },
  { id: 'e12', emoji: '💪', name: '친업',                 category: '등',   defaultSets: '3', defaultReps: '실패', muscle: '광배근/이두', howTo: '봉을 어깨너비로 손바닥이 자신을 향하게 잡고 몸을 끌어올립니다. 이두근과 등 근육을 함께 사용하는 동작입니다.' },
  { id: 'e13', emoji: '🏋️', name: '케이블 로우',         category: '등',   defaultSets: '3', defaultReps: '12',   muscle: '중부승모근', howTo: '케이블 손잡이를 잡고 등을 곧게 편 채 팔꿈치를 몸 뒤로 당깁니다. 견갑골을 모으는 느낌으로 수축한 뒤 천천히 되돌립니다.' },
  { id: 'e14', emoji: '🏋️', name: '덤벨 로우',           category: '등',   defaultSets: '3', defaultReps: '12',   muscle: '광배근', howTo: '한 손과 무릎을 벤치에 지지하고 덤벨을 허리 쪽으로 당깁니다. 등 근육으로 당기고 팔꿈치를 몸통에 붙여 움직입니다.' },
  { id: 'e15', emoji: '🏋️', name: '시티드 로우',         category: '등',   defaultSets: '3', defaultReps: '12',   muscle: '광배근/승모근', howTo: '시티드 로우 머신에 앉아 무릎을 살짝 굽히고 손잡이를 배 쪽으로 당깁니다. 상체를 고정한 채 등 근육으로 당기세요.' },

  // 하체
  { id: 'e16', emoji: '🏋️', name: '스쿼트',              category: '하체', defaultSets: '4', defaultReps: '8',    muscle: '대퇴사두근/둔근', howTo: '바벨을 어깨에 얹고 발을 어깨너비로 벌립니다. 무릎이 발끝 방향을 향하도록 앉았다가 발바닥으로 밀어 일어섭니다.' },
  { id: 'e17', emoji: '🏋️', name: '레그 프레스',         category: '하체', defaultSets: '4', defaultReps: '12',   muscle: '대퇴사두근', howTo: '발판에 발을 어깨너비로 올리고 무릎을 굽혀 내렸다가 밀어 올립니다. 무릎이 안쪽으로 모이지 않도록 주의하세요.' },
  { id: 'e18', emoji: '🏋️', name: '레그 컬',             category: '하체', defaultSets: '3', defaultReps: '12',   muscle: '대퇴이두근', howTo: '머신에 엎드리거나 앉아 다리를 굽혀 패드를 발뒤꿈치 쪽으로 당깁니다. 햄스트링 수축을 느끼며 천천히 되돌립니다.' },
  { id: 'e19', emoji: '🏋️', name: '레그 익스텐션',       category: '하체', defaultSets: '3', defaultReps: '15',   muscle: '대퇴사두근', howTo: '머신에 앉아 무릎을 펴며 패드를 들어올립니다. 대퇴사두근 수축을 느끼고 천천히 내립니다.' },
  { id: 'e20', emoji: '💪', name: '런지',                 category: '하체', defaultSets: '3', defaultReps: '12',   muscle: '대퇴사두근/둔근', howTo: '한 발을 크게 앞으로 내딛고 무릎을 굽혀 몸을 내립니다. 뒷무릎이 바닥에 닿기 직전까지 내렸다가 밀고 올라옵니다.' },
  { id: 'e21', emoji: '🏋️', name: '루마니안 데드리프트', category: '하체', defaultSets: '3', defaultReps: '10',   muscle: '햄스트링/둔근', howTo: '무릎을 살짝 굽힌 채 엉덩이를 뒤로 빼며 바벨을 정강이 앞으로 내립니다. 햄스트링이 늘어나는 느낌에서 다시 일어섭니다.' },
  { id: 'e22', emoji: '💪', name: '카프 레이즈',          category: '하체', defaultSets: '4', defaultReps: '20',   muscle: '비복근', howTo: '발끝으로 서서 발뒤꿈치를 최대한 들어올립니다. 종아리 수축을 느끼며 천천히 내렸다가 반복합니다.' },
  { id: 'e23', emoji: '💪', name: '불가리안 스플릿 스쿼트', category: '하체', defaultSets: '3', defaultReps: '10', muscle: '대퇴사두근/둔근', howTo: '뒷발을 벤치에 올리고 앞다리로 무릎을 굽혀 내려갑니다. 앞다리 대퇴사두근과 둔근에 집중하며 밀어 올라옵니다.' },
  { id: 'e24', emoji: '🏋️', name: '힙 쓰러스트',         category: '하체', defaultSets: '4', defaultReps: '12',   muscle: '둔근', howTo: '등을 벤치에 기댄 채 바벨을 골반 위에 올리고 엉덩이를 들어올립니다. 정상에서 둔근을 강하게 수축시킵니다.' },
  { id: 'e25', emoji: '💪', name: '와이드 스쿼트',        category: '하체', defaultSets: '3', defaultReps: '15',   muscle: '내전근/둔근', howTo: '발을 어깨너비보다 넓게 벌리고 발끝을 바깥으로 향한 채 앉습니다. 내전근과 둔근을 자극하는 스쿼트 변형입니다.' },

  // 어깨
  { id: 'e26', emoji: '🏋️', name: '오버헤드 프레스',     category: '어깨', defaultSets: '4', defaultReps: '8',    muscle: '삼각근 전면', howTo: '바벨이나 덤벨을 어깨 높이에서 머리 위로 밀어 올립니다. 코어에 힘을 주고 허리가 과하게 젖혀지지 않도록 합니다.' },
  { id: 'e27', emoji: '🏋️', name: '사이드 레터럴 레이즈', category: '어깨', defaultSets: '3', defaultReps: '15',  muscle: '삼각근 측면', howTo: '덤벨을 양손에 들고 팔을 옆으로 어깨 높이까지 들어올립니다. 삼각근 측면 수축을 느끼며 천천히 내립니다.' },
  { id: 'e28', emoji: '🏋️', name: '프론트 레이즈',       category: '어깨', defaultSets: '3', defaultReps: '12',   muscle: '삼각근 전면', howTo: '덤벨을 양손에 들고 팔을 앞으로 어깨 높이까지 들어올립니다. 반동 없이 천천히 들고 내리세요.' },
  { id: 'e29', emoji: '🏋️', name: '리어 델트 플라이',    category: '어깨', defaultSets: '3', defaultReps: '15',   muscle: '삼각근 후면', howTo: '상체를 숙인 채 덤벨을 양옆으로 들어올려 어깨 뒤쪽을 자극합니다. 팔꿈치를 살짝 굽힌 상태를 유지합니다.' },
  { id: 'e30', emoji: '🏋️', name: '페이스 풀',           category: '어깨', defaultSets: '3', defaultReps: '15',   muscle: '후면삼각근/회전근개', howTo: '케이블을 얼굴 쪽으로 당기며 팔꿈치를 뒤로 벌립니다. 어깨 후면과 회전근개 강화에 효과적입니다.' },

  // 팔
  { id: 'e31', emoji: '💪', name: '바벨 컬',              category: '팔',   defaultSets: '3', defaultReps: '12',   muscle: '상완이두근', howTo: '바벨을 어깨너비로 잡고 팔꿈치를 고정한 채 굽혀 들어올립니다. 이두근 수축을 느끼며 천천히 내립니다.' },
  { id: 'e32', emoji: '💪', name: '덤벨 컬',              category: '팔',   defaultSets: '3', defaultReps: '12',   muscle: '상완이두근', howTo: '덤벨을 양손에 들고 팔꿈치를 몸통에 고정한 채 번갈아 굽혀 올립니다. 손목이 꺾이지 않도록 주의하세요.' },
  { id: 'e33', emoji: '💪', name: '해머 컬',              category: '팔',   defaultSets: '3', defaultReps: '12',   muscle: '상완근/이두', howTo: '덤벨을 손바닥이 마주보게 잡고 굽혀 올립니다. 상완근과 이두근을 함께 자극합니다.' },
  { id: 'e34', emoji: '💪', name: '트라이셉스 푸쉬다운',  category: '팔',   defaultSets: '3', defaultReps: '15',   muscle: '상완삼두근', howTo: '케이블 바를 잡고 팔꿈치를 고정한 채 아래로 밀어 팔을 폅니다. 삼두근 수축을 느끼며 천천히 되돌립니다.' },
  { id: 'e35', emoji: '🏋️', name: '스컬 크러셔',         category: '팔',   defaultSets: '3', defaultReps: '12',   muscle: '상완삼두근', howTo: '누운 상태에서 바벨을 이마 쪽으로 굽혔다가 팔꿈치만 움직여 펴 올립니다. 팔꿈치가 벌어지지 않도록 고정하세요.' },
  { id: 'e36', emoji: '💪', name: '오버헤드 트라이셉스',  category: '팔',   defaultSets: '3', defaultReps: '12',   muscle: '상완삼두근 장두', howTo: '덤벨을 머리 위로 든 채 팔꿈치를 굽혀 뒤로 내렸다가 폅니다. 삼두근 장두를 집중적으로 자극합니다.' },

  // 복근
  { id: 'e37', emoji: '🔥', name: '크런치',               category: '복근', defaultSets: '3', defaultReps: '20',   muscle: '복직근', howTo: '누워서 무릎을 굽히고 상체를 말아 올립니다. 목이 아닌 복근의 힘으로 들어올리세요.' },
  { id: 'e38', emoji: '🔥', name: '레그 레이즈',          category: '복근', defaultSets: '3', defaultReps: '15',   muscle: '하복부', howTo: '누운 상태에서 다리를 곧게 펴고 들어올렸다 내립니다. 허리가 뜨지 않도록 하복부에 힘을 줍니다.' },
  { id: 'e39', emoji: '🔥', name: '플랭크',               category: '복근', defaultSets: '3', defaultReps: '60초', muscle: '코어 전체', howTo: '팔꿈치와 발끝으로 몸을 지지하며 몸을 일직선으로 유지합니다. 엉덩이가 처지거나 솟지 않도록 코어에 힘을 줍니다.' },
  { id: 'e40', emoji: '🔥', name: '사이드 플랭크',        category: '복근', defaultSets: '3', defaultReps: '45초', muscle: '외복사근', howTo: '옆으로 누워 팔꿈치로 몸을 지지하고 골반을 들어 일직선을 유지합니다. 옆구리 코어 근육을 강화합니다.' },
  { id: 'e41', emoji: '🔥', name: '마운틴 클라이머',      category: '복근', defaultSets: '3', defaultReps: '30초', muscle: '복근/전신', howTo: '플랭크 자세에서 무릎을 번갈아 가슴 쪽으로 빠르게 당깁니다. 코어와 유산소를 동시에 자극합니다.' },
  { id: 'e42', emoji: '🔥', name: '러시안 트위스트',      category: '복근', defaultSets: '3', defaultReps: '20',   muscle: '복사근', howTo: '바닥에 앉아 상체를 살짝 젖힌 채 좌우로 몸통을 회전시킵니다. 복사근을 집중적으로 자극합니다.' },
  { id: 'e43', emoji: '🔥', name: '케이블 크런치',        category: '복근', defaultSets: '3', defaultReps: '15',   muscle: '복직근', howTo: '케이블 로프를 잡고 무릎을 꿇은 채 상체를 말아 내립니다. 복근으로만 움직이는 느낌에 집중하세요.' },

  // 유산소
  { id: 'e44', emoji: '🏃', name: '러닝',                 category: '유산소', defaultSets: '1', defaultReps: '30분',  muscle: '전신', howTo: '일정한 페이스로 달리며 심박수를 유지합니다. 발볼로 착지하고 상체는 곧게 세우세요.' },
  { id: 'e45', emoji: '🚴', name: '자전거(실내)',          category: '유산소', defaultSets: '1', defaultReps: '30분',  muscle: '하체/전신', howTo: '안장 높이를 무릎이 살짝 굽혀지는 정도로 맞추고 일정한 케이던스로 페달링합니다.' },
  { id: 'e46', emoji: '🏊', name: '수영',                 category: '유산소', defaultSets: '1', defaultReps: '30분',  muscle: '전신', howTo: '전신을 사용하는 유산소 운동으로 호흡과 스트로크 리듬을 일정하게 유지합니다.' },
  { id: 'e47', emoji: '🏃', name: '일립티컬',             category: '유산소', defaultSets: '1', defaultReps: '30분',  muscle: '전신', howTo: '손잡이와 발판을 함께 움직이며 상하체를 동시에 사용하는 저충격 유산소 운동입니다.' },
  { id: 'e48', emoji: '⛹️', name: '줄넘기',               category: '유산소', defaultSets: '3', defaultReps: '3분',   muscle: '전신', howTo: '손목 스냅으로 줄을 돌리고 가볍게 제자리 점프하며 넘습니다. 무릎 충격을 줄이기 위해 살짝 굽혀 착지하세요.' },
  { id: 'e49', emoji: '💪', name: '버피',                 category: '유산소', defaultSets: '3', defaultReps: '10',    muscle: '전신', howTo: '스쿼트 자세에서 손을 짚고 다리를 뒤로 뻗어 플랭크, 다시 당겨 점프합니다. 전신 유산소·근력 복합 운동입니다.' },
  { id: 'e50', emoji: '🚶', name: '걷기',                 category: '유산소', defaultSets: '1', defaultReps: '60분',  muscle: '하체', howTo: '빠른 속도로 걸으며 팔을 자연스럽게 흔듭니다. 부담이 적어 꾸준히 하기 좋은 유산소 운동입니다.' },
  { id: 'e51', emoji: '🏋️', name: '로잉머신',             category: '유산소', defaultSets: '1', defaultReps: '20분',  muscle: '전신', howTo: '다리로 밀고 상체를 젖히며 손잡이를 당기는 순서로 노를 젓듯 움직입니다. 전신을 고르게 사용합니다.' },
  { id: 'e52', emoji: '🏃', name: '인터벌 트레이닝(HIIT)', category: '유산소', defaultSets: '5', defaultReps: '4분',  muscle: '전신', howTo: '고강도 운동과 짧은 휴식을 반복합니다. 예: 전력 질주 30초 + 휴식 30초를 여러 세트 반복합니다.' },

  // 전신
  { id: 'e53', emoji: '⚡', name: '케틀벨 스윙',          category: '전신', defaultSets: '4', defaultReps: '15',   muscle: '전신/둔근', howTo: '케틀벨을 다리 사이에서 골반 힘으로 어깨 높이까지 스윙합니다. 팔이 아닌 엉덩이 힘으로 밀어냅니다.' },
  { id: 'e54', emoji: '⚡', name: '클린 앤 프레스',       category: '전신', defaultSets: '3', defaultReps: '8',    muscle: '전신', howTo: '바벨을 바닥에서 어깨까지 끌어올린 뒤 머리 위로 밀어 올립니다. 전신 폭발력을 기르는 복합 동작입니다.' },
  { id: 'e55', emoji: '⚡', name: '배틀로프',             category: '전신', defaultSets: '3', defaultReps: '30초', muscle: '전신/어깨', howTo: '양손에 로프를 잡고 번갈아 또는 동시에 위아래로 세게 흔듭니다. 어깨와 코어를 강하게 자극합니다.' },
  { id: 'e56', emoji: '⚡', name: '파워클린',             category: '전신', defaultSets: '4', defaultReps: '5',    muscle: '전신', howTo: '바벨을 바닥에서 순간적으로 끌어올려 어깨 앞에서 받습니다. 폭발적인 하체와 등 힘이 필요한 고난도 동작입니다.' },
  { id: 'e57', emoji: '⚡', name: '터키시 겟업',          category: '전신', defaultSets: '3', defaultReps: '5',    muscle: '전신/코어', howTo: '누운 자세에서 덤벨을 든 팔을 편 채 여러 단계를 거쳐 일어섭니다. 전신 협응력과 코어 안정성을 기릅니다.' },
]

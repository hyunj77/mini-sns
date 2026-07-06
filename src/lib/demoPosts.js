// 데모 유저 프로필 (user_id 기준)
export const DEMO_USER_PROFILES = {
  'demo_fituser01': {
    id: 'demo_fituser01', username: 'fituser01', display_name: '헬스왕',
    bio: '운동이 곧 삶 💪 매일 오운완 도전! 벤치 100kg 목표 중',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fituser01&backgroundColor=00D4FF',
    streak_count: 42,
  },
  'demo_dietlover': {
    id: 'demo_dietlover', username: 'dietlover', display_name: '다이어터',
    bio: '건강한 식단으로 건강한 몸 🥗 -12kg 달성!',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dietlover&backgroundColor=10B981',
    streak_count: 28,
  },
  'demo_squat_king': {
    id: 'demo_squat_king', username: 'squat_king', display_name: '스쿼트킹',
    bio: '스쿼트 120kg 달성! 🏆 하체 운동 전도사',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=squatking&backgroundColor=8B5CF6',
    streak_count: 65,
  },
  'demo_keto_life': {
    id: 'demo_keto_life', username: 'keto_life', display_name: '키토라이프',
    bio: '저탄고지 식단 3개월째 🥑 케토로 건강 되찾기',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ketolife&backgroundColor=F59E0B',
    streak_count: 90,
  },
  'demo_morning_run': {
    id: 'demo_morning_run', username: 'morning_run', display_name: '새벽런너',
    bio: '새벽 5시 런닝 클럽 🌅 하프마라톤 도전 중',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=morningrun&backgroundColor=EF4444',
    streak_count: 120,
  },
  'demo_meal_prep': {
    id: 'demo_meal_prep', username: 'meal_prep', display_name: '도시락왕',
    bio: '매주 밀프렙으로 건강관리 🍱 식단 공유 환영!',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mealprep&backgroundColor=06B6D4',
    streak_count: 33,
  },
}

const base = Date.now()
export const DEMO_POSTS = [
  { id: 'd1', user_id: 'demo_fituser01', caption: '오늘도 오운완 💪 벤치프레스 80kg × 5세트, 스쿼트 100kg × 3세트 완료!\n\n#오운완 #헬스 #Fitsta', image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80', likes_count: 24, category: 'workout', created_at: new Date(base - 3600000).toISOString(), routine_data: [{ name: '벤치프레스', sets: '5', reps: '10', weight: '80' }, { name: '스쿼트', sets: '3', reps: '12', weight: '100' }], profiles: { username: 'fituser01', display_name: '헬스왕', avatar_url: DEMO_USER_PROFILES['demo_fituser01'].avatar_url } },
  { id: 'd2', user_id: 'demo_dietlover', caption: '단백질 샐러드 🥗 닭가슴살 200g + 아보카도 + 방울토마토\n\n#식단 #다이어트 #Fitsta', image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80', likes_count: 18, category: 'diet', created_at: new Date(base - 7200000).toISOString(), routine_data: [], profiles: { username: 'dietlover', display_name: '다이어터', avatar_url: DEMO_USER_PROFILES['demo_dietlover'].avatar_url } },
  { id: 'd3', user_id: 'demo_squat_king', caption: '스쿼트 PR 달성! 🔥 드디어 120kg 성공!\n\n#스쿼트 #PR #오운완', image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80', likes_count: 41, category: 'workout', created_at: new Date(base - 10800000).toISOString(), routine_data: [{ name: '스쿼트', sets: '5', reps: '5', weight: '120' }], profiles: { username: 'squat_king', display_name: '스쿼트킹', avatar_url: DEMO_USER_PROFILES['demo_squat_king'].avatar_url } },
  { id: 'd4', user_id: 'demo_keto_life', caption: '저탄고지 식단 Day 7 🥑 한 주 버텼다!\n\n#키토 #저탄고지 #Fitsta', image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80', likes_count: 32, category: 'diet', created_at: new Date(base - 14400000).toISOString(), routine_data: [], profiles: { username: 'keto_life', display_name: '키토라이프', avatar_url: DEMO_USER_PROFILES['demo_keto_life'].avatar_url } },
  { id: 'd5', user_id: 'demo_morning_run', caption: '새벽 5시 런닝 ⭐ 10km 완주!\n\n#런닝 #새벽운동 #오운완', image_url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80', likes_count: 56, category: 'workout', created_at: new Date(base - 18000000).toISOString(), routine_data: [{ name: '런닝', sets: '1', reps: '10km', weight: '' }], profiles: { username: 'morning_run', display_name: '새벽런너', avatar_url: DEMO_USER_PROFILES['demo_morning_run'].avatar_url } },
  { id: 'd6', user_id: 'demo_meal_prep', caption: '닭가슴살 도시락 💯 일주일치 밀프렙 완료!\n\n#밀프렙 #도시락 #식단관리', image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80', likes_count: 29, category: 'diet', created_at: new Date(base - 21600000).toISOString(), routine_data: [], profiles: { username: 'meal_prep', display_name: '도시락왕', avatar_url: DEMO_USER_PROFILES['demo_meal_prep'].avatar_url } },
]

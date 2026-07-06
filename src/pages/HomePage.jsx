import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Droplets, Dumbbell, ChevronRight, Bell, Check, UtensilsCrossed, Trash2, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'
import RingChart from '../components/RingChart'
import FoodSearchSheet from '../components/FoodSearchSheet'
import { getMeals, addMeal, deleteMeal } from '../lib/storage'

const DEFAULT_WORKOUTS = ['벤치프레스 3×10', '스쿼트 3×12', '데드리프트 2×8', '풀업 3×실패']

const MEAL_TYPES = [
  { key: 'breakfast', label: '아침', emoji: '🌅' },
  { key: 'lunch',     label: '점심', emoji: '☀️' },
  { key: 'dinner',    label: '저녁', emoji: '🌙' },
  { key: 'snack',     label: '간식', emoji: '🍎' },
]

// 칼로리 높은 순으로 색상 등급
function calColor(cal) {
  if (cal >= 800) return 'text-red-500'
  if (cal >= 500) return 'text-orange-500'
  if (cal >= 300) return 'text-yellow-500'
  return 'text-teal-600'
}

export default function HomePage() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  const today = new Date().toISOString().split('T')[0]
  const checklistKey = `fitsta_checklist_${today}`
  const recordKey    = `fitsta_record_${today}`

  // ── 활동 링 데이터 ──
  const [record, setRecord]     = useState(null)
  const [water, setWater]       = useState(0)

  // ── 운동 체크리스트 ──
  const [checklist, setChecklist] = useState(DEFAULT_WORKOUTS.map(() => false))

  // ── 식단 기록 ──
  const [meals, setMeals]               = useState([])
  const [activeMealType, setActiveMealType] = useState('breakfast')
  const [mealExpanded, setMealExpanded] = useState(true)
  const [foodSheetOpen, setFoodSheetOpen] = useState(false)

  // ── 초기 로드 ──
  useEffect(() => {
    try {
      const rec = JSON.parse(localStorage.getItem(recordKey) || 'null')
      if (rec) { setRecord(rec); setWater(rec.water_intake || 0) }

      const cl = JSON.parse(localStorage.getItem(checklistKey) || 'null')
      if (cl) setChecklist(cl)
    } catch {}
    setMeals(getMeals(today))
  }, [today])

  // 일일 기록 upsert (수분, 칼로리, 운동)
  const upsertRecord = (patch) => {
    const merged = {
      calories_consumed: record?.calories_consumed || 0,
      water_intake: water,
      exercise_duration: record?.exercise_duration || 0,
      ...patch,
    }
    setRecord(merged)
    try { localStorage.setItem(recordKey, JSON.stringify(merged)) } catch {}
  }

  // 수분
  const addWater = (ml) => {
    const nw = Math.max(0, water + ml)
    setWater(nw)
    upsertRecord({ water_intake: nw })
  }

  // 식단 추가 (바텀시트 or 직접)
  const handleAddMeal = ({ foodName, calories }) => {
    if (!foodName || !calories || calories <= 0) return
    const meal = { id: `m-${Date.now()}`, mealType: activeMealType, foodName, calories }
    const updated = addMeal(today, meal)
    setMeals(updated)
    const total = updated.reduce((s, m) => s + (m.calories || 0), 0)
    upsertRecord({ calories_consumed: total })
  }

  // 식단 삭제
  const handleDeleteMeal = (mealId) => {
    const updated = deleteMeal(today, mealId)
    setMeals(updated)
    const total = updated.reduce((s, m) => s + (m.calories || 0), 0)
    upsertRecord({ calories_consumed: total })
  }

  // 운동 체크
  const toggleCheck = (i) => {
    setChecklist(prev => {
      const next = [...prev]
      next[i] = !next[i]
      try { localStorage.setItem(checklistKey, JSON.stringify(next)) } catch {}
      return next
    })
  }

  // ── 계산 ──
  const calorieGoal  = profile?.daily_calorie_goal  || 2000
  const exerciseGoal = profile?.daily_exercise_goal || 60
  const waterGoal    = 2000
  const calories     = record?.calories_consumed || 0
  const exerciseMin  = record?.exercise_duration || 0
  const checkedCount = checklist.filter(Boolean).length

  const totalMealCal  = meals.reduce((s, m) => s + (m.calories || 0), 0)
  const calPct        = Math.min(totalMealCal / calorieGoal * 100, 100)
  const filteredMeals = meals.filter(m => m.mealType === activeMealType)
  const mealCountOf   = (key) => meals.filter(m => m.mealType === key).length

  const hour     = new Date().getHours()
  const greeting = hour < 12 ? '좋은 아침이에요 ☀️' : hour < 18 ? '좋은 오후예요 💪' : '좋은 저녁이에요 🌙'
  const name     = profile?.display_name || profile?.username || '운동러'
  const avatarUrl = profile?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00D4FF&color=fff&size=80`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="px-5 pt-12 pb-5 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 font-medium">{greeting}</p>
            <h1 className="text-2xl font-black text-gray-900 mt-0.5">{name}님!</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
              <Bell className="w-5 h-5 text-gray-500" />
            </button>
            <img src={avatarUrl} alt="avatar" className="w-11 h-11 rounded-full border-2 border-[#00D4FF] object-cover" />
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3 bottom-safe">

        {/* ── 활동 링 카드 ── */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400 font-medium">오늘의 활동 링</p>
              <p className="text-sm font-semibold text-white mt-0.5">
                {new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
              </p>
            </div>
            {(profile?.streak_count || 0) > 0 && (
              <div className="flex items-center gap-1.5 bg-orange-500/20 px-3 py-1.5 rounded-full">
                <span>🔥</span>
                <span className="text-orange-400 font-bold text-sm">{profile.streak_count}일 연속</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-5">
            <RingChart
              calorieProgress={calories / calorieGoal}
              exerciseProgress={exerciseMin / exerciseGoal}
              waterProgress={water / waterGoal}
              size={128}
            />
            <div className="flex-1 space-y-3">
              {[
                { emoji: '🔥', label: '칼로리', val: calories,    goal: calorieGoal,  unit: 'kcal', color: '#10B981' },
                { emoji: '💪', label: '운동',   val: exerciseMin, goal: exerciseGoal, unit: '분',   color: '#00D4FF' },
                { emoji: '💧', label: '수분',   val: water,       goal: waterGoal,    unit: 'ml',   color: '#0891B2' },
              ].map(({ emoji, label, val, goal, unit, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{emoji} {label}</span>
                    <span className="text-white font-semibold">
                      {val.toLocaleString()}<span className="text-gray-500 font-normal">/{goal.toLocaleString()}{unit}</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${Math.min(Math.round(val / goal * 100), 100)}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 식단 기록 카드 ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
          {/* 헤더 */}
          <button
            className="w-full flex items-center justify-between px-4 pt-4 pb-3"
            onClick={() => setMealExpanded(v => !v)}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl flex items-center justify-center">
                <UtensilsCrossed className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-800 text-sm">오늘의 식단 기록</span>
              {totalMealCal > 0 && (
                <span className="text-xs font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                  {totalMealCal.toLocaleString()}kcal
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-medium">
                {Math.round(calPct)}% 달성
              </span>
              <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${mealExpanded ? 'rotate-90' : ''}`} />
            </div>
          </button>

          {/* 칼로리 프로그레스 바 */}
          <div className="px-4 pb-3">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  calPct >= 100 ? 'bg-red-400' : 'bg-gradient-to-r from-green-400 to-teal-500'
                }`}
                style={{ width: `${calPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
              <span>{totalMealCal.toLocaleString()}kcal 섭취</span>
              <span>목표 {calorieGoal.toLocaleString()}kcal</span>
            </div>
          </div>

          {mealExpanded && (
            <div className="px-4 pb-4 space-y-3">
              {/* 식사 타입 탭 */}
              <div className="grid grid-cols-4 gap-1.5">
                {MEAL_TYPES.map(({ key, label, emoji }) => {
                  const cnt  = mealCountOf(key)
                  const kcal = meals.filter(m => m.mealType === key).reduce((s, m) => s + m.calories, 0)
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveMealType(key)}
                      className={`relative flex flex-col items-center py-2.5 rounded-2xl text-xs font-bold transition-all press ${
                        activeMealType === key
                          ? 'bg-gradient-to-br from-green-400 to-teal-500 text-white shadow-md shadow-teal-100'
                          : 'bg-gray-50 text-gray-500'
                      }`}
                    >
                      <span className="text-base">{emoji}</span>
                      <span className="mt-0.5">{label}</span>
                      {cnt > 0 && (
                        <span className={`text-[9px] mt-0.5 font-black ${activeMealType === key ? 'text-white/80' : 'text-teal-500'}`}>
                          {kcal}kcal
                        </span>
                      )}
                      {cnt > 0 && activeMealType !== key && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">
                          {cnt}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* 해당 식사 목록 */}
              {filteredMeals.length > 0 && (
                <div className="space-y-1.5">
                  {filteredMeals.map(meal => (
                    <div key={meal.id} className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 rounded-2xl">
                      <span className="text-sm text-gray-700 flex-1 font-medium">{meal.foodName}</span>
                      <span className={`text-sm font-black ${calColor(meal.calories)}`}>{meal.calories}kcal</span>
                      <button onClick={() => handleDeleteMeal(meal.id)}
                        className="w-6 h-6 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-300 hover:text-red-400 press">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {filteredMeals.length === 0 && (
                <p className="text-center text-xs text-gray-400 py-2">
                  {MEAL_TYPES.find(t => t.key === activeMealType)?.emoji} {MEAL_TYPES.find(t => t.key === activeMealType)?.label} 기록이 없어요
                </p>
              )}

              {/* 음식 추가 버튼 → 바텀시트 */}
              <button
                onClick={() => setFoodSheetOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-green-400 to-teal-500 rounded-2xl text-white text-sm font-bold press shadow-md shadow-teal-100"
              >
                <Search className="w-4 h-4" />
                음식 검색 · 추가하기
              </button>

              {/* 오늘의 영양 요약 */}
              {meals.length > 0 && (
                <div className="flex gap-2 pt-1">
                  {MEAL_TYPES.map(({ key, label, emoji }) => {
                    const kcal = meals.filter(m => m.mealType === key).reduce((s, m) => s + m.calories, 0)
                    return kcal > 0 ? (
                      <div key={key} className="flex-1 text-center bg-teal-50 rounded-xl py-1.5">
                        <p className="text-[10px] text-gray-400">{emoji}{label}</p>
                        <p className="text-xs font-black text-teal-700">{kcal}</p>
                      </div>
                    ) : null
                  }).filter(Boolean)}
                </div>
              )}

              {/* 피드 공유 버튼 */}
              <button
                onClick={() => navigate('/create', { state: { category: 'diet' } })}
                className="w-full py-3 border-2 border-dashed border-teal-200 rounded-2xl text-sm font-bold text-teal-500 press flex items-center justify-center gap-2 bg-teal-50/30"
              >
                📸 식단 피드에 공유하기
              </button>
            </div>
          )}
        </div>

        {/* ── 수분 섭취 ── */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                <Droplets className="w-4 h-4 text-blue-400" />
              </div>
              <span className="font-bold text-gray-800 text-sm">수분 섭취</span>
            </div>
            <span className="text-sm text-blue-500 font-bold">{water}ml <span className="text-xs text-gray-400 font-normal">/ {waterGoal}ml</span></span>
          </div>
          <div className="h-2 bg-blue-100 rounded-full mb-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(water / waterGoal * 100, 100)}%` }} />
          </div>
          <div className="flex gap-2">
            {[150, 250, 500].map(ml => (
              <button key={ml} onClick={() => addWater(ml)}
                className="flex-1 py-2.5 bg-blue-50 rounded-2xl text-xs font-bold text-blue-500 press">
                +{ml}ml
              </button>
            ))}
            <button onClick={() => addWater(-250)}
              className="px-3 py-2.5 bg-gray-50 rounded-2xl text-xs font-bold text-gray-400 press">
              ↩
            </button>
          </div>
        </div>

        {/* ── 오늘의 운동 체크리스트 ── */}
        <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-cyan-50 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-[#00D4FF]" />
              </div>
              <span className="font-bold text-gray-800 text-sm">오늘의 운동</span>
              <span className="text-xs text-[#00D4FF] font-bold bg-cyan-50 px-2 py-0.5 rounded-full">
                {checkedCount}/{checklist.length}
              </span>
            </div>
            <button
              onClick={() => navigate('/create', { state: { category: 'workout', checklist, workouts: DEFAULT_WORKOUTS } })}
              className="flex items-center gap-0.5 text-xs text-[#00D4FF] font-semibold"
            >
              기록 추가 <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {DEFAULT_WORKOUTS.map((w, i) => (
              <button key={i} onClick={() => toggleCheck(i)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${
                  checklist[i] ? 'bg-cyan-50 border border-cyan-100' : 'bg-gray-50'
                }`}>
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                  checklist[i] ? 'bg-[#00D4FF] border-[#00D4FF]' : 'border-gray-300'
                }`}>
                  {checklist[i] && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                </div>
                <span className={`text-sm font-medium flex-1 ${checklist[i] ? 'line-through text-gray-400' : 'text-gray-700'}`}>{w}</span>
              </button>
            ))}
          </div>
          {checkedCount === checklist.length && (
            <div className="mt-3 py-2.5 bg-gradient-to-r from-[#00D4FF] to-[#0891B2] rounded-2xl text-center">
              <span className="text-white text-sm font-black">🎉 오운완! 오늘도 멋져요!</span>
            </div>
          )}
        </div>

        {/* ── 퀵 액션 ── */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/workout-info')}
            className="bg-gradient-to-br from-[#00D4FF] to-[#0891B2] rounded-3xl p-4 text-white text-left shadow-md shadow-cyan-100 press"
          >
            <span className="text-2xl block mb-2">💡</span>
            <p className="font-black text-sm">운동 정보</p>
            <p className="text-xs opacity-80 mt-0.5">헬스장 운동 추천받기</p>
          </button>
          <button
            onClick={() => navigate('/diet-album')}
            className="bg-gradient-to-br from-green-400 to-teal-500 rounded-3xl p-4 text-white text-left shadow-md shadow-green-100 press"
          >
            <span className="text-2xl block mb-2">📷</span>
            <p className="font-black text-sm">식단 앨범</p>
            <p className="text-xs opacity-80 mt-0.5">내 식단 사진 모아보기</p>
          </button>
        </div>

        {/* ── 피드 바로가기 ── */}
        <button
          onClick={() => navigate('/feed')}
          className="w-full flex items-center justify-between p-4 bg-white rounded-3xl border border-gray-100 shadow-sm press"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#00D4FF] to-[#0891B2] rounded-2xl flex items-center justify-center">
              <span className="text-lg">📸</span>
            </div>
            <div className="text-left">
              <p className="font-bold text-gray-800 text-sm">오운완 피드</p>
              <p className="text-xs text-gray-500">다른 사람들의 운동을 보며 동기부여</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>

        <div className="h-2" />
      </div>

      <BottomNav />

      {/* 음식 검색 바텀시트 */}
      <FoodSearchSheet
        isOpen={foodSheetOpen}
        onClose={() => setFoodSheetOpen(false)}
        mealTypeLabel={MEAL_TYPES.find(t => t.key === activeMealType)?.label ?? ''}
        onAdd={handleAddMeal}
      />
    </div>
  )
}

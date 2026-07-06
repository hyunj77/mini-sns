import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts'
import { TrendingUp, Flame, Droplets, Dumbbell, Calendar } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import BottomNav from '../components/BottomNav'

// ── 데모 데이터 (실제 기록이 없을 때 표시) ──
const DEMO_WEEKLY = [
  { day: '월', calories: 1850, exercise: 45, water: 1500 },
  { day: '화', calories: 2100, exercise: 60, water: 1800 },
  { day: '수', calories: 1950, exercise: 30, water: 1200 },
  { day: '목', calories: 2200, exercise: 75, water: 2000 },
  { day: '금', calories: 1800, exercise: 50, water: 1600 },
  { day: '토', calories: 2400, exercise: 90, water: 2200 },
  { day: '일', calories: 2050, exercise: 40, water: 1900 },
]
const DEMO_MONTHLY = [
  { day: '1주', calories: 1780, exercise: 38, water: 1450 },
  { day: '2주', calories: 1920, exercise: 51, water: 1680 },
  { day: '3주', calories: 2050, exercise: 62, water: 1820 },
  { day: '4주', calories: 2200, exercise: 71, water: 1980 },
]

// ── localStorage에서 하루 기록 읽기 ──
function readDay(dateStr) {
  try {
    const rec   = JSON.parse(localStorage.getItem(`fitsta_record_${dateStr}`) || 'null')
    const meals = JSON.parse(localStorage.getItem(`fitsta_meals_${dateStr}`) || '[]')
    const mealCal = meals.reduce((s, m) => s + (m.calories || 0), 0)
    const hasData = !!(rec || meals.length)
    return {
      calories: rec?.calories_consumed || mealCal || 0,
      exercise: rec?.exercise_duration || 0,
      water:    rec?.water_intake || 0,
      hasData,
    }
  } catch {
    return { calories: 0, exercise: 0, water: 0, hasData: false }
  }
}

const WEEK_LABELS = ['일', '월', '화', '수', '목', '금', '토']

function buildWeekly() {
  const result = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const rec = readDay(d.toISOString().split('T')[0])
    result.push({ day: WEEK_LABELS[d.getDay()], ...rec })
  }
  return result
}

function buildMonthly() {
  const weeks = []
  for (let w = 3; w >= 0; w--) {
    let sumCal = 0, sumEx = 0, sumWater = 0, activeDays = 0
    for (let d = 0; d < 7; d++) {
      const date = new Date()
      date.setDate(date.getDate() - w * 7 - d)
      const rec = readDay(date.toISOString().split('T')[0])
      if (rec.hasData) {
        sumCal   += rec.calories
        sumEx    += rec.exercise
        sumWater += rec.water
        activeDays++
      }
    }
    weeks.unshift({
      day: `${4 - w}주`,
      calories: activeDays ? Math.round(sumCal   / activeDays) : 0,
      exercise: activeDays ? Math.round(sumEx    / activeDays) : 0,
      water:    activeDays ? Math.round(sumWater / activeDays) : 0,
      hasData: activeDays > 0,
    })
  }
  return weeks
}

// 지난 N일 중 운동한 날 수
function countExerciseDays(n) {
  let count = 0
  for (let i = 0; i < n; i++) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const rec = readDay(d.toISOString().split('T')[0])
    if (rec.exercise > 0) count++
  }
  return count
}

export default function ReportPage() {
  const { profile } = useAuth()
  const [period, setPeriod] = useState('week')

  const calorieGoal  = profile?.daily_calorie_goal  || 2000
  const exerciseGoal = profile?.daily_exercise_goal || 60

  // 실제 데이터 빌드
  const realWeekly  = useMemo(buildWeekly,  [])
  const realMonthly = useMemo(buildMonthly, [])

  const hasWeeklyData  = realWeekly.some(r => r.hasData)
  const hasMonthlyData = realMonthly.some(r => r.hasData)

  const records   = period === 'week'
    ? (hasWeeklyData  ? realWeekly  : DEMO_WEEKLY)
    : (hasMonthlyData ? realMonthly : DEMO_MONTHLY)

  const isDemo = period === 'week' ? !hasWeeklyData : !hasMonthlyData

  // 요약 통계
  const nonZero     = records.filter(r => r.calories > 0 || r.exercise > 0)
  const baseLen     = nonZero.length || records.length
  const avgCalories = Math.round(records.reduce((s, r) => s + r.calories, 0) / baseLen)
  const avgExercise = Math.round(records.reduce((s, r) => s + r.exercise, 0) / baseLen)
  const avgWater    = Math.round(records.reduce((s, r) => s + r.water,    0) / baseLen)

  const totalDays    = period === 'week' ? 7 : 30
  const exerciseDays = isDemo
    ? records.filter(r => r.exercise > 0).length
    : countExerciseDays(totalDays)

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    const suffix = period === 'week' ? '요일' : '차'
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl">
        <p className="font-bold mb-1">{label}{suffix}</p>
        {payload.map(p => (
          <p key={p.name} style={{ color: p.color }}>
            {p.name}: {p.value.toLocaleString()}
            {p.name === '칼로리' ? 'kcal' : p.name === '운동' ? '분' : 'ml'}
          </p>
        ))}
      </div>
    )
  }

  // 이번 주/달 날짜 범위 표시
  const dateRange = (() => {
    const end   = new Date()
    const start = new Date()
    start.setDate(end.getDate() - (period === 'week' ? 6 : 29))
    return `${start.getMonth() + 1}/${start.getDate()} – ${end.getMonth() + 1}/${end.getDate()}`
  })()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="px-5 pt-12 pb-4 bg-white">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-xl font-black text-gray-900">
            {period === 'week' ? '주간' : '월간'} 리포트
          </h1>
          <TrendingUp className="w-6 h-6 text-[#00D4FF]" />
        </div>
        <div className="flex items-center gap-1.5 mb-4">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs text-gray-400">{dateRange}</span>
          {isDemo && (
            <span className="text-[10px] bg-amber-100 text-amber-600 font-bold px-2 py-0.5 rounded-full ml-1">
              샘플 데이터
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {[['week', '주간'], ['month', '월간']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setPeriod(key)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all press ${
                period === key
                  ? 'bg-gradient-to-r from-[#00D4FF] to-[#0891B2] text-white shadow-md shadow-cyan-200'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 bottom-safe space-y-3">

        {/* 요약 카드 4개 */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Flame,    label: '평균 칼로리', value: avgCalories.toLocaleString(), unit: 'kcal/일', color: '#10B981', bg: 'from-green-50 to-teal-50',   pct: Math.round(avgCalories / calorieGoal * 100) },
            { icon: Dumbbell, label: '평균 운동',   value: `${avgExercise}`,             unit: '분/일',   color: '#00D4FF', bg: 'from-cyan-50 to-blue-50',    pct: Math.round(avgExercise / exerciseGoal * 100) },
            { icon: Droplets, label: '평균 수분',   value: avgWater.toLocaleString(),    unit: 'ml/일',   color: '#0891B2', bg: 'from-blue-50 to-indigo-50', pct: Math.round(avgWater / 2000 * 100) },
            { icon: Flame,    label: period === 'week' ? '운동한 날' : '운동한 날',
              value: `${exerciseDays}`, unit: `일 / ${totalDays}일`, color: '#f97316', bg: 'from-orange-50 to-red-50',
              pct: Math.round(exerciseDays / totalDays * 100) },
          ].map(({ icon: Icon, label, value, unit, color, bg, pct }) => (
            <div key={label} className={`bg-gradient-to-br ${bg} rounded-2xl p-3.5 border border-white`}>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <p className="font-black text-gray-900 text-xl leading-none">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{unit}</p>
              <div className="mt-2 h-1.5 bg-white/80 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
              </div>
              <p className="text-[10px] font-bold mt-1" style={{ color }}>{pct}%</p>
            </div>
          ))}
        </div>

        {/* 칼로리 차트 */}
        <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-gray-800 text-sm">🔥 칼로리 섭취</p>
            <span className="text-xs text-gray-400">목표 {calorieGoal.toLocaleString()}kcal</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={records} barCategoryGap="35%">
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, Math.max(...records.map(r => r.calories), calorieGoal) + 200]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="calories" name="칼로리"
                fill="#10B981" radius={[6, 6, 0, 0]}
                // 목표 초과 시 빨간색 처리는 Cell로
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-1 text-xs">
            <span className="text-gray-400">평균 {avgCalories.toLocaleString()}kcal</span>
            <span className={avgCalories >= calorieGoal * 0.9 ? 'text-green-500 font-bold' : 'text-gray-400'}>
              {avgCalories >= calorieGoal * 0.9 ? '✓ 목표 달성!' : `${(calorieGoal - avgCalories).toLocaleString()}kcal 부족`}
            </span>
          </div>
        </div>

        {/* 운동 시간 차트 */}
        <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-gray-800 text-sm">💪 운동 시간</p>
            <span className="text-xs text-gray-400">목표 {exerciseGoal}분/일</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={records}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, Math.max(...records.map(r => r.exercise), exerciseGoal) + 10]} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="exercise" name="운동"
                stroke="#00D4FF" strokeWidth={2.5}
                dot={{ fill: '#00D4FF', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-1 text-xs">
            <span className="text-gray-400">평균 {avgExercise}분</span>
            <span className={avgExercise >= exerciseGoal * 0.9 ? 'text-cyan-500 font-bold' : 'text-gray-400'}>
              {avgExercise >= exerciseGoal * 0.9 ? '✓ 목표 달성!' : `${exerciseGoal - avgExercise}분 부족`}
            </span>
          </div>
        </div>

        {/* 수분 섭취 차트 */}
        <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="font-bold text-gray-800 text-sm">💧 수분 섭취량</p>
            <span className="text-xs text-gray-400">목표 2,000ml</span>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={records} barCategoryGap="35%">
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 2500]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="water" name="수분" fill="#0891B2" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-between mt-1 text-xs">
            <span className="text-gray-400">평균 {avgWater.toLocaleString()}ml</span>
            <span className={avgWater >= 1800 ? 'text-blue-500 font-bold' : 'text-gray-400'}>
              {avgWater >= 1800 ? '✓ 충분!' : `${2000 - avgWater}ml 부족`}
            </span>
          </div>
        </div>

        {/* 기간별 비교 인사이트 */}
        {period === 'month' && (
          <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
            <p className="font-bold text-gray-800 text-sm mb-3">📈 월간 트렌드</p>
            <div className="space-y-2">
              {(() => {
                const first = records[0], last = records[records.length - 1]
                if (!first || !last) return null
                const calTrend = last.calories - first.calories
                const exTrend  = last.exercise - first.exercise
                return [
                  { label: '칼로리', diff: calTrend, unit: 'kcal', up: calTrend > 0 },
                  { label: '운동시간', diff: exTrend,  unit: '분',  up: exTrend > 0 },
                ].map(({ label, diff, unit, up }) => (
                  <div key={label} className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-xl">
                    <span className="text-sm text-gray-600">{label} 변화</span>
                    <span className={`text-sm font-bold ${up ? 'text-green-500' : diff < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                      {diff > 0 ? '+' : ''}{diff}{unit} {diff > 0 ? '↑' : diff < 0 ? '↓' : '→'}
                    </span>
                  </div>
                ))
              })()}
            </div>
          </div>
        )}

        {/* 성취 메시지 */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-5 text-white text-center">
          <p className="text-3xl mb-2">
            {exerciseDays >= (totalDays * 0.7) ? '🏆' : exerciseDays >= (totalDays * 0.4) ? '⭐' : '💪'}
          </p>
          <p className="font-black text-lg">
            {exerciseDays >= (totalDays * 0.7) ? `${period === 'week' ? '이번 주' : '이번 달'} 최고예요!`
              : exerciseDays >= (totalDays * 0.4) ? '잘 하고 있어요!'
              : '조금만 더 힘내요!'}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {totalDays}일 중 {exerciseDays}일 운동 · 평균 {avgExercise}분
          </p>
          {isDemo && (
            <p className="text-gray-500 text-xs mt-2">
              홈에서 운동·식단을 기록하면 실제 데이터가 표시돼요!
            </p>
          )}
        </div>

        <div className="h-2" />
      </div>

      <BottomNav />
    </div>
  )
}

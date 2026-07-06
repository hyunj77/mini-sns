import { useState, useMemo, useRef, useEffect } from 'react'
import { X, Search, Plus, Check } from 'lucide-react'
import { FOOD_DB, FOOD_CATEGORIES } from '../lib/foodDatabase'
import { fetchCustomFoods, addCustomFood } from '../lib/foods'
import { useAuth } from '../context/AuthContext'

const CATEGORIES = [...FOOD_CATEGORIES, '추가됨']

function calBadgeColor(cal) {
  if (cal >= 500) return 'bg-red-100 text-red-600'
  if (cal >= 300) return 'bg-orange-100 text-orange-600'
  if (cal >= 150) return 'bg-yellow-100 text-yellow-700'
  return 'bg-green-100 text-green-600'
}

export default function FoodSearchSheet({ isOpen, onClose, onAdd, mealTypeLabel = '음식' }) {
  const { user } = useAuth()
  const [query, setQuery]             = useState('')
  const [category, setCategory]       = useState('전체')
  const [recentAdded, setRecentAdded] = useState([]) // 방금 추가한 항목 id 세트
  const [manualOpen, setManualOpen]   = useState(false)
  const [manualName, setManualName]   = useState('')
  const [manualCal, setManualCal]     = useState('')
  const [customFoods, setCustomFoods] = useState([])
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setQuery(''); setCategory('전체'); setRecentAdded([]); setManualOpen(false)
      fetchCustomFoods().then(setCustomFoods)
      setTimeout(() => inputRef.current?.focus(), 350)
    }
  }, [isOpen])

  const allFoods = useMemo(() => [...FOOD_DB, ...customFoods], [customFoods])

  const filtered = useMemo(() => {
    return allFoods.filter(f => {
      const okCat = category === '전체' || f.category === category
      const okQ   = !query.trim() || f.name.includes(query.trim())
      return okCat && okQ
    })
  }, [allFoods, query, category])

  const handleAdd = (food) => {
    onAdd({ foodName: food.name, calories: food.calories })
    setRecentAdded(prev => [...prev, food.id])
    setTimeout(() => setRecentAdded(prev => prev.filter(id => id !== food.id)), 1500)
  }

  const handleManualAdd = async () => {
    const name = manualName.trim()
    const cal  = parseInt(manualCal)
    if (!name || !cal || cal <= 0) return
    onAdd({ foodName: name, calories: cal })
    if (user) {
      await addCustomFood({ name, calories: cal, createdBy: user.id })
      fetchCustomFoods().then(setCustomFoods)
    }
    setManualName(''); setManualCal('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* 딤 오버레이 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* 바텀 시트 */}
      <div
        className="relative bg-white rounded-t-3xl shadow-2xl flex flex-col"
        style={{ maxHeight: '88vh', minHeight: '60vh' }}
      >
        {/* 핸들 바 */}
        <div className="flex justify-center pt-3 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* 헤더 */}
        <div className="px-5 pt-3 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-black text-gray-900 text-base">{mealTypeLabel} 음식 추가</h3>
              <p className="text-xs text-gray-400 mt-0.5">탭하면 바로 추가돼요!</p>
            </div>
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center press">
              <X className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* 검색창 */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="음식 이름으로 검색..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
            {query && (
              <button onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-300 rounded-full flex items-center justify-center">
                <X className="w-3 h-3 text-white" />
              </button>
            )}
          </div>
        </div>

        {/* 카테고리 탭 */}
        <div
          className="px-5 pb-3 flex gap-2 flex-shrink-0 overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all press ${
                category === cat
                  ? 'bg-teal-500 text-white shadow-md shadow-teal-200'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 음식 목록 */}
        <div className="flex-1 overflow-y-auto px-4">
          {filtered.length === 0 && (
            <div className="text-center py-10">
              <p className="text-3xl mb-2">🔍</p>
              <p className="text-gray-400 text-sm">"{query}" 검색 결과가 없어요</p>
              <button onClick={() => setManualOpen(true)}
                className="mt-3 text-teal-500 text-xs font-bold underline">
                직접 입력하기
              </button>
            </div>
          )}

          <div className="space-y-1 pb-2">
            {filtered.map(food => {
              const added = recentAdded.includes(food.id)
              return (
                <button
                  key={food.id}
                  onClick={() => handleAdd(food)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all press ${
                    added ? 'bg-teal-50 border border-teal-200' : 'bg-gray-50 active:bg-teal-50'
                  }`}
                >
                  <span className="text-2xl w-9 text-center flex-shrink-0">{food.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{food.name}</p>
                    <p className="text-xs text-gray-400">{food.serving}</p>
                  </div>
                  <span className={`text-xs font-black px-2 py-1 rounded-full flex-shrink-0 ${calBadgeColor(food.calories)}`}>
                    {food.calories}kcal
                  </span>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    added ? 'bg-teal-500' : 'bg-teal-100'
                  }`}>
                    {added
                      ? <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      : <Plus className="w-4 h-4 text-teal-600" />
                    }
                  </div>
                </button>
              )
            })}
          </div>

          {/* 직접 입력 토글 */}
          <div className="border-t border-gray-100 pt-3 pb-5 mt-2">
            <button
              onClick={() => setManualOpen(v => !v)}
              className="flex items-center gap-2 text-xs text-gray-500 font-bold mb-3 press"
            >
              <span className={`transition-transform ${manualOpen ? 'rotate-90' : ''}`}>▶</span>
              목록에 없는 음식 직접 입력
            </button>
            {manualOpen && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleManualAdd()}
                  placeholder="음식 이름"
                  className="flex-[2] px-3 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <input
                  type="number"
                  value={manualCal}
                  onChange={e => setManualCal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleManualAdd()}
                  placeholder="kcal"
                  className="w-20 px-2 py-2.5 bg-gray-50 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
                <button
                  onClick={handleManualAdd}
                  disabled={!manualName.trim() || !manualCal}
                  className="px-4 py-2.5 bg-teal-500 text-white rounded-xl text-sm font-bold press disabled:opacity-40"
                >
                  추가
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

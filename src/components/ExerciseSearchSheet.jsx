import { useState, useMemo, useRef, useEffect } from 'react'
import { X, Search, Plus, Check } from 'lucide-react'
import { EXERCISE_DB, EXERCISE_CATEGORIES, EXERCISE_CATEGORY_EMOJI } from '../lib/exerciseDatabase'

const CATEGORY_BG = {
  '가슴': 'bg-red-50 text-red-600', '등': 'bg-blue-50 text-blue-600',
  '하체': 'bg-purple-50 text-purple-600', '어깨': 'bg-yellow-50 text-yellow-700',
  '팔': 'bg-orange-50 text-orange-600', '복근': 'bg-pink-50 text-pink-600',
  '유산소': 'bg-green-50 text-green-600', '전신': 'bg-cyan-50 text-cyan-700',
}

export default function ExerciseSearchSheet({ isOpen, onClose, onAdd }) {
  const [query, setQuery]           = useState('')
  const [category, setCategory]     = useState('전체')
  const [addedIds, setAddedIds]     = useState(new Set())
  const inputRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setQuery(''); setCategory('전체'); setAddedIds(new Set())
      setTimeout(() => inputRef.current?.focus(), 350)
    }
  }, [isOpen])

  const filtered = useMemo(() => {
    return EXERCISE_DB.filter(e => {
      const okCat = category === '전체' || e.category === category
      const okQ   = !query.trim() || e.name.includes(query.trim()) || e.muscle.includes(query.trim())
      return okCat && okQ
    })
  }, [query, category])

  const handleAdd = (ex) => {
    onAdd({ name: ex.name, sets: ex.defaultSets, reps: ex.defaultReps, weight: '' })
    setAddedIds(prev => new Set([...prev, ex.id]))
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
        {/* 핸들 */}
        <div className="flex justify-center pt-3 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* 헤더 */}
        <div className="px-5 pt-3 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-black text-gray-900 text-base">운동 검색</h3>
              <p className="text-xs text-gray-400 mt-0.5">탭하면 루틴에 자동 추가돼요!</p>
            </div>
            <div className="flex items-center gap-2">
              {addedIds.size > 0 && (
                <button
                  onClick={onClose}
                  className="px-3 py-1.5 bg-[#00D4FF] text-white text-xs font-bold rounded-full press"
                >
                  완료 ({addedIds.size})
                </button>
              )}
              <button onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center press">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* 검색창 */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="운동 이름, 근육 검색..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
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
          {EXERCISE_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all press ${
                category === cat
                  ? 'bg-[#00D4FF] text-white shadow-md shadow-cyan-200'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {EXERCISE_CATEGORY_EMOJI[cat]} {cat}
            </button>
          ))}
        </div>

        {/* 운동 목록 */}
        <div className="flex-1 overflow-y-auto px-4 pb-6">
          {filtered.length === 0 && (
            <div className="text-center py-10">
              <p className="text-3xl mb-2">🏋️</p>
              <p className="text-gray-400 text-sm">검색 결과가 없어요</p>
            </div>
          )}

          <div className="space-y-1.5">
            {filtered.map(ex => {
              const added = addedIds.has(ex.id)
              const catStyle = CATEGORY_BG[ex.category] || 'bg-gray-100 text-gray-600'
              return (
                <button
                  key={ex.id}
                  onClick={() => handleAdd(ex)}
                  disabled={added}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl text-left transition-all press ${
                    added ? 'bg-cyan-50 border border-cyan-200' : 'bg-gray-50 active:bg-cyan-50'
                  }`}
                >
                  <span className="text-xl w-8 text-center flex-shrink-0">{ex.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">{ex.name}</p>
                    <p className="text-xs text-gray-400 truncate">{ex.muscle}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catStyle}`}>
                      {ex.category}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{ex.defaultSets}세트 × {ex.defaultReps}</p>
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    added ? 'bg-[#00D4FF]' : 'bg-cyan-100'
                  }`}>
                    {added
                      ? <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                      : <Plus className="w-4 h-4 text-cyan-600" />
                    }
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

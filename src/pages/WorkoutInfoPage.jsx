import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Shuffle, Youtube, ChevronDown } from 'lucide-react'
import { EXERCISE_DB, EXERCISE_CATEGORIES, EXERCISE_CATEGORY_EMOJI } from '../lib/exerciseDatabase'

const CATEGORY_BG = {
  '가슴': 'bg-red-50 text-red-600', '등': 'bg-blue-50 text-blue-600',
  '하체': 'bg-purple-50 text-purple-600', '어깨': 'bg-yellow-50 text-yellow-700',
  '팔': 'bg-orange-50 text-orange-600', '복근': 'bg-pink-50 text-pink-600',
  '유산소': 'bg-green-50 text-green-600', '전신': 'bg-cyan-50 text-cyan-700',
}

function pickRandom(list, n) {
  const copy = [...list]
  const picked = []
  while (copy.length && picked.length < n) {
    picked.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0])
  }
  return picked
}

function youtubeSearchUrl(name) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(`${name} 운동 방법`)}`
}

function ExerciseDetail({ ex }) {
  return (
    <div className="px-3 pb-3 -mt-1 space-y-2.5">
      <p className="text-xs text-gray-500 leading-relaxed">{ex.howTo}</p>
      <a
        href={youtubeSearchUrl(ex.name)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={e => e.stopPropagation()}
        className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-bold press"
      >
        <Youtube className="w-3.5 h-3.5" /> 유튜브에서 {ex.name} 검색해보기
      </a>
    </div>
  )
}

export default function WorkoutInfoPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState('전체')
  const [recommended, setRecommended] = useState(() => pickRandom(EXERCISE_DB, 3))
  const [expandedId, setExpandedId] = useState(null)

  const reshuffle = () => {
    const pool = category === '전체' ? EXERCISE_DB : EXERCISE_DB.filter(e => e.category === category)
    setRecommended(pickRandom(pool.length >= 3 ? pool : EXERCISE_DB, 3))
  }

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id)

  const filtered = useMemo(() => {
    return category === '전체' ? EXERCISE_DB : EXERCISE_DB.filter(e => e.category === category)
  }, [category])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 press">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 font-black text-gray-900 text-base">운동 정보</h1>
      </div>

      <div className="px-4 py-4 space-y-5 pb-10">
        {/* 오늘의 추천 운동 */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-base">🔥 오늘의 추천 운동</p>
            <button
              onClick={reshuffle}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full text-xs font-bold press"
            >
              <Shuffle className="w-3.5 h-3.5" /> 다시 추천
            </button>
          </div>
          <div className="space-y-2">
            {recommended.map(ex => (
              <div key={ex.id} className="bg-white/10 rounded-2xl overflow-hidden">
                <button onClick={() => toggleExpand(ex.id)} className="w-full flex items-center gap-3 px-3 py-2.5 press">
                  <span className="text-xl w-8 text-center flex-shrink-0">{ex.emoji}</span>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-bold">{ex.name}</p>
                    <p className="text-xs text-gray-400 truncate">{ex.muscle}</p>
                  </div>
                  <span className="text-xs font-bold text-gray-300 flex-shrink-0">{ex.defaultSets}세트 × {ex.defaultReps}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${expandedId === ex.id ? 'rotate-180' : ''}`} />
                </button>
                {expandedId === ex.id && (
                  <div className="px-3 pb-3 -mt-1 space-y-2.5">
                    <p className="text-xs text-gray-300 leading-relaxed">{ex.howTo}</p>
                    <a
                      href={youtubeSearchUrl(ex.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-500/20 text-red-300 text-xs font-bold press"
                    >
                      <Youtube className="w-3.5 h-3.5" /> 유튜브에서 {ex.name} 검색해보기
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 부위 탭 */}
        <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {EXERCISE_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all press ${
                category === cat ? 'bg-[#00D4FF] text-white shadow-md shadow-cyan-200' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {EXERCISE_CATEGORY_EMOJI[cat]} {cat}
            </button>
          ))}
        </div>

        {/* 운동 리스트 */}
        <div className="space-y-1.5">
          {filtered.map(ex => {
            const catStyle = CATEGORY_BG[ex.category] || 'bg-gray-100 text-gray-600'
            return (
              <div key={ex.id} className="rounded-2xl bg-white border border-gray-100 overflow-hidden">
                <button onClick={() => toggleExpand(ex.id)} className="w-full flex items-center gap-3 px-3 py-3 press">
                  <span className="text-xl w-8 text-center flex-shrink-0">{ex.emoji}</span>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-bold text-gray-800">{ex.name}</p>
                    <p className="text-xs text-gray-400 truncate">{ex.muscle}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${catStyle}`}>{ex.category}</span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{ex.defaultSets}세트 × {ex.defaultReps}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${expandedId === ex.id ? 'rotate-180' : ''}`} />
                </button>
                {expandedId === ex.id && <ExerciseDetail ex={ex} />}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

import { useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, LayoutGrid, Plus, X, Trash2, ImagePlus } from 'lucide-react'
import { getDietPhotos, addDietPhoto, deleteDietPhoto } from '../lib/dietAlbum'

const MEAL_TABS = [
  { key: 'all',       label: '전체', emoji: '📷' },
  { key: 'breakfast', label: '아침', emoji: '🌅' },
  { key: 'lunch',     label: '점심', emoji: '☀️' },
  { key: 'dinner',    label: '저녁', emoji: '🌙' },
  { key: 'snack',     label: '간식', emoji: '🍎' },
]
const MEAL_LABEL = { breakfast: '🌅 아침', lunch: '☀️ 점심', dinner: '🌙 저녁', snack: '🍎 간식' }
const WEEK = ['일', '월', '화', '수', '목', '금', '토']

function monthLabel(ym) {
  const [y, m] = ym.split('-')
  return `${y}년 ${parseInt(m)}월`
}
function dateLabel(d) {
  const dt = new Date(d)
  return `${dt.getMonth() + 1}월 ${dt.getDate()}일 (${WEEK[dt.getDay()]})`
}
function resizeImage(file, maxSize = 1000, quality = 0.8) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        let w = img.width, h = img.height
        if (w > h && w > maxSize) { h = Math.round(h * maxSize / w); w = maxSize }
        else if (h > maxSize) { w = Math.round(w * maxSize / h); h = maxSize }
        const canvas = document.createElement('canvas')
        canvas.width = w; canvas.height = h
        canvas.getContext('2d').drawImage(img, 0, 0, w, h)
        resolve(canvas.toDataURL('image/jpeg', quality))
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  })
}

export default function DietAlbumPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [photos, setPhotos]       = useState(getDietPhotos)
  const [mealFilter, setMealFilter] = useState('all')
  const [viewMode, setViewMode]   = useState('month') // 'month' | 'date'
  const [uploadOpen, setUploadOpen] = useState(false)
  const [uploadDate, setUploadDate] = useState(() => new Date().toISOString().split('T')[0])
  const [uploadMealType, setUploadMealType] = useState('breakfast')
  const [uploadPreview, setUploadPreview] = useState(null)
  const [saving, setSaving] = useState(false)
  const [lightbox, setLightbox] = useState(null)

  const filtered = useMemo(
    () => photos.filter(p => mealFilter === 'all' || p.mealType === mealFilter),
    [photos, mealFilter]
  )

  const groups = useMemo(() => {
    const key = (p) => viewMode === 'month' ? p.date.slice(0, 7) : p.date
    const map = new Map()
    for (const p of filtered) {
      const k = key(p)
      if (!map.has(k)) map.set(k, [])
      map.get(k).push(p)
    }
    return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered, viewMode])

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    const resized = await resizeImage(file)
    setUploadPreview(resized)
  }

  const handleSave = () => {
    if (!uploadPreview) return
    setSaving(true)
    const updated = addDietPhoto({ date: uploadDate, mealType: uploadMealType, imageUrl: uploadPreview })
    setPhotos(updated)
    setSaving(false)
    setUploadOpen(false)
    setUploadPreview(null)
  }

  const handleDelete = (id) => {
    setPhotos(deleteDietPhoto(id))
    setLightbox(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 press">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 font-black text-gray-900 text-base">식단 앨범</h1>
        <button
          onClick={() => setViewMode(v => v === 'month' ? 'date' : 'month')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gray-50 border border-gray-100 press"
        >
          {viewMode === 'month' ? <Calendar className="w-3.5 h-3.5" /> : <LayoutGrid className="w-3.5 h-3.5" />}
          {viewMode === 'month' ? '날짜별 보기' : '월별 보기'}
        </button>
      </div>

      {/* 식사 탭 */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {MEAL_TABS.map(({ key, label, emoji }) => (
          <button
            key={key}
            onClick={() => setMealFilter(key)}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all press ${
              mealFilter === key ? 'bg-gradient-to-r from-green-400 to-teal-500 text-white shadow-md shadow-teal-100' : 'bg-gray-100 text-gray-600'
            }`}
          >
            {emoji} {label}
          </button>
        ))}
      </div>

      {/* 앨범 */}
      <div className="px-4 py-4 space-y-6">
        {groups.length === 0 && (
          <div className="flex flex-col items-center py-20 gap-3">
            <span className="text-5xl">📷</span>
            <p className="text-gray-500 text-sm font-medium">아직 등록한 식단 사진이 없어요</p>
          </div>
        )}
        {groups.map(([key, items]) => (
          <div key={key}>
            <p className="text-sm font-black text-gray-800 mb-2">
              {viewMode === 'month' ? monthLabel(key) : dateLabel(key)}
              <span className="text-xs text-gray-400 font-medium ml-1.5">{items.length}장</span>
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {items.map(p => (
                <button
                  key={p.id}
                  onClick={() => setLightbox(p)}
                  className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 press"
                >
                  <img src={p.imageUrl} alt="" className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 left-1 text-[9px] font-black text-white bg-black/50 px-1.5 py-0.5 rounded-full">
                    {MEAL_LABEL[p.mealType]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 사진 등록 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 px-4 pb-6 pt-3 bg-gradient-to-t from-gray-50 via-gray-50 to-transparent">
        <button
          onClick={() => { setUploadOpen(true); setUploadDate(new Date().toISOString().split('T')[0]); setUploadMealType('breakfast'); setUploadPreview(null) }}
          className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-green-400 to-teal-500 rounded-2xl text-white text-sm font-black press shadow-lg shadow-teal-200"
        >
          <Plus className="w-4.5 h-4.5" /> 사진 등록
        </button>
      </div>

      {/* 업로드 모달 */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setUploadOpen(false)} />
          <div className="relative bg-white rounded-t-3xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-gray-900 text-base">식단 사진 등록</h3>
              <button onClick={() => setUploadOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center press">
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`w-full rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 press overflow-hidden ${
                uploadPreview ? 'border-teal-300' : 'border-gray-200 bg-gray-50 py-8'
              }`}
            >
              {uploadPreview ? (
                <img src={uploadPreview} alt="preview" className="w-full aspect-square object-cover" />
              ) : (
                <>
                  <ImagePlus className="w-7 h-7 text-gray-400" />
                  <span className="text-sm font-bold text-gray-500">사진 선택하기</span>
                </>
              )}
            </button>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 mb-1 block">날짜</label>
                <input
                  type="date"
                  value={uploadDate}
                  onChange={e => setUploadDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs font-bold text-gray-500 mb-1 block">식사</label>
                <select
                  value={uploadMealType}
                  onChange={e => setUploadMealType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                >
                  {MEAL_TABS.filter(t => t.key !== 'all').map(t => (
                    <option key={t.key} value={t.key}>{t.emoji} {t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={!uploadPreview || saving}
              className="w-full py-3.5 bg-gradient-to-r from-green-400 to-teal-500 text-white font-black rounded-2xl press disabled:opacity-40"
            >
              {saving ? '저장 중...' : '앨범에 저장'}
            </button>
          </div>
        </div>
      )}

      {/* 라이트박스 */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          <div className="flex items-center justify-between px-4 pt-12 pb-3">
            <span className="text-white text-sm font-bold">
              {dateLabel(lightbox.date)} · {MEAL_LABEL[lightbox.mealType]}
            </span>
            <div className="flex items-center gap-2">
              <button onClick={() => handleDelete(lightbox.id)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center press">
                <Trash2 className="w-4.5 h-4.5 text-white" />
              </button>
              <button onClick={() => setLightbox(null)} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center press">
                <X className="w-4.5 h-4.5 text-white" />
              </button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center px-4 pb-8">
            <img src={lightbox.imageUrl} alt="" className="max-w-full max-h-full rounded-2xl object-contain" />
          </div>
        </div>
      )}
    </div>
  )
}

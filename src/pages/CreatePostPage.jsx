import { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Sparkles, Plus, Trash2, Image, Search } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { createPost } from '../lib/posts'
import ExerciseSearchSheet from '../components/ExerciseSearchSheet'

const STEP_LABELS = ['내용 입력', '사진 선택', '스티커 합성', '게시']

const SAMPLE_IMAGES = {
  workout: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80',
    'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&q=80',
  ],
  diet: [
    'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=80',
    'https://images.unsplash.com/photo-1559181567-c3190e01f57d?w=600&q=80',
  ],
}

// '벤치프레스 3×10' 형식 파싱
function parseWorkout(str) {
  const match = str.match(/^(.+)\s+(\d+)×(.+)$/)
  if (match) return { name: match[1], sets: match[2], reps: match[3], weight: '' }
  return { name: str, sets: '', reps: '', weight: '' }
}

export default function CreatePostPage() {
  const { user, profile: ctxProfile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const fileInputRef = useRef(null)

  const state = location.state || {}
  const initialCategory = state.category || 'workout'

  // 홈에서 체크된 운동들을 루틴으로 변환
  const initialRoutines = (() => {
    if (initialCategory === 'workout' && state.checklist && state.workouts) {
      const checked = state.workouts
        .filter((_, i) => state.checklist[i])
        .map(parseWorkout)
      return checked.length > 0 ? checked : [{ name: '', sets: '', reps: '', weight: '' }]
    }
    return [{ name: '', sets: '', reps: '', weight: '' }]
  })()

  const [step, setStep] = useState(0)
  const [category, setCategory] = useState(initialCategory)
  const [caption, setCaption] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploadedImage, setUploadedImage] = useState(null)
  const [stickerApplied, setStickerApplied] = useState(false)
  const [routines, setRoutines] = useState(initialRoutines)
  const [posting, setPosting] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [exerciseSheetOpen, setExerciseSheetOpen] = useState(false)

  const profile = ctxProfile
  const exerciseGoal = profile?.daily_exercise_goal || 60

  const addRoutine = () => setRoutines(prev => [...prev, { name: '', sets: '', reps: '', weight: '' }])
  const removeRoutine = (i) => setRoutines(prev => prev.filter((_, idx) => idx !== i))
  const updateRoutine = (i, field, val) => setRoutines(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r))

  const handleExerciseAdd = (ex) => {
    setRoutines(prev => {
      // 마지막 항목이 비어있으면 대체, 아니면 추가
      const last = prev[prev.length - 1]
      if (last && !last.name.trim()) return [...prev.slice(0, -1), ex]
      return [...prev, ex]
    })
  }

  // 파일 선택 처리
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('5MB 이하 이미지만 업로드 가능합니다.')
      return
    }
    setUploadError('')
    const reader = new FileReader()
    reader.onload = (ev) => {
      setUploadedImage(ev.target.result)
      setImageUrl('')
      setStickerApplied(false)
    }
    reader.readAsDataURL(file)
  }

  const handlePost = async () => {
    setPosting(true)
    const validRoutines = routines.filter(r => r.name.trim())
    const finalImage = uploadedImage || imageUrl || SAMPLE_IMAGES[category][0]

    const { error } = await createPost({
      userId: user.id,
      caption: caption.trim(),
      image_url: finalImage,
      category,
      routine_data: validRoutines,
    })

    if (error) {
      setUploadError('게시물 등록에 실패했습니다. 다시 시도해주세요.')
      setPosting(false)
      return
    }

    navigate('/feed', { state: { tab: category } })
  }

  const nextStep = () => setStep(s => Math.min(s + 1, 3))
  const prevStep = () => setStep(s => Math.max(s - 1, 0))

  const previewImage = uploadedImage || imageUrl || SAMPLE_IMAGES[category][0]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-4 border-b border-gray-100">
        <button onClick={() => step === 0 ? navigate(-1) : prevStep()} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center press">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-gray-900 text-base">게시물 작성</h1>
          <p className="text-xs text-gray-400 mt-0.5">{step + 1}단계: {STEP_LABELS[step]}</p>
        </div>
        {profile && (
          <div className="flex items-center gap-1.5">
            <img
              src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name || 'U')}&background=00D4FF&color=fff&size=40`}
              alt=""
              className="w-7 h-7 rounded-full border border-[#00D4FF]"
            />
            <span className="text-xs font-bold text-gray-700">{profile.display_name || profile.username}</span>
          </div>
        )}
      </div>

      {/* 스텝 인디케이터 */}
      <div className="flex px-4 pt-3 gap-1.5">
        {STEP_LABELS.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= step ? 'bg-[#00D4FF]' : 'bg-gray-100'}`} />
        ))}
      </div>

      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">

        {/* STEP 0: 카테고리 + 캡션 + 루틴 */}
        {step === 0 && (
          <>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">카테고리</label>
              <div className="flex gap-2">
                {[['workout', '🏋️ 오운완'], ['diet', '🥗 식단 기록']].map(([key, label]) => (
                  <button key={key} onClick={() => setCategory(key)}
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all press ${
                      category === key
                        ? 'bg-gradient-to-r from-[#00D4FF] to-[#0891B2] text-white shadow-md shadow-cyan-200'
                        : 'bg-gray-50 text-gray-500'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">내용 (캡션)</label>
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder={category === 'workout' ? '오늘 운동 어떠셨나요? #오운완 #Fitsta' : '오늘의 식단을 공유해보세요! #식단 #다이어트'}
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
              />
              <p className="text-xs text-gray-400 text-right mt-1">{caption.length}/500</p>
            </div>

            {category === 'workout' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">운동 루틴 태그</label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setExerciseSheetOpen(true)}
                      className="flex items-center gap-1 text-xs text-white bg-[#00D4FF] px-3 py-1.5 rounded-full font-bold press shadow-sm"
                    >
                      <Search className="w-3 h-3" /> 운동 DB 검색
                    </button>
                    <button onClick={addRoutine} className="flex items-center gap-1 text-xs text-[#00D4FF] font-bold press">
                      <Plus className="w-3.5 h-3.5" /> 직접입력
                    </button>
                  </div>
                </div>
                {routines.map((r, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input type="text" placeholder="운동명" value={r.name}
                      onChange={e => updateRoutine(i, 'name', e.target.value)}
                      className="flex-[2] px-3 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00D4FF]" />
                    <input type="text" placeholder="세트" value={r.sets}
                      onChange={e => updateRoutine(i, 'sets', e.target.value)}
                      className="flex-1 px-3 py-2.5 bg-gray-50 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#00D4FF]" />
                    <input type="text" placeholder="횟수" value={r.reps}
                      onChange={e => updateRoutine(i, 'reps', e.target.value)}
                      className="flex-1 px-3 py-2.5 bg-gray-50 rounded-xl text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#00D4FF]" />
                    {routines.length > 1 && (
                      <button onClick={() => removeRoutine(i)} className="text-gray-300 hover:text-red-400 press px-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                {initialRoutines.length > 1 && routines === initialRoutines && (
                  <p className="text-xs text-[#00D4FF] font-medium mt-1">✓ 홈에서 체크한 운동이 자동으로 불러와졌어요!</p>
                )}
              </div>
            )}
          </>
        )}

        {/* STEP 1: 사진 선택 */}
        {step === 1 && (
          <>
            {/* 기기에서 업로드 */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">📱 기기에서 사진 불러오기</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-full py-4 rounded-2xl border-2 border-dashed flex flex-col items-center gap-2 press transition-all ${
                  uploadedImage ? 'border-[#00D4FF] bg-cyan-50' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <Image className={`w-7 h-7 ${uploadedImage ? 'text-[#00D4FF]' : 'text-gray-400'}`} />
                <span className={`text-sm font-bold ${uploadedImage ? 'text-[#00D4FF]' : 'text-gray-500'}`}>
                  {uploadedImage ? '✓ 사진 선택됨 (다시 선택하려면 탭)' : '갤러리 / PC 폴더에서 선택'}
                </span>
                <span className="text-xs text-gray-400">JPG, PNG, WEBP · 최대 5MB</span>
              </button>
              {uploadError && <p className="text-xs text-red-500 mt-1 font-medium">{uploadError}</p>}
            </div>

            {/* 추천 이미지 */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">또는 추천 이미지 선택</label>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_IMAGES[category].map((url, i) => (
                  <button key={i}
                    onClick={() => { setImageUrl(url); setUploadedImage(null); setStickerApplied(false) }}
                    className={`relative rounded-2xl overflow-hidden aspect-square press border-2 transition-all ${
                      imageUrl === url && !uploadedImage ? 'border-[#00D4FF] shadow-md shadow-cyan-200' : 'border-transparent'
                    }`}>
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    {imageUrl === url && !uploadedImage && (
                      <div className="absolute inset-0 bg-[#00D4FF]/20 flex items-center justify-center">
                        <span className="text-white text-xl">✓</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 미리보기 */}
            <div className="rounded-2xl overflow-hidden" style={{ aspectRatio: '1' }}>
              <img src={previewImage} alt="preview" className="w-full h-full object-cover" />
            </div>
          </>
        )}

        {/* STEP 2: 스티커 합성 */}
        {step === 2 && (
          <>
            <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '1' }}>
              <img src={previewImage} alt="preview" className="w-full h-full object-cover" />
              {stickerApplied && (
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-2xl p-3 text-white border border-white/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[#00D4FF] font-black text-xs">⚡ FITSTA</span>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <span>{category === 'workout' ? '🔥 오운완' : '🥗 식단완료'}</span>
                    <span>{category === 'workout' ? '💪 운동완료' : '✅ 목표달성'}</span>
                  </div>
                  <div className="text-xs mt-0.5 text-gray-300">목표 {exerciseGoal}분 달성!</div>
                </div>
              )}
            </div>
            <button
              onClick={() => setStickerApplied(!stickerApplied)}
              className={`w-full py-3.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 press transition-all ${
                stickerApplied ? 'bg-gray-100 text-gray-600' : 'bg-gradient-to-r from-[#00D4FF] to-[#0891B2] text-white shadow-lg shadow-cyan-200'
              }`}>
              <Sparkles className="w-4.5 h-4.5" />
              {stickerApplied ? '스티커 제거하기' : '✨ 오늘의 기록 스티커 합성하기'}
            </button>
            <div className="bg-cyan-50 rounded-2xl p-4 text-sm text-cyan-700">
              <p className="font-bold mb-1">📸 인스타그램 스토리 스타일</p>
              <p className="text-xs">오늘의 기록이 예쁜 스티커로 사진 위에 합성됩니다!</p>
            </div>
          </>
        )}

        {/* STEP 3: 최종 확인 */}
        {step === 3 && (
          <>
            <div className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: '1' }}>
              <img src={previewImage} alt="preview" className="w-full h-full object-cover" />
              {stickerApplied && (
                <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-2xl p-3 text-white border border-white/20">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[#00D4FF] font-black text-xs">⚡ FITSTA</span>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-300">
                    <span>{category === 'workout' ? '💪 오운완' : '🥗 식단완료'}</span>
                    <span>🔥 목표달성</span>
                  </div>
                </div>
              )}
            </div>

            {/* 작성자 정보 확인 */}
            {profile && (
              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-3">
                <img
                  src={profile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.display_name || 'U')}&background=00D4FF&color=fff&size=40`}
                  alt=""
                  className="w-9 h-9 rounded-full border-2 border-[#00D4FF]"
                />
                <div>
                  <p className="text-sm font-bold text-gray-900">{profile.display_name || profile.username}</p>
                  <p className="text-xs text-gray-400">@{profile.username}</p>
                </div>
                <span className={`ml-auto text-xs font-black px-2 py-0.5 rounded-full ${category === 'workout' ? 'bg-cyan-100 text-cyan-700' : 'bg-green-100 text-green-700'}`}>
                  {category === 'workout' ? '🏋️ 오운완' : '🥗 식단 기록'}
                </span>
              </div>
            )}

            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-sm text-gray-700 whitespace-pre-line">{caption || '(내용 없음)'}</p>
            </div>

            <button
              onClick={handlePost}
              disabled={posting}
              className="w-full py-4 bg-gradient-to-r from-[#00D4FF] to-[#0891B2] text-white font-black rounded-2xl shadow-lg shadow-cyan-200 press disabled:opacity-60 text-base"
            >
              {posting ? '게시 중...' : '🚀 피드에 게시하기'}
            </button>
          </>
        )}
      </div>

      {/* 하단 버튼 */}
      {step < 3 && (
        <div className="px-4 pb-8 pt-2 border-t border-gray-100 bg-white">
          <button
            onClick={nextStep}
            disabled={step === 0 && !caption.trim()}
            className="w-full py-4 bg-gradient-to-r from-[#00D4FF] to-[#0891B2] text-white font-black rounded-2xl shadow-lg shadow-cyan-200 press disabled:opacity-40 text-base"
          >
            다음 단계 →
          </button>
        </div>
      )}

      {/* 운동 검색 바텀시트 */}
      <ExerciseSearchSheet
        isOpen={exerciseSheetOpen}
        onClose={() => setExerciseSheetOpen(false)}
        onAdd={handleExerciseAdd}
      />
    </div>
  )
}

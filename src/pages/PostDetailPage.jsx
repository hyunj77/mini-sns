import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Flame, MessageCircle, UserPlus, UserCheck, Copy, Send } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchPostById } from '../lib/posts'
import { followUser, unfollowUser, isFollowing } from '../lib/follows'
import { DEMO_POSTS } from '../lib/demoPosts'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80'

const DEMO_COMMENTS = [
  { id: 'c1', content: '대단하네요! 저도 따라해볼게요 🔥', created_at: new Date(Date.now() - 1800000).toISOString(), profiles: { username: 'fan01', display_name: '응원러' } },
  { id: 'c2', content: '루틴 가져갈게요! 감사합니다', created_at: new Date(Date.now() - 900000).toISOString(), profiles: { username: 'beginner', display_name: '헬스초보' } },
]

export default function PostDetailPage() {
  const navigate  = useNavigate()
  const { id }    = useParams()
  const { user: me, profile } = useAuth()

  const demoFallback = DEMO_POSTS.find(p => p.id === id) || DEMO_POSTS[0]

  const [post, setPost]               = useState(demoFallback)
  const [comments, setComments]       = useState(DEMO_COMMENTS)
  const [liked, setLiked]             = useState(false)
  const [likeCount, setLikeCount]     = useState(demoFallback.likes_count || 0)
  const [comment, setComment]         = useState('')
  const [following, setFollowing]     = useState(false)
  const [routineCopied, setRoutineCopied] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (DEMO_POSTS.some(p => p.id === id)) return // 데모 게시물은 이미 로드됨
    fetchPostById(id).then(found => {
      if (cancelled || !found) return
      setPost(found)
      setLikeCount(found.likes_count || 0)
    })
    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    if (!me || !post.user_id) return
    let cancelled = false
    isFollowing(me.id, post.user_id).then(v => { if (!cancelled) setFollowing(v) })
    return () => { cancelled = true }
  }, [me, post.user_id])

  const handleFollow = () => {
    if (!me) return
    if (following) { unfollowUser(me.id, post.user_id) }
    else           { followUser(me.id, post.user_id) }
    setFollowing(v => !v)
  }

  const handleLike = () => {
    if (liked) return
    setLiked(true)
    setLikeCount(n => n + 1)
  }

  const handleComment = (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    const newComment = {
      id: `c-${Date.now()}`,
      content: comment.trim(),
      created_at: new Date().toISOString(),
      profiles: {
        username: profile?.username || 'me',
        display_name: profile?.display_name || profile?.username || '나',
        avatar_url: profile?.avatar_url || '',
      },
    }
    setComments(prev => [...prev, newComment])
    setComment('')
  }

  const handleCopyRoutine = () => {
    setRoutineCopied(true)
    setTimeout(() => setRoutineCopied(false), 2000)
  }

  const timeDiff = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const h = Math.floor(diff / 3600000)
    if (h < 1) return `${Math.floor(diff / 60000)}분 전`
    if (h < 24) return `${h}시간 전`
    return `${Math.floor(h / 24)}일 전`
  }

  const postProfile  = post.profiles || {}
  const displayName  = postProfile.display_name || postProfile.username || '사용자'
  const username     = postProfile.username || 'user'
  const avatar       = postProfile.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=00D4FF&color=fff&size=80`

  const myAvatar = profile?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.display_name || 'U')}&background=00D4FF&color=fff&size=40`

  const routine = Array.isArray(post.routine_data) ? post.routine_data.filter(r => r.name) : []

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* 상단 바: 작성자 프로필 */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-3 bg-white sticky top-0 z-10 border-b border-gray-50">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 press">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <button
          className="flex-1 flex items-center gap-2.5 press"
          onClick={() => navigate(`/profile/${post.user_id}`)}
        >
          <img src={avatar} alt="" className="w-9 h-9 rounded-full border-2 border-[#00D4FF] object-cover" />
          <div className="text-left">
            <p className="font-bold text-gray-900 text-sm leading-tight">{displayName}</p>
            <p className="text-xs text-gray-400">@{username}</p>
          </div>
        </button>
        {me?.id !== post.user_id && (
          <button
            onClick={handleFollow}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all press ${
              following
                ? 'bg-gray-100 text-gray-600'
                : 'bg-gradient-to-r from-[#00D4FF] to-[#0891B2] text-white shadow-sm shadow-cyan-200'
            }`}
          >
            {following ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
            {following ? '팔로잉' : '팔로우'}
          </button>
        )}
      </div>

      {/* 카테고리 뱃지 */}
      <div className="px-4 pt-2 pb-1">
        <span className={`text-xs font-black px-3 py-1 rounded-full ${
          post.category === 'workout'
            ? 'bg-cyan-100 text-cyan-700'
            : 'bg-green-100 text-green-700'
        }`}>
          {post.category === 'workout' ? '🏋️ 오운완' : '🥗 식단 기록'}
        </span>
      </div>

      {/* 이미지 */}
      <div className="w-full bg-gray-100" style={{ aspectRatio: '1' }}>
        <img
          src={post.image_url || FALLBACK_IMG}
          alt="post"
          className="w-full h-full object-cover"
          onError={e => { e.target.src = FALLBACK_IMG }}
        />
      </div>

      {/* 액션 버튼 */}
      <div className="px-4 py-3 flex items-center gap-4 border-b border-gray-50">
        <button onClick={handleLike} className={`flex items-center gap-1.5 press transition-all ${liked ? 'scale-110' : ''}`}>
          <Flame className={`w-7 h-7 transition-colors ${liked ? 'text-orange-500' : 'text-gray-400'}`} fill={liked ? '#f97316' : 'none'} strokeWidth={1.5} />
          <span className={`font-bold text-sm ${liked ? 'text-orange-500' : 'text-gray-600'}`}>{likeCount}</span>
        </button>
        <button className="flex items-center gap-1.5 press">
          <MessageCircle className="w-7 h-7 text-gray-400" strokeWidth={1.5} />
          <span className="font-bold text-sm text-gray-600">{comments.length}</span>
        </button>
        <div className="flex-1" />
        <span className="text-xs text-gray-400">{timeDiff(post.created_at)}</span>
      </div>

      {/* 캡션 */}
      <div className="px-4 py-3 border-b border-gray-50">
        <span className="font-bold text-gray-900 text-sm">{displayName} </span>
        <span className="text-sm text-gray-700 whitespace-pre-line">{post.caption}</span>
      </div>

      {/* 운동 루틴 카드 */}
      {routine.length > 0 && (
        <div className="mx-4 my-3 bg-gray-50 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-gray-800 text-sm">💪 운동 루틴</span>
            <button
              onClick={handleCopyRoutine}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold press transition-all ${
                routineCopied
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gradient-to-r from-[#00D4FF] to-[#0891B2] text-white shadow-sm'
              }`}
            >
              <Copy className="w-3 h-3" />
              {routineCopied ? '복사됨! ✓' : '루틴 가져오기'}
            </button>
          </div>
          <div className="space-y-2">
            {routine.map((r, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                <span className="font-medium text-gray-700 text-sm">{r.name}</span>
                <span className="text-gray-500 text-xs">
                  {r.sets}세트 × {r.reps}회{r.weight ? ` @ ${r.weight}kg` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 댓글 목록 */}
      <div className="px-4 pb-2 flex-1">
        <p className="text-xs font-bold text-gray-500 mb-3">댓글 {comments.length}개</p>
        {comments.map(c => {
          const cName   = c.profiles?.display_name || c.profiles?.username || '사용자'
          const cAvatar = c.profiles?.avatar_url ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(cName)}&background=6366f1&color=fff&size=40`
          return (
            <div key={c.id} className="flex gap-2.5 mb-3">
              <img src={cAvatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0 object-cover" />
              <div className="flex-1 bg-gray-50 rounded-2xl px-3 py-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-gray-800">{cName}</p>
                  <p className="text-[10px] text-gray-400">{timeDiff(c.created_at)}</p>
                </div>
                <p className="text-sm text-gray-600 mt-0.5">{c.content}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* 댓글 입력 */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 px-4 py-3"
        style={{ paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))' }}>
        <form onSubmit={handleComment} className="flex items-center gap-2">
          <img src={myAvatar} alt="" className="w-8 h-8 rounded-full flex-shrink-0 object-cover" />
          <input
            type="text"
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="응원 댓글 달기..."
            className="flex-1 px-4 py-2.5 bg-gray-50 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
          />
          <button
            type="submit"
            disabled={!comment.trim()}
            className="w-9 h-9 bg-gradient-to-br from-[#00D4FF] to-[#0891B2] rounded-full flex items-center justify-center flex-shrink-0 press disabled:opacity-40"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </form>
      </div>
    </div>
  )
}

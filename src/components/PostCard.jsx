import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, Trash2 } from 'lucide-react'

const WORKOUT_IMG = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80'
const DIET_IMG    = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80'

export default function PostCard({ post, currentUserId, onDelete }) {
  const navigate  = useNavigate()
  const [confirm, setConfirm] = useState(false)

  const avatar = post.profiles?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(post.profiles?.display_name || 'U')}&background=00D4FF&color=fff&size=64`
  const image    = post.image_url || (post.category === 'diet' ? DIET_IMG : WORKOUT_IMG)
  const isOwner  = currentUserId && post.user_id === currentUserId

  const handleDelete = (e) => {
    e.stopPropagation()
    if (!confirm) { setConfirm(true); return }
    onDelete?.(post.id)
  }

  const handleCancelDelete = (e) => {
    e.stopPropagation()
    setConfirm(false)
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden cursor-pointer press bg-gray-100"
      style={{ aspectRatio: '1/1' }}
      onClick={() => navigate(`/post/${post.id}`)}
    >
      <img
        src={image}
        alt="post"
        className="w-full h-full object-cover"
        loading="lazy"
        onError={e => { e.target.src = WORKOUT_IMG }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {/* 카테고리 뱃지 */}
      {post.category === 'workout' && (
        <div className="absolute top-2 left-2">
          <span className="bg-[#00D4FF] text-white text-[9px] font-black px-2 py-0.5 rounded-full tracking-wide">
            오운완
          </span>
        </div>
      )}
      {post.category === 'diet' && (
        <div className="absolute top-2 left-2">
          <span className="bg-green-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full tracking-wide">
            식단 기록
          </span>
        </div>
      )}

      {/* 내 게시글 삭제 버튼 */}
      {isOwner && (
        <div className="absolute top-2 right-2" onClick={e => e.stopPropagation()}>
          {confirm ? (
            <div className="flex gap-1">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full"
              >
                삭제
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded-full"
              >
                취소
              </button>
            </div>
          ) : (
            <button
              onClick={handleDelete}
              className="w-6 h-6 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-red-500/80 transition-colors"
            >
              <Trash2 className="w-3 h-3 text-white" />
            </button>
          )}
        </div>
      )}

      {/* 하단 작성자 + 좋아요 */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <button
          className="flex items-center gap-1.5 min-w-0 press"
          onClick={(e) => {
            e.stopPropagation()
            navigate(`/profile/${post.user_id}`)
          }}
        >
          <img src={avatar} alt="" className="w-5 h-5 rounded-full border border-white flex-shrink-0" />
          <span className="text-white text-[11px] font-semibold truncate">
            {post.profiles?.display_name || post.profiles?.username || '사용자'}
          </span>
        </button>
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <Flame className="w-3 h-3 text-orange-400" fill="#fb923c" />
          <span className="text-white text-[11px] font-bold">{post.likes_count || 0}</span>
        </div>
      </div>
    </div>
  )
}

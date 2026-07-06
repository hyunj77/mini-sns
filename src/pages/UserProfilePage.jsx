import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, UserPlus, UserCheck, Grid2X2, Flame } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { fetchPostsByUser } from '../lib/posts'
import {
  getUserProfile,
  followUser, unfollowUser, isFollowing,
  getFollowerCount, getFollowingCount,
} from '../lib/follows'
import { DEMO_POSTS, DEMO_USER_PROFILES } from '../lib/demoPosts'

const FALLBACK = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80'

function MiniPostCard({ post, onClick }) {
  const img = post.image_url || FALLBACK
  return (
    <button
      onClick={() => onClick(post.id)}
      className="aspect-square rounded-xl overflow-hidden bg-gray-100 press relative"
    >
      <img src={img} alt="" className="w-full h-full object-cover"
        onError={e => { e.target.src = FALLBACK }} />
      <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-0.5">
        <Flame className="w-3 h-3 text-orange-400" fill="#fb923c" />
        <span className="text-white text-[10px] font-bold drop-shadow">{post.likes_count || 0}</span>
      </div>
    </button>
  )
}

export default function UserProfilePage() {
  const { userId }  = useParams()
  const navigate    = useNavigate()
  const { user: me } = useAuth()

  const isDemo = userId?.startsWith('demo_')

  // ── 프로필 로드 ──
  const [profile, setProfile]     = useState(null)
  const [posts, setPosts]         = useState([])
  const [following, setFollowing] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)

  useEffect(() => {
    if (!userId) return
    let cancelled = false

    if (isDemo) {
      // 데모 유저
      const demo = DEMO_USER_PROFILES[userId]
      if (demo) setProfile(demo)
      setPosts(DEMO_POSTS.filter(p => p.user_id === userId))
    } else {
      // 실제 유저
      getUserProfile(userId).then(p => { if (!cancelled && p) setProfile(p) })
      fetchPostsByUser(userId).then(p => { if (!cancelled) setPosts(p) })
    }

    if (me) {
      isFollowing(me.id, userId).then(v => { if (!cancelled) setFollowing(v) })
      getFollowerCount(userId).then(v => { if (!cancelled) setFollowerCount(v) })
      getFollowingCount(userId).then(v => { if (!cancelled) setFollowingCount(v) })
    }

    return () => { cancelled = true }
  }, [userId, me])

  const handleFollow = async () => {
    if (!me) return
    if (following) {
      await unfollowUser(me.id, userId)
      setFollowerCount(n => Math.max(0, n - 1))
    } else {
      await followUser(me.id, userId)
      setFollowerCount(n => n + 1)
    }
    setFollowing(v => !v)
  }

  const isMyProfile = me?.id === userId

  if (!profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-gray-500 font-medium">유저를 찾을 수 없어요</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-[#00D4FF] font-bold text-sm">
            돌아가기
          </button>
        </div>
      </div>
    )
  }

  const name    = profile.display_name || profile.username || '사용자'
  const avatar  = profile.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=00D4FF&color=fff&size=160`
  const streak  = profile.streak_count || 0

  // 데모 유저는 임의의 팔로워/팔로잉 숫자 표시
  const displayFollowers  = isDemo ? (DEMO_USER_PROFILES[userId]?.streak_count * 6 || 120) : followerCount
  const displayFollowing  = isDemo ? (DEMO_USER_PROFILES[userId]?.streak_count * 2 || 48) : followingCount

  return (
    <div className="min-h-screen bg-white">
      {/* 상단 헤더 */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 press">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="flex-1 font-black text-gray-900 text-base">@{profile.username}</h1>
        {streak > 0 && (
          <span className="text-sm font-bold text-orange-500">🔥 {streak}일</span>
        )}
      </div>

      {/* 프로필 섹션 */}
      <div className="px-5 pt-5 pb-4">
        {/* 아바타 + 통계 */}
        <div className="flex items-center gap-5 mb-4">
          <div className="relative flex-shrink-0">
            <img src={avatar} alt="avatar"
              className="w-20 h-20 rounded-full object-cover border-3"
              style={{ border: '3px solid #00D4FF' }}
            />
            {streak > 0 && (
              <div className="absolute -bottom-1 -right-1 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">
                🔥{streak}
              </div>
            )}
          </div>

          {/* 통계 */}
          <div className="flex flex-1 justify-around">
            {[
              { label: '게시물', value: posts.length },
              { label: '팔로워', value: displayFollowers },
              { label: '팔로잉', value: displayFollowing },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="font-black text-gray-900 text-lg leading-none">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 이름 + 바이오 */}
        <div className="mb-4">
          <p className="font-black text-gray-900 text-base">{name}</p>
          <p className="text-xs text-gray-400 mb-1">@{profile.username}</p>
          {profile.bio && (
            <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{profile.bio}</p>
          )}
          {isDemo && (
            <div className="mt-2 flex flex-wrap gap-1">
              {(
                profile.username === 'fituser01' || profile.username === 'squat_king' || profile.username === 'morning_run'
                  ? ['🏋️ 운동', '💪 오운완', '#헬스']
                  : ['🥗 식단', '🥑 다이어트', '#건강식']
              ).map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* 팔로우 / 프로필 수정 버튼 */}
        {isMyProfile ? (
          <button
            onClick={() => navigate('/mypage')}
            className="w-full py-2.5 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 press"
          >
            프로필 수정
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleFollow}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 press transition-all ${
                following
                  ? 'border-2 border-gray-200 text-gray-700'
                  : 'bg-gradient-to-r from-[#00D4FF] to-[#0891B2] text-white shadow-md shadow-cyan-200'
              }`}
            >
              {following ? (
                <><UserCheck className="w-4 h-4" /> 팔로잉</>
              ) : (
                <><UserPlus className="w-4 h-4" /> 팔로우</>
              )}
            </button>
            <button
              className="px-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 press"
              onClick={() => {}}
            >
              메시지
            </button>
          </div>
        )}
      </div>

      {/* 구분선 + 게시물 탭 */}
      <div className="flex items-center border-t border-b border-gray-100 bg-white">
        <div className="flex-1 flex items-center justify-center gap-2 py-3 border-b-2 border-gray-900">
          <Grid2X2 className="w-4 h-4 text-gray-700" />
          <span className="text-xs font-bold text-gray-700">게시물</span>
        </div>
      </div>

      {/* 게시물 그리드 */}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center py-16 gap-3">
          <span className="text-5xl">📸</span>
          <p className="text-gray-500 font-medium text-sm">아직 게시물이 없어요</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-0.5 p-0.5">
          {posts.map(post => (
            <MiniPostCard
              key={post.id}
              post={post}
              onClick={(id) => navigate(`/post/${id}`)}
            />
          ))}
        </div>
      )}

      <div className="h-20" />
    </div>
  )
}

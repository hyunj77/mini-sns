import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, SlidersHorizontal } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import PostCard from '../components/PostCard'
import { fetchPostsByCategory, deletePost } from '../lib/posts'
import { useAuth } from '../context/AuthContext'
import { DEMO_POSTS } from '../lib/demoPosts'

const TABS = [
  { key: 'workout', label: '🏋️ 오운완' },
  { key: 'diet',    label: '🥗 식단 기록' },
]

export default function FeedPage() {
  const location = useLocation()
  const { user } = useAuth()
  const [tab, setTab] = useState(location.state?.tab || 'workout')
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')

  const loadPosts = async (currentTab) => {
    const userPosts = await fetchPostsByCategory(currentTab)
    const demoPosts = DEMO_POSTS.filter(p => p.category === currentTab)
    setPosts([...userPosts, ...demoPosts])
  }

  useEffect(() => { loadPosts(tab) }, [tab])

  const handleDelete = async (postId) => {
    await deletePost(postId)
    loadPosts(tab)
  }

  const filtered = posts.filter(p =>
    !search || p.caption?.toLowerCase().includes(search.toLowerCase()) ||
    p.profiles?.display_name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <div className="px-5 pt-12 pb-3 bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-black text-gray-900">커뮤니티 피드</h1>
          <button className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100">
            <SlidersHorizontal className="w-4.5 h-4.5 text-gray-500" />
          </button>
        </div>

        {/* 검색 */}
        <div className="relative mb-3">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="게시물, 사용자 검색..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
          />
        </div>

        {/* 탭 */}
        <div className="flex gap-2">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2 rounded-2xl text-sm font-bold transition-all ${
                tab === key
                  ? 'bg-gradient-to-r from-[#00D4FF] to-[#0891B2] text-white shadow-md shadow-cyan-200'
                  : 'bg-gray-50 text-gray-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 피드 그리드 */}
      <div className="px-4 pt-3 bottom-safe">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-5xl">{tab === 'workout' ? '🏋️' : '🥗'}</span>
            <p className="text-gray-500 font-medium text-sm">첫 번째 게시물을 올려보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(post => (
              <PostCard
                key={post.id}
                post={post}
                currentUserId={user?.id}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}

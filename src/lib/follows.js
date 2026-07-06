import { supabase } from './supabase'

export async function followUser(followerId, followingId) {
  if (followerId === followingId) return
  await supabase.from('follows').insert({ follower_id: followerId, following_id: followingId })
}

export async function unfollowUser(followerId, followingId) {
  await supabase
    .from('follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
}

export async function isFollowing(followerId, followingId) {
  if (!followerId) return false
  const { data } = await supabase
    .from('follows')
    .select('follower_id')
    .eq('follower_id', followerId)
    .eq('following_id', followingId)
    .maybeSingle()
  return !!data
}

export async function getFollowerCount(userId) {
  const { count } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('following_id', userId)
  return count || 0
}

export async function getFollowingCount(userId) {
  const { count } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', userId)
  return count || 0
}

export async function getUserProfile(userId) {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data || null
}

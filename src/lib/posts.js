import { supabase } from './supabase'

const SELECT = '*, profiles(username, display_name, avatar_url)'

export async function fetchPostsByCategory(category) {
  const { data, error } = await supabase
    .from('posts')
    .select(SELECT)
    .eq('category', category)
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data
}

export async function fetchPostsByUser(userId) {
  const { data, error } = await supabase
    .from('posts')
    .select(SELECT)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data
}

export async function fetchPostById(id) {
  const { data, error } = await supabase
    .from('posts')
    .select(SELECT)
    .eq('id', id)
    .single()
  if (error) return null
  return data
}

export async function createPost({ userId, caption, image_url, category, routine_data }) {
  const { data, error } = await supabase
    .from('posts')
    .insert({ user_id: userId, caption, image_url, category, routine_data })
    .select(SELECT)
    .single()
  return { data, error }
}

export async function deletePost(postId) {
  const { error } = await supabase.from('posts').delete().eq('id', postId)
  return { error }
}

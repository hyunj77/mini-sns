import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

async function fetchProfile(userId) {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data || null
}

function mapAuthError(error) {
  if (!error) return null
  if (error.message?.includes('profiles_username_key')) {
    return { message: '이미 사용 중인 사용자명입니다.' }
  }
  if (error.message === 'User already registered') {
    return { message: '이미 가입된 이메일입니다. 로그인 탭을 이용해 주세요.' }
  }
  if (error.message === 'Invalid login credentials') {
    return { message: '이메일 또는 비밀번호가 올바르지 않습니다.' }
  }
  if (error.message === 'Email not confirmed') {
    return { message: '이메일 인증 후 로그인해주세요.' }
  }
  return { message: error.message }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user)
        setProfile(await fetchProfile(session.user.id))
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user)
        setProfile(await fetchProfile(session.user.id))
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async ({ email, password, username, displayName }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username, display_name: displayName || username } },
    })
    if (error) return { data: null, error: mapAuthError(error) }
    if (data.session) {
      setUser(data.user)
      setProfile(await fetchProfile(data.user.id))
    }
    return { data, error: null, needsEmailConfirm: !data.session }
  }

  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { data: null, error: mapAuthError(error) }
    setUser(data.user)
    setProfile(await fetchProfile(data.user.id))
    return { data, error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  const updateProfile = async (updates) => {
    if (!user) return { error: { message: '로그인이 필요합니다.' } }
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id)
    if (!error) setProfile(prev => ({ ...prev, ...updates }))
    return { error }
  }

  const refreshProfile = async () => {
    if (!user) return
    setProfile(await fetchProfile(user.id))
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, refreshProfile, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

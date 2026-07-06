import { supabase } from './supabase'

export async function fetchCustomFoods() {
  const { data, error } = await supabase
    .from('foods')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) { console.error(error); return [] }
  return data.map(f => ({
    id: f.id,
    emoji: f.emoji || '🍽️',
    name: f.name,
    calories: f.calories,
    serving: f.serving || '1인분',
    category: '추가됨',
  }))
}

export async function addCustomFood({ name, calories, createdBy }) {
  const { data, error } = await supabase
    .from('foods')
    .upsert({ name, calories, created_by: createdBy }, { onConflict: 'name', ignoreDuplicates: true })
    .select()
    .maybeSingle()
  return { data, error }
}

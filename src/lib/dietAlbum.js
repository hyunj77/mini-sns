const ALBUM_KEY = 'fitsta_diet_album'

export function getDietPhotos() {
  try { return JSON.parse(localStorage.getItem(ALBUM_KEY) || '[]') } catch { return [] }
}

export function addDietPhoto({ date, mealType, imageUrl }) {
  const photos = getDietPhotos()
  const entry = { id: `dp-${Date.now()}`, date, mealType, imageUrl, createdAt: new Date().toISOString() }
  photos.unshift(entry)
  localStorage.setItem(ALBUM_KEY, JSON.stringify(photos))
  return photos
}

export function deleteDietPhoto(id) {
  const updated = getDietPhotos().filter(p => p.id !== id)
  localStorage.setItem(ALBUM_KEY, JSON.stringify(updated))
  return updated
}

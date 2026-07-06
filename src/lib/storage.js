// 식단 기록 (날짜별 meals 배열)
export function getMeals(date) {
  try { return JSON.parse(localStorage.getItem(`fitsta_meals_${date}`) || '[]') } catch { return [] }
}

export function addMeal(date, meal) {
  const updated = [...getMeals(date), meal]
  localStorage.setItem(`fitsta_meals_${date}`, JSON.stringify(updated))
  return updated
}

export function deleteMeal(date, mealId) {
  const updated = getMeals(date).filter(m => m.id !== mealId)
  localStorage.setItem(`fitsta_meals_${date}`, JSON.stringify(updated))
  return updated
}

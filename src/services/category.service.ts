const API_URL = 'http://localhost:8080/api/categories'

export const getCategories = async () => {
  const response = await fetch(API_URL)
  if (!response.ok) {
    throw new Error('Failed to fetch categories')
  }
  return response.json()
}

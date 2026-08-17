const BASE_URL = import.meta.env.VITE_API_BASE_URL

export const apiFetch = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const isFormData = options.body instanceof FormData

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  })

  // ============================
  // HANDLE ERROR
  // ============================
  if (!response.ok) {
    let message = `HTTP error! status: ${response.status}`
    let hasBackendMessage = false

    try {
      const data = await response.json()

      if (data?.message) {
        message = data.message
        hasBackendMessage = true
      } else if (data?.error) {
        message = data.error
        hasBackendMessage = true
      }
    } catch {
      // Response wasn't JSON
    }

    // Friendly fallback when backend gave nothing useful
    if (!hasBackendMessage) {
      if (response.status === 403) {
        message = 'អ្នកគ្មានសិទ្ធិសម្រាប់សកម្មភាពនេះទេ។'
      } else if (response.status === 401) {
        message = 'សូមចូលប្រព័ន្ធម្តងទៀត។'
      } else if (response.status === 404) {
        message = 'រកមិនឃើញទិន្នន័យនេះទេ។'
      } else if (response.status >= 500) {
        message = 'មានបញ្ហាបច្ចេកទេស សូមព្យាយាមម្តងទៀត។'
      }
    }

    const error = new Error(message)
    ;(error as Error & { status?: number }).status = response.status

    throw error
  }

  // ============================
  // NO CONTENT
  // ============================
  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

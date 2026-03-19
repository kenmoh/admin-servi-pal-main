// Auth storage adapter for Supabase
// Uses localStorage for client-side persistence
const authStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(key)
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return
    localStorage.setItem(key, value)
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(key)
  },
}

export default authStorage

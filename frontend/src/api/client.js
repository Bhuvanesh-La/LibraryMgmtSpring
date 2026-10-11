import axios from 'axios'

const TOKEN_KEY = 'lms_auth'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

export function loadAuth() {
  try {
    return JSON.parse(localStorage.getItem(TOKEN_KEY)) || null
  } catch {
    return null
  }
}

export function saveAuth(auth) {
  try {
    if (auth) localStorage.setItem(TOKEN_KEY, JSON.stringify(auth))
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* storage unavailable - session simply won't persist across reloads */
  }
}

api.interceptors.request.use((config) => {
  const auth = loadAuth()
  if (auth?.token) config.headers.Authorization = `Bearer ${auth.token}`
  return config
})

// Set by AuthProvider so an expired/invalid token logs the user out everywhere.
let onUnauthorized = () => {}
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn
}

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isLogin = error.config?.url?.includes('/auth/login')
    if (error.response?.status === 401 && !isLogin) onUnauthorized()
    return Promise.reject(error)
  },
)

export function errorMessage(error, fallback = 'Something went wrong') {
  return error?.response?.data?.message || fallback
}

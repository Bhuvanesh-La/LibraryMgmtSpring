import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, loadAuth, saveAuth, setUnauthorizedHandler } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => loadAuth())

  const logout = useCallback(() => {
    saveAuth(null)
    setAuth(null)
  }, [])

  const login = useCallback(async (username, password) => {
    const { data } = await api.post('/auth/login', { username, password })
    saveAuth(data)
    setAuth(data)
    return data
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(logout)
  }, [logout])

  const value = useMemo(() => ({ user: auth, isAuthenticated: !!auth?.token, login, logout }), [auth, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

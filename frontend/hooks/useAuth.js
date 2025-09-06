import React, { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/router'

const TOKEN_KEY = 'wc_token'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const auth = useProvideAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export default function useAuth() {
  return useContext(AuthContext)
}

function useProvideAuth() {
  // Start with no token during SSR so server-rendered HTML matches client's
  // initial render. Read token from localStorage on mount (client-only)
  // and expose an `isReady` flag so consumers can wait for client hydration.
  const [token, setToken] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      const t = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
      if (t) setToken(t)
    } catch (e) {
      // ignore
    } finally {
      setIsReady(true)
    }
  }, [])

  function login(tokenValue) {
    if (typeof window !== 'undefined') localStorage.setItem(TOKEN_KEY, tokenValue)
    setToken(tokenValue)
  }

  function logout() {
    if (typeof window !== 'undefined') localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    router.push('/login')
  }

  function isAuthenticated() {
    return !!token
  }

  function getAuthHeader() {
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  return { token, login, logout, isAuthenticated, getAuthHeader, isReady }
}

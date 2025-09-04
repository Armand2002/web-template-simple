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
  // Read token synchronously on first render (client-side) to avoid a
  // hydration/race where ProtectedRoute redirects to /login before the
  // token is loaded into state.
  const [token, setToken] = useState(() => {
    try {
      return typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
    } catch (e) {
      return null
    }
  })
  const router = useRouter()

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

  return { token, login, logout, isAuthenticated, getAuthHeader }
}

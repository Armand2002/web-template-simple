import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useAuth from './useAuth'

export default function ProtectedRoute({ children }) {
  const auth = useAuth()
  const router = useRouter()
  // Wait until auth is ready (client-side) before performing redirect to
  // avoid hydration mismatch where server rendered HTML differs from client.
  useEffect(() => {
    if (!auth) return
    if (!auth.isReady) return
    if (!auth.isAuthenticated()) {
      router.push('/login')
    }
  }, [auth, auth?.isReady])

  if (!auth || !auth.isReady) return null
  if (!auth.isAuthenticated()) return null
  return children
}

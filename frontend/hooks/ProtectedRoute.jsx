import { useEffect } from 'react'
import { useRouter } from 'next/router'
import useAuth from './useAuth'

export default function ProtectedRoute({ children }) {
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!auth) return
    if (!auth.isAuthenticated()) {
      router.push('/login')
    }
  }, [auth])

  if (!auth || !auth.isAuthenticated()) return null
  return children
}

import Link from 'next/link'
import { useRouter } from 'next/router'
import useAuth from '../hooks/useAuth'

function decodePayload(token) {
  if (!token) return null
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = parts[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(atob(base64).split('').map(c => '%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''))
    return JSON.parse(json)
  } catch (e) {
    return null
  }
}

export default function Navbar() {
  const auth = useAuth()
  const router = useRouter()
  const token = auth && auth.token
  const email = token ? (decodePayload(token)?.sub || '') : ''

  function onLogout(e) {
    e.preventDefault()
    auth?.logout()
    router.push('/login')
  }

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="site-title">
          <Link href="/" className="site-title-link">TutorialSite</Link>
        </div>
        <div className="site-center">
          <Link href="/dashboard" className="btn"><span className="btn-icon">🏠</span>Dashboard</Link>
        </div>
        <nav className="nav-actions">
          {!auth || !auth.isAuthenticated() ? (
            <>
              <Link href="/login" className="btn btn-primary"><span className="btn-icon">🔑</span>Login</Link>
              <Link href="/register" className="btn btn-outline"><span className="btn-icon">✍️</span>Registrati</Link>
            </>
          ) : (
            <>
              <span className="user-email">{email}</span>
              <a href="#" onClick={onLogout} className="btn btn-logout"><span className="btn-icon">🚪</span>Logout</a>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import useAuth from '../hooks/useAuth'
import { login as apiLogin } from '../services/personService'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  async function submit(e) {
    e.preventDefault()
    setError(null)
    try {
      const data = await apiLogin({ email, password })
      if (data && data.access_token) {
        login(data.access_token)
        window.location.href = '/dashboard'
      } else {
        setError('Token mancante nella risposta')
      }
    } catch (err) {
      setError(err.message || 'Errore login')
    }
  }

  return (
    <div>
      <Navbar />
  <div className="auth-viewport">
        <div className="auth-card">
          <h1 className="auth-title">Accedi al tuo account</h1>
          <p className="auth-sub">Inserisci le tue credenziali per accedere alla dashboard.</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={submit} className="auth-form">
            <label className="field">
              <span className="label">Email</span>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" className="input" />
            </label>
            <label className="field">
              <span className="label">Password</span>
              <input value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type="password" className="input" />
            </label>
            <div className="mt-4">
              <button className="btn btn-primary auth-btn">Login</button>
            </div>
            <div className="auth-footer">
              <a href="/register" className="link">Non hai un account? Registrati</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


import Navbar from '../components/Navbar'
import { useState } from 'react'
import PersonForm from '../components/PersonForm'
import { register as apiRegister } from '../services/personService'
import useAuth from '../hooks/useAuth'

export default function Register() {
  const [submitted] = useState(false)
  const [error, setError] = useState(null)
  const { login } = useAuth()

  async function handleRegister(data) {
    try {
      const res = await apiRegister(data)
  if (res?.access_token) {
        // automatically login user in client
        login(res.access_token)
        window.location.href = '/dashboard'
      } else {
        setError('Registrazione non riuscita')
      }
    } catch (err) {
      setError(err.message || 'Errore durante la registrazione')
    }
  }

  return (
    <div>
      <Navbar />
      <main className="auth-viewport">
        <div className="auth-card">
          <h1 className="auth-title">Crea il tuo account</h1>
          <p className="auth-sub">Registrati per gestire le persone nella dashboard.</p>
          {error && <div className="auth-error">{error}</div>}
          {submitted ? (
            <div className="auth-sub">Registrazione completata. Reindirizzamento in corso...</div>
          ) : (
            <PersonForm auth includePassword onSubmit={handleRegister} submitLabel="Registrati" />
          )}
          <div className="auth-footer" style={{ marginTop: 8 }}>
            <a href="/login" className="link">Hai già un account? Accedi</a>
          </div>
        </div>
      </main>
    </div>
  )
}

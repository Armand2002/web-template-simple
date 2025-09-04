import { useRouter } from 'next/router'
import PersonForm from '../../components/PersonForm'
import { createPersona } from '../../services/personService'
import useAuth from '../../hooks/useAuth'
import ProtectedRoute from '../../hooks/ProtectedRoute'

export default function NewPerson() {
  const router = useRouter()
  const { getAuthHeader, logout } = useAuth()

  async function onSubmit(payload) {
    try {
      await createPersona(payload, getAuthHeader())
      router.push('/dashboard')
    } catch (err) {
      if (err.status === 401) return logout()
      alert('Errore creazione: ' + (err.message || ''))
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">Nuova Persona</h1>
          <PersonForm onSubmit={onSubmit} />
        </div>
      </main>
    </ProtectedRoute>
  )
}

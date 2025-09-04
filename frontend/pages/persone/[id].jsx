import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getPersona, updatePersona, deletePersona } from '../../services/personService'
import PersonForm from '../../components/PersonForm'
import useAuth from '../../hooks/useAuth'
import ProtectedRoute from '../../hooks/ProtectedRoute'

export default function PersonDetail() {
  const router = useRouter()
  const { id } = router.query
  const { getAuthHeader, logout } = useAuth()
  const [persona, setPersona] = useState(null)

  useEffect(() => {
    if (!id) return
    async function load() {
      try {
        const data = await getPersona(id, getAuthHeader())
        setPersona(data)
      } catch (err) {
        if (err.status === 401) return logout()
        alert('Errore caricamento')
      }
    }
    load()
  }, [id])

  async function onSubmit(payload) {
    try {
      await updatePersona(id, payload, getAuthHeader())
      router.push('/dashboard')
    } catch (err) {
      if (err.status === 401) return logout()
      alert('Errore aggiornamento')
    }
  }

  async function onDelete() {
    if (!confirm('Eliminare questa persona?')) return
    try {
      await deletePersona(id, getAuthHeader())
      router.push('/dashboard')
    } catch (err) {
      if (err.status === 401) return logout()
      alert('Errore eliminazione')
    }
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4">Dettaglio Persona</h1>
          {persona ? (
            <>
              <PersonForm initial={persona} onSubmit={onSubmit} />
              <div className="mt-4">
                <button onClick={onDelete} className="bg-red-600 text-white px-3 py-1 rounded">Elimina</button>
              </div>
            </>
          ) : (
            <p>Caricamento...</p>
          )}
        </div>
      </main>
    </ProtectedRoute>
  )
}

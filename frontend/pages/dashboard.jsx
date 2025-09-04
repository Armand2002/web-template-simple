import React, { useEffect, useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import useAuth from '../hooks/useAuth'
import { getPersone, deletePersona } from '../services/personService'
import PersonCard from '../components/PersonCard'
import ProtectedRoute from '../hooks/ProtectedRoute'
import Link from 'next/link'

export default function Dashboard() {
  const { getAuthHeader } = useAuth()
  const [persone, setPersone] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        const data = await getPersone(getAuthHeader())
        if (!mounted) return
        setPersone(Array.isArray(data) ? data : [])
      } catch (err) {
        if (!mounted) return
        setError(err.message || 'Errore caricamento')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [getAuthHeader])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return persone
    return persone.filter(p => {
      return (
        (p.nome || '').toLowerCase().includes(q) ||
        (p.cognome || '').toLowerCase().includes(q) ||
        (p.email || '').toLowerCase().includes(q) ||
        (p.telefono || '').toLowerCase().includes(q)
      )
    })
  }, [persone, query])

  return (
    <ProtectedRoute>
      <div>
        <Navbar />

        <main className="hero">
          <div className="hero-inner">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <h1 className="hero-title">Dashboard</h1>
                <p className="hero-sub">Visualizza e gestisci le persone. Le informazioni pubbliche sono: nome, email e numero di telefono.</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Link href="/persone/new" className="btn btn-primary">➕ Nuova persona</Link>
              </div>
            </div>

            <div className="search-row" style={{ marginTop: 18 }}>
              <div className="search-input">
                <span className="search-icon">🔎</span>
                <input
                  aria-label="Cerca persone"
                  placeholder="Cerca per nome, email o telefono..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              {loading && <div className="text-center">Caricamento in corso…</div>}
              {!loading && error && <div className="text-red-600 text-center">{error}</div>}
              {!loading && !error && filtered.length === 0 && (
                <div className="auth-card" style={{ textAlign: 'center' }}>
                  <p className="auth-sub">Nessuna persona trovata.</p>
                  <Link href="/persone/new" className="btn btn-primary auth-btn">Aggiungi la prima persona</Link>
                </div>
              )}
              {!loading && !error && filtered.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                  {filtered.map(p => (
                    <PersonCard
                      key={p.id}
                      person={p}
                      onClick={() => window.location.href = `/persone/${p.id}`}
                      onEdit={() => window.location.href = `/persone/${p.id}`}
                      onDelete={async () => {
                        if (!confirm('Confermi eliminazione?')) return
                        try {
                          await deletePersona(p.id, getAuthHeader())
                          // refresh list
                          const data = await getPersone(getAuthHeader())
                          setPersone(Array.isArray(data) ? data : [])
                        } catch (err) {
                          alert('Errore eliminazione: ' + (err.message || ''))
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}


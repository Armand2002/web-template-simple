import { useState } from 'react'

export default function PersonForm({ initial = {}, onSubmit, auth = false, includePassword = false, submitLabel = 'Salva' }) {
  const [form, setForm] = useState({
    nome: initial.nome || '',
    cognome: initial.cognome || '',
  email: initial.email || '',
  telefono: initial.telefono || '',
    password: ''
  })

  function change(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const [error, setError] = useState(null)

  function submit(e) {
    e.preventDefault()
    setError(null)
    // if registration includes password, ensure it's present
    if (includePassword) {
      if (!form.password || form.password.length < 6) {
        setError('La password è richiesta (minimo 6 caratteri)')
        return
      }
    }
  // send only relevant fields
  const payload = { nome: form.nome, cognome: form.cognome, email: form.email, telefono: form.telefono }
  if (includePassword) payload.password = form.password
  onSubmit?.(payload)
  }

  

  // Auth-style form (used for register) mirrors the login layout
  if (auth) {
    return (
      <form onSubmit={submit} className="auth-form">
        <label className="field">
          <span className="label">Nome</span>
          <input name="nome" value={form.nome} onChange={change} placeholder="Nome" type="text" className="input" />
        </label>

        <label className="field">
          <span className="label">Cognome</span>
          <input name="cognome" value={form.cognome} onChange={change} placeholder="Cognome" type="text" className="input" />
        </label>

        <label className="field">
          <span className="label">Email</span>
          <input name="email" value={form.email} onChange={change} placeholder="you@example.com" type="email" className="input" />
        </label>

        <label className="field">
          <span className="label">Telefono</span>
          <input name="telefono" value={form.telefono} onChange={change} placeholder="+39 320 1234567" type="text" className="input" />
        </label>

        {includePassword && (
          <label className="field">
            <span className="label">Password</span>
            <input name="password" value={form.password} onChange={change} placeholder="••••••••" type="password" className="input" />
          </label>
        )}

        {error && <div className="auth-error">{error}</div>}

        <div className="mt-4">
          <button type="submit" className="btn btn-primary auth-btn">{submitLabel}</button>
        </div>
      </form>
    )
  }

  // default non-auth form (used elsewhere)
  return (
    <form onSubmit={submit} className="space-y-2">
      <label className="field">
        <span className="label">Nome</span>
        <input name="nome" value={form.nome} onChange={change} placeholder="Nome" className="input" />
      </label>

      <label className="field">
        <span className="label">Cognome</span>
        <input name="cognome" value={form.cognome} onChange={change} placeholder="Cognome" className="input" />
      </label>

      <label className="field">
        <span className="label">Email</span>
        <input name="email" value={form.email} onChange={change} placeholder="Email" className="input" />
      </label>

      <label className="field">
        <span className="label">Telefono</span>
        <input name="telefono" value={form.telefono} onChange={change} placeholder="Telefono" className="input" />
      </label>

      {error && <div className="auth-error">{error}</div>}
      <div>
        <button type="submit" className="bg-green-600 text-white px-3 py-1 rounded">{submitLabel}</button>
      </div>
    </form>
  )
}

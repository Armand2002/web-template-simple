const BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options)
  if (!res.ok) {
    const text = await res.text()
    const err = new Error(text || res.statusText)
    err.status = res.status
    throw err
  }
  return res.json()
}

export async function login(credentials) {
  return request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
}

export async function register(payload) {
  return request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
}

export async function getPersone(authHeader = {}) {
  return request('/persone', { headers: { ...authHeader } })
}

export async function getPersona(id, authHeader = {}) {
  return request(`/persone/${id}`, { headers: { ...authHeader } })
}

export async function createPersona(payload, authHeader = {}) {
  return request('/persone', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader },
    body: JSON.stringify(payload)
  })
}

export async function updatePersona(id, payload, authHeader = {}) {
  return request(`/persone/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader },
    body: JSON.stringify(payload)
  })
}

export async function deletePersona(id, authHeader = {}) {
  return request(`/persone/${id}`, { method: 'DELETE', headers: { ...authHeader } })
}

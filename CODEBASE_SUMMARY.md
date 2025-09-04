# Codebase summary — web-template-simple

Breve piano: qui trovi una cronologia coerente di cosa è stato fatto (backend, frontend, DB, test), i file chiave modificati/creati, i comandi eseguiti, i problemi risolti e i prossimi passi consigliati per completare il progetto.

## Checklist rapida
- [x] Backend FastAPI + SQLModel con auth JWT (register/login)
- [x] Frontend Next.js (Pages) con login/register/dashboard e CRUD Persona
- [x] Aggiunta campo `telefono` al modello Persona e aggiornamento dei form
- [x] DB seed e script `init_db.py` (dev-only)
- [x] E2E test base per register/login/GET persone
- [x] Correzioni UI: navbar, dashboard, PersonCard, PersonForm

---

## 1) Obiettivo iniziale
Realizzare una webapp minimale: Next.js (frontend) + FastAPI (backend) + SQLite (dev) con:
- Autenticazione (register/login)
- CRUD su risorsa `Persona` (campi pubblici: `nome`, `cognome`, `email`, `telefono`)
- Dashboard protetta con lista persone e operazioni CRUD

## 2) Timeline e passaggi principali (cronologia sintetica)
1. Project scaffolding e roadmap: definito stack e wireframe delle feature.
2. Backend: implementati `models.py`, CRUD endpoints e autenticazione JWT.
3. Seed DB: creato `init_db.py` per creare tabelle e popolazione iniziale (admin + persone di esempio).
4. Frontend scaffolding: Next.js pages + componenti (`Navbar`, `PersonCard`, `PersonForm`, hook `useAuth`, servizio `personService.js`).
5. Wiring auth: login/register collegati al backend; token salvato in `localStorage` (dev).
6. Protezione rotte: `ProtectedRoute` componente per bloccare pagine se non autenticati.
7. UI iterazioni: rimozione campi `foto` e `indirizzo`, aggiunta `telefono`, vari miglioramenti di stile (header grid, card design, hero dashboard).
8. Database schema change: aggiunto `telefono` a `Persona` → seed fallisce → eliminato `backend/db.sqlite` e rieseguito `init_db.py` per ricreare schema e seed.
9. E2E test: creazione ed esecuzione di `backend/tests/test_auth_flow.py` che registra un utente, effettua login e richiede `/persone` (test passato).
10. Refactor: risolti problemi di redirect dovuti a race nella lettura del token client-side (`useAuth.js` aggiornato per leggere token sincrono nello stato iniziale).
11. Aggiunte funzionalità: search in dashboard, Edit/Delete accanto alle card, conferme (uso `confirm()`), refresh lista dopo delete.

## 3) Stack tecnologico
- Backend: Python, FastAPI, SQLModel, SQLite, python-jose (JWT), passlib (bcrypt)
- Frontend: Next.js (Pages router), React, fetch API, minimal CSS in `frontend/styles/globals.css`
- Testing: script Python con `requests` (test E2E semplice)
- Dev tooling: uvicorn per backend, npm/next per frontend

## 4) File chiave (creati/modificati) e loro scopo
- backend/
  - `models.py` — definizioni `Persona` e `User` (ora `telefono` presente)
  - `init_db.py` — crea DB e seed di esempio
  - `auth.py` / `main.py` — endpoints auth e API
  - `crud.py` — logica CRUD (usata dai router)
  - `tests/test_auth_flow.py` — test E2E register/login/persone
- frontend/
  - `pages/login.jsx`, `pages/register.jsx`, `pages/dashboard.jsx`, `pages/index.jsx`
  - `pages/persone/new.jsx`, `pages/persone/[id].jsx` — create/edit/view persona
  - `components/Navbar.jsx`, `components/PersonCard.jsx`, `components/PersonForm.jsx`
  - `hooks/useAuth.js` — gestione token e helper auth (login/logout/getAuthHeader)
  - `hooks/ProtectedRoute.jsx` — wrapper per proteggere pagine
  - `services/personService.js` — API wrapper per auth e persone
  - `styles/globals.css` — stili globali (header grid, person-card, search-input)

## 5) Comportamenti e decisioni implementative
- Token JWT memorizzato in `localStorage` (soluzione di sviluppo). Nota: in produzione preferire cookie HttpOnly.
- `ProtectedRoute` esegue redirect a `/login` se `auth.isAuthenticated()` è false; questo causava in precedenza un redirect involontario al montaggio a causa della lettura asincrona del token lato client. Risolto leggendo il token sincrono nello state iniziale di `useAuth`.
- DB: non sono presenti migrazioni (Alembic) — cambi schema richiedono cancellazione manuale del file `db.sqlite` e riesecuzione di `init_db.py` in dev.
- Delete usa `confirm()` per conferma; può essere migliorato con un modal custom.

## 6) Comandi eseguiti frequentemente / utili
- Eseguire backend in dev:

```powershell
cd backend; uvicorn main:app --reload
```

- Inizializzare (dev) DB e seed:

```powershell
cd backend; python init_db.py
```

- Eseguire E2E test (dev):

```powershell
cd backend; python -m pytest tests/test_auth_flow.py
# oppure
python tests/test_auth_flow.py
```

- Eseguire frontend (dev):

```powershell
cd frontend; npm install; npm run dev
```

## 7) Problemi incontrati e risoluzioni
- Problema: `init_db.py` falliva con "table persona has no column named telefono" dopo aver aggiunto `telefono`.
  - Soluzione: eliminare `backend/db.sqlite` e rieseguire `init_db.py` per creare nuovo schema con `telefono`.

- Problema: clic su "Modifica" reindirizzava al login.
  - Diagnosi: `ProtectedRoute` vedeva token non ancora caricato dallo useEffect in `useAuth` e reindirizzava prematuramente.
  - Soluzione: aggiornato `useAuth.js` per leggere token sincrono nello stato iniziale (useState(() => localStorage.getItem(...))).

- Nota: alcune esecuzioni del dev server nel contesto di editing sono state cancellate/terminate; verificare che `uvicorn` e Next siano in esecuzione sul tuo ambiente locale.

## 8) Test eseguiti e risultati
- `backend/tests/test_auth_flow.py` — test E2E che:
  - registra un utente temporaneo,
  - effettua login e riceve token,
  - GET `/persone` con token e controlla risultato.
  - Risultato: test passato durante sessione di sviluppo.

## 9) Stato attuale e punti da completare prima del deploy
- Da completare (priorità alta):
  - Migrare storage token da `localStorage` a cookie HttpOnly (backend + frontend changes).
  - Aggiungere migrazioni DB (Alembic) per non dover ricreare `db.sqlite` manualmente.
  - Implementare role-based authorization (owner/admin) per proteggere operazioni di update/delete.
  - Sostituire `confirm()` con modal più curato e accessibile.
  - Configurare `.env` e togliere segreti hardcoded (JWT_SECRET) e documentare variabili.
- Migliorie consigliate (medium priority):
  - CI pipeline (lint + tests), Dockerfile + docker-compose, HTTPS/CORS configurati, logging e monitoring.

## 10) Next steps rapidi (posso fare ora)
- Pulire warning in `frontend/hooks/useAuth.js` (rimuovere import `useEffect` inutilizzato). — pronto da applicare.
- Sostituire `window.location.href` con `router.push()` in `dashboard.jsx` per navigazione client-side. — pronto da applicare.
- Implementare modal di conferma eliminazione e sostituire `confirm()`. — richiede più tempo.

---

Se vuoi, posso: applicare subito le pulizie (warning) e la sostituzione di `window.location.href` (opzione consigliata), oppure iniziare a convertire l'autenticazione a cookie HttpOnly (più invasiva). Dimmi quale preferisci e lo eseguo ora.

# Roadmap per la webapp (Next.js JSX + FastAPI + SQLite)

Ricevuto — creo qui la roadmap richiesta. Di seguito trovi una checklist visibile, il contratto tecnico minimale, i principali edge case, la roadmap divisa in fasi con deliverable e criteri di qualità, e i passi successivi suggeriti.

## Checklist dei requisiti (visibile)
- [ ] Home page pubblica con testo es.: "tutorial di utilizzo di vscode + copilot per la realizzazione di una webapp next.js"
- [ ] Login / autenticazione per area riservata
- [ ] Pagina privata accessibile solo dopo login
- [ ] Pagina privata mostra elenco clickabile di persone prese da tabella DB
 - [ ] Dettaglio persona (READ): nome, cognome, email, indirizzo
- [ ] Operazioni CRUD complete (Create, Read, Update, Delete)
- [ ] Stack: SQLite, FastAPI, Next.js (JSX)
- [ ] Architettura MVC
- [ ] Frontend modulare in componenti e stile moderno

---

## Contratto tecnico (minimale)
- Input: richieste HTTP JSON dal frontend (login, CRUD persone).
- Output: risposte JSON RESTful dal backend e pagine Next.js renderizzate.
- Shape (Persona):
  - id: int
  - nome: string
  - cognome: string
  - email: string
  - indirizzo: string
  
- Error modes:
  - 400: validazione
  - 401: non autorizzato
  - 404: non trovato
  - 500: errore server
- Success criteria: API CRUD funzionanti + protezione rotta privata + frontend che mostra elenco e dettaglio con navigazione.

## Edge cases principali
- Token scaduti / utenze multiple -> 401 e redirect a login
- Validazione email errata
- Operazioni su id inesistenti -> 404
- Contesa su SQLite (uso connection per-request)
- XSS/CSRF lato frontend -> sanitizzazione input + usare Authorization header (Bearer)
- Assenza di file di configurazione in produzione

---

## Roadmap sintetica (fasi, attività, deliverable)

### Fase 0 — Setup iniziale (0.5–1 giorno)
- Deliverable: repository con due cartelle `frontend/` e `backend/`.
- Attività:
  - Inizializza Next.js (JSX) in `frontend/`.
  - Crea ambiente Python + FastAPI in `backend/`.
  - Aggiungi `requirements.txt`, `package.json`, `README.md`.
  - Script `init_db.py` per creare `db.sqlite` e tabelle.
- Nota: requisito minimo Node 18+ e Python 3.10+.

### Fase 1 — Modello e DB (0.5–1 giorno)
- Deliverable: `db.sqlite`, modello Persona, script di init.
- Attività:
  - Definire modello Persona.
  - Usare SQLModel (consigliato) o SQLAlchemy + Pydantic.
  - Script che crea la tabella e opzionalmente seed con 5 persone.

### Fase 2 — Backend API (1–2 giorni)
- Deliverable: API RESTful protetta con JWT.
- Endpoints:
  - POST /auth/login -> ritorna JWT
  - GET /persone -> lista (protetto)
  - GET /persone/{id} -> dettaglio (protetto)
  - POST /persone -> crea (protetto)
  - PUT /persone/{id} -> aggiorna (protetto)
  - DELETE /persone/{id} -> elimina (protetto)
- Attività:
  - Validazione con Pydantic, gestione CORS per Next.js.
  - Password hashing (bcrypt) se si gestiscono utenti.
  - Test minimi con `pytest`.

### Fase 3 — Frontend Next.js (2–3 giorni)
- Deliverable: app Next.js in JSX con componenti e routing protetto.
- Pagine principali:
  - `/` Home pubblica con il testo tutorial richiesto.
  - `/login` Form di login; salvataggio token (cookie HttpOnly consigliato).
  - `/dashboard` Pagina privata con elenco persone (fetch dall'API).
  - `/persone/[id]` Dettaglio persona, edit, delete.
  - `/persone/new` Form per creare nuova persona.
- Componenti riutilizzabili suggeriti:
  - `Navbar`, `PersonCard`, `PersonForm`, `ListaPersone`, `ProtectedRoute` (hook/HOC).
- Styling: suggerito Tailwind CSS (veloce e moderno) o Material UI.
- Architettura MVC mapping:
  - Model: chiamate API + tipi in `lib/models`.
  - View: componenti JSX nelle `pages` / `app`.
  - Controller: hooks custom o file `controllers` che orchestrano fetch/stato.

### Fase 4 — Integrazione e test (0.5–1 giorno)
- Deliverable: app integrata e testata localmente.
- Attività:
  - E2E: crea persona -> lista -> dettaglio -> edit -> delete.
  - Test autenticazione e redirect pagine non autorizzate.
  - Fix CORS, gestione errori UI.

### Fase 5 — Qualità e deploy (0.5–1 giorno)
- Deliverable: README con istruzioni, script di avvio e note di deploy.
- Attività:
  - Linting (ESLint per frontend, black/flake8 per backend).
  - CI minimale (GitHub Actions) per test/build.
  - Deploy consigliati:
    - Frontend: Vercel (Next.js)
    - Backend: Render / Fly / Railway / Heroku (FastAPI)
    - Alternativa: Docker Compose per deploy integrato.
- Nota: considerare passaggio a PostgreSQL in produzione (SQLite non ideale per concorrenza alta).

---

## Criteri di qualità / quality gates
- Build: frontend `npm run build` passa; backend avviabile con `uvicorn main:app --reload`.
- Lint/Typecheck: ESLint + mypy/flake8 o black.
- Tests: pytest (backend), React Testing Library (frontend).
- Smoke test: login -> dashboard -> CRUD -> logout.

## Piccoli extra consigliati
- Paginazione e ricerca per elenco persone.
- SSR/SSG per la home pubblica.
- Logging e audit delle operazioni.
- Seed DB con 5 persone per sviluppo.

## Stime (indicative)
- Setup + DB + API base: ~2 giorni
- Frontend CRUD + auth: ~2–3 giorni
- Test + integrazione + deploy: ~1 giorno
- Totale stimato: 5–6 giorni lavorativi (1 dev full-time)

---

## Comandi utili (PowerShell) — setup rapido di sviluppo

```powershell
# Frontend: crea app Next.js (JSX)
npx create-next-app@latest frontend --use-npm
cd frontend
npm install tailwindcss@latest postcss@latest autoprefixer@latest -D
npx tailwindcss init -p

# Backend: crea virtualenv e installa dipendenze
cd ..\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install fastapi uvicorn sqlmodel[sqlite] python-jose[bcrypt] pydantic
# salva le dipendenze
pip freeze > requirements.txt

# Avvio durante lo sviluppo
# Backend
uvicorn main:app --reload
# Frontend
cd ..\frontend
npm run dev
```

---


## Passi per implementare la webapp

Di seguito trovi i passi operativi, eseguibili in ordine, divisi per fase. Ogni passo include i comandi essenziali (PowerShell) e suggerimenti veloci per verificare il risultato.

### Checklist rapida di partenza
- Assicurati di avere: Node 18+, Python 3.10+, Git installato.
- Crea la cartella di lavoro e inizializza git.

1) Preparazione repository e cartelle (5–15 min)
  - Crea struttura:

```powershell
mkdir frontend; mkdir backend
git init
```

2) Inizializza frontend Next.js (15–30 min)
  - Comandi:

```powershell
cd frontend
npx create-next-app@latest . --use-npm --eslint
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
  - Verifica: `npm run dev` e apri http://localhost:3000
  - Crea le pagine iniziali: `pages/index.jsx`, `pages/login.jsx`, `pages/dashboard.jsx`, `pages/persone/[id].jsx`, `pages/persone/new.jsx`.

3) Inizializza backend FastAPI + SQLite (10–20 min)
  - Comandi (PowerShell):

```powershell
cd ..\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install fastapi uvicorn sqlmodel[sqlite] python-jose[bcrypt] pydantic
pip freeze > requirements.txt
```
  - Crea file `main.py`, `models.py`, `crud.py`, `auth.py`, `init_db.py`.
  - Verifica: `uvicorn main:app --reload` e visita http://127.0.0.1:8000/docs

4) Creare modello Persona e script di inizializzazione DB (15–30 min)
  - File `models.py` (es. con SQLModel) con campi: `id, nome, cognome, email, indirizzo`.
  - `init_db.py` che crea `db.sqlite` e aggiunge 3–5 record di esempio.
  - Esegui: `python init_db.py` e verifica che `db.sqlite` sia creato.

5) Implementare autenticazione semplice con JWT (1–2 ore)
  - `auth.py`: endpoint `POST /auth/login` che ritorna JWT.
  - Implementa hashing password (bcrypt) se gestisci utenti nel DB.
  - Proteggi le API `/persone` con dipendenza che verifica il token.
  - Test: chiamare `/auth/login` e poi `/persone` con header `Authorization: Bearer <token>`.

6) CRUD API per Persona (2–4 ore)
  - Endpoint: GET /persone, GET /persone/{id}, POST /persone, PUT /persone/{id}, DELETE /persone/{id}.
  - Usa Pydantic per validazione dei payload.
  - Aggiungi CORS per permettere fetch dal frontend: `fastapi.middleware.cors.CORSMiddleware`.

7) Frontend: integrazione e componenti (4–8 ore)
  - Implementa componenti: `components/Navbar.jsx`, `components/PersonCard.jsx`, `components/PersonForm.jsx`, `hooks/useAuth.js`.
  - Login: invia credenziali a `/auth/login`, salva token (consiglio cookie HttpOnly; per prototipi può andare localStorage).
  - Dashboard: fetch a `/persone` e mostra lista clickabile.
  - Pagina dettaglio: fetch GET /persone/{id}, mostra i campi e form per edit/delete.

8) Protezione rotte client e UX (1–2 ore)
  - Implementa redirect a `/login` se non autenticato.
  - Gestisci errori 401 ritornati dalle API per forzare logout/redirect.

9) Tests e quality gates (2–4 ore)
  - Backend: scrivi test pytest per gli endpoint principali (auth + CRUD).
  - Frontend: test di rendering con React Testing Library per componenti chiave.
  - Lint: ESLint per frontend, black/flake8 per backend.

10) Integrazione finale e smoke test (1–2 ore)
  - Workflow di verifica: avvia backend e frontend; esegui flusso completo: login -> dashboard -> crea persona -> visualizza -> modifica -> cancella -> logout.
  - Risolvi eventuali bug e edge-case riscontrati.

11) Deployment (variabile)
  - Frontend: deploy su Vercel (autodeploy da GitHub branch).
  - Backend: deploy su Render / Fly / Railway; ricordati di usare un DB più robusto in produzione (Postgres consigliato).
  - Se preferisci containerizzare: crea `Dockerfile` per frontend e backend e `docker-compose.yml` per orchestrare.

### Piccoli task opzionali utili
- Aggiungere paginazione e ricerca nelle API GET /persone.
- Implementare form validation lato client con `react-hook-form`.
- Aggiungere logging semplice con `loguru` o `logging` in backend.

---

Se vuoi, eseguo ora lo step 1 (creo le cartelle e inizializzo git) o direttamente lo scaffold completo del backend o del frontend — dimmi quale preferisci (1=crea cartelle+git, 2=scaffold backend, 3=scaffold frontend) e procedo immediatamente.

RUNNING THE PROJECT (development)

This document explains how to clone the repository and run the backend (FastAPI) and frontend (Next.js) locally on a Windows machine using PowerShell.

Prerequisites
- Git
- Node.js (16+)
- npm (comes with Node)
- Python 3.10+ and pip

Recommended versions: Node 16/18, Python 3.10/3.11

1) Clone the repo

Open PowerShell and run:

```powershell
git clone <REPO_URL> web_copilot
cd web_copilot
```

2) Backend setup (Python / FastAPI)

Create and activate a virtual environment, install dependencies, initialize the database:

```powershell
# from repository root
cd backend
python -m venv .venv
# activate venv (PowerShell)
.\.venv\Scripts\Activate.ps1

# If a requirements file exists, install from it
if (Test-Path requirements.txt) { pip install -r requirements.txt } else { pip install fastapi uvicorn sqlmodel python-jose[cryptography] passlib[bcrypt] requests }

# Initialize the development DB and seed sample data
python init_db.py
```

Notes:
- `init_db.py` will create `backend/db.sqlite` (dev-only). If you change models, you may need to delete `backend/db.sqlite` and run `python init_db.py` again. Use migrations (Alembic) for production.
- Useful environment variables (optional):
  - JWT_SECRET (if present the backend will use it; otherwise a default dev key may be used)
  - DATABASE_URL (if you want to point to a different DB)

Run the backend server (from `backend`):

```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

API will be available at: http://127.0.0.1:8000

3) Frontend setup (Next.js)

Open a new PowerShell tab/window and run:

```powershell
cd frontend
npm install
npm run dev
```

The frontend dev server will typically be available at: http://localhost:3000

4) Running the E2E test (quick smoke)

From a PowerShell window with the backend running:

```powershell
cd backend
# run the included test script (simple requests-based test)
python tests/test_auth_flow.py
# or via pytest
python -m pytest tests/test_auth_flow.py
```

5) Common issues & troubleshooting
- "Address already in use" when starting backend: stop any process using port 8000 (or change port with `--port`) and retry.
- After schema changes (new fields added to Persona), if `init_db.py` fails with sqlite errors, delete `backend/db.sqlite` and re-run `python init_db.py` (dev-only).
- If frontend cannot reach backend due to CORS, ensure backend is running on 127.0.0.1:8000 and check CORS settings in `backend/main.py`.

6) Development notes / security
- Currently the app stores JWT tokens in `localStorage` for development. For production, switch to HttpOnly cookies to mitigate XSS risks.
- Do not commit `.env` or secret keys. Use environment variables or a secret manager.
- Add Alembic (or similar) for DB migrations before stabilizing schema.

7) How to stop
- Backend: Ctrl+C in the uvicorn terminal
- Frontend: Ctrl+C in the npm dev terminal

8) Optional: Docker (suggested)
- You can create a `Dockerfile` for backend and frontend and a `docker-compose.yml` to orchestrate the services and a persistent DB for easier testing.

If you want, I can:
- add a `requirements.txt` and `package.json` sanity check script,
- create a `docker-compose.yml` for quick dev setup,
- or change the auth to use HttpOnly cookies (requires backend + frontend edits).


---
Generated on: 2025-09-04

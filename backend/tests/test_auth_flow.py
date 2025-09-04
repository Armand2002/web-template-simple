#!/usr/bin/env python3
"""
Semplice test E2E per registrazione + login contro il backend FastAPI locale.
Usa la libreria `requests`.
Esegue:
 - POST /auth/register
 - POST /auth/login
 - GET /persone con Authorization: Bearer <token>

Exit code 0 = success, 1 = fallimento.
"""
import sys
import uuid
import json

try:
    import requests
except ImportError:
    print("Questo test richiede la libreria 'requests'. Installa con: pip install requests", file=sys.stderr)
    sys.exit(2)

BASE = 'http://127.0.0.1:8000'


def fail(msg, resp=None):
    print('FAIL:', msg)
    if resp is not None:
        try:
            print('Response status:', resp.status_code)
            print('Response body:', resp.text)
        except Exception:
            pass
    sys.exit(1)


def main():
    random = uuid.uuid4().hex[:8]
    email = f'e2e+{random}@example.com'
    password = 'testpass123'

    print('Test registration/login E2E')
    print('Using email:', email)

    # Register
    url_reg = f'{BASE}/auth/register'
    print('POST', url_reg)
    try:
        r = requests.post(url_reg, json={'email': email, 'password': password})
    except Exception as e:
        fail(f'Errore connessione durante register: {e}')

    if r.status_code != 200:
        fail('Register non riuscita', r)

    try:
        data = r.json()
    except Exception:
        fail('Register ha risposto con body non JSON', r)

    token = data.get('access_token')
    if not token:
        fail('Register non ha restituito access_token', r)

    print('Register OK, token ottenuto (len):', len(token))

    # Login
    url_login = f'{BASE}/auth/login'
    print('POST', url_login)
    try:
        r2 = requests.post(url_login, json={'email': email, 'password': password})
    except Exception as e:
        fail(f'Errore connessione durante login: {e}')

    if r2.status_code != 200:
        fail('Login non riuscito', r2)

    try:
        data2 = r2.json()
    except Exception:
        fail('Login ha risposto con body non JSON', r2)

    token2 = data2.get('access_token')
    if not token2:
        fail('Login non ha restituito access_token', r2)

    print('Login OK, token ottenuto (len):', len(token2))

    # Access protected resource
    url_persone = f'{BASE}/persone'
    print('GET', url_persone)
    headers = {'Authorization': f'Bearer {token2}'}
    try:
        r3 = requests.get(url_persone, headers=headers)
    except Exception as e:
        fail(f'Errore connessione durante GET /persone: {e}')

    if r3.status_code != 200:
        fail('GET /persone ha fallito', r3)

    try:
        list_data = r3.json()
    except Exception:
        fail('/persone ha risposto con body non JSON', r3)

    # basic shape check
    if not isinstance(list_data, (list, dict)):
        # SQLModel may return list or paginated format; accept either
        fail('/persone returned unexpected type', r3)

    print('GET /persone OK, elemento di esempio:', json.dumps(list_data[:1], indent=2, ensure_ascii=False) if isinstance(list_data, list) and list_data else str(list_data))

    print('\nE2E test passed')
    sys.exit(0)


if __name__ == '__main__':
    main()

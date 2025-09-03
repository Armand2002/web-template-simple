# main.py
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
import os
from auth import router as auth_router
from sqlmodel import Session, select, create_engine
from models import Persona

app = FastAPI()

# CORS per sviluppo locale con Next.js
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

SECRET_KEY = os.environ.get("JWT_SECRET", "supersecret")
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
db_url = "sqlite:///db.sqlite"
engine = create_engine(db_url)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token non valido")
        return email
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token non valido")

@app.get("/")
def read_root():
    return {"msg": "Backend FastAPI pronto!"}


# GET /persone (già presente)
@app.get("/persone", dependencies=[Depends(get_current_user)])
def get_persone():
    with Session(engine) as session:
        persone = session.exec(select(Persona)).all()
        return persone

# GET /persone/{id}
@app.get("/persone/{id}", dependencies=[Depends(get_current_user)])
def get_persona(id: int):
    with Session(engine) as session:
        persona = session.get(Persona, id)
        if not persona:
            raise HTTPException(status_code=404, detail="Persona non trovata")
        return persona

# POST /persone
@app.post("/persone", dependencies=[Depends(get_current_user)])
def create_persona(persona: Persona):
    with Session(engine) as session:
        session.add(persona)
        session.commit()
        session.refresh(persona)
        return persona

# PUT /persone/{id}
@app.put("/persone/{id}", dependencies=[Depends(get_current_user)])
def update_persona(id: int, data: dict):
    with Session(engine) as session:
        persona = session.get(Persona, id)
        if not persona:
            raise HTTPException(status_code=404, detail="Persona non trovata")
        for key, value in data.items():
            if hasattr(persona, key):
                setattr(persona, key, value)
        session.commit()
        session.refresh(persona)
        return persona

# DELETE /persone/{id}
@app.delete("/persone/{id}", dependencies=[Depends(get_current_user)])
def delete_persona(id: int):
    with Session(engine) as session:
        persona = session.get(Persona, id)
        if not persona:
            raise HTTPException(status_code=404, detail="Persona non trovata")
        session.delete(persona)
        session.commit()
        return {"msg": "Persona eliminata"}

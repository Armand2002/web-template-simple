# auth.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlmodel import Session, select, create_engine
from models import User
from passlib.context import CryptContext
from jose import jwt
import os

router = APIRouter()

SECRET_KEY = os.environ.get("JWT_SECRET", "supersecret")
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
db_url = "sqlite:///db.sqlite"
engine = create_engine(db_url)

class LoginRequest(BaseModel):
    email: str
    password: str

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/auth/login")
def login(data: LoginRequest):
    with Session(engine) as session:
        user = session.exec(select(User).where(User.email == data.email)).first()
        if not user or not verify_password(data.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Credenziali non valide")
        token = create_access_token({"sub": user.email})
        return {"access_token": token, "token_type": "bearer"}

# models.py
from sqlmodel import SQLModel, Field

class Persona(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    nome: str
    cognome: str
    email: str
    indirizzo: str

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str
    hashed_password: str

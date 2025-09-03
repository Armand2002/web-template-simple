# init_db.py
from sqlmodel import SQLModel, Session, create_engine
from models import Persona, User

db_url = "sqlite:///db.sqlite"
engine = create_engine(db_url)

SQLModel.metadata.create_all(engine)

# Seed con 3 persone
persone_seed = [
    Persona(nome="Mario", cognome="Rossi", email="mario.rossi@email.it", indirizzo="Via Roma 1"),
    Persona(nome="Luca", cognome="Bianchi", email="luca.bianchi@email.it", indirizzo="Via Milano 2"),
    Persona(nome="Anna", cognome="Verdi", email="anna.verdi@email.it", indirizzo="Via Napoli 3"),
]

# Seed utente admin
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
admin_user = User(email="admin@email.it", hashed_password=pwd_context.hash("admin123"))

with Session(engine) as session:
    for p in persone_seed:
        session.add(p)
    session.add(admin_user)
    session.commit()

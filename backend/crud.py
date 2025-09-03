# crud.py
from sqlmodel import Session, select
from models import Persona

def get_persone(session: Session):
    return session.exec(select(Persona)).all()

def get_persona(session: Session, persona_id: int):
    return session.get(Persona, persona_id)

def create_persona(session: Session, persona: Persona):
    session.add(persona)
    session.commit()
    session.refresh(persona)
    return persona

def update_persona(session: Session, persona_id: int, data: dict):
    persona = session.get(Persona, persona_id)
    if not persona:
        return None
    for key, value in data.items():
        setattr(persona, key, value)
    session.commit()
    session.refresh(persona)
    return persona

def delete_persona(session: Session, persona_id: int):
    persona = session.get(Persona, persona_id)
    if not persona:
        return None
    session.delete(persona)
    session.commit()
    return persona

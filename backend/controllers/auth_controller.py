
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from passlib.context import CryptContext
from models.auth_model import User
from sqlalchemy import text

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

async def get_user_by_email(email: str, db: AsyncSession):
    result = await db.execute(text("SELECT * FROM users WHERE email = :email"), {'email': email})
    return result.fetchone()

async def create_user(email: str, password: str, db: AsyncSession):
    existing_user = await get_user_by_email(email, db)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = hash_password(password)
    
    new_user = User(email=email, hashed_password=hashed_password) 
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return new_user

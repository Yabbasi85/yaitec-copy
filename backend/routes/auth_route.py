from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from controllers.auth_controller import create_user
from database.db import get_db

router = APIRouter()

class UserCreate(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    new_user = await create_user(user.email, user.password, db)
    return {"message": "User registered successfully", "user_id": new_user.id}
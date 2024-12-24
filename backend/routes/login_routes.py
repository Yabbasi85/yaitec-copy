from sqlalchemy import text
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from controllers.login_controller import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token, verify_password
from database.db import get_db
from datetime import timedelta
from models.login import Login

router = APIRouter()

@router.post("/login")
async def login(user_data: Login, db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("SELECT * FROM users WHERE email = :email"), {'email': user_data.email})
    user = result.fetchone()

    if not user:
        raise HTTPException(status_code=400, detail="Invalid email or password")

    if not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer"}

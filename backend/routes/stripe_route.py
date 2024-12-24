from fastapi import APIRouter, Request, Depends, HTTPException
from controllers.stripe_controller import StripeController
from models.stripe_model import CheckoutSession
from sqlalchemy.ext.asyncio import AsyncSession
from database.db import get_db

router = APIRouter()

# Endpoint para criar sessão de checkout no Stripe
@router.post("/create-checkout-session/")
async def create_checkout_session(session_data: CheckoutSession, db: AsyncSession = Depends(get_db)):
    user_email = session_data.email
    password = session_data.password  
    session = await StripeController.create_checkout_session(session_data, user_email, password, db)
    return {"sessionId": session.id}

# Endpoint para lidar com o webhook do Stripe
@router.post("/webhook/")
async def stripe_webhook(request: Request, db: AsyncSession = Depends(get_db)):
    # Passa o request e a sessão do banco para o controlador
    return await StripeController.handle_webhook(request, db)

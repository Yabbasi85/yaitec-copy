from fastapi import APIRouter, HTTPException, Depends
from google.oauth2 import id_token
from google.auth.transport import requests
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from database.db import get_db
from controllers.login_controller import create_access_token
import os
import stripe


stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
router = APIRouter()
GOOGLE_CLIENT_ID = "836199087703-jktkff373784579rbd48hdacpic8ocq5.apps.googleusercontent.com"

@router.post("/auth/google")
async def google_login(token: str, db: AsyncSession = Depends(get_db)):
    try:
        id_info = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        
        email = id_info.get('email')

        result = await db.execute(text("SELECT * FROM users WHERE email = :email"), {'email': email})
        user = result.fetchone()

        if not user:
            raise HTTPException(status_code=400, detail="User not found")

        access_token = create_access_token(data={"sub": user.email})

        return {"status": "success", "user_id": user.id, "access_token": access_token}
    
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Google token")

@router.post("/auth/google-register")
async def google_register(
    token: str,
    plan: str = None,  # `plan` é opcional
    db: AsyncSession = Depends(get_db)
):
    """
    Registra um usuário via Google OAuth e, opcionalmente, cria uma sessão de checkout do Stripe se um plano for fornecido.
    """
    try:
        # Verificar o token do Google OAuth
        id_info = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        email = id_info.get('email')

        if not email:
            raise HTTPException(status_code=400, detail="Email não encontrado no token")

        # Verificar se o usuário já existe
        result = await db.execute(text("SELECT * FROM users WHERE email = :email"), {'email': email})
        user = result.fetchone()

        if user:
            raise HTTPException(status_code=400, detail="Email já registrado")

        # Se um plano for fornecido, criar a sessão de checkout do Stripe
        if plan:
            try:
                checkout_session = stripe.checkout.Session.create(
                    payment_method_types=['card'],
                    line_items=[
                        {
                            'price': plan,  # ID do preço do Stripe
                            'quantity': 1,
                        },
                    ],
                    mode='subscription',
                    customer_email=email,  # Associa o e-mail ao cliente no Stripe
                    success_url=f'http://localhost:5173/login',
                    cancel_url=f'http://localhost:5173/cancel',
                )
            except stripe.error.StripeError as e:
                raise HTTPException(status_code=400, detail=f"Erro ao criar sessão do Stripe: {str(e)}")

            # Inserir o e-mail no banco de dados após criar a sessão
            await db.execute(text("""
                INSERT INTO users (email)
                VALUES (:email)
            """), {'email': email})
            await db.commit()

            # Retornar a URL da sessão de checkout
            return {"checkout_session_url": checkout_session.url}
        else:
            # Se nenhum plano for fornecido, apenas registrar o usuário no banco de dados
            await db.execute(text("""
                INSERT INTO users (email)
                VALUES (:email)
            """), {'email': email})
            await db.commit()

            return {"message": "Usuário registrado com sucesso sem plano."}

    except ValueError:
        raise HTTPException(status_code=400, detail="Token do Google inválido ou expirado")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



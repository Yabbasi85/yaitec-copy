from sqlalchemy import text
import stripe
import os
from fastapi import HTTPException, Request
from controllers.auth_controller import get_user_by_email
from models.auth_model import User
from models.stripe_model import CheckoutSession
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext

# Configuração do Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

# Criptografia de senha
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

class StripeController:

    @staticmethod
    async def create_checkout_session(session_data: CheckoutSession, user_email: str, password: str, db: AsyncSession):
        """
        Cria uma sessão de checkout do Stripe e armazena email e senha nos metadados.
        """
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[{
                    'price': session_data.price_id,
                    'quantity': 1
                }],
                mode='subscription',
                success_url=f'http://localhost:5173/success?session_id={{CHECKOUT_SESSION_ID}}',
                cancel_url=f'http://localhost:5173/cancel',
                metadata={'user_email': user_email, 'password': password}
            )


            hashed = hash_password(password)

            if session:
               await db.execute(text("""
                INSERT INTO users (email, hashed_password)
                VALUES (:email, :hashed_password)
              """), {'email': user_email, 'hashed_password': hashed}) 

            await db.commit()

            return session
        except Exception as e:
            raise HTTPException(status_code=400, detail=str(e))


    @staticmethod
    async def handle_webhook(request: Request, db: AsyncSession):
        """
        Trata o webhook do Stripe e ativa o usuário após o pagamento ser confirmado.
        """
        payload = await request.body()  # Captura o payload do Stripe
        sig_header = request.headers.get("stripe-signature")  # Captura a assinatura do Stripe

        try:
            # Verifica o evento usando o secret do webhook para garantir que ele é legítimo
            event = stripe.Webhook.construct_event(
                payload, sig_header, os.getenv("STRIPE_WEBHOOK_SECRET")
            )
        except ValueError:
            # Payload inválido
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError:
            # Assinatura inválida
            raise HTTPException(status_code=400, detail="Invalid signature")

        # Verifica se o evento é do tipo que estamos esperando (pagamento completado)
        if event['type'] == 'checkout.session.completed':
            session = event['data']['object']  # O objeto da sessão de checkout
            user_email = session['metadata']['user_email']
            password = session['metadata']['password']  # Senha enviada pelo usuário
            await StripeController.activate_subscription(user_email, password, db)

        return {"status": "success"}

    @staticmethod
    async def activate_subscription(user_email: str, password: str, db: AsyncSession):
        """
        Ativa a conta do usuário ou cria um novo usuário com a senha fornecida.
        """
        # Verifica se o usuário já existe no banco de dados
        user = await get_user_by_email(user_email, db)
        
        if not user:
            # Se o usuário não existir, cria um novo com a senha fornecida
            hashed_password = hash_password(password)
            new_user = User(email=user_email, hashed_password=hashed_password)  
            db.add(new_user)
            await db.commit()
            await db.refresh(new_user)

        return user

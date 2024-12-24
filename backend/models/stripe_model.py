from pydantic import BaseModel

class CheckoutSession(BaseModel):
    price_id: str
    quantity: int = 1
    email: str
    password: str

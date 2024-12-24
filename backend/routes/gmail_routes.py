from fastapi import APIRouter
from controllers.gmail_controller import send_email, summarize_emails

router = APIRouter()

# Rota para enviar email usando o agente Composio
@router.post("/send-email")
def send_email_route():
    result = send_email()
    return {"message": "Email sent successfully", "details": result}

# Rota para sumarizar os últimos 10 emails usando o agente Composio
@router.get("/summarize-emails")
def summarize_emails_route():
    result = summarize_emails()
    return {"summary": result}

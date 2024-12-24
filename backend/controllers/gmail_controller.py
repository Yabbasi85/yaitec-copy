from services.composio_agent import send_email_env, summarize_last_10_emails


# Função para enviar email com o agente Composio
def send_email():
    result = send_email_env()
    return result

# Função para sumarizar os 10 últimos emails com o agente Composio
def summarize_emails():
    result = summarize_last_10_emails()
    return result

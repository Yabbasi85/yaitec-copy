from composio_openai import ComposioToolSet, Action
from openai import OpenAI

# Initial configuration
composio_api_key = "ipy1dwwmnhkd2yvox5umk"
composio_toolset = ComposioToolSet(api_key=composio_api_key)
openai_client = OpenAI()

# Get tools to send email
tools_send = composio_toolset.get_tools(actions=[Action.GMAIL_SEND_EMAIL])

# Get tools to list emails
tools_list = composio_toolset.get_tools(actions=[Action.GMAIL_FETCH_EMAILS])

def send_email_env():
    # Task to send an email to Ygor
    task = "Send an email to ygorbalves@222@gmail.com with subject 'Teste do Composio' and body 'Este é um e-mail de teste enviado pelo Composio AI Agent.'"
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4-turbo-preview",
            tools=tools_send,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that sends emails using Gmail."},
                {"role": "user", "content": task},
            ],
        )
        result = composio_toolset.handle_tool_calls(response)
        return result
    except Exception as e:
        print(f"Error in send_email_env: {e}")
        return None

def summarize_last_10_emails():
    # Task to summarize the last 10 emails from Gmail
    task = "List the last 10 emails in my Gmail inbox and provide a brief summary of each."
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4-turbo-preview",
            tools=tools_list,
            messages=[
                {"role": "system", "content": "You are a helpful assistant that can access and summarize emails from Gmail."},
                {"role": "user", "content": task},
            ],
        )
        result = composio_toolset.handle_tool_calls(response)
        return result
    except Exception as e:
        print(f"Error in summarize_last_10_emails: {e}")
        return None

# app/models/conversation.py
from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class Conversation(BaseModel):
    id: Optional[str] = None
    transcribed_text: str
    generated_text: str
    audio_url: str
    created_at: Optional[datetime] = None

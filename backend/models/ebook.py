from typing import Optional
from pydantic import BaseModel

class Ebook(BaseModel):
    id: Optional[str] = None
    title: str
    theme: str
    category: str
    content: str

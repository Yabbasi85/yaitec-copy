from pydantic import BaseModel
from typing import Optional

class Lead(BaseModel):
    id: Optional[str] = None
    name: str
    email: str
    phone: Optional[str]
    company: Optional[str]
    status: str
    source: Optional[str]
    notes: Optional[str]
    score: int
    temperature: Optional[str]
    suggestions: Optional[str]

class LeadUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    company: Optional[str] = None
    status: Optional[str] = None
    source: Optional[str] = None
    notes: Optional[str] = None
    score: Optional[int] = None
    temperature: Optional[str] = None

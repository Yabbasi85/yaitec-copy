from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class Campaign(BaseModel):
    id: Optional[str] = None
    name: str
    budget: float
    startDate: str
    endDate: str
    content_plan: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        populate_by_name = True
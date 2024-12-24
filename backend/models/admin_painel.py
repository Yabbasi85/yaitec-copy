from datetime import datetime
from typing import Optional
from bson import ObjectId
from pydantic import BaseModel

class DashboardResponse(BaseModel):
    id: str
    name: str
    category: str
    enabled: bool
    created_at: Optional[datetime] = None

    class Config:
        json_encoders = {ObjectId: str}
        from_attributes = True

class DashboardCreate(BaseModel):
    name: str
    category: str
    enabled: bool
    created_at: Optional[datetime] = None
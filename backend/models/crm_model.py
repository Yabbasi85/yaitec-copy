from pydantic import BaseModel
from typing import Optional

class CRMModel(BaseModel):
    id: Optional[str] = None 
    full_name: str
    email: str
    website: Optional[str]
    phone: Optional[str]
    instagram: Optional[str]
    facebook: Optional[str]
    additional_info: Optional[str]
    type: str

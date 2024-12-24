# app/models/content.py
from pydantic import BaseModel
from typing import List, Optional

class ContentCreatorInput(BaseModel):
    competitors_ids: List[str]
    platforms: List[str]
    campaign_duration: int
    posts_per_month: int
    goals: List[str]
    reference_files: Optional[List[str]] = None

class ContentBasicInfo(BaseModel):
    id: str
    content: str
    type: str
    createdAt: str

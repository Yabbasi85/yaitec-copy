from pydantic import BaseModel
from typing import List, Optional
from datetime import date


class NotionProject(BaseModel):
    project_name: str
    business_name: str
    status: str
    team_department: str
    assigned_person: str
    priority: str
    link: Optional[str] = None
    due_date: date
    approved: Optional[bool] = False

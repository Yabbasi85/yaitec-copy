from typing import List, Optional
from pydantic import BaseModel

class BusinessAnalysisInput(BaseModel):
    name: str
    website: str
    social_media: str
    product: str      
    location: str

class BusinessBasicInfo(BaseModel):
    id: str
    name: str
    website: str
    social_media: Optional[str] = None
    product: Optional[str] = None
    location: Optional[str] = None
    competitors: Optional[List[dict]] = []
    competitors_website_data: Optional[List[dict]] = []
    social_media_summary: Optional[List[dict]] = []  
    website_urls: Optional[List[str]] = []
    extracted_social_links: Optional[List[str]] = []   

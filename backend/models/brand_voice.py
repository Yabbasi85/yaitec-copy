from pydantic import BaseModel

class BrandVoiceAnalysisInput(BaseModel):
    name: str
    website: str
    social_media: str

class CompetitorBasicInfo(BaseModel):
    id: str
    name: str
    website: str
    social_media: str
    brand_voice: str
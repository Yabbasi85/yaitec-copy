from typing import List
from pydantic import BaseModel

class ImageGenerationRequest(BaseModel):
    product: str
    brand: str
    element: str
    colors: List[str]
    styles: List[str]
    mockup_type: str
    social_media: str
    post_type: str
    fonts: List[str]

class ImageGenerationResponse(BaseModel):
    image_url: str
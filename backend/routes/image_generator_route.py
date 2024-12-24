# app/routes/image_generator_routes.py
from fastapi import APIRouter
from controllers.image_generator_controller import generate_image
from models.image_generator import ImageGenerationRequest, ImageGenerationResponse


router = APIRouter()

@router.post("/generate-image", response_model=ImageGenerationResponse)
async def generate_image_route(request: ImageGenerationRequest):
    return await generate_image(request)
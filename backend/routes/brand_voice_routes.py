# app/routes/brand_voice_routes.py
from fastapi import APIRouter, HTTPException, Request
from typing import List
from models.brand_voice import BrandVoiceAnalysisInput, CompetitorBasicInfo
from controllers.brand_voice_controller import (
    get_all_competitors,
    analyze_and_save_brand_voices,
    get_brand_voice_by_id,
    delete_competitor,
)
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/")
async def home(request: Request):
    competitors = await get_all_competitors()
    return templates.TemplateResponse("index.html", {"request": request, "competitors": competitors})

@router.get("/competitors", response_model=List[CompetitorBasicInfo])
async def get_competitors_route():
    try:
        competitors = await get_all_competitors()
        return competitors
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/brand_voice_analysis")
async def brand_voice_analysis_endpoint(inputs: List[BrandVoiceAnalysisInput]):
    try:
        result = await analyze_and_save_brand_voices(inputs)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/brand_voice/{competitor_id}")
async def get_brand_voice_endpoint(request: Request, competitor_id: str):
    try:
        brand_voice = await get_brand_voice_by_id(competitor_id)
        if brand_voice:
            competitors = await get_all_competitors()
            return templates.TemplateResponse("index.html", {"request": request, "competitors": competitors, "brand_voice": brand_voice})
        else:
            raise HTTPException(status_code=404, detail="Brand voice not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/competitors/{competitor_id}")
async def delete_competitor_route(competitor_id: str):
    try:
        success = await delete_competitor(competitor_id)
        if success:
            return {"message": f"Competitor with ID {competitor_id} has been successfully deleted."}
        else:
            raise HTTPException(status_code=404, detail=f"Competitor with ID {competitor_id} not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
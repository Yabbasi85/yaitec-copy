# app/routes/brand_voice_routes.py
import traceback
from fastapi import APIRouter, HTTPException, Request
from typing import List
from models.business_voice import BusinessAnalysisInput, BusinessBasicInfo
from controllers.business_controller import (
    get_all_business,
    analyze_and_save_business,
    get_business_analysis_by_id,
    delete_business_analysis,
)
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/")
async def home(request: Request):
    competitors = await get_all_business()
    return templates.TemplateResponse("index.html", {"request": request, "competitors": competitors})

@router.get("/business", response_model=List[BusinessBasicInfo])
async def get_business_route():
    try:
        business = await get_all_business()
        return business
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/business_analysis")
async def business_analysis_endpoint(inputs: List[BusinessAnalysisInput]):
    try:
        result = await analyze_and_save_business(inputs)
        return result
    except Exception as e:
        print(f"An error occurred: {e}")
        traceback.print_exc()  
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/business/{competitor_id}")
async def get_business_endpoint(request: Request, competitor_id: str):
    try:
        business = await get_business_analysis_by_id(competitor_id)
        if business:
            competitors = await get_all_business()
            return templates.TemplateResponse("index.html", {"request": request, "competitors": competitors, "brand_voice": business})
        else:
            raise HTTPException(status_code=404, detail="Brand voice not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/business/{competitor_id}")
async def delete_business_analysis_route(competitor_id: str):
    try:
        success = await delete_business_analysis(competitor_id)
        if success:
            return {"message": f"Competitor with ID {competitor_id} has been successfully deleted."}
        else:
            raise HTTPException(status_code=404, detail=f"Competitor with ID {competitor_id} not found.")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

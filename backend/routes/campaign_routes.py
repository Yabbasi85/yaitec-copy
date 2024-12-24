# app/routes/campaign_routes.py
from fastapi import APIRouter, HTTPException
from typing import List
from models.campaign import Campaign
from controllers.campaign_controller import (
    create_campaign,
    get_campaigns,
    get_campaign_by_id,
    update_campaign,
    delete_campaign,
    get_analytics_data,
)

router = APIRouter()

@router.post("/campaigns/", response_model=Campaign)
async def create_campaign_route(campaign: Campaign):
    try:
        created_campaign = await create_campaign(campaign)
        return created_campaign
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/campaigns/", response_model=List[Campaign])
async def get_campaigns_route():
    try:
        campaigns = await get_campaigns()
        return campaigns
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/campaigns/{id}", response_model=Campaign)
async def get_campaign_route(id: str):
    campaign = await get_campaign_by_id(id)
    if campaign:
        return campaign
    else:
        raise HTTPException(status_code=404, detail="Campaign not found")

@router.put("/campaigns/{id}", response_model=Campaign)
async def update_campaign_route(id: str, campaign: Campaign):
    try:
        updated_campaign = await update_campaign(id, campaign)
        if updated_campaign:
            return updated_campaign
        else:
            raise HTTPException(status_code=404, detail="Campaign not found or no changes made")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/campaigns/{id}", response_model=dict)
async def delete_campaign_route(id: str):
    success = await delete_campaign(id)
    if success:
        return {"message": "Campaign deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Campaign not found")

@router.get("/analytics", response_model=List[dict])
async def get_analytics_data_route():
    try:
        analytics_data = await get_analytics_data()
        return analytics_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

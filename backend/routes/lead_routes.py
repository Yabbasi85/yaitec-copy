from typing import List
from fastapi import APIRouter
from controllers import lead_controller
from models.lead import Lead, LeadUpdate

router = APIRouter()

@router.post("/leads", response_model=Lead)
async def create_lead(lead: Lead):
    return await lead_controller.create_lead(lead)

@router.get("/leads", response_model=List[Lead])
def get_leads():
    return lead_controller.get_leads()

@router.get("/leads/{lead_id}", response_model=Lead)
def get_lead(lead_id: str):
    return lead_controller.get_lead_by_id(lead_id)

@router.put("/leads/{lead_id}", response_model=Lead)
async def update_lead(lead_id: str, lead_data: LeadUpdate):
    return await lead_controller.update_lead(lead_id, lead_data)

@router.delete("/leads/{lead_id}")
def delete_lead(lead_id: str):
    lead_controller.delete_lead(lead_id)
    return {"message": "Lead deleted successfully"}


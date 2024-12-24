from fastapi import APIRouter, HTTPException
from typing import List
from bson import ObjectId 
from controllers import admin_painel_controller
from models.admin_painel import DashboardCreate, DashboardResponse

router = APIRouter()

@router.post("/dashboards/", response_model=DashboardResponse)
async def create_dashboard(dashboard: DashboardCreate):
    try:
        created_dashboard = await admin_painel_controller.create_dashboard(dashboard)
        return created_dashboard
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/dashboards/", response_model=List[DashboardResponse])
async def read_dashboards(skip: int = 0, limit: int = 10):
    try:
        dashboards = await  admin_painel_controller.get_dashboards(skip=skip, limit=limit)
        return dashboards
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/dashboards/{dashboard_id}", response_model=DashboardResponse)
async def read_dashboard(dashboard_id: str):
    try:
        if not ObjectId.is_valid(dashboard_id):
            raise HTTPException(status_code=400, detail="Invalid ID format")

        dashboard = await  admin_painel_controller.get_dashboard_by_id(dashboard_id)
        if dashboard is None:
            raise HTTPException(status_code=404, detail="Dashboard not found")
        return dashboard
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    
@router.put("/dashboards/{dashboard_id}", response_model=DashboardResponse)
async def update_dashboard(dashboard_id: str, dashboard: DashboardCreate):
    try:
        if not ObjectId.is_valid(dashboard_id):
            raise HTTPException(status_code=400, detail="Invalid ID format")
        
        updated_dashboard = await admin_painel_controller.update_dashboard(dashboard_id, dashboard)
        if updated_dashboard is None:
            raise HTTPException(status_code=404, detail="Dashboard not found or no changes made")
        
        return updated_dashboard
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/dashboards/{dashboard_id}", response_model=dict)
async def delete_dashboard(dashboard_id: str):
    try:
        if not ObjectId.is_valid(dashboard_id):
            raise HTTPException(status_code=400, detail="Invalid ID format")

        success = await  admin_painel_controller.delete_dashboard(dashboard_id)
        if not success:
            raise HTTPException(status_code=404, detail="Dashboard not found")
        return {"message": "Dashboard deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

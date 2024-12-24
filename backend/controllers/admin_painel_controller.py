from fastapi import HTTPException
from bson import ObjectId
from datetime import datetime
from database.mongo import db
from models.admin_painel import DashboardCreate


# Helper function to format dashboard data
def dashboard_helper(dashboard) -> dict:
    return {
        "id": str(dashboard["_id"]),
        "name": dashboard["name"],
        "category": dashboard["category"],
        "enabled": dashboard["enabled"],
        "created_at": dashboard["created_at"]
    }

# Create a new dashboard
async def create_dashboard(dashboard: DashboardCreate):
    try:
        dashboard_doc = {
            "name": dashboard.name,
            "category": dashboard.category,
            "enabled": dashboard.enabled,
            "created_at": datetime.now()
        }

        result = db.dashboards.insert_one(dashboard_doc)
        dashboard_doc["_id"] = result.inserted_id
        return dashboard_helper(dashboard_doc)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Retrieve all dashboards
async def get_dashboards(skip: int = 0, limit: int = 10):
    try:
        dashboards = list(db.dashboards.find().skip(skip).limit(limit))
        return [dashboard_helper(dashboard) for dashboard in dashboards]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Retrieve a single dashboard by ID
async def get_dashboard_by_id(id: str):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")

        dashboard = db.dashboards.find_one({"_id": ObjectId(id)})
        if dashboard:
            return dashboard_helper(dashboard)
        raise HTTPException(status_code=404, detail="Dashboard not found")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Update an existing dashboard
async def update_dashboard(id: str, dashboard: DashboardCreate):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")

        update_data = dashboard.dict(exclude_unset=True)
        update_data["updated_at"] = datetime.now()

        update_result = db.dashboards.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_data}
        )

        if update_result.modified_count == 1:
            updated_dashboard = db.dashboards.find_one({"_id": ObjectId(id)})
            return dashboard_helper(updated_dashboard)
        
        raise HTTPException(status_code=404, detail="Dashboard not found or no changes made.")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Delete a dashboard by ID
async def delete_dashboard(id: str):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")

        result = db.dashboards.delete_one({"_id": ObjectId(id)})

        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Dashboard not found")

        return {"message": "Dashboard deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

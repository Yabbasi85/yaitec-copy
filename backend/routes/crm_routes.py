from fastapi import APIRouter, HTTPException
from typing import List
from bson import ObjectId
from models.crm_model import CRMModel
from database.mongo import db

router = APIRouter()

# Create a new CRM
@router.post("/crms", response_model=CRMModel)
async def create_crm(crm: CRMModel):
    crm_dict = crm.dict(exclude={"id"})  
    result = db.crms.insert_one(crm_dict)
    crm.id = str(result.inserted_id)
    return crm

# Search all CRMs
@router.get("/crms", response_model=List[CRMModel])
async def get_all_crms():
    crms = list(db.crms.find())
    for crm in crms:
        crm['id'] = str(crm['_id'])
    return crms

# Search for a CRM by ID
@router.get("/crms/{crm_id}", response_model=CRMModel)
async def get_crm(crm_id: str):
    crm = db.crms.find_one({"_id": ObjectId(crm_id)})
    if crm:
        crm['id'] = str(crm['_id'])
        return crm
    raise HTTPException(status_code=404, detail="CRM not found")

# Update a CRM
@router.put("/crms/{crm_id}", response_model=CRMModel)
async def update_crm(crm_id: str, crm: CRMModel):
    update_result = db.crms.update_one(
        {"_id": ObjectId(crm_id)},
        {"$set": crm.dict(exclude_unset=True, exclude={"id"})}
    )
    if update_result.modified_count == 1:
        updated_crm = db.crms.find_one({"_id": ObjectId(crm_id)})
        updated_crm['id'] = str(updated_crm['_id'])
        return updated_crm
    raise HTTPException(status_code=404, detail="CRM not found")

# Delete a CRM
@router.delete("/crms/{crm_id}")
async def delete_crm(crm_id: str):
    delete_result = db.crms.delete_one({"_id": ObjectId(crm_id)})
    if delete_result.deleted_count == 1:
        return {"message": f"CRM with ID {crm_id} has been successfully deleted."}
    raise HTTPException(status_code=404, detail="CRM not found")

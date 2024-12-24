# app/routes/content_routes.py
from fastapi import APIRouter, HTTPException
from models.content import ContentCreatorInput, ContentBasicInfo
from controllers.content_controller import create_content_plan, get_contents
from typing import List

router = APIRouter()

@router.post("/content_creator")
async def content_creator_endpoint(input: ContentCreatorInput):
    try:
        result = await create_content_plan(input)
        return {"content_plan": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/content", response_model=List[ContentBasicInfo])
async def get_content():
    try:
        content_type = None  # Defina como necessário
        single_content = False  # Defina como necessário
        contents = await get_contents(content_type, single_content)
        if contents:
            return contents
        else:
            raise HTTPException(status_code=404, detail="Content not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

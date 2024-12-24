from database.mongo import db
from models.content import ContentCreatorInput, ContentBasicInfo
from content_creation import create_content  
from datetime import datetime
from typing import List
from bson import ObjectId

async def create_content_plan(input: ContentCreatorInput):
    # Fetch competitor brand voices
    competitor_brand_voices = await get_competitor_brand_voices(input.competitors_ids)
    
    # Create content
    result = await create_content(
        competitor_brand_voices,
        input.platforms,
        input.campaign_duration,
        input.posts_per_month,
        input.goals,
        input.reference_files
    )
    created_contents = []
    for platform in input.platforms:
        platformContent = result[platform]
        content_info = {
            "content": platformContent,
            "type": platform,
            "createdAt": datetime.now().isoformat() + "Z"
        }
        created_contents.append(content_info)
    
    db.contents.insert_many(created_contents)
    return result

async def get_contents(content_type: str = None, single_content: bool = False):
    query = {}
    if content_type:
        query['type'] = content_type
    
    if single_content:
        content = db.contents.find_one(query, sort=[('createdAt', -1)])
        if content:
            return ContentBasicInfo(
                id=str(content["_id"]),
                content=str(content["content"]),
                type=str(content["type"]),
                createdAt=str(content["createdAt"])
            )
        else:
            return None
    else:
        contents = db.contents.find(query).sort('createdAt', -1)
        return [
            ContentBasicInfo(
                id=str(content["_id"]),
                content=str(content["content"]),
                type=str(content["type"]),
                createdAt=str(content["createdAt"])
            ) for content in contents
        ]

async def get_competitor_brand_voices(competitor_ids: List[str]) -> List[str]:
    brand_voices = []
    for competitor_id in competitor_ids:
        competitor = db.brand_voices.find_one({"_id": ObjectId(competitor_id)})
        if competitor and "brand_voice_analysis" in competitor:
            brand_voices.append(competitor["brand_voice_analysis"])
        else:
            print(f"Brand voice not found for competitor ID: {competitor_id}")
    return brand_voices

from database.mongo import db
from bson import ObjectId
from models.brand_voice import BrandVoiceAnalysisInput, CompetitorBasicInfo
from competitor_analysis import analyze_brand_voice  
from typing import List

async def get_all_competitors():
    competitors = db.brand_voices.find({}, {"name": 1, "website": 1, "social_media": 1, "brand_voice_analysis": 1})
    return [
        CompetitorBasicInfo(
            id=str(comp["_id"]),
            name=comp["name"],
            website=comp["website"],
            social_media=comp["social_media"],
            brand_voice=comp["brand_voice_analysis"]
        ) for comp in competitors
    ]

async def analyze_and_save_brand_voices(inputs: List[BrandVoiceAnalysisInput]):
    competitor_infos = []
    for input in inputs:
        result = await analyze_brand_voice(input.name, input.website, input.social_media)
        competitor_info = {
            "name": input.name,
            "website": input.website,
            "social_media": input.social_media,
            "brand_voice_analysis": result["brand_voice_analysis"]
        }
        competitor_infos.append(competitor_info)

    inserted_ids = db.brand_voices.insert_many(competitor_infos).inserted_ids

    return [
        {
            "id": str(inserted_id),
            "name": competitor_info["name"],
            "website": competitor_info["website"],
            "social_media": competitor_info["social_media"],
            "brand_voice_analysis": competitor_info["brand_voice_analysis"]
        }
        for inserted_id, competitor_info in zip(inserted_ids, competitor_infos)
    ]

async def get_brand_voice_by_id(competitor_id: str):
    brand_voice = db.brand_voices.find_one({"_id": ObjectId(competitor_id)})
    return brand_voice

async def delete_competitor(competitor_id: str):
    result = db.brand_voices.delete_one({"_id": ObjectId(competitor_id)})
    return result.deleted_count == 1
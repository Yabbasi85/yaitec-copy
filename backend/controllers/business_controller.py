from database.mongo import db
from bson import ObjectId
from models.business_voice import BusinessAnalysisInput, BusinessBasicInfo
from business_analysis import analyze_business  
from typing import List


async def get_all_business():
    business_cursor = db.business_analysis.find({}, {
        "name": 1,
        "website": 1,
        "social_media": 1,
        "product": 1,
        "location": 1,
        "competitors": 1,
        "competitors_website_data": 1,
        "social_media_summary": 1,
        "website_urls": 1,
        "extracted_social_links": 1
    })

    business = list(business_cursor)

    return [
        BusinessBasicInfo(
            id=str(comp["_id"]),
            name=comp["name"],
            website=comp["website"],
            social_media=comp["social_media"],
            product=comp.get("product", ""),
            location=comp.get("location", ""),
            competitors=comp.get("competitors", []),
            competitors_website_data=comp.get("competitors_website_data", []),
            social_media_summary=comp.get("social_media_summary", []) if isinstance(comp.get("social_media_summary", []), list) else [comp.get("social_media_summary", {})],
            website_urls=comp.get("website_urls", []),
            extracted_social_links=comp.get("extracted_social_links", []) if isinstance(comp.get("extracted_social_links", []), list) else []
        ) for comp in business
    ]


async def analyze_and_save_business(inputs: List[BusinessAnalysisInput]):
    competitor_infos = []
   
    for input_data in inputs:
        result = await analyze_business(
            input_data.name,
            input_data.product,
            input_data.website,
            input_data.social_media,
            input_data.location
        )
        competitor_info = {
            "name": input_data.name,
            "website": input_data.website,
            "social_media": input_data.social_media,
            "product": input_data.product,
            "location": input_data.location,
            "competitors": [comp.dict() for comp in result.competitors],
            "competitors_website_data": [
    res.to_dict() if hasattr(res, 'to_dict') else res.__dict__
    for res in result.tavily_search
],
            "social_media_summary": result.social_media_data,
            "website_urls": [comp.url for comp in result.competitors],
            "extracted_social_links": result.extracted_social_links
        }
        competitor_infos.append(competitor_info)


    inserted_ids = db.business_analysis.insert_many(competitor_infos).inserted_ids

    return [
        {
            "id": str(inserted_id),
            "name": competitor_info["name"],
            "website": competitor_info["website"],
            "social_media": competitor_info["social_media"],
            "product": competitor_info["product"],
            "location": competitor_info["location"],
            "competitors": competitor_info["competitors"],
            "competitors_website_data": competitor_info["competitors_website_data"],
            "social_media_summary": competitor_info["social_media_summary"],
            "website_urls": competitor_info["website_urls"],
            "extracted_social_links": competitor_info["extracted_social_links"]

        }
        for inserted_id, competitor_info in zip(inserted_ids, competitor_infos)
    ]

async def get_business_analysis_by_id(competitor_id: str):
    business_analysis = db.business_analysis.find_one({"_id": ObjectId(competitor_id)})
    return business_analysis

async def delete_business_analysis(competitor_id: str):
    result = db.business_analysis.delete_one({"_id": ObjectId(competitor_id)})
    return result.deleted_count == 1
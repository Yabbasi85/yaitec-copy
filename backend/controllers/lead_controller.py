from datetime import datetime
import os
from zoneinfo import ZoneInfo
from bson import ObjectId
from fastapi import HTTPException
from typing import List
from models.lead import Lead
from pymongo import MongoClient
from openai import OpenAI

mongodb_client = MongoClient(os.getenv("MONGODB_URI"))
db = mongodb_client[os.getenv("DATABASE_NAME")]
leads_collection = db["leads"]

def lead_helper(lead) -> dict:
    return {
        "id": str(lead["_id"]),
        "name": lead["name"],
        "email": lead["email"],
        "phone": lead.get("phone"),
        "company": lead.get("company"),
        "status": lead["status"],
        "source": lead.get("source"),
        "notes": lead.get("notes"),
        "score": lead["score"],
        "temperature": lead.get("temperature"),
        "suggestions": lead.get("suggestions"),
    }

async def create_lead(lead: Lead):
    try:
        lead_dict = lead.dict()
        
        if 'id' in lead_dict:
            lead_dict.pop('id')

        lead_dict["created_at"] = datetime.now(ZoneInfo("UTC"))

        suggestions = await generate_lead_suggestions(lead)

        lead_dict["suggestions"] = suggestions

        result = leads_collection.insert_one(lead_dict)

        lead_dict["_id"] = result.inserted_id

        return lead_helper(lead_dict)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


def get_leads() -> List[Lead]:
    leads = []
    for lead in leads_collection.find():
        leads.append(lead_helper(lead))
    return leads

def get_lead_by_id(lead_id: str) -> Lead:
    lead = leads_collection.find_one({"_id": ObjectId(lead_id)})
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead_helper(lead)

async def update_lead(lead_id: str, lead_data: Lead):
    try:
        if not ObjectId.is_valid(lead_id):
            raise HTTPException(status_code=400, detail="Invalid lead ID format")

        lead_dict = lead_data.dict(exclude_unset=True, by_alias=True)

        suggestions = await generate_lead_suggestions(lead_data)

        lead_dict["suggestions"] = suggestions

        # Atualiza o lead no MongoDB
        update_result = leads_collection.update_one(
            {"_id": ObjectId(lead_id)},
            {"$set": lead_dict}
        )

        if update_result.modified_count == 1:
            updated_lead = leads_collection.find_one({"_id": ObjectId(lead_id)})

            if updated_lead:
                updated_lead["_id"] = str(updated_lead["_id"])
                return updated_lead

        raise HTTPException(status_code=404, detail="Lead not found or no changes made.")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


def delete_lead(lead_id: str):
    result = leads_collection.delete_one({"_id": ObjectId(lead_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")


openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def generate_lead_suggestions(lead: Lead):
    prompt = f"""
    A lead named {lead.name} with the following details:
    - Email: {lead.email}
    - Phone: {lead.phone if lead.phone else 'N/A'}
    - Company: {lead.company if lead.company else 'N/A'}
    - Current Status: {lead.status}
    - Source: {lead.source if lead.source else 'N/A'}
    - Current Score: {lead.score}
    - Current Temperature: {lead.temperature}

    Based on these details, provide a personalized strategy to turn this lead into a 'hot' lead, with actionable steps that can be taken to increase their engagement and move them further down the sales funnel.
    """

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a marketing and sales expert specialized in lead conversion."},
                {"role": "user", "content": prompt}
            ]
        )

        return response.choices[0].message.content

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred while generating suggestions: {str(e)}")
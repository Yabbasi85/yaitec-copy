import re
from fastapi import HTTPException
from database.mongo import db
from bson import ObjectId
from models.campaign import Campaign
from datetime import datetime
from zoneinfo import ZoneInfo
from config import settings
from openai import OpenAI, OpenAIError

openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)

# Helper function to transform a campaign document into a dictionary with specific fields
def campaign_helper(campaign) -> dict:
    return {
        "id": str(campaign["_id"]),
        "name": campaign["name"],
        "budget": campaign["budget"],
        "startDate": campaign["startDate"],
        "endDate": campaign["endDate"],
        "content_plan": campaign.get("content_plan", ""),
        "created_at": campaign.get("created_at")
    }

# Function to create a new campaign in the database and generate a content plan
async def create_campaign(campaign: Campaign):
    try:
        content_plan = await generate_content(campaign)

        campaign_doc = {
            "name": campaign.name,
            "budget": campaign.budget,
            "startDate": campaign.startDate,
            "endDate": campaign.endDate,
            "content_plan": content_plan,
            "created_at": datetime.now(ZoneInfo("UTC"))
        }

        result = db.campaigns.insert_one(campaign_doc)

        campaign_doc["_id"] = result.inserted_id
        return campaign_helper(campaign_doc)
    except Exception as e:
       raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Function to retrieve all campaigns from the database
async def get_campaigns():
    campaigns = list(db.campaigns.find())
    return [campaign_helper(campaign) for campaign in campaigns]

# Function to retrieve a single campaign by its ID
async def get_campaign_by_id(id: str):
    campaign = db.campaigns.find_one({"_id": ObjectId(id)})
    return campaign

# Function to update an existing campaign and regenerate the content plan
async def update_campaign(id: str, campaign: Campaign):
    try:
        content_plan = await generate_content(campaign)
        
        campaign_dict = campaign.dict(exclude_unset=True, by_alias=True)
        campaign_dict["content_plan"] = content_plan

        update_result = db.campaigns.update_one(
            {"_id": ObjectId(id)},
            {"$set": campaign_dict}
        )

        if update_result.modified_count == 1:
            updated_campaign = db.campaigns.find_one({"_id": ObjectId(id)})
            return campaign_helper(updated_campaign)

        raise HTTPException(status_code=404, detail="Campaign not found or no changes made.")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    
# Function to delete a campaign by its ID
async def delete_campaign(id: str):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")

        object_id = ObjectId(id)

        result = db.campaigns.delete_one({"_id": object_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Campaign not found")

        return {"message": "Campaign deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Function to retrieve analytics data (impressions, clicks, conversions) for all campaigns
async def get_analytics_data():
    campaigns = list(db.campaigns.find())
    analytics_data = []
    for campaign in campaigns:
        analytics_data.append({
            "name": campaign["name"],
            "impressions": campaign.get("impressions", 0),
            "clicks": campaign.get("clicks", 0),
            "conversions": campaign.get("conversions", 0)
        })
    return analytics_data

# Function to generate a content plan for a campaign using OpenAI's GPT-4 model
async def generate_content(campaign: Campaign):
    prompt = f"""
    Create a content plan for a campaign named {campaign.name} with a budget of {campaign.budget}.
    The campaign starts on {campaign.startDate} and ends on {campaign.endDate}.
    """
    
    response = openai_client.chat.completions.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are an expert content creator and marketing strategist."},
            {"role": "user", "content": prompt}
        ]
    )
    
    return response.choices[0].message.content

# Function to generate hypothetical analytics data (impressions, clicks, conversions) using OpenAI
async def generate_analytics(campaign: Campaign):
    prompt = f"""
    You are an expert marketing analyst. Based on the following campaign details:
    - Name: {campaign.name}
    - Budget: {campaign.budget}
    - Start Date: {campaign.startDate}
    - End Date: {campaign.endDate}
    
    Please provide the following values in this exact format:
    1. Impressions: <value>
    2. Clicks: <value>
    3. Conversions: <value>
    """

    try:
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert marketing analyst."},
                {"role": "user", "content": prompt}
            ]
        )

        if not response or not response.choices:
            raise ValueError("Failed to get a valid response from OpenAI API")

        analytics_text = response.choices[0].message.content
        print("Analytics Text:", analytics_text)  

        impressions_match = re.search(r"Impressions:\s*([\d,]+)", analytics_text)
        clicks_match = re.search(r"Clicks:\s*([\d,]+)", analytics_text)
        conversions_match = re.search(r"Conversions:\s*([\d,]+)", analytics_text)

        if not (impressions_match and clicks_match and conversions_match):
            print(f"Failed to extract analytics from response: {analytics_text}")
            raise ValueError("Unable to extract analytics from the response")

        impressions = int(impressions_match.group(1).replace(',', ''))
        clicks = int(clicks_match.group(1).replace(',', ''))
        conversions = int(conversions_match.group(1).replace(',', ''))

        return impressions, clicks, conversions

    except OpenAIError as e:
        raise ValueError(f"OpenAI API error: {str(e)}")
    except Exception as e:
        raise ValueError(f"An error occurred: {str(e)}")

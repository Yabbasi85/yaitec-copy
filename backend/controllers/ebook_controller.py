from fastapi import HTTPException
from bson import ObjectId
from datetime import datetime
from database.mongo import db
from config import settings
from openai import OpenAI
from models.ebook import Ebook

# Helper function to format ebook data
def ebook_helper(ebook) -> dict:
    return {
        "id": str(ebook["_id"]),
        "title": ebook["title"],
        "theme": ebook["theme"],
        "category": ebook["category"],
        "content": ebook["content"],
        "created_at": ebook["created_at"]
    }

# Create a new ebook and generate content using AI
async def create_ebook(ebook: Ebook):
    try:
        content = await generate_ebook_content(ebook)
        
        ebook_doc = {
            "title": ebook.title,
            "theme": ebook.theme,
            "category": ebook.category,
            "content": content,
            "created_at": datetime.now()
        }
        
        result = db.ebooks.insert_one(ebook_doc)
        ebook_doc["_id"] = result.inserted_id
        return ebook_helper(ebook_doc)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Retrieve all ebooks
async def get_ebooks():
    ebooks = list(db.ebooks.find())
    return [ebook_helper(ebook) for ebook in ebooks]

# Retrieve a single ebook by ID
async def get_ebook_by_id(id: str):
    ebook = db.ebooks.find_one({"_id": ObjectId(id)})
    if ebook:
        return ebook_helper(ebook)
    raise HTTPException(status_code=404, detail="Ebook not found")

# Update an existing ebook
async def update_ebook(id: str, ebook: Ebook):
    try:
        content = await generate_ebook_content(ebook)
        
        update_data = ebook.dict(exclude_unset=True)
        update_data["content"] = content

        update_result = db.ebooks.update_one(
            {"_id": ObjectId(id)},
            {"$set": update_data}
        )

        if update_result.modified_count == 1:
            updated_ebook = db.ebooks.find_one({"_id": ObjectId(id)})
            return ebook_helper(updated_ebook)
        
        raise HTTPException(status_code=404, detail="Ebook not found or no changes made.")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# Delete an ebook by ID
async def delete_ebook(id: str):
    try:
        if not ObjectId.is_valid(id):
            raise HTTPException(status_code=400, detail="Invalid ObjectId")
        
        result = db.ebooks.delete_one({"_id": ObjectId(id)})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Ebook not found")
        
        return {"message": "Ebook deleted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)

# Function to generate ebook content using OpenAI's GPT-4 model
async def generate_ebook_content(ebook: Ebook):
    prompt = f"Generate detailed content for an ebook titled '{ebook.title}' on the theme '{ebook.theme}', in the '{ebook.category}' category."
    
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are an expert in ebook content creation."},
                {"role": "user", "content": prompt}
            ],
        )
        return response.choices[0].message.content
    
    except Exception as e:
        raise ValueError(f"An error occurred while generating content: {str(e)}")

from datetime import datetime
import os
import uuid
from pathlib import Path
from zoneinfo import ZoneInfo
from fastapi import UploadFile, HTTPException
from openai import OpenAI
from pymongo import MongoClient

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# MongoDB connection
mongodb_client = MongoClient(os.getenv("MONGODB_URI"))
db = mongodb_client[os.getenv("DATABASE_NAME")]

# Audio directory (created in main)
audio_dir = Path(__file__).parent / "audio_files"

# Function to transcribe audio using OpenAI
async def transcribe_audio(voice_file: UploadFile):
    input_webm_path = Path(__file__).parent / "input_audio.webm"
    with open(input_webm_path, "wb") as f:
        f.write(await voice_file.read())

    if input_webm_path.stat().st_size == 0:
        raise HTTPException(status_code=500, detail="The webm file is empty or corrupted.")
    
    with open(input_webm_path, "rb") as audio_file:
        speech_to_text_response = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file
        )
    
    return speech_to_text_response.text

# Function to process the text using OpenAI (or another bot)
async def generate_text_from_bot(transcribed_text: str, bot_model: str = "gpt-3.5-turbo"):
    if bot_model == "openai":
        chat_response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI assistant."},
                {"role": "user", "content": transcribed_text}
            ]
        )
        return chat_response.choices[0].message.content
    else:
        raise HTTPException(status_code=400, detail=f"Unknown bot model: {bot_model}")

# Function to generate audio from text
async def generate_audio_from_text(text: str, voice: str = "alloy"):
    response = client.audio.speech.create(
        model="tts-1",
        voice=voice,
        input=text,
        response_format="mp3"
    )
    return response.read()


# Function to save the audio and return the correct UR
async def save_audio_and_get_url(audio_data: bytes) -> str:
    unique_filename = f"response_audio_{uuid.uuid4()}.mp3"
    speech_file_path = audio_dir / unique_filename

    with open(speech_file_path, "wb") as out:
        out.write(audio_data)

    # Retornar a URL correta com base no ambiente
    return f"https://portal-api.yaitec.dev/backend/audio/{unique_filename}"

# Function to save conversation in MongoDB
async def save_conversation_to_db(transcribed_text: str, generated_text: str, audio_url: str):
    conversation = {
        "transcribed_text": transcribed_text,
        "generated_text": generated_text,
        "audio_url": audio_url,
        "created_at": datetime.now(ZoneInfo("UTC"))
    }
    try:
        result = db.conversations.insert_one(conversation)
        return str(result.inserted_id)
    except Exception as e:
        print(f"Error inserting into MongoDB: {e}")
        raise HTTPException(status_code=500, detail="Database error")


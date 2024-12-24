# app/routes/voice_to_voice_routes.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from controllers.voice_to_voice_controller import process_voice_to_voice

router = APIRouter()

@router.post("/voice-to-voice/")
async def voice_to_voice_route(voice_file: UploadFile = File(...), bot_model: str = "openai", voice: str = "alloy"):
    try:
        result = await process_voice_to_voice(voice_file, bot_model, voice)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

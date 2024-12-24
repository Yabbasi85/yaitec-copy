from voice_to_voice import (
    generate_audio_from_text,
    generate_text_from_bot,
    save_audio_and_get_url,
    save_conversation_to_db,
    transcribe_audio,
)
from fastapi import UploadFile

async def process_voice_to_voice(voice_file: UploadFile, bot_model: str, voice: str):
    # Transcrever o áudio
    transcribed_text = await transcribe_audio(voice_file)

    # Processar o texto usando o bot
    generated_text = await generate_text_from_bot(transcribed_text, bot_model)

    # Gerar áudio de resposta
    audio_data = await generate_audio_from_text(generated_text, voice)

    # Salvar o áudio e obter a URL
    audio_url = await save_audio_and_get_url(audio_data)

    # Salvar a conversa no MongoDB
    conversation_id = await save_conversation_to_db(transcribed_text, generated_text, audio_url)

    # Retornar os dados
    return {
        "conversation_id": str(conversation_id),
        "transcribed_text": transcribed_text,
        "generated_text": generated_text,
        "audio_url": audio_url
    }

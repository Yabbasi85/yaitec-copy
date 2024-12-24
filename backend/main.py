# app/main.py
from routes import business_analysis_routes
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.db import init_db
from routes import (
    brand_voice_routes,
    admin_painel_route,
    content_routes,
    campaign_routes,
    ebook_route,
    gmail_routes,
    image_generator_route,
    lead_routes,
    voice_to_voice_routes,
    crm_routes,
    notion_routes)
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from fastapi.templating import Jinja2Templates
from routes.auth_route import router as auth_router
from routes.login_routes import router as login_router
from routes.auth_google_route import router as google_auth
from routes.stripe_route import router as stripe_router

app = FastAPI()

# Templates
templates = Jinja2Templates(directory="templates")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://portal.yaitec.dev", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclua os roteadores
app.include_router(business_analysis_routes.router)
app.include_router(content_routes.router)
app.include_router(campaign_routes.router)
app.include_router(voice_to_voice_routes.router)
app.include_router(image_generator_route.router)
app.include_router(lead_routes.router)
app.include_router(ebook_route.router)
app.include_router(admin_painel_route.router)
app.include_router(gmail_routes.router)
app.include_router(auth_router)
app.include_router(login_router)
app.include_router(google_auth)
app.include_router(stripe_router)
app.include_router(brand_voice_routes.router)
app.include_router(crm_routes.router)
app.include_router(notion_routes.router)

# Inicializando o banco de dados
@app.on_event("startup")
async def on_startup():
    try:
        await init_db()
        print("Database connected successfully!")
    except Exception as e:
        print(f"Error connecting to the database: {e}")

# Montar diretório de arquivos estáticos
audio_dir = Path(__file__).parent / "audio_files"
audio_dir.mkdir(parents=True, exist_ok=True)
app.mount("/backend/audio", StaticFiles(directory=audio_dir), name="audio")

# Configuração do diretório de PDFs
pdf_dir = Path("/app/pdfs")  
pdf_dir.mkdir(parents=True, exist_ok=True)
app.mount("/pdfs", StaticFiles(directory=pdf_dir), name="pdfs")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000)

import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGODB_URI: str = os.getenv("MONGODB_URI")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY")

settings = Settings()

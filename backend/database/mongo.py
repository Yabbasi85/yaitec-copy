# app/database/mongo.py
from pymongo import MongoClient
from config import settings

client = MongoClient(settings.MONGODB_URI)
db = client[settings.DATABASE_NAME]

from fastapi import APIRouter
from controllers.ebook_controller import create_ebook, delete_ebook, get_ebook_by_id, get_ebooks, update_ebook
from models.ebook import Ebook

router = APIRouter()

@router.post("/ebooks/")
async def create_new_ebook(ebook: Ebook):
    return await create_ebook(ebook)

@router.get("/ebooks/")
async def read_ebooks():
    return await get_ebooks()

@router.get("/ebooks/{id}")
async def read_ebook(id: str):
    return await get_ebook_by_id(id)

@router.put("/ebooks/{id}")
async def update_existing_ebook(id: str, ebook: Ebook):
    return await update_ebook(id, ebook)

@router.delete("/ebooks/{id}")
async def delete_existing_ebook(id: str):
    return await delete_ebook(id)

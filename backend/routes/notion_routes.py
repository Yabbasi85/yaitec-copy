import logging
import os
from pathlib import Path
from typing import List, Optional
from fastapi.responses import JSONResponse
import requests
from apify_client import ApifyClient
from fastapi import APIRouter, File, HTTPException, UploadFile
from tasks import process_pdf_task
from notion_client import Client
from pydantic import BaseModel
from models.notion_model import NotionProject
from celery_config import celery_app

logger = logging.getLogger(__name__)

router = APIRouter()

class TavilySearchResult(BaseModel):
    url: str
    content: str

class CompetitorInfo(BaseModel):
    name: str
    description: str
    url: str
    products: Optional[List[str]] = []
    services: Optional[List[str]] = []
    about: Optional[str] = None
    vision: Optional[str] = None
    history: Optional[str] = None

NOTION_API_KEY = os.getenv("NOTION_API_KEY")
NOTION_DATABASE_ID = os.getenv("NOTION_DATABASE_ID")
NOTION_API_URL = "https://api.notion.com/v1/pages"
NOTION_QUERY_URL = f"https://api.notion.com/v1/databases/{NOTION_DATABASE_ID}/query"

headers = {
    "Authorization": f"Bearer {NOTION_API_KEY}",
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28",
}


@router.post("/projects/")
async def create_project(project: NotionProject):
    # Dados para criar o projeto no Notion
    notion_data = {
        "parent": {"database_id": NOTION_DATABASE_ID},
        "properties": {
            "Project Name": {
                "title": [
                    {
                        "text": {
                            "content": project.project_name
                        }
                    }
                ]
            },
            "Business Name": {
                "rich_text": [
                    {
                        "text": {
                            "content": project.business_name
                        }
                    }
                ]
            },
            "Status": {
                "status": {
                    "name": project.status
                }
            },
            "Team/Department": {
                "rich_text": [
                    {
                        "text": {
                            "content": project.team_department
                        }
                    }
                ]
            },
            "Assigned Person": {
                "rich_text": [
                    {
                        "text": {
                            "content": project.assigned_person
                        }
                    }
                ]
            },
            "Priority": {
                "select": {
                    "name": project.priority
                }
            },
            "Link": {
                "url": project.link
            },
            "Due Date": {
                "date": {
                    "start": project.due_date.isoformat()
                }
            },
        },
    }

    # Criar o projeto no Notion
    response = requests.post(NOTION_API_URL, headers=headers, json=notion_data)

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())

    notion_id = response.json().get("id")

    return {"message": "Project created successfully in Notion", "notion_id": notion_id}



# READ ALL (Síncrono com Notion)
@router.get("/projects/")
async def get_all_projects():
    response = requests.post(NOTION_QUERY_URL, headers=headers, json={})

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())

    notion_projects = response.json().get("results", [])

    projects = []
    for project in notion_projects:
        properties = project.get("properties", {})
        projects.append({
            "notion_id": project.get("id"),
            "project_name": properties.get("Project Name", {}).get("title", [{}])[0].get("text", {}).get("content", ""),
            "business_name": properties.get("Business Name", {}).get("rich_text", [{}])[0].get("text", {}).get("content", ""),
            "status": properties.get("Status", {}).get("status", {}).get("name", ""),
            "team_department": properties.get("Team/Department", {}).get("rich_text", [{}])[0].get("text", {}).get("content", ""),
            "assigned_person": properties.get("Assigned Person", {}).get("rich_text", [{}])[0].get("text", {}).get("content", ""),
            "priority": properties.get("Priority", {}).get("select", {}).get("name", ""),
            "link": properties.get("Link", {}).get("url", ""),
            "due_date": properties.get("Due Date", {}).get("date", {}).get("start", ""),
            "approved": properties.get("Approved", {}).get("checkbox", False)
        })

    return projects


# UPDATE
@router.put("/projects/{project_id}")
async def update_project(project_id: str, project: NotionProject):
    notion_id = project_id

    # Prepare the data for updating Notion
    notion_data = {
        "properties": {
            "Project Name": {"title": [{"text": {"content": project.project_name}}]},
            "Business Name": {"rich_text": [{"text": {"content": project.business_name}}]},
            "Status": {"status": {"name": project.status}},
            "Team/Department": {"rich_text": [{"text": {"content": project.team_department}}]},
            "Assigned Person": {"rich_text": [{"text": {"content": project.assigned_person}}]},
            "Priority": {"select": {"name": project.priority}},
            "Link": {"url": project.link} if project.link else {},
            "Due Date": {"date": {"start": project.due_date.isoformat()}},
        },
    }

    # Make a PATCH request to update the Notion database entry
    response = requests.patch(f"{NOTION_API_URL}/{notion_id}", headers=headers, json=notion_data)

    # Check for errors in the response
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail=response.json())

    return {"message": "Project updated successfully in Notion"}

BASE_DIR = Path("/app")
pdf_social_media_dir = BASE_DIR / "pdfs"
pdf_social_media_dir.mkdir(parents=True, exist_ok=True)

notion = Client(auth=os.getenv("NOTION_API_KEY"))
apify_client = ApifyClient(os.getenv("APIFY_API_TOKEN"))
jina_api_key = os.getenv("JINA_API_KEY")
tavily_api_key = os.getenv("TAVILY_API_KEY")
perplexity_key = os.getenv("PERPLEXITY_API_KEY")


def get_project_data_from_notion(project_id: str):
    try:
        page = notion.pages.retrieve(page_id=project_id)
        properties = page.get("properties", {})

        return {
            "Project Name": properties.get("Project Name", {}).get("title", [{}])[0].get("text", {}).get("content", ""),
            "Business Name": properties.get("Business Name", {}).get("rich_text", [{}])[0].get("text", {}).get("content", ""),
            "Status": properties.get("Status", {}).get("status", {}).get("name", ""),
            "Team/Department": properties.get("Team/Department", {}).get("rich_text", [{}])[0].get("text", {}).get("content", ""),
            "Assigned Person": properties.get("Assigned Person", {}).get("rich_text", [{}])[0].get("text", {}).get("content", ""),
            "Priority": properties.get("Priority", {}).get("select", {}).get("name", ""),
            "Due Date": properties.get("Due Date", {}).get("date", {}).get("start", ""),
            "Link": properties.get("Link", {}).get("url", ""),
            "Approved": properties.get("Approved", {}).get("checkbox", False)
        }
    except Exception as e:
        print(f"Error retrieving project data: {e}")
        return None


@router.post("/save-pdf-approved/")
async def save_pdf(project_id: str,
                   folder_name: str,
                   pdf_file: UploadFile = File(...)):
    try:
        logging.info(f"Iniciando processo para project_id: {project_id}")

        # Obtém dados do projeto
        project_data = get_project_data_from_notion(project_id)
        if not project_data:
            raise HTTPException(status_code=404,
                                detail="Project data not found")

        if not project_data.get("Link") or not project_data.get(
                "Business Name"):
            raise HTTPException(
                status_code=400,
                detail="Missing website or business name in project data")

        # Inicia a task do Celery
        task = process_pdf_task.delay(project_id=project_id,
                                      folder_name=folder_name,
                                      project_data=project_data)

        return {
            "message": "PDF processing started",
            "task_id": task.id,
            "status": "processing"
        }

    except Exception as e:
        logging.error(f"Error initiating PDF processing: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/list-pdfs/")
async def list_pdfs():
    try:
        pdf_social_media_dir = Path("/app/pdfs")
        logging.info(f"Scanning directory: {pdf_social_media_dir}")
        logging.info(f"Directory exists: {pdf_social_media_dir.exists()}")
        
        pdf_files = []
        for pdf in pdf_social_media_dir.glob("*.pdf"):
            if pdf.is_file():
                stat = pdf.stat()
                logging.info(f"Found PDF: {pdf.name}, Modified: {stat.st_mtime}")
                pdf_files.append(pdf.name)
        
        logging.info(f"Total PDFs found: {len(pdf_files)}")
        
        # Sort by modification time
        pdf_files.sort(
            key=lambda name: pdf_social_media_dir.joinpath(name).stat().st_mtime,
            reverse=True
        )
        
        return JSONResponse(
            content={"pdf_files": pdf_files},
            headers={
                "Cache-Control": "no-cache, no-store, must-revalidate",
                "Pragma": "no-cache",
                "Expires": "0",
                "Last-Modified": "0"
            }
        )
    except Exception as e:
        logging.error(f"Erro ao listar PDFs: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Erro ao listar PDFs: {str(e)}")


@router.get("/pdf-status/{task_id}")
async def get_pdf_status(task_id: str):
    task_result = celery_app.AsyncResult(task_id)

    result = {
        "task_id": task_id,
        "status": task_result.status,
    }

    if task_result.ready():
        if task_result.successful():
            result["result"] = task_result.result
        else:
            result["error"] = str(task_result.result)

    return result

import os
import re
from bs4 import BeautifulSoup
import requests
from celery_config import celery_app
import logging
import asyncio
import json
import logging
import os
import re
from io import BytesIO
from typing import List, Any, Optional
import httpx
import requests
from bs4 import BeautifulSoup
from fastapi import HTTPException
from langchain_community.chat_models import ChatPerplexity
from langchain_core.messages import HumanMessage
from pydantic import BaseModel
from reportlab.lib.pagesizes import letter
from tavily import TavilyClient
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from notion_client import Client
from apify_client import ApifyClient
import logging
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

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

BASE_DIR = Path("/app")
pdf_social_media_dir = BASE_DIR / "pdfs"
pdf_social_media_dir.mkdir(parents=True, exist_ok=True)

notion = Client(auth=os.getenv("NOTION_API_KEY"))
apify_client = ApifyClient(os.getenv("APIFY_API_TOKEN"))
jina_api_key = os.getenv("JINA_API_KEY")
tavily_api_key = os.getenv("TAVILY_API_KEY")
pplx_key = os.getenv("PPLX_API_KEY")

async def find_competitors_perplexity(name: str, website: str) -> List[CompetitorInfo]:
    chat_perplexity = ChatPerplexity(pplx_api_key=pplx_key)
    prompt = f"""As an industry expert, identify and describe five main competitors for {name} (website: {website}).
    Focus on companies that offer similar products or services. Provide detailed and accurate information for each competitor.
    For each competitor, provide the following information:
    - Name: Full company name
    - Description: A concise description focusing on their capabilities and how they compete with {name}
    - Website URL: Official company website
    - Products: List of main products or solutions
    - Services: List of main services offered
    - About: A brief statement about the company's role in the industry
    - Vision: The company's vision or mission statement
    - History: Brief company history, focusing on their development and relevant achievements
    Ensure all information is accurate and up-to-date. Avoid generic descriptions and focus on each company's unique offerings and strengths.
    Format the response as a JSON array of objects with 'name', 'description', 'url', 'products', 'services', 'about', 'vision', and 'history' fields.
    """
    messages = [HumanMessage(content=prompt)]
    try:
        response = await chat_perplexity.ainvoke(messages)
        json_start = response.content.find('[')
        json_end = response.content.rfind(']') + 1
        if json_start != -1 and json_end != -1:
            json_str = response.content[json_start:json_end]
            json_str = re.sub(r'[^\[\]\{\}\"\:\,\w\s]', '', json_str)
            competitors_data = json.loads(json_str)
            return [CompetitorInfo(**comp) for comp in competitors_data]
        else:
            raise ValueError("No valid JSON found in the response")
    except Exception as e:
        logging.error(f"Error in find_competitors_perplexity: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing Perplexity API response: {str(e)}")


def generate_competitor_analysis_pdf(competitor_analysis, project_data: dict):
    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=72
    )

    # Define styles
    styles = {
        'Title': ParagraphStyle(
            'Title',
            fontSize=24,
            spaceAfter=30,
            leading=30,
            textColor=HexColor('#2c3e50')
        ),
        'Heading1': ParagraphStyle(
            'Heading1',
            fontSize=18,
            spaceAfter=20,
            spaceBefore=20,
            textColor=HexColor('#34495e')
        ),
        'Heading2': ParagraphStyle(
            'Heading2',
            fontSize=14,
            spaceAfter=12,
            spaceBefore=12,
            textColor=HexColor('#7f8c8d')
        ),
        'Normal': ParagraphStyle(
            'Normal',
            fontSize=11,
            spaceAfter=8,
            leading=14
        ),
        'List': ParagraphStyle(
            'List',
            fontSize=11,
            leftIndent=20,
            spaceAfter=6,
            leading=14
        )
    }

    story = []

    story.append(Paragraph("Competitor Analysis Report", styles['Title']))
    project_name = project_data.get("Project Name", "Project")
    business_name = project_data.get("Business Name", "N/A")
    link = project_data.get("Link", "N/A")
    due_date = project_data.get("Due Date", "N/A")

    story.append(Paragraph(f"Project Name: {project_name}", styles['Heading1']))
    story.append(Paragraph(f"Business Name: {business_name}", styles['Normal']))
    story.append(Paragraph(f"Link: {link}", styles['Normal']))
    story.append(Paragraph(f"Due Date: {due_date}", styles['Normal']))
    story.append(Spacer(1, 20))

    for competitor in competitor_analysis:
        # Competitor header section
        story.append(Paragraph(competitor['name'], styles['Heading1']))
        story.append(Paragraph(f"Website: {competitor['url']}", styles['Normal']))

        # Description section
        story.append(Paragraph("Description", styles['Heading2']))
        story.append(Paragraph(competitor['description'], styles['Normal']))
        story.append(Spacer(1, 12))

        # Products and Services sections
        for category in ['Products', 'Services']:
            if competitor.get(category.lower()):
                story.append(Paragraph(category, styles['Heading2']))
                for item in competitor[category.lower()][:5]:
                    story.append(Paragraph(f"• {item}", styles['List']))
                story.append(Spacer(1, 12))

        # Social Media Analysis section
        if 'social_media_analysis' in competitor:
            analysis = competitor['social_media_analysis']
            story.append(Paragraph("Social Media Analysis", styles['Heading2']))

            # Create a table for social media metrics
            metrics_data = [
                ['Metric', 'Value'],
                ['Total Followers', f"{analysis['total_followers']:,}"],
                ['Total Posts', f"{analysis['total_posts']:,}"],
                ['Engagement Rate', f"{analysis['engagement_rate']:.2f}%"]
            ]

            metrics_table = Table(
                metrics_data,
                colWidths=[2 * inch, 2 * inch],
                style=TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, 0), 12),
                    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                    ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                    ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
                    ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                    ('FONTSIZE', (0, 1), (-1, -1), 11),
                    ('GRID', (0, 0), (-1, -1), 1, colors.black)
                ])
            )
            story.append(metrics_table)
            story.append(Spacer(1, 20))

        # Add page break between competitors
        story.append(Spacer(1, 40))

    # Build PDF
    doc.build(story)
    buffer.seek(0)
    return buffer


class DetailedWebScraper:
    @staticmethod
    async def scrape_with_jina(url: str):
        headers = {"Authorization": f"Bearer {jina_api_key}"}
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post("https://r.jina.ai", json={"url": url}, headers=headers)
            return response.json() if response.status_code == 200 else await DetailedWebScraper.fallback_scraper(url)
        except Exception as e:
            logger.error(f"Error in Jina scraping for {url}: {str(e)}")
            return await DetailedWebScraper.fallback_scraper(url)


def parse_tavily_result(result: Any) -> List[TavilySearchResult]:
    if isinstance(result, str):
        try:
            cleaned_result = result.strip('"').replace('\\"', '"').replace('\\\\', '\\')

            data = json.loads(cleaned_result)

            parsed_results = []
            for item in data:
                item_dict = json.loads(item)
                parsed_results.append(TavilySearchResult(**item_dict))

            return parsed_results
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing Tavily result JSON: {e}")
            return []
    elif isinstance(result, list):
        parsed_results = []
        for item in result:
            if isinstance(item, str):
                try:
                    item_dict = json.loads(item)
                    parsed_results.append(TavilySearchResult(**item_dict))
                except json.JSONDecodeError:
                    continue
            elif isinstance(item, dict) and 'url' in item and 'content' in item:
                parsed_results.append(TavilySearchResult(**item))
        return parsed_results

    return []


async def search_with_tavily(urls: List[str]) -> List[List[TavilySearchResult]]:
    tavily_client = TavilyClient(api_key=tavily_api_key)

    async def search_url(url):
        try:
            result = await asyncio.to_thread(tavily_client.get_search_context, url, search_depth="advanced")
            parsed_result = parse_tavily_result(result)
            return parsed_result
        except Exception as e:
            logger.error(f"Error in Tavily search for {url}: {str(e)}")
            return []

    return await asyncio.gather(*[search_url(url) for url in urls])


def analyze_social_media_data(social_data):
    analysis = {
        "total_followers": 0,
        "total_posts": 0,
        "engagement_rate": 0,
        "top_posts": [],
        "platform_details": {}
    }

    for platform, data in social_data.items():
        if isinstance(data, list) and len(data) > 0:
            platform_data = data[0]
            analysis["platform_details"][platform] = []

            if platform == "Facebook":
                analysis["total_followers"] += platform_data.get("fanCount", 0)
                analysis["total_posts"] += len(data)
            elif platform == "Instagram":
                analysis["total_followers"] += platform_data.get("followersCount", 0)
                analysis["total_posts"] += platform_data.get("postsCount", 0)
            elif platform == "X":
                analysis["total_followers"] += platform_data.get("followersCount", 0)
                analysis["total_posts"] += platform_data.get("tweetsCount", 0)

            sorted_posts = sorted(data, key=lambda x: x.get("likesCount", 0) + x.get("commentsCount", 0), reverse=True)
            analysis["top_posts"].extend(sorted_posts[:3])

            for index, post in enumerate(data[:5]):  # Limit to top 5 posts
                post_details = {
                    "URL": post.get("url", "N/A"),
                    "Text": post.get("text", "N/A"),
                    "Time Since Posted": post.get("timeSincePosted", "N/A"),
                    "Author": post.get("authorName", "N/A")
                }

                if platform == "LinkedIn":
                    post_details.update({
                        "Likes": post.get("numLikes", 0),
                        "Shares": post.get("numShares", 0),
                        "Comments": post.get("numComments", 0)
                    })
                elif platform == "Instagram":
                    post_details.update({
                        "Username": post.get("username", "N/A"),
                        "Followers": post.get("followersCount", 0),
                        "Biography": post.get("biography", "N/A"),
                        "External Link": post.get("externalUrl", "N/A")
                    })
                elif platform == "X":
                    post_details.update({
                        "Full Text": post.get("full_text", "N/A"),
                        "Likes": post.get("favorite_count", 0),
                        "Permalink": f"https://x.com{post.get('permalink', '')}"
                    })
                elif platform == "Facebook":
                    post_details.update({
                        "Facebook URL": post.get("facebookUrl", "N/A"),
                        "Post Text": post.get("text", "N/A"),
                        "Likes": post.get("likes", 0)
                    })
                elif platform == "YouTube":
                    post_details.update({
                        "Video Title": post.get("title", "N/A"),
                        "Views": post.get("viewCount", 0),
                        "Channel Name": post.get("channelName", "N/A"),
                        "Subscribers": post.get("numberOfSubscribers", 0)
                    })

                analysis["platform_details"][platform].append(post_details)

    if analysis["total_followers"] > 0 and analysis["total_posts"] > 0:
        total_engagement = sum(post.get("likesCount", 0) + post.get("commentsCount", 0) for post in analysis["top_posts"])
        analysis["engagement_rate"] = (total_engagement / (analysis["total_followers"] * analysis["total_posts"])) * 100

    return analysis

class DetailedWebScraper:
    @staticmethod
    async def scrape_with_jina(url: str):
        headers = {"Authorization": f"Bearer {jina_api_key}"}
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post("https://r.jina.ai", json={"url": url}, headers=headers)
            return response.json() if response.status_code == 200 else await DetailedWebScraper.fallback_scraper(url)
        except Exception as e:
            logger.error(f"Error in Jina scraping for {url}: {str(e)}")
            return await DetailedWebScraper.fallback_scraper(url)


def parse_tavily_result(result: Any) -> List[TavilySearchResult]:
    if isinstance(result, str):
        try:
            cleaned_result = result.strip('"').replace('\\"', '"').replace('\\\\', '\\')

            data = json.loads(cleaned_result)

            parsed_results = []
            for item in data:
                item_dict = json.loads(item)
                parsed_results.append(TavilySearchResult(**item_dict))

            return parsed_results
        except json.JSONDecodeError as e:
            logger.error(f"Error parsing Tavily result JSON: {e}")
            return []
    elif isinstance(result, list):
        parsed_results = []
        for item in result:
            if isinstance(item, str):
                try:
                    item_dict = json.loads(item)
                    parsed_results.append(TavilySearchResult(**item_dict))
                except json.JSONDecodeError:
                    continue
            elif isinstance(item, dict) and 'url' in item and 'content' in item:
                parsed_results.append(TavilySearchResult(**item))
        return parsed_results

    return []

async def search_with_tavily(urls: List[str]) -> List[List[TavilySearchResult]]:
    tavily_client = TavilyClient(api_key=tavily_api_key)

    async def search_url(url):
        try:
            result = await asyncio.to_thread(tavily_client.get_search_context, url, search_depth="advanced")
            parsed_result = parse_tavily_result(result)
            return parsed_result
        except Exception as e:
            logger.error(f"Error in Tavily search for {url}: {str(e)}")
            return []

    return await asyncio.gather(*[search_url(url) for url in urls])

class SocialMediaScraper:
    @staticmethod
    def extract_username_from_url(url: str) -> str:
        # Função para extrair o username do Instagram, Twitter ou LinkedIn
        if "instagram.com" in url:
            match = re.search(r"instagram\.com/([^/]+)/?", url)
        elif "twitter.com" in url:
            match = re.search(r"twitter\.com/([^/]+)/?", url)
        elif "linkedin.com" in url:
            match = re.search(r"linkedin\.com/in/([^/]+)/?", url)
        else:
            return None

        if match:
            return match.group(1)
        return None

    @staticmethod
    def extract_social_media_links(website_url: str):
        social_media_domains = {
            "facebook.com": "Facebook",
            "twitter.com": "X",
            "instagram.com": "Instagram",
            "linkedin.com": "LinkedIn",
            "youtube.com": "YouTube"
        }
        social_links = {}
        try:
            response = requests.get(website_url, timeout=10)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            for a_tag in soup.find_all('a', href=True):
                href = a_tag['href'].lower()
                for domain, platform in social_media_domains.items():
                    if domain in href and platform not in social_links:
                        social_links[platform] = href
                        break
        except Exception as e:
            logging.error(f"Error extracting social media links from {website_url}: {e}")
        return social_links

    @staticmethod
    async def scrape_social_media(platform: str, url: str):
        scraper_id_map = {
            "Facebook": "apify/facebook-posts-scraper",
            "Instagram": "apify/instagram-profile-scraper",
            "X": "quacker/twitter-scraper",
            "YouTube": "streamers/youtube-scraper",
            "LinkedIn": "anchor/linkedin-profile-enrichment"
        }
        scraper_id = scraper_id_map.get(platform)

        if scraper_id:
            try:

                # Configurações específicas para cada plataforma
                if platform == "LinkedIn":
                    run_input = {
                        "urls": [url]
                    }
                elif platform == "Instagram":
                    username = SocialMediaScraper.extract_username_from_url(url)
                    run_input = {
                        "usernames": [username],
                    }
                elif platform == "Facebook":
                    run_input = {"startUrls": [{"url": url}], "maxResults": 5}
                elif platform == "YouTube":
                    run_input = {
                        "startUrls": [{"url": url}],
                        "maxResults": 5,
                        "maxResultsShorts": 5,
                        "maxResultStreams": 5
                    }
                elif platform == "X":
                    handle = SocialMediaScraper.extract_username_from_url(url)
                    run_input = {
                    "handles": [handle]
                    }
                else:
                    run_input = {"profiles": [url]}

                # Faz a chamada ao scraper da Apify
                run = apify_client.actor(scraper_id).call(run_input=run_input)

                if run.get("status") == "SUCCEEDED":
                    dataset_id = run.get("defaultDatasetId")
                    items = apify_client.dataset(dataset_id).list_items().items
                    return items[:5]
                else:
                    print(f"Failed to scrape {url} on {platform}")
                    return f"Failed to scrape {url}"

            except Exception as e:
                print(f"Error scraping {url} on {platform}: {e}")
                return f"Error scraping {url}: {e}"
        else:
            print(f"No scraper available for {platform}")
            return f"No scraper available for {platform}"


@celery_app.task(name='process_pdf_task')
def process_pdf_task(project_id: str, folder_name: str, project_data: dict):
    try:
        logging.info(
            f"Starting PDF processing task for project_id: {project_id}")

        # Cria um novo event loop para executar código assíncrono
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        # Execute funções assíncronas dentro do loop
        try:
            # Executa análise de competidores
            competitors = loop.run_until_complete(
                find_competitors_perplexity(project_data.get("Business Name"),
                                            project_data.get("Link")))

            # Executa busca Tavily
            competitor_websites = [comp.url for comp in competitors]
            tavily_results = loop.run_until_complete(
                search_with_tavily(competitor_websites))

            # Coleta links sociais (função síncrona, não precisa do loop)
            social_links = {}
            for competitor, results in zip(competitors, tavily_results):
                competitor_social_links = {}
                for result in results:
                    extracted_links = SocialMediaScraper.extract_social_media_links(
                        result.url)
                    competitor_social_links.update(extracted_links)
                social_links[competitor.name] = competitor_social_links

            # Coleta dados sociais
            social_data = {}
            for competitor_name, links in social_links.items():
                competitor_social_data = {}
                for platform, link in links.items():
                    # Executa o scraping de forma assíncrona
                    scraped_data = loop.run_until_complete(
                        SocialMediaScraper.scrape_social_media(platform, link))
                    competitor_social_data[platform] = scraped_data
                social_data[competitor_name] = competitor_social_data

        finally:
            # Sempre feche o loop quando terminar
            loop.close()

        competitor_analysis = []
        for competitor in competitors:
            analysis = analyze_social_media_data(
                social_data.get(competitor.name, {}))
            competitor_analysis.append({
                **competitor.dict(), "social_media_analysis":
                analysis
            })

        # Gera PDF
        project_name = project_data.get("Project Name", "Project")
        pdf_content = generate_competitor_analysis_pdf(competitor_analysis, project_data)
        pdf_path = f"/app/pdfs/{project_name.replace(' ', '_')}_competitor_analysis.pdf"

        with open(pdf_path, "wb") as pdf_file:
            pdf_file.write(pdf_content.getvalue())

        # Atualiza Notion
        notion_data = {"properties": {"Approved": {"checkbox": True}}}
        response = requests.patch(f"{NOTION_API_URL}/{project_id}",
                                  headers=headers,
                                  json=notion_data)

        if response.status_code != 200:
            raise Exception(f"Failed to update Notion: {response.text}")

        return {
            "success": True,
            "pdf_path": pdf_path,
            "message": "PDF processed successfully"
        }

    except Exception as e:
        logging.error(f"Error processing PDF: {str(e)}")
        raise

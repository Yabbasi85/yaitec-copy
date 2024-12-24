import json
import re
from bs4 import BeautifulSoup
from fastapi import FastAPI, HTTPException
from langchain_community.chat_models import ChatPerplexity
from langchain_core.messages import HumanMessage
from apify_client import ApifyClient
from typing import List, Dict, Any, Optional
import asyncio
import httpx
import os
from pydantic import BaseModel, Field
import logging
import requests
from tavily import TavilyClient

logger = logging.getLogger(__name__)

app = FastAPI()

# Environment variables configuration
jina_api_key = os.getenv("JINA_API_KEY")
tavily_api_key = os.getenv("TAVILY_API_KEY")
apify_token = os.getenv("APIFY_API_TOKEN")
perplexity_key = os.getenv("PERPLEXITY_API_KEY")
apify_client = ApifyClient(apify_token)

class CompetitorInfo(BaseModel):
    name: str
    description: str
    url: str
    products: Optional[List[str]] = Field(default_factory=list)
    services: Optional[List[str]] = Field(default_factory=list)
    about: Optional[str] = None
    vision: Optional[str] = None
    history: Optional[str] = None

class TavilySearchResult(BaseModel):
    url: str
    content: str

class CompetitorAnalysis(BaseModel):
    info: CompetitorInfo
    tavily_search: List[TavilySearchResult] = Field(default_factory=list)
    jina_summary: Dict[str, Any] = Field(default_factory=dict)
    social_media_data: Dict[str, Any] = Field(default_factory=dict)

class BrandAnalysis(BaseModel):
    name: str
    website: str
    product: str
    location: str
    tavily_search: List[TavilySearchResult] = Field(default_factory=list)
    jina_summary: Dict[str, Any] = Field(default_factory=dict)
    social_media_data: Dict[str, Any] = Field(default_factory=dict)
    competitors: List[CompetitorInfo] = Field(default_factory=list)
    products: Optional[List[str]] = Field(default_factory=list)
    services: Optional[List[str]] = Field(default_factory=list)
    about: Optional[str] = None
    vision: Optional[str] = None
    history: Optional[str] = None
    extracted_social_links: List[str] = []

class DetailedWebScraper:
    @staticmethod
    async def scrape_with_jina(url: str) -> Dict[str, Any]:
        headers = {"Authorization": f"Bearer {jina_api_key}"}
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post("https://r.jina.ai", json={"url": url}, headers=headers)
            return response.json() if response.status_code == 200 else await DetailedWebScraper.fallback_scraper(url)
        except Exception as e:
            logger.error(f"Error in Jina scraping for {url}: {str(e)}")
            return await DetailedWebScraper.fallback_scraper(url)

    @staticmethod
    async def fallback_scraper(url: str) -> Dict[str, Any]:
        return {"error": f"Failed to process scraping for {url}."}

async def find_competitors_perplexity(name: str, product: str, location: str, website: str) -> List[CompetitorInfo]:
    chat_perplexity = ChatPerplexity(api_key=perplexity_key)
    
    prompt = f"""As an industry expert, identify and describe five main competitors for {name} (website: {website}) in the {product} sector in {location}.
    Focus on companies that offer similar products or services. Provide detailed and accurate information for each competitor.

    For each competitor, provide the following information:
    - Name: Full company name
    - Description: A concise description focusing on their capabilities and how they compete with {name}
    - Website URL: Official company website
    - Products: List of main products or solutions related to {product}
    - Services: List of main services offered in the {product} sector
    - About: A brief statement about the company's role in the {product} industry
    - Vision: The company's vision or mission statement related to their work in {product}
    - History: Brief company history, focusing on their development in {product} and relevant achievements

    Ensure all information is accurate, up-to-date, and directly related to the {product} industry. Avoid generic descriptions and focus on each company's unique offerings and strengths in this specific sector.

    Format the response as a JSON array of objects with 'name', 'description', 'url', 'products', 'services', 'about', 'vision', and 'history' fields.

    Example format:
    [
        {{
            "name": "Example Corp",
            "description": "Leading provider of {product} solutions, directly competing with {name} in {location}",
            "url": "https://examplecorp.com",
            "products": ["Product A - Advanced Solution", "Product B - Innovative Tool"],
            "services": ["Custom Development", "Integration Consulting"],
            "about": "Example Corp is at the forefront of {product} technology, providing cutting-edge solutions for businesses in {location}",
            "vision": "To revolutionize the {product} industry through innovative technologies",
            "history": "Founded in 2015, Example Corp has rapidly grown to become a key player in {product}, with notable projects for major companies in {location}"
        }},
        // ... (repeat for other competitors)
    ]

    Ensure all competitors are relevant to the {product} industry and offer services that directly compete with or complement {name}'s offerings in {location}.
    """
    
    messages = [HumanMessage(content=prompt)]
    
    try:
        response = await chat_perplexity.ainvoke(messages)
        
        json_start = response.content.find('[')
        json_end = response.content.rfind(']') + 1
        
        if json_start != -1 and json_end != -1:
            json_str = response.content[json_start:json_end]
            competitors_data = json.loads(json_str)
        else:
            raise ValueError("No valid JSON found in the response")
        
        if not competitors_data or not isinstance(competitors_data, list):
            raise ValueError("Invalid response format from Perplexity API")
        
        return [CompetitorInfo(**comp) for comp in competitors_data]
    except Exception as e:
        logger.error(f"Error in find_competitors_perplexity: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing Perplexity API response: {str(e)}")
    

class SocialMediaScraper:
    
    @staticmethod
    def format_cookies_as_string(cookies_list):
        return '; '.join([f"{cookie['name']}={cookie['value']}" for cookie in cookies_list])


    @staticmethod
    def extract_social_media_links(website_url: str) -> Dict[str, str]:
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
            print(f"Error extracting social media links from {website_url}: {e}")

        return social_links
    
    @staticmethod
    async def scrape_social_media(platform: str, url: str) -> Any:
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

async def fetch_social_media_data(social_links: List[str]) -> List[Dict]:
    client = ApifyClient(apify_token)
    
    async def fetch_data(link):
        try:
            run = await asyncio.to_thread(client.actor("apify/social-media-scraper").call, run_input={"url": link})
            return await asyncio.to_thread(run.fetch_output_dataset)
        except Exception as e:
            logger.error(f"Error fetching social media data for {link}: {str(e)}")
            return {"error": f"Failed to fetch data for {link}: {str(e)}"}
    
    return await asyncio.gather(*[fetch_data(link) for link in social_links])


async def analyze_business(name: str, product: str, website: str, social_media: str, location: str) -> BrandAnalysis:
    try:
        # Step 1: Obtain competitor data using Perplexity
        competitors_data = await find_competitors_perplexity(name, product, location, website)

        # Competitor URLs to gather additional information using Tavily and scraping
        competitor_urls = [comp.url for comp in competitors_data]

        # Step 2: Perform Tavily Search on competitor websites
        tavily_results_nested = await search_with_tavily(competitor_urls)
        tavily_results = [result for sublist in tavily_results_nested for result in sublist] if isinstance(tavily_results_nested[0], list) else tavily_results_nested
        # Step 3: Perform detailed scraping with Jina for competitor URLs
        jina_summaries = await asyncio.gather(*[DetailedWebScraper.scrape_with_jina(url) for url in competitor_urls])

        tavily_results_flattened = [result for sublist in tavily_results for result in sublist] if isinstance(tavily_results[0], list) else tavily_results

        # Step 4: Extract competitor social media links from Tavily results
        extracted_social_links = {}
        for tavily_result in tavily_results_flattened:
            if hasattr(tavily_result, 'url'):
                social_links = SocialMediaScraper.extract_social_media_links(tavily_result.url)
                if social_links:
                    extracted_social_links[tavily_result.url] = social_links

        # Step 5: Scrape data from extracted competitor social media links
        scraped_social_data = {}
        for competitor_url, links in extracted_social_links.items():
            competitor_social_data = {}
            for platform, link in links.items():
                scraped_data = await SocialMediaScraper.scrape_social_media(platform, link)
                if isinstance(scraped_data, list):
                    competitor_social_data[platform] = scraped_data[:5]  
                else:
                    competitor_social_data[platform] = [scraped_data]  
            scraped_social_data[competitor_url] = competitor_social_data

        # Step 6: Assemble the brand analysis result
        main_brand = BrandAnalysis(
            name=name,
            website=website,
            product=product,
            location=location,
            tavily_search=tavily_results,
            jina_summary={competitor.name: summary for competitor, summary in zip(competitors_data, jina_summaries)},
            social_media_data=scraped_social_data,
            competitors=competitors_data,
            extracted_social_links=[link for links in extracted_social_links.values() for link in links.values()]
        )

        return main_brand

    except Exception as e:
        logger.error(f"Error in brand voice analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error in brand voice analysis: {str(e)}")



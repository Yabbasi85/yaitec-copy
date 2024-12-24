from openai import OpenAI
import os
from dotenv import load_dotenv
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.document_loaders import WebBaseLoader

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def analyze_brand_voice(name: str, website: str, social_media: str):
    # Fetch website content
    # async with httpx.AsyncClient() as http_client:
    #     website_response = await http_client.get(website)
    #     website_content = website_response.text

    # app = FirecrawlApp(api_key='fc-0bd58cb86d3c4b06995c8b4e1721ef7a')
    # website_content = app.scrape_url(url=social_media)
    # print(f"Website content {website_content}")

    loader = WebBaseLoader(website)
    docs = loader.load()

    website_content = " ".join(" ".join(doc.page_content.split()) for doc in docs)
    print(f"Website content: {website_content}")

    # # social_media = social_media.rstrip('/').split('/')[-1].lstrip('@')
    # # # Fetch Instagram content
    # # ig = instaloader.Instaloader()
    # # profile = instaloader.Profile.from_username(ig.context, social_media)

    # # # OpenAI API Key
    # # api_key = os.getenv("OPENAI_API_KEY")

    # # def get_latest_profile_pic(username):
    # #     user_dir = os.path.join(os.getcwd(), username)
    # #     if not os.path.exists(user_dir):
    # #         return None
    # #     profile_pics = [f for f in os.listdir(user_dir) if f.endswith("_profile_pic.jpg")]
    # #     return os.path.join(user_dir, max(profile_pics, key=lambda f: os.path.getmtime(os.path.join(user_dir, f)))) if profile_pics else None

    # # # Function to encode the image
    # # def encode_image(image_path):
    # #     with open(image_path, "rb") as image_file:
    # #         return base64.b64encode(image_file.read()).decode('utf-8')

    # # ig.download_profile(social_media, profile_pic_only=True)

    # # # Getting the base64 string
    # # base64_image = encode_image(get_latest_profile_pic(social_media))

    # # headers = {
    # # "Content-Type": "application/json",
    # # "Authorization": f"Bearer {api_key}"
    # # }

    # # payload = {
    # # "model": "gpt-4o-2024-08-06",
    # # "messages": [
    # #     {
    # #     "role": "user",
    # #     "content": [
    # #         {
    # #         "type": "text",
    # #         "text": "Give me a detailed description of this image, from a brand analyze perspective, with design, color palette, tone and any detail relevant"
    # #         },
    # #         {
    # #         "type": "image_url",
    # #         "image_url": {
    # #             "url": f"data:image/jpeg;base64,{base64_image}"
    # #         }
    # #         }
    # #     ]
    # #     }
    # # ],
    # # "max_tokens": 300
    # # }

    # # response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

    # # profile_description = response.json()['choices'][0]['message']['content']

    # social_media_content = f"""
    # Instagram Profile:
    # Username: {profile.username}
    # Number of Posts: {profile.mediacount}
    # Followers: {profile.followers}
    # Following: {profile.followees}
    # Bio: {profile.biography}
    # Image profile description: {profile_description}
    # """
    # print(f"Social media content: {social_media_content}")

    # Analyze using OpenAI
    response = client.chat.completions.create(
        model="gpt-4o-2024-08-06",
        messages=[
            {"role": "system", "content": """
            You are a brand voice analysis expert. Analyze the provided website content and Instagram profile to determine the brand voice and key characteristics.
            Provide a detailed analysis in the following format:
            
            # Brand Voice Analysis

            ## Tone
            - [List key tones, e.g., professional, friendly, innovative]

            ## Language
            - [Describe the type of language used, e.g., technical, conversational, formal]

            ## Style
            - [Describe the writing style, e.g., concise, descriptive, storytelling]

            ## Key Messages
            - [List main themes or messages conveyed]

            ## Unique Selling Proposition
            - [Identify the unique value proposition]

            ## Target Audience
            - [Describe the apparent target audience]

            ## Content Themes
            - [List main content themes or topics]

            ## Call-to-Actions
            - [List common CTAs used]

            ## Example Phrases
            - [List 3-5 example phrases that embody the brand voice]
            """},
            {"role": "user", "content": f"Website content: {website_content}"}
        ]
    )
    
    analysis = response.choices[0].message.content
    
    return {"brand_voice_analysis": analysis}
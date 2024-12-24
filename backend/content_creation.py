from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

PLATFORM_PROMPTS = {
    "Facebook": "Create engaging Facebook posts that encourage user interaction and sharing.",
    "Instagram": "Design visually appealing Instagram posts with compelling captions and relevant hashtags.",
    "LinkedIn": "Craft professional LinkedIn posts that showcase industry expertise and company achievements.",
    "TikTok": "Develop trendy and creative TikTok video concepts that align with current platform trends.",
    "Twitter": "Compose concise and impactful tweets that spark conversations and utilize relevant hashtags.",
    "YouTube": "Outline engaging YouTube video concepts with compelling titles and descriptions."
}

async def create_content(competitor_brand_voices, platforms, campaign_duration, posts_per_month, goals, reference_files=None):
    content_plan = {}
    
    for platform in platforms:
        prompt = f"""
        Create a {campaign_duration}-month content plan for {platform} with {posts_per_month} posts per month.
        
        Consider the following competitor brand voices:
        {' '.join(competitor_brand_voices)}
        
        Campaign goals: {', '.join(goals)}
        
        {PLATFORM_PROMPTS.get(platform, "Create engaging content for this platform.")}
        
        For each month, provide:
        1. Monthly theme
        2. Content ideas for each post (title/concept)
        3. Relevant holidays or events to incorporate
        4. Specific call-to-actions
        
        If applicable, include ideas for:
        - Ad campaigns
        - Email marketing campaigns
        - Landing page concepts
        
        Ensure all content aligns with the brand voice and campaign goals.
        """
        
        if reference_files:
            prompt += f"\nReference files to consider: {', '.join(reference_files)}"
        
        
        response = client.chat.completions.create(
            model="gpt-4o-2024-08-06",
            messages=[
                {"role": "system", "content": "You are an expert content creator and marketing strategist."},
                {"role": "user", "content": prompt}
            ]
        )
        
        content_plan[platform] = response.choices[0].message.content
    
    return content_plan

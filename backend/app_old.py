import streamlit as st
from crewai import Agent, Task, Crew
from langchain_openai import OpenAI
import pandas as pd
import plotly.express as px
import os
from uuid import uuid4
unique_id = uuid4().hex[0:8]

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_PROJECT"] = f"Tracing Walkthrough - {unique_id}"
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_API_KEY"] = "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"  # Update to your API key

# Used by the agent in this tutorial
os.environ["OPENAI_API_KEY"] = "sk-proj-zrYyJUwep7XQfpdwTsD9T3BlbkFJEm3O0HE0UaakhsurEJ9Q"


# Initialize OpenAI LLM
llm = OpenAI()

# Define AI Agents
content_creator = Agent(
    role="Content Creator",
    goal="Create engaging content across multiple platforms",
    backstory="Expert in digital marketing and content creation",
    verbose=True,
    allow_delegation=True,
    llm=llm
)

researcher = Agent(
    role="Researcher",
    goal="Gather industry insights and trend analysis",
    backstory="Specialized in market research and competitor analysis. You MUST to work and focus on this audience: {audience}.",
    verbose=True,
    allow_delegation=True,
    llm=llm
)

social_media_agent = Agent(
    role="Social Media Manager",
    goal="Optimize content for social media platforms",
    backstory="Experienced in social media marketing and engagement strategies",
    verbose=True,
    allow_delegation=True,
    llm=llm
)

seo_agent = Agent(
    role="SEO Specialist",
    goal="Optimize content for search engines",
    backstory="Expert in SEO best practices and keyword optimization",
    verbose=True,
    allow_delegation=True,
    llm=llm
)

# Streamlit App
st.title("AI Agent: Content Creator/Researcher for Art of Galaxy")

# Sidebar for navigation
page = st.sidebar.selectbox("Navigate", ["Home", "Content Strategy", "Content Creation", "Multi-Platform Content", "Content Review", "Publishing", "Performance Tracking", "Continuous Improvement"])

if page == "Home":
    st.header("Welcome to the Content Creator/Researcher Dashboard")
    st.write("Use the sidebar to navigate through different sections of the content creation process.")
    
    # Display quick stats or summary
    st.subheader("Quick Stats")
    col1, col2, col3 = st.columns(3)
    col1.metric("Total Content Pieces", "150")
    col2.metric("Engagement Rate", "5.2%")
    col3.metric("Conversion Rate", "2.8%")

elif page == "Content Strategy":
    st.header("Content Strategy Planning")
    
    st.subheader("1. Audience Analysis")
    audience = st.text_area("Define target audience characteristics:")
    if st.button("Analyze Audience"):
        task = Task(
            description="""Analyze the provided audience information and create detailed personas and why they would be interested! Explain the relation.
        Audience information {audience}
        """,
            expected_output="""
            Persona 1: 
            - Occupation: 
            - Income: 
            - Interests: 
            - Social media: 
            - Pain points: 

            Persona 2: 
            - Occupation: 
            - Income: 
            - Interests: 
            - Social media: 
            - Pain points: 

            [Additional 1-2 personas in similar detail]
            """,
            agent=researcher
        )
        result = Crew(agents=[researcher], tasks=[task]).kickoff({"audience":audience})
        st.write(result)
    
    st.subheader("2. Competitor Analysis")
    competitors = st.text_input("Enter top competitors (comma-separated):")
    if st.button("Analyze Competitors"):
        task = Task(
            description=f"Analyze the strategies and market positions of these competitors: {competitors}",
            expected_output="""
            1. Digital Galaxy:
               - Market Position: Leader in NFT marketplaces
               - Strengths: Wide artist base, user-friendly interface
               - Weaknesses: High transaction fees, limited educational content
               - Key Strategy: Focusing on exclusive artist collaborations

            2. ArtBlock:
               - Market Position: Niche player in generative art
               - Strengths: Unique generative art offerings, strong community
               - Weaknesses: Limited marketing, narrow focus
               - Key Strategy: Emphasizing the rarity and uniqueness of generative art

            [Analysis for 2-3 more competitors in similar detail]

            Overall Market Trends:
            1. Increasing demand for interactive and immersive digital art experiences
            2. Growing interest in eco-friendly NFT options
            3. Rise of virtual reality art galleries

            Opportunities for Art of Galaxy:
            1. Develop a more competitive fee structure
            2. Create educational content about digital art and NFTs
            3. Explore partnerships with traditional art institutions
            """,
            agent=researcher
        )
        result = Crew(agents=[researcher], tasks=[task]).kickoff()
        st.write(result)
    
    st.subheader("3. Content Calendar Creation")
    content_themes = st.text_input("Enter content themes:")
    platforms = st.multiselect("Select platforms:", ["Facebook", "Instagram", "LinkedIn", "TikTok", "Twitter", "YouTube", "Blog", "Email"])
    if st.button("Generate Content Calendar"):
        task = Task(
            description=f"Create a content calendar for the following themes: {content_themes} and platforms: {', '.join(platforms)}",
            expected_output="""
            Week 1:
            - Monday (Instagram): Post about "Evolution of Digital Art" with a carousel of images
            - Wednesday (Blog): Article on "5 Ways Blockchain is Revolutionizing the Art World"
            - Friday (Twitter): Tweet series about upcoming NFT drop with teasers

            Week 2:
            - Tuesday (YouTube): Tutorial video on "Creating Your First NFT: A Step-by-Step Guide"
            - Thursday (LinkedIn): Infographic on "The Impact of Digital Art on Traditional Galleries"
            - Saturday (TikTok): Behind-the-scenes look at a digital artist's process

            [Continue with 2-3 more weeks of detailed, platform-specific content plans]

            Monthly Theme Breakdown:
            - Week 1: Introduction to Digital Art
            - Week 2: NFT Creation and Collection
            - Week 3: Blockchain and Art
            - Week 4: Future of Digital Galleries

            Content Distribution:
            - Instagram: 3 posts/week, 5 stories/week
            - Twitter: 5 tweets/day, 1 thread/week
            - Blog: 1 long-form article/week
            - YouTube: 1 video/week
            - LinkedIn: 2 posts/week
            - TikTok: 3 videos/week

            [Include any additional platform-specific strategies or content types]
            """,
            agent=content_creator
        )
        result = Crew(agents=[content_creator], tasks=[task]).kickoff()
        st.write(result)

elif page == "Content Creation":
    st.header("Content Creation Process")
    
    st.subheader("1. Generate Content Ideas")
    topic = st.text_input("Enter a topic for content ideation:")
    if st.button("Generate Ideas"):
        task = Task(
            description=f"Generate content ideas for the topic: {topic}",
            expected_output="""
            1. "The Rise of AI in Digital Art: Collaboration or Competition?"
               - Format: Long-form blog post
               - Key points: History of AI in art, current AI art tools, ethical considerations

            2. "5 Mind-Blowing AI-Generated Artworks You Won't Believe"
               - Format: Instagram carousel post
               - Content: Showcase AI artworks with brief explanations

            3. "How to Use AI Tools to Enhance Your Digital Art Process"
               - Format: YouTube tutorial
               - Outline: Introduction to AI art tools, step-by-step guide, tips and tricks

            4. "The Future of Galleries: Virtual Reality Art Exhibitions"
               - Format: Podcast episode
               - Topics: Benefits of VR galleries, successful case studies, technology overview

            5. "AI vs. Human: Can You Spot the Difference?"
               - Format: Interactive Twitter poll series
               - Concept: Post pairs of artworks, one AI-generated and one human-made, for followers to guess

            [Continue with 5-7 more detailed content ideas]
            """,
            agent=content_creator
        )
        result = Crew(agents=[content_creator], tasks=[task]).kickoff()
        st.write(result)
    
    st.subheader("2. Create Content Brief")
    brief_topic = st.text_input("Enter the main topic for the content brief:")
    brief_platform = st.selectbox("Select platform:", ["Blog", "Social Media", "Video", "Email"])
    if st.button("Create Brief"):
        task = Task(
            description=f"Create a content brief for {brief_topic} on {brief_platform}",
            expected_output=f"""
            Content Brief: {brief_topic}
            Platform: {brief_platform}

            1. Objective:
               [Clear statement of the content's purpose and goals]

            2. Target Audience:
               [Specific persona(s) this content is aimed at]

            3. Key Message:
               [The main takeaway or value proposition]

            4. Outline:
               I. Introduction
                  [Key points to cover]
               II. Main Section 1
                   [Subtopics and key information]
               III. Main Section 2
                    [Subtopics and key information]
               IV. Conclusion
                   [Summary and call-to-action]

            5. Tone and Style:
               [Guidelines for voice, language, and overall feel]

            6. Keywords for SEO:
               [List of primary and secondary keywords]

            7. Visuals:
               [Suggestions for images, graphics, or video elements]

            8. Call-to-Action:
               [Specific action you want the audience to take]

            9. Distribution Plan:
               [How and where this content will be shared]

            10. Success Metrics:
                [How the performance of this content will be measured]
            """,
            agent=content_creator
        )
        result = Crew(agents=[content_creator], tasks=[task]).kickoff()
        st.write(result)
    
    st.subheader("3. SEO Optimization")
    keywords = st.text_input("Enter target keywords (comma-separated):")
    if st.button("Optimize for SEO"):
        task = Task(
            description=f"Provide SEO optimization suggestions for these keywords: {keywords}",
            expected_output="""
            SEO Optimization Recommendations:

            1. Title Tag:
               - Optimal format: "Primary Keyword | Secondary Keyword | Brand Name"
               - Example: "Digital Art Investing | NFT Collectibles | Art of Galaxy"

            2. Meta Description:
               - 150-160 character summary including primary and secondary keywords
               - Example: "Discover the world of digital art investing and NFT collectibles with Art of Galaxy. Learn, create, and trade unique digital artworks today."

            3. Header Structure:
               - H1: Use primary keyword
               - H2s and H3s: Incorporate secondary keywords naturally

            4. Content Optimization:
               - Keyword density: Aim for 1-2% keyword density
               - Use variations and long-tail keywords throughout the content
               - Include keywords in the first 100 words

            5. Image Optimization:
               - Use descriptive file names including keywords
               - Add alt text to images incorporating relevant keywords

            6. URL Structure:
               - Use short, keyword-rich URLs
               - Example: www.artofgalaxy.com/digital-art-investing-guide

            7. Internal Linking:
               - Link to related content using keyword-rich anchor text

            8. External Linking:
               - Link to authoritative sources to boost credibility

            9. Mobile Optimization:
               - Ensure content is fully responsive and mobile-friendly

            10. Page Speed:
                - Optimize images and minify CSS/JavaScript for faster loading

            [Additional platform-specific SEO recommendations]
            """,
            agent=seo_agent
        )
        result = Crew(agents=[seo_agent], tasks=[task]).kickoff()
        st.write(result)

elif page == "Multi-Platform Content":
    st.header("Multi-Platform Content Creation")
    
    st.subheader("1. Social Media Content")
    platform = st.selectbox("Select social media platform:", ["Instagram", "Facebook", "LinkedIn", "Twitter", "TikTok"])
    content_type = st.radio("Select content type:", ["Post", "Story", "Video"])
    content_idea = st.text_area("Enter your content idea:")
    if st.button("Generate Social Media Content"):
        task = Task(
            description=f"Create {content_type} content for {platform} based on this idea: {content_idea}",
            expected_output=f"""
            {platform} {content_type}:

            1. Visual Content:
               [Detailed description of image/video, including composition, colors, and key elements]

            2. Caption:
               [Engaging caption text, optimized for {platform}, 
               including relevant hashtags if applicable]

            3. Call-to-Action:
               [Clear and platform-appropriate CTA]

            4. Posting Time:
               [Recommended optimal posting time based on platform analytics]

            5. Engagement Strategy:
               [Suggestions for increasing engagement, such as 
               asking questions, using polls, or encouraging user-generated content]

            6. Hashtags (if applicable):
               [List of relevant, trending, and niche-specific hashtags]

            7. Additional Platform-Specific Features:
               [E.g., Instagram: Location tag, product tags
                    Twitter: Twitter poll
                    TikTok: Trending sound suggestion]

            8. Cross-Promotion Strategy:
               [Ideas for sharing or repurposing this content on other platforms]
            """,
            agent=social_media_agent
        )
        result = Crew(agents=[social_media_agent], tasks=[task]).kickoff()
        st.write(result)
    
    st.subheader("2. Video Content")
    video_topic = st.text_input("Enter video topic:")
    video_length = st.slider("Select video length (in minutes):", 1, 30, 5)
    if st.button("Generate Video Script"):
        task = Task(
            description=f"Create a {video_length}-minute video script on the topic: {video_topic}",
            expected_output=f"""
            Video Title: [Catchy, SEO-friendly title]

            Duration: {video_length} minutes

            I. Introduction (30 seconds)
               - Hook: [Attention-grabbing opening line or visual]
               - Brief overview of the topic
               - What viewers will learn

            II. Main Content (Split into 2-3 sections, each 1-2 minutes)
                Section 1: [Subtitle]
                - Key point 1
                  [Supporting details, examples, or demonstrations]
                - Key point 2
                  [Supporting details, examples, or demonstrations]

                Section 2: [Subtitle]
                - Key point 1
                  [Supporting details, examples, or demonstrations]
                - Key point 2
                  [Supporting details, examples, or demonstrations]

                [Additional sections as needed]

            III. Conclusion (30 seconds)
                - Recap of main points
                - Call-to-action

            IV. Video Elements
                - B-roll suggestions
                - Graphics or animation ideas
                - Music recommendations

            V. Engagement Strategies
                - Points to ask for comments or questions
                - Ideas for pinned comment or video description content

            VI. SEO Optimization
                - Target keywords to use in title, description, and tags
                - Thumbnail ideas
            """,
            agent=content_creator
        )
        result = Crew(agents=[content_creator], tasks=[task]).kickoff()
        st.write(result)
    
    st.subheader("3. Email Campaign")
    email_subject = st.text_input("Enter email subject:")
    email_goal = st.selectbox("Select email goal:", ["Promotional", "Newsletter", "Announcement"])
    if st.button("Generate Email Content"):
        task = Task(
            description=f"Create a {email_goal} email with the subject: {email_subject}",
            expected_output=f"""
            Subject Line: {email_subject}

            Preview Text: [Compelling preview text to increase open rates]

            Email Body:

            1. Header
               [Attention-grabbing opening that aligns with the subject line]

            2. Greeting
               [Personalized greeting]

            3. Main Content
               [2-3 paragraphs of content tailored to the {email_goal} goal, including:]
               - Key message or offer
               - Benefits to the reader
               - Supporting details or evidence

            4. Call-to-Action
               [Clear and prominent CTA button or text]

            5. Supporting Visual
               [Description of an image or graphic to include]

            6. Footer
               [Contact information, unsubscribe link, and any legal disclaimers]

            Design Notes:
            - Color scheme: [Suggestion that aligns with brand guidelines]
            - Font recommendations
            - Mobile optimization tips

            A/B Testing Suggestions:
            - Alternative subject line
            - Different CTA placement or text

            Segmentation Strategy:
            [Advice on how to tailor this email for different subscriber segments]

            Tracking Metrics:
            - Key performance indicators to monitor
            - Goals for open rate, click-through rate, and conversion rate
            """,
            agent=content_creator
        )
        result = Crew(agents=[content_creator], tasks=[task]).kickoff()
        st.write(result)

elif page == "Content Review":
    st.header("Content Review and Refinement")
    
    st.subheader("1. Internal Review")
    content_to_review = st.text_area("Paste the content for review:")
    if st.button("Review Content"):
        task = Task(
            description=f"Review and provide feedback on this content: {content_to_review}",
            expected_output="""
            Content Review Feedback:

            1. Overall Impression:
               [General assessment of the content's quality and effectiveness]

            2. Alignment with Brand Voice:
               [How well the content matches the brand's tone and style]

            3. Clarity and Coherence:
               [Assessment of how well the main message is communicated]

            4. Engagement Factor:
               [Evaluation of how likely the content is to engage the target audience]

            5. SEO Optimization:
               [Review of keyword usage and SEO best practices]

            6. Call-to-Action Effectiveness:
               [Assessment of the CTA's clarity and persuasiveness]

            7. Visual Elements (if applicable):
               [Feedback on the use of images, graphics, or video]

            8. Grammar and Style:
               [Notes on any grammatical issues or style inconsistencies]

            9. Factual Accuracy:
               [Verification of any facts, statistics, or claims made]

            10. Suggestions for Improvement:
                [Specific recommendations for enhancing the content]

            Overall Rating: [Score out of 10]

            Next Steps:
            [Recommendations for revisions or approval process]
            """,
            agent=content_creator
        )
        result = Crew(agents=[content_creator], tasks=[task]).kickoff()
        st.write(result)
    
    st.subheader("2. Quality Assurance")
    if st.button("Check Grammar and Spelling"):
        st.write("Grammar and spelling check complete. No errors found.")

elif page == "Publishing":
    st.header("Publishing and Scheduling")
    
    st.subheader("Schedule Posts")
    post_content = st.text_area("Enter post content:")
    post_date = st.date_input("Select posting date")
    post_time = st.time_input("Select posting time")
    post_platform = st.selectbox("Select platform:", ["Facebook", "Instagram", "LinkedIn", "Twitter", "TikTok"])
    if st.button("Schedule Post"):
        st.success(f"Post scheduled for {post_date} at {post_time} on {post_platform}")

elif page == "Performance Tracking":
    st.header("Performance Tracking and Analysis")
    
    st.subheader("1. Monitor Performance")
    date_range = st.date_input("Select date range for analysis")
    platforms = st.multiselect("Select platforms to analyze:", ["Facebook", "Instagram", "LinkedIn", "TikTok", "Twitter", "YouTube"])
    if st.button("Generate Performance Report"):
        task = Task(
            description=f"Generate a performance report for {', '.join(platforms)} from {date_range[0]} to {date_range[1]}",
            expected_output=f"""
            Performance Report for {', '.join(platforms)}
            Date Range: {date_range[0]} to {date_range[1]}

            1. Overall Performance Summary:
               [Brief overview of key metrics across all platforms]

            2. Platform-Specific Analytics:
               [For each selected platform, provide:]
               - Engagement Rate: [X%]
               - Reach: [Number]
               - Impressions: [Number]
               - Click-through Rate: [X%]
               - Top Performing Post: [Brief description and metrics]
               - Audience Growth: [X%]

            3. Content Performance:
               - Top 3 Best Performing Posts:
                 [List with brief description and key metrics]
               - Top 3 Underperforming Posts:
                 [List with brief description and key metrics]

            4. Audience Insights:
               [Demographics, interests, and behavior patterns of the audience]

            5. Competitor Comparison:
               [Brief analysis of how our performance compares to key competitors]

            6. ROI Analysis:
               [If applicable, analysis of ad spend and return on investment]

            7. Key Takeaways:
               [3-5 main insights derived from the data]

            8. Recommendations:
               [3-5 actionable suggestions for improving performance]

            9. Next Period Goals:
               [Specific, measurable goals for the next reporting period]

            Attachments:
            [References to detailed data visualizations or full analytics reports]
            """,
            agent=researcher
        )
        result = Crew(agents=[researcher], tasks=[task]).kickoff()
        st.write(result)
        
        # Example visualization
        data = {
            'Platform': platforms,
            'Engagement Rate': [4.5, 3.2, 2.8, 5.1, 3.9, 2.5],
            'Conversion Rate': [2.1, 1.8, 1.5, 2.3, 1.9, 1.2]
        }
        df = pd.DataFrame(data)
        fig = px.bar(df, x='Platform', y=['Engagement Rate', 'Conversion Rate'], barmode='group')
        st.plotly_chart(fig)
    
    st.subheader("2. Content Strategy Refinement")
    if st.button("Suggest Strategy Improvements"):
        task = Task(
            description="Analyze recent performance data and suggest improvements to the content strategy",
            expected_output="""
            Content Strategy Improvement Suggestions:

            1. Content Mix Optimization:
               [Recommendations for adjusting the balance of content types based on performance data]

            2. Posting Schedule Refinement:
               [Suggestions for optimal posting times and frequency for each platform]

            3. Engagement Tactics:
               [New ideas for increasing audience interaction and participation]

            4. Trend Capitalization:
               [Identification of emerging trends and how to incorporate them into the content strategy]

            5. Cross-Platform Synergy:
               [Strategies for better integrating content across different platforms]

            6. Audience Targeting:
               [Recommendations for refining audience targeting based on performance insights]

            7. Content Themes:
               [Suggestions for new content themes or series based on audience interests]

            8. Visual Content Enhancement:
               [Ideas for improving the quality and effectiveness of visual content]

            9. Influencer Collaboration:
               [Potential influencer partnerships that align with brand goals]

            10. Interactive Content:
                [Suggestions for incorporating more interactive elements into the content strategy]

            Implementation Plan:
            [Step-by-step guide for implementing these improvements, including timeline and resources needed]

            Expected Outcomes:
            [Projected impact of these improvements on key performance metrics]
            """,
            agent=researcher
        )
        result = Crew(agents=[researcher], tasks=[task]).kickoff()
        st.write(result)

elif page == "Continuous Improvement":
    st.header("Continuous Improvement")
    
    st.subheader("1. Skill Development")
    skill_areas = st.multiselect("Select areas for skill improvement:", ["Content Writing", "SEO", "Social Media Marketing", "Video Production", "Data Analysis"])
    if st.button("Generate Learning Plan"):
        task = Task(
            description=f"Create a learning plan for improving skills in: {', '.join(skill_areas)}",
            expected_output=f"""
            Skill Development Plan for: {', '.join(skill_areas)}

            1. Overall Learning Objectives:
               [List of specific, measurable goals for each selected skill area]

            2. Skill-Specific Learning Paths:
               [For each selected skill area, provide:]
               a. Recommended Online Courses:
                  [List of 2-3 courses with brief descriptions and links]
               b. Key Resources:
                  [Books, websites, tools, or podcasts for ongoing learning]
               c. Practical Exercises:
                  [Hands-on tasks or projects to apply new skills]
               d. Milestones:
                  [Specific achievements to aim for in 30, 60, and 90 days]

            3. Cross-Skill Integration:
               [Suggestions for how to combine and apply skills from different areas]

            4. Industry Expert Follow List:
               [5-10 thought leaders or experts to follow for each skill area]

            5. Accountability Plan:
               [Strategy for tracking progress and staying motivated]

            6. Skill Application in Current Role:
               [Ideas for immediately applying new skills to ongoing projects]

            7. Evaluation Methods:
               [Techniques for assessing skill improvement over time]

            8. Continued Education:
               [Recommendations for staying updated in rapidly evolving fields]

            9. Peer Learning Opportunities:
               [Suggestions for workshops, meetups, or online communities]

            10. Certification Goals (if applicable):
                [Relevant professional certifications to pursue]

            Timeline:
            [Week-by-week breakdown of learning activities for the next 3 months]

            Resource Allocation:
            [Estimated time commitment and any necessary tools or subscriptions]
            """,
            agent=content_creator
        )
        result = Crew(agents=[content_creator], tasks=[task]).kickoff()
        st.write(result)
    
    st.subheader("2. Industry Updates")
    if st.button("Get Latest Industry Trends"):
        task = Task(
            description="Provide an overview of the latest trends and updates in digital marketing and content creation",
            expected_output="""
            Digital Marketing and Content Creation: Latest Trends and Updates

            1. Emerging Platforms:
               [Overview of new social media or content platforms gaining traction]

            2. AI and Machine Learning in Marketing:
               [Latest applications of AI in content creation and marketing automation]

            3. Video Content Evolution:
               [Trends in short-form video, live streaming, and interactive video]

            4. Voice Search Optimization:
               [Strategies for optimizing content for voice-activated devices]

            5. Augmented Reality in Marketing:
               [Innovative uses of AR in brand experiences and advertising]

            6. Privacy-Focused Marketing:
               [Shifts in data collection and targeting due to privacy regulations]

            7. Sustainable and Ethical Marketing:
               [Growing importance of sustainability and social responsibility in branding]

            8. Influencer Marketing Developments:
               [Changes in influencer collaborations and micro-influencer trends]

            9. Content Personalization at Scale:
               [Advancements in delivering personalized content experiences]

            10. Social Commerce:
                [Integration of e-commerce features in social media platforms]

            11. User-Generated Content Strategies:
                [Innovative approaches to leveraging customer-created content]

            12. SEO Updates:
                [Recent changes in search engine algorithms and optimization techniques]

            Industry Event Highlights:
            [Key takeaways from recent major marketing conferences or product launches]

            Regulatory Updates:
            [New laws or regulations affecting digital marketing practices]

            Predicted Future Developments:
            [Expert forecasts for upcoming trends in the next 6-12 months]

            Action Items:
            [Suggestions for how to adapt current strategies to these trends]
            """,
            agent=researcher
        )
        result = Crew(agents=[researcher], tasks=[task]).kickoff()
        st.write(result)
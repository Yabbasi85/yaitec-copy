# Multi-Agent Content Creation Platform

This project is a backend implementation for a multi-agent platform that analyzes competitor brand voices and creates comprehensive content marketing plans. It now includes a simple HTML interface for easier interaction with the API.

## Features

1. **Brand Voice Analysis**: Analyzes websites and social media to provide detailed brand voice characteristics.
2. **Content Creation**: Creates multi-platform content plans based on analyzed brand voices and campaign goals.
3. **Competitor Management**: Stores and retrieves competitor information and brand voice analyses.
4. **HTML Interface**: A simple web interface to interact with the API endpoints.

## Tech Stack

- FastAPI
- MongoDB
- OpenAI GPT-4
- Python 3.8+
- Jinja2 (for HTML templates)

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Set up your `.env` file with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   DATABASE_NAME=your_database_name
   OPENAI_API_KEY=your_openai_api_key
   ```
4. Run the application:
   ```
   uvicorn main:app --reload
   ```
5. Open a web browser and navigate to `http://localhost:8000` to access the HTML interface.

## API Endpoints

- GET `/`: Renders the HTML interface
- POST `/brand_voice_analysis`: Analyzes a competitor's website and social media to determine brand voice
- GET `/brand_voice/{competitor_id}`: Retrieves a previously analyzed brand voice
- POST `/content_creator`: Creates a comprehensive content plan based on competitor brand voices and campaign parameters

## Usage

1. Open the HTML interface at `http://localhost:8000`
2. Use the form to add new competitors for brand voice analysis
3. View brand voice analyses by clicking on the "View Brand Voice Analysis" links
4. Use the content creation form to generate content plans based on selected competitor brand voices

## Future Improvements

- Implement user authentication and authorization
- Add more detailed social media analysis capabilities
- Integrate with additional AI models for enhanced analysis and content generation
- Implement file upload functionality for reference materials
- Add visualization tools for content calendars and performance metrics
- Enhance the HTML interface with better styling and more interactive features
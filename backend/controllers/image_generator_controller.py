from datetime import datetime
import os
import httpx
from fastapi import HTTPException
from pymongo import MongoClient
from models.image_generator import ImageGenerationRequest, ImageGenerationResponse

# MongoDB connection (usando variáveis de ambiente)
mongodb_client = MongoClient(os.getenv("MONGODB_URI"))
db = mongodb_client[os.getenv("DATABASE_NAME")]
collection = db['image_generations']

OPENAI_API_URL = "https://api.openai.com/v1/images/generations"

async def generate_image(request: ImageGenerationRequest) -> ImageGenerationResponse:
    # Constructing a more detailed color description
    if len(request.colors) > 1:
        colors_description = f"with a color scheme of {', '.join(request.colors[:-1])}, and {request.colors[-1]}"
    else:
        colors_description = f"in {request.colors[0]} color"

    style_description = " and ".join([f"{style.lower()}" for style in request.styles])

    # Constructing fonts description
    fonts_description = ", ".join(request.fonts)

    # Determine aspect ratio based on social media and post type
    aspect_ratio = "1:1"  # Default square aspect ratio
    if request.social_media == "Instagram" and request.post_type == "Story":
        aspect_ratio = "9:16"
    elif request.social_media == "YouTube":
        aspect_ratio = "16:9"

    prompt = (
        f"Create a {request.mockup_type} mockup for a {request.product} branded as '{request.brand}' "
        f"for {request.social_media} {request.post_type}. "
        f"The packaging should be a {request.element} {colors_description}. "
        f"The overall design should embody a {style_description} style. "
        f"Use the fonts {fonts_description} in the design. "
        f"Ensure the product name '{request.product}' and brand '{request.brand}' are prominently featured. "
        f"The mockup should showcase the {request.element} from multiple angles if possible, "
        f"highlighting its unique features and how it incorporates the {style_description} style. "
        f"The image should be high-resolution, with attention to detail in textures, lighting, and shadows "
        f"to create a realistic and appealing representation of the product. "
        f"The image should be optimized for {request.social_media} {request.post_type} format "
        f"with an aspect ratio of {aspect_ratio}."
    )

    async with httpx.AsyncClient() as client:
        response = await client.post(
            OPENAI_API_URL,
            headers={
                "Authorization": f"Bearer {os.getenv('OPENAI_API_KEY')}",
                "Content-Type": "application/json"
            },
            json={
                "prompt": prompt,
                "n": 1,
                "size": "1024x1024",
                "quality": "hd"
            },
            timeout=60
        )

    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Failed to generate image")

    result = response.json()
    image_url = result['data'][0]['url']

    # Save to MongoDB
    generation_data = {
        "request": request.dict(),
        "image_url": image_url,
        "prompt": prompt,
        "social_media": request.social_media,
        "post_type": request.post_type,
        "timestamp": datetime.now()
    }

    collection.insert_one(generation_data)

    # Return the generated image URL
    return ImageGenerationResponse(image_url=image_url)


#Função de Teste do Replicate 
# # Configurando o token de API do Replicate
# REPLICATE_API_TOKEN = os.getenv("REPLICATE_API_TOKEN")

# # Inicializando o cliente do Replicate
# replicate.Client(api_token=REPLICATE_API_TOKEN)

# async def generate_image(request: ImageGenerationRequest) -> ImageGenerationResponse:
#     # Construindo uma descrição detalhada do prompt com base nas entradas
#     if len(request.colors) > 1:
#         colors_description = f"with a color scheme of {', '.join(request.colors[:-1])}, and {request.colors[-1]}"
#     else:
#         colors_description = f"in {request.colors[0]} color"

#     style_description = " and ".join([f"{style.lower()}" for style in request.styles])

#     # Definindo a proporção de aspecto com base na mídia social e tipo de postagem
#     aspect_ratio = "1:1"  # Padrão quadrado
#     if request.social_media == "Instagram" and request.post_type == "Story":
#         aspect_ratio = "9:16"
#     elif request.social_media == "YouTube":
#         aspect_ratio = "16:9"

#     # Criando o prompt
#     prompt = (
#         f"Create a {request.mockup_type} mockup for a {request.product} branded as '{request.brand}' "
#         f"for {request.social_media} {request.post_type}. "
#         f"The packaging should be a {request.element} {colors_description}. "
#         f"The overall design should embody a {style_description} style. "
#         f"Ensure the product name '{request.product}' and brand '{request.brand}' are prominently featured. "
#         f"The mockup should showcase the {request.element} from multiple angles if possible, "
#         f"highlighting its unique features and how it incorporates the {style_description} style. "
#         f"The image should be high-resolution, with attention to detail in textures, lighting, and shadows "
#         f"to create a realistic and appealing representation of the product. "
#         f"The image should be optimized for {request.social_media} {request.post_type} format "
#         f"with an aspect ratio of {aspect_ratio}."
#     )

#     try:
#         input = {
#     "prompt": "black forest gateau cake spelling out the words \"FLUX SCHNELL\", tasty, food photography, dynamic shot"
# }
#         # Usando a API da Replicate para gerar a imagem com o prompt
#         output = replicate.run(
#               "black-forest-labs/flux-schnell",
#               input=input
#             # input={
#             #     "prompt": prompt,
#             #     "num_outputs": 1,
#             #     "aspect_ratio": aspect_ratio,
#             #     "output_format": "webp",
#             #     "output_quality": 80
#             # }
#         )
#         print('teste Dina', output)
        
#         image_url = output[0]  # Primeiro URL da imagem gerada
#     except Exception as e:
#         print(f"Erro ao gerar a imagem: {e}")
#         raise HTTPException(status_code=500, detail=f"Failed to generate image: {str(e)}")

#     # Salvando no MongoDB
#     generation_data = {
#         "request": request.dict(),
#         "image_url": image_url,
#         "prompt": prompt,
#         "social_media": request.social_media,
#         "post_type": request.post_type,
#         "timestamp": datetime.now()
#     }

#     collection.insert_one(generation_data)

#     # Retornando a URL da imagem gerada
#     return ImageGenerationResponse(image_url=image_url)
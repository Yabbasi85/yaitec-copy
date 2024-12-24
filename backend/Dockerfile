# Usando uma imagem base de Python
FROM python:3.9-slim

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os requisitos para a imagem
COPY requirements.txt .

# Instalar as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Copiar o restante do código
COPY . .

# Expor a porta em que o FastAPI estará rodando (se estiver usando FastAPI)
EXPOSE 8000

# Comando para rodar o servidor
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

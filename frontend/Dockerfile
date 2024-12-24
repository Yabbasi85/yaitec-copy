# Usando uma imagem base de Node.js
FROM node:20

# Definir o diretório de trabalho
WORKDIR /app

# Copiar o package.json e o package-lock.json
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar o restante do código
COPY . .

# Build do front-end
RUN npm run build

EXPOSE 5173

# Comando para rodar o servidor
CMD ["npm", "start"]

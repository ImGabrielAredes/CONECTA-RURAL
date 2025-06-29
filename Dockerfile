# ARQUIVO: Dockerfile (VERSÃO FINAL E CORRIGIDA)

# Usa uma imagem oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia APENAS os arquivos de configuração de pacotes primeiro
# Isso otimiza o cache do Docker, tornando builds futuros mais rápidos
COPY package*.json ./

# Instala as dependências (Express e JSON Server)
RUN npm install

# --- MUDANÇA PRINCIPAL AQUI ---
# Copia todo o conteúdo da pasta 'src' para dentro do container
COPY src/ .

# Expõe a porta que o nosso servidor Node.js vai usar
EXPOSE 8080

# O comando para iniciar o servidor
CMD [ "node", "server.js" ]
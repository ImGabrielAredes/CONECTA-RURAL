
# ARQUIVO: Dockerfile (VERSÃO CORRIGIDA PARA A NOVA ESTRUTURA)

# Usa uma imagem oficial do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia APENAS o package.json primeiro para otimizar o cache do Docker
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# --- MUDANÇA IMPORTANTE ---
# Define o diretório de trabalho para DENTRO da pasta que contém o site
WORKDIR /app/codigos/src

# Expõe a porta que o nosso servidor Node.js vai usar
EXPOSE 3000

# O comando para iniciar o servidor a partir da pasta correta
# Usamos 'node server.js' diretamente, pois ele agora está no contexto certo
CMD [ "node", "server.js" ]
FROM node:20-alpine

WORKDIR /app

# Copiar apenas package.json primeiro (para cache de layers)
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar o restante
COPY . .

# Expor porta
EXPOSE 5173

# Usuário não-root para segurança
USER node

# Comando com desabilitação de abertura automática
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
FROM node:20-alpine AS base

# Build Backend
FROM base AS backend-builder
WORKDIR /app/backend

# Instalar OpenSSL para Prisma
RUN apk add --no-cache openssl

COPY backend/package*.json ./
RUN npm install
COPY backend/ ./
RUN npx prisma generate
RUN npm run build

# Build Frontend
FROM base AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Production
FROM base AS production
WORKDIR /app

# Instalar OpenSSL para Prisma em produção
RUN apk add --no-cache openssl

# Copiar backend buildado
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/package*.json ./backend/
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Copiar frontend buildado
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Copiar Prisma schema
COPY backend/prisma ./backend/prisma

# Variáveis de ambiente
ENV NODE_ENV=production
ENV PORT=3000
ENV TZ=America/Sao_Paulo

WORKDIR /app/backend

EXPOSE 3000

CMD ["node", "dist/server.js"]

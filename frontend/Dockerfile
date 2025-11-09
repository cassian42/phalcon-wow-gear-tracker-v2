# ───────────────────────────────────────────────
# Dockerfile — Phalcon Gear Tracker v2 (Frontend)
# ───────────────────────────────────────────────
FROM node:20-alpine AS base

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto
COPY . .

# Exponer puerto Next.js
EXPOSE 3000

# Comando por defecto
CMD ["npm", "run", "dev"]

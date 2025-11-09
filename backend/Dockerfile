# ──────────────────────────────────────────────────────────────
# Dockerfile — Phalcon Gear Tracker v2 (Backend)
# ──────────────────────────────────────────────────────────────

# Etapa base
FROM node:20-alpine AS base

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (usa npm ci si tienes package-lock.json)
RUN npm ci

# Copiar el resto del proyecto
COPY . .

# Generar el cliente de Prisma
RUN npx prisma generate

# Variables de entorno por defecto
ENV NODE_ENV=development
ENV PORT=4000

# Exponer el puerto de la aplicación
EXPOSE 4000

# Comando por defecto
CMD ["npm", "run", "dev"]

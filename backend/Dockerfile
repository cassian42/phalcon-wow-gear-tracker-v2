# ──────────────────────────────────────────────────────────────
# Dockerfile — Phalcon Gear Tracker v2 (Backend)
# Compatible con Render y local
# ──────────────────────────────────────────────────────────────

# Etapa base
FROM node:20-alpine AS base

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (usa npm ci si tienes package-lock.json)
# Si no existe, cae automáticamente a npm install
RUN npm ci || npm install

# Copiar el resto del proyecto
COPY . .

# Generar el cliente de Prisma (sin conexión a DB)
RUN npx prisma generate || echo "⚠️ Skipping prisma generate"

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=4000

# Exponer el puerto de la aplicación
EXPOSE 4000

# Comando por defecto para Render
# Usa start (no dev) para que el proceso se mantenga correctamente
CMD ["npm", "start"]

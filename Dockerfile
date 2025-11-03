# ──────────────────────────────────────────────────────────────
# Dockerfile — Phalcon Gear Tracker v2
# ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS base

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install all dependencies (including dev for nodemon)
RUN npm install

# Copy the rest of the project
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the app port
EXPOSE 3000

# Start the development process
CMD ["npm", "run", "dev"]

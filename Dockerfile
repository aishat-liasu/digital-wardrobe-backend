# syntax=docker/dockerfile:1 

ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS base

WORKDIR /dw-backend

RUN npm install -g nodemon

EXPOSE 3000

FROM base AS deps

# Use bind mounts to avoid copying files permanently and cache npm modules
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM base AS dev

# Install all dependencies (including dev)
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=cache,target=/root/.npm \
    npm install

# Set environment for development
ENV NODE_ENV=development

# Copy source code (for initial build)
COPY . .

# Default command for dev mode (with live reload)
CMD ["nodemon", "--legacy-watch", "app.js"]

FROM node:${NODE_VERSION}-alpine AS production

WORKDIR /dw-backend

# Set environment for production
ENV NODE_ENV=production

# Copy node_modules from deps stage
COPY --from=deps /dw-backend/node_modules ./node_modules

# Copy the application source
COPY . .

# Use non-root user for security
USER node

# Default command
CMD ["npm", "start"]
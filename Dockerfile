# Multi-stage Dockerfile for User Management App
# This Dockerfile can build both frontend and backend services

# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-build

WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./
RUN npm install

# Copy client source code and build
COPY client/ ./
RUN npm run build

# Stage 2: Build the Node.js backend
FROM node:18-alpine AS backend-build

WORKDIR /app/server

# Copy server package files
COPY server/package*.json ./
RUN npm install --legacy-peer-deps

# Copy server source code and build
COPY server/ ./
RUN npm run build

# Stage 3: Production frontend image with Nginx
FROM nginx:alpine AS frontend-production

# Copy built React app from frontend-build stage
COPY --from=frontend-build /app/client/build /usr/share/nginx/html

# Create a simple nginx config for React Router
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        proxy_pass http://backend:5000; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Stage 4: Production backend image
FROM node:18-alpine AS backend-production

WORKDIR /usr/src/app

# Copy package files and install only production dependencies
COPY server/package*.json ./
RUN npm install --only=production

# Copy built application from backend-build stage
COPY --from=backend-build /app/server/dist ./dist

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /usr/src/app
USER nodejs

EXPOSE 5000
CMD ["node", "dist/app.js"]

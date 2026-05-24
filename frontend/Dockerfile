# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies (npm ci for reproducible builds)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

RUN apk add --no-cache wget

# Copy built assets to Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Add custom Nginx configuration if needed for React Router fallback
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Runtime config injection
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
  CMD wget -qO- http://localhost/ || exit 1

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

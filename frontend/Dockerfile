# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Stage 2: Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY shared ./shared
COPY frontend ./frontend

WORKDIR /app/frontend
# 🟢 Fixed Syntax: Use = for ENV and ARG
ARG NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app/frontend
# 🟢 Fixed Syntax: Changed to ENV key=value
ENV NODE_ENV=production
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/node_modules ./node_modules
COPY --from=builder /app/frontend/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
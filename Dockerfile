# ── Stage 1: Build the Next.js frontend ──
FROM node:20-alpine AS frontend-builder

WORKDIR /build/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --ignore-scripts
COPY frontend/ ./
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Stage 2: Production image ──
FROM python:3.12-slim

# System deps for yt-dlp / gallery-dl (ffmpeg for merging streams)
RUN apt-get update && \
    apt-get install -y --no-install-recommends ffmpeg curl && \
    rm -rf /var/lib/apt/lists/*

# Node.js runtime for Next.js standalone server
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Backend source
COPY app/ ./app/
COPY scripts/ ./scripts/

# Frontend standalone build (minimal footprint — no node_modules needed)
COPY --from=frontend-builder /build/frontend/.next/standalone ./frontend/
COPY --from=frontend-builder /build/frontend/.next/static ./frontend/.next/static
COPY --from=frontend-builder /build/frontend/public ./frontend/public

# Create directories for runtime files
RUN mkdir -p cookies

# Default env
ENV DEBUG=false \
    REQUEST_TIMEOUT_SECONDS=20 \
    NEXT_TELEMETRY_DISABLED=1

EXPOSE 8000 3000

# Start both backend and frontend
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]

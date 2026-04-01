# Smart Media Extractor API

<p align="center">
  <img src="app/static/favicon.svg" width="64" height="64" alt="dl-api logo" />
</p>

<p align="center">
  <strong>Production-ready media extraction service with a stunning Next.js frontend.</strong><br />
  Extract and download video, audio, images &amp; subtitles from YouTube, Instagram, TikTok and more.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-docker">Docker</a> •
  <a href="#-deploy-to-vercel">Vercel</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-frontend">Frontend</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## ✨ Features

| Category | Details |
|----------|---------|
| **Extraction** | FastAPI async API powered by `yt-dlp` as the universal extractor |
| **Smart Routing** | Auto-detects platform from URL and picks the best extractor chain |
| **Instagram** | Priority chain: `instaloader → gallery-dl → yt-dlp` |
| **TikTok** | Priority chain: custom no-watermark provider → `yt-dlp` |
| **Streaming Proxy** | `/stream` endpoint for hotlink-protected or CORS-blocked media |
| **Frontend** | Next.js 15 app with dark glassmorphism UI, Framer Motion animations, Tailwind CSS |
| **Provider Branding** | Dynamic accent colours per platform (YouTube red, Instagram pink, TikTok cyan) |
| **SEO** | Server-rendered landing pages, sitemap, robots.txt, structured data |
| **Logging** | File-based request & error logs; clients only see clean public messages |

## 🛠 Tech Stack

### Backend
- **Python 3.12+** / **FastAPI** — async API server
- **yt-dlp** — universal media extractor
- **instaloader** / **gallery-dl** — Instagram-specific extractors
- **httpx** — async HTTP client
- **uvicorn** — ASGI server

### Frontend (`frontend/`)
- **Next.js 15** (App Router) with **React 18**
- **Tailwind CSS** — utility-first styling with custom design tokens
- **Framer Motion** — layout animations, stagger transitions, micro-interactions
- **Lucide React** — icon library
- **TypeScript** — full type safety matching the backend API schema

### Design System
- Deep dark mode (`#050510`) with radial gradient mesh backgrounds
- Glassmorphism cards (`backdrop-blur-xl`, translucent borders)
- Neon glow borders and shadows (purple/pink gradients)
- Shimmer skeleton loaders matching result card layout
- Provider-aware accent colours and watermark branding

## 🚀 Quick Start

### Prerequisites
- Python 3.12+
- Node.js 20+
- FFmpeg (for stream merging)

### 1. Backend

```bash
# Clone and set up
git clone https://github.com/cornsnaker/dl-api.git
cd dl-api

# Create environment
cp .env.example .env
python3 -m venv .venv
source .venv/bin/activate        # Linux/macOS
# .\.venv\Scripts\activate       # Windows PowerShell

pip install -r requirements.txt

# Start the API server
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 2. Frontend

```bash
cd frontend
npm install

# Set the API URL
echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local

# Development
npm run dev

# Production build
npm run build && npm start
```

| Service | URL |
|---------|-----|
| Backend API | `http://localhost:8000` |
| Swagger UI | `http://localhost:8000/docs` |
| Backend Web UI | `http://localhost:8000/` |
| Next.js Frontend | `http://localhost:3000` |

## 🐳 Docker

Build and run the full stack (backend + frontend) in a single container:

```bash
docker build -t dl-api .
docker run -p 8000:8000 -p 3000:3000 --env-file .env dl-api
```

The `Dockerfile` uses a multi-stage build:
1. **Stage 1** — Builds the Next.js frontend with `node:20-alpine`
2. **Stage 2** — Runs both the FastAPI backend (port 8000) and Next.js frontend (port 3000) on `python:3.12-slim` with Node.js

### Docker Compose (optional)

```yaml
services:
  dl-api:
    build: .
    ports:
      - "8000:8000"
      - "3000:3000"
    env_file: .env
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    restart: unless-stopped
```

## ▲ Deploy to Vercel

The frontend can be deployed to Vercel. A `vercel.json` is included at the project root.

1. Push the repository to GitHub
2. Import the project in [Vercel](https://vercel.com/new)
3. Set the **Root Directory** to `frontend`
4. Add the environment variable:
   - `NEXT_PUBLIC_API_URL` = your backend API URL (e.g. `https://api.yourdomain.com`)
5. Deploy

> **Note:** The Python backend must be hosted separately (e.g. on a VPS, Railway, or Fly.io). Vercel only deploys the Next.js frontend.

## 📡 API Reference

### `GET /health`

Health check. Returns `{"status": "ok", "app": "..."}`.

### `GET /extract`

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | ✅ | Media URL to extract |
| `include_raw` | bool | ❌ | Include raw extractor output (default: `false`) |

```bash
curl "http://localhost:8000/extract?url=https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

### `POST /extract`

```bash
curl -X POST "http://localhost:8000/extract" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://www.instagram.com/p/XXXXXXXXXXX/", "include_raw": false}'
```

### Success Response

```json
{
  "status": "success",
  "provider": "youtube",
  "metadata": {
    "title": "Video title",
    "author": "Channel name",
    "duration": "03:33",
    "thumbnail": "https://img.youtube.com/vi/.../maxresdefault.jpg",
    "description": "Short description..."
  },
  "media": {
    "video_mp4": [
      {
        "quality": "1080p",
        "url": "https://...",
        "size_bytes": 450892100,
        "extension": "mp4",
        "has_audio": false
      }
    ],
    "audio_only": [
      {
        "quality": "128kbps",
        "url": "https://...",
        "ext": "m4a",
        "size_bytes": 12500000
      }
    ],
    "images": [],
    "subtitles": [
      {
        "lang_code": "en",
        "language": "English",
        "url": "https://...",
        "format": "vtt"
      }
    ]
  },
  "config": {
    "proxy_required": true,
    "headers": { "User-Agent": "...", "Referer": "https://www.youtube.com/" },
    "expires_at": 1711568647
  }
}
```

### Error Response

```json
{
  "status": "error",
  "code": "media_not_found",
  "message": "Video topilmadi.",
  "provider": "instagram",
  "attempts": [],
  "details": {}
}
```

Full internal errors are written to `error.txt` (never exposed to clients in production).

### `GET /stream`

Proxy media through this server without saving to disk. Supports HTTP Range requests.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | ❌ | Source URL to extract then stream |
| `media_url` | string | ❌ | Direct media URL to proxy |
| `item_index` | int | ❌ | Index in media collection (default: `1`) |
| `referer` | string | ❌ | Referer header for hotlink protection |

```bash
curl -L "http://localhost:8000/stream?media_url=https://cdn.example.com/video.mp4" -o video.mp4
```

### Proxy Fallback Logic

If `config.proxy_required` is `true` in the extraction response, direct media URLs may be blocked by CORS or hotlink protection. In this case, download buttons should point to:

```
{API_URL}/stream?media_url={encoded_media_url}
```

The Next.js frontend handles this automatically.

## 🎨 Frontend

The `frontend/` directory contains a standalone Next.js application.

### Architecture

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx            # Hero section, URL input form, state management
│   └── globals.css         # Tailwind directives, glass-card utilities, shimmer
├── components/
│   ├── MediaResultCard.tsx  # Result card with proxy logic & provider branding
│   └── SkeletonCard.tsx     # Shimmer loading skeleton
├── lib/
│   ├── types.ts            # TypeScript interfaces matching API schema
│   └── utils.ts            # formatBytes, getProviderTheme, buildDownloadUrl
├── tailwind.config.ts      # Custom gradients, animations, glow shadows
├── next.config.mjs         # Image remote patterns for CDN thumbnails
└── package.json
```

### Key Features

- **Animated hero** with gradient text and Framer Motion entrance transitions
- **Tactile input field** with glow border on focus, inline extract button
- **Shimmer skeleton** loaders that match the exact result card shape
- **MediaResultCard** groups downloads into Video / Audio / Images / Subtitles
- **Provider branding** — dynamic accent colours & watermark per platform
- **`has_audio: false` indicator** — visual badge on video-only streams
- **Size formatting** — `size_bytes` → human-readable KB / MB / GB
- **Proxy-aware downloads** — uses `/stream` endpoint when `proxy_required` is `true`

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g. `http://localhost:8000`) |

## 📁 Project Structure

```
dl-api/
├── app/                          # FastAPI backend
│   ├── main.py                   # App, middleware, exception handlers
│   ├── config.py                 # Settings, cookie management
│   ├── schemas.py                # Pydantic models
│   ├── services/
│   │   ├── router.py             # Smart platform detection & fallback chains
│   │   ├── ytdlp_base.py         # Shared yt-dlp extraction logic
│   │   ├── youtube_extractor.py  # Generic yt-dlp extractor
│   │   ├── instagram_extractor.py
│   │   ├── tiktok_extractor.py
│   │   ├── response_mapper.py    # Internal → standardized response mapping
│   │   ├── stream_proxy.py       # Streaming proxy with Range support
│   │   └── errors.py             # Error classification & public shaping
│   ├── templates/                # Jinja2 templates (backend web UI)
│   └── static/                   # CSS, JS, SVG assets
├── frontend/                     # Next.js 15 frontend
├── scripts/                      # Cookie management CLI
├── Dockerfile                    # Multi-stage build (backend + frontend)
├── docker-entrypoint.sh          # Starts both services
├── vercel.json                   # Vercel deployment config
├── requirements.txt              # Python dependencies
└── .env.example                  # Environment template
```

## ⚙️ Environment

Create `.env` from `.env.example`:

| Variable | Default | Description |
|----------|---------|-------------|
| `DEBUG` | `false` | Show detailed errors to clients |
| `REQUEST_TIMEOUT_SECONDS` | `20` | Extraction timeout |
| `TIKTOK_API_BASE` | `https://www.tikwm.com/api/` | TikTok watermark-free API |
| `COOKIES_DIR` | `cookies` | Directory for browser cookie files |
| `INSTAGRAM_SESSIONFILE` | — | Optional Instaloader session file |
| `HTTP_USER_AGENT` | — | Custom User-Agent header |

## 📋 Logging

Two log files are created in the project root:

- **`log.txt`** — every incoming HTTP request (method, path, status, duration)
- **`error.txt`** — full internal extractor and server errors

Clients only see clean public messages (e.g. `Video topilmadi.`), while the full upstream error is kept server-side.

## 🚢 Production Notes

- Keep `DEBUG=false` in production
- Some Instagram posts require authentication cookies
- Signed CDN URLs expire — clients should consume responses promptly
- When `config.proxy_required=true`, use the `/stream` endpoint for downloads
- The Next.js frontend reads `NEXT_PUBLIC_API_URL` at build time

## ✅ Release Checklist

1. Create `.env` from `.env.example`
2. Keep `DEBUG=false`
3. Install Python dependencies: `pip install -r requirements.txt`
4. Install frontend dependencies: `cd frontend && npm install`
5. Build frontend: `npm run build`
6. Start backend: `uvicorn app.main:app --host 0.0.0.0 --port 8000`
7. Start frontend: `cd frontend && npm start`
8. Verify `/health` returns `200`
9. Verify logs are written to `log.txt` and `error.txt`

---

## 📬 Contact & Connect

If you have any questions, feedback, or just want to say hi, feel free to reach out:

[![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/+QEtQD5HYHUUyM2Ey)
[![Email](https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=icloud&logoColor=white)](mailto:muhammaddiyorshokirov72@email.com)

## ☕ Support the Project

If you find this project helpful and want to support its further development, you can buy me a coffee:

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/s17mj_09)

> **Ethereum Network:** `0x76b0c5ec2De0A7173bcf49839f331683dAe4E941`

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<p align="center">
  Give a ⭐️ if this project helped you!
</p>

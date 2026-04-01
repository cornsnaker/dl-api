#!/bin/sh
set -e

# Start the FastAPI backend on port 8000
uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# Start the Next.js frontend on port 3000
cd /app/frontend
npx next start --port 3000 --hostname 0.0.0.0 &

# Wait for either process to exit
wait -n

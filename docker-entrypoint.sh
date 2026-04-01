#!/bin/sh
set -e

# Trap SIGTERM/SIGINT and forward to child processes
cleanup() {
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
  wait "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
  exit 0
}
trap cleanup TERM INT

# Start the FastAPI backend on port 8000
uvicorn app.main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Start the Next.js frontend (standalone server) on port 3000
cd /app/frontend
PORT=3000 HOSTNAME=0.0.0.0 node server.js &
FRONTEND_PID=$!

# Wait for either process to exit
wait -n

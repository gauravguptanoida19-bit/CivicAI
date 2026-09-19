#!/bin/bash
set -e

echo "=========================================================="
echo "             Starting CivicAI Platform                    "
echo "=========================================================="

echo "Starting Backend on http://localhost:3001..."
(cd backend && npm run dev) &
BACKEND_PID=$!

sleep 3

echo "Starting Frontend on http://localhost:5173..."
(cd frontend && npm run dev) &
FRONTEND_PID=$!

echo "----------------------------------------------------------"
echo "CivicAI is running!"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:3001/api/health"
echo "=========================================================="

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait

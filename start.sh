#!/bin/bash

# Function to kill child processes on exit
cleanup() {
    echo "Stopping servers..."
    kill $(jobs -p)
    exit
}

# Trap SIGINT (Ctrl+C) to run cleanup
trap cleanup SIGINT

# Start Backend
echo "Starting Backend..."
cd backend
# Check if virtual environment exists and activate it if present (optional but good practice)
if [ -d "venv" ]; then
    source venv/bin/activate
elif [ -d ".venv" ]; then
    source .venv/bin/activate
fi
python3 manage.py runserver &

# Return to root
cd ..

# Start Frontend
echo "Starting Frontend..."
cd frontend
bun run dev &

# Return to root
cd ..

# Wait for all background jobs
wait

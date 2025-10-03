#!/bin/bash

echo "╔══════════════════════════════════════════════════════════╗"
echo "║           NetSentinel - Security Dashboard              ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        return 0
    else
        return 1
    fi
}

# Start WebSocket server
echo -e "${BLUE}Starting WebSocket Server...${NC}"
cd backend

if check_port 8000; then
    echo -e "${YELLOW}Port 8000 is already in use. Killing existing process...${NC}"
    lsof -ti:8000 | xargs kill -9 2>/dev/null
fi

python3 websocket_server.py &
WS_PID=$!
echo -e "${GREEN}✓ WebSocket server started (PID: $WS_PID)${NC}"
echo ""

# Instructions for frontend
echo -e "${BLUE}To start the frontend:${NC}"
echo "1. Open a new terminal"
echo "2. Navigate to: cd frontend"
echo "3. Install dependencies (first time): npm install"
echo "4. Start dev server: npm run dev"
echo "5. Open browser to: http://localhost:3000/dashboard"
echo ""

echo -e "${GREEN}WebSocket server is running on ws://localhost:8000${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop the WebSocket server${NC}"
echo ""

# Keep script running and handle cleanup
trap "echo -e '\n${RED}Stopping services...${NC}'; kill $WS_PID 2>/dev/null; exit" INT TERM

# Wait for background process
wait $WS_PID
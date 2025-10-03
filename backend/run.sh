#!/bin/bash

echo "🚀 Starting NetSentinel Backend..."

# Install dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt

# Start the backend server
echo "🔧 Starting FastAPI server with WebSocket support..."
echo "📡 Backend will run on http://localhost:8000"
echo "🎯 Dummy vulnerable site will run on http://localhost:8080"
echo ""
echo "Available endpoints:"
echo "  - WebSocket: ws://localhost:8000/ws"
echo "  - API Stats: http://localhost:8000/api/stats"
echo "  - API Threats: http://localhost:8000/api/threats"
echo "  - API Packets: http://localhost:8000/api/packets"
echo ""
echo "🔍 Starting packet monitoring and threat detection..."

# Run with uvicorn
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
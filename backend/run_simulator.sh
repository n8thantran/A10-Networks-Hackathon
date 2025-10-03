#!/bin/bash

echo "Starting NetSentinel Traffic Simulator..."
echo "=========================================="
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    exit 1
fi

# Check if websockets module is installed
python3 -c "import websockets" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Installing required dependencies..."
    pip3 install websockets
fi

# Run the traffic simulator
python3 traffic_simulator.py
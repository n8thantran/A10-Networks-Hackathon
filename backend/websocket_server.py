#!/usr/bin/env python3
import asyncio
import websockets
import json
import random
from datetime import datetime
from typing import Set, Dict, Any
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class WebSocketServer:
    def __init__(self):
        self.clients: Set[websockets.WebSocketServerProtocol] = set()
        self.packet_id = 0
        self.is_simulating = False
        
    async def register(self, websocket):
        """Register a new client"""
        self.clients.add(websocket)
        logger.info(f"Client {websocket.remote_address} connected. Total clients: {len(self.clients)}")
        
    async def unregister(self, websocket):
        """Unregister a client"""
        self.clients.discard(websocket)
        logger.info(f"Client {websocket.remote_address} disconnected. Total clients: {len(self.clients)}")
        
    async def broadcast(self, message: Dict[str, Any]):
        """Broadcast message to all connected clients"""
        if self.clients:
            message_str = json.dumps(message)
            disconnected = set()
            
            for client in self.clients:
                try:
                    await client.send(message_str)
                except websockets.exceptions.ConnectionClosed:
                    disconnected.add(client)
                except Exception as e:
                    logger.error(f"Error broadcasting to client: {e}")
                    disconnected.add(client)
            
            # Remove disconnected clients
            self.clients -= disconnected
            
    async def handle_client(self, websocket, path):
        """Handle client connection"""
        await self.register(websocket)
        try:
            async for message in websocket:
                try:
                    data = json.loads(message)
                    await self.handle_message(data, websocket)
                except json.JSONDecodeError:
                    logger.error(f"Invalid JSON received: {message}")
                except Exception as e:
                    logger.error(f"Error handling message: {e}")
        finally:
            await self.unregister(websocket)
            
    async def handle_message(self, data: Dict[str, Any], websocket):
        """Handle incoming messages from clients"""
        msg_type = data.get("type")
        
        if msg_type == "control":
            action = data.get("action")
            if action == "start_simulation":
                self.is_simulating = True
                logger.info("Starting simulation")
            elif action == "stop_simulation":
                self.is_simulating = False
                logger.info("Stopping simulation")
            elif action == "trigger_attack":
                attack_type = data.get("attack_type")
                await self.trigger_specific_attack(attack_type)
                
    async def trigger_specific_attack(self, attack_type: str):
        """Trigger a specific attack type"""
        logger.info(f"Triggering {attack_type} attack")
        
        if attack_type == "sql_injection":
            for _ in range(5):
                packet = self.generate_sql_injection()
                await self.broadcast(packet)
                await asyncio.sleep(0.5)
                
        elif attack_type == "xss":
            for _ in range(5):
                packet = self.generate_xss_attack()
                await self.broadcast(packet)
                await asyncio.sleep(0.5)
                
        elif attack_type == "ddos":
            for _ in range(50):
                packet = self.generate_ddos_packet()
                await self.broadcast(packet)
                await asyncio.sleep(0.01)
                
        elif attack_type == "normal":
            for _ in range(10):
                packet = self.generate_normal_traffic()
                await self.broadcast(packet)
                await asyncio.sleep(0.2)
                
    def generate_normal_traffic(self) -> Dict[str, Any]:
        """Generate normal traffic packet"""
        self.packet_id += 1
        return {
            "type": "packet",
            "data": {
                "id": self.packet_id,
                "timestamp": datetime.now().isoformat(),
                "source": f"192.168.1.{random.randint(1, 254)}",
                "destination": f"10.0.0.{random.randint(1, 254)}",
                "protocol": random.choice(["HTTP", "HTTPS", "TCP"]),
                "port": random.choice([80, 443, 8080]),
                "size": random.randint(64, 1500),
                "threat_level": 0,
                "status": "normal",
                "payload": f"GET /api/data HTTP/1.1"
            }
        }
        
    def generate_sql_injection(self) -> Dict[str, Any]:
        """Generate SQL injection attack packet"""
        self.packet_id += 1
        payloads = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "1' UNION SELECT NULL, username, password FROM users--"
        ]
        
        return {
            "type": "threat",
            "data": {
                "id": self.packet_id,
                "timestamp": datetime.now().isoformat(),
                "source": f"45.142.{random.randint(100, 200)}.{random.randint(1, 254)}",
                "destination": "10.0.0.1",
                "protocol": "HTTP",
                "port": 80,
                "size": random.randint(200, 500),
                "threat_level": random.randint(7, 10),
                "status": "malicious",
                "attack_type": "SQL Injection",
                "payload": random.choice(payloads),
                "agent_detected": "sql_injection"
            }
        }
        
    def generate_xss_attack(self) -> Dict[str, Any]:
        """Generate XSS attack packet"""
        self.packet_id += 1
        payloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "javascript:alert('XSS')"
        ]
        
        return {
            "type": "threat",
            "data": {
                "id": self.packet_id,
                "timestamp": datetime.now().isoformat(),
                "source": f"87.120.{random.randint(1, 254)}.{random.randint(1, 254)}",
                "destination": "10.0.0.1",
                "protocol": "HTTP",
                "port": 80,
                "size": random.randint(150, 400),
                "threat_level": random.randint(6, 9),
                "status": "malicious",
                "attack_type": "XSS",
                "payload": random.choice(payloads),
                "agent_detected": "xss"
            }
        }
        
    def generate_ddos_packet(self) -> Dict[str, Any]:
        """Generate DDoS attack packet"""
        self.packet_id += 1
        return {
            "type": "threat",
            "data": {
                "id": self.packet_id,
                "timestamp": datetime.now().isoformat(),
                "source": f"192.168.{random.randint(1, 254)}.{random.randint(1, 254)}",
                "destination": "10.0.0.1",
                "protocol": "TCP",
                "port": 80,
                "size": 64,
                "threat_level": 8,
                "status": "malicious",
                "attack_type": "DDoS",
                "payload": "SYN flood",
                "agent_detected": "payload"
            }
        }
        
    async def auto_simulate(self):
        """Auto-generate traffic continuously"""
        while True:
            if self.is_simulating and self.clients:
                # Generate mixed traffic
                traffic_type = random.choices(
                    ["normal", "normal", "normal", "sql", "xss", "ddos"],
                    weights=[60, 10, 10, 10, 5, 5]
                )[0]
                
                if traffic_type == "normal":
                    packet = self.generate_normal_traffic()
                elif traffic_type == "sql":
                    packet = self.generate_sql_injection()
                elif traffic_type == "xss":
                    packet = self.generate_xss_attack()
                else:
                    packet = self.generate_ddos_packet()
                    
                await self.broadcast(packet)
                
            await asyncio.sleep(random.uniform(0.5, 2.0))

async def main():
    server = WebSocketServer()
    
    # Start WebSocket server on port 8000
    async with websockets.serve(server.handle_client, "localhost", 8000, 
                                 subprotocols=["websocket"]):
        logger.info("WebSocket server started on ws://localhost:8000")
        logger.info("Waiting for connections...")
        
        # Run auto-simulation in background
        await server.auto_simulate()

if __name__ == "__main__":
    print("""
    ╔══════════════════════════════════════════╗
    ║     NetSentinel WebSocket Server         ║
    ║     Real-time Traffic & Threat Stream    ║
    ╚══════════════════════════════════════════╝
    
    Server running on: ws://localhost:8000
    Frontend should connect to: ws://localhost:8000/ws
    
    Press Ctrl+C to stop
    """)
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nServer stopped.")
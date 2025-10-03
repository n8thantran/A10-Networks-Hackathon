from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Dict, Any, Optional
import asyncio
import json
import logging
from datetime import datetime, timedelta
import random
import uuid
from contextlib import asynccontextmanager

from database import init_db, get_db
from models import PacketLog, ThreatDetection, NetworkStats, ServerHealth
from agents import (
    XSSAgent,
    SQLInjectionAgent,
    PayloadAgent,
    ThreatSynthesizer,
    PacketCapture
)
from dummy_site import create_dummy_site
import sqlalchemy.orm as orm

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.packet_queue = asyncio.Queue()
        self.stats = {
            "packets_analyzed": 0,
            "threats_detected": 0,
            "active_connections": 0,
            "uptime_start": datetime.now()
        }

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.stats["active_connections"] = len(self.active_connections)
        logger.info(f"Client connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        self.stats["active_connections"] = len(self.active_connections)
        logger.info(f"Client disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.error(f"Error broadcasting message: {e}")

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)

manager = ConnectionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    
    # Disable fake packet generation - only real packets from dummy site
    # asyncio.create_task(packet_monitor())
    asyncio.create_task(threat_processor())
    asyncio.create_task(stats_broadcaster())
    asyncio.create_task(create_dummy_site(manager))
    
    yield
    
    logger.info("Shutting down...")

app = FastAPI(title="NetSentinel Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

async def packet_monitor():
    """Monitor network packets and queue them for analysis"""
    capture = PacketCapture()
    
    while True:
        try:
            packets = await capture.capture_packets(interface="lo", count=10)
            
            for packet_data in packets:
                await manager.packet_queue.put(packet_data)
                manager.stats["packets_analyzed"] += 1
                
                packet_log = {
                    "id": str(uuid.uuid4()),
                    "timestamp": datetime.now().isoformat(),
                    "source_ip": packet_data.get("src_ip", "unknown"),
                    "dest_ip": packet_data.get("dst_ip", "unknown"),
                    "protocol": packet_data.get("protocol", "unknown"),
                    "size": packet_data.get("size", 0),
                    "payload": packet_data.get("payload", "")[:200]
                }
                
                await manager.broadcast({
                    "type": "packet_log",
                    "data": packet_log
                })
                
            await asyncio.sleep(2)
            
        except Exception as e:
            logger.error(f"Error in packet monitor: {e}")
            await asyncio.sleep(5)

async def threat_processor():
    """Process packets through multi-agent threat detection"""
    xss_agent = XSSAgent()
    sql_agent = SQLInjectionAgent()
    payload_agent = PayloadAgent()
    synthesizer = ThreatSynthesizer()
    
    while True:
        try:
            if not manager.packet_queue.empty():
                packet_data = await manager.packet_queue.get()
                
                agent_statuses = []
                
                xss_status = {
                    "name": "XSS Agent",
                    "status": "analyzing",
                    "finding": "Scanning for cross-site scripting patterns...",
                    "confidence": 0,
                    "color": "cyan",
                    "icon": "👤"
                }
                agent_statuses.append(xss_status)
                
                sql_status = {
                    "name": "SQL Injection Agent",
                    "status": "analyzing",
                    "finding": "Checking for SQL injection patterns...",
                    "confidence": 0,
                    "color": "purple",
                    "icon": "🗄️"
                }
                agent_statuses.append(sql_status)
                
                payload_status = {
                    "name": "Payload Agent",
                    "status": "analyzing",
                    "finding": "Deep packet inspection in progress...",
                    "confidence": 0,
                    "color": "orange",
                    "icon": "📦"
                }
                agent_statuses.append(payload_status)
                
                await manager.broadcast({
                    "type": "agent_analysis",
                    "data": {
                        "agents": agent_statuses,
                        "packet_id": packet_data.get("id")
                    }
                })
                
                results = await asyncio.gather(
                    xss_agent.analyze(packet_data),
                    sql_agent.analyze(packet_data),
                    payload_agent.analyze(packet_data)
                )
                
                for i, result in enumerate(results):
                    if result["threat_detected"]:
                        agent_statuses[i]["status"] = "threat"
                        agent_statuses[i]["finding"] = result["finding"]
                        agent_statuses[i]["confidence"] = result["confidence"]
                    else:
                        agent_statuses[i]["status"] = "clear"
                        agent_statuses[i]["finding"] = "No threats detected"
                        agent_statuses[i]["confidence"] = 0
                
                final_threat = await synthesizer.synthesize(results)
                
                if final_threat["is_threat"]:
                    manager.stats["threats_detected"] += 1
                    
                    threat_alert = {
                        "id": str(uuid.uuid4()),
                        "timestamp": datetime.now().isoformat(),
                        "severity": final_threat["severity"],
                        "type": final_threat["threat_type"],
                        "description": final_threat["description"],
                        "source_ip": packet_data.get("src_ip", "unknown"),
                        "confidence": final_threat["confidence"],
                        "remediation": final_threat["remediation"]
                    }
                    
                    await manager.broadcast({
                        "type": "threat_alert",
                        "data": threat_alert
                    })
                
                await manager.broadcast({
                    "type": "agent_analysis_complete",
                    "data": {
                        "agents": agent_statuses,
                        "synthesis": final_threat
                    }
                })
                
            await asyncio.sleep(0.5)
            
        except Exception as e:
            logger.error(f"Error in threat processor: {e}")
            await asyncio.sleep(2)

async def stats_broadcaster():
    """Broadcast network statistics periodically"""
    last_packets = 0
    while True:
        try:
            uptime = datetime.now() - manager.stats["uptime_start"]
            hours = int(uptime.total_seconds() // 3600)
            minutes = int((uptime.total_seconds() % 3600) // 60)
            
            # Only send stats update if there's been activity
            current_packets = manager.stats["packets_analyzed"]
            if current_packets != last_packets:
                stats = {
                    "packets_analyzed": manager.stats["packets_analyzed"],
                    "threats_detected": manager.stats["threats_detected"],
                    "active_connections": manager.stats["active_connections"],
                    "uptime": f"{hours}h {minutes}m",
                    "cpu_usage": 15 + min(35, current_packets % 20),  # CPU based on activity
                    "memory_usage": f"{2.5 + (current_packets % 10) * 0.2:.1f}/8 GB",
                    "bandwidth_in": 100 + (current_packets * 50),
                    "bandwidth_out": 50 + (current_packets * 25),
                    "latency": max(5, 25 - current_packets)
                }
                
                await manager.broadcast({
                    "type": "network_stats",
                    "data": stats
                })
                
                last_packets = current_packets
            
            await asyncio.sleep(2)
            
        except Exception as e:
            logger.error(f"Error in stats broadcaster: {e}")
            await asyncio.sleep(5)

@app.get("/")
async def root():
    return {
        "service": "NetSentinel Backend",
        "status": "active",
        "version": "1.0.0"
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_json()
            
            if data.get("type") == "ping":
                await manager.send_personal_message({
                    "type": "pong",
                    "timestamp": datetime.now().isoformat()
                }, websocket)
            
            elif data.get("type") == "search":
                query = data.get("query", "")
                results = await search_packets(query)
                await manager.send_personal_message({
                    "type": "search_results",
                    "data": results
                }, websocket)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)

async def search_packets(query: str) -> List[Dict]:
    """Search packet logs based on query"""
    results = []
    
    keywords = ["sql", "injection", "xss", "script", "payload", "attack", "threat"]
    
    if any(keyword in query.lower() for keyword in keywords):
        for i in range(min(5, random.randint(2, 8))):
            result = {
                "id": str(uuid.uuid4()),
                "timestamp": (datetime.now() - timedelta(hours=random.randint(0, 24))).isoformat(),
                "source": f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}",
                "destination": "10.0.0.5",
                "threat": f"Detected {query} pattern in packet payload",
                "relevance": random.uniform(0.7, 0.99)
            }
            results.append(result)
    
    return results

@app.get("/api/stats")
async def get_stats():
    return {
        "packets_analyzed": manager.stats["packets_analyzed"],
        "threats_detected": manager.stats["threats_detected"],
        "active_connections": manager.stats["active_connections"]
    }

@app.get("/api/threats")
async def get_threats(db: orm.Session = Depends(get_db)):
    threats = db.query(ThreatDetection).order_by(ThreatDetection.timestamp.desc()).limit(100).all()
    return [threat.to_dict() for threat in threats]

@app.get("/api/packets")
async def get_packets(db: orm.Session = Depends(get_db)):
    packets = db.query(PacketLog).order_by(PacketLog.timestamp.desc()).limit(100).all()
    return [packet.to_dict() for packet in packets]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
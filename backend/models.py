from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text, JSON
from sqlalchemy.sql import func
from database import Base
from datetime import datetime
from typing import Optional, Dict, Any

class PacketLog(Base):
    __tablename__ = "packet_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    source_ip = Column(String(45), index=True)
    dest_ip = Column(String(45), index=True)
    source_port = Column(Integer)
    dest_port = Column(Integer)
    protocol = Column(String(10))
    packet_size = Column(Integer)
    payload = Column(Text)
    flags = Column(String(20))
    
    def to_dict(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "source_ip": self.source_ip,
            "dest_ip": self.dest_ip,
            "source_port": self.source_port,
            "dest_port": self.dest_port,
            "protocol": self.protocol,
            "packet_size": self.packet_size,
            "payload": self.payload[:200] if self.payload else "",
            "flags": self.flags
        }

class ThreatDetection(Base):
    __tablename__ = "threat_detections"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    packet_id = Column(Integer)
    threat_type = Column(String(50), index=True)
    severity = Column(String(20))
    confidence = Column(Float)
    description = Column(Text)
    source_ip = Column(String(45), index=True)
    dest_ip = Column(String(45))
    remediation = Column(Text)
    agent_findings = Column(JSON)
    
    def to_dict(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "packet_id": self.packet_id,
            "threat_type": self.threat_type,
            "severity": self.severity,
            "confidence": self.confidence,
            "description": self.description,
            "source_ip": self.source_ip,
            "dest_ip": self.dest_ip,
            "remediation": self.remediation,
            "agent_findings": self.agent_findings
        }

class NetworkStats(Base):
    __tablename__ = "network_stats"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    packets_analyzed = Column(Integer, default=0)
    threats_detected = Column(Integer, default=0)
    bandwidth_in = Column(Float)
    bandwidth_out = Column(Float)
    active_connections = Column(Integer)
    cpu_usage = Column(Float)
    memory_usage = Column(Float)
    
    def to_dict(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "packets_analyzed": self.packets_analyzed,
            "threats_detected": self.threats_detected,
            "bandwidth_in": self.bandwidth_in,
            "bandwidth_out": self.bandwidth_out,
            "active_connections": self.active_connections,
            "cpu_usage": self.cpu_usage,
            "memory_usage": self.memory_usage
        }

class ServerHealth(Base):
    __tablename__ = "server_health"
    
    id = Column(Integer, primary_key=True, index=True)
    server_id = Column(String(50), index=True)
    server_name = Column(String(100))
    status = Column(String(20))
    latency = Column(Float)
    last_check = Column(DateTime(timezone=True), server_default=func.now())
    uptime = Column(Float)
    error_rate = Column(Float)
    
    def to_dict(self):
        return {
            "id": self.id,
            "server_id": self.server_id,
            "server_name": self.server_name,
            "status": self.status,
            "latency": self.latency,
            "last_check": self.last_check.isoformat() if self.last_check else None,
            "uptime": self.uptime,
            "error_rate": self.error_rate
        }

class LoginAttempt(Base):
    __tablename__ = "login_attempts"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    username = Column(String(100))
    source_ip = Column(String(45), index=True)
    user_agent = Column(Text)
    success = Column(Boolean, default=False)
    suspicious = Column(Boolean, default=False)
    threat_indicators = Column(JSON)
    
    def to_dict(self):
        return {
            "id": self.id,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "username": self.username,
            "source_ip": self.source_ip,
            "user_agent": self.user_agent,
            "success": self.success,
            "suspicious": self.suspicious,
            "threat_indicators": self.threat_indicators
        }
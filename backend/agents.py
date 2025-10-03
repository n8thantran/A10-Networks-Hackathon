import asyncio
import re
import random
from typing import Dict, Any, List
from datetime import datetime
import logging
from scapy.all import sniff, IP, TCP, UDP, Raw, get_if_list
import json

logger = logging.getLogger(__name__)

class XSSAgent:
    """Agent specialized in detecting Cross-Site Scripting attacks"""
    
    XSS_PATTERNS = [
        r'<script[^>]*>.*?</script>',
        r'javascript:',
        r'on\w+\s*=',
        r'<iframe[^>]*>',
        r'<img[^>]*onerror\s*=',
        r'alert\s*\(',
        r'document\.cookie',
        r'eval\s*\(',
        r'<svg[^>]*onload\s*=',
        r'<body[^>]*onload\s*='
    ]
    
    async def analyze(self, packet_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze packet for XSS patterns"""
        await asyncio.sleep(random.uniform(0.1, 0.3))
        
        payload = packet_data.get("payload", "")
        threat_detected = False
        confidence = 0
        finding = "No XSS patterns detected"
        
        if payload:
            for pattern in self.XSS_PATTERNS:
                if re.search(pattern, payload, re.IGNORECASE):
                    threat_detected = True
                    confidence = random.uniform(75, 95)
                    finding = f"XSS pattern detected: {pattern[:30]}..."
                    break
        
        return {
            "agent": "XSS",
            "threat_detected": threat_detected,
            "confidence": confidence,
            "finding": finding,
            "timestamp": datetime.now().isoformat()
        }

class SQLInjectionAgent:
    """Agent specialized in detecting SQL Injection attacks"""
    
    SQL_PATTERNS = [
        r"('\s*OR\s*'1'\s*=\s*'1)",
        r"('\s*OR\s*1\s*=\s*1)",
        r"(;\s*DROP\s+TABLE)",
        r"(;\s*DELETE\s+FROM)",
        r"(UNION\s+SELECT)",
        r"(SELECT\s+.*\s+FROM\s+.*\s+WHERE)",
        r"('\s*;\s*--)",
        r"(1\s*=\s*1\s*--)",
        r"(admin'\s*--)",
        r"('\s*OR\s*'a'\s*=\s*'a)",
        r"(EXEC\s+\w+)",
        r"(EXECUTE\s+IMMEDIATE)",
        r"(SELECT\s+COUNT\(\*\))",
        r"(WAITFOR\s+DELAY)",
        r"(BENCHMARK\s*\()",
        r"(SLEEP\s*\()"
    ]
    
    async def analyze(self, packet_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze packet for SQL Injection patterns"""
        await asyncio.sleep(random.uniform(0.1, 0.3))
        
        payload = packet_data.get("payload", "")
        threat_detected = False
        confidence = 0
        finding = "No SQL injection patterns detected"
        
        if payload:
            for pattern in self.SQL_PATTERNS:
                match = re.search(pattern, payload, re.IGNORECASE)
                if match:
                    threat_detected = True
                    confidence = random.uniform(80, 98)
                    finding = f"SQL injection detected: {match.group()[:50]}..."
                    break
        
        return {
            "agent": "SQLInjection",
            "threat_detected": threat_detected,
            "confidence": confidence,
            "finding": finding,
            "timestamp": datetime.now().isoformat()
        }

class PayloadAgent:
    """Agent specialized in deep packet payload analysis"""
    
    MALICIOUS_PATTERNS = [
        r'\.\./',
        r'/etc/passwd',
        r'/etc/shadow',
        r'cmd\.exe',
        r'powershell',
        r'nc\s+-e',
        r'bash\s+-i',
        r'/bin/sh',
        r'wget\s+http',
        r'curl\s+http.*\|\s*sh',
        r'base64\s+-d',
        r'python\s+-c',
        r'<%\s*eval',
        r'system\s*\(',
        r'exec\s*\('
    ]
    
    async def analyze(self, packet_data: Dict[str, Any]) -> Dict[str, Any]:
        """Perform deep packet inspection"""
        await asyncio.sleep(random.uniform(0.2, 0.4))
        
        payload = packet_data.get("payload", "")
        threat_detected = False
        confidence = 0
        finding = "Payload analysis complete - no threats"
        
        if payload:
            if len(payload) > 1000:
                confidence = random.uniform(30, 50)
                finding = "Unusually large payload detected"
            
            for pattern in self.MALICIOUS_PATTERNS:
                if re.search(pattern, payload, re.IGNORECASE):
                    threat_detected = True
                    confidence = random.uniform(70, 90)
                    finding = f"Suspicious payload pattern: {pattern}"
                    break
        
        return {
            "agent": "Payload",
            "threat_detected": threat_detected,
            "confidence": confidence,
            "finding": finding,
            "timestamp": datetime.now().isoformat()
        }

class ThreatSynthesizer:
    """Synthesizes findings from multiple agents into unified threat assessment"""
    
    async def synthesize(self, agent_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Combine agent findings into final threat determination"""
        await asyncio.sleep(random.uniform(0.05, 0.1))
        
        threats = [r for r in agent_results if r["threat_detected"]]
        
        if not threats:
            return {
                "is_threat": False,
                "severity": "none",
                "confidence": 0,
                "threat_type": "none",
                "description": "No threats detected",
                "remediation": "Continue monitoring"
            }
        
        max_confidence = max(t["confidence"] for t in threats)
        threat_types = [t["agent"] for t in threats]
        
        severity = "low"
        if max_confidence > 90:
            severity = "critical"
        elif max_confidence > 75:
            severity = "high"
        elif max_confidence > 50:
            severity = "medium"
        
        threat_type = ", ".join(threat_types)
        
        remediation_steps = {
            "XSS": "Enable XSS protection headers, validate and sanitize all user inputs",
            "SQLInjection": "Use parameterized queries, implement input validation",
            "Payload": "Implement deep packet inspection, update firewall rules"
        }
        
        remediation = " | ".join([remediation_steps.get(t, "") for t in threat_types if t in remediation_steps])
        
        return {
            "is_threat": True,
            "severity": severity,
            "confidence": max_confidence,
            "threat_type": threat_type,
            "description": f"Multiple agents detected threats: {', '.join([t['finding'] for t in threats])}",
            "remediation": remediation,
            "agent_count": len(threats)
        }

class PacketCapture:
    """Captures and processes network packets"""
    
    def __init__(self):
        self.packet_buffer = []
        
    async def capture_packets(self, interface: str = "lo", count: int = 10) -> List[Dict[str, Any]]:
        """Capture packets from network interface (simulated for now)"""
        packets = []
        
        for _ in range(count):
            if random.random() > 0.7:
                payload = self._generate_malicious_payload()
            else:
                payload = self._generate_normal_payload()
            
            packet = {
                "id": f"pkt_{datetime.now().timestamp()}_{random.randint(1000, 9999)}",
                "src_ip": self._random_ip(),
                "dst_ip": "10.0.0.5" if random.random() > 0.5 else self._random_ip(),
                "src_port": random.randint(1024, 65535),
                "dst_port": 8080 if random.random() > 0.6 else random.choice([80, 443, 3306, 5432]),
                "protocol": random.choice(["TCP", "UDP", "HTTP"]),
                "size": len(payload),
                "payload": payload,
                "timestamp": datetime.now().isoformat()
            }
            packets.append(packet)
        
        return packets
    
    def _random_ip(self) -> str:
        """Generate random IP address"""
        return f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}"
    
    def _generate_malicious_payload(self) -> str:
        """Generate simulated malicious payload"""
        payloads = [
            "username=' OR '1'='1' -- &password=anything",
            "<script>alert('XSS')</script>",
            "../../etc/passwd",
            "'; DROP TABLE users; --",
            "<img src=x onerror=alert('XSS')>",
            "UNION SELECT * FROM users WHERE 1=1",
            "admin' --",
            "<iframe src='malicious.com'></iframe>",
            "SELECT * FROM users WHERE username='admin'",
            "javascript:alert(document.cookie)",
            "<?php system('ls -la'); ?>",
            "cmd.exe /c dir",
            "../../../windows/system32/config/sam"
        ]
        return random.choice(payloads)
    
    def _generate_normal_payload(self) -> str:
        """Generate simulated normal HTTP payload"""
        payloads = [
            "GET /index.html HTTP/1.1",
            "POST /api/login username=john&password=secure123",
            "GET /api/users/123",
            "POST /api/data {\"name\": \"John\", \"age\": 30}",
            "GET /static/css/style.css",
            "GET /images/logo.png",
            "POST /api/search query=products",
            "GET /api/status",
            "POST /api/update id=456&status=active"
        ]
        return random.choice(payloads)
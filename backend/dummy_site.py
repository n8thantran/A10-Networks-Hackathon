from fastapi import FastAPI, Form, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import asyncio
import logging
from datetime import datetime
from typing import Optional
import sqlite3
import hashlib
import random
import httpx

logger = logging.getLogger(__name__)

# Global variable to hold manager reference
manager = None

async def notify_backend(packet_data: dict, threat_type: Optional[str] = None):
    """Send packet data to the main backend for processing"""
    global manager
    if manager:
        # Put packet in the queue for processing
        await manager.packet_queue.put(packet_data)
        manager.stats["packets_analyzed"] += 1
        
        # Broadcast packet log immediately
        packet_log = {
            "id": f"pkt_{datetime.now().timestamp()}_{random.randint(1000, 9999)}",
            "timestamp": packet_data["timestamp"],
            "source_ip": packet_data["src_ip"],
            "dest_ip": packet_data["dst_ip"],
            "protocol": packet_data["protocol"],
            "size": packet_data["size"],
            "payload": packet_data.get("payload", "")[:200],
            "threat": threat_type is not None
        }
        
        await manager.broadcast({
            "type": "packet_log",
            "data": packet_log
        })

dummy_app = FastAPI(title="Vulnerable Demo Site")

dummy_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HTML_TEMPLATE = """
<!DOCTYPE html>
<html>
<head>
    <title>Demo Site - NetSentinel Target</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        h1 {
            color: #333;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffc107;
            padding: 10px;
            border-radius: 5px;
            margin: 20px 0;
        }
        form {
            margin: 20px 0;
        }
        input, textarea {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-sizing: border-box;
        }
        button {
            background: #667eea;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background: #5a67d8;
        }
        .search-box {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .comment-section {
            background: #f1f3f5;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .result {
            padding: 10px;
            margin: 10px 0;
            background: #e3f2fd;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🎯 Vulnerable Demo Site</h1>
        
        <div class="warning">
            ⚠️ <strong>Warning:</strong> This is an intentionally vulnerable site for testing NetSentinel's security monitoring.
            It contains deliberate security flaws for demonstration purposes only.
        </div>
        
        <h2>Login Form (SQL Injection Test)</h2>
        <form action="/login" method="post">
            <input type="text" name="username" placeholder="Username (try: admin' OR '1'='1' --)" />
            <input type="password" name="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
        
        <div class="search-box">
            <h2>Search Products</h2>
            <form action="/search" method="get">
                <input type="text" name="q" placeholder="Search (try: '; DROP TABLE products; --)" />
                <button type="submit">Search</button>
            </form>
        </div>
        
        <div class="comment-section">
            <h2>Comments (XSS Test)</h2>
            <form action="/comment" method="post">
                <input type="text" name="name" placeholder="Your Name" />
                <textarea name="comment" rows="4" placeholder="Your comment (try: <script>alert('XSS')</script>)"></textarea>
                <button type="submit">Post Comment</button>
            </form>
            <div id="comments"></div>
        </div>
        
        <h2>File Viewer</h2>
        <form action="/view" method="get">
            <input type="text" name="file" placeholder="File path (try: ../../etc/passwd)" />
            <button type="submit">View File</button>
        </form>
        
        <hr style="margin: 30px 0;">
        
        <p style="text-align: center; color: #666;">
            This site is monitored by <strong>NetSentinel</strong> AI Security System<br>
            All attacks are being detected and analyzed in real-time
        </p>
    </div>
    
    <script>
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(e) {
                console.log('Form submitted:', this.action);
            });
        });
    </script>
</body>
</html>
"""

@dummy_app.get("/", response_class=HTMLResponse)
async def home():
    return HTML_TEMPLATE

@dummy_app.post("/login")
async def login(request: Request, username: str = Form(...), password: str = Form(...)):
    """Vulnerable login endpoint - deliberately unsafe for testing"""
    
    vulnerable_query = f"SELECT * FROM users WHERE username='{username}' AND password='{password}'"
    
    logger.warning(f"SQL Injection attempt detected: {vulnerable_query}")
    
    # Send packet data to NetSentinel
    packet_data = {
        "src_ip": request.client.host if request.client else "127.0.0.1",
        "dst_ip": "10.0.0.5",
        "src_port": request.client.port if request.client else random.randint(40000, 60000),
        "dst_port": 8080,
        "protocol": "HTTP",
        "payload": f"username={username}&password={password}",
        "size": len(f"username={username}&password={password}"),
        "timestamp": datetime.now().isoformat()
    }
    
    # Send to the main backend for processing
    await notify_backend(packet_data, "SQL_INJECTION" if "' OR '" in username or "' OR '" in password else None)
    
    if "' OR '" in username or "' OR '" in password:
        return JSONResponse({
            "status": "success",
            "message": "SQL Injection successful! NetSentinel should detect this.",
            "query": vulnerable_query,
            "vulnerability": "SQL_INJECTION"
        })
    
    return JSONResponse({
        "status": "failed",
        "message": "Invalid credentials",
        "query": vulnerable_query
    })

@dummy_app.get("/search")
async def search(request: Request, q: str):
    """Vulnerable search endpoint"""
    
    vulnerable_query = f"SELECT * FROM products WHERE name LIKE '%{q}%'"
    
    # Send packet data to NetSentinel
    packet_data = {
        "src_ip": request.client.host if request.client else "127.0.0.1",
        "dst_ip": "10.0.0.5",
        "src_port": request.client.port if request.client else random.randint(40000, 60000),
        "dst_port": 8080,
        "protocol": "HTTP",
        "payload": f"search={q}",
        "size": len(f"search={q}"),
        "timestamp": datetime.now().isoformat()
    }
    
    threat_detected = "DROP" in q.upper() or "DELETE" in q.upper() or "UNION" in q.upper()
    await notify_backend(packet_data, "SQL_INJECTION" if threat_detected else None)
    
    if threat_detected:
        return JSONResponse({
            "status": "threat_detected",
            "message": "SQL Injection in search detected!",
            "query": vulnerable_query,
            "vulnerability": "SQL_INJECTION",
            "results": []
        })
    
    return JSONResponse({
        "status": "success",
        "query": vulnerable_query,
        "results": [
            {"id": 1, "name": "Product 1", "price": 10.99},
            {"id": 2, "name": "Product 2", "price": 20.99}
        ]
    })

@dummy_app.post("/comment")
async def post_comment(request: Request, name: str = Form(...), comment: str = Form(...)):
    """Vulnerable comment endpoint - XSS"""
    
    # Send packet data to NetSentinel
    packet_data = {
        "src_ip": request.client.host if request.client else "127.0.0.1",
        "dst_ip": "10.0.0.5",
        "src_port": request.client.port if request.client else random.randint(40000, 60000),
        "dst_port": 8080,
        "protocol": "HTTP",
        "payload": f"name={name}&comment={comment}",
        "size": len(f"name={name}&comment={comment}"),
        "timestamp": datetime.now().isoformat()
    }
    
    threat_detected = "<script>" in comment.lower() or "javascript:" in comment.lower()
    await notify_backend(packet_data, "XSS" if threat_detected else None)
    
    if threat_detected:
        return JSONResponse({
            "status": "threat_detected",
            "message": "XSS attack detected in comment!",
            "vulnerability": "XSS",
            "comment": comment,
            "sanitized": False
        })
    
    return JSONResponse({
        "status": "success",
        "message": "Comment posted",
        "comment": {
            "name": name,
            "text": comment,
            "timestamp": datetime.now().isoformat()
        }
    })

@dummy_app.get("/view")
async def view_file(request: Request, file: str):
    """Vulnerable file viewer - Path Traversal"""
    
    # Send packet data to NetSentinel
    packet_data = {
        "src_ip": request.client.host if request.client else "127.0.0.1",
        "dst_ip": "10.0.0.5",
        "src_port": request.client.port if request.client else random.randint(40000, 60000),
        "dst_port": 8080,
        "protocol": "HTTP",
        "payload": f"file={file}",
        "size": len(f"file={file}"),
        "timestamp": datetime.now().isoformat()
    }
    
    threat_detected = ".." in file or "/etc/" in file or "/windows/" in file
    await notify_backend(packet_data, "PATH_TRAVERSAL" if threat_detected else None)
    
    if threat_detected:
        return JSONResponse({
            "status": "threat_detected",
            "message": "Path traversal attack detected!",
            "vulnerability": "PATH_TRAVERSAL",
            "requested_file": file,
            "blocked": True
        })
    
    return JSONResponse({
        "status": "success",
        "file": file,
        "content": "File content would be here..."
    })

@dummy_app.get("/api/admin")
async def admin_panel():
    """Fake admin endpoint for testing"""
    return JSONResponse({
        "status": "unauthorized",
        "message": "Admin access required",
        "hint": "Try SQL injection on login"
    })

@dummy_app.post("/api/execute")
async def execute_command(command: str = Form(...)):
    """Vulnerable command execution endpoint"""
    
    dangerous_commands = ["rm", "del", "format", "drop", "exec", "system"]
    
    if any(cmd in command.lower() for cmd in dangerous_commands):
        return JSONResponse({
            "status": "threat_detected",
            "message": "Command injection detected!",
            "vulnerability": "COMMAND_INJECTION",
            "command": command,
            "blocked": True
        })
    
    return JSONResponse({
        "status": "success",
        "command": command,
        "output": "Command executed (simulated)"
    })

async def create_dummy_site(connection_manager=None):
    """Run the dummy vulnerable site on port 8080"""
    global manager
    manager = connection_manager
    
    try:
        config = uvicorn.Config(
            app=dummy_app,
            host="0.0.0.0",
            port=8080,
            log_level="info"
        )
        server = uvicorn.Server(config)
        logger.info("Starting vulnerable dummy site on http://localhost:8080")
        await server.serve()
    except Exception as e:
        logger.error(f"Error starting dummy site: {e}")
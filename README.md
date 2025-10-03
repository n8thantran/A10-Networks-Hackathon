# NetSentinel - AI-Powered Network Security Monitoring

NetSentinel is an advanced AI-powered network security monitoring system that uses multi-agent artificial intelligence to detect, analyze, and respond to security threats in real-time.

## 🚀 Features

- **Multi-Agent Threat Detection**: Parallel processing with specialized AI agents (XSS, SQL Injection, Payload Analysis)
- **Real-time Monitoring**: WebSocket-based live packet analysis and threat detection
- **Smart Dashboard**: Interactive dashboard with real-time updates and visualizations
- **Vulnerable Test Site**: Built-in dummy site on port 8080 for security testing
- **SQL Database**: Stores all packet logs, threats, and network statistics

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                    │
│                   http://localhost:3000                  │
└────────────────────┬────────────────────────────────────┘
                     │ WebSocket
┌────────────────────▼────────────────────────────────────┐
│                 Backend (FastAPI + Python)               │
│                   http://localhost:8000                  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Multi-Agent Threat Detection           │  │
│  │                                                  │  │
│  │  ┌─────────┐  ┌─────────────┐  ┌─────────────┐ │  │
│  │  │   XSS   │  │     SQL     │  │   Payload   │ │  │
│  │  │  Agent  │  │  Injection  │  │    Agent    │ │  │
│  │  │         │  │    Agent    │  │             │ │  │
│  │  └─────────┘  └─────────────┘  └─────────────┘ │  │
│  │                       ▼                          │  │
│  │               ┌──────────────┐                   │  │
│  │               │ Synthesizer  │                   │  │
│  │               └──────────────┘                   │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              SQLite Database                      │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────┐
│              Dummy Vulnerable Site                       │
│                http://localhost:8080                     │
└──────────────────────────────────────────────────────────┘
```

## 📦 Installation

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- pip (Python package manager)

### Setup Instructions

1. **Clone the repository:**
```bash
git clone <repository-url>
cd A10-Networks-Hackathon
```

2. **Install Frontend Dependencies:**
```bash
cd frontend
npm install
```

3. **Install Backend Dependencies:**
```bash
cd ../backend
pip install -r requirements.txt
```

## 🚀 Running the Application

### Start the Backend (Terminal 1):
```bash
cd backend
./run.sh
# Or manually:
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The backend will start:
- FastAPI server on `http://localhost:8000`
- WebSocket endpoint on `ws://localhost:8000/ws`
- Dummy vulnerable site on `http://localhost:8080`

### Start the Frontend (Terminal 2):
```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🎯 Testing the System

1. **Open the Dashboard**: Navigate to `http://localhost:3000/dashboard`

2. **Test SQL Injection**: 
   - Go to `http://localhost:8080`
   - In the login form, try: `admin' OR '1'='1' --`
   - Watch the dashboard detect the threat

3. **Test XSS Attack**:
   - On the dummy site, try posting: `<script>alert('XSS')</script>`
   - See the XSS Agent detect the threat

4. **Monitor Real-time Activity**:
   - Watch packet logs stream in real-time
   - Observe agent analysis in the DAG workflow
   - View threat alerts with remediation steps

## 🛡️ Security Features

### Multi-Agent System
- **XSS Agent**: Detects cross-site scripting patterns
- **SQL Injection Agent**: Identifies SQL injection attempts
- **Payload Agent**: Performs deep packet inspection
- **Threat Synthesizer**: Combines findings for accurate threat assessment

### Real-time Monitoring
- Live packet capture and analysis
- WebSocket-based instant updates
- Network statistics and health monitoring
- Semantic search capabilities

### Threat Intelligence
- Confidence scoring for each threat
- Severity classification (Low, Medium, High, Critical)
- Automated remediation recommendations
- Historical threat tracking

## 📊 Dashboard Components

- **Agent Analysis**: Live visualization of multi-agent DAG workflow
- **Packet Logs**: Real-time packet stream with threat indicators
- **Threat Alerts**: Prioritized security alerts with remediation
- **Network Stats**: System performance and health metrics
- **Active Connections**: Current network connection monitoring
- **Server Latency**: Performance tracking for connected servers
- **AI Insights**: Intelligent security recommendations

## 🔧 API Endpoints

### WebSocket
- `ws://localhost:8000/ws` - Real-time data stream

### REST API
- `GET /api/stats` - Network statistics
- `GET /api/threats` - Threat history
- `GET /api/packets` - Packet logs

## 🧪 Vulnerable Test Site

The dummy site (`http://localhost:8080`) includes intentionally vulnerable endpoints:
- `/login` - SQL injection testing
- `/search` - Query injection testing
- `/comment` - XSS vulnerability testing
- `/view` - Path traversal testing
- `/api/execute` - Command injection testing

⚠️ **Warning**: This site is intentionally vulnerable for testing purposes only.

## 📝 Development Notes

- Frontend: Next.js 15 with TypeScript, TailwindCSS, and shadcn/ui
- Backend: FastAPI with async/await, WebSockets, SQLAlchemy
- Database: SQLite for packet logs and threat detection
- Real-time: WebSocket connections for live updates

## 🤝 Contributing

This project was created for the A10 Networks Hackathon to demonstrate advanced AI-powered network security monitoring capabilities.

## 📄 License

[MIT License](LICENSE)
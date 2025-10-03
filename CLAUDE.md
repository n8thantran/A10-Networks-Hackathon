# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NetSentinel is an AI-powered network security monitoring system built for the A10 Networks Hackathon. The application features multi-agent AI workflow for parallel threat detection and analysis.

## Development Commands

### Frontend (Next.js 15 with Turbopack)
```bash
# Development server with Turbopack (fast refresh)
cd frontend && npm run dev

# Production build with Turbopack
cd frontend && npm run build

# Start production server
cd frontend && npm start
```

### Backend
The backend directory currently appears to be empty (main.py was deleted). Future backend development will likely involve Python-based APIs for:
- Real-time packet analysis
- WebSocket connections for live agent status
- RAG-powered semantic search with ChromaDB
- Multi-agent coordination

## Architecture

### Frontend Structure
- **Next.js 15 App Router** with TypeScript and TailwindCSS
- **Component Architecture**: Modular dashboard components in `components/dashboard/`
- **UI Components**: shadcn/ui-based components in `components/ui/`
- **Styling**: TailwindCSS v4 with custom dark theme and gradients

### Key Components
- **Dashboard Layout**: Grid-based responsive layout with specialized security monitoring widgets
- **Agent Analysis** (`components/dashboard/agent-analysis.tsx`): Real-time DAG workflow visualization for XSS, SQL Injection, and Payload agents
- **Semantic Search** (`components/dashboard/semantic-search.tsx`): RAG-powered natural language packet history search
- **Real-time Components**: Threat alerts, active connections, packet logs, network stats

### Multi-Agent AI System
The application is designed around a Directed Acyclic Graph (DAG) workflow:
1. **Criteria Selector Agent**: Natural language onboarding and filter generation
2. **Examiner Agent**: Packet filtering validation
3. **Parallel Detection Agents**:
   - XSS Agent: Cross-site scripting detection
   - SQL Injection Agent: SQL injection pattern matching  
   - Payload Agent: Deep packet inspection
4. **Synthesis Agent**: Coordinated threat intelligence aggregation

### Technology Stack
- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS v4
- **UI Framework**: Radix UI primitives with custom styling
- **Icons**: Lucide React icons
- **Planned Backend**: Python with WebSocket support, ChromaDB for vector search

## Development Notes

### Component Patterns
- All dashboard components use the Card UI component for consistent styling
- Real-time updates are simulated with intervals (TODO: connect to WebSocket)
- Progress indicators and status badges follow consistent color schemes:
  - Cyan/Blue: Primary actions and system status
  - Emerald: Success states and clear status
  - Red: Threats and errors
  - Yellow: Analyzing/in-progress states
  - Purple: SQL-related features

### Styling Conventions
- Dark theme with slate background gradients
- Glass-morphism effects with backdrop-blur
- Consistent spacing and typography using TailwindCSS utilities
- Gradient text effects for headings and accent elements

### TODO Integration Points
- WebSocket connection for real-time agent status updates
- Backend API integration for semantic search functionality
- ChromaDB vector database integration
- Real packet capture and analysis pipeline
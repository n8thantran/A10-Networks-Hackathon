"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface AgentStatus {
  name: string;
  status: "analyzing" | "clear" | "threat" | "idle";
  finding: string;
  confidence: number;
  color: string;
  icon: string;
}

export function AgentAnalysis() {
  const [agents, setAgents] = useState<AgentStatus[]>([]);

  useEffect(() => {
    // Initialize with sample data
    setAgents([
      {
        name: "XSS Agent",
        status: "analyzing",
        finding: "Scanning for cross-site scripting patterns...",
        confidence: 0,
        color: "cyan",
        icon: "👤",
      },
      {
        name: "SQL Injection Agent",
        status: "threat",
        finding: "Detected SQL injection attempt: ' OR '1'='1",
        confidence: 91,
        color: "purple",
        icon: "🗄️",
      },
      {
        name: "Payload Agent",
        status: "analyzing",
        finding: "Deep packet inspection in progress...",
        confidence: 0,
        color: "orange",
        icon: "📦",
      },
    ]);
    
    // TODO: Connect to real-time agent status via WebSocket
    // const ws = new WebSocket('ws://localhost:8000/agents/status');
    
    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        const rand = Math.random();
        if (agent.status === "analyzing") {
          if (rand > 0.7) {
            return { 
              ...agent, 
              status: rand > 0.85 ? "threat" : "clear",
              finding: rand > 0.85 ? "Suspicious pattern detected" : "No threats found",
              confidence: rand > 0.85 ? Math.floor(Math.random() * 20) + 80 : 0
            };
          }
        }
        return agent;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  function getStatusColor(status: string) {
    switch (status) {
      case "analyzing":
        return "border-yellow-500/30 bg-yellow-500/10";
      case "clear":
        return "border-emerald-500/30 bg-emerald-500/10";
      case "threat":
        return "border-red-500/30 bg-red-500/10";
      default:
        return "border-slate-500/30 bg-slate-500/10";
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "analyzing":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium">
            <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Analyzing
          </span>
        );
      case "clear":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium">
            ✓ Clear
          </span>
        );
      case "threat":
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
            ⚠ Threat
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 bg-slate-500/20 text-slate-400 rounded-full text-xs font-medium">
            Idle
          </span>
        );
    }
  }

  return (
    <Card className="h-full bg-slate-900/50 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Live Agent Analysis</CardTitle>
          <Badge variant="outline">DAG Workflow</Badge>
        </div>
        <CardDescription>Parallel processing with specialized AI agents</CardDescription>
      </CardHeader>
      <CardContent>

        <div className="mb-6">
        
        {/* Visual DAG representation */}
        <div className="relative bg-slate-800/30 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-slate-400 text-xs font-medium">
                Root
              </div>
              <svg className="w-6 h-6 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 10l5 5 5-5H7z" />
              </svg>
            </div>
          </div>
          
          <div className="flex items-start justify-center gap-4 mt-4">
            {agents.map((agent, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  agent.status === "threat" ? "bg-red-500/20" : 
                  agent.status === "clear" ? "bg-emerald-500/20" : 
                  "bg-yellow-500/20"
                }`}>
                  {agent.icon}
                </div>
                <div className="text-xs text-slate-500 text-center w-16">{agent.name.split(" ")[0]}</div>
              </div>
            ))}
          </div>
          
          <div className="flex items-center justify-center mt-4">
            <svg className="w-6 h-6 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5H7z" />
            </svg>
          </div>
          
          <div className="flex items-center justify-center mt-2">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center text-cyan-400 text-xs font-medium">
              Synth
            </div>
          </div>
        </div>
      </div>

        <div className="space-y-3">
          {agents.map((agent, idx) => (
            <Card
              key={idx}
              className={`bg-slate-800/50 border-slate-700 ${getStatusColor(agent.status)}`}
            >
              <CardContent className="pt-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{agent.icon}</span>
                    <h4 className="font-semibold text-white">{agent.name}</h4>
                  </div>
                  {getStatusBadge(agent.status)}
                </div>
                
                <p className="text-sm text-slate-300 mb-2">{agent.finding}</p>
                
                {agent.confidence > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Confidence:</span>
                    <Progress 
                      value={agent.confidence} 
                      className="flex-1 bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500" 
                    />
                    <span className="text-xs text-white font-medium">{agent.confidence}%</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


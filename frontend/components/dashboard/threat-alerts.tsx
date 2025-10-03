"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface ThreatAlert {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  timestamp: string;
  source: string;
}

export function ThreatAlerts() {
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);

  useEffect(() => {
    // Initialize with sample data
    const now = new Date().toISOString();
    setAlerts([
      {
        id: "1",
        type: "Port Scan",
        severity: "medium",
        description: "Multiple port scan attempts detected from external IP",
        timestamp: now,
        source: "45.33.32.156",
      },
      {
        id: "2",
        type: "DDoS Attack",
        severity: "critical",
        description: "High volume SYN flood detected - 50k requests/sec",
        timestamp: now,
        source: "Multiple IPs",
      },
      {
        id: "3",
        type: "SQL Injection",
        severity: "high",
        description: "SQL injection attempt blocked in login form",
        timestamp: now,
        source: "203.0.113.45",
      },
    ]);
    
    // TODO: Connect to API for real threat alerts
    // const eventSource = new EventSource('/api/threats/stream');
  }, []);

  function getSeverityColor(severity: string) {
    switch (severity) {
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  }

  function getSeverityIcon(severity: string) {
    switch (severity) {
      case "critical":
        return "🚨";
      case "high":
        return "⚠️";
      case "medium":
        return "⚡";
      case "low":
        return "ℹ️";
      default:
        return "•";
    }
  }

  return (
    <Card className="h-full bg-slate-900/50 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Threat Alerts</CardTitle>
          <Badge variant="destructive" className="bg-red-500/20 text-red-400 hover:bg-red-500/30">
            {alerts.filter(a => a.severity === "critical").length} Critical
          </Badge>
        </div>
      </CardHeader>
      <CardContent>

        <div className="space-y-3 overflow-y-auto max-h-[400px]">
          {alerts.map((alert) => (
            <Card
              key={alert.id}
              className={`${getSeverityColor(alert.severity)}`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{getSeverityIcon(alert.severity)}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">{alert.type}</h4>
                      <Badge variant="outline" className="text-xs uppercase">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{alert.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>Source: {alert.source}</span>
                      <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Investigate
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


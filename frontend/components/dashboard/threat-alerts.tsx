"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState } from "react";

interface ThreatAlert {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  timestamp: string;
  source_ip: string;
  confidence: number;
  remediation: string;
}

export function ThreatAlerts() {
  const [alerts, setAlerts] = useState<ThreatAlert[]>([]);
  
  // Get WebSocket from context
  const { isConnected, lastMessage } = useWebSocket();
  
  // Process incoming WebSocket messages
  useEffect(() => {
    if (lastMessage && lastMessage.type === 'threat' && lastMessage.data) {
      const alertData = lastMessage.data;
      
      // Determine severity based on threat level
      let severity: "low" | "medium" | "high" | "critical" = "low";
      if (alertData.threat_level >= 8) severity = "critical";
      else if (alertData.threat_level >= 6) severity = "high";
      else if (alertData.threat_level >= 4) severity = "medium";
      
      const newAlert: ThreatAlert = {
        id: String(alertData.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
        type: alertData.attack_type || alertData.type || 'Unknown',
        severity: severity,
        description: `${alertData.attack_type || 'Threat'} detected from ${alertData.source}`,
        timestamp: alertData.timestamp || new Date().toISOString(),
        source_ip: alertData.source || alertData.source_ip || '0.0.0.0',
        confidence: alertData.confidence || (alertData.threat_level / 10) || 0.85,
        remediation: `Block source IP ${alertData.source} and investigate traffic patterns`,
      };
      setAlerts(prev => [newAlert, ...prev].slice(0, 20)); // Keep last 20 alerts
    }
  }, [lastMessage]);

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
                      <span>Source: {alert.source_ip}</span>
                      <span>Confidence: {alert.confidence?.toFixed(0)}%</span>
                      <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                    </div>
                    {alert.remediation && (
                      <div className="text-xs text-cyan-400 border-t border-slate-700 pt-2 mt-2">
                        <strong>Action:</strong> {alert.remediation}
                      </div>
                    )}
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


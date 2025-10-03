"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface Connection {
  id: string;
  sourceIp: string;
  sourcePort: number;
  destinationIp: string;
  destinationPort: number;
  protocol: string;
  state: string;
  duration: number;
  bytesTransferred: number;
}

export function ActiveConnections() {
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: "1",
      sourceIp: "192.168.1.100",
      sourcePort: 54321,
      destinationIp: "10.0.0.5",
      destinationPort: 443,
      protocol: "HTTPS",
      state: "ESTABLISHED",
      duration: 125,
      bytesTransferred: 245000,
    },
    {
      id: "2",
      sourceIp: "192.168.1.105",
      sourcePort: 49152,
      destinationIp: "10.0.0.5",
      destinationPort: 80,
      protocol: "HTTP",
      state: "ESTABLISHED",
      duration: 45,
      bytesTransferred: 128000,
    },
    {
      id: "3",
      sourceIp: "203.0.113.25",
      sourcePort: 33445,
      destinationIp: "10.0.0.5",
      destinationPort: 22,
      protocol: "SSH",
      state: "SYN_SENT",
      duration: 2,
      bytesTransferred: 0,
    },
  ]);

  useEffect(() => {
    // TODO: Connect to API for real connection data
    // fetch('/api/connections/active')
  }, []);

  function formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function getStateColor(state: string) {
    switch (state) {
      case "ESTABLISHED":
        return "text-emerald-400 bg-emerald-500/20";
      case "SYN_SENT":
      case "SYN_RECEIVED":
        return "text-yellow-400 bg-yellow-500/20";
      case "CLOSE_WAIT":
      case "TIME_WAIT":
        return "text-orange-400 bg-orange-500/20";
      default:
        return "text-slate-400 bg-slate-500/20";
    }
  }

  return (
    <Card className="h-full bg-slate-900/50 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Active Connections</CardTitle>
          <Badge variant="outline" className="border-cyan-500/20 text-cyan-400">
            {connections.length} Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>

        <div className="space-y-3 overflow-y-auto max-h-[400px]">
          {connections.map((conn) => (
            <div
              key={conn.id}
              className="bg-slate-800/50 rounded-lg p-4 hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400 font-semibold">{conn.protocol}</span>
                  <Badge variant="outline" className={getStateColor(conn.state)}>
                    {conn.state}
                  </Badge>
                </div>
                <span className="text-xs text-slate-400">{conn.duration}s</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Source:</span>{" "}
                  <span className="text-white font-mono">
                    {conn.sourceIp}:{conn.sourcePort}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Destination:</span>{" "}
                  <span className="text-white font-mono">
                    {conn.destinationIp}:{conn.destinationPort}
                  </span>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-slate-400">
                Transferred: {formatBytes(conn.bytesTransferred)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


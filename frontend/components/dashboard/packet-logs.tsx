"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface PacketLog {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  protocol: string;
  size: number;
  status: "normal" | "suspicious" | "blocked";
}

export function PacketLogs() {
  const [packets, setPackets] = useState<PacketLog[]>([]);

  useEffect(() => {
    // Initialize with sample data
    const now = new Date().toISOString();
    setPackets([
      {
        id: "1",
        timestamp: now,
        source: "192.168.1.100",
        destination: "10.0.0.5",
        protocol: "TCP",
        size: 1024,
        status: "normal",
      },
      {
        id: "2",
        timestamp: now,
        source: "45.33.32.156",
        destination: "10.0.0.5",
        protocol: "UDP",
        size: 512,
        status: "suspicious",
      },
      {
        id: "3",
        timestamp: now,
        source: "192.168.1.105",
        destination: "10.0.0.5",
        protocol: "HTTP",
        size: 2048,
        status: "normal",
      },
    ]);

    // TODO: Connect to WebSocket API for real-time packet logs
    // const ws = new WebSocket('ws://localhost:8000/packets');
    
    const interval = setInterval(() => {
      const newPacket: PacketLog = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        source: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        destination: "10.0.0.5",
        protocol: ["TCP", "UDP", "HTTP", "DNS", "HTTPS"][Math.floor(Math.random() * 5)],
        size: Math.floor(Math.random() * 4096),
        status: Math.random() > 0.8 ? "suspicious" : "normal",
      };
      
      setPackets(prev => [newPacket, ...prev].slice(0, 50));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  function getStatusColor(status: string) {
    switch (status) {
      case "normal":
        return "text-emerald-400";
      case "suspicious":
        return "text-yellow-400";
      case "blocked":
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  }

  return (
    <Card className="h-full bg-slate-900/50 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Packet Logs</CardTitle>
          <Badge variant="outline" className="border-emerald-500/20 text-emerald-400">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
      
        <div className="space-y-2 overflow-y-auto max-h-[400px]">
          {packets.map((packet) => (
            <div
              key={packet.id}
              className="bg-slate-800/50 rounded-lg p-3 hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Source:</span>{" "}
                    <span className="text-white font-mono">{packet.source}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Dest:</span>{" "}
                    <span className="text-white font-mono">{packet.destination}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Protocol:</span>{" "}
                    <span className="text-cyan-400 font-medium">{packet.protocol}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Size:</span>{" "}
                    <span className="text-white">{packet.size}B</span>
                  </div>
                </div>
                <Badge variant={packet.status === "normal" ? "outline" : "destructive"} className={getStatusColor(packet.status)}>
                  {packet.status}
                </Badge>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {new Date(packet.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


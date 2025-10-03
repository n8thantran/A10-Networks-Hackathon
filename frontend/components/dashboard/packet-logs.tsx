"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useEffect, useState } from "react";

interface PacketLog {
  id: string;
  timestamp: string;
  source_ip: string;
  dest_ip: string;
  protocol: string;
  size: number;
  payload?: string;
  threat?: boolean;
}

export function PacketLogs() {
  const [packets, setPackets] = useState<PacketLog[]>([]);
  
  // Get WebSocket from context
  const { isConnected, lastMessage } = useWebSocket();
  
  // Process incoming WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      if ((lastMessage.type === 'packet' || lastMessage.type === 'threat') && lastMessage.data) {
        const packetData = lastMessage.data;
        const newPacket: PacketLog = {
          id: String(packetData.id || `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`),
          timestamp: packetData.timestamp || new Date().toISOString(),
          source_ip: packetData.source || packetData.source_ip || '0.0.0.0',
          dest_ip: packetData.destination || packetData.dest_ip || '0.0.0.0',
          protocol: packetData.protocol || 'TCP',
          size: packetData.size || 0,
          payload: packetData.payload,
          threat: packetData.threat_level > 5 || packetData.status === 'malicious',
        };
        setPackets(prev => [newPacket, ...prev].slice(0, 50)); // Keep last 50 packets
      }
    }
  }, [lastMessage]);

  function getThreatBadge(threat?: boolean) {
    if (threat) {
      return (
        <Badge variant="destructive" className="text-xs">
          Threat
        </Badge>
      );
    }
    return null;
  }

  return (
    <Card className="h-full bg-slate-900/50 border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Packet Logs</CardTitle>
          <Badge 
            variant="outline" 
            className={isConnected 
              ? "border-emerald-500/20 text-emerald-400" 
              : "border-red-500/20 text-red-400"
            }
          >
            <span className="relative flex h-2 w-2 mr-2">
              {isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            </span>
            {isConnected ? 'Live' : 'Disconnected'}
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
                    <span className="text-white font-mono">{packet.source_ip}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Dest:</span>{" "}
                    <span className="text-white font-mono">{packet.dest_ip}</span>
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
                {getThreatBadge(packet.threat)}
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


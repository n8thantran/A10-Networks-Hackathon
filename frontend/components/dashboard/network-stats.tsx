"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface NetworkStats {
  totalPackets: number;
  totalBytes: number;
  activeConnections: number;
  blockedAttempts: number;
  bandwidth: {
    inbound: number;
    outbound: number;
  };
  protocols: {
    name: string;
    percentage: number;
    color: string;
  }[];
}

export function NetworkStats() {
  const [stats, setStats] = useState<NetworkStats>({
    totalPackets: 2547893,
    totalBytes: 5.2 * 1024 * 1024 * 1024, // 5.2 GB
    activeConnections: 247,
    blockedAttempts: 1847,
    bandwidth: {
      inbound: 125.4,
      outbound: 89.3,
    },
    protocols: [
      { name: "HTTP/HTTPS", percentage: 45, color: "bg-cyan-500" },
      { name: "TCP", percentage: 30, color: "bg-blue-500" },
      { name: "UDP", percentage: 15, color: "bg-purple-500" },
      { name: "DNS", percentage: 7, color: "bg-emerald-500" },
      { name: "Other", percentage: 3, color: "bg-slate-500" },
    ],
  });

  useEffect(() => {
    // TODO: Connect to API for real network stats
    // fetch('/api/metrics/network')
    
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalPackets: prev.totalPackets + Math.floor(Math.random() * 1000),
        activeConnections: Math.floor(Math.random() * 50) + 200,
        bandwidth: {
          inbound: Math.random() * 50 + 100,
          outbound: Math.random() * 40 + 70,
        },
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  function formatBytes(bytes: number): string {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  }

  return (
    <Card className="h-full bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle>Network Statistics</CardTitle>
      </CardHeader>
      <CardContent>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Total Packets</div>
            <div className="text-2xl font-bold text-white">
              {stats.totalPackets.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Total Data</div>
            <div className="text-2xl font-bold text-white">
              {formatBytes(stats.totalBytes)}
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Active Connections</div>
            <div className="text-2xl font-bold text-emerald-400">
              {stats.activeConnections}
            </div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-sm text-slate-400 mb-1">Blocked Attempts</div>
            <div className="text-2xl font-bold text-red-400">
              {stats.blockedAttempts.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Bandwidth */}
        <div className="mb-6">
          <div className="text-sm font-medium text-slate-400 mb-3">Bandwidth (Mbps)</div>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-cyan-400">↓ Inbound</span>
                <span className="text-white font-mono">{stats.bandwidth.inbound.toFixed(1)}</span>
              </div>
              <Progress 
                value={Math.min((stats.bandwidth.inbound / 200) * 100, 100)} 
                className="h-2 bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500" 
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-purple-400">↑ Outbound</span>
                <span className="text-white font-mono">{stats.bandwidth.outbound.toFixed(1)}</span>
              </div>
              <Progress 
                value={Math.min((stats.bandwidth.outbound / 200) * 100, 100)} 
                className="h-2 bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-pink-500" 
              />
            </div>
          </div>
        </div>

        {/* Protocol Distribution */}
        <div>
          <div className="text-sm font-medium text-slate-400 mb-3">Protocol Distribution</div>
          <div className="space-y-2">
            {stats.protocols.map((protocol) => (
              <div key={protocol.name} className="flex items-center gap-3">
                <div className="w-20 text-sm text-slate-300">{protocol.name}</div>
                <Progress value={protocol.percentage} className="flex-1" />
                <div className="w-12 text-sm text-white text-right">{protocol.percentage}%</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


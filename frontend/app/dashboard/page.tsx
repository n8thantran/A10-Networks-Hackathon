"use client";

import { ActiveConnections } from "@/components/dashboard/active-connections";
import { AgentAnalysis } from "@/components/dashboard/agent-analysis";
import { AIInsights } from "@/components/dashboard/ai-insights";
import { NetworkStats } from "@/components/dashboard/network-stats";
import { PacketLogs } from "@/components/dashboard/packet-logs";
import { SemanticSearch } from "@/components/dashboard/semantic-search";
import { ServerLatency } from "@/components/dashboard/server-latency";
import { ThreatAlerts } from "@/components/dashboard/threat-alerts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [uptime, setUptime] = useState<string>("0h 0m");
  const [startTime] = useState<number>(Date.now());

  useEffect(() => {
    const updateUptime = () => {
      const elapsed = Date.now() - startTime;
      const hours = Math.floor(elapsed / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
      
      if (hours > 0) {
        setUptime(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setUptime(`${minutes}m ${seconds}s`);
      } else {
        setUptime(`${seconds}s`);
      }
    };

    updateUptime();
    const interval = setInterval(updateUptime, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 backdrop-blur-sm bg-slate-950/50 sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <span className="font-bold text-xl text-white">NetSentinel</span>
              </Link>
              <Badge variant="outline" className="hidden md:flex items-center gap-2 border-emerald-500/20 text-emerald-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                System Active
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Uptime:</span>
                  <span className="text-white font-mono">{uptime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">CPU:</span>
                  <span className="text-cyan-400 font-mono">24%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Memory:</span>
                  <span className="text-cyan-400 font-mono">3.2/8 GB</span>
                </div>
              </div>
              
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-[1800px] mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Security Dashboard</h1>
          <p className="text-slate-400">Real-time network monitoring and threat analysis</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Row 1 - Semantic Search (Full Width) */}
          <div className="xl:col-span-3">
            <SemanticSearch />
          </div>

          {/* Row 2 - Agent Analysis (Full Width) */}
          <div className="xl:col-span-3">
            <AgentAnalysis />
          </div>

          {/* Row 3 */}
          <div className="xl:col-span-2">
            <PacketLogs />
          </div>
          <div>
            <ServerLatency />
          </div>

          {/* Row 4 */}
          <div className="xl:col-span-2">
            <ThreatAlerts />
          </div>
          <div>
            <NetworkStats />
          </div>

          {/* Row 5 */}
          <div className="xl:col-span-2">
            <ActiveConnections />
          </div>
          <div>
            <AIInsights />
          </div>
        </div>
      </main>
    </div>
  );
}


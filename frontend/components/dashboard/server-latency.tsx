"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface DataPoint {
  timestamp: number;
  value: number;
}

export function ServerLatency() {
  const [latency, setLatency] = useState<number>(45);
  const [history, setHistory] = useState<DataPoint[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Initialize history on client side only to avoid hydration mismatch
    const now = Date.now();
    setHistory(Array.from({ length: 30 }, (_, i) => ({
      timestamp: now - (29 - i) * 3000,
      value: Math.floor(Math.random() * 40) + 30,
    })));
    setMounted(true);
  }, []);

  useEffect(() => {
    // TODO: Connect to API for real server latency
    // fetch('/api/metrics/latency')
    
    const interval = setInterval(() => {
      const newLatency = Math.floor(Math.random() * 60) + 20;
      setLatency(newLatency);
      setHistory(prev => [...prev.slice(-29), { timestamp: Date.now(), value: newLatency }]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  function getLatencyStatus(ms: number) {
    if (ms < 50) return { label: "Excellent", color: "text-emerald-400", gradient: "from-emerald-500 to-cyan-500", stroke: "stroke-emerald-500" };
    if (ms < 100) return { label: "Good", color: "text-cyan-400", gradient: "from-cyan-500 to-blue-500", stroke: "stroke-cyan-500" };
    if (ms < 200) return { label: "Fair", color: "text-yellow-400", gradient: "from-yellow-500 to-orange-500", stroke: "stroke-yellow-500" };
    return { label: "Poor", color: "text-red-400", gradient: "from-red-500 to-orange-500", stroke: "stroke-red-500" };
  }

  const status = getLatencyStatus(latency);
  const values = history.map(h => h.value);
  const maxLatency = history.length > 0 ? Math.max(...values, 100) : 100;
  const minLatency = history.length > 0 ? Math.min(...values, 0) : 0;
  const avgLatency = history.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 45;

  // Generate SVG path for the line chart
  function generatePath() {
    const width = 100;
    const height = 100;
    const points = history.map((point, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - ((point.value - minLatency) / (maxLatency - minLatency)) * height;
      return `${x},${y}`;
    });
    return `M ${points.join(" L ")}`;
  }

  // Generate SVG path for the filled area
  function generateAreaPath() {
    const width = 100;
    const height = 100;
    const points = history.map((point, i) => {
      const x = (i / (history.length - 1)) * width;
      const y = height - ((point.value - minLatency) / (maxLatency - minLatency)) * height;
      return `${x},${y}`;
    });
    return `M 0,${height} L ${points.join(" L ")} L ${width},${height} Z`;
  }

  return (
    <Card className="h-full bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle>Server Latency</CardTitle>
      </CardHeader>
      <CardContent>
      
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-baseline gap-2">
              <span className={`text-5xl font-bold ${status.color}`}>{latency}</span>
              <span className="text-2xl text-muted-foreground">ms</span>
            </div>
            <div className="mt-2">
              <Badge variant="outline" className={status.color}>
                {status.label}
              </Badge>
            </div>
          </div>
        
          <div className="text-right space-y-1">
            <div>
              <div className="text-xs text-slate-400">Average</div>
              <div className="text-xl font-semibold text-white">{avgLatency}ms</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Min/Max</div>
              <div className="text-sm text-slate-300">{minLatency}/{maxLatency}ms</div>
            </div>
          </div>
        </div>

        {/* Timeseries Graph */}
        <div className="relative h-40 bg-slate-800/30 rounded-lg p-4 mb-4">
          {mounted && history.length > 0 ? (
            <>
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between text-xs text-slate-500 pr-2">
                <span>{maxLatency}ms</span>
                <span>{Math.round((maxLatency + minLatency) / 2)}ms</span>
                <span>{minLatency}ms</span>
              </div>

              {/* Grid lines */}
              <div className="absolute left-12 right-0 top-0 bottom-0">
                <div className="absolute top-0 left-0 right-0 border-t border-slate-700/50"></div>
                <div className="absolute top-1/2 left-0 right-0 border-t border-slate-700/50"></div>
                <div className="absolute bottom-0 left-0 right-0 border-t border-slate-700/50"></div>
              </div>

              {/* Chart SVG */}
              <div className="absolute left-12 right-4 top-4 bottom-4">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="latencyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" className="stop-color-cyan-500" stopOpacity="0.3" />
                      <stop offset="100%" className="stop-color-cyan-500" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Filled area */}
                  <path
                    d={generateAreaPath()}
                    fill="url(#latencyGradient)"
                    className="transition-all duration-300"
                  />
                  
                  {/* Line */}
                  <path
                    d={generatePath()}
                    fill="none"
                    className={`${status.stroke} transition-all duration-300`}
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />

                  {/* Data points */}
                  {history.map((point, i) => {
                    const x = (i / (history.length - 1)) * 100;
                    const y = 100 - ((point.value - minLatency) / (maxLatency - minLatency)) * 100;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r="1.5"
                        className={`${status.stroke} fill-current`}
                        vectorEffect="non-scaling-stroke"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* Current value indicator */}
              <div className="absolute right-4 top-4">
                <div className="flex items-center gap-2 px-2 py-1 bg-slate-900/80 rounded text-xs">
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${status.gradient}`}></div>
                  <span className="text-white font-mono">{latency}ms</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-slate-500">
              Loading chart...
            </div>
          )}
        </div>
      
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Last {history.length} measurements (90s)</span>
          <Badge variant="outline" className="border-emerald-500/20 text-emerald-400">
            <span className="relative flex h-1.5 w-1.5 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            Live
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}


"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface Insight {
  id: string;
  type: "recommendation" | "warning" | "info";
  title: string;
  description: string;
  confidence: number;
  timestamp: string;
}

export function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    // Initialize with sample data
    const now = new Date().toISOString();
    setInsights([
      {
        id: "1",
        type: "warning",
        title: "Unusual Traffic Pattern Detected",
        description: "AI detected abnormal spike in UDP traffic from 45.33.32.0/24 subnet. Possible DDoS preparation phase.",
        confidence: 87,
        timestamp: now,
      },
      {
        id: "2",
        type: "recommendation",
        title: "Rate Limiting Recommended",
        description: "Based on traffic analysis, implementing rate limiting on port 443 could prevent 23% of suspicious connections.",
        confidence: 92,
        timestamp: now,
      },
      {
        id: "3",
        type: "info",
        title: "Protocol Optimization",
        description: "HTTP/2 adoption would reduce bandwidth usage by approximately 18% based on current traffic patterns.",
        confidence: 78,
        timestamp: now,
      },
    ]);
    
    // TODO: Connect to AI insights API
    // fetch('/api/ai/insights')
  }, []);

  function getInsightIcon(type: string) {
    switch (type) {
      case "warning":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case "recommendation":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        );
      case "info":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  }

  function getInsightColor(type: string) {
    switch (type) {
      case "warning":
        return "border-yellow-500/30 bg-yellow-500/10";
      case "recommendation":
        return "border-cyan-500/30 bg-cyan-500/10";
      case "info":
        return "border-blue-500/30 bg-blue-500/10";
      default:
        return "border-slate-500/30 bg-slate-500/10";
    }
  }

  function getInsightTextColor(type: string) {
    switch (type) {
      case "warning":
        return "text-yellow-400";
      case "recommendation":
        return "text-cyan-400";
      case "info":
        return "text-blue-400";
      default:
        return "text-slate-400";
    }
  }

  return (
    <Card className="h-full bg-slate-900/50 border-slate-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <CardTitle>AI Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent>

        <div className="space-y-3 overflow-y-auto max-h-[400px]">
          {insights.map((insight) => (
            <Card
              key={insight.id}
              className={`${getInsightColor(insight.type)}`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <div className={getInsightTextColor(insight.type)}>
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold mb-1 ${getInsightTextColor(insight.type)}`}>
                      {insight.title}
                    </h4>
                    <p className="text-sm text-slate-300 mb-3">{insight.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Confidence:</span>
                        <Progress 
                          value={insight.confidence} 
                          className="w-20 bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500" 
                        />
                        <span className="text-xs text-white font-medium">{insight.confidence}%</span>
                      </div>
                      <span className="text-xs text-slate-500">
                        {new Date(insight.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}


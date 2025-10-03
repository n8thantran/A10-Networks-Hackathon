"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

interface SearchResult {
  id: string;
  timestamp: string;
  source: string;
  destination: string;
  threat: string;
  relevance: number;
}

export function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);

  function handleSearch() {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // TODO: Connect to RAG API with ChromaDB
    // fetch('/api/search/semantic', { method: 'POST', body: JSON.stringify({ query }) })
    
    // Mock results
    setTimeout(() => {
      setResults([
        {
          id: "1",
          timestamp: new Date().toISOString(),
          source: "45.33.32.156",
          destination: "10.0.0.5",
          threat: "SQL Injection attempt detected in login form payload",
          relevance: 0.94,
        },
        {
          id: "2",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          source: "203.0.113.45",
          destination: "10.0.0.5",
          threat: "Similar SQL injection pattern from related subnet",
          relevance: 0.87,
        },
      ]);
      setIsSearching(false);
    }, 1000);
  }

  return (
    <Card className="h-full bg-slate-900/50 border-slate-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <CardTitle>RAG-Powered Semantic Search</CardTitle>
        </div>
        <CardDescription>
          Query your packet history using natural language. Powered by ChromaDB vector embeddings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="e.g., 'Show me SQL injection attempts from last hour'"
            className="flex-1"
          />
          <Button
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Search"
            )}
          </Button>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            <div className="text-sm text-slate-400">
              Found {results.length} relevant results
            </div>
            {results.map((result) => (
              <Card key={result.id} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-colors">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-cyan-400 border-cyan-400">Threat Match</Badge>
                        <div className="flex items-center gap-2 flex-1">
                          <Progress 
                            value={result.relevance * 100} 
                            className="w-20 bg-slate-700 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-blue-500" 
                          />
                          <span className="text-xs text-slate-400">{Math.round(result.relevance * 100)}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-white">{result.threat}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-3">
                    <span>From: {result.source}</span>
                    <span>To: {result.destination}</span>
                    <span>{new Date(result.timestamp).toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {results.length === 0 && !isSearching && (
          <div className="text-center py-8 text-slate-500">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p>Try searching: "SQL injection", "DDoS attacks", "suspicious payloads"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


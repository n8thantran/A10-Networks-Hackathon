"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWebSocket } from "@/hooks/useWebSocket";
import { 
  Play, 
  Pause, 
  Zap, 
  Shield, 
  Database, 
  Code, 
  Wifi, 
  Search,
  Bug,
  Activity
} from "lucide-react";

export function AttackSimulator() {
  const { sendMessage, isConnected } = useWebSocket();
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeAttacks, setActiveAttacks] = useState<Set<string>>(new Set());

  const simulationScenarios = [
    {
      id: "normal",
      name: "Normal Traffic",
      icon: Activity,
      description: "Simulate legitimate HTTP/HTTPS traffic",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20"
    },
    {
      id: "sql_injection",
      name: "SQL Injection",
      icon: Database,
      description: "Launch SQL injection attack patterns",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20"
    },
    {
      id: "xss",
      name: "XSS Attack",
      icon: Code,
      description: "Cross-site scripting payloads",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20"
    },
    {
      id: "ddos",
      name: "DDoS Flood",
      icon: Wifi,
      description: "Distributed denial of service simulation",
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20"
    },
    {
      id: "port_scan",
      name: "Port Scan",
      icon: Search,
      description: "Network reconnaissance scan",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20"
    },
    {
      id: "malware",
      name: "Malware Payload",
      icon: Bug,
      description: "Inject malicious payloads",
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20"
    }
  ];

  const handleStartSimulation = () => {
    setIsSimulating(true);
    sendMessage({
      type: "control",
      action: "start_simulation",
      timestamp: new Date().toISOString()
    });
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
    setActiveAttacks(new Set());
    sendMessage({
      type: "control",
      action: "stop_simulation",
      timestamp: new Date().toISOString()
    });
  };

  const handleTriggerAttack = (attackType: string) => {
    const newActive = new Set(activeAttacks);
    
    if (newActive.has(attackType)) {
      newActive.delete(attackType);
      sendMessage({
        type: "control",
        action: "stop_attack",
        attack_type: attackType,
        timestamp: new Date().toISOString()
      });
    } else {
      newActive.add(attackType);
      sendMessage({
        type: "control",
        action: "trigger_attack",
        attack_type: attackType,
        timestamp: new Date().toISOString()
      });
      
      // Auto-stop after 10 seconds
      setTimeout(() => {
        setActiveAttacks(prev => {
          const updated = new Set(prev);
          updated.delete(attackType);
          return updated;
        });
      }, 10000);
    }
    
    setActiveAttacks(newActive);
  };

  const handleBurstAttack = () => {
    // Trigger all attack types in sequence
    const attacks = ["sql_injection", "xss", "ddos", "port_scan", "malware"];
    
    attacks.forEach((attack, index) => {
      setTimeout(() => {
        handleTriggerAttack(attack);
      }, index * 1000);
    });
  };

  return (
    <Card className="bg-slate-900/50 backdrop-blur-sm border-slate-800/50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Attack Simulator</h2>
              <p className="text-sm text-slate-400">Test security responses with simulated threats</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Badge 
              variant="outline" 
              className={`${
                isConnected 
                  ? "border-emerald-500/20 text-emerald-400" 
                  : "border-red-500/20 text-red-400"
              }`}
            >
              <span className="relative flex h-2 w-2 mr-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  isConnected ? "bg-emerald-400" : "bg-red-400"
                } opacity-75`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${
                  isConnected ? "bg-emerald-500" : "bg-red-500"
                }`}></span>
              </span>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
            
            {!isSimulating ? (
              <Button 
                onClick={handleStartSimulation}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Start Auto-Sim
              </Button>
            ) : (
              <Button 
                onClick={handleStopSimulation}
                variant="destructive"
              >
                <Pause className="w-4 h-4 mr-2" />
                Stop Auto-Sim
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
          {simulationScenarios.map((scenario) => {
            const Icon = scenario.icon;
            const isActive = activeAttacks.has(scenario.id);
            
            return (
              <button
                key={scenario.id}
                onClick={() => handleTriggerAttack(scenario.id)}
                disabled={!isConnected}
                className={`
                  relative group p-4 rounded-lg border transition-all duration-200
                  ${scenario.bgColor} ${scenario.borderColor}
                  ${isActive ? "scale-95 ring-2 ring-offset-2 ring-offset-slate-900" : ""}
                  hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                  ${isActive ? `ring-${scenario.color.split('-')[1]}-500` : ""}
                `}
              >
                {isActive && (
                  <div className="absolute top-2 right-2">
                    <span className="relative flex h-2 w-2">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${scenario.bgColor} opacity-75`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${scenario.bgColor}`}></span>
                    </span>
                  </div>
                )}
                
                <Icon className={`w-8 h-8 ${scenario.color} mx-auto mb-2`} />
                <h3 className="text-sm font-semibold text-white mb-1">{scenario.name}</h3>
                <p className="text-xs text-slate-400">{scenario.description}</p>
                
                {isActive && (
                  <div className="absolute inset-0 rounded-lg overflow-hidden pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent animate-pulse"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-800/50">
          <Button
            onClick={handleBurstAttack}
            disabled={!isConnected}
            variant="outline"
            className="border-red-500/20 text-red-400 hover:bg-red-500/10"
          >
            <Shield className="w-4 h-4 mr-2" />
            Burst Attack (All Types)
          </Button>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Active Attacks:</span>
            <Badge variant="outline" className="border-cyan-500/20 text-cyan-400">
              {activeAttacks.size}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
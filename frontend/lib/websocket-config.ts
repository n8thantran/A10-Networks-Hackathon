// WebSocket configuration
// Update these URLs to match your backend WebSocket endpoints

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

export const WS_ENDPOINTS = {
  PACKETS: `${WS_BASE_URL}/ws/packets`,
  THREATS: `${WS_BASE_URL}/ws/threats`,
  METRICS: `${WS_BASE_URL}/ws/metrics`,
  AGENTS: `${WS_BASE_URL}/ws/agents`,
  INSIGHTS: `${WS_BASE_URL}/ws/insights`,
} as const;

export const WS_CONFIG = {
  reconnectInterval: 3000, // 3 seconds
  maxReconnectAttempts: 5,
} as const;


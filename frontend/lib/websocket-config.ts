// WebSocket configuration
// Update these URLs to match your backend WebSocket endpoints

const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000';

export const WS_ENDPOINTS = {
  PACKETS: `${WS_BASE_URL}/ws`,
  THREATS: `${WS_BASE_URL}/ws`,
  METRICS: `${WS_BASE_URL}/ws`,
  AGENTS: `${WS_BASE_URL}/ws`,
  INSIGHTS: `${WS_BASE_URL}/ws`,
} as const;

export const WS_CONFIG = {
  reconnectInterval: 3000, // 3 seconds
  maxReconnectAttempts: 5,
} as const;


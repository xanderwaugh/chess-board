"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Socket message types for chess multiplayer
 */
export type SocketMessageType =
  | "move"
  | "chat"
  | "join"
  | "leave"
  | "gameState"
  | "playerReady"
  | "rematch"
  | "draw"
  | "resign";

export interface SocketMessage<T = unknown> {
  type: SocketMessageType;
  payload: T;
  timestamp: number;
  playerId?: string;
}

export interface MovePayload {
  from: string;
  to: string;
  promotion?: string;
  fen?: string;
}

export interface GameStatePayload {
  fen: string;
  pgn?: string;
  turn: "w" | "b";
  isGameOver: boolean;
  result?: string;
}

interface UseSocketOptions {
  url?: string;
  roomId?: string;
  playerId?: string;
  autoConnect?: boolean;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

interface UseSocketReturn {
  connected: boolean;
  send: <T>(type: SocketMessageType, payload: T) => void;
  subscribe: <T>(
    type: SocketMessageType,
    handler: (payload: T) => void,
  ) => () => void;
  connect: () => void;
  disconnect: () => void;
  error: string | null;
}

/**
 * Hook for WebSocket communication in multiplayer chess
 * Note: This is a client-side implementation ready for WebSocket integration
 */
export function useSocket(options: UseSocketOptions = {}): UseSocketReturn {
  const {
    url,
    roomId,
    playerId,
    autoConnect = false,
    reconnectAttempts = 3,
    reconnectDelay = 2000,
  } = options;

  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const subscribersRef = useRef<
    Map<SocketMessageType, Set<(payload: unknown) => void>>
  >(new Map());
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectRef = useRef<(() => void) | null>(null);

  const connect = useCallback(() => {
    if (!url) {
      setError("WebSocket URL not provided");
      return;
    }

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      return; // Already connected
    }

    try {
      const wsUrl = roomId ? `${url}?room=${roomId}` : url;
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        console.log("WebSocket connected");
        setConnected(true);
        setError(null);
        reconnectCountRef.current = 0;

        // Send join message
        if (roomId && playerId) {
          socket.send(
            JSON.stringify({
              type: "join",
              payload: { roomId, playerId },
              timestamp: Date.now(),
            }),
          );
        }
      };

      socket.onmessage = (event) => {
        try {
          const message: SocketMessage = JSON.parse(event.data);
          const subscribers = subscribersRef.current.get(message.type);

          if (subscribers) {
            subscribers.forEach((handler) => {
              handler(message.payload);
            });
          }
        } catch (err) {
          console.error("Failed to parse socket message:", err);
        }
      };

      socket.onerror = (event) => {
        console.error("WebSocket error:", event);
        setError("WebSocket connection error");
      };

      socket.onclose = () => {
        console.log("WebSocket disconnected");
        setConnected(false);
        socketRef.current = null;

        // Attempt reconnection
        if (reconnectCountRef.current < reconnectAttempts) {
          reconnectCountRef.current++;
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log(`Reconnecting... Attempt ${reconnectCountRef.current}`);
            connectRef.current?.();
            // connect();
          }, reconnectDelay);
        }
      };

      socketRef.current = socket;
    } catch (err) {
      console.error("Failed to create WebSocket:", err);
      setError("Failed to establish connection");
    }
  }, [url, roomId, playerId, reconnectAttempts, reconnectDelay]);

  // Store connect function in ref
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    setConnected(false);
  }, []);

  const send = useCallback(
    <T>(type: SocketMessageType, payload: T) => {
      if (
        !socketRef.current ||
        socketRef.current.readyState !== WebSocket.OPEN
      ) {
        console.warn("Cannot send message: WebSocket not connected");
        return;
      }

      const message: SocketMessage<T> = {
        type,
        payload,
        timestamp: Date.now(),
        playerId,
      };

      socketRef.current.send(JSON.stringify(message));
    },
    [playerId],
  );

  const subscribe = useCallback(
    <T>(type: SocketMessageType, handler: (payload: T) => void) => {
      if (!subscribersRef.current.has(type)) {
        subscribersRef.current.set(type, new Set());
      }

      const subscribers = subscribersRef.current.get(type)!;
      subscribers.add(handler as (payload: unknown) => void);

      // Return unsubscribe function
      return () => {
        subscribers.delete(handler as (payload: unknown) => void);
        if (subscribers.size === 0) {
          subscribersRef.current.delete(type);
        }
      };
    },
    [],
  );

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      // connect();
      connectRef.current?.();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, disconnect]);

  return {
    connected,
    send,
    subscribe,
    connect,
    disconnect,
    error,
  };
}

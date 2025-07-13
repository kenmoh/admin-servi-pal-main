import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface RealtimeConfig {
  url: string;
  events: string[];
  onMessage?: (data: any) => void;
}

export function useRealtime({ url, events, onMessage }: RealtimeConfig) {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        // Subscribe to events
        events.forEach((event) => {
          ws.send(JSON.stringify({ type: "subscribe", event }));
        });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          // Handle different event types
          switch (data.type) {
            case "new_order":
              queryClient.invalidateQueries({ queryKey: ["orders"] });
              break;
            case "new_user":
              queryClient.invalidateQueries({ queryKey: ["users"] });
              break;
            case "new_team":
              queryClient.invalidateQueries({ queryKey: ["teams"] });
              break;
            case "order_status_update":
              queryClient.invalidateQueries({ queryKey: ["orders"] });
              break;
            default:
              // Custom handler
              onMessage?.(data);
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected, reconnecting...");
        setTimeout(connect, 3000); // Reconnect after 3 seconds
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, events, queryClient, onMessage]);

  return wsRef.current;
}

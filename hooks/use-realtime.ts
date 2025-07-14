import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface RealtimeConfig {
  url: string;
  events: string[];
  onMessage?: (data: any) => void;
}

export function useRealtime({ url, events, onMessage }: RealtimeConfig) {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  useEffect(() => {
    const connect = () => {
      console.log(`Attempting to connect to WebSocket: ${url}`);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected successfully");
        setIsConnected(true);
        setConnectionAttempts(0);
        toast.success("Real-time connection established");

        // Subscribe to events
        events.forEach((event) => {
          ws.send(JSON.stringify({ type: "subscribe", event }));
        });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket message received:", data);

          // Handle different event types
          switch (data.type) {
            case "new_order":
              console.log("Invalidating orders query...");
              queryClient.invalidateQueries({ queryKey: ["orders"] });
              queryClient.refetchQueries({ queryKey: ["orders"] });
              break;
            case "new_user":
              console.log("Invalidating users query...");
              queryClient.invalidateQueries({ queryKey: ["users"] });
              queryClient.refetchQueries({ queryKey: ["users"] });
              break;
            case "new_team":
              console.log("Invalidating teams query...");
              queryClient.invalidateQueries({ queryKey: ["teams"] });
              queryClient.refetchQueries({ queryKey: ["teams"] });
              break;
            case "order_status_update":
              console.log("Invalidating orders query for status update...");
              queryClient.invalidateQueries({ queryKey: ["orders"] });
              queryClient.refetchQueries({ queryKey: ["orders"] });
              break;
            default:
              console.log("Unknown event type:", data.type);
              // Custom handler
              onMessage?.(data);
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected, reconnecting...");
        setIsConnected(false);
        setConnectionAttempts((prev) => prev + 1);

        if (connectionAttempts < 5) {
          setTimeout(connect, 3000); // Reconnect after 3 seconds
        } else {
          toast.error("Failed to connect to real-time service");
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
        toast.error("Real-time connection error");
      };
    };

    connect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [url, events, queryClient, onMessage, connectionAttempts]);

  return { ws: wsRef.current, isConnected, connectionAttempts };
}

import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface RealtimeConfig {
  url: string;
  events: string[];
  onMessage?: (data: any) => void;
}

// Debounce map type
interface ToastRecord {
  [key: string]: { id: string | number; time: number };
}

export function useRealtime({ url, events, onMessage }: RealtimeConfig) {
  const queryClient = useQueryClient();
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  // Debounce ref for toasts
  const lastToastRef = useRef<ToastRecord>({});
  const TOAST_DEBOUNCE_MS = 3000;
  const MAX_ATTEMPTS = 5;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionAttemptsRef = useRef(0);

  useEffect(() => {
    let isUnmounted = false;

    const connect = () => {
      if (isUnmounted) return;
      console.log(`Attempting to connect to WebSocket: ${url}`);
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected successfully");
        setIsConnected(true);
        setConnectionAttempts(0);
        connectionAttemptsRef.current = 0;
        toast.dismiss("ws-error"); // Dismiss error toast on reconnect
        toast.success("Real-time connection established", {
          id: "ws-success",
          duration: 2000,
        });

        // Subscribe to events
        events.forEach((event) => {
          ws.send(JSON.stringify({ type: "subscribe", event }));
        });
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("WebSocket message received:", data);

          // Helper to debounce toasts
          function showDebouncedToast(
            type: string,
            id: string | number,
            message: string,
            toastFn = toast.success
          ) {
            const now = Date.now();
            const key = `${type}:${id}`;
            const last = lastToastRef.current[key];
            if (last && now - last.time < TOAST_DEBOUNCE_MS) {
              return;
            }
            lastToastRef.current[key] = { id, time: now };
            toastFn(message);
          }

          // Handle different event types
          switch (data.type) {
            case "new_order":
              console.log("Invalidating orders query...");
              queryClient.invalidateQueries({ queryKey: ["orders"] });
              queryClient.refetchQueries({ queryKey: ["orders"] });
              if (data.order_id) {
                showDebouncedToast(
                  "new_order",
                  data.order_id,
                  `New order received: #${data.order_id}`
                );
              }
              break;
            case "new_user":
              console.log("Invalidating users query...");
              queryClient.invalidateQueries({ queryKey: ["users"] });
              queryClient.refetchQueries({ queryKey: ["users"] });
              if (data.email) {
                showDebouncedToast(
                  "new_user",
                  data.email,
                  `New user registered: ${data.email}`,
                  toast.info
                );
              }
              break;
            case "new_team":
              console.log("Invalidating teams query...");
              queryClient.invalidateQueries({ queryKey: ["teams"] });
              queryClient.refetchQueries({ queryKey: ["teams"] });
              if (data.team_id) {
                showDebouncedToast(
                  "new_team",
                  data.team_id,
                  `New team member added: #${data.team_id}`
                );
              }
              break;
            case "order_status_update":
              console.log("Invalidating orders query for status update...");
              queryClient.invalidateQueries({ queryKey: ["orders"] });
              queryClient.refetchQueries({ queryKey: ["orders"] });
              if (data.order_id && data.status) {
                showDebouncedToast(
                  "order_status_update",
                  data.order_id,
                  `Order #${data.order_id} status updated to ${data.status}`,
                  toast.info
                );
              }
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
        connectionAttemptsRef.current += 1;
        setConnectionAttempts(connectionAttemptsRef.current);

        if (connectionAttemptsRef.current < MAX_ATTEMPTS) {
          if (!isUnmounted) {
            reconnectTimeoutRef.current = setTimeout(connect, 3000); // Reconnect after 3 seconds
          }
        } else {
          toast.error("Failed to connect to real-time service", {
            id: "ws-error",
            duration: 10000,
          });
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setIsConnected(false);
        // Only show one error toast at a time
        toast.error("Real-time connection error", {
          id: "ws-error",
          duration: 5000,
        });
      };
    };

    connect();

    return () => {
      isUnmounted = true;
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
    // Only re-run if url or events change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(events), queryClient, onMessage]);

  return { ws: wsRef.current, isConnected, connectionAttempts };
}
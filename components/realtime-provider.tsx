"use client";

import { useRealtime } from '@/hooks/use-realtime';
import { toast } from 'sonner';
import { createContext, useContext } from 'react';

interface RealtimeContextType {
    isConnected: boolean;
    connectionAttempts: number;
}

const RealtimeContext = createContext<RealtimeContextType | null>(null);

export function useRealtimeStatus() {
    const context = useContext(RealtimeContext);
    if (!context) {
        throw new Error('useRealtimeStatus must be used within RealtimeProvider');
    }
    return context;
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
    // Connect to WebSocket for real-time updates
    const { isConnected, connectionAttempts } = useRealtime({
        url: process.env.NEXT_PUBLIC_WS_URL || 'wss://api.servi-pal.com/ws',
        events: ['new_order', 'delivery_order_status_update', 'new_user', 'new_team', 'order_status_update'],
    });

    // Show connection status in console for debugging
    console.log('WebSocket Status:', { isConnected, connectionAttempts });

    return (
        <RealtimeContext.Provider value={{ isConnected, connectionAttempts }}>
            {children}
        </RealtimeContext.Provider>
    );
} 
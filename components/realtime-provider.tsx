"use client";

import { useRealtime } from '@/hooks/use-realtime';
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

// Utility to get a cookie value by name (client-side)
function getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
    // Get token from cookies (client-side)
    const token = typeof window !== 'undefined' ? getCookie('access_token') : '';
    const wsUrl = `${process.env.NEXT_PUBLIC_WS_URL || 'wss://api.servi-pal.com/ws'}`;
    // const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws';

    const { isConnected, connectionAttempts } = useRealtime({
        url: wsUrl,
        events: ['new_order', 'new_report_message', 'delivery_order_status_update', 'wallet_update', 'new_transaction', 'transaction_update', 'new_user', 'new_team', 'order_status_update'],
    });

    return (
        <RealtimeContext.Provider value={{ isConnected, connectionAttempts }}>
            {children}
        </RealtimeContext.Provider>
    );
} 
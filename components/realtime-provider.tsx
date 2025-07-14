"use client";

import { useRealtime } from '@/hooks/use-realtime';
import { toast } from 'sonner';

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
    // Connect to WebSocket for real-time updates
    useRealtime({
        url: process.env.NEXT_PUBLIC_WS_URL || 'wss://api.servi-pal.com/ws',
        events: ['new_order', 'new_user', 'new_team', 'order_status_update'],
        onMessage: (data) => {
            // Show toast notifications for important events
            switch (data.type) {
                case 'new_order':
                    toast.success(`New order received: #${data.order_id}`);
                    break;
                case 'new_user':
                    toast.info(`New user registered: ${data.email}`);
                    break;
                case 'order_status_update':
                    toast.info(`Order #${data.order_id} status updated to ${data.status}`);
                    break;
            }
        },
    });

    return <>{children}</>;
} 
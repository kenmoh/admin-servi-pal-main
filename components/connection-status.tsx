"use client";

import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface ConnectionStatusProps {
    isConnected: boolean;
    connectionAttempts: number;
}

export function ConnectionStatus({ isConnected, connectionAttempts }: ConnectionStatusProps) {
    return (
        <div className="flex items-center gap-2">
            {isConnected ? (
                <Badge variant="default" className="bg-green-500">
                    <Wifi className="h-3 w-3 mr-1" />
                    Connected
                </Badge>
            ) : (
                <Badge variant="destructive">
                    <WifiOff className="h-3 w-3 mr-1" />
                    Disconnected
                    {connectionAttempts > 0 && ` (${connectionAttempts}/5)`}
                </Badge>
            )}
        </div>
    );
} 
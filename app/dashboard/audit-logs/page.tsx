"use client";

import * as React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  resource_type: string;
  resource_id?: string;
  resource_summary?: string;
  changes?: Record<string, [any, any]>;
  ip_address?: string;
  metadata?: Record<string, any>;
}

const dummyAuditLogs: AuditLogEntry[] = [
  {
    id: "1",
    timestamp: new Date().toISOString(),
    actor_id: "admin-1",
    actor_name: "Alice Admin",
    actor_role: "admin",
    action: "update_settings",
    resource_type: "settings",
    resource_id: "charge-commission",
    resource_summary: "Charge Commission",
    changes: { commission: ["5%", "7%"] },
    ip_address: "192.168.1.10",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 3600 * 1000).toISOString(),
    actor_id: "staff-2",
    actor_name: "Bob Staff",
    actor_role: "staff",
    action: "create_user",
    resource_type: "user",
    resource_id: "user-123",
    resource_summary: "User: John Doe",
    ip_address: "192.168.1.11",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    actor_id: "admin-1",
    actor_name: "Alice Admin",
    actor_role: "admin",
    action: "delete_order",
    resource_type: "order",
    resource_id: "order-456",
    resource_summary: "Order #456",
    ip_address: "192.168.1.10",
  },
];

export default function AuditLogsPage() {
  return (
    <div className="w-full space-y-6">
      <h1 className="text-2xl font-semibold">Audit Logs</h1>
      <div className="overflow-x-auto rounded-lg border bg-background">
        <Table className="min-w-[800px]">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Date/Time</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Changes</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyAuditLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                <TableCell>{log.actor_name}</TableCell>
                <TableCell><Badge variant="outline">{log.actor_role}</Badge></TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>
                  <div className="font-medium">{log.resource_type}</div>
                  <div className="text-xs text-muted-foreground">{log.resource_summary}</div>
                </TableCell>
                <TableCell>
                  {log.changes ? (
                    <ul className="text-xs">
                      {Object.entries(log.changes).map(([field, [oldVal, newVal]]) => (
                        <li key={field}>
                          <span className="font-medium">{field}:</span> {String(oldVal)} → <span className="text-green-600">{String(newVal)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>{log.ip_address || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

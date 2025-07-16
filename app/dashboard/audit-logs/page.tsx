"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuditLogs } from "@/actions/audit";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AuditLogsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["audit-logs"],
    queryFn: getAuditLogs,
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <div className="p-8">Loading audit logs...</div>;
  if (isError || (data && "error" in data)) return <div className="p-8 text-red-500">Failed to load audit logs.</div>;

  return (
    <div className="flex flex-col gap-8 py-8 px-4 lg:px-12 w-full mx-auto">
      <h1 className="text-2xl font-bold mb-2">Audit Logs</h1>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && !("error" in data) && data.map((log: any) => (
                <TableRow key={log.id}>
                  <TableCell>{log.user.email}</TableCell>
                  <TableCell>{log.action}</TableCell>
                  <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

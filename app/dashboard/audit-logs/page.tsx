"use client";

import { AuditLogDataTable } from "@/components/audit-log-data-table";

export default function AuditLogsPage() {
  return (
    <div className="w-full space-y-6 p-6">
      <h1 className="text-2xl font-semibold">Audit Logs</h1>
      <AuditLogDataTable />
    </div>
  );
}
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { getAllAudits, getAuditById } from "@/actions/audit";
import { AuditLog } from "@/types/audit-type";
import { Input } from "./ui/input";

export function AuditLogDataTable() {
  const [audits, setAudits] = React.useState<AuditLog[]>([]);
  const [selectedAudit, setSelectedAudit] = React.useState<AuditLog | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    const fetchAudits = async () => {
      const allAudits = await getAllAudits();
      setAudits(allAudits);
    };
    fetchAudits();
  }, []);


  const handleRowClick = async (id: string) => {
    const audit = await getAuditById(id);
    setSelectedAudit(audit);
    setIsDrawerOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredAudits = audits.filter((audit) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      audit.actor_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      audit.action.toLowerCase().includes(lowerCaseSearchTerm) ||
      audit.resource_type.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  return (
    <>
      <div className="flex items-center mb-4">
        <Input
          placeholder="Search by Actor, Action, or Resource Type"
          value={searchTerm}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
      </div>
      <div className="overflow-x-auto rounded-lg border bg-background">
        <Table className="min-w-[800px]">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Date/Time</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAudits.map((log) => (
              <TableRow className='cursor-pointer' key={log.id} onClick={() => handleRowClick(log.id)}>
                <TableCell>
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>{log.actor_name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{log.actor_role}</Badge>
                </TableCell>
                <TableCell>{log.action}</TableCell>
                <TableCell>
                  <div className="font-medium">{log.resource_type}</div>
                  <div className="text-xs text-muted-foreground">
                    {log.resource_summary}
                  </div>
                </TableCell>
                <TableCell>{log.ip_address || "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Drawer direction='right' open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Audit Log Details</DrawerTitle>
            <DrawerDescription>
              Detailed view of the selected audit log entry.
            </DrawerDescription>
          </DrawerHeader>
          {selectedAudit && (
            <div className="p-4">
              <pre className='text-green-600'>{JSON.stringify(selectedAudit, null, 2)}</pre>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
}
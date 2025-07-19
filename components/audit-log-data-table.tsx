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
import { getAllAudits, getAuditById, getUserAudits } from "@/actions/audit";
import { AuditLog } from "@/types/audit-type";
import { Input } from "./ui/input";
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function AuditLogDataTable() {
  const { data: audits = [], isLoading } = useQuery({
    queryKey: ['audits'],
    queryFn: getAllAudits
  });
  const [selectedAudit, setSelectedAudit] = React.useState<AuditLog | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [userAuditsOpen, setUserAuditsOpen] = React.useState(false);
  const [userIdForAudits, setUserIdForAudits] = React.useState<string | null>(null);

  const handleRowClick = async (id: string) => {
    const audit = await getAuditById(id);
    setSelectedAudit(audit);
    setIsDrawerOpen(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleShowUserAudits = (actorId: string) => {
    setUserIdForAudits(actorId);
    setUserAuditsOpen(true);
  };

  const filteredAudits = audits.filter((audit) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      audit.actor_name.toLowerCase().includes(lowerCaseSearchTerm) ||
      audit.action.toLowerCase().includes(lowerCaseSearchTerm) ||
      audit.resource_type.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  const { data: userAudits = [], isLoading: isUserAuditsLoading } = useQuery({
    queryKey: ["user-audits", userIdForAudits],
    queryFn: () => userIdForAudits ? getUserAudits(userIdForAudits) : Promise.resolve([]),
    enabled: !!userIdForAudits && userAuditsOpen,
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
        {isLoading && (
          <div className="mb-2 text-center text-muted-foreground">Loading audits...</div>
        )}
        <Table className="min-w-[800px]">
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead>Date/Time</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <div className="animate-pulse h-4 bg-muted rounded w-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : filteredAudits.map((log) => (
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
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => handleShowUserAudits(selectedAudit.actor_id)}
              >
                View all audits by this user
              </button>
            </div>
          )}
        </DrawerContent>
      </Drawer>
      <Dialog open={userAuditsOpen} onOpenChange={setUserAuditsOpen}>
        <DialogContent className="max-w-3/4">
          <DialogHeader>
            <DialogTitle>User Audits</DialogTitle>
          </DialogHeader>
          {isUserAuditsLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border bg-background mt-4">
              <Table className="min-w-[800px]">
                <TableHeader className="bg-muted">
                  <TableRow>
                    <TableHead>Date/Time</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Resource Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userAudits.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                      <TableCell>{log.actor_name}</TableCell>
                      <TableCell><Badge variant="outline">{log.actor_role}</Badge></TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>
                        <div className="font-medium">{log.resource_type}</div>
                        <div className="text-xs text-muted-foreground">{log.resource_summary}</div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
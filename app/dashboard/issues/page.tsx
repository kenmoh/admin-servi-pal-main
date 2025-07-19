"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllReports } from "@/actions/report";
import { cn } from "@/lib/utils"

import { sendReportMessage } from "@/actions/report";
import { updateReportStatus } from "@/actions/report";
import { Report, ReportThread } from "@/types/report";
import { AvatarImage } from "@/components/ui/avatar";


// Map report_type to color classes
const reportTypeColors: Record<string, string> = {
    damage_items: "bg-red-500/20 text-red-700",
    wrong_items: "bg-yellow-500/20 text-yellow-700",
    late_delivery: "bg-orange-500/20 text-orange-700",
    rider_behaviour: "bg-blue-500/20 text-blue-700",
    customer_behaviour: "bg-green-500/20 text-green-700",
    others: "bg-gray-500/20 text-gray-700",
};

// Map report_status to color classes
const reportStatusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
    investigating: "bg-blue-100 text-blue-800 border-blue-200",
    dismissed: "bg-gray-200 text-gray-700 border-gray-300",
};

export default function IssuesPage() {
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const messagesEndRef = React.useRef<HTMLDivElement>(null);

    // Fetch paginated data
    const {
        data: reports,
        isLoading: isLoadingReports,
    } = useQuery({
        queryKey: ["issues"],
        queryFn: getAllReports
    });

    const selectedReport = reports?.find(report => report.id === selectedReportId);

    React.useEffect(() => {
        if (!selectedReportId && reports && reports.length > 0) {
            setSelectedReportId(reports[0].id);
        }
    }, [reports, selectedReportId]);

    // Auto-scroll to bottom when messages change
    React.useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [selectedReport?.thread?.length]);

    // Status update handler
    const handleStatusUpdate = async (status: string) => {
        if (!selectedReportId) return;
        setStatusLoading(true);
        await updateReportStatus(selectedReportId, status);
        setStatusLoading(false);
    };

    const queryClient = useQueryClient();
    const sendMessageMutation = useMutation({
        mutationFn: async ({ reportId, content }: { reportId: string, content: string }) => {
            return sendReportMessage(reportId, { content });
        },
        onMutate: async ({ reportId, content }) => {
            await queryClient.cancelQueries({ queryKey: ["issues"] });
            const previousReports = queryClient.getQueryData<Report[]>(["issues"]);
            queryClient.setQueryData<Report[]>(["issues"], old =>
                old
                    ? old.map(report =>
                        report.id === reportId
                            ? {
                                ...report,
                                thread: [
                                    ...report.thread,
                                    {
                                        id: "optimistic-" + Date.now(),
                                        sender: { name: "Admin", avatar: "" },
                                        message_type: "text",
                                        role: "admin",
                                        date: new Date().toISOString(),
                                        content,
                                        read: true,
                                    },
                                ],
                            }
                            : report
                    )
                    : []
            );
            return { previousReports };
        },
        onError: (err, variables, context) => {
            if (context?.previousReports) {
                queryClient.setQueryData(["issues"], context.previousReports);
            }
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["issues"] });
        },
    });

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-background rounded-lg border shadow-sm overflow-hidden">
            {/* Issues List */}
            <aside className="w-80 border-r bg-muted/50 flex flex-col">
                <div className="p-4 font-semibold text-lg">Issues</div>
                <Separator />
                <div className="flex-1 overflow-y-auto">
                    {isLoadingReports ? (
                        <p className="p-4 text-muted-foreground">Loading reports...</p>
                    ) : (
                        <ul className="divide-y">
                            {reports?.map((report: Report) => (
                                <li
                                    key={report.id}
                                    className={cn(
                                        "p-4 cursor-pointer hover:bg-muted transition flex flex-col gap-1",
                                        selectedReportId === report.id && "bg-muted font-medium"
                                    )}
                                    onClick={() => setSelectedReportId(report.id)}
                                >
                                    <div className='flex space-x-2 items-center'>
                                        <span className={cn(
                                            "truncate text-sm capitalize font-bold rounded-full px-3 py-1 align-center justify-center",
                                            reportTypeColors[report.report_type] || "bg-purple-500/25 text-white"
                                        )}>
                                            {report.report_type.replace('_', ' ')}
                                        </span>
                                        <span className={cn(
                                            "truncate text-xs font-semibold rounded-full px-2 py-0.5 align-center justify-center border",
                                            reportStatusColors[report.report_status] || "bg-blue-500/25  text-white"
                                        )}>
                                            {report.report_status.charAt(0).toUpperCase() + report.report_status.slice(1)}
                                        </span>
                                    </div>
                                    <span className="text-sm text-muted-foreground truncate">{report.description}</span>
                                    <span className="mt-1 text-xs text-muted-foreground">{new Date(report.created_at).toLocaleDateString()}</span>
                                    {report.is_read && <span className="mt-1 text-xs text-primary">● Unread</span>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </aside>

            {/* Chat Section */}
            <main className="flex-1 flex flex-col">
                {selectedReport ? (
                    <>
                        <div className="p-4 border-b bg-background flex items-center justify-between">
                            <span className="font-semibold text-lg">
                                {selectedReport.report_type}
                            </span>
                            <div className="relative">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setStatusDropdownOpen((v) => !v)}
                                    disabled={statusLoading}
                                >
                                    Update Status
                                </Button>
                                {statusDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-popover text-popover-foreground border rounded shadow z-10">
                                        {["resolved", "investigating", "dismissed"].map((status) => (
                                            <button
                                                key={status}
                                                className="block w-full text-left px-4 py-2 hover:bg-muted"
                                                onClick={async () => {
                                                    setStatusDropdownOpen(false);
                                                    await handleStatusUpdate(status);
                                                }}
                                                disabled={statusLoading}
                                            >
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 p-6 space-y-4 overflow-y-auto bg-background">
                            {selectedReport.thread
                                .filter((msg, idx, arr) =>
                                    !msg.id.startsWith("optimistic-") ||
                                    // Only show optimistic if no real message with same content exists after it
                                    !arr.some((m, i) => i > idx && m.content === msg.content && !m.id.startsWith("optimistic-"))
                                )
                                .map((msg: ReportThread) => (
                                    <div key={msg.id} className={cn("flex items-start gap-3", msg.role === "admin" ? "justify-end" : "justify-start")}>
                                        {msg.role !== "admin" && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={msg.sender?.avatar || undefined} />
                                                <AvatarFallback>{msg.sender?.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={cn("p-3 rounded-lg max-w-xs shadow-none", msg.role === "admin" ? "bg-primary text-primary-foreground" : "bg-teal-700 text-white")}>
                                            <p className="text-lg">{msg.content}</p>
                                            <p className="text-sm text-white text-right mt-1">{new Date(msg.date).toLocaleTimeString()}</p>
                                        </div>
                                        {msg.role === "admin" && (
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={msg.sender?.avatar || undefined} />
                                                <AvatarFallback>A</AvatarFallback>
                                            </Avatar>
                                        )}
                                    </div>
                                ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form
                            className="flex items-center gap-2 p-4 border-t bg-background"
                            onSubmit={e => {
                                e.preventDefault();
                                if (!input.trim() || !selectedReportId) return;
                                sendMessageMutation.mutate({ reportId: selectedReportId, content: input });
                                setInput("");
                            }}
                        >
                            <Input
                                placeholder="Type a message..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                className="flex-1"
                                disabled={sendMessageMutation.isPending}
                            />
                            <Button type="submit" disabled={sendMessageMutation.isPending || !input.trim()}>Send</Button>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-muted-foreground">Select a report to view the conversation.</p>
                    </div>
                )}
            </main>
        </div>
    );
} 
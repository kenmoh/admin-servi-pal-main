"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Types
interface Message {
    id: number;
    sender: "user" | "admin";
    text: string;
}

interface Issue {
    id: number;
    title: string;
    lastMessage: string;
    unread: boolean;
}

// Mock data
const mockIssues: Issue[] = [
    { id: 1, title: "Payment not processed", lastMessage: "Can you check again?", unread: true },
    { id: 2, title: "Order delayed", lastMessage: "Rider is on the way.", unread: false },
    { id: 3, title: "App crash on login", lastMessage: "We are investigating.", unread: true },
    { id: 4, title: "Refund request", lastMessage: "Refund processed.", unread: false },
];

const mockMessages: Record<number, Message[]> = {
    1: [
        { id: 1, sender: "user", text: "My payment didn't go through." },
        { id: 2, sender: "admin", text: "Can you check again?" },
    ],
    2: [
        { id: 1, sender: "user", text: "My order is late." },
        { id: 2, sender: "admin", text: "Rider is on the way." },
    ],
    3: [
        { id: 1, sender: "user", text: "The app crashes when I try to login." },
        { id: 2, sender: "admin", text: "We are investigating." },
    ],
    4: [
        { id: 1, sender: "user", text: "I want a refund." },
        { id: 2, sender: "admin", text: "Refund processed." },
    ],
};

export default function IssuesPage() {
    const [selectedIssueId, setSelectedIssueId] = useState<number>(mockIssues[0].id);
    const [input, setInput] = useState("");
    const messages = mockMessages[selectedIssueId] || [];

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-background rounded-lg border shadow-sm overflow-hidden">
            {/* Issues List */}
            <aside className="w-80 border-r bg-muted/50 flex flex-col">
                <div className="p-4 font-semibold text-lg">Issues</div>
                <Separator />
                <div className="flex-1 overflow-y-auto">
                    <ul className="divide-y">
                        {mockIssues.map(issue => (
                            <li
                                key={issue.id}
                                className={cn(
                                    "p-4 cursor-pointer hover:bg-muted transition flex flex-col gap-1",
                                    selectedIssueId === issue.id && "bg-muted font-medium"
                                )}
                                onClick={() => setSelectedIssueId(issue.id)}
                            >
                                <span className="truncate">{issue.title}</span>
                                <span className="text-xs text-muted-foreground truncate">{issue.lastMessage}</span>
                                {issue.unread && <span className="mt-1 text-xs text-primary">● Unread</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>

            {/* Chat Section */}
            <main className="flex-1 flex flex-col">
                <div className="p-4 border-b bg-background">
                    <span className="font-semibold text-lg">
                        {mockIssues.find(i => i.id === selectedIssueId)?.title}
                    </span>
                </div>
                <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {messages.map((msg: Message) => (
                        <div key={msg.id} className={cn("flex gap-3", msg.sender === "admin" ? "justify-end" : "justify-start")}>
                            {msg.sender === "user" && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                            )}
                            <Card className={cn("px-4 py-2 max-w-xs", msg.sender === "admin" ? "bg-primary text-primary-foreground" : "bg-muted")}>{msg.text}</Card>
                            {msg.sender === "admin" && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                </div>
                <form
                    className="flex items-center gap-2 p-4 border-t bg-background"
                    onSubmit={e => {
                        e.preventDefault();
                        // Add send logic here
                        setInput("");
                    }}
                >
                    <Input
                        placeholder="Type a message..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        className="flex-1"
                    />
                    <Button type="submit">Send</Button>
                </form>
            </main>
        </div>
    );
} 
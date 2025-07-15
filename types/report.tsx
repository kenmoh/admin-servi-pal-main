export interface ReportThreadSender {
    name: string;
    avatar: string;
}

export interface ReportThread {
    id: string;
    sender: ReportThreadSender;
    message_type: string;
    role: string;
    date: string;
    content: string;
    read: boolean;
}

export interface Report {
    id: string;
    complainant_id: string;
    report_type: string;
    report_tag: string;
    report_status: string;
    description: string;
    created_at: string;
    is_read: boolean;
    thread: ReportThread[];
}



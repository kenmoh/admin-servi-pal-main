export interface ReportThreadSender {
  name: string;
  avatar: string;
}

type ReportTag = "complainant" | "defendanat";
type ReportStatus = "pending" | "resolved" | "investigating" | "dismissed";
type ReportType =
  | "damage_items"
  | "wrong_items"
  | "late_delivery"
  | "rider_behaviour"
  | "customer_behaviour"
  | "others";

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
  report_type: ReportType;
  report_tag: ReportTag;
  report_status: ReportStatus;
  description: string;
  created_at: string;
  is_read: boolean;
  thread: ReportThread[];
}

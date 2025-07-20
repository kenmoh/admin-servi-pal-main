"use server";

import { reportUrl } from "@/lib/constant";
import { z } from "zod";
import { Report, ReportThread } from "@/types/report";
import { authenticatedFetch } from "./user";

const createMessageSchema = z.object({
  content: z.string().trim().min(1, "Content is required"),
});

export type FormState = {
  message: string;
  success: boolean;
  user_type?: string;
  errors?: string;
};

export async function getAllReports(): Promise<Report[]> {
  try {
    const response = await fetch(reportUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch reports");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getReportById(id: string): Promise<Report | null> {
  try {
    const response = await fetch(`${reportUrl}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch report");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export const sendReportMessage = async (
  reportId: string,
  content: z.infer<typeof createMessageSchema>
): Promise<ReportThread | { error: string }> => {
  try {
    console.log("sendReportMessage body:", content);
    const result = await authenticatedFetch(
      `${reportUrl}/${reportId}/message`,
      {
        method: "POST",
        body: content,
      }
    );

    const data = await result.json();
    return {
      success: true,
      message: "message sent",
      ...data,
    };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

export const updateReportStatus = async (
  reportId: string,
  status: string
): Promise<any> => {
  try {
    const result = await authenticatedFetch(`${reportUrl}/${reportId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ iisue_status: status }),
    });
    if (!result.ok) {
      throw new Error("Failed to update report status");
    }
    return await result.json();
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
};

interface StatusResponse {
  issue_status: string;
}

export const updateIssueStatus = async (
  reportId: string,
  newStatus: string
): Promise<StatusResponse | { error: string }> => {
  try {
    const res = await authenticatedFetch(
      `${reportUrl}/${reportId}/status?issue_status=${encodeURIComponent(
        newStatus
      )}`,
      {
        method: "PUT",
      }
    );
    if (!res.ok) throw new Error("Failed to update issue status");
    return await res.json();
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};

export const markReportAsRead = async (reportId: string): Promise<any> => {
  try {
    const res = await authenticatedFetch(`${reportUrl}/${reportId}/mark-read`, {
      method: "PUT",
    });
    if (!res.ok) throw new Error("Failed to mark report as read");
    return await res.json();
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Unknown error" };
  }
};

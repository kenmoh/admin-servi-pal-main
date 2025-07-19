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
    const result = await authenticatedFetch(
      `${reportUrl}/${reportId}/message`,
      {
        method: "POST",
        body: JSON.stringify(content),
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

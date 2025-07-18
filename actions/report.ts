"use server";

import { reportUrl } from "@/lib/constant";
import { Report } from "@/types/report";
import { authenticatedFetch } from "./user";

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

export async function sendReportMessage(reportId: string, message: string) {
  const res = await authenticatedFetch(`${reportUrl}/${reportId}/message`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    throw new Error("Failed to send message");
  }
  return res.json();
}

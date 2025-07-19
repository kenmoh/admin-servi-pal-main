"use server";

import { auditUrl } from "@/lib/constant";
import { AuditLog } from "@/types/audit-type";
import { authenticatedFetch } from "./user";

export async function getAllAudits(): Promise<AuditLog[]> {
  try {
    const response = await fetch(auditUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch audits");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getUserAudits(actorId: string): Promise<AuditLog[]> {
  try {
    const response = await authenticatedFetch(`${auditUrl}/${actorId}/user`);
    if (!response.ok) {
      throw new Error("Failed to fetch audits");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getAuditById(id: string): Promise<AuditLog | null> {
  try {
    const response = await fetch(`${auditUrl}/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch audit");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

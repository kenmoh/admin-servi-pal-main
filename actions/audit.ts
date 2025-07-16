"use server";

import { authenticatedFetch } from "./user";
import { statsUrl } from "@/lib/constant";

export const getAuditLogs = async () => {
  const result = await authenticatedFetch(`${statsUrl}/audit-logs`);
  return result.json();
};
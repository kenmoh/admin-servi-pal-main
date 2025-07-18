"use client";

import { useQuery } from "@tanstack/react-query";
import { getAllReports, getReportById } from "@/actions/report";

export function useReports() {
  return useQuery({
    queryKey: ["reports"],
    queryFn: getAllReports,
  });
}

export function useReport(id: string | null) {
  return useQuery({
    queryKey: ["report", id],
    queryFn: () => (id ? getReportById(id) : null),
    enabled: !!id,
  });
}
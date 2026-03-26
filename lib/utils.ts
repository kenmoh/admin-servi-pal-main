import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function fetchApi(input: RequestInfo, init?: RequestInit) {
  const res = await fetch(input, init)
  if (!res.ok) throw new ApiError(`Request failed`, res.status)
  return res.json()
}

export function safeToFixed(val: any, digits: number = 2): string {
  const n = Number(val);
  return isNaN(n) ? (0).toFixed(digits) : n.toFixed(digits);
}

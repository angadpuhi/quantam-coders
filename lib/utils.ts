import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";
  
  // Use deterministic UTC/local extraction to ensure 100% SSR & client hydration parity
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  const year = d.getFullYear();
  
  return `${day} ${month} ${year}`;
}

export function generateHealthId(): string {
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  return `KL-MH-${randomNum}`;
}

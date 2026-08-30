import type { ApplicationStatus, EmploymentType, RemoteType } from "@/types/application.types";

export const applicationLabels: Record<ApplicationStatus, string> = {
  WISHLIST: "Wishlist",
  APPLIED: "Applied",
  SCREENING: "Screening",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

export const applicationTones: Record<
  ApplicationStatus,
  "neutral" | "info" | "success" | "warning" | "danger"
> = {
  WISHLIST: "neutral",
  APPLIED: "info",
  SCREENING: "warning",
  INTERVIEW: "warning",
  OFFER: "success",
  REJECTED: "danger",
  WITHDRAWN: "neutral",
};

export const applicationStatuses = Object.keys(applicationLabels) as ApplicationStatus[];
export const remoteTypes: RemoteType[] = ["ONSITE", "REMOTE", "HYBRID"];
export const employmentTypes: EmploymentType[] = ["FULL_TIME", "CONTRACT", "INTERNSHIP"];
export const boardAccents: Record<ApplicationStatus, string> = {
  WISHLIST: "bg-slate-400",
  APPLIED: "bg-indigo-500",
  SCREENING: "bg-cyan-500",
  INTERVIEW: "bg-violet-500",
  OFFER: "bg-emerald-500",
  REJECTED: "bg-rose-500",
  WITHDRAWN: "bg-slate-300",
};

export const humanizeApplicationValue = (value: string) =>
  value
    .split("_")
    .map((part) => part.charAt(0) + part.slice(1).toLowerCase())
    .join(" ");

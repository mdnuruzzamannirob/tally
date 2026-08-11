import type { ApplicationStatus } from "./application.types";

export interface DashboardStatusCount {
  status: ApplicationStatus;
  count: number;
}

export interface DashboardSummary {
  totalApplications: number;
  activeApplications: number;
  interviewsUpcoming: number;
  offers: number;
  byStatus: DashboardStatusCount[];
}

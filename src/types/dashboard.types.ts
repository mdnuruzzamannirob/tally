import type { Application, ApplicationStatus } from "./application.types";
import type { Interview } from "./interview.types";

export interface DashboardStatusCount {
  [status: string]: number;
}

export interface DashboardSummary {
  totalApplications: number;
  activeApplications: number;
  offers: number;
  scheduledInterviews: number;
  statusCounts: DashboardStatusCount;
  followUps: {
    overdueCount: number;
    todayCount: number;
    overdue: Array<Pick<Application, "id" | "company" | "role" | "status" | "nextFollowUpAt">>;
    today: Array<Pick<Application, "id" | "company" | "role" | "status" | "nextFollowUpAt">>;
  };
  upcomingInterviews: Array<Pick<Interview, "id" | "type" | "status" | "scheduledAt"> & {
    application: Pick<Application, "id" | "company" | "role">;
  }>;
  recentApplications: Array<Pick<Application, "id" | "company" | "role" | "status"> & {
    updatedAt: string;
  }>;
}

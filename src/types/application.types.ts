export type ApplicationStatus =
  "WISHLIST" | "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "REJECTED" | "WITHDRAWN";

export interface Application {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}

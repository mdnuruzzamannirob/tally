import type { ISODateString, ISODateTimeString, Nullable } from "./common.types";
import type { Tag } from "./tag.types";

export type ApplicationStatus =
  "WISHLIST" | "APPLIED" | "SCREENING" | "INTERVIEW" | "OFFER" | "REJECTED" | "WITHDRAWN";
export type RemoteType = "ONSITE" | "REMOTE" | "HYBRID";
export type EmploymentType = "FULL_TIME" | "CONTRACT" | "INTERNSHIP";

export interface Application {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  jobUrl?: Nullable<string>;
  location?: Nullable<string>;
  remoteType?: Nullable<RemoteType>;
  employmentType?: Nullable<EmploymentType>;
  source?: Nullable<string>;
  appliedAt?: Nullable<ISODateString>;
  salaryMin?: Nullable<number | string>;
  salaryMax?: Nullable<number | string>;
  currency?: Nullable<string>;
  nextFollowUpAt?: Nullable<ISODateTimeString>;
  archivedAt?: Nullable<ISODateTimeString>;
  tags: Tag[];
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

export interface CreateApplicationInput {
  company: string;
  role: string;
  jobUrl?: string;
  location?: string;
  remoteType?: RemoteType;
  employmentType?: EmploymentType;
  source?: string;
  status?: ApplicationStatus;
  appliedAt?: ISODateString;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  nextFollowUpAt?: ISODateTimeString;
  tagIds?: string[];
  initialNote?: string;
}

export interface UpdateApplicationInput {
  company?: string;
  role?: string;
  jobUrl?: string | null;
  location?: string | null;
  remoteType?: RemoteType | null;
  employmentType?: EmploymentType | null;
  source?: string | null;
  appliedAt?: ISODateString | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string | null;
  nextFollowUpAt?: ISODateTimeString | null;
  tagIds?: string[];
}

export interface ChangeApplicationStatusInput {
  toStatus: ApplicationStatus;
  note?: string;
}

export interface StatusHistoryEntry {
  id: string;
  fromStatus: ApplicationStatus;
  toStatus: ApplicationStatus;
  note: string | null;
  changedAt: ISODateTimeString;
}

export interface ApplicationListQuery {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ApplicationStatus;
  tag?: string;
  remoteType?: RemoteType;
  employmentType?: EmploymentType;
  source?: string;
  appliedFrom?: ISODateString;
  appliedTo?: ISODateString;
  followUp?: "overdue" | "today" | "upcoming" | "none";
  includeArchived?: boolean;
  sort?: "updatedAt" | "createdAt" | "company" | "role" | "appliedAt" | "nextFollowUpAt" | "status";
  order?: "asc" | "desc";
}

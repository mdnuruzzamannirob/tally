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
  salaryMin?: Nullable<number>;
  salaryMax?: Nullable<number>;
  currency?: Nullable<string>;
  nextFollowUpAt?: Nullable<ISODateTimeString>;
  tags?: Tag[];
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

export type UpdateApplicationInput = Partial<Omit<CreateApplicationInput, "company" | "role">> &
  Partial<Pick<CreateApplicationInput, "company" | "role">>;

export interface ChangeApplicationStatusInput {
  toStatus: ApplicationStatus;
  note?: string;
}

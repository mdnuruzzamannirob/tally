import type { ISODateTimeString, Nullable } from "./common.types";

export type InterviewType = "PHONE" | "TECHNICAL" | "HR" | "SYSTEM_DESIGN" | "ONSITE" | "OTHER";
export type InterviewStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";

export interface Interview {
  id: string;
  applicationId: string;
  type: InterviewType;
  scheduledAt: ISODateTimeString;
  interviewerName: Nullable<string>;
  meetingLink: Nullable<string>;
  location: Nullable<string>;
  notes: Nullable<string>;
  status: InterviewStatus;
}

export interface CreateInterviewInput {
  type: InterviewType;
  scheduledAt: ISODateTimeString;
  interviewerName?: string;
  meetingLink?: string;
  location?: string;
  notes?: string;
  status?: InterviewStatus;
}

export type UpdateInterviewInput = Partial<Omit<CreateInterviewInput, "type" | "scheduledAt">> &
  Partial<Pick<CreateInterviewInput, "type" | "scheduledAt">>;

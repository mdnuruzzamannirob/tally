import type { ISODateTimeString } from "./common.types";

export interface Note {
  id: string;
  applicationId: string;
  content: string;
  createdAt: ISODateTimeString;
  updatedAt: ISODateTimeString;
}

export interface CreateNoteInput {
  content: string;
}

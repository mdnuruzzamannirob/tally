import type { Application } from "./application.types";
import type { Tag } from "./tag.types";
import type { User, UserPreferences } from "./user.types";

export interface ExportBackup {
  version: 1;
  exportedAt: string;
  profile: Pick<User, "name" | "email"> & { preferences?: UserPreferences };
  tags: Tag[];
  applications: Application[];
}

export interface ImportBackupInput extends ExportBackup {}

export interface ImportResult {
  importedApplications: number;
  importedTags: number;
}

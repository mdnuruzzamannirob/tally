import type { Application } from "./application.types";
import type { Tag } from "./tag.types";
import type { User, UserPreferences } from "./user.types";

export interface ExportBackup {
  version: 1;
  exportedAt: string;
  profile: { name: string | null; preferences: UserPreferences };
  tags: Array<{ ref: string; name: string; color: string | null }>;
  applications: Array<Record<string, unknown>>;
}

export interface ImportBackupInput extends ExportBackup {}

export interface ImportResult {
  importedApplications: number;
  importedTags: number;
}

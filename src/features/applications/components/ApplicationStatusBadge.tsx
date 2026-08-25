import { AppStatusBadge } from "@/components/app-ui";
import type { ApplicationStatus } from "@/types/application.types";
import { applicationLabels } from "../application-config";

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return <AppStatusBadge status={status.toLowerCase() as Lowercase<typeof status>}>{applicationLabels[status]}</AppStatusBadge>;
}

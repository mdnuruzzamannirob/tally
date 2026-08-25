import { AppStatusBadge, type AppApplicationStatus } from "@/components/app-ui";
import type { ApplicationStatus } from "@/types/application.types";
import { applicationLabels } from "../application-config";

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  const normalizedStatus = status.toLowerCase() as AppApplicationStatus;
  return <AppStatusBadge status={normalizedStatus}>{applicationLabels[status]}</AppStatusBadge>;
}

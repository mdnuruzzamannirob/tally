import { AppBadge } from "@/components/app-ui";
import type { ApplicationStatus } from "@/types/application.types";
import { applicationLabels, applicationTones } from "../application-config";

export function ApplicationStatusBadge({ status }: { status: ApplicationStatus }) {
  return <AppBadge status={applicationTones[status]}>{applicationLabels[status]}</AppBadge>;
}

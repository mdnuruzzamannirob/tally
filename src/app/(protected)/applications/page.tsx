import { ApplicationWorkspace } from "@/features/applications/ApplicationWorkspace";
import { AppButton, AppPageHeader } from "@/components/app-ui";
import { Plus } from "lucide-react";

export default function ApplicationsPage() {
  return (
    <section className="space-y-6">
      <AppPageHeader title="Applications" description="Organize opportunities, status changes, and follow-ups." actions={<AppButton><Plus /> Add application</AppButton>} />
      <ApplicationWorkspace />
    </section>
  );
}

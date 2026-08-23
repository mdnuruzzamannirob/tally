import { ApplicationWorkspace } from "@/features/applications/ApplicationWorkspace";
import { AppPageHeader } from "@/components/app-ui";

export default function ApplicationsPage() {
  return (
    <section className="space-y-6">
      <AppPageHeader title="Applications" description="Organize opportunities, status changes, and follow-ups." />
      <ApplicationWorkspace />
    </section>
  );
}

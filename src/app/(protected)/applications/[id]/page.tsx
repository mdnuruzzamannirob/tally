import { ApplicationDetailScreen } from "@/features/applications";
export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ApplicationDetailScreen id={id} />;
}

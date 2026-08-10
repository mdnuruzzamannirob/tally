export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <section><h1>Application</h1><p className="muted">Application ID: {id}</p></section>;
}

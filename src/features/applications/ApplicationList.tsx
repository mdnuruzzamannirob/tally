"use client";

import Link from "next/link";
import { useApplicationsQuery } from "@/store/api/applications.api";

export function ApplicationList() {
  const { data, isError, isLoading } = useApplicationsQuery();
  if (isLoading) return <p aria-live="polite">Loading applications…</p>;
  if (isError) return <p role="alert">Applications could not be loaded.</p>;
  if (!data?.data.items.length)
    return <p className="muted">No applications yet. Add your first opportunity.</p>;
  return (
    <ul>
      {data.data.items.map((application) => (
        <li key={application.id}>
          <Link href={`/applications/${application.id}`}>
            {application.company} — {application.role}
          </Link>{" "}
          ({application.status})
        </li>
      ))}
    </ul>
  );
}

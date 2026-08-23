"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, Trash2 } from "lucide-react";
import { AppButton, AppCard, AppEmptyState, AppField, AppInput, AppModal, AppPageHeader, AppSelect, AppSkeleton, AppTabs, toast } from "@/components/app-ui";
import { useCreateInterviewMutation, useDeleteInterviewMutation, useInterviewsQuery } from "@/store/api/interviews.api";
import { useApplicationsQuery } from "@/store/api/applications.api";

function InterviewList({ range }: { range: "upcoming" | "past" }) {
  const { data, isLoading, isError } = useInterviewsQuery({ range, page: 1, pageSize: 100 });
  const [remove] = useDeleteInterviewMutation();
  if (isLoading) return <AppSkeleton className="h-48 w-full" />;
  if (isError) return <AppCard><p role="alert">Interviews could not be loaded.</p></AppCard>;
  if (!data?.items.length) return <AppCard><AppEmptyState description={range === "upcoming" ? "Schedule interviews from an application." : "Completed, cancelled, and no-show interviews will be kept here."} icon={<CalendarDays />} title={range === "upcoming" ? "No interviews scheduled" : "No past interviews"} /></AppCard>;
  return <AppCard><div className="space-y-3">{data.items.map((item) => <div className="flex items-center justify-between gap-3 rounded-md border border-border p-4" key={item.id}><Link className="min-w-0" href={`/applications/${item.application?.id ?? item.applicationId}`}><p className="font-medium">{item.application?.company ?? "Application"} · {item.application?.role ?? ""}</p><p className="mt-1 text-sm text-muted-foreground">{item.type} · {new Date(item.scheduledAt).toLocaleString()}</p>{item.meetingLink ? <span className="mt-1 block text-sm text-primary">Meeting link available</span> : null}</Link><AppButton aria-label="Delete interview" onClick={() => void remove({ id: item.id, applicationId: item.applicationId }).unwrap().then(() => toast.success("Interview deleted.")).catch(() => toast.error("Could not delete interview."))} size="icon" tone="ghost"><Trash2 /></AppButton></div>)}</div></AppCard>;
}

export default function InterviewsPage() {
  const [open, setOpen] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [type, setType] = useState("PHONE");
  const [scheduledAt, setScheduledAt] = useState("");
  const [interviewerName, setInterviewerName] = useState("");
  const { data: applications } = useApplicationsQuery({ page: 1, pageSize: 100, includeArchived: false });
  const [createInterview, createState] = useCreateInterviewMutation();
  const save = async () => { if (!applicationId || !scheduledAt) return; try { await createInterview({ applicationId, body: { type: type as "PHONE" | "TECHNICAL" | "HR" | "SYSTEM_DESIGN" | "ONSITE" | "OTHER", scheduledAt: new Date(scheduledAt).toISOString(), ...(interviewerName.trim() ? { interviewerName: interviewerName.trim() } : {}) } }).unwrap(); setOpen(false); setApplicationId(""); setScheduledAt(""); setInterviewerName(""); toast.success("Interview scheduled."); } catch { toast.error("Could not schedule interview."); } };
  return <section className="space-y-6"><AppPageHeader title="Interviews" description="Plan each conversation and keep interview details close to the application." actions={<AppButton onClick={() => setOpen(true)}><CalendarDays /> Add interview</AppButton>} /><AppTabs items={[{ value: "upcoming", label: "Upcoming", content: <InterviewList range="upcoming" /> }, { value: "past", label: "Past", content: <InterviewList range="past" /> }]} /><AppModal description="Schedule an interview against an application." footer={<><AppButton onClick={() => setOpen(false)} tone="ghost">Cancel</AppButton><AppButton disabled={!applicationId || !scheduledAt} loading={createState.isLoading} onClick={() => void save()}>Schedule</AppButton></>} onOpenChange={setOpen} open={open} title="Add interview"><div className="space-y-4"><AppField label="Application" required><AppSelect onValueChange={(value) => setApplicationId(value ?? "")} options={(applications?.items ?? []).map((item) => ({ label: `${item.company} · ${item.role}`, value: item.id }))} placeholder="Choose an application" value={applicationId} /></AppField><AppField label="Interview type" required><AppSelect onValueChange={(value) => setType(value ?? "PHONE")} options={["PHONE", "TECHNICAL", "HR", "SYSTEM_DESIGN", "ONSITE", "OTHER"].map((value) => ({ label: value, value }))} value={type} /></AppField><AppField label="Scheduled at" required><AppInput onChange={(event) => setScheduledAt(event.target.value)} type="datetime-local" value={scheduledAt} /></AppField><AppField label="Interviewer"><AppInput onChange={(event) => setInterviewerName(event.target.value)} value={interviewerName} /></AppField></div></AppModal></section>;
}

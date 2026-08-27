"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  Database,
  Download,
  Eye,
  EyeOff,
  Moon,
  Monitor,
  Palette,
  Pencil,
  Plus,
  Shield,
  Sun,
  Tags,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";
import {
  AppButton,
  AppCard,
  AppConfirmDialog,
  AppInput,
  AppModal,
  AppPageHeader,
  AppSelect,
  AppTabs,
  toast,
} from "@/components/app-ui";
import {
  useChangePasswordMutation,
  useConnectedAccountsQuery,
  useLinkConnectedAccountMutation,
  useSetPasswordMutation,
  useUnlinkConnectedAccountMutation,
} from "@/store/api/auth.api";
import { useUpdatePreferencesMutation, useUpdateProfileMutation } from "@/store/api/users.api";
import {
  useCreateTagMutation,
  useDeleteTagMutation,
  useTagsQuery,
  useUpdateTagMutation,
} from "@/store/api/tags.api";
import {
  useExportCsvMutation,
  useExportJsonMutation,
  useImportJsonMutation,
} from "@/store/api/export-import.api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCurrentUser } from "@/store/slices/auth.slice";
import type { ExportBackup } from "@/types/export-import.types";
import { GitHubIcon, GoogleIcon, PasswordStrength } from "@/features/auth/AuthControls";

const sections = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "security", label: "Security", icon: Shield },
  { id: "tags", label: "Tags", icon: Tags },
  { id: "preferences", label: "Preferences", icon: Palette },
  { id: "data", label: "Data", icon: Database },
] as const;
type Section = (typeof sections)[number]["id"];
const err = (e: unknown, fallback: string) =>
  (e as { data?: { message?: string } })?.data?.message ?? fallback;
const tagColors = [
  "#6366f1",
  "#0ea5e9",
  "#14b8a6",
  "#22c55e",
  "#f59e0b",
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#a855f7",
  "#64748b",
];
function downloadFile(result: { blob: Blob; filename: string }) {
  const url = URL.createObjectURL(result.blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = result.filename;
  a.click();
  URL.revokeObjectURL(url);
}
function Intro({ title, children }: { title: string; children: string }) {
  return (
    <>
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mb-4 mt-1 text-[13px] text-muted-foreground">{children}</p>
    </>
  );
}
function Password({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [show, setShow] = useState(false);
  return (
    <label className="block text-[13px] font-medium">
      {label}
      <AppInput
        className="mt-1.5"
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          label === "Current password"
            ? "Enter your current password"
            : label === "New password"
              ? "Create a password"
              : "Confirm your password"
        }
        trailing={
          <button
            aria-label="Toggle password visibility"
            className="rounded-sm p-1 text-muted-foreground hover:bg-muted"
            onClick={() => setShow(!show)}
            type="button"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        }
        type={show ? "text" : "password"}
        value={value}
      />
    </label>
  );
}

export function SettingsUI() {
  const [active, setActive] = useState<Section>("profile");
  const { setTheme } = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const prefs = user?.preferences;
  const { data: accounts } = useConnectedAccountsQuery(undefined, { skip: active !== "security" });
  const { data: tags = [] } = useTagsQuery(undefined, { skip: active !== "tags" });
  const [updateProfile, profileState] = useUpdateProfileMutation();
  const [updatePrefs] = useUpdatePreferencesMutation();
  const [changePassword, changeState] = useChangePasswordMutation();
  const [setPassword, setPasswordState] = useSetPasswordMutation();
  const [link] = useLinkConnectedAccountMutation();
  const [unlink] = useUnlinkConnectedAccountMutation();
  const [createTag] = useCreateTagMutation();
  const [updateTag, updateTagState] = useUpdateTagMutation();
  const [deleteTag] = useDeleteTagMutation();
  const [exportJson, jsonState] = useExportJsonMutation();
  const [exportCsv, csvState] = useExportCsvMutation();
  const [importJson, importState] = useImportJsonMutation();
  const [name, setName] = useState("");
  const [current, setCurrent] = useState("");
  const [password, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [tagName, setTagName] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [editCustomColor, setEditCustomColor] = useState<string | null>(null);
  const isPresetColor = tagColors.some((preset) => preset.toLowerCase() === color.toLowerCase());

  const [editingTag, setEditingTag] = useState<{
    id: string;
    name: string;
    color: string | null;
  } | null>(null);
  const paletteColors = editingTag && editCustomColor ? [...tagColors, editCustomColor] : tagColors;
  const pickerHasNewCustomColor =
    !isPresetColor && (!editingTag || color.toLowerCase() !== editCustomColor?.toLowerCase());
  const [tagModalOpen, setTagModalOpen] = useState(false);
  const [deleteTagTarget, setDeleteTagTarget] = useState<{ id: string; name: string } | null>(null);
  const [tagPage, setTagPage] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  // Sync the editable profile field when the authenticated user data arrives or changes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setName(user?.name ?? ""), [user?.name]);
  useEffect(() => {
    if (prefs?.theme) setTheme(prefs.theme);
  }, [prefs?.theme, setTheme]);
  const tagPageSize = 10;
  const tagPages = Math.max(1, Math.ceil(tags.length / tagPageSize));
  const visibleTags = tags.slice((tagPage - 1) * tagPageSize, tagPage * tagPageSize);
  const pref = async (
    field: "theme" | "defaultLandingPage" | "timeZone" | "notificationsEnabled",
    value: string | boolean,
  ) => {
    try {
      const updatedUser = await updatePrefs({ [field]: value }).unwrap();
      dispatch(setCurrentUser(updatedUser));
      if (field === "theme") setTheme(value as "light" | "dark" | "system");
      toast.success("Preferences updated.");
    } catch (e) {
      toast.error(err(e, "Could not update preferences."));
    }
  };
  const submitPassword = async () => {
    if (password !== confirm) return toast.error("Passwords do not match.");
    try {
      user?.hasPassword
        ? await changePassword({ currentPassword: current, newPassword: password }).unwrap()
        : await setPassword({ newPassword: password }).unwrap();
      setCurrent("");
      setNewPassword("");
      setConfirm("");
      toast.success("Password updated.");
    } catch (e) {
      toast.error(err(e, "Could not update password."));
    }
  };
  const exportData = async (kind: "json" | "csv") => {
    try {
      downloadFile(kind === "json" ? await exportJson().unwrap() : await exportCsv().unwrap());
    } catch {
      toast.error("Could not export your data.");
    }
  };
  const chooseFile = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.files?.[0] ?? null;
    if (next && next.type !== "application/json" && !next.name.endsWith(".json"))
      return toast.error("Choose a JSON backup file.");
    setFile(next);
    e.currentTarget.value = "";
  };
  const importData = async () => {
    if (!file || !window.confirm("Importing will replace your existing Tally data. Continue?"))
      return;
    try {
      await importJson(JSON.parse(await file.text()) as ExportBackup).unwrap();
      setFile(null);
      toast.success("Import completed.");
    } catch {
      toast.error("This backup is invalid or could not be imported.");
    }
  };
  const openTagModal = (tag?: { id: string; name: string; color: string | null }) => {
    setEditingTag(tag ?? null);
    setTagName(tag?.name ?? "");
    setColor(tag?.color ?? tagColors[0]);
    setEditCustomColor(
      tag?.color && !tagColors.some((preset) => preset.toLowerCase() === tag.color!.toLowerCase())
        ? tag.color
        : null,
    );
    setEditCustomColor(
      tag?.color && !tagColors.some((preset) => preset.toLowerCase() === tag.color?.toLowerCase())
        ? tag.color
        : null,
    );
    setTagModalOpen(true);
  };
  const saveTag = async () => {
    if (!tagName.trim()) return;
    try {
      if (editingTag)
        await updateTag({ id: editingTag.id, body: { name: tagName.trim(), color } }).unwrap();
      else await createTag({ name: tagName.trim(), color }).unwrap();
      setTagModalOpen(false);
      toast.success(editingTag ? "Tag updated." : "Tag created.");
    } catch (e) {
      toast.error(err(e, `Could not ${editingTag ? "update" : "create"} tag.`));
    }
  };
  const navigation = (
    <nav
      aria-label="Settings sections"
      className="settings-nav flex gap-1 overflow-x-auto border-b border-border pb-px lg:block lg:border-0"
    >
      {sections.map(({ id, label, icon: Icon }) => (
        <button
          aria-current={active === id ? "page" : undefined}
          className={`settings-tab flex shrink-0 items-center gap-2 px-3 py-2 text-sm font-medium ${active === id ? "is-active" : ""}`}
          key={id}
          onClick={() => setActive(id)}
          type="button"
        >
          <Icon className="size-4" />
          {label}
        </button>
      ))}
    </nav>
  );
  return (
    <section className="space-y-6">
      <AppPageHeader
        description="Manage your account, security, preferences, and data."
        title="Settings"
      />
      <div className="grid gap-6 lg:grid-cols-[210px_minmax(0,1fr)] lg:items-start">
        {navigation}
        <div className="max-w-[720px]">
          {active === "profile" && (
            <>
              <Intro title="Profile">
                Your personal information. Email cannot be changed in MVP.
              </Intro>
              <AppCard className="p-4">
                <label className="block text-[13px] font-medium">
                  Name
                  <AppInput
                    className="mt-1.5"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                  />
                </label>
                <label className="mt-3.5 block text-[13px] font-medium">
                  Email
                  <AppInput className="mt-1.5" disabled value={user?.email ?? ""} />
                  <span className="mt-1 block text-xs font-normal text-muted-foreground">
                    Email is read-only.
                  </span>
                </label>
                <div className="mt-4 flex justify-end">
                  <AppButton
                    disabled={!name.trim()}
                    loading={profileState.isLoading}
                    onClick={() =>
                      void updateProfile({ name: name.trim() })
                        .unwrap()
                        .then((updatedUser) => {
                          dispatch(setCurrentUser(updatedUser));
                          toast.success("Profile updated.");
                        })
                        .catch((e) => toast.error(err(e, "Could not update profile.")))
                    }
                  >
                    Save changes
                  </AppButton>
                </div>
              </AppCard>
            </>
          )}
          {active === "security" && (
            <>
              <Intro title="Security">Password and connected login methods.</Intro>
              <AppCard className="p-4">
                <div className="grid gap-3.5">
                  {user?.hasPassword && (
                    <Password label="Current password" onChange={setCurrent} value={current} />
                  )}
                  <div>
                    <Password label="New password" onChange={setNewPassword} value={password} />
                    <PasswordStrength password={password} />
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Use at least 8 characters, one uppercase letter, one number, and one special
                      character.
                    </p>
                  </div>
                  <Password label="Confirm new password" onChange={setConfirm} value={confirm} />
                  {confirm && password !== confirm ? (
                    <p className="-mt-2 text-xs text-danger">Passwords don’t match.</p>
                  ) : null}
                </div>
                {!user?.hasPassword && (
                  <div className="mt-3 rounded-md border border-info-border bg-info-soft px-3 py-2.5 text-[13px] text-info-text">
                    Setting a password enables email &amp; password sign-in alongside your social
                    accounts.
                  </div>
                )}
                <div className="mt-4 flex justify-end">
                  <AppButton
                    disabled={
                      password.length < 8 ||
                      password !== confirm ||
                      Boolean(user?.hasPassword && !current)
                    }
                    loading={changeState.isLoading || setPasswordState.isLoading}
                    onClick={() => void submitPassword()}
                  >
                    {user?.hasPassword ? "Update password" : "Set password"}
                  </AppButton>
                </div>
              </AppCard>
              <AppCard className="mt-4 p-4">
                <h3 className="text-sm font-semibold">Connected accounts</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  You can’t remove your last available login method.
                </p>
                <div className="mt-3 divide-y divide-border">
                  {(["google", "github"] as const).map((provider) => {
                    const account = accounts?.providers.find((x) => x.provider === provider);
                    const connect = () =>
                      void link(provider)
                        .unwrap()
                        .then(({ authorizationUrl }) => {
                          window.location.href = authorizationUrl;
                        })
                        .catch((e) => toast.error(err(e, "Could not connect account.")));
                    return (
                      <div
                        className="flex items-center justify-between gap-3 py-3.5"
                        key={provider}
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-background text-foreground">
                            {provider === "github" ? <GitHubIcon /> : <GoogleIcon />}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold capitalize">
                              {provider === "github" ? "GitHub" : "Google"}
                            </p>
                            <p className="truncate text-xs text-muted-foreground">
                              {account?.connected
                                ? `${account.email || "Connected"} · connected`
                                : "Not connected"}
                            </p>
                          </div>
                        </div>
                        {account?.connected ? (
                          <AppButton
                            onClick={() =>
                              void unlink(provider)
                                .unwrap()
                                .then(() => toast.success("Provider disconnected."))
                                .catch((e) => toast.error(err(e, "Could not disconnect provider.")))
                            }
                            size="sm"
                            tone="outline"
                          >
                            Disconnect
                          </AppButton>
                        ) : (
                          <AppButton onClick={connect} size="sm">
                            Connect
                          </AppButton>
                        )}
                      </div>
                    );
                  })}
                </div>
              </AppCard>
            </>
          )}
          {active === "tags" && (
            <>
              <div className="mb-4 flex items-center justify-between gap-6">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold">Tags</h2>
                  <p className="mt-1 text-[13px] text-muted-foreground">
                    Reusable labels for organizing your applications.
                  </p>
                </div>
                <AppButton
                  className="shrink-0 self-center"
                  onClick={() => openTagModal()}
                  size="sm"
                >
                  <Plus />
                  Add tag
                </AppButton>
              </div>
              <AppCard className="overflow-hidden" padding="none">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[460px] text-sm">
                    <thead className="border-b border-border bg-muted/60">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Color
                        </th>
                        <th className="w-24 px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tags.length ? (
                        visibleTags.map((tag) => (
                          <tr
                            className="border-b border-border/70 last:border-0 hover:bg-muted/40"
                            key={tag.id}
                          >
                            <td className="px-4 py-3.5 font-medium">
                              <span className="flex items-center gap-2.5">
                                <i
                                  className="size-2.5 rounded-full"
                                  style={{ backgroundColor: tag.color ?? "#6366f1" }}
                                />
                                {tag.name}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                                <i
                                  className="size-4 rounded border border-border"
                                  style={{ backgroundColor: tag.color ?? "#6366f1" }}
                                />
                                {tag.color ?? "Default"}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <div className="flex justify-end gap-1">
                                <AppButton
                                  aria-label={`Edit ${tag.name}`}
                                  onClick={() => openTagModal(tag)}
                                  size="icon-xs"
                                  tone="ghost"
                                >
                                  <Pencil className="size-3.5" />
                                </AppButton>
                                <AppButton
                                  aria-label={`Delete ${tag.name}`}
                                  onClick={() => setDeleteTagTarget({ id: tag.id, name: tag.name })}
                                  size="icon-xs"
                                  tone="ghost"
                                >
                                  <Trash2 className="size-3.5 text-danger" />
                                </AppButton>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            className="h-28 px-4 text-center text-sm text-muted-foreground"
                            colSpan={3}
                          >
                            No tags yet. Add your first tag to organize applications.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {tagPages > 1 ? (
                  <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
                    <span>
                      Page {tagPage} of {tagPages}
                    </span>
                    <div className="flex gap-1">
                      <AppButton
                        disabled={tagPage === 1}
                        onClick={() => setTagPage((page) => page - 1)}
                        size="sm"
                        tone="outline"
                      >
                        Previous
                      </AppButton>
                      <AppButton
                        disabled={tagPage === tagPages}
                        onClick={() => setTagPage((page) => page + 1)}
                        size="sm"
                        tone="outline"
                      >
                        Next
                      </AppButton>
                    </div>
                  </div>
                ) : null}
              </AppCard>
              <AppModal
                description={
                  editingTag
                    ? "Update the tag name and color."
                    : "Create a reusable label for your applications."
                }
                footer={
                  <>
                    <AppButton onClick={() => setTagModalOpen(false)} tone="outline">
                      Cancel
                    </AppButton>
                    <AppButton
                      disabled={!tagName.trim()}
                      loading={updateTagState.isLoading}
                      onClick={() => void saveTag()}
                    >
                      {editingTag ? "Save changes" : "Create tag"}
                    </AppButton>
                  </>
                }
                contentClassName="top-16! translate-y-0! max-h-[calc(100dvh-2rem)] sm:top-20!"

                onOpenChange={setTagModalOpen}
                open={tagModalOpen}
                title={editingTag ? "Edit tag" : "Add tag"}
              >
                <label className="block text-[13px] font-medium">
                  Tag name
                  <AppInput
                    className="mt-1.5"
                    onChange={(e) => setTagName(e.target.value)}
                    placeholder="e.g. Remote"
                    value={tagName}
                  />
                </label>
                <div className="mt-5">
                  <p className="text-[13px] font-medium">Color</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {paletteColors.map((preset) => (
                      <button
                        aria-label={`Use ${preset}`}
                        className={`size-7 rounded-full border-2 transition-shadow ${color.toLowerCase() === preset.toLowerCase() ? "border-card ring-2 ring-primary ring-offset-1 ring-offset-card" : "border-card"}`}
                        key={preset}
                        onClick={() => setColor(preset)}
                        style={{ backgroundColor: preset }}
                        type="button"
                      />
                    ))}
                    <label
                      aria-label="Choose custom color"
                      className={`grid size-7 cursor-pointer place-items-center rounded-full border-2 text-xs font-bold transition-shadow ${pickerHasNewCustomColor ? "border-card ring-2 ring-primary ring-offset-1 ring-offset-card text-white" : "border-border bg-muted text-muted-foreground"}`}
                      style={pickerHasNewCustomColor ? { backgroundColor: color } : undefined}
                    >
                      {pickerHasNewCustomColor ? null : "+"}
                      <input
                        className="sr-only"
                        onChange={(e) => setColor(e.target.value)}
                        type="color"
                        value={color}
                      />
                    </label>
                  </div>
                </div>
              </AppModal>
              <AppConfirmDialog
                description={`Deleting “${deleteTagTarget?.name ?? "this tag"}” removes its assignments but never deletes applications.`}
                onConfirm={() => {
                  if (!deleteTagTarget) return;
                  void deleteTag(deleteTagTarget.id)
                    .unwrap()
                    .then(() => toast.success("Tag deleted."))
                    .catch(() => toast.error("Could not delete tag."));
                  setDeleteTagTarget(null);
                }}
                onOpenChange={(open) => {
                  if (!open) setDeleteTagTarget(null);
                }}
                open={Boolean(deleteTagTarget)}
                title="Delete tag"
                confirmLabel="Delete"
              />
            </>
          )}
          {active === "preferences" && (
            <>
              <Intro title="Preferences">
                For authenticated users, server-stored preferences are authoritative.
              </Intro>
              <AppCard className="p-4">
                <div className="divide-y divide-border">
                  <div className="setting-row">
                    <div>
                      <p className="text-sm font-medium">Theme</p>
                      <p className="text-xs text-muted-foreground">
                        Light, dark, or follow your system.
                      </p>
                    </div>
                    <AppTabs
                      value={prefs?.theme ?? "system"}
                      items={[
                        {
                          value: "light",
                          label: (
                            <>
                              <Sun className="mr-1.5 inline size-3.5" />
                              Light
                            </>
                          ),
                          content: null,
                        },
                        {
                          value: "dark",
                          label: (
                            <>
                              <Moon className="mr-1.5 inline size-3.5" />
                              Dark
                            </>
                          ),
                          content: null,
                        },
                        {
                          value: "system",
                          label: (
                            <>
                              <Monitor className="mr-1.5 inline size-3.5" />
                              System
                            </>
                          ),
                          content: null,
                        },
                      ]}
                      onValueChange={(value) => void pref("theme", value)}
                      variant="box"
                      width="fit"
                    />
                  </div>
                  <div className="setting-row">
                    <div>
                      <p className="text-sm font-medium">Default landing page</p>
                      <p className="text-xs text-muted-foreground">
                        Where you land after signing in.
                      </p>
                    </div>
                    <AppSelect
                      onValueChange={(v) => v && void pref("defaultLandingPage", v)}
                      options={[
                        { label: "Dashboard", value: "dashboard" },
                        { label: "Applications", value: "applications" },
                      ]}
                      triggerClassName="w-42"
                      value={prefs?.defaultLandingPage ?? "dashboard"}
                    />
                  </div>
                  <div className="setting-row">
                    <div>
                      <p className="text-sm font-medium">Time zone</p>
                      <p className="text-xs text-muted-foreground">
                        IANA identifier · used for “today” follow-ups.
                      </p>
                    </div>
                    <AppSelect
                      onValueChange={(v) => v && void pref("timeZone", v)}
                      options={[
                        "Asia/Dhaka",
                        "UTC",
                        "Europe/London",
                        "America/New_York",
                        "Asia/Kolkata",
                        "Asia/Singapore",
                      ].map((value) => ({ label: value, value }))}
                      triggerClassName="w-52"
                      value={prefs?.timeZone ?? "Asia/Dhaka"}
                    />
                  </div>
                  <div className="setting-row">
                    <div>
                      <p className="text-sm font-medium">Email notifications</p>
                      <p className="text-xs text-muted-foreground">Optional product updates.</p>
                    </div>
                    <button
                      aria-checked={prefs?.notificationsEnabled ?? false}
                      aria-label="Email notifications"
                      className={`relative h-5 w-9 shrink-0 rounded-full border p-0.5 transition-colors ${prefs?.notificationsEnabled ? "border-primary bg-primary" : "border-border bg-input"}`}
                      onClick={() =>
                        void pref("notificationsEnabled", !(prefs?.notificationsEnabled ?? false))
                      }
                      role="switch"
                      type="button"
                    >
                      <span
                        className={`block size-4 rounded-full bg-primary-foreground shadow-sm transition-transform ${prefs?.notificationsEnabled ? "translate-x-4" : "translate-x-0"}`}
                      />
                    </button>
                  </div>
                </div>
              </AppCard>
            </>
          )}
          {active === "data" && (
            <>
              <Intro title="Data">Export or import your data. You own it.</Intro>
              <AppCard className="p-4">
                <h3 className="text-sm font-semibold">Export</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  <AppButton
                    loading={jsonState.isLoading}
                    onClick={() => void exportData("json")}
                    tone="outline"
                  >
                    <Download />
                    Export JSON
                  </AppButton>
                  <AppButton
                    loading={csvState.isLoading}
                    onClick={() => void exportData("csv")}
                    tone="outline"
                  >
                    <Download />
                    Export CSV
                  </AppButton>
                </div>
                <p className="mt-2.5 text-xs text-muted-foreground">
                  JSON is a full backup · CSV covers applications only.
                </p>
              </AppCard>
              <AppCard className="mt-4 p-4">
                <h3 className="text-sm font-semibold">Import</h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Importing replaces your current application data. This cannot be undone.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <label>
                    <input
                      accept="application/json,.json"
                      className="sr-only"
                      onChange={chooseFile}
                      type="file"
                    />
                    <span className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium hover:bg-muted">
                      <Upload className="size-4" />
                      Choose JSON file…
                    </span>
                  </label>
                  <span className="max-w-full truncate text-xs text-muted-foreground">
                    {file?.name ?? "No file selected"}
                  </span>
                  <AppButton
                    disabled={!file}
                    loading={importState.isLoading}
                    onClick={() => void importData()}
                  >
                    Import
                  </AppButton>
                </div>
              </AppCard>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

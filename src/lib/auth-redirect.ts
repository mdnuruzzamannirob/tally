/** Return an internal location only, including after URL parser normalization. */
export function getAuthRedirect(value: string | null, origin: string): string {
  if (!value?.startsWith("/")) return "/dashboard";
  try {
    const target = new URL(value, origin);
    if (target.origin !== origin) return "/dashboard";
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return "/dashboard";
  }
}

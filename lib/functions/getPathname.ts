// lib/functions/getPathname.ts
export function getPathSegments(pathname: string): string[] {
  return pathname.split("/").filter(Boolean);
}

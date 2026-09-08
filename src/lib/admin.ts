import { cookies } from "next/headers";

export const ADMIN_COOKIE = "enclos_admin";
export const VISITOR_COOKIE = "enclos_visitor";
export const LANG_COOKIE = "enclos_lang";

export function adminPassword() {
  return process.env.ADMIN_PASSWORD || "enclos1705";
}

export async function isAdmin() {
  const jar = await cookies();
  return jar.get(ADMIN_COOKIE)?.value === "ok";
}

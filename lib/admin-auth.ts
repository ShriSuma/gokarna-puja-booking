import { cookies } from "next/headers";
import { verifyAdminSession, adminCookieName } from "@/lib/session";

export async function getAdminSession(): Promise<boolean> {
  const token = (await cookies()).get(adminCookieName)?.value;
  if (!token) return false;
  return verifyAdminSession(token);
}

export async function requireAdminSession(): Promise<void> {
  const ok = await getAdminSession();
  if (!ok) throw new Error("Unauthorized");
}

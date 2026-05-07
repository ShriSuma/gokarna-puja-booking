import { NextResponse } from "next/server";
import { languageCookie, normalizeLocale } from "@/lib/i18n/shared";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const locale = normalizeLocale(typeof body.locale === "string" ? body.locale : undefined);
  const res = NextResponse.json({ ok: true, locale });
  res.cookies.set(languageCookie, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return res;
}


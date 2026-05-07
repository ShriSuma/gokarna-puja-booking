import { cookies } from "next/headers";
import { Providers } from "@/app/providers";
import { languageCookie, normalizeLocale } from "@/lib/i18n/shared";

export default async function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialLocale = normalizeLocale(cookieStore.get(languageCookie)?.value);
  return <Providers initialLocale={initialLocale}>{children}</Providers>;
}

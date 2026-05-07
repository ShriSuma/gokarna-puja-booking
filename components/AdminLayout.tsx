"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

const links = [
  { href: "/admin/dashboard", key: "admin.bookings" },
  { href: "/admin/availability", key: "admin.availability" },
  { href: "/admin/pujas", key: "admin.pujas" },
  { href: "/admin/media", key: "admin.media" },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { t } = useI18n();

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen bg-sandstone-50">
      <aside className="border-b border-maroon/10 bg-parchment px-4 py-4 md:fixed md:left-0 md:top-0 md:h-full md:w-56 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-2">
          <p className="font-display text-xl text-maroon">{t("admin.title")}</p>
          <LanguageSwitcher />
        </div>
        <nav className="mt-4 flex flex-col gap-2 font-body text-lg" aria-label="Admin">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-2 py-1 ${
                pathname === l.href ? "bg-maroon text-parchment" : "text-maroon hover:bg-sandstone-100"
              }`}
            >
              {t(l.key)}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => void logout()}
            className="mt-4 rounded-md border border-maroon/30 px-2 py-1 text-left text-maroon hover:bg-white"
          >
            {t("admin.logout")}
          </button>
        </nav>
      </aside>
      <div className="md:pl-56">
        <div className="mx-auto max-w-6xl p-6">{children}</div>
      </div>
    </div>
  );
}

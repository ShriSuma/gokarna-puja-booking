"use client";

import { useState } from "react";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useI18n();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Login failed");
        return;
      }
      toast.success("Welcome back");
      // Use a full navigation to ensure auth cookie is included on the next request.
      window.location.assign("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-sandstone-100 px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-2xl border border-maroon/15 bg-parchment p-8 shadow-lg"
      >
        <div className="flex items-center justify-end">
          <LanguageSwitcher />
        </div>
        <h1 className="font-display text-3xl text-maroon">{t("admin.loginTitle")}</h1>
        <p className="mt-2 font-body text-lg text-ink/75">{t("admin.loginHint")}</p>
        <label className="mt-6 block text-sm font-semibold text-maroon" htmlFor="pw">
          {t("admin.password")}
        </label>
        <input
          id="pw"
          type="password"
          autoComplete="current-password"
          className="mt-2 w-full rounded-lg border border-maroon/25 px-3 py-2 font-body text-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="btn-shine mt-6 w-full rounded-md bg-maroon py-2 font-body text-lg font-semibold text-parchment disabled:opacity-50"
        >
          {loading ? t("admin.signingIn") : t("admin.signIn")}
        </button>
      </form>
    </div>
  );
}

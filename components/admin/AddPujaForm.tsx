"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { PujaCategory, type PujaCategory as PujaCategoryValue } from "@/lib/puja-category";
import { createPujaType } from "@/app/admin/actions";
import { useI18n } from "@/lib/i18n";

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AddPujaForm() {
  const router = useRouter();
  const { t } = useI18n();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [longDescriptionMarkdown, setLongDescriptionMarkdown] = useState(
    "## About this puja\n\nDescribe significance, preparation, and key guidance.",
  );
  const [price, setPrice] = useState(5100);
  const [durationMinutes, setDurationMinutes] = useState(120);
  const [isActive, setIsActive] = useState(true);
  const [category, setCategory] = useState<PujaCategoryValue>(PujaCategory.PITRI_KARYA);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await createPujaType({
        name,
        slug: slugify(slug || name),
        shortDescription,
        longDescriptionMarkdown,
        category,
        price,
        durationMinutes,
        isActive,
      });
      toast.success(t("adminToast.pujaCreated"));
      setName("");
      setSlug("");
      setShortDescription("");
      setLongDescriptionMarkdown("## About this puja\n\nDescribe significance, preparation, and key guidance.");
      setPrice(5100);
      setDurationMinutes(120);
      setIsActive(true);
      setCategory(PujaCategory.PITRI_KARYA);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("adminToast.pujaCreateFail"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-maroon/10 bg-white p-5">
      <h2 className="font-display text-2xl text-maroon">{t("adminPuja.addTitle")}</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-maroon">
          {t("adminPuja.name")}
          <input
            className="mt-1 w-full rounded-md border border-maroon/20 px-3 py-2 font-body text-base"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slug) setSlug(slugify(e.target.value));
            }}
            placeholder="Maha Mrityunjaya Homa"
            required
          />
        </label>
        <label className="text-sm font-semibold text-maroon">
          {t("adminPuja.slug")}
          <input
            className="mt-1 w-full rounded-md border border-maroon/20 px-3 py-2 font-body text-base"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="maha-mrityunjaya-homa"
            required
          />
        </label>
      </div>

      <label className="text-sm font-semibold text-maroon">
        {t("adminPuja.short")}
        <textarea
          className="mt-1 w-full rounded-md border border-maroon/20 px-3 py-2 font-body text-base"
          rows={2}
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          required
        />
      </label>

      <div>
        <label className="text-sm font-semibold text-maroon">{t("adminPuja.category")}</label>
        <select
          className="mt-1 w-full rounded-md border border-maroon/20 px-3 py-2 font-body text-base"
          value={category}
            onChange={(e) => setCategory(e.target.value as PujaCategoryValue)}
        >
          <option value={PujaCategory.PITRI_KARYA}>{t("adminPuja.pitri")}</option>
          <option value={PujaCategory.PUJA_KARYA}>{t("adminPuja.pujaKarya")}</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-maroon">
          {t("adminPuja.price")}
          <input
            type="number"
            min={0}
            className="mt-1 w-full rounded-md border border-maroon/20 px-3 py-2 font-body text-base"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </label>
        <label className="text-sm font-semibold text-maroon">
          {t("adminPuja.duration")}
          <input
            type="number"
            min={15}
            className="mt-1 w-full rounded-md border border-maroon/20 px-3 py-2 font-body text-base"
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(Number(e.target.value))}
            required
          />
        </label>
      </div>

      <label className="text-sm font-semibold text-maroon">
        {t("adminPuja.long")}
        <textarea
          className="mt-1 w-full rounded-md border border-maroon/20 px-3 py-2 font-mono text-sm"
          rows={8}
          value={longDescriptionMarkdown}
          onChange={(e) => setLongDescriptionMarkdown(e.target.value)}
          required
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-maroon">
        <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
        {t("adminPuja.enable")}
      </label>

      <button
        type="submit"
        disabled={saving}
        className="rounded-md bg-maroon px-4 py-2 text-parchment disabled:opacity-50"
      >
        {saving ? t("adminPuja.creating") : t("adminPuja.create")}
      </button>
    </form>
  );
}


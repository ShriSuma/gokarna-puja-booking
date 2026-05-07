"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { PujaType } from "@prisma/client";
import { PujaCategory, type PujaCategory as PujaCategoryValue } from "@/lib/puja-category";
import { updatePujaType } from "@/app/admin/actions";
import { useI18n } from "@/lib/i18n";

export function PujaEditor({ puja }: { puja: PujaType }) {
  const router = useRouter();
  const { t } = useI18n();
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(puja.name);
  const [shortDescription, setShort] = useState(puja.shortDescription);
  const [longDescriptionMarkdown, setMd] = useState(puja.longDescriptionMarkdown);
  const [category, setCategory] = useState<PujaCategoryValue>(puja.category as PujaCategoryValue);
  const [price, setPrice] = useState(puja.price);
  const [durationMinutes, setDur] = useState(puja.durationMinutes);
  const [isActive, setActive] = useState(puja.isActive);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePujaType({
        id: puja.id,
        name,
        shortDescription,
        longDescriptionMarkdown,
        category,
        price,
        durationMinutes,
        isActive,
      });
      toast.success(t("adminToast.pujaUpdated"));
      router.refresh();
    } catch {
      toast.error(t("adminToast.pujaSaveFail"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 font-body text-lg">
      <div>
        <label className="text-sm font-semibold text-maroon" htmlFor="name">
          {t("adminPuja.name")}
        </label>
        <input id="name" className="mt-1 w-full rounded-lg border border-maroon/20 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-semibold text-maroon" htmlFor="short">
          {t("adminPuja.short")}
        </label>
        <textarea id="short" rows={3} className="mt-1 w-full rounded-lg border border-maroon/20 px-3 py-2" value={shortDescription} onChange={(e) => setShort(e.target.value)} />
      </div>
      <div>
        <label className="text-sm font-semibold text-maroon" htmlFor="cat">
          {t("adminPuja.category")}
        </label>
        <select
          id="cat"
          className="mt-1 w-full rounded-lg border border-maroon/20 px-3 py-2"
          value={category}
            onChange={(e) => setCategory(e.target.value as PujaCategoryValue)}
        >
          <option value={PujaCategory.PITRI_KARYA}>{t("adminPuja.pitri")}</option>
          <option value={PujaCategory.PUJA_KARYA}>{t("adminPuja.pujaKarya")}</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-maroon" htmlFor="price">
            {t("adminPuja.price")}
          </label>
          <input id="price" type="number" className="mt-1 w-full rounded-lg border border-maroon/20 px-3 py-2" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </div>
        <div>
          <label className="text-sm font-semibold text-maroon" htmlFor="dur">
            {t("adminPuja.duration")}
          </label>
          <input id="dur" type="number" className="mt-1 w-full rounded-lg border border-maroon/20 px-3 py-2" value={durationMinutes} onChange={(e) => setDur(Number(e.target.value))} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-maroon">
        <input type="checkbox" checked={isActive} onChange={(e) => setActive(e.target.checked)} />
        {t("adminPuja.active")}
      </label>
      <div>
        <label className="text-sm font-semibold text-maroon" htmlFor="md">
          {t("adminPuja.long")}
        </label>
        <textarea id="md" rows={14} className="mt-1 w-full rounded-lg border border-maroon/20 px-3 py-2 font-mono text-base" value={longDescriptionMarkdown} onChange={(e) => setMd(e.target.value)} />
      </div>
      <button type="submit" disabled={saving} className="rounded-md bg-maroon px-5 py-2 text-parchment disabled:opacity-50">
        {saving ? t("adminPuja.saving") : t("adminPuja.save")}
      </button>
    </form>
  );
}

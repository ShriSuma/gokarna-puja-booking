"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { MediaAsset } from "@prisma/client";
import { deleteMediaAsset, reorderMediaAssets, setPujaCoverImage, uploadPujaImage } from "@/app/admin/actions";
import { useI18n } from "@/lib/i18n";

export function PujaMediaManager({ pujaTypeId, slug, assets }: { pujaTypeId: string; slug: string; assets: MediaAsset[] }) {
  const router = useRouter();
  const { t } = useI18n();
  const [uploading, setUploading] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  async function onUpload(formData: FormData) {
    setUploading(true);
    try {
      formData.set("pujaTypeId", pujaTypeId);
      formData.set("slug", slug);
      await uploadPujaImage(formData);
      toast.success(t("adminPuja.uploadOk"));
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("adminPuja.uploadFail"));
    } finally {
      setUploading(false);
    }
  }

  async function onReorder(nextOrder: string[]) {
    try {
      await reorderMediaAssets({ ids: nextOrder });
      router.refresh();
    } catch {
      toast.error(t("adminPuja.reorderFail"));
    }
  }

  return (
    <div className="rounded-xl border border-maroon/10 bg-white p-6 shadow-sm">
      <h2 className="font-display text-2xl text-maroon">{t("adminPuja.imagesTitle")}</h2>
      <p className="mt-2 text-sm text-ink/70">{t("adminPuja.imagesHint")}</p>

      <form
        className="mt-4 flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          void onUpload(fd);
          e.currentTarget.reset();
        }}
      >
        <label className="text-sm text-maroon">
          {t("adminPuja.imageFile")}
          <input name="file" type="file" accept="image/*" className="mt-1 block" required />
        </label>
        <label className="text-sm text-maroon">
          {t("adminPuja.altText")}
          <input name="alt" className="mt-1 rounded-md border px-2 py-1" placeholder={t("adminPuja.altPlaceholder")} />
        </label>
        <button type="submit" disabled={uploading} className="rounded-md bg-maroon px-3 py-2 text-parchment disabled:opacity-50">
          {uploading ? t("adminPuja.uploading") : t("adminPuja.uploadCta")}
        </button>
      </form>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        {assets.map((asset) => (
          <div
            key={asset.id}
            draggable
            onDragStart={() => setDragId(asset.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (!dragId || dragId === asset.id) return;
              const order = assets.map((a) => a.id);
              const from = order.indexOf(dragId);
              const to = order.indexOf(asset.id);
              if (from === -1 || to === -1) return;
              const next = [...order];
              next.splice(from, 1);
              next.splice(to, 0, dragId);
              setDragId(null);
              void onReorder(next);
            }}
            className="rounded-lg border border-maroon/15 bg-sandstone-50/60 p-2"
          >
            <div className="relative aspect-video overflow-hidden rounded-md">
              <Image src={asset.path} alt={asset.alt} fill className="object-cover" sizes="200px" />
            </div>
            <p className="mt-2 text-xs text-ink/70">{asset.alt}</p>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                className="rounded border border-maroon/30 px-2 py-1"
                onClick={() =>
                  void (async () => {
                    await setPujaCoverImage(pujaTypeId, asset.id);
                    toast.success(t("adminPuja.coverSet"));
                    router.refresh();
                  })()
                }
              >
                {asset.isCover ? t("adminPuja.coverBadge") : t("adminPuja.setCover")}
              </button>
              <button
                type="button"
                className="rounded border border-red-200 px-2 py-1 text-red-700"
                onClick={() =>
                  void (async () => {
                    await deleteMediaAsset(asset.id);
                    toast.success(t("adminPuja.removeOk"));
                    router.refresh();
                  })()
                }
              >
                {t("adminPuja.delete")}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { MediaAsset } from "@prisma/client";
import { deleteMediaAsset, reorderMediaAssets, uploadGeneralGalleryImage } from "@/app/admin/actions";
import { useI18n } from "@/lib/i18n";

export function MediaLibrary({ assets }: { assets: MediaAsset[] }) {
  const router = useRouter();
  const { t } = useI18n();
  const [uploading, setUploading] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);

  async function onUpload(formData: FormData) {
    setUploading(true);
    try {
      await uploadGeneralGalleryImage(formData);
      toast.success(t("adminMediaLib.uploadOk"));
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : t("adminMediaLib.uploadFail"));
    } finally {
      setUploading(false);
    }
  }

  async function onReorder(nextOrder: string[]) {
    try {
      await reorderMediaAssets({ ids: nextOrder });
      router.refresh();
    } catch {
      toast.error(t("adminMediaLib.reorderFail"));
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-maroon">{t("adminMediaLib.title")}</h2>
        <p className="mt-1 text-sm text-ink/70">{t("adminMediaLib.hint")}</p>
        <p className="mt-3 rounded-lg border border-maroon/15 bg-sandstone-50/90 p-3 text-sm leading-relaxed text-ink/80">
          {t("adminMediaLib.storageNote")}
        </p>
      </div>
      <form
        className="flex flex-wrap items-end gap-3 rounded-xl border border-maroon/10 bg-white p-5"
        onSubmit={(e) => {
          e.preventDefault();
          const fd = new FormData(e.currentTarget);
          void onUpload(fd);
          e.currentTarget.reset();
        }}
      >
        <label className="text-sm text-maroon">
          {t("adminMediaLib.image")}
          <input name="file" type="file" accept="image/*" className="mt-1 block" required />
        </label>
        <label className="text-sm text-maroon">
          {t("adminMediaLib.altText")}
          <input name="alt" className="mt-1 rounded-md border px-2 py-1" />
        </label>
        <button type="submit" disabled={uploading} className="rounded-md bg-maroon px-3 py-2 text-parchment disabled:opacity-50">
          {uploading ? t("adminMediaLib.uploading") : t("adminMediaLib.uploadCta")}
        </button>
      </form>

      <div className="grid gap-3 md:grid-cols-3">
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
            className="rounded-lg border border-maroon/15 bg-white p-2 shadow-sm"
          >
            <div className="relative aspect-video overflow-hidden rounded-md">
              <Image src={asset.path} alt={asset.alt} fill className="object-cover" sizes="240px" />
            </div>
            <p className="mt-2 text-xs text-ink/70">{asset.alt}</p>
            <button
              type="button"
              className="mt-2 text-xs text-red-700 underline"
              onClick={() =>
                void (async () => {
                  await deleteMediaAsset(asset.id);
                  toast.success(t("adminMediaLib.removeOk"));
                  router.refresh();
                })()
              }
            >
              {t("adminMediaLib.delete")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

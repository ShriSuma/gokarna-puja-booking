"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/admin-auth";
import { type Language, MediaKind } from "@prisma/client";
import { saveUpload, removeUpload } from "@/lib/media-storage";
import { locales } from "@/lib/i18n/messages";
import { PujaCategory, pujaCategorySchema } from "@/lib/puja-category";

async function auth() {
  await requireAdminSession();
}

async function revalidatePujaPublicPaths(pujaTypeId: string | null) {
  if (!pujaTypeId) return;
  const row = await prisma.pujaType.findUnique({
    where: { id: pujaTypeId },
    select: { slug: true },
  });
  if (row?.slug) revalidatePath(`/pujas/${row.slug}`);
}

export async function updateBookingStatus(bookingId: string, status: string) {
  await auth();
  const allowed = ["Payment Pending", "Confirmed", "Completed", "Cancelled"];
  if (!allowed.includes(status)) throw new Error("Invalid status");
  await prisma.booking.update({ where: { id: bookingId }, data: { status } });
  revalidatePath("/admin/dashboard");
}

export async function updateBookingPayment(bookingId: string, paymentStatus: string) {
  await auth();
  const allowed = ["pending", "paid", "failed"];
  if (!allowed.includes(paymentStatus)) throw new Error("Invalid payment status");
  await prisma.booking.update({ where: { id: bookingId }, data: { paymentStatus } });
  revalidatePath("/admin/dashboard");
}

const slotSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  capacity: z.coerce.number().min(1).max(50),
  isBlocked: z.boolean(),
});

export async function upsertAvailabilitySlot(raw: unknown) {
  await auth();
  const data = slotSchema.parse(raw);
  await prisma.availabilitySlot.upsert({
    where: { date_time: { date: data.date, time: data.time } },
    create: {
      date: data.date,
      time: data.time,
      capacity: data.capacity,
      isBlocked: data.isBlocked,
    },
    update: { capacity: data.capacity, isBlocked: data.isBlocked },
  });
  revalidatePath("/admin/availability");
  revalidatePath("/book");
}

export async function deleteAvailabilitySlot(date: string, time: string) {
  await auth();
  await prisma.availabilitySlot.deleteMany({ where: { date, time } });
  revalidatePath("/admin/availability");
  revalidatePath("/book");
}

const weeklySchema = z.object({
  dayOfWeek: z.coerce.number().min(0).max(6),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  capacity: z.coerce.number().min(1).max(50),
});

export async function upsertWeeklyTemplate(raw: unknown) {
  await auth();
  const data = weeklySchema.parse(raw);
  await prisma.weeklyTemplate.upsert({
    where: { dayOfWeek_time: { dayOfWeek: data.dayOfWeek, time: data.time } },
    create: { dayOfWeek: data.dayOfWeek, time: data.time, capacity: data.capacity },
    update: { capacity: data.capacity },
  });
  revalidatePath("/admin/availability");
  revalidatePath("/book");
}

export async function deleteWeeklyTemplate(dayOfWeek: number, time: string) {
  await auth();
  await prisma.weeklyTemplate.deleteMany({ where: { dayOfWeek, time } });
  revalidatePath("/admin/availability");
  revalidatePath("/book");
}

const blockSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  note: z.string().optional(),
});

export async function upsertDateBlock(raw: unknown) {
  await auth();
  const data = blockSchema.parse(raw);
  await prisma.dateBlock.upsert({
    where: { date: data.date },
    create: { date: data.date, note: data.note },
    update: { note: data.note },
  });
  revalidatePath("/admin/availability");
  revalidatePath("/book");
}

export async function removeDateBlock(date: string) {
  await auth();
  await prisma.dateBlock.deleteMany({ where: { date } });
  revalidatePath("/admin/availability");
  revalidatePath("/book");
}

const pujaSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  shortDescription: z.string().min(1),
  longDescriptionMarkdown: z.string(),
  category: pujaCategorySchema,
  price: z.coerce.number().min(0),
  durationMinutes: z.coerce.number().min(15),
  isActive: z.boolean(),
});

export async function updatePujaType(raw: unknown) {
  await auth();
  const data = pujaSchema.parse(raw);
  await prisma.pujaType.update({
    where: { id: data.id },
    data: {
      name: data.name,
      shortDescription: data.shortDescription,
      longDescriptionMarkdown: data.longDescriptionMarkdown,
      category: data.category,
      price: data.price,
      durationMinutes: data.durationMinutes,
      isActive: data.isActive,
    },
  });
  revalidatePath("/admin/pujas");
  revalidatePath("/pujas");
  revalidatePath("/book");
  revalidatePath("/");
}

const createPujaSchema = z.object({
  name: z.string().min(2),
  slug: z
    .string()
    .min(2)
    .regex(/^[a-z0-9-]+$/, "Slug must contain lowercase letters, numbers, and hyphens"),
  shortDescription: z.string().min(8),
  longDescriptionMarkdown: z.string().min(10),
  category: pujaCategorySchema.default(PujaCategory.PITRI_KARYA),
  price: z.coerce.number().min(0),
  durationMinutes: z.coerce.number().min(15),
  isActive: z.boolean().default(true),
});

export async function createPujaType(raw: unknown) {
  await auth();
  const data = createPujaSchema.parse(raw);
  await prisma.pujaType.create({
    data: {
      slug: data.slug,
      name: data.name,
      shortDescription: data.shortDescription,
      longDescriptionMarkdown: data.longDescriptionMarkdown,
      category: data.category,
      price: data.price,
      durationMinutes: data.durationMinutes,
      isActive: data.isActive,
    },
  });
  const created = await prisma.pujaType.findUniqueOrThrow({ where: { slug: data.slug } });
  for (const lang of locales as readonly Language[]) {
    await prisma.pujaTranslation.upsert({
      where: { pujaTypeId_language: { pujaTypeId: created.id, language: lang } },
      create: {
        pujaTypeId: created.id,
        language: lang,
        name: data.name,
        shortDescription: data.shortDescription,
        longDescriptionMarkdown: data.longDescriptionMarkdown,
      },
      update: {},
    });
  }
  revalidatePath("/admin/pujas");
  revalidatePath("/pujas");
  revalidatePath("/book");
  revalidatePath("/");
}

const translationSchema = z.object({
  pujaTypeId: z.string(),
  language: z.enum(["en", "hi", "te", "ta", "kn"]),
  name: z.string().min(1),
  shortDescription: z.string().min(1),
  longDescriptionMarkdown: z.string().min(1),
  requirements: z.string().default(""),
  benefits: z.string().default(""),
  significance: z.string().default(""),
  whoShouldDo: z.string().default(""),
  included: z.string().default(""),
  preparation: z.string().default(""),
  story: z.string().default(""),
});

export async function updatePujaTranslation(raw: unknown) {
  await auth();
  const data = translationSchema.parse(raw);
  await prisma.pujaTranslation.upsert({
    where: {
      pujaTypeId_language: {
        pujaTypeId: data.pujaTypeId,
        language: data.language,
      },
    },
    create: data,
    update: data,
  });
  revalidatePath("/admin/pujas");
  revalidatePath("/pujas");
  revalidatePath(`/pujas`);
  revalidatePath("/book");
}

async function createMediaRecord(params: {
  kind: MediaKind;
  pujaTypeId?: string;
  path: string;
  alt: string;
}) {
  const last = await prisma.mediaAsset.findFirst({
    where: { kind: params.kind, pujaTypeId: params.pujaTypeId ?? null },
    orderBy: { sortOrder: "desc" },
  });
  return prisma.mediaAsset.create({
    data: {
      kind: params.kind,
      pujaTypeId: params.pujaTypeId,
      path: params.path,
      alt: params.alt,
      sortOrder: (last?.sortOrder ?? -1) + 1,
    },
  });
}

export async function uploadGeneralGalleryImage(formData: FormData) {
  await auth();
  const file = formData.get("file");
  const alt = String(formData.get("alt") || "Gokarna ritual");
  if (!(file instanceof File)) throw new Error("Image file missing.");
  const imagePath = await saveUpload(file, "gallery");
  await createMediaRecord({ kind: MediaKind.GENERAL, path: imagePath, alt });
  revalidatePath("/gallery");
  revalidatePath("/admin/media");
}

export async function uploadPujaImage(formData: FormData) {
  await auth();
  const pujaTypeId = String(formData.get("pujaTypeId") || "");
  const slug = String(formData.get("slug") || "");
  const alt = String(formData.get("alt") || "Puja image");
  const file = formData.get("file");
  if (!pujaTypeId || !(file instanceof File)) throw new Error("Missing puja or image file.");
  const imagePath = await saveUpload(file, "pujas", slug || pujaTypeId);
  await createMediaRecord({ kind: MediaKind.PUJA, pujaTypeId, path: imagePath, alt });
  revalidatePath("/pujas");
  revalidatePath("/admin/media");
  if (slug) revalidatePath(`/pujas/${slug}`);
  else await revalidatePujaPublicPaths(pujaTypeId);
}

export async function reorderMediaAssets(raw: unknown) {
  await auth();
  const data = z
    .object({
      ids: z.array(z.string()).min(1),
    })
    .parse(raw);
  await Promise.all(
    data.ids.map((id, idx) =>
      prisma.mediaAsset.update({
        where: { id },
        data: { sortOrder: idx },
      }),
    ),
  );
  const first = await prisma.mediaAsset.findUnique({ where: { id: data.ids[0] } });
  if (first?.kind === MediaKind.PUJA) await revalidatePujaPublicPaths(first.pujaTypeId);
  revalidatePath("/gallery");
  revalidatePath("/pujas");
  revalidatePath("/admin/media");
}

export async function deleteMediaAsset(assetId: string) {
  await auth();
  const asset = await prisma.mediaAsset.findUnique({ where: { id: assetId } });
  if (!asset) return;
  await prisma.mediaAsset.delete({ where: { id: assetId } });
  await removeUpload(asset.path);
  if (asset.kind === MediaKind.PUJA) await revalidatePujaPublicPaths(asset.pujaTypeId);
  revalidatePath("/gallery");
  revalidatePath("/pujas");
  revalidatePath("/admin/media");
}

export async function setPujaCoverImage(pujaTypeId: string, assetId: string) {
  await auth();
  await prisma.mediaAsset.updateMany({
    where: { kind: MediaKind.PUJA, pujaTypeId },
    data: { isCover: false },
  });
  await prisma.mediaAsset.update({
    where: { id: assetId },
    data: { isCover: true },
  });
  await revalidatePujaPublicPaths(pujaTypeId);
  revalidatePath("/pujas");
  revalidatePath("/admin/media");
}

export async function setDateBlockedByDrag(raw: unknown) {
  await auth();
  const data = z
    .object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      blocked: z.boolean(),
    })
    .parse(raw);
  if (data.blocked) {
    await prisma.dateBlock.upsert({
      where: { date: data.date },
      create: { date: data.date, note: "Blocked from schedule board" },
      update: {},
    });
  } else {
    await prisma.dateBlock.deleteMany({ where: { date: data.date } });
  }
  revalidatePath("/admin/availability");
  revalidatePath("/book");
}

export async function setSlotBlocked(raw: unknown) {
  await auth();
  const data = z
    .object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      time: z.string().regex(/^\d{2}:\d{2}$/),
      isBlocked: z.boolean(),
    })
    .parse(raw);
  const existing = await prisma.availabilitySlot.findUnique({
    where: { date_time: { date: data.date, time: data.time } },
  });
  const capacity = existing?.capacity ?? 2;
  await prisma.availabilitySlot.upsert({
    where: { date_time: { date: data.date, time: data.time } },
    create: { date: data.date, time: data.time, isBlocked: data.isBlocked, capacity },
    update: { isBlocked: data.isBlocked, capacity },
  });
  revalidatePath("/admin/availability");
  revalidatePath("/book");
}

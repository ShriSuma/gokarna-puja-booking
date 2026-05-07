"use server";

import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { assertSlotBookable } from "@/lib/availability";
import { sendBookingEmails } from "@/lib/email";
import { trySendWhatsAppApi, whatsappChatUrl } from "@/lib/whatsapp";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { normalizeSlotTime } from "@/lib/slot-time";
import { languageCookie, normalizeLocale } from "@/lib/i18n/shared";
import { translate } from "@/lib/i18n/translate";
import { ensurePujaTypeForBooking } from "@/lib/booking-bootstrap";

function bookingSchema(locale: string) {
  const L = normalizeLocale(locale);
  const tr = (k: string) => translate(L, k);
  return z.object({
    pujaSlug: z.string().min(1, tr("book.errPuja")),
    date: z
      .string()
      .min(1, tr("book.errDate"))
      .regex(/^\d{4}-\d{2}-\d{2}$/, tr("book.errDate")),
    time: z
      .string()
      .min(1, tr("book.errTime"))
      .regex(/^\d{1,2}:\d{2}$/, tr("book.errTime"))
      .transform((t) => normalizeSlotTime(t)),
    customerName: z.string().min(2, tr("book.errName")),
    phone: z.string().min(8, tr("book.errPhone")),
    email: z
      .union([z.string().email(), z.literal("")])
      .optional()
      .transform((v) => (v === "" ? undefined : v)),
    gotra: z.string().optional(),
    notes: z.string().optional(),
  });
}

export type CreateBookingSuccess = {
  ok: true;
  bookingId: string;
  amount: number;
  pujaName: string;
  razorpayEnabled: boolean;
  whatsappUrl: string;
};

export type CreateBookingFailure = {
  ok: false;
  message: string;
  code?: string;
};

export type CreateBookingResult = CreateBookingSuccess | CreateBookingFailure;

export async function createBooking(raw: unknown): Promise<CreateBookingResult> {
  const store = await cookies();
  const locale = normalizeLocale(store.get(languageCookie)?.value);
  const tr = (k: string, vars?: Record<string, string | number>) => translate(locale, k, vars);

  let data: z.infer<ReturnType<typeof bookingSchema>>;
  try {
    data = bookingSchema(locale).parse(raw);
  } catch (e) {
    if (e instanceof z.ZodError) {
      const first = e.errors[0];
      return { ok: false, message: first?.message || tr("book.toastFormErrors"), code: "validation" };
    }
    return { ok: false, message: tr("book.toastGenericError"), code: "parse" };
  }

  try {
    const pujaTypeId = await ensurePujaTypeForBooking(data.pujaSlug);
    if (!pujaTypeId) {
      return { ok: false, message: tr("book.errPujaNotFound"), code: "puja" };
    }
    await assertSlotBookable(data.date, data.time, tr("book.errSlotTaken"));

    const puja = await prisma.pujaType.findUniqueOrThrow({ where: { id: pujaTypeId } });

    const booking = await prisma.booking.create({
      data: {
        pujaTypeId,
        date: data.date,
        time: data.time,
        customerName: data.customerName,
        phone: data.phone,
        email: data.email ?? null,
        gotra: data.gotra?.trim() || null,
        notes: data.notes?.trim() || null,
        amount: puja.price,
        status: "Payment Pending",
        paymentStatus: "pending",
        paymentProvider: isRazorpayConfigured() ? "razorpay" : "manual",
      },
    });

    const paymentLabel = isRazorpayConfigured() ? tr("book.paymentNextRzp") : tr("book.paymentManual");

    try {
      await sendBookingEmails({
        customerEmail: booking.email,
        customerName: booking.customerName,
        pujaName: puja.name,
        date: booking.date,
        time: booking.time,
        amount: booking.amount,
        bookingId: booking.id,
        paymentLabel,
      });
    } catch {
      /* non-fatal */
    }

    const waBody = [
      tr("book.waGreeting", { name: booking.customerName }),
      tr("book.waPujaWhen", { puja: puja.name, date: booking.date, time: booking.time }),
      tr("book.waRef", { id: booking.id }),
      paymentLabel,
    ].join("\n");

    const customerDigits = booking.phone.replace(/\D/g, "");
    if (customerDigits.length >= 10) {
      await trySendWhatsAppApi(customerDigits, waBody);
    }

    return {
      ok: true,
      bookingId: booking.id,
      amount: booking.amount,
      pujaName: puja.name,
      razorpayEnabled: isRazorpayConfigured(),
      whatsappUrl: whatsappChatUrl(encodeURIComponent(waBody)),
    };
  } catch (e) {
    console.error("[createBooking]", e);
    const msg = e instanceof Error ? e.message : tr("book.toastGenericError");
    if (msg === tr("book.errSlotTaken")) {
      return { ok: false, message: msg, code: "slot" };
    }
    return { ok: false, message: msg, code: "server" };
  }
}

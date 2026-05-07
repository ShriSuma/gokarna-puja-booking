"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { createBooking, type CreateBookingResult } from "@/app/actions/booking";
import { siteConfig } from "@/content/site.config";
import type { PujaListItem } from "@/lib/pujas";
import { isRazorpayConfigured } from "@/lib/razorpay";
import { AvailabilityCalendar } from "@/components/AvailabilityCalendar";
import { useI18n } from "@/lib/i18n";
import { normalizeSlotTime } from "@/lib/slot-time";

type FormValues = {
  pujaSlug: string;
  date: string;
  time: string;
  customerName: string;
  phone: string;
  email?: string;
  gotra?: string;
  notes?: string;
};

type Slot = { time: string; available: number };

function loadRazorpay(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve();
    if (document.getElementById("razorpay-js")) return resolve();
    const s = document.createElement("script");
    s.id = "razorpay-js";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}

export function BookingFlow({ pujas }: { pujas: PujaListItem[] }) {
  const searchParams = useSearchParams();
  const prePuja = searchParams.get("puja") ?? "";

  const [step, setStep] = useState(0);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [result, setResult] = useState<{
    bookingId: string;
    whatsappUrl: string;
    razorpayEnabled: boolean;
    amount: number;
    pujaName: string;
  } | null>(null);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { t } = useI18n();
  const bookingSchema = useMemo(
    () =>
      z.object({
        pujaSlug: z.string().min(1, t("book.errPuja")),
        date: z.string().min(1, t("book.errDate")),
        time: z
          .string()
          .min(1, t("book.errTime"))
          .regex(/^\d{1,2}:\d{2}$/, t("book.errTime"))
          .transform((s) => normalizeSlotTime(s)),
        customerName: z.string().min(2, t("book.errName")),
        phone: z.string().min(8, t("book.errPhone")),
        email: z.union([z.string().email(), z.literal("")]).optional(),
        gotra: z.string().optional(),
        notes: z.string().optional(),
      }),
    [t],
  );

  const steps = useMemo(() => [0, 1, 2, 3, 4].map((i) => t(`book.steps.${i}`)), [t]);

  const form = useForm<FormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      pujaSlug: prePuja,
      date: "",
      time: "",
      customerName: "",
      phone: "",
      email: "",
      gotra: "",
      notes: "",
    },
  });

  useEffect(() => {
    if (prePuja) form.setValue("pujaSlug", prePuja);
  }, [prePuja, form]);

  const date = form.watch("date");
  const pujaSlug = form.watch("pujaSlug");
  const selectedTime = form.watch("time");

  const pujaField = form.register("pujaSlug");
  const timeField = form.register("time");

  useEffect(() => {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    (async () => {
      setSlotsLoading(true);
      try {
        const res = await fetch(`/api/availability?date=${encodeURIComponent(date)}`);
        const data = (await res.json()) as { slots?: Slot[]; error?: string };
        if (!res.ok) {
          if (!cancelled) setSlots([]);
          return;
        }
        if (!cancelled) setSlots(data.slots ?? []);
      } catch {
        if (!cancelled) setSlots([]);
      } finally {
        if (!cancelled) setSlotsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [date]);

  const selectedPuja = useMemo(() => pujas.find((p) => p.slug === pujaSlug), [pujas, pujaSlug]);

  const razorpayConfigured = isRazorpayConfigured();

  async function goNext() {
    if (step === 0) {
      const ok = await form.trigger("pujaSlug");
      if (!ok) return toast.error(t("book.toastSelectPuja"));
    } else if (step === 1) {
      const ok = await form.trigger("date");
      if (!ok) return toast.error(t("book.toastSelectDate"));
    } else if (step === 2) {
      const ok = await form.trigger("time");
      if (!ok) return toast.error(t("book.toastSelectTime"));
      if (slots.length === 0) return toast.error(t("book.toastNoSlots"));
    } else if (step === 3) {
      const ok = await form.trigger(["customerName", "phone", "email"]);
      if (!ok) return toast.error(t("book.toastCompleteDetails"));
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function goBack() {
    setStep((s) => Math.max(s - 1, 0));
  }

  function finishFlow(res: typeof result) {
    setResult(res);
    setDone(true);
  }

  async function onPay() {
    const ok = await form.trigger();
    if (!ok) {
      toast.error(t("book.toastFormErrors"));
      return;
    }
    setSubmitting(true);
    try {
      const values = form.getValues();
      const res: CreateBookingResult = await createBooking(values);
      if (!res.ok) {
        toast.error(res.message);
        setSubmitting(false);
        return;
      }

      toast.success(t("book.toastBookingSaved"));

      if (!res.razorpayEnabled) {
        finishFlow(res);
        setSubmitting(false);
        return;
      }

      await loadRazorpay();
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: res.bookingId }),
      });
      if (!orderRes.ok) {
        toast.error(t("book.toastPayStartFail"));
        finishFlow(res);
        setSubmitting(false);
        return;
      }
      const order = await orderRes.json();
      type RazorpayCtor = new (opts: Record<string, unknown>) => { open: () => void };
      const Rzp = (window as unknown as { Razorpay?: RazorpayCtor }).Razorpay;
      if (!Rzp) {
        toast.error(t("book.toastRzpLoadFail"));
        finishFlow(res);
        setSubmitting(false);
        return;
      }
      const rzp = new Rzp({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: siteConfig.siteName,
        description: res.pujaName,
        order_id: order.orderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const v = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              bookingId: res.bookingId,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          if (v.ok) toast.success(t("book.toastPayOk"));
          else toast.error(t("book.toastPayVerifyFail"));
          finishFlow({ ...res, razorpayEnabled: true });
          setSubmitting(false);
        },
        modal: {
          ondismiss: () => {
            toast.message(t("book.toastPayDismiss"));
            finishFlow(res);
            setSubmitting(false);
          },
        },
        theme: { color: "#5c1a1b" },
      });
      rzp.open();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : t("book.toastGenericError");
      toast.error(msg);
      setSubmitting(false);
    }
  }

  if (done && result) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-maroon/10 bg-white/80 p-6 shadow-lg backdrop-blur md:p-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 font-body text-lg"
        >
          <div className="flex gap-2" aria-hidden>
            {[...Array(9)].map((_, i) => (
              <motion.span
                key={i}
                initial={{ y: 0, opacity: 0 }}
                animate={{ y: [0, -8, 0], opacity: [0, 1, 1] }}
                transition={{ delay: i * 0.04, duration: 0.7 }}
                className="h-2 w-2 rounded-full bg-brass"
              />
            ))}
          </div>
          <h2 className="font-display text-3xl text-maroon">{t("book.success")}</h2>
          <p className="text-ink/85">
            {t("book.reference")}: <strong>{result.bookingId}</strong>
          </p>
          {!result.razorpayEnabled && (
            <div className="rounded-lg border border-dashed border-maroon/30 bg-sandstone-50 p-4">
              <p className="font-semibold text-maroon">{t("book.testModeTitle")}</p>
              <p className="mt-2 text-ink/80">{t("book.testModeBody")}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-3 pt-2">
            <a
              href={result.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-shine inline-flex rounded-md bg-[#25D366] px-4 py-2 font-semibold text-white shadow hover:-translate-y-0.5"
            >
              {t("book.whatsappCta")}
            </a>
            <Link
              href="/pujas"
              className="inline-flex rounded-md border border-maroon/30 px-4 py-2 text-maroon hover:bg-sandstone-50"
            >
              {t("book.exploreMore")}
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl rounded-2xl border border-maroon/10 bg-white/80 p-6 shadow-lg backdrop-blur md:p-10">
      <ol className="mb-8 flex flex-wrap gap-2" aria-label={t("book.stepsAria")}>
        {steps.map((label, i) => (
          <li key={label}>
            <motion.span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-body ${
                i === step
                  ? "bg-maroon text-parchment"
                  : i < step
                    ? "bg-saffron-light/50 text-maroon"
                    : "bg-sandstone-100 text-ink/50"
              }`}
            >
              {i + 1}. {label}
            </motion.span>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && (
            <fieldset className="space-y-3">
              <legend className="font-display text-2xl text-maroon">{t("book.choosePuja")}</legend>
              <div className="grid gap-3 md:grid-cols-2 [&:has(.puja-pick:hover)_.puja-pick:not(:hover)]:opacity-40 [&:has(.puja-pick:hover)_.puja-pick:not(:hover)]:blur-[0.4px]">
                {pujas.map((p) => (
                  <label
                    key={p.slug}
                    className={`puja-pick flex cursor-pointer flex-col rounded-xl border p-4 transition duration-200 hover:border-maroon/40 ${
                      form.watch("pujaSlug") === p.slug ? "border-maroon bg-sandstone-50" : "border-maroon/15"
                    }`}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      value={p.slug}
                      {...pujaField}
                      onChange={(e) => {
                        void pujaField.onChange(e);
                        if (e.target.value) setStep(1);
                      }}
                    />
                    <span className="font-display text-xl text-maroon">{p.name}</span>
                    <span className="mt-1 font-body text-ink/75">{p.shortDescription.slice(0, 90)}…</span>
                  </label>
                ))}
              </div>
              {form.formState.errors.pujaSlug && (
                <p className="text-sm text-red-700">{form.formState.errors.pujaSlug.message}</p>
              )}
            </fieldset>
          )}

          {step === 1 && (
            <div className="space-y-3">
              <p className="block font-display text-2xl text-maroon">{t("book.chooseDate")}</p>
                <AvailabilityCalendar
                  selectedDate={form.watch("date")}
                  onSelectDate={(nextDate) => {
                    form.setValue("date", nextDate, { shouldValidate: true, shouldDirty: true });
                    form.setValue("time", "", { shouldDirty: true });
                    setStep(2);
                  }}
                />
              {form.formState.errors.date && (
                <p className="text-sm text-red-700">{form.formState.errors.date.message}</p>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="font-display text-2xl text-maroon">{t("book.chooseTime")}</p>
              {slotsLoading ? (
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-12 animate-pulse rounded-lg bg-sandstone-200" />
                  ))}
                </div>
              ) : (
                <div
                  className="grid grid-cols-2 gap-3 md:grid-cols-3 [&:has(.time-pick:hover)_.time-pick:not(:hover)]:opacity-40 [&:has(.time-pick:hover)_.time-pick:not(:hover)]:blur-[0.4px]"
                  role="radiogroup"
                  aria-label={t("book.timeSlotsAria")}
                >
                  {slots.map((s) => (
                    <label
                      key={s.time}
                      className={`time-pick cursor-pointer rounded-lg border px-3 py-3 text-center font-body text-lg transition duration-200 ${
                        form.watch("time") === s.time ? "border-maroon bg-maroon text-parchment" : "border-maroon/20"
                      }`}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        value={s.time}
                        {...timeField}
                        onChange={(e) => {
                          void timeField.onChange(e);
                          window.setTimeout(() => setStep(3), 240);
                        }}
                      />
                      {s.time}
                      <span className="mt-1 block text-xs opacity-80">
                        {t("book.seats").replace(/\{\{count\}\}/g, String(s.available))}
                      </span>
                    </label>
                  ))}
                </div>
              )}
              {form.formState.errors.time && (
                <p className="text-sm text-red-700">{form.formState.errors.time.message}</p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="md:col-span-2 font-display text-2xl text-maroon">{t("book.yourDetails")}</div>
              <div>
                <label className="text-sm font-semibold text-maroon" htmlFor="name">
                  {t("book.fullName")}
                </label>
                <input
                  id="name"
                  className="mt-1 w-full rounded-lg border border-maroon/20 px-3 py-2 font-body text-lg"
                  {...form.register("customerName")}
                />
                {form.formState.errors.customerName && (
                  <p className="text-sm text-red-700">{form.formState.errors.customerName.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold text-maroon" htmlFor="phone">
                  {t("book.phoneLabel")}
                </label>
                <input
                  id="phone"
                  className="mt-1 w-full rounded-lg border border-maroon/20 px-3 py-2 font-body text-lg"
                  {...form.register("phone")}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-red-700">{form.formState.errors.phone.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-maroon" htmlFor="email">
                  {t("book.emailOptional")}
                </label>
                <input
                  id="email"
                  type="email"
                  className="mt-1 w-full rounded-lg border border-maroon/20 px-3 py-2 font-body text-lg"
                  {...form.register("email")}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-700">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-maroon" htmlFor="gotra">
                  {t("book.gotraOptional")}
                </label>
                <input
                  id="gotra"
                  className="mt-1 w-full rounded-lg border border-maroon/20 px-3 py-2 font-body text-lg"
                  {...form.register("gotra")}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-maroon" htmlFor="notes">
                  {t("book.specialNotes")}
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-maroon/20 px-3 py-2 font-body text-lg"
                  {...form.register("notes")}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4 font-body text-lg">
              <h2 className="font-display text-3xl text-maroon">{t("book.reviewPay")}</h2>
              <div className="rounded-xl border border-maroon/15 bg-sandstone-50/80 p-4">
                <p>
                  <strong>{t("book.reviewPuja")}:</strong> {selectedPuja?.name}
                </p>
                <p>
                  <strong>{t("book.reviewWhen")}:</strong> {form.watch("date")} {form.watch("time")}
                </p>
                <p>
                  <strong>{t("book.reviewSeeker")}:</strong> {form.watch("customerName")} · {form.watch("phone")}
                </p>
                {selectedPuja && (
                  <p className="mt-2 text-xl text-maroon">
                    {new Intl.NumberFormat("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 0,
                    }).format(selectedPuja.price)}
                  </p>
                )}
              </div>
              {!razorpayConfigured && (
                <p className="rounded-lg bg-brass/15 px-3 py-2 text-maroon-deep">{t("book.testModeBanner")}</p>
              )}
              <button
                type="button"
                onClick={onPay}
                disabled={submitting}
                className="btn-shine btn-ripple w-full rounded-md bg-maroon py-3 font-display text-xl text-parchment shadow-md transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                {submitting ? t("book.saving") : razorpayConfigured ? t("book.savePay") : t("book.confirm")}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {step === 1 && (
        <div className="mt-8 flex justify-start">
          <button
            type="button"
            onClick={() => {
              setStep(0);
              form.setValue("date", "", { shouldDirty: true });
            }}
            className="rounded-md border border-maroon/25 px-4 py-2 font-body text-maroon"
          >
            {t("book.back")}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="mt-8 flex justify-start">
          <button
            type="button"
            onClick={() => {
              setStep(1);
              form.setValue("time", "", { shouldDirty: true });
            }}
            className="rounded-md border border-maroon/25 px-4 py-2 font-body text-maroon"
          >
            {t("book.back")}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="mt-8 flex justify-between gap-3">
          <button
            type="button"
            onClick={goBack}
            className="rounded-md border border-maroon/25 px-4 py-2 font-body text-maroon disabled:opacity-40"
          >
            {t("book.back")}
          </button>
          <button
            type="button"
            onClick={goNext}
            className="btn-shine btn-ripple rounded-md bg-brass px-5 py-2 font-body text-lg font-semibold text-maroon-deep shadow hover:-translate-y-0.5"
          >
            {t("book.continue")}
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="mt-8">
          <button
            type="button"
            onClick={goBack}
            className="rounded-md border border-maroon/25 px-4 py-2 font-body text-maroon"
          >
            {t("book.back")}
          </button>
        </div>
      )}
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Booking, PujaType } from "@prisma/client";
import { updateBookingPayment, updateBookingStatus } from "@/app/admin/actions";
import { useI18n } from "@/lib/i18n";

type Row = Booking & { pujaType: PujaType };

export function BookingsTable({ bookings }: { bookings: Row[] }) {
  const router = useRouter();
  const { t } = useI18n();
  const [status, setStatus] = useState<string>("all");
  const [puja, setPuja] = useState<string>("all");
  const [q, setQ] = useState("");

  const pujas = useMemo(() => {
    const s = new Set(bookings.map((b) => b.pujaType.name));
    return Array.from(s).sort();
  }, [bookings]);

  const rows = useMemo(() => {
    return bookings.filter((b) => {
      if (status !== "all" && b.status !== status) return false;
      if (puja !== "all" && b.pujaType.name !== puja) return false;
      if (q.trim()) {
        const hay = `${b.customerName} ${b.phone} ${b.email ?? ""} ${b.id}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [bookings, status, puja, q]);

  async function onStatus(id: string, next: string) {
    try {
      await updateBookingStatus(id, next);
      toast.success(t("adminBookings.toastStatusOk"));
      router.refresh();
    } catch {
      toast.error(t("adminBookings.toastStatusFail"));
    }
  }

  async function onPay(id: string, next: string) {
    try {
      await updateBookingPayment(id, next);
      toast.success(t("adminBookings.toastPayOk"));
      router.refresh();
    } catch {
      toast.error(t("adminBookings.toastPayFail"));
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 font-body">
        <label className="flex flex-col text-sm text-maroon">
          {t("adminBookings.status")}
          <select
            className="mt-1 rounded-md border border-maroon/25 bg-white px-2 py-1 text-ink"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">{t("adminBookings.all")}</option>
            <option value="Payment Pending">{t("adminBookings.statusPaymentPending")}</option>
            <option value="Confirmed">{t("adminBookings.statusConfirmed")}</option>
            <option value="Completed">{t("adminBookings.statusCompleted")}</option>
            <option value="Cancelled">{t("adminBookings.statusCancelled")}</option>
          </select>
        </label>
        <label className="flex flex-col text-sm text-maroon">
          {t("adminBookings.puja")}
          <select
            className="mt-1 rounded-md border border-maroon/25 bg-white px-2 py-1 text-ink"
            value={puja}
            onChange={(e) => setPuja(e.target.value)}
          >
            <option value="all">{t("adminBookings.all")}</option>
            {pujas.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col text-sm text-maroon">
          {t("adminBookings.search")}
          <input
            className="mt-1 rounded-md border border-maroon/25 bg-white px-2 py-1 text-ink"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("adminBookings.searchPh")}
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-xl border border-maroon/10 bg-white">
        <table className="min-w-full border-collapse font-body text-sm">
          <thead className="bg-sandstone-100 text-left text-maroon">
            <tr>
              <th className="p-3">{t("adminBookings.when")}</th>
              <th className="p-3">{t("adminBookings.puja")}</th>
              <th className="p-3">{t("adminBookings.seeker")}</th>
              <th className="p-3">{t("adminBookings.amount")}</th>
              <th className="p-3">{t("adminBookings.status")}</th>
              <th className="p-3">{t("adminBookings.payment")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className="border-t border-maroon/10">
                <td className="p-3 whitespace-nowrap">
                  {b.date} {b.time}
                </td>
                <td className="p-3">{b.pujaType.name}</td>
                <td className="p-3">
                  <div className="font-semibold">{b.customerName}</div>
                  <div className="text-ink/70">{b.phone}</div>
                  <div className="text-xs text-ink/50">{b.id}</div>
                </td>
                <td className="p-3 whitespace-nowrap">
                  {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
                    b.amount,
                  )}
                </td>
                <td className="p-3">
                  <select
                    className="rounded-md border border-maroon/20 px-1 py-1"
                    value={b.status}
                    onChange={(e) => void onStatus(b.id, e.target.value)}
                  >
                    <option value="Payment Pending">{t("adminBookings.statusPaymentPending")}</option>
                    <option value="Confirmed">{t("adminBookings.statusConfirmed")}</option>
                    <option value="Completed">{t("adminBookings.statusCompleted")}</option>
                    <option value="Cancelled">{t("adminBookings.statusCancelled")}</option>
                  </select>
                </td>
                <td className="p-3">
                  <select
                    className="rounded-md border border-maroon/20 px-1 py-1"
                    value={b.paymentStatus}
                    onChange={(e) => void onPay(b.id, e.target.value)}
                  >
                    <option value="pending">{t("adminBookings.payPending")}</option>
                    <option value="paid">{t("adminBookings.payPaid")}</option>
                    <option value="failed">{t("adminBookings.payFailed")}</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

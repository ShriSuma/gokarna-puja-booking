import { Resend } from "resend";
import { siteConfig } from "@/content/site.config";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendBookingEmails(params: {
  customerEmail?: string | null;
  customerName: string;
  pujaName: string;
  date: string;
  time: string;
  amount: number;
  bookingId: string;
  paymentLabel: string;
}) {
  const from = process.env.RESEND_FROM_EMAIL ?? "Gokarna Puja <onboarding@resend.dev>";
  const ownerTo = process.env.OWNER_NOTIFY_EMAIL || siteConfig.ownerEmail;
  const currency = (n: number) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

  const lines = [
    `Dear ${params.customerName},`,
    ``,
    `Your booking for **${params.pujaName}** is recorded.`,
    `Date: ${params.date} at ${params.time}`,
    `Amount: ${currency(params.amount)}`,
    `Reference: ${params.bookingId}`,
    `Payment: ${params.paymentLabel}`,
    ``,
    `With blessings,`,
    siteConfig.siteName,
  ].join("\n");

  const html = lines.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");

  if (!resend) {
    console.info("[email] Resend not configured; would send:", { to: params.customerEmail, ownerTo });
    return;
  }

  try {
    if (params.customerEmail) {
      await resend.emails.send({
        from,
        to: params.customerEmail,
        subject: `Booking confirmed — ${params.pujaName}`,
        html: `<p>${html}</p>`,
      });
    }
    if (ownerTo) {
      await resend.emails.send({
        from,
        to: ownerTo,
        subject: `New booking: ${params.pujaName} — ${params.date}`,
        html: `<p>${html}</p><p><strong>Manage:</strong> ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin</p>`,
      });
    }
  } catch (e) {
    console.error("[email] send failed", e);
  }
}

export async function sendContactEmail(body: { name: string; email: string; message: string }) {
  const from = process.env.RESEND_FROM_EMAIL ?? "Gokarna Puja <onboarding@resend.dev>";
  const ownerTo = process.env.OWNER_NOTIFY_EMAIL || siteConfig.ownerEmail;
  if (!resend || !ownerTo) {
    console.info("[email] contact form (skipped):", body);
    return { ok: false as const, reason: "Email not configured" };
  }
  await resend.emails.send({
    from,
    to: ownerTo,
    subject: `Contact form from ${body.name}`,
    html: `<p>From: ${body.name} &lt;${body.email}&gt;</p><p>${body.message.replace(/\n/g, "<br/>")}</p>`,
  });
  return { ok: true as const };
}

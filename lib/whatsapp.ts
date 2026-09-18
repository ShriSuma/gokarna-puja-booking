import { siteConfig } from "@/content/site.config";
import type { Locale } from "@/lib/i18n/messages";
import { messages } from "@/lib/i18n/messages";

export function waNumberDigits(): string {
  const raw = String(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? siteConfig.whatsappNumber).replace(/\D/g, "");
  // If format is like 9107892676490 (13 digits with 91 followed by trunk zero)
  if (raw.startsWith("910") && raw.length === 13) {
    return "91" + raw.slice(3);
  }
  // If format has single trunk zero e.g. 07892676490 (11 digits)
  if (raw.startsWith("0") && raw.length === 11) {
    return "91" + raw.slice(1);
  }
  // If 10 digits standard mobile number
  if (raw.length === 10) {
    return "91" + raw;
  }
  return raw;
}

export function buildBookingWhatsAppMessage(parts: {
  name: string;
  puja: string;
  date: string;
  time: string;
  bookingId: string;
  payment: string;
}): string {
  return encodeURIComponent(
    [
      `Namaste — booking request`,
      `Name: ${parts.name}`,
      `Puja: ${parts.puja}`,
      `Date: ${parts.date} ${parts.time}`,
      `Ref: ${parts.bookingId}`,
      `Payment: ${parts.payment}`,
    ].join("\n"),
  );
}

export function whatsappChatUrl(prefill: string): string {
  return `https://wa.me/${waNumberDigits()}?text=${prefill}`;
}

export function getPitruPakshaWhatsAppUrl(locale: Locale = "en"): string {
  const langMessages = messages[locale] || messages.en;
  const prefill = langMessages.contact?.whatsappPrefill || messages.en.contact.whatsappPrefill;
  return whatsappChatUrl(encodeURIComponent(prefill));
}

/** Optional Cloud API — fails soft if not configured */
export async function trySendWhatsAppApi(toDigits: string, text: string): Promise<void> {
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) return;

  try {
    await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: toDigits.replace(/\D/g, ""),
        type: "text",
        text: { body: text },
      }),
    });
  } catch (e) {
    console.warn("[whatsapp] API send skipped", e);
  }
}

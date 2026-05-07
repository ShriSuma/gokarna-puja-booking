import { siteConfig } from "@/content/site.config";

export function waNumberDigits(): string {
  const n = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? siteConfig.whatsappNumber;
  return String(n).replace(/\D/g, "");
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

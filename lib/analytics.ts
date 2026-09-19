export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "AW-18461450287";

declare global {
  interface Window {
    gtag?: (
      command: string,
      targetIdOrAction: string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

/**
 * Fires custom and standard Google Ads conversion/lead events.
 */
export function trackGoogleAdsEvent(
  action: string,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", action, {
    send_to: GOOGLE_ADS_ID,
    ...params,
  });
}

/**
 * Track Phone Call Click conversions across the site.
 * This signals to Google Ads that a high-intent client initiated a phone call.
 */
export function trackCallConversion(phone: string = "Panditji") {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  // Google Ads conversion event
  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_ID,
    event_category: "Contact",
    event_label: "Call Panditji",
  });

  // Google Analytics & Ads standard lead action
  window.gtag("event", "click_to_call", {
    event_category: "Lead",
    event_label: "Call Panditji",
  });

  window.gtag("event", "generate_lead", {
    event_category: "Direct Call",
    value: 1.0,
    currency: "INR",
  });
}

/**
 * Track WhatsApp Chat Click conversions across the site.
 * This signals to Google Ads that a high-intent client opened WhatsApp to chat.
 */
export function trackWhatsAppConversion() {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  // Google Ads conversion event
  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_ID,
    event_category: "Contact",
    event_label: "WhatsApp Chat",
  });

  // Google Analytics & Ads standard lead action
  window.gtag("event", "whatsapp_click", {
    event_category: "Lead",
    event_label: "WhatsApp Inquiry",
  });

  window.gtag("event", "generate_lead", {
    event_category: "WhatsApp",
    value: 1.0,
    currency: "INR",
  });
}

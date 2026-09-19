"use client";

import { useEffect } from "react";
import { trackCallConversion, trackWhatsAppConversion } from "@/lib/analytics";

export function GoogleAdsTracker() {
  useEffect(() => {
    const handleGlobalClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") || "";

      // Track Phone Calls (tel: links)
      if (href.startsWith("tel:")) {
        const phone = href.replace("tel:", "").trim();
        trackCallConversion(phone);
      }

      // Track WhatsApp Clicks
      if (
        href.includes("wa.me") ||
        href.includes("whatsapp.com") ||
        href.includes("api.whatsapp.com")
      ) {
        trackWhatsAppConversion();
      }
    };

    document.addEventListener("click", handleGlobalClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleGlobalClick, { capture: true });
    };
  }, []);

  return null;
}

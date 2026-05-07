"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/content/site.config";
import { waNumberDigits } from "@/lib/whatsapp";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const wa = waNumberDigits();
  const { t } = useI18n();
  return (
    <footer className="mt-auto border-t border-maroon/15 bg-sandstone-100/80">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-xl text-maroon">{siteConfig.siteName}</p>
          <p className="mt-2 max-w-sm font-body text-lg text-ink/80">{siteConfig.tagline}</p>
        </div>
        <div className="font-body text-lg">
          <p className="font-semibold text-maroon">{t("footer.visit")}</p>
          <p className="mt-2 text-ink/85">{siteConfig.address}</p>
          <p className="mt-2">
            <a className="text-maroon hover:underline" href={`tel:${siteConfig.ownerPhone}`}>
              {siteConfig.ownerPhone}
            </a>
          </p>
          <p className="mt-1">
            <a className="text-maroon hover:underline" href={`mailto:${siteConfig.ownerEmail}`}>
              {siteConfig.ownerEmail}
            </a>
          </p>
        </div>
        <div className="font-body text-lg">
          <p className="font-semibold text-maroon">{t("footer.connect")}</p>
          <ul className="mt-2 space-y-2">
            <li>
              <motion.a
                whileHover={{ x: 4 }}
                className="text-maroon hover:underline"
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noreferrer"
              >
                {t("footer.whatsapp")}
              </motion.a>
            </li>
            <li>
              <a
                className="text-maroon hover:underline"
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
              >
                Instagram
              </a>
            </li>
            <li>
              <Link className="text-maroon hover:underline" href="/contact">
                Contact form
              </Link>
            </li>
            <li>
              <Link className="text-maroon/70 hover:text-maroon hover:underline" href="/admin/login">
                {t("footer.adminLogin")}
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-maroon/10 py-4 text-center font-body text-sm text-ink/60">
        © {new Date().getFullYear()} {siteConfig.siteName}. Offered with devotion in Gokarna.
      </div>
    </footer>
  );
}

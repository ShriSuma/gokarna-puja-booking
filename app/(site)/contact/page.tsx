import { TempleBackdrop } from "@/components/TempleBackdrop";
import { siteConfig } from "@/content/site.config";
import { waNumberDigits } from "@/lib/whatsapp";
import { ContactForm } from "@/components/ContactForm";
import { getServerI18n } from "@/lib/i18n/server";

export const metadata = {
  title: "Contact",
  description: "Reach Gokarna Puja Booking by phone, email, WhatsApp, or the contact form.",
};

export default async function ContactPage() {
  const { t } = await getServerI18n();
  const wa = waNumberDigits();
  const mapUrl = siteConfig.mapEmbedUrl;

  return (
    <div className="relative">
      <TempleBackdrop />
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h1 className="font-display text-4xl text-maroon md:text-5xl">{t("contact.title")}</h1>
        <p className="mt-4 max-w-2xl font-body text-xl text-ink/80">
          We respond as soon as we are free from ceremonies. WhatsApp is often fastest for date checks.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <div className="space-y-6 font-body text-lg text-ink/85">
            <div>
              <h2 className="font-display text-2xl text-maroon">{t("contact.phone")}</h2>
              <a className="mt-2 inline-block text-maroon hover:underline" href={`tel:${siteConfig.ownerPhone}`}>
                {siteConfig.ownerPhone}
              </a>
            </div>
            <div>
              <h2 className="font-display text-2xl text-maroon">{t("contact.email")}</h2>
              <a className="mt-2 inline-block text-maroon hover:underline" href={`mailto:${siteConfig.ownerEmail}`}>
                {siteConfig.ownerEmail}
              </a>
            </div>
            <div>
              <h2 className="font-display text-2xl text-maroon">{t("contact.address")}</h2>
              <p className="mt-2">{siteConfig.address}</p>
            </div>
            <a
              href={`https://wa.me/${wa}`}
              target="_blank"
              rel="noreferrer"
              className="btn-shine inline-flex rounded-md bg-[#25D366] px-5 py-3 font-semibold text-white shadow hover:-translate-y-0.5"
            >
              {t("contact.whatsapp")}
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-maroon/10 temple-frame">
            <iframe
              title="Map — Gokarna Puja Booking"
              src={mapUrl}
              className="h-72 w-full md:h-full min-h-[280px]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="mt-14 rounded-2xl border border-maroon/10 bg-white/70 p-6 backdrop-blur md:p-8">
          <h2 className="font-display text-3xl text-maroon">{t("contact.sendNote")}</h2>
          <p className="mt-2 font-body text-lg text-ink/75">
            Optional—emails the owner when Resend is configured in environment variables.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}

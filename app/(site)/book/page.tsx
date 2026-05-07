import { Suspense } from "react";
import { TempleBackdrop } from "@/components/TempleBackdrop";
import { BookingFlow } from "@/components/BookingFlow";
import { listActivePujas } from "@/lib/pujas";
import { getServerI18n } from "@/lib/i18n/server";

export const metadata = {
  title: "Book a Puja",
  description: "Choose a ritual, date, and time. Gentle guidance from inquiry to offering.",
};

function BookingFallback() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse rounded-2xl border border-maroon/10 bg-white/60 p-10">
      <div className="h-8 w-1/2 rounded bg-sandstone-200" />
      <div className="mt-8 h-40 rounded-xl bg-sandstone-100" />
    </div>
  );
}

export default async function BookPage() {
  const { t, locale } = await getServerI18n();
  const pujas = await listActivePujas(locale);

  return (
    <div className="relative">
      <TempleBackdrop />
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h1 className="font-display text-4xl text-maroon md:text-5xl">{t("book.title")}</h1>
        <p className="mt-4 max-w-2xl font-body text-xl text-ink/80">
          {t("book.intro")}
        </p>
        <div className="mt-10">
          <Suspense fallback={<BookingFallback />}>
            <BookingFlow pujas={pujas} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}

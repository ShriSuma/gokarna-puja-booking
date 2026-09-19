"use client";

import { useState } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface FaqItem {
  q: string;
  a: string;
}

const faqs: FaqItem[] = [
  {
    q: "Which pujas are performed in Gokarna for Pitru Paksha & Ancestral peace?",
    a: "In Gokarna, the most revered ancestral ceremonies include Mahalaya Pitru Paksha Tarpana, Narayana Bali, Tripindi Shraddha, Tithi Shradh, and Pinda Pradhan. These rituals are performed by the sacred sea shore and near Mahabaleshwara temple to bring peace to departed souls and relieve Pitru Dosha.",
  },
  {
    q: "Why is Gokarna considered one of the foremost Mukti Kshetras for Narayana Bali?",
    a: "Gokarna is home to the sacred Atmalinga of Lord Shiva (Mahabaleshwara) and is celebrated as a Siddhi & Mukti Kshetra. Conducting Narayana Bali here removes negative curses, unnatural death obstacles, and severe pitru doshas, granting liberation to ancestors and peace to the family.",
  },
  {
    q: "How do I check muhurtha dates and book with Pandit Ganapati Maarigoli?",
    a: "You can directly call Guruji or message on WhatsApp. Guruji evaluates your family gotra, tithi, and travel schedule to suggest the most auspicious muhurtha. All puja samagri, homa requirements, and temple coordination are managed for you.",
  },
  {
    q: "What items and dress code are required from devotees?",
    a: "All sacred materials (samagri, flowers, homa woods, dharbha, and rice flour for pindas) are provided by us. Devotees only need to bring names of departed ancestors and family gotra. Traditional dress is recommended (dhoti/uttariya for gents, saree or traditional dress for ladies).",
  },
  {
    q: "Can rituals be performed on Mahalaya Amavasya (Sarvapitri Amavasya)?",
    a: "Yes, Mahalaya Amavasya is the culmination of Pitru Paksha and is considered the single most auspicious day to honor all ancestors. Due to peak devotee arrivals, early advance booking is highly advised.",
  },
];

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="border-t border-maroon/10 bg-sandstone-50/60 py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-4">
        <ScrollReveal>
          <div className="text-center">
            <span className="inline-block rounded-full border border-gold-400/40 bg-gold-50/80 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-maroon shadow-sm">
              Devotee Guidance & FAQs
            </span>
            <h2 className="mt-3 font-display text-3xl md:text-4xl text-maroon">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 font-body text-base md:text-lg text-ink/75">
              Everything you need to know about Pitru Paksha, Narayana Bali, and Vedic rituals in Gokarna
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-10 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-xl border border-maroon/15 bg-white/90 shadow-sm transition-all duration-200 hover:border-maroon/30"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left font-display text-lg text-maroon transition-colors hover:text-maroon-700"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold">{faq.q}</span>
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-100 text-maroon transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-maroon text-gold-200" : ""
                    }`}
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-maroon/10 px-5 pb-5 pt-3 font-body text-base leading-relaxed text-ink/85">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Instant Contact Helper */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-xl border border-gold-300 bg-gradient-to-r from-amber-50 to-orange-50 p-5 shadow-sm sm:flex-row">
          <div>
            <p className="font-display font-semibold text-maroon">
              Have specific gotra or muhurtha questions?
            </p>
            <p className="font-body text-sm text-ink/75">
              Speak directly with Pandit Ganapati Maarigoli before booking.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="tel:07892676490"
              className="inline-flex items-center gap-1.5 rounded-lg bg-maroon px-4 py-2 text-sm font-semibold text-gold-100 shadow transition-all hover:bg-maroon-700"
            >
              📞 Call Panditji
            </a>
            <a
              href="https://wa.me/917892676490?text=Namaskara%20Guruji%2C%20I%20have%20questions%20regarding%20puja%20muhurtha%20in%20Gokarna."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow transition-all hover:bg-emerald-800"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

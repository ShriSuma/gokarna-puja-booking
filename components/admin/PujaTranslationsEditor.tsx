"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { PujaTranslation } from "@prisma/client";
import { locales, type Locale } from "@/lib/i18n/messages";
import { updatePujaTranslation } from "@/app/admin/actions";
import { useI18n } from "@/lib/i18n";

const labels: Record<
  Locale,
  {
    lang: string;
    save: string;
    name: string;
    short: string;
    long: string;
    requirements: string;
    benefits: string;
    significance: string;
    who: string;
    included: string;
    prep: string;
    story: string;
  }
> = {
  en: {
    lang: "English",
    save: "Save translation",
    name: "Name",
    short: "Short description",
    long: "Long description (Markdown)",
    requirements: "Requirements / preparation checklist (one item per line)",
    benefits: "Benefits (one per line)",
    significance: "Significance",
    who: "Who should consider it",
    included: "What is included (one per line)",
    prep: "Preparation guidance",
    story: "Emotional devotional note",
  },
  hi: {
    lang: "हिंदी",
    save: "अनुवाद सहेजें",
    name: "नाम",
    short: "संक्षिप्त विवरण",
    long: "विस्तृत विवरण (Markdown)",
    requirements: "आवश्यकताएँ / तैयारी (प्रति पंक्ति एक)",
    benefits: "लाभ (प्रति पंक्ति एक)",
    significance: "महत्व",
    who: "किसके लिए",
    included: "क्या शामिल है (प्रति पंक्ति एक)",
    prep: "तैयारी मार्गदर्शन",
    story: "भावनात्मक टिप्पणी",
  },
  te: {
    lang: "తెలుగు",
    save: "అనువాదం సేవ్",
    name: "పేరు",
    short: "సంక్షిప్త వివరణ",
    long: "విస్తృత వివరణ (Markdown)",
    requirements: "అవసరాలు / తయారీ (ప్రతి పంక్తిలో ఒకటి)",
    benefits: "ప్రయోజనాలు (ప్రతి పంక్తిలో ఒకటి)",
    significance: "ప్రాముఖ్యత",
    who: "ఎవరికి",
    included: "ఏం ఉంటుంది (ప్రతి పంక్తిలో ఒకటి)",
    prep: "సిద్ధత సూచనలు",
    story: "భావపూర్వక గమనిక",
  },
  ta: {
    lang: "தமிழ்",
    save: "மொழிபெயர்ப்பைச் சேமி",
    name: "பெயர்",
    short: "சுருக்க விளக்கம்",
    long: "நீண்ட விளக்கம் (Markdown)",
    requirements: "தேவைகள் / தயாரிப்பு (ஒரு வரியில் ஒன்று)",
    benefits: "நன்மைகள் (ஒரு வரியில் ஒன்று)",
    significance: "முக்கியத்துவம்",
    who: "யாருக்கு",
    included: "இதில் அடங்குவது (ஒரு வரியில் ஒன்று)",
    prep: "தயாரிப்பு வழிகாட்டி",
    story: "உணர்வுபூர்வ குறிப்பு",
  },
  kn: {
    lang: "ಕನ್ನಡ",
    save: "ಅನುವಾದ ಉಳಿಸಿ",
    name: "ಹೆಸರು",
    short: "ಸಂಕ್ಷಿಪ್ತ ವಿವರ",
    long: "ವಿಸ್ತೃತ ವಿವರ (Markdown)",
    requirements: "ಅಗತ್ಯಗಳು / ತಯಾರಿ (ಪ್ರತಿ ಸಾಲಿಗೆ ಒಂದು)",
    benefits: "ಫಲಗಳು (ಪ್ರತಿ ಸಾಲಿಗೆ ಒಂದು)",
    significance: "ಮಹತ್ವ",
    who: "ಯಾರಿಗೆ",
    included: "ಏನು ಒಳಗೊಂಡಿದೆ (ಪ್ರತಿ ಸಾಲಿಗೆ ಒಂದು)",
    prep: "ತಯಾರಿ ಮಾರ್ಗದರ್ಶನ",
    story: "ಭಾವನಾತ್ಮಕ ಟಿಪ್ಪಣಿ",
  },
};

export function PujaTranslationsEditor({
  pujaTypeId,
  translations,
}: {
  pujaTypeId: string;
  translations: PujaTranslation[];
}) {
  const router = useRouter();
  const { t } = useI18n();
  const byLang = useMemo(() => {
    const map = new Map<string, PujaTranslation>();
    translations.forEach((t) => map.set(t.language, t));
    return map;
  }, [translations]);

  const [active, setActive] = useState<Locale>("en");
  const [saving, setSaving] = useState(false);

  const current = byLang.get(active);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    setSaving(true);
    try {
      await updatePujaTranslation({
        pujaTypeId,
        language: active,
        name: String(fd.get("name") || ""),
        shortDescription: String(fd.get("shortDescription") || ""),
        longDescriptionMarkdown: String(fd.get("longDescriptionMarkdown") || ""),
        requirements: String(fd.get("requirements") || ""),
        benefits: String(fd.get("benefits") || ""),
        significance: String(fd.get("significance") || ""),
        whoShouldDo: String(fd.get("whoShouldDo") || ""),
        included: String(fd.get("included") || ""),
        preparation: String(fd.get("preparation") || ""),
        story: String(fd.get("story") || ""),
      });
      toast.success(t("adminToast.translationSaved"));
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("adminToast.pujaSaveFail"));
    } finally {
      setSaving(false);
    }
  }

  const L = labels[active];

  return (
    <div className="space-y-4 rounded-xl border border-maroon/10 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {(locales as readonly Locale[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setActive(l)}
            className={`rounded-full px-3 py-1 text-sm font-semibold ${
              active === l ? "bg-maroon text-parchment" : "border border-maroon/20 text-maroon"
            }`}
          >
            {labels[l].lang}
          </button>
        ))}
      </div>

      <form key={active} onSubmit={onSubmit} className="grid gap-4 font-body text-base">
        <div>
          <label className="text-sm font-semibold text-maroon">{L.name}</label>
          <input name="name" defaultValue={current?.name ?? ""} className="mt-1 w-full rounded-md border px-3 py-2" required />
        </div>
        <div>
          <label className="text-sm font-semibold text-maroon">{L.short}</label>
          <textarea name="shortDescription" rows={3} defaultValue={current?.shortDescription ?? ""} className="mt-1 w-full rounded-md border px-3 py-2" required />
        </div>
        <div>
          <label className="text-sm font-semibold text-maroon">{L.significance}</label>
          <textarea name="significance" rows={3} defaultValue={current?.significance ?? ""} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-maroon">{L.who}</label>
          <textarea name="whoShouldDo" rows={2} defaultValue={current?.whoShouldDo ?? ""} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-maroon">{L.included}</label>
          <textarea name="included" rows={4} defaultValue={current?.included ?? ""} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-maroon">{L.prep}</label>
          <textarea name="preparation" rows={3} defaultValue={current?.preparation ?? ""} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-maroon">{L.story}</label>
          <textarea name="story" rows={3} defaultValue={current?.story ?? ""} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-maroon">{L.requirements}</label>
          <textarea name="requirements" rows={4} defaultValue={current?.requirements ?? ""} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-maroon">{L.benefits}</label>
          <textarea name="benefits" rows={4} defaultValue={current?.benefits ?? ""} className="mt-1 w-full rounded-md border px-3 py-2" />
        </div>
        <div>
          <label className="text-sm font-semibold text-maroon">{L.long}</label>
          <textarea name="longDescriptionMarkdown" rows={10} defaultValue={current?.longDescriptionMarkdown ?? ""} className="mt-1 w-full rounded-md border px-3 py-2 font-mono text-sm" required />
        </div>
        <button type="submit" disabled={saving} className="rounded-md bg-maroon px-4 py-2 text-parchment disabled:opacity-50">
          {saving ? "…" : L.save}
        </button>
      </form>
    </div>
  );
}

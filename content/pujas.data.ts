export type PujaContent = {
  slug: string;
  category: "PITRI_KARYA" | "PUJA_KARYA";
  name: string;
  shortDescription: string;
  price: number;
  durationMinutes: number;
  significance: string;
  whoShouldDo: string;
  included: string[];
  preparation: string;
  story: string;
  longDescriptionMarkdown: string;
  requirements?: string;
  benefits?: string;
};

export const pujasData: PujaContent[] = [
  {
    slug: "pitru-daan",
    category: "PITRI_KARYA",
    name: "Pitru Daan",
    shortDescription:
      "Honouring ancestors with offerings of faith beside the sacred waters.",
    price: 5100,
    durationMinutes: 120,
    significance:
      "Pitru Daan strengthens the connection between generations, offering gratitude and peace to those who came before us. In Gokarna, this rite is traditionally performed with deep attention to mantra and sequence.",
    whoShouldDo:
      "Families observing annual śrāddha, those guided by astrological counsel, or anyone seeking to honour parents and lineage with a full ceremonial offering.",
    included: [
      "Personalised sankalpa",
      "Traditional offerings and materials",
      "Guided participation with clear instructions",
      "Recorded checklist for preparatory fasts or purity notes (as applicable)",
    ],
    preparation:
      "Wear simple, clean traditional attire. Bring family names and gotra if known. Avoid heavy meals before the ritual; we will confirm exact guidance when you book.",
    story:
      "The wind from the Arabian Sea carries the scent of camphor and wet sand. As each mantra rises, it feels less like a performance and more like a quiet conversation across time—between you, your ancestors, and the stillness that holds you both.",
    longDescriptionMarkdown: `## Pitru Daan in Gokarna

**Pitru Daan** is offered with full **Vedic procedure**, appropriate **mantras**, and calm explanation so every family member can participate with confidence.

### What to expect
- Sankalpa with your **family lineage**
- Traditional **bali and offering** sequences
- Time for **silent prayer** and **tarpana**-style offerings as suited to your case

We keep the pace unhurried so the experience feels **grounded**, not rushed.`,
  },
  {
    slug: "pinda-pradhan",
    category: "PITRI_KARYA",
    name: "Pinda Pradhan",
    shortDescription:
      "Sacred piṇḍa offerings for the departed, performed with meticulous care.",
    price: 7100,
    durationMinutes: 150,
    significance:
      "Piṇḍa Pradhan supports the onward journey of the departed soul and brings solace to the family. Each piṇḍa is offered with prescribed mantras and intention.",
    whoShouldDo:
      "Families observing post-funeral rites, annual remembrance, or specific guidance from tradition or āchārya for piṇḍa offerings.",
    included: [
      "Preparation of piṇḍas per tradition",
      "Full mantra recitation",
      "Family briefing before the ritual",
      "Post-rite guidance for home observances if needed",
    ],
    preparation:
      "Share the tithi or occasion when booking. Bring white/dhoti or simple traditional wear. We will send a short preparation note after confirmation.",
    story:
      "Each piṇḍa is shaped by steady hands—rice, sesame, and intention pressed into something that feels almost too small to hold so much love. And yet it does.",
    longDescriptionMarkdown: `## Pinda Pradhan

Piṇḍa Pradhan is among the most **compassionate** offerings we facilitate. We take time to understand your **lineage details** and any **specific customs** your family follows.

### Highlights
- Careful preparation of **piṇḍa** materials
- Step-by-step participation options for family members
- Space for **grief and gratitude** without hurry`,
  },
  {
    slug: "narayana-bali",
    category: "PITRI_KARYA",
    name: "Narayana Bali",
    shortDescription:
      "Remedial rite for unsettled energies, unexplained obstacles, and ancestral peace.",
    price: 9100,
    durationMinutes: 180,
    significance:
      "Narayana Bali is often recommended when there are persistent difficulties, dreams, or family patterns that suggest a need for deeper ancestral appeasement and release.",
    whoShouldDo:
      "Those advised by jyotiṣa or family āchārya, or families sensing a need for remedial peace after loss or disruption.",
    included: [
      "Detailed intake before the day",
      "Full Narayana Bali sequence",
      "Homam elements as per tradition for your case",
      "Written summary of observations and next steps",
    ],
    preparation:
      "We may request birth details and a brief family history. Wear clean traditional clothes; specific items will be listed in your confirmation email.",
    story:
      "Sometimes what we carry is not ours alone. This rite is a gentle, firm invitation for what is stuck to move—like tide returning to the sea.",
    longDescriptionMarkdown: `## Narayana Bali

Performed with **focus** and **confidentiality**, Narayana Bali addresses cases where **ancestral peace** and **remedial relief** are sought together.

### Our approach
- Clear **consultation** before sankalpa
- **Transparent** pacing—you will know what is happening and why
- **Aftercare** suggestions for home prayer or follow-up dates`,
  },
  {
    slug: "tarpana",
    category: "PITRI_KARYA",
    name: "Tarpana",
    shortDescription:
      "Offering of water and mantra for ancestors—pure, precise, and heartfelt.",
    price: 3100,
    durationMinutes: 60,
    significance:
      "Tarpana is a luminous, concise offering that nourishes pitṛs through water and mantra. Ideal for periodic remembrance or combined pilgrimage intent.",
    whoShouldDo:
      "Individuals or small families seeking a focused tarpana without a longer homam, or as a complement to other rites during your stay.",
    included: [
      "Guided tarpana with clear repetition",
      "Preparation of tarpana materials",
      "Optional add-on coordination with other pujas",
    ],
    preparation:
      "Bring gotra and ancestor names if available. Light clothing suitable for sitting near water; we provide guidance on posture and timing.",
    story:
      "Water poured in a thin silver stream catches the morning light. The mantras are old; the feeling is immediate—like remembering a lullaby you did not know you knew.",
    longDescriptionMarkdown: `## Tarpana

A **beautiful** standalone rite or a **companion** to a longer ceremony. We keep instruction **simple** so you can stay present.

### Ideal for
- **Amāvāsya** observances
- Post-**śrāddha** remembrance
- Pilgrims visiting Gokarna for the first time`,
  },
  {
    slug: "tripindi-shraddha",
    category: "PITRI_KARYA",
    name: "Tripindi Shraddha",
    shortDescription:
      "Three-fold śrāddha for specific ancestral situations—offered with full attention.",
    price: 12100,
    durationMinutes: 200,
    significance:
      "Tripindi Śraddha addresses particular combinations of ancestral needs and is performed with extended preparation and precise sequence.",
    whoShouldDo:
      "Families directed by tradition or astrologer for Tripindi, or those with layered ancestral situations requiring this structured approach.",
    included: [
      "Preliminary consultation",
      "Tripindi sequence with all three piṇḍa aspects",
      "Dedicated time for family prayers",
      "Follow-up notes",
    ],
    preparation:
      "Advance booking recommended. We will send a detailed list after confirmation, including dietary notes and arrival timing.",
    story:
      "Three threads, three offerings, one intention: that no one in the line is left unheard.",
    longDescriptionMarkdown: `## Tripindi Shraddha

A **complete** Tripindi offering for families needing this **specific** resolution path.

### Notes
- Longer duration; please plan **hydration** and rest
- We coordinate **crowd timing** at the shore when needed`,
  },
  {
    slug: "rudrabhisheka",
    category: "PUJA_KARYA",
    name: "Rudrabhisheka",
    shortDescription:
      "Sacred abhiṣeka to Lord Shiva for wellbeing, inner strength, and spiritual cleansing.",
    price: 4500,
    durationMinutes: 90,
    significance:
      "Rudrabhisheka invokes the transformative grace of Shiva through abhiṣeka and Rudra chanting, often sought for peace, health, and protection.",
    whoShouldDo:
      "Individuals and families praying for clarity, relief from stress, and auspicious beginnings.",
    included: [
      "Sankalpa and Rudra recitation",
      "Abhiṣeka materials and arrangement",
      "Guided participation in final ārati",
    ],
    preparation:
      "Share your intention while booking. Traditional attire is preferred; arrive 20 minutes early.",
    story:
      "As water and mantra flow together over the liṅga, many describe a subtle stillness settling in the chest.",
    longDescriptionMarkdown: `## Rudrabhisheka

A focused Shiva worship sequence with abhiṣeka, mantra, and closing prayers.

### Suitable for
- New ventures
- Family wellbeing prayers
- Monthly or special-day worship`,
  },
  {
    slug: "maha-mrityunjaya-japa",
    category: "PUJA_KARYA",
    name: "Maha Mrityunjaya Japa",
    shortDescription:
      "Powerful healing mantra japa for resilience, recovery, and protection in difficult phases.",
    price: 6100,
    durationMinutes: 120,
    significance:
      "The Maha Mrityunjaya mantra is traditionally invoked for healing and overcoming fear, with disciplined chanting and sankalpa.",
    whoShouldDo:
      "Families praying for health concerns, emotional strength, or supportive energy during treatment and recovery.",
    included: [
      "Sankalpa with name and intent",
      "Structured japa count with priest-led recitation",
      "Closing shanti prayers",
    ],
    preparation:
      "Provide name details for sankalpa. Keep the day simple and sattvic if possible.",
    story:
      "The repetition begins as sound, then turns into breath—steady, patient, and quietly strengthening.",
    longDescriptionMarkdown: `## Maha Mrityunjaya Japa

Dedicated mantra chanting for healing intention and spiritual steadiness.

### Includes
- Guided sankalpa
- Japa recitation
- Closing blessings`,
  },
  {
    slug: "ganapati-homa",
    category: "PUJA_KARYA",
    name: "Ganapati Homa",
    shortDescription:
      "Invocation of Lord Ganesha to remove obstacles and sanctify important beginnings.",
    price: 5500,
    durationMinutes: 110,
    significance:
      "Ganapati Homa is performed before major milestones to invite clarity, smooth progress, and auspicious protection.",
    whoShouldDo:
      "Those beginning business, education journeys, house moves, or any significant life chapter.",
    included: [
      "Ganapati avahana and sankalpa",
      "Homa with core offerings",
      "Prasada and completion guidance",
    ],
    preparation:
      "Share your upcoming milestone while booking; we will align sankalpa accordingly.",
    story:
      "With each offering into the fire, intentions become simpler and more grounded: remove what obstructs, protect what matters.",
    longDescriptionMarkdown: `## Ganapati Homa

A traditional fire ritual for auspicious beginnings and obstacle removal.

### Common occasions
- New business
- Exams and education goals
- Home-related beginnings`,
  },
  {
    slug: "nava-graha-shanti",
    category: "PUJA_KARYA",
    name: "Nava Graha Shanti",
    shortDescription:
      "Planetary harmony ritual for balancing graha influences and restoring life momentum.",
    price: 8300,
    durationMinutes: 150,
    significance:
      "Nava Graha Shanti addresses planetary disturbances indicated in traditional astrology through mantra, offerings, and prayer.",
    whoShouldDo:
      "Families advised by astrologers or those experiencing repeated delays and instability despite effort.",
    included: [
      "Graha-specific sankalpa and recitation",
      "Offerings aligned to key graha concerns",
      "Post-ritual guidance for simple follow-up observances",
    ],
    preparation:
      "If you have an astrology note, share it before booking. Otherwise, we conduct a general shanti format.",
    story:
      "People often arrive carrying many questions and leave with one feeling: things can move again.",
    longDescriptionMarkdown: `## Nava Graha Shanti

Ritual format for harmonizing planetary influences in a practical, prayerful way.`,
  },
  {
    slug: "satyanarayana-puja",
    category: "PUJA_KARYA",
    name: "Satyanarayana Puja",
    shortDescription:
      "Devotional Vishnu puja with katha for prosperity, gratitude, and family harmony.",
    price: 3900,
    durationMinutes: 90,
    significance:
      "Satyanarayana Puja is widely observed for blessings in home life, gratitude after fulfilled wishes, and collective family prayer.",
    whoShouldDo:
      "Families seeking a gentle, auspicious puja suitable for regular observance and special occasions.",
    included: [
      "Sankalpa and full puja setup",
      "Satyanarayana katha recitation",
      "Simple participation guidance for all ages",
    ],
    preparation:
      "Keep fruits and simple offerings if requested; we share a checklist in advance.",
    story:
      "This puja feels like a family prayer circle—soft, inclusive, and full of gratitude.",
    longDescriptionMarkdown: `## Satyanarayana Puja

A family-friendly Vishnu puja with story recitation and blessings.`,
  },
  {
    slug: "chandi-homa",
    category: "PUJA_KARYA",
    name: "Chandi Homa",
    shortDescription:
      "Invocatory fire ritual to Devi for courage, protection, and removal of deep-seated negativity.",
    price: 15100,
    durationMinutes: 240,
    significance:
      "Chandi Homa is a profound Devi ritual often undertaken for protection, victory over inner/outer obstacles, and spiritual renewal.",
    whoShouldDo:
      "Families called to Devi worship for major transitions or seeking strong protective and transformative prayer support.",
    included: [
      "Pre-ritual consultation and sankalpa",
      "Chandi recitation segments and homa offerings",
      "Completion rites and guidance",
    ],
    preparation:
      "Advance planning is recommended due to duration and setup requirements.",
    story:
      "The fire is intense yet reassuring—like a reminder that grace can be fierce and compassionate at once.",
    longDescriptionMarkdown: `## Chandi Homa

An extended Devi fire ritual for protection and transformation. Please book in advance.`,
  },
];

export function getPujaBySlug(slug: string): PujaContent | undefined {
  return pujasData.find((p) => p.slug === slug);
}

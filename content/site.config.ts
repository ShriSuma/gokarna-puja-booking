export const siteConfig = {
  siteName: "Gokarna Puja Booking",
  tagline: "Sacred rituals by the shores of Mahabaleshwara",
  ownerName: "Ganapati Maarigoli",
  ownerTitle: "Priest & ritual guide",
  ownerBio:
    "My home is attached to the sacred Subramanya temple in Gokarna. I began performing daily pujas for Lord Subramanya at the age of 6, alongside my Vedic studies. With 23 years devoted to learning and practicing the Vedas, I lead a fully devoted, traditional Vedic lifestyle, bringing deep knowledge and authenticity to every ritual.",
  ownerPhone: "07892676490",
  ownerEmail: "ranganathmarigoli@gmail.com",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "9107892676490",
  address:
    "Subramanya Temple, Gokarna, Karnataka",
  mapLink: "https://share.google/2Jq81LhiIlPtkXw6J",
  mapEmbedUrl:
    process.env.NEXT_PUBLIC_MAP_EMBED_URL ??
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.0!2d74.318!3d14.531!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTTCsDMxJzUxLjYiTiA3NMKwMTknMDQuOCJF!5e0!3m2!1sen!2sin!4v1",
  social: {
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
  },
  testimonials: [
    {
      quote:
        "The pitru tarpana was conducted with such patience and reverence. We felt held throughout.",
      name: "Family from Bengaluru",
    },
    {
      quote:
        "Clear guidance before the day, beautiful chanting, and a calm presence by the sea.",
      name: "R. & family",
    },
    {
      quote:
        "We came for Narayana Bali after a difficult year. The ritual brought closure and lightness.",
      name: "Anonymous",
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;

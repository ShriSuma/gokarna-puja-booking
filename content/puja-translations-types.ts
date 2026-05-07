import type { Language } from "@prisma/client";

export type PujaLangPack = {
  name: string;
  shortDescription: string;
  significance: string;
  whoShouldDo: string;
  preparation: string;
  story: string;
  requirements: string;
  benefits: string;
  longDescriptionMarkdown: string;
  included: string;
};

export type NonEnLang = Exclude<Language, "en">;

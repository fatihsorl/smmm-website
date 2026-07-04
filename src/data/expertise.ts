import {
  getReferenceLogos,
  type ReferenceLogo,
  type ReferenceLogoId,
} from "@/data/references";

export type ExpertiseLogo = ReferenceLogo;

export type ExpertiseSector = {
  slug: string;
  translationKey: "maritime" | "production" | "technology";
  image: string;
  logoIds: ReferenceLogoId[];
  logos: ReferenceLogo[];
};

const maritimeLogoIds: ReferenceLogoId[] = [
  "server-denizcilik",
  "aquantis-maritime",
  "maveks-marina",
  "tr-maritime",
  "borda-ship",
];

const productionLogoIds: ReferenceLogoId[] = [
  "eurofit-piping",
  "eurosteel-metal",
];

const technologyLogoIds: ReferenceLogoId[] = [
  "safir-teknoloji",
  "kablosuz-dünya",
];

export const expertiseSectors: ExpertiseSector[] = [
  {
    slug: "denizcilik",
    translationKey: "maritime",
    image:
      "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1800&q=80",
    logoIds: maritimeLogoIds,
    logos: getReferenceLogos(maritimeLogoIds),
  },
  {
    slug: "uretim",
    translationKey: "production",
    image:
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1800&q=80",
    logoIds: productionLogoIds,
    logos: getReferenceLogos(productionLogoIds),
  },
  {
    slug: "yazilim-teknoloji",
    translationKey: "technology",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1800&q=80",
    logoIds: technologyLogoIds,
    logos: getReferenceLogos(technologyLogoIds),
  },
];

export function getExpertiseBySlug(slug: string) {
  return expertiseSectors.find((sector) => sector.slug === slug);
}

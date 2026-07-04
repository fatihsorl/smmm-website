export type ExpertiseLogo = {
  src: string;
  alt: string;
};

export type ExpertiseSector = {
  slug: string;
  translationKey: "maritime" | "production" | "technology";
  image: string;
  logos: ExpertiseLogo[];
};

export const expertiseSectors: ExpertiseSector[] = [
  {
    slug: "denizcilik",
    translationKey: "maritime",
    image:
      "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1800&q=80",
    logos: [
      { src: "/referans/server-denizcilik.png", alt: "Server Denizcilik" },
      { src: "/referans/aquantis-maritime.webp", alt: "Aquantis Maritime" },
      { src: "/referans/maveks-marina.png", alt: "Maveks Marina" },
      { src: "/referans/tr-maritime.avif", alt: "TR Maritime" },
      { src: "/referans/borda-ship.jpeg", alt: "Borda Ship" },
    ],
  },
  {
    slug: "uretim",
    translationKey: "production",
    image:
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=1800&q=80",
    logos: [
      { src: "/referans/eurofit-piping.png", alt: "Eurofit Piping" },
      { src: "/referans/eurosteel-metal.png", alt: "Eurosteel Metal" },
    ],
  },
  {
    slug: "yazilim-teknoloji",
    translationKey: "technology",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1800&q=80",
    logos: [
      { src: "/referans/safir-teknoloji.png", alt: "Safir Teknoloji" },
      { src: "/referans/kablosuz-dünya.png", alt: "Kablosuz Dünya" },
    ],
  },
];

export function getExpertiseBySlug(slug: string) {
  return expertiseSectors.find((sector) => sector.slug === slug);
}

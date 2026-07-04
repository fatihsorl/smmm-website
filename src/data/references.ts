export type ReferenceLogo = {
  src: string;
  alt: string;
  href?: string;
};

export const REFERENCE_LOGOS = {
  "server-denizcilik": {
    src: "/referans/server-denizcilik.png",
    alt: "Server Denizcilik",
    href: "https://servershipping.com/hakkimizda/",
  },
  "aquantis-maritime": {
    src: "/referans/aquantis-maritime.webp",
    alt: "Aquantis Maritime",
    href: "https://www.aquantismaritime.com/",
  },
  "maveks-marina": {
    src: "/referans/maveks-marina.png",
    alt: "Maveks Marina",
    href: "https://maveksmarine.com/",
  },
  "tr-maritime": {
    src: "/referans/tr-maritime.avif",
    alt: "TR Maritime",
    href: "https://www.trmaritime.com/",
  },
  "borda-ship": {
    src: "/referans/borda-ship.jpeg",
    alt: "Borda Ship",
  },
  "eurofit-piping": {
    src: "/referans/eurofit-piping.png",
    alt: "Eurofit Piping",
    href: "https://www.eurofitpiping.com/",
  },
  "eurosteel-metal": {
    src: "/referans/eurosteel-metal.png",
    alt: "Eurosteel Metal",
    href: "http://eurosteelmetal.com/",
  },
  "safir-teknoloji": {
    src: "/referans/safir-teknoloji.png",
    alt: "Safir Teknoloji",
    href: "https://www.safirteknoloji.com/",
  },
  "kablosuz-dünya": {
    src: "/referans/kablosuz-dünya.png",
    alt: "Kablosuz Dünya",
    href: "https://www.kablosuzdunya.com/",
  },
  remax: {
    src: "/referans/remax.jpg",
    alt: "Remax",
  },
  "mg-moto": {
    src: "/referans/mg-moto.jpg",
    alt: "MG Moto",
  },
  cicocebali: {
    src: "/referans/cicocebali.jpg",
    alt: "Cicocebali",
    href: "https://www.instagram.com/cicocebali/",
  },
  "fatih-otomotiv": {
    src: "/referans/fatih-otomotiv.png",
    alt: "Fatih Otomotiv",
    href: "https://fatihotomotiv57.com/",
  },
} as const satisfies Record<string, ReferenceLogo>;

export type ReferenceLogoId = keyof typeof REFERENCE_LOGOS;

export function getReferenceLogos(ids: ReferenceLogoId[]): ReferenceLogo[] {
  return ids.map((id) => REFERENCE_LOGOS[id]);
}

export const HERO_REFERENCE_LOGO_IDS: ReferenceLogoId[] = [
  "eurosteel-metal",
  "remax",
  "aquantis-maritime",
  "mg-moto",
  "safir-teknoloji",
  "kablosuz-dünya",
  "cicocebali",
  "maveks-marina",
  "tr-maritime",
  "eurofit-piping",
  "server-denizcilik",
  "borda-ship",
  "fatih-otomotiv",
];

export const heroReferenceLogos = getReferenceLogos(HERO_REFERENCE_LOGO_IDS);

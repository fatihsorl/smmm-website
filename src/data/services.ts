export type Service = {
  slug: string;
  image: string;
};

export const services: Service[] = [
  {
    slug: "sirket-acilisleri",
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=80",
  },
  {
    slug: "gib-isbirlikleri",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=80",
  },
  {
    slug: "raporlama-hizmetleri",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1800&q=80",
  },
  {
    slug: "denetim-hizmetleri",
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1800&q=80",
  },
  {
    slug: "muhasebe-hizmetleri",
    image:
      "https://images.unsplash.com/photo-1554224155-1696413565d3?auto=format&fit=crop&w=1800&q=80",
  },
  {
    slug: "bordrolama-hizmetleri",
    image:
      "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=1800&q=80",
  },
  {
    slug: "tesvik-takip-hizmetleri",
    image:
      "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1800&q=80",
  },
  {
    slug: "vergi-danismanligi",
    image:
      "https://images.unsplash.com/photo-1586486855514-8c633cc6fd38?auto=format&fit=crop&w=1800&q=80",
  },
  {
    slug: "finansal-danismanlik",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1800&q=80",
  },
];

export function getServiceBySlug(slug: string) {
  return services.find((service) => service.slug === slug);
}

import type { Locale } from "@/i18n/config";
import { enServiceContent } from "./en";
import { esServiceContent } from "./es";
import { trServiceContent } from "./tr";
import type { ServiceContent } from "./types";

export const SERVICE_SLUGS = [
  "sirket-acilisleri",
  "gib-isbirlikleri",
  "raporlama-hizmetleri",
  "denetim-hizmetleri",
  "muhasebe-hizmetleri",
  "bordrolama-hizmetleri",
  "tesvik-takip-hizmetleri",
  "vergi-danismanligi",
  "finansal-danismanlik",
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

const contentByLocale: Record<Locale, Record<string, ServiceContent>> = {
  tr: trServiceContent,
  en: enServiceContent,
  es: esServiceContent,
};

export function getServiceContent(
  locale: string,
  slug: string,
): ServiceContent | undefined {
  const localeContent =
    contentByLocale[locale as Locale] ?? contentByLocale.tr;
  return localeContent[slug];
}

export function getAllServiceSlugs(): ServiceSlug[] {
  return [...SERVICE_SLUGS];
}

export type { ServiceContent } from "./types";

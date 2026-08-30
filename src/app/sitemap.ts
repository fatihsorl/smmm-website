import type { MetadataRoute } from "next";
import { expertiseSectors } from "@/data/expertise";
import { getAllServiceSlugs } from "@/data/service-content";
import { locales } from "@/i18n/config";
import { localeUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: localeUrl(locale),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    });

    entries.push({
      url: localeUrl(locale, "/iletisim"),
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });

    for (const slug of getAllServiceSlugs()) {
      entries.push({
        url: localeUrl(locale, `/hizmetler/${slug}`),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.9,
      });
    }

    for (const sector of expertiseSectors) {
      entries.push({
        url: localeUrl(locale, `/uzmanlik/${sector.slug}`),
        lastModified,
        changeFrequency: "monthly",
        priority: 0.9,
      });
    }
  }

  return entries;
}

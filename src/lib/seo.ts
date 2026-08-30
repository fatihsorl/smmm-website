import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { SITE_URL } from "./site";

const OG_LOCALE: Record<Locale, string> = {
  tr: "tr_TR",
  en: "en_US",
  es: "es_ES",
};

export function absoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}

export function localeUrl(locale: string, path = "") {
  if (!path || path === "/") {
    return absoluteUrl(`/${locale}`);
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return absoluteUrl(`/${locale}${normalizedPath}`);
}

export function buildLanguageAlternates(path = "") {
  const languages: Record<string, string> = {};

  for (const locale of locales) {
    languages[locale] = localeUrl(locale, path);
  }

  languages["x-default"] = localeUrl(defaultLocale, path);

  return languages;
}

type PageMetadataOptions = {
  locale: string;
  path?: string;
  title: string;
  description: string;
  siteName?: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
};

export function buildPageMetadata({
  locale,
  path = "",
  title,
  description,
  siteName = "Soral Danışmanlık",
  image,
}: PageMetadataOptions): Metadata {
  const canonical = localeUrl(locale, path);
  const resolvedLocale = locale as Locale;
  const ogImage = image ?? {
    url: absoluteUrl("/favicon/android-icon-192x192.png"),
    width: 192,
    height: 192,
    alt: title,
  };
  const imageUrl = ogImage.url.startsWith("http")
    ? ogImage.url
    : absoluteUrl(ogImage.url);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: buildLanguageAlternates(path),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      locale: OG_LOCALE[resolvedLocale] ?? OG_LOCALE.tr,
      alternateLocale: locales
        .filter((item) => item !== resolvedLocale)
        .map((item) => OG_LOCALE[item]),
      type: "website",
      images: [
        {
          url: imageUrl,
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImage.alt ?? title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

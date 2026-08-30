import {
  OFFICE_ADDRESS,
  OFFICE_COORDINATES,
  OFFICE_MAP_LABEL,
} from "@/data/contact";
import { SITE_URL } from "@/lib/site";

type LocalBusinessJsonLdProps = {
  locale: string;
};

export default function LocalBusinessJsonLd({
  locale,
}: LocalBusinessJsonLdProps) {
  const businessName =
    locale === "tr" ? "Soral Danışmanlık" : "Soral Consulting";

  const schema = {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    name: businessName,
    url: `${SITE_URL}/${locale}`,
    email: "info@soraldanismanlik.com",
    telephone: "+90-533-031-82-28",
    image: `${SITE_URL}/favicon/android-icon-192x192.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: OFFICE_ADDRESS,
      addressLocality: "Maltepe",
      addressRegion: "İstanbul",
      addressCountry: "TR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: OFFICE_COORDINATES.lat,
      longitude: OFFICE_COORDINATES.lng,
    },
    areaServed: {
      "@type": "City",
      name: "İstanbul",
    },
    sameAs: ["https://www.instagram.com/soraldanismanlik/"],
    description: OFFICE_MAP_LABEL,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

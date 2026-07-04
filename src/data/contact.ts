export const OFFICE_ADDRESS =
  "Bağlarbaşı Mah. Bağdat Cad. Ercan İş Merkezi No:350/45 Maltepe/İstanbul";

export const OFFICE_MAP_LABEL = "Soral Danışmanlık";

export const OFFICE_COORDINATES = {
  lat: 40.92441,
  lng: 29.131583,
} as const;

export const OFFICE_PHONE = "905330318228";

export const WHATSAPP_URL = `https://wa.me/${OFFICE_PHONE}`;

export function getOfficeStaticMapUrl() {
  const { lat, lng } = OFFICE_COORDINATES;

  const params = new URLSearchParams({
    center: `${lat},${lng}`,
    zoom: "17",
    size: "1280x640",
    markers: `${lat},${lng},red`,
  });

  return `https://staticmap.openstreetmap.de/staticmap.php?${params.toString()}`;
}

export function getOfficeMapEmbedUrl(locale = "tr") {
  const { lat, lng } = OFFICE_COORDINATES;

  const params = new URLSearchParams({
    q: `${lat},${lng}`,
    hl: locale,
    z: "17",
    output: "embed",
  });

  return `https://maps.google.com/maps?${params.toString()}`;
}

export function getOfficeMapLink() {
  const { lat, lng } = OFFICE_COORDINATES;

  const params = new URLSearchParams({
    api: "1",
    query: `${lat},${lng}`,
  });

  return `https://www.google.com/maps/search/?${params.toString()}`;
}

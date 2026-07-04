export const OFFICE_ADDRESS =
  "Bağlarbaşı Mah. Bağdat Cad. Ercan İş Merkezi No:350/45 Maltepe/İstanbul";

export const OFFICE_MAP_QUERY =
  "Ercan İş Merkezi, Bağdat Cad No:350, Maltepe, İstanbul";

export function getOfficeMapEmbedUrl(locale = "tr") {
  const params = new URLSearchParams({
    q: OFFICE_MAP_QUERY,
    hl: locale,
    z: "16",
    output: "embed",
  });

  return `https://maps.google.com/maps?${params.toString()}`;
}

export function getOfficeMapLink() {
  const params = new URLSearchParams({
    q: OFFICE_MAP_QUERY,
  });

  return `https://www.google.com/maps?${params.toString()}`;
}

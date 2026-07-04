import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import ContactForm from "@/components/contact/ContactForm";
import OfficeMap from "@/components/contact/OfficeMap";

export const metadata: Metadata = {
  title: "İletişim | Soral Danışmanlık",
  description:
    "Soral Danışmanlık iletişim sayfası. Mali müşavirlik, muhasebe, vergi danışmanlığı ve finansal danışmanlık hizmetleri için bizimle iletişime geçin.",
};

const contactItems = [
  {
    title: "E-posta",
    value: "info@soraldanismanlik.com",
    href: "mailto:info@soraldanismanlik.com",
    description: "Form talepleri ve danışmanlık görüşmeleri için bize yazın.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    ),
  },
  {
    title: "Telefon",
    value: "+90 (533) 031 82 28",
    href: "tel:05330318228",
    description:
      "Hızlı bilgi almak için mesai saatleri içinde arayabilirsiniz.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.95.68l1.5 4.5a1 1 0 01-.5 1.2l-2.26 1.13a11.04 11.04 0 005.52 5.52l1.13-2.26a1 1 0 011.2-.5l4.5 1.5a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.72 21 3 14.28 3 6V5z"
      />
    ),
  },
  {
    title: "Adres",
    value:
      "Bağlarbaşı Mah. Bağdat Cad. Ercan İş Merkezi No:350/45 Maltepe/İstanbul",
    description: "Ofisimize gelmeden önce randevu oluşturmanızı öneririz.",
    icon: (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.66 16.66L13.41 20.9a2 2 0 01-2.82 0l-4.25-4.24a8 8 0 1111.32 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </>
    ),
  },
];

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tContact = await getTranslations("contact");

  return (
    <article className="bg-white">
      <section className="relative min-h-[420px] overflow-hidden pt-28 md:pt-36">
        <div
          className="absolute -inset-2 scale-105 bg-cover bg-center blur-[2px]"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1800&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.76)_0%,rgba(2,6,23,0.58)_46%,rgba(2,6,23,0.28)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.16)_0%,rgba(2,6,23,0.72)_100%)]" />

        <div className="container relative z-10 flex min-h-[420px] items-end pb-12 text-white">
          <div className="max-w-3xl">
            <Link
              href={`/${locale}`}
              className="group mb-5 inline-flex items-center gap-2 text-sm font-bold text-sky-200 drop-shadow transition-all hover:gap-3 hover:text-white"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.4}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              <span className="underline decoration-sky-200/60 underline-offset-4 group-hover:decoration-white">
                Anasayfaya Dön
              </span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight drop-shadow-[0_3px_18px_rgba(0,0,0,0.65)] md:text-3xl">
              Finansal süreçleriniz için bizimle iletişime geçin
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f4f9ff_100%)] py-12 md:py-16">
        <div className="container">
          <div className="grid gap-10 lg:grid-cols-[0.42fr_0.58fr]">
            <div className="space-y-8">
              <div className="space-y-5">
                {contactItems.map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-4 border-b border-slate-200 pb-5"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors">
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        {item.icon}
                      </svg>
                    </span>
                    <div>
                      <h3 className="mb-1 text-sm font-bold text-slate-950">
                        {item.title}
                      </h3>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm leading-relaxed text-slate-700 transition-colors hover:text-primary"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm leading-relaxed text-slate-700">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm md:p-8">
              <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-950">
                İletişim Formu
              </h2>
              <p className="mb-6 text-sm leading-relaxed text-slate-600">
                Formu doldurduğunuzda mesajınız info@soraldanismanlik.com
                adresine iletilir.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <OfficeMap
        locale={locale}
        title={tContact("mapTitle")}
        openInMapsLabel={tContact("openInMaps")}
      />
    </article>
  );
}

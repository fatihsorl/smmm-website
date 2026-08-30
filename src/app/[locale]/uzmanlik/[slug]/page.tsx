import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { locales } from "@/i18n/config";
import ReferenceLogoItem from "@/components/ReferenceLogoItem";
import {
  expertiseSectors,
  getExpertiseBySlug,
  type ExpertiseSector,
} from "@/data/expertise";
import { detailPageHref, isFromHomeSection } from "@/lib/navigation";
import { buildPageMetadata } from "@/lib/seo";

type ExpertiseDetailPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
  searchParams: Promise<{
    from?: string | string[];
  }>;
};

function getLogosLabelKey(sector: ExpertiseSector) {
  return `${sector.translationKey}LogosLabel` as
    | "maritimeLogosLabel"
    | "productionLogosLabel"
    | "technologyLogosLabel";
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    expertiseSectors.map((sector) => ({
      locale,
      slug: sector.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: ExpertiseDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const sector = getExpertiseBySlug(slug);

  if (!sector) {
    return {
      title: "Uzmanlık Alanı Bulunamadı | Soral Danışmanlık",
    };
  }

  const t = await getTranslations({
    locale,
    namespace: `expertise.${sector.translationKey}`,
  });
  const tSeo = await getTranslations({ locale, namespace: "seo" });

  return buildPageMetadata({
    locale,
    path: `/uzmanlik/${sector.slug}`,
    title: `${t("seoTitle")} | ${tSeo("siteName")}`,
    description: t("seoDescription"),
    siteName: tSeo("siteName"),
    image: {
      url: sector.image,
      width: 1200,
      height: 630,
      alt: t("homeTitle"),
    },
  });
}

export default async function ExpertiseDetailPage({
  params,
  searchParams,
}: ExpertiseDetailPageProps) {
  const { locale, slug } = await params;
  const { from } = await searchParams;
  const fromHome = isFromHomeSection(from);
  const sector = getExpertiseBySlug(slug);

  if (!sector) {
    notFound();
  }

  const tExpertise = await getTranslations({ locale, namespace: "expertise" });
  const tNav = await getTranslations({ locale, namespace: "navigation" });
  const t = await getTranslations({
    locale,
    namespace: `expertise.${sector.translationKey}`,
  });
  const services = t.raw("services") as string[];
  const hasApproach = sector.translationKey === "maritime";
  const hasQuote = sector.translationKey === "maritime";

  return (
    <article className="bg-white">
      <section className="relative overflow-hidden pt-8">
        <div
          className="absolute -inset-2 scale-105 bg-cover bg-center blur-[2px]"
          style={{ backgroundImage: `url(${sector.image})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.74)_0%,rgba(2,6,23,0.58)_44%,rgba(2,6,23,0.3)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.18)_0%,rgba(2,6,23,0.72)_100%)]" />
        <div className="container relative z-10 flex min-h-[220px] items-end pb-6 text-white md:min-h-[260px] md:pb-8">
          <div className="max-w-3xl">
            <Link
              href={fromHome ? `/${locale}/#uzmanlik` : `/${locale}`}
              className="group mb-3 inline-flex items-center gap-2 text-sm font-bold text-sky-200 drop-shadow transition-all hover:gap-3 hover:text-white"
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
              <span className="underline decoration-sky-200/60 underline-offset-4 group-hover:decoration-white text-[12px] md:text-sm">
                {fromHome ? tExpertise("backToExpertise") : tNav("backToHome")}
              </span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight drop-shadow-[0_3px_18px_rgba(0,0,0,0.65)] md:text-3xl">
              {t("homeTitle")}
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f4f9ff_100%)] py-12 md:py-16">
        <div className="container">
          <details className="group mb-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-primary [&::-webkit-details-marker]:hidden">
              <span>{tExpertise(`${sector.translationKey}.navTitle`)}</span>
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xl leading-none text-primary transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <nav
              aria-label={tExpertise("sidebarNavLabel")}
              className="mt-4 border-t border-slate-200 pt-4"
            >
              <ul className="space-y-3.5">
                {expertiseSectors.map((item) => {
                  const isActive = item.slug === sector.slug;

                  return (
                    <li key={item.slug}>
                      <Link
                        href={detailPageHref(
                          `/${locale}/uzmanlik/${item.slug}`,
                          fromHome,
                        )}
                        className={`group/link flex items-center justify-between gap-3 text-sm leading-relaxed transition-colors hover:text-primary ${
                          isActive
                            ? "font-bold text-primary"
                            : "text-slate-950"
                        }`}
                      >
                        <span>
                          {tExpertise(`${item.translationKey}.navTitle`)}
                        </span>
                        {!isActive && (
                          <svg
                            aria-hidden
                            className="h-3.5 w-3.5 shrink-0 text-primary transition-transform group-hover/link:translate-x-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.4}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                            />
                          </svg>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </details>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(220px,0.28fr)]">
            <div className=" space-y-8">
              <section>
                <h2 className="mb-5 text-xl font-bold leading-snug text-slate-950 md:text-2xl">
                  {t("contentTitle")}
                </h2>

                <div
                  aria-label={tExpertise(getLogosLabelKey(sector))}
                  className="expertise-logos-static mb-6 flex flex-wrap items-center gap-4 md:mb-8"
                >
                  {sector.logos.map((logo) => (
                    <div
                      key={logo.src}
                      className="flex h-14 w-32 items-center justify-center rounded-xl border border-slate-200/80 bg-white px-3 py-2.5 md:h-16 md:w-36"
                    >
                      <ReferenceLogoItem
                        logo={logo}
                        wrapperClassName="flex h-full w-full items-center justify-center"
                      />
                    </div>
                  ))}
                </div>

                <p className="mb-4 text-sm leading-7 text-slate-600 md:text-base">
                  {t("intro1")}
                </p>
                <p className="text-sm leading-7 text-slate-600 md:text-base">
                  {t("intro2")}
                </p>
              </section>

              <section className="border-t border-slate-200 pt-8">
                <p className="mb-3 text-sm font-bold text-slate-950 md:text-base">
                  {t("servicesIntro")}
                </p>
                <ul className="grid gap-2.5 md:grid-cols-2">
                  {services.map((service) => (
                    <li
                      key={service}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600 md:text-base"
                    >
                      <span
                        aria-hidden
                        className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                      />
                      {service}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-4 border-t border-slate-200 pt-8">
                {hasApproach ? (
                  <p className="text-sm leading-7 text-slate-600 md:text-base">
                    {t("approach")}
                  </p>
                ) : null}

                <p className="text-sm leading-7 text-slate-600 md:text-base">
                  {t("experience")}
                </p>

                {sector.translationKey !== "maritime" ? (
                  <p className="text-sm leading-7 text-slate-600 md:text-base">
                    {t("goal")}
                  </p>
                ) : null}

                {hasQuote ? (
                  <blockquote className="border-l-4 border-primary bg-primary/5 px-5 py-4 text-sm font-semibold italic leading-relaxed text-primary md:text-base">
                    &ldquo;{t("quote")}&rdquo;
                  </blockquote>
                ) : null}
              </section>
            </div>

            <aside className="hidden lg:sticky lg:top-40 lg:block lg:self-start">
              <nav
                aria-label={tExpertise("sidebarNavLabel")}
                className="border-l border-slate-200 pl-5"
              >
                <ul className="space-y-4">
                  {expertiseSectors.map((item) => {
                    const isActive = item.slug === sector.slug;

                    return (
                      <li key={item.slug}>
                        <Link
                          href={detailPageHref(
                            `/${locale}/uzmanlik/${item.slug}`,
                            fromHome,
                          )}
                          className={`group flex max-w-48 items-center justify-between gap-3 text-sm leading-relaxed transition-all hover:text-primary hover:underline ${
                            isActive
                              ? "font-bold hover:no-underline!"
                              : "text-slate-950"
                          }`}
                        >
                          <span>
                            {tExpertise(`${item.translationKey}.navTitle`)}
                          </span>
                          {!isActive && (
                            <svg
                              aria-hidden
                              className="h-3.5 w-3.5 shrink-0 text-primary transition-transform group-hover:translate-x-1"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2.4}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                              />
                            </svg>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>
          </div>
        </div>
      </section>
    </article>
  );
}

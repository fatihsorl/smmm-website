import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { locales } from "@/i18n/config";
import {
  getAllServiceSlugs,
  getServiceContent,
} from "@/data/service-content";
import { getServiceBySlug, services } from "@/data/services";
import { detailPageHref, isFromHomeSection } from "@/lib/navigation";
import { buildPageMetadata } from "@/lib/seo";

type ServiceDetailPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
  searchParams: Promise<{
    from?: string | string[];
  }>;
};

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getAllServiceSlugs().map((slug) => ({
      locale,
      slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getServiceBySlug(slug);
  const content = getServiceContent(locale, slug);

  const tSeo = await getTranslations({ locale, namespace: "seo" });

  if (!service || !content) {
    return {
      title: "Hizmet Bulunamadı | Soral Danışmanlık",
    };
  }

  return buildPageMetadata({
    locale,
    path: `/hizmetler/${service.slug}`,
    title: `${content.seoTitle} | ${tSeo("siteName")}`,
    description: content.seoDescription,
    siteName: tSeo("siteName"),
    image: {
      url: service.image,
      width: 1200,
      height: 630,
      alt: content.title,
    },
  });
}

export default async function ServiceDetailPage({
  params,
  searchParams,
}: ServiceDetailPageProps) {
  const { locale, slug } = await params;
  const { from } = await searchParams;
  const fromHome = isFromHomeSection(from);
  const service = getServiceBySlug(slug);
  const content = getServiceContent(locale, slug);

  if (!service || !content) {
    notFound();
  }

  const tCatalog = await getTranslations({ locale, namespace: "serviceCatalog" });
  const tNav = await getTranslations({ locale, namespace: "navigation" });

  return (
    <article className="bg-white">
      <section className="relative overflow-hidden pt-8">
        <div
          className="absolute -inset-2 scale-105 bg-cover bg-center blur-[2px]"
          style={{ backgroundImage: `url(${service.image})` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,6,23,0.74)_0%,rgba(2,6,23,0.58)_44%,rgba(2,6,23,0.3)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.18)_0%,rgba(2,6,23,0.72)_100%)]" />
        <div className="container relative z-10 flex min-h-[220px] items-end pb-6 text-white md:min-h-[260px] md:pb-8">
          <div className="max-w-3xl">
            <Link
              href={fromHome ? `/${locale}/#hizmetler` : `/${locale}`}
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
                {fromHome ? tNav("backToServices") : tNav("backToHome")}
              </span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight drop-shadow-[0_3px_18px_rgba(0,0,0,0.65)] md:text-3xl">
              {content.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f4f9ff_100%)] py-12 md:py-16">
        <div className="container">
          <details className="group mb-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:hidden">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-primary [&::-webkit-details-marker]:hidden">
              <span>{content.title}</span>
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xl leading-none text-primary transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <nav
              aria-label={tCatalog("mobileNavLabel")}
              className="mt-4 border-t border-slate-200 pt-4"
            >
              <ul className="space-y-3.5">
                {services.map((serviceItem) => {
                  const isActive = serviceItem.slug === service.slug;
                  const itemContent = getServiceContent(
                    locale,
                    serviceItem.slug,
                  );

                  return (
                    <li key={serviceItem.slug}>
                      <Link
                        href={detailPageHref(
                          `/${locale}/hizmetler/${serviceItem.slug}`,
                          fromHome,
                        )}
                        className={`group/link flex items-center justify-between gap-3 text-sm leading-relaxed transition-colors hover:text-primary ${
                          isActive
                            ? "font-bold text-primary"
                            : "text-slate-950"
                        }`}
                      >
                        <span>{itemContent?.title ?? serviceItem.slug}</span>
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
            <div className="max-w-3xl space-y-10">
              <section>
                <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-950">
                  {tCatalog("whatIsTitle", { title: content.title })}
                </h2>
                <p className="text-sm leading-7 text-slate-600 md:text-base">
                  {content.intro}
                </p>
              </section>

              {content.sections.map((section) => (
                <section
                  key={section.title}
                  className="border-t border-slate-200 pt-8 first:border-t-0 first:pt-0"
                >
                  <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-950">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="text-sm leading-7 text-slate-600 md:text-base"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <aside className="hidden lg:sticky lg:top-40 lg:block lg:self-start">
              <nav
                aria-label={tCatalog("sidebarNavLabel")}
                className="border-l border-slate-200 pl-5"
              >
                <ul className="space-y-4">
                  {services.map((serviceItem) => {
                    const isActive = serviceItem.slug === service.slug;
                    const itemContent = getServiceContent(
                      locale,
                      serviceItem.slug,
                    );

                    return (
                      <li key={serviceItem.slug}>
                        <Link
                          href={detailPageHref(
                            `/${locale}/hizmetler/${serviceItem.slug}`,
                            fromHome,
                          )}
                          className={`group text-sm flex items-center gap-3 leading-relaxed transition-all hover:text-primary hover:underline max-w-48 justify-between ${
                            isActive
                              ? "font-bold hover:no-underline!"
                              : "text-slate-950"
                          }`}
                        >
                          <span>
                            {itemContent?.title ?? serviceItem.slug}
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

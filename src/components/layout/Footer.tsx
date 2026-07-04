"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { services } from "@/data/services";
import { expertiseSectors } from "@/data/expertise";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("footer");
  const tNav = useTranslations("navigation");
  const tExpertise = useTranslations("expertise");
  const locale = useLocale();

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
  ) => {
    const element = document.getElementById(targetId);

    if (!element) {
      return;
    }

    e.preventDefault();
    const header = document.querySelector("header");
    const headerHeight = header
      ? header.offsetHeight
      : window.innerWidth >= 768
        ? 140
        : 120;
    const headerOffset = headerHeight + 20;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: window.innerWidth >= 768 ? "smooth" : "instant",
    });
  };

  return (
    <footer className="w-full bg-slate-950 text-white transform-gpu">
      <div className="w-full px-5 py-12 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.9fr_1.1fr_1.25fr]">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-11 w-11 overflow-hidden rounded-xl bg-white ring-1 ring-white/15">
                <Image
                  src="/logo.png"
                  alt="Soral Danışmanlık SMMM Logo"
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </span>
              <h3 className="text-base font-bold text-white">
                {t("companyName")}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-white/60 mb-5">
              {t("description")}
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/soraldanismanlik/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/8 text-white ring-1 ring-white/10 transition-colors hover:bg-primary hover:text-white"
                aria-label="Soral Danışmanlık Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-6 md:contents">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/45 mb-4">
                {t("menu")}
              </h3>
              <ul className="flex flex-col gap-3 text-sm">
                <li>
                  <Link
                    href={`/${locale}`}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/#hizmetler`}
                    onClick={(e) => handleSmoothScroll(e, "hizmetler")}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {tNav("services")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/#uzmanlik`}
                    onClick={(e) => handleSmoothScroll(e, "uzmanlik")}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {tNav("expertise")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/iletisim`}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {tNav("contact")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/45 mb-4">
                {tExpertise("title")}
              </h3>
              <ul className="flex flex-col gap-3 text-sm">
                {expertiseSectors.map((sector) => (
                  <li key={sector.slug}>
                    <Link
                      href={`/${locale}/uzmanlik/${sector.slug}`}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {tExpertise(`${sector.translationKey}.navTitle`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/45 mb-4">
                {tNav("services")}
              </h3>
              <ul className="flex flex-col gap-3 text-sm">
                {services.map((service) => (
                  <li key={service.slug}>
                    <Link
                      href={`/${locale}/hizmetler/${service.slug}`}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/45 mb-4">
              {t("contact")}
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-white/65">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-primary shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:info@soraldanismanlik.com"
                  className="hover:text-white transition-colors"
                >
                  info@soraldanismanlik.com
                </a>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-primary shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:05330318228"
                  className="hover:text-white transition-colors"
                >
                  +90 (533) 031 82 28
                </a>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-3 text-primary flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="leading-relaxed">
                  {t("address")}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 text-center text-sm text-white/45">
          <p>
            &copy; {currentYear} {t("companyName")} {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

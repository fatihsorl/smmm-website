"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const t = useTranslations("navigation");
  const locale = useLocale();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    targetId: string,
    closeMenu: boolean = false,
  ) => {
    const scrollToElement = () => {
      const element = document.getElementById(targetId);
      if (!element) {
        return false;
      }

      // Header yüksekliğini dinamik olarak al
      const header = document.querySelector("header");
      const headerHeight = header
        ? header.offsetHeight
        : window.innerWidth >= 768
          ? 140
          : 120;
      const headerOffset = headerHeight + 20; // Ekstra 20px boşluk

      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth",
      });

      return true;
    };

    if (!scrollToElement()) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (closeMenu) {
      // Menüyü scroll başladıktan sonra kapat (kısa gecikme ile)
      setTimeout(() => {
        setIsMenuOpen(false);
      }, 200);
    } else {
      scrollToElement();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-[100] px-0 md:top-14 md:px-6">
      <div className="mx-auto w-full md:max-w-[1280px]">
        <div
          className={`relative z-[101] flex items-center justify-between px-8 py-6 transition-all duration-300 md:rounded-2xl md:px-5 md:py-4 ${
            isScrolled || isMenuOpen
              ? "bg-slate-950/30 shadow-2xl shadow-black/10 backdrop-blur-xl"
              : "bg-transparent md:bg-slate-950/12 md:backdrop-blur-sm"
          }`}
        >
          <Link
            href={`/${locale}`}
            onClick={(e) => {
              const hero = document.getElementById("hero");
              if (!hero) return;

              e.preventDefault();
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
            className="flex items-center gap-3 select-none"
          >
            <span className="w-10 h-10 md:w-11 md:h-11 rounded-xl overflow-hidden bg-white ring-1 ring-white/20 shadow-[0_18px_35px_-22px_rgba(255,255,255,0.7)]">
              <Image
                src="/logo.png"
                alt="Soral Danışmanlık SMMM Logo"
                width={48}
                height={48}
                priority
                className="w-full h-full object-cover"
              />
            </span>
            <span className="text-base font-bold tracking-tight text-white">
              Soral Danışmanlık
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href={`/${locale}/#hizmetler`}
              onClick={(e) => handleSmoothScroll(e, "hizmetler", false)}
              className="text-xs font-bold uppercase tracking-[0.18em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)] hover:text-sky-100 transition-colors"
            >
              {t("services")}
            </Link>
            <Link
              href={`/${locale}/#neden-biz`}
              onClick={(e) => handleSmoothScroll(e, "neden-biz", false)}
              className="text-xs font-bold uppercase tracking-[0.18em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)] hover:text-sky-100 transition-colors"
            >
              {t("whyUs")}
            </Link>
            <Link
              href={`/${locale}/iletisim`}
              className="text-xs font-bold uppercase tracking-[0.18em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)] hover:text-sky-100 transition-colors"
            >
              {t("contact")}
            </Link>
            <LanguageSwitcher />
          </nav>

          {/* Mobile: Language Switcher + Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
              className="rounded-full border border-white/20 bg-white/10 p-2 text-white shadow-sm focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-0 z-[90] bg-white md:hidden"
            >
              <nav className="flex h-full flex-col gap-8 px-8 pt-28">
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12, duration: 0.28 }}
                >
                  <Link
                    href={`/${locale}/#hizmetler`}
                    onClick={(e) => handleSmoothScroll(e, "hizmetler", true)}
                    className="flex w-full items-center justify-between border-b border-slate-200 pb-3 text-xl text-slate-950 transition-colors hover:text-primary"
                  >
                    {t("services")}
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18, duration: 0.28 }}
                >
                  <Link
                    href={`/${locale}/#neden-biz`}
                    onClick={(e) => handleSmoothScroll(e, "neden-biz", true)}
                    className="flex w-full items-center justify-between border-b border-slate-200 pb-3 text-xl text-slate-950 transition-colors hover:text-primary"
                  >
                    {t("whyUs")}
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.24, duration: 0.28 }}
                >
                  <Link
                    href={`/${locale}/iletisim`}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex w-full items-center justify-between border-b border-slate-200 pb-3 text-xl text-slate-950 transition-colors hover:text-primary"
                  >
                    {t("contact")}
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;

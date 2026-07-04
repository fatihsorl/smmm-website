"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { services } from "@/data/services";
import { expertiseSectors } from "@/data/expertise";
import LanguageSwitcher from "./LanguageSwitcher";

type OpenDropdown = "services" | "expertise" | null;
type MobileSection = "services" | "expertise" | null;

const ChevronIcon = ({ className = "" }: { className?: string }) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.4}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
);

function DesktopDropdownMenu({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="absolute left-0 top-[calc(100%+0.75rem)] z-[110] min-w-[280px] origin-top overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xl"
        >
          <div className="divide-y divide-slate-200">{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function DesktopDropdownItem({
  href,
  delay,
  onClick,
  children,
}: {
  href: string;
  delay: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.18, ease: "easeOut" }}
    >
      <Link
        href={href}
        onClick={onClick}
        className="block px-4 py-3 text-sm leading-snug text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary"
      >
        {children}
      </Link>
    </motion.div>
  );
}

function MobileAccordion({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <ul className="divide-y divide-slate-200 border-b border-slate-200 pl-1">
            {children}
          </ul>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const [mobileSection, setMobileSection] = useState<MobileSection>(null);
  const t = useTranslations("navigation");
  const tExpertise = useTranslations("expertise");
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

  useEffect(() => {
    if (!openDropdown) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest("[data-nav-dropdown]")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdown]);

  const toggleMenu = () => {
    setIsMenuOpen((current) => !current);
    setMobileSection(null);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setMobileSection(null);
  };

  const toggleDropdown = (menu: OpenDropdown) => {
    setOpenDropdown((current) => (current === menu ? null : menu));
  };

  const toggleMobileSection = (section: MobileSection) => {
    setMobileSection((current) => (current === section ? null : section));
  };

  const navTriggerClass =
    "inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.65)] transition-colors hover:text-sky-100";

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-[100] px-0 md:top-4 md:px-6">
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
              closeMenu();
              window.scrollTo({
                top: 0,
                behavior: window.innerWidth >= 768 ? "smooth" : "instant",
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
          <nav className="hidden md:flex items-center gap-5">
            <div className="relative" data-nav-dropdown>
              <button
                type="button"
                onClick={() => toggleDropdown("services")}
                className={navTriggerClass}
                aria-expanded={openDropdown === "services"}
              >
                {t("services")}
                <ChevronIcon
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    openDropdown === "services" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <DesktopDropdownMenu isOpen={openDropdown === "services"}>
                {services.map((service, index) => (
                  <DesktopDropdownItem
                    key={service.slug}
                    href={`/${locale}/hizmetler/${service.slug}`}
                    delay={index * 0.03}
                    onClick={() => setOpenDropdown(null)}
                  >
                    {service.title}
                  </DesktopDropdownItem>
                ))}
              </DesktopDropdownMenu>
            </div>

            <div className="relative" data-nav-dropdown>
              <button
                type="button"
                onClick={() => toggleDropdown("expertise")}
                className={navTriggerClass}
                aria-expanded={openDropdown === "expertise"}
              >
                {t("expertise")}
                <ChevronIcon
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    openDropdown === "expertise" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <DesktopDropdownMenu isOpen={openDropdown === "expertise"}>
                {expertiseSectors.map((sector, index) => (
                  <DesktopDropdownItem
                    key={sector.slug}
                    href={`/${locale}/uzmanlik/${sector.slug}`}
                    delay={index * 0.04}
                    onClick={() => setOpenDropdown(null)}
                  >
                    {tExpertise(`${sector.translationKey}.navTitle`)}
                  </DesktopDropdownItem>
                ))}
              </DesktopDropdownMenu>
            </div>

            <Link
              href={`/${locale}/iletisim`}
              className={navTriggerClass}
              onClick={() => setOpenDropdown(null)}
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
              aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
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
              className="fixed inset-0 z-[90] overflow-y-auto bg-white md:hidden"
            >
              <nav className="flex min-h-full flex-col gap-4 px-8 pb-10 pt-28">
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12, duration: 0.28 }}
                >
                  <button
                    type="button"
                    onClick={() => toggleMobileSection("services")}
                    className="flex w-full items-center justify-between border-b border-slate-200 pb-3 text-xl text-slate-950 transition-colors hover:text-primary"
                    aria-expanded={mobileSection === "services"}
                  >
                    {t("services")}
                    <ChevronIcon
                      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                        mobileSection === "services" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <MobileAccordion isOpen={mobileSection === "services"}>
                    {services.map((service, index) => (
                      <motion.li
                        key={service.slug}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.03,
                          duration: 0.2,
                          ease: "easeOut",
                        }}
                      >
                        <Link
                          href={`/${locale}/hizmetler/${service.slug}`}
                          onClick={closeMenu}
                          className="block py-3 text-base text-slate-600 transition-colors hover:text-primary"
                        >
                          {service.title}
                        </Link>
                      </motion.li>
                    ))}
                  </MobileAccordion>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.18, duration: 0.28 }}
                >
                  <button
                    type="button"
                    onClick={() => toggleMobileSection("expertise")}
                    className="flex w-full items-center justify-between border-b border-slate-200 pb-3 text-xl text-slate-950 transition-colors hover:text-primary"
                    aria-expanded={mobileSection === "expertise"}
                  >
                    {t("expertise")}
                    <ChevronIcon
                      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${
                        mobileSection === "expertise" ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <MobileAccordion isOpen={mobileSection === "expertise"}>
                    {expertiseSectors.map((sector, index) => (
                      <motion.li
                        key={sector.slug}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.04,
                          duration: 0.2,
                          ease: "easeOut",
                        }}
                      >
                        <Link
                          href={`/${locale}/uzmanlik/${sector.slug}`}
                          onClick={closeMenu}
                          className="block py-3 text-base text-slate-600 transition-colors hover:text-primary"
                        >
                          {tExpertise(`${sector.translationKey}.navTitle`)}
                        </Link>
                      </motion.li>
                    ))}
                  </MobileAccordion>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.24, duration: 0.28 }}
                >
                  <Link
                    href={`/${locale}/iletisim`}
                    onClick={closeMenu}
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

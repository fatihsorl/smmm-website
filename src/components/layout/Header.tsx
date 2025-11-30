"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const t = useTranslations("navigation");

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-[100] glass-effect border-b border-gray-200 dark:border-gray-800">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <Link href="#hero" className="flex items-center gap-3 select-none">
            <span className="w-10 h-10 md:w-12 md:h-12 rounded-[10%] overflow-hidden ring-1 ring-white/10 shadow-[0_0_20px_rgba(33,87,159,0.25)]">
              <Image
                src="/logo.png"
                alt="Soral Danışmanlık SMMM Logo"
                width={48}
                height={48}
                priority
                className="w-full h-full object-cover"
              />
            </span>
            <span className="text-2xl font-bold text-primary">
              Soral Danışmanlık
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#hizmetler"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
            >
              {t("services")}
            </Link>
            <Link
              href="#neden-biz"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors"
            >
              {t("whyUs")}
            </Link>
            <Link href="#iletisim" className="btn-primary">
              {t("contact")}
            </Link>
            <LanguageSwitcher />
          </nav>

          {/* Mobile: Language Switcher + Menu Button */}
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button
              className="text-gray-700 dark:text-gray-300 focus:outline-none"
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

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden border-t border-gray-200/20 dark:border-gray-800/20 mt-4"
            >
              <div className="py-4 flex flex-col gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  <Link
                    href="#hizmetler"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("services")}
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                >
                  <Link
                    href="#neden-biz"
                    className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary font-medium transition-colors block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("whyUs")}
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Link
                    href="#iletisim"
                    className="btn-primary inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {t("contact")}
                  </Link>
                </motion.div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;

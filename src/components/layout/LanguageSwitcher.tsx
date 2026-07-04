"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { locales, localeNames } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import { motion, AnimatePresence } from "framer-motion";
import FlagIcon from "./FlagIcon";

const LanguageSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;

  const handleLocaleChange = (newLocale: Locale) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPath = segments.join("/");

    router.push(newPath);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center gap-2 md:px-3 px-2 py-2 rounded-full bg-white hover:bg-slate-50 transition-colors text-slate-700 border border-slate-200 shadow-sm backdrop-blur-sm"
        aria-label="Dil seçimi"
      >
        <span className="w-6 h-4 md:w-5 md:h-4 flex-shrink-0 rounded overflow-hidden border border-slate-200">
          <FlagIcon locale={locale} className="w-full h-full object-cover" />
        </span>
        <span className="hidden md:inline text-sm font-medium">
          {localeNames[locale]}
        </span>
        <svg
          className={`w-4 h-4 transition-transform hidden md:block ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-200 overflow-hidden z-50 min-w-[140px]"
          >
            {locales.map((loc) => (
              <button
                key={loc}
                onClick={() => handleLocaleChange(loc)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors ${
                  loc === locale
                    ? "bg-primary/10 text-primary"
                    : "text-slate-700"
                }`}
              >
                <span className="w-6 h-4 md:w-5 md:h-4 flex-shrink-0 rounded overflow-hidden border border-slate-200">
                  <FlagIcon locale={loc} className="w-full h-full object-cover" />
                </span>
                <span className="hidden md:inline text-sm font-medium">
                  {localeNames[loc]}
                </span>
                <span className="md:hidden text-sm font-medium">
                  {loc.toUpperCase()}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default LanguageSwitcher;

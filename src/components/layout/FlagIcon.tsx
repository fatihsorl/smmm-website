import React from "react";
import type { Locale } from "@/i18n/config";
import TR from "country-flag-icons/react/3x2/TR";
import US from "country-flag-icons/react/3x2/US";
import ES from "country-flag-icons/react/3x2/ES";

interface FlagIconProps {
  locale: Locale;
  className?: string;
}

const FlagIcon = ({ locale, className = "" }: FlagIconProps) => {
  const flags: Record<Locale, React.ReactElement> = {
    tr: <TR className={className} title="Türkçe" />,
    en: <US className={className} title="English" />,
    es: <ES className={className} title="Español" />,
  };

  return flags[locale];
};

export default FlagIcon;

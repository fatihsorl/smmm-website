import React from "react";
import type { Locale } from "@/i18n/config";

interface FlagIconProps {
  locale: Locale;
  className?: string;
}

const FlagIcon = ({ locale, className = "" }: FlagIconProps) => {
  const flags: Record<Locale, React.ReactElement> = {
    tr: (
      <svg
        className={className}
        viewBox="0 0 3 2"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <rect width="3" height="2" fill="#E30A17" />
        <g transform="translate(1.1, 1)">
          <circle
            cx="0"
            cy="0"
            r="0.4"
            fill="none"
            stroke="#fff"
            strokeWidth="0.12"
          />
          <circle cx="0.17" cy="-0.1" r="0.32" fill="#E30A17" />
          <path d="M 0.58,0 L 0.47,0.19 L 0.47,-0.19 Z" fill="#fff" />
          <circle cx="0.58" cy="0" r="0.13" fill="#fff" />
        </g>
      </svg>
    ),
    en: (
      <svg
        className={className}
        viewBox="0 0 7410 3900"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <rect width="7410" height="3900" fill="#B22234" />
        <rect y="300" width="7410" height="300" fill="#fff" />
        <rect y="900" width="7410" height="300" fill="#fff" />
        <rect y="1500" width="7410" height="300" fill="#fff" />
        <rect y="2100" width="7410" height="300" fill="#fff" />
        <rect y="2700" width="7410" height="300" fill="#fff" />
        <rect y="3300" width="7410" height="300" fill="#fff" />
        <rect width="2964" height="2100" fill="#3C3B6E" />
        <circle cx="247" cy="300" r="111" fill="#fff" />
        <circle cx="494" cy="300" r="111" fill="#fff" />
        <circle cx="741" cy="300" r="111" fill="#fff" />
        <circle cx="988" cy="300" r="111" fill="#fff" />
        <circle cx="1235" cy="300" r="111" fill="#fff" />
        <circle cx="1482" cy="300" r="111" fill="#fff" />
        <circle cx="1729" cy="300" r="111" fill="#fff" />
        <circle cx="1976" cy="300" r="111" fill="#fff" />
        <circle cx="2223" cy="300" r="111" fill="#fff" />
        <circle cx="2470" cy="300" r="111" fill="#fff" />
        <circle cx="2717" cy="300" r="111" fill="#fff" />
        <circle cx="370.5" cy="450" r="111" fill="#fff" />
        <circle cx="617.5" cy="450" r="111" fill="#fff" />
        <circle cx="864.5" cy="450" r="111" fill="#fff" />
        <circle cx="1111.5" cy="450" r="111" fill="#fff" />
        <circle cx="1358.5" cy="450" r="111" fill="#fff" />
        <circle cx="1605.5" cy="450" r="111" fill="#fff" />
        <circle cx="1852.5" cy="450" r="111" fill="#fff" />
        <circle cx="2099.5" cy="450" r="111" fill="#fff" />
        <circle cx="2346.5" cy="450" r="111" fill="#fff" />
        <circle cx="2593.5" cy="450" r="111" fill="#fff" />
      </svg>
    ),
    es: (
      <svg
        className={className}
        viewBox="0 0 3 2"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <rect width="3" height="0.5" fill="#AA151B" />
        <rect y="0.5" width="3" height="1" fill="#F1BF00" />
        <rect y="1.5" width="3" height="0.5" fill="#AA151B" />
      </svg>
    ),
  };

  return flags[locale];
};

export default FlagIcon;

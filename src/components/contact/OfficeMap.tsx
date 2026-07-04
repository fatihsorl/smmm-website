"use client";

import { useEffect, useRef, useState } from "react";
import {
  OFFICE_ADDRESS,
  OFFICE_MAP_LABEL,
  getOfficeMapEmbedUrl,
  getOfficeMapLink,
  getOfficeStaticMapUrl,
} from "@/data/contact";

type OfficeMapProps = {
  locale?: string;
  title: string;
  openInMapsLabel: string;
  loadMapLabel: string;
};

function MapPinIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 36"
      className="h-10 w-10 drop-shadow-lg md:h-12 md:w-12"
    >
      <path
        d="M12 0C7.03 0 3 4.03 3 9c0 6.75 9 18 9 18s9-11.25 9-18c0-4.97-4.03-9-9-9z"
        fill="#2563eb"
      />
      <circle cx="12" cy="9" r="3.5" fill="white" />
    </svg>
  );
}

export default function OfficeMap({
  locale = "tr",
  title,
  openInMapsLabel,
  loadMapLabel,
}: OfficeMapProps) {
  const [showInteractive, setShowInteractive] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showInteractive) {
      return;
    }

    const element = containerRef.current;
    if (!element) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShowInteractive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "160px", threshold: 0.15 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [showInteractive]);

  return (
    <section aria-label={title} className="section bg-white">
      <div className="container">
        <div className="mb-10 text-center md:mb-12">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-950">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-slate-600">
            {OFFICE_ADDRESS}
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm"
        >
          {!showInteractive ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getOfficeStaticMapUrl()}
                alt={`${title} - ${OFFICE_ADDRESS}`}
                className="h-[320px] w-full object-cover md:h-[420px]"
                loading="lazy"
                decoding="async"
              />
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-950/20 via-transparent to-transparent" />
              <div className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-full">
                <div className="flex flex-col items-center">
                  <MapPinIcon />
                  <span className="mt-1 whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-slate-950 shadow-md ring-1 ring-slate-200 md:text-sm">
                    {OFFICE_MAP_LABEL}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInteractive(true)}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg ring-1 ring-slate-200 transition-colors hover:bg-slate-50"
              >
                {loadMapLabel}
              </button>
            </>
          ) : (
            <>
              {!iframeLoaded ? (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 z-10 flex items-center justify-center bg-slate-100"
                >
                  <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : null}
              <iframe
                title={`${title} - ${OFFICE_ADDRESS}`}
                src={getOfficeMapEmbedUrl(locale)}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                onLoad={() => setIframeLoaded(true)}
                className="relative z-0 h-[320px] w-full border-0 md:h-[420px]"
              />
            </>
          )}
        </div>

        <div className="mt-4 text-center">
          <a
            href={getOfficeMapLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary underline decoration-primary/35 underline-offset-4 transition-colors hover:text-slate-950"
          >
            {openInMapsLabel}
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 6H19v5.5M19 6l-8.25 8.25M11 6H6a1 1 0 00-1 1v11a1 1 0 001 1h11a1 1 0 001-1v-5"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

import {
  OFFICE_ADDRESS,
  getOfficeMapEmbedUrl,
  getOfficeMapLink,
} from "@/data/contact";

type OfficeMapProps = {
  locale?: string;
  title: string;
  openInMapsLabel: string;
};

export default function OfficeMap({
  locale = "tr",
  title,
  openInMapsLabel,
}: OfficeMapProps) {
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

        <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
          <iframe
            title={`${title} - ${OFFICE_ADDRESS}`}
            src={getOfficeMapEmbedUrl(locale)}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="h-[320px] w-full border-0 md:h-[420px]"
          />
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

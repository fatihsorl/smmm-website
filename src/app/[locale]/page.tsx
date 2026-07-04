"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { services } from "@/data/services";
import OfficeMap from "@/components/contact/OfficeMap";

const partnerLogos = [
  { src: "/partner/partner-turmob-.jpg", alt: "TÜRMOB" },
  { src: "/partner/partner-gib-.jpg", alt: "Gelir İdaresi Başkanlığı" },
  { src: "/partner/partner-sgk-.jpg", alt: "SGK" },
  { src: "/partner/partner-csgb-logo.jpg", alt: "ÇSGB" },
  { src: "/partner/partner-ito-.jpg", alt: "İstanbul Ticaret Odası" },
  { src: "/partner/partner-iskur-.jpg", alt: "İŞKUR" },
  { src: "/partner/partner-tesk-.jpg", alt: "TESK" },
  { src: "/partner/partner-luca-.jpg", alt: "Luca" },
  { src: "/partner/partner-ismmmo-logo.jpg", alt: "İSMMMO" },
  { src: "/partner/partner-turkiye-gov-tr.jpg", alt: "Türkiye.gov.tr" },
];

const maritimeLogos = [
  { src: "/referans/server-denizcilik.png", alt: "Server Denizcilik" },
  { src: "/referans/aquantis-maritime.webp", alt: "Aquantis Maritime" },
  { src: "/referans/maveks-marina.png", alt: "Maveks Marina" },
  { src: "/referans/tr-maritime.avif", alt: "TR Maritime" },
];

const productionLogos = [
  { src: "/referans/eurofit-piping.png", alt: "Eurofit Piping" },
  { src: "/referans/eurosteel-metal.png", alt: "Eurosteel Metal" },
];

type ExpertiseBlockProps = {
  logos: { src: string; alt: string }[];
  logosLabel: string;
  contentTitle: string;
  intro1: string;
  intro2: string;
  servicesIntro: string;
  services: string[];
  closingParagraphs: string[];
  quote?: string;
  className?: string;
};

function ExpertiseBlock({
  logos,
  logosLabel,
  contentTitle,
  intro1,
  intro2,
  servicesIntro,
  services,
  closingParagraphs,
  quote,
  className = "",
}: ExpertiseBlockProps) {
  return (
    <div className={className}>
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <h3 className="mb-5 text-lg font-bold leading-snug text-slate-950 md:text-xl">
          {contentTitle}
        </h3>

        <div
          aria-label={logosLabel}
          className="expertise-logos-static mb-6 flex flex-wrap items-center justify-center gap-3 md:mb-8 md:gap-4"
        >
          {logos.map((logo) => (
            <div
              key={logo.src}
              className="flex h-14 w-32 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 md:h-16 md:w-36"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={160}
                height={64}
                className="max-h-full w-auto max-w-full object-contain"
              />
            </div>
          ))}
        </div>

        <p className="mb-4 text-sm leading-relaxed text-slate-600">{intro1}</p>
        <p className="mb-6 text-sm leading-relaxed text-slate-600">{intro2}</p>

        <p className="mb-3 text-sm font-bold text-slate-950">{servicesIntro}</p>
        <ul className="mb-6 grid gap-2.5 md:grid-cols-2">
          {services.map((service) => (
            <li
              key={service}
              className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600"
            >
              <span
                aria-hidden
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
              />
              {service}
            </li>
          ))}
        </ul>

        {closingParagraphs.map((paragraph, index) => (
          <p
            key={paragraph.slice(0, 32)}
            className={`text-sm leading-relaxed text-slate-600 ${
              index === closingParagraphs.length - 1 && !quote
                ? "mb-0"
                : "mb-4"
            } ${index === closingParagraphs.length - 1 && quote ? "mb-8" : ""}`}
          >
            {paragraph}
          </p>
        ))}

        {quote ? (
          <blockquote className="border-l-4 border-primary bg-primary/5 px-5 py-4 text-sm font-semibold italic leading-relaxed text-primary md:text-base">
            &ldquo;{quote}&rdquo;
          </blockquote>
        ) : null}
      </div>
    </div>
  );
}

export default function Home() {
  const [isHoveringHero, setIsHoveringHero] = useState(false);

  // Translations
  const tHero = useTranslations("hero");
  const tWhyUs = useTranslations("whyUs");
  const tContact = useTranslations("contact");
  const tExpertise = useTranslations("expertise");
  const locale = useLocale();
  const [activeHeroBackground, setActiveHeroBackground] = useState(0);
  const heroBackgroundSlides = [
    {
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=80",
      position: "center",
    },
    {
      image:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1800&q=80",
      position: "center",
    },
    {
      image:
        "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1800&q=80",
      position: "center",
    },
  ];
  const referenceLogos = [
    { src: "/referans/eurosteel-metal.png", alt: "Eurosteel Metal" },
    { src: "/referans/remax.jpg", alt: "Remax" },
    { src: "/referans/aquantis-maritime.webp", alt: "Aquantis Maritime" },
    { src: "/referans/mg-moto.jpg", alt: "MG Moto" },
    { src: "/referans/safir-teknoloji.png", alt: "Safir Teknoloji" },
    { src: "/referans/kablosuz-dünya.png", alt: "Kablosuz Dünya" },
    { src: "/referans/cicocebali.jpg", alt: "Cicocebali" },
    { src: "/referans/maveks-marina.png", alt: "Maveks Marina" },
    { src: "/referans/tr-maritime.avif", alt: "TR Maritime" },
    { src: "/referans/eurofit-piping.png", alt: "Eurofit Piping" },
    { src: "/referans/server-denizcilik.png", alt: "Server Denizcilik" },
    { src: "/referans/fatih-otomotiv.png", alt: "Fatih Otomotiv" },
  ];
  const maritimeServices = tExpertise.raw("maritime.services") as string[];
  const productionServices = tExpertise.raw("production.services") as string[];

  // Mouse throttling için - sadece desktop'ta çalışsın
  const lastMouseUpdate = useRef(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Mouse-following background for hero - sadece desktop'ta
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Spring animasyonlarını daha performanslı yap
  const b1x = useSpring(
    useTransform(mouseX, (v) => v * 0.02),
    { stiffness: 40, damping: 30 },
  );
  const b1y = useSpring(
    useTransform(mouseY, (v) => v * 0.02),
    { stiffness: 40, damping: 30 },
  );
  const b2x = useSpring(
    useTransform(mouseX, (v) => v * -0.015),
    { stiffness: 40, damping: 30 },
  );
  const b2y = useSpring(
    useTransform(mouseY, (v) => v * -0.015),
    { stiffness: 40, damping: 30 },
  );

  // Desktop kontrolü ekle
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop, { passive: true });

    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  // iOS Safari için viewport height fix - sadece orientation değişiminde
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("orientationchange", setVH, { passive: true });

    return () => {
      window.removeEventListener("orientationchange", setVH);
    };
  }, []);

  // iOS Safari scroll bounce engellemesi - CSS ile yapılıyor, bu kod kaldırıldı
  // overscroll-behavior: none CSS'de zaten tanımlı

  // Sayfa yüklendiğinde scroll pozisyonunu sıfırla
  useEffect(() => {
    // Sayfa yüklendiğinde en üste scroll et
    window.scrollTo(0, 0);

    // Hash varsa temizle
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveHeroBackground(
        (current) => (current + 1) % heroBackgroundSlides.length,
      );
    }, 3000);

    return () => window.clearInterval(interval);
  }, [heroBackgroundSlides.length]);

  return (
    <>
      {/* Hero Section */}
      <section
        id="hero"
        className="relative overflow-hidden bg-slate-950 min-h-[100dvh] md:min-h-[100vh] flex flex-col pt-32 pb-24 md:pb-28"
        style={
          isDesktop
            ? { minHeight: "calc(var(--vh, 1vh) * 100)" }
            : undefined
        }
        {...(isDesktop && {
          onMouseEnter: () => setIsHoveringHero(true),
          onMouseMove: (e: React.MouseEvent) => {
            const now = Date.now();
            if (now - lastMouseUpdate.current < 32) return;
            lastMouseUpdate.current = now;

            const rect = (
              e.currentTarget as HTMLElement
            ).getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const relY = e.clientY - rect.top;
            const cx = relX - rect.width / 2;
            const cy = relY - rect.height / 2;
            mouseX.set(cx);
            mouseY.set(cy);
            cursorX.set(relX);
            cursorY.set(relY);
          },
          onMouseLeave: () => {
            mouseX.set(0);
            mouseY.set(0);
            setIsHoveringHero(false);
          },
        })}
      >
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          {heroBackgroundSlides.map((slide, index) => (
            <motion.div
              key={slide.image}
              aria-hidden
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundPosition: slide.position,
              }}
              animate={{ opacity: activeHeroBackground === index ? 0.72 : 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          ))}
          <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(2,6,23,0.84)_0%,rgba(15,23,42,0.66)_45%,rgba(15,23,42,0.34)_100%)]"></div>
          <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_28%_35%,rgba(59,130,246,0.18),transparent_36%)]"></div>
          <div className="absolute inset-x-0 bottom-0 z-10 h-24 bg-gradient-to-t from-white to-transparent md:h-28"></div>
        </div>

        {/* Mouse-following spotlight cursor - sadece desktop'ta */}
        {isDesktop && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute z-40 rounded-full ring-1 ring-white/15"
            style={{
              width: 64,
              height: 64,
              left: cursorX,
              top: cursorY,
              marginLeft: -32,
              marginTop: -32,
              opacity: isHoveringHero ? 0.8 : 0,
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0.18), rgba(59,130,246,0.18), transparent 70%)",
              filter: "blur(1px)",
            }}
          />
        )}

        {/* Interactive parallax blobs */}
        {isDesktop ? (
          <>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -top-32 -left-32 w-[320px] h-[320px] rounded-full blur-3xl opacity-70"
              style={{ background: "rgba(59,130,246,0.22)", x: b1x, y: b1y }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 -right-40 w-[420px] h-[420px] rounded-full blur-3xl opacity-60"
              style={{ background: "rgba(255,255,255,0.12)", x: b2x, y: b2y }}
            />
          </>
        ) : (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 -left-32 w-[320px] h-[320px] rounded-full blur-3xl opacity-50"
              style={{ background: "rgba(59,130,246,0.22)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 -right-40 w-[420px] h-[420px] rounded-full blur-3xl opacity-40"
              style={{ background: "rgba(255,255,255,0.12)" }}
            />
          </>
        )}

        <div className="container relative z-30 flex flex-1 items-center pb-8">
          <motion.div
            {...(isDesktop
              ? {
                  initial: { opacity: 0, y: 20 },
                  animate: { opacity: 1, y: 0 },
                  transition: { duration: 0.6, ease: "easeOut" },
                }
              : {})}
            className="max-w-xl text-center lg:text-left"
          >
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-white mb-6 leading-tight mx-auto lg:mx-0">
              {tHero("title")}
            </h1>
            <p className="text-sm md:text-base text-white/70 mb-8 leading-relaxed max-w-3xl mx-auto lg:mx-0">
              {tHero("subtitle")}
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <Link
                href="#iletisim"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById("iletisim");
                  if (element) {
                    const header = document.querySelector("header");
                    const headerHeight = header
                      ? header.offsetHeight
                      : window.innerWidth >= 768
                        ? 140
                        : 120;
                    const headerOffset = headerHeight + 20;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition =
                      elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                      top: Math.max(0, offsetPosition),
                      behavior:
                        window.innerWidth >= 768 ? "smooth" : "instant",
                    });
                  }
                }}
                className="bg-white text-slate-950 text-sm px-6 py-3 rounded-full font-bold shadow-2xl shadow-black/20 transition-all transform hover:-translate-y-1 hover:bg-white/90"
              >
                {tHero("contactButton")}
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          {...(isDesktop
            ? {
                initial: { opacity: 0, y: 12 },
                animate: { opacity: 1, y: 0 },
                transition: { duration: 0.45, delay: 0.25, ease: "easeOut" },
              }
            : {})}
          className="absolute bottom-0 left-1/2 z-30 w-screen max-w-[100vw] -translate-x-1/2"
        >
          <div className="w-full overflow-hidden rounded-none bg-white py-4 md:py-5">
            <div className="logo-marquee-track flex w-max items-center gap-1">
              {[...referenceLogos, ...referenceLogos].map((logo, index) => (
                <div
                  key={`${logo.src}-${index}`}
                  className="flex h-12 w-32 shrink-0 items-center justify-center md:h-14 md:w-36"
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={140}
                    height={60}
                    className="h-16 w-22 object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section
        id="hizmetler"
        className="section bg-[linear-gradient(180deg,#ffffff_0%,#eef5ff_100%)]"
      >
        <div className="container">
          <motion.div
            {...(isDesktop
              ? {
                  initial: { opacity: 0 },
                  whileInView: { opacity: 1 },
                  viewport: { once: true, margin: "-100px" },
                  transition: { duration: 0.3, ease: "easeOut" },
                }
              : {})}
            className="mx-auto mb-14 max-w-3xl text-center"
          >
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 mb-4">
              Hizmetlerimiz
            </h2>
            <p className="text-sm text-slate-600 max-w-2xl mx-auto">
              Finansal raporlama, denetim, muhasebe ve danışmanlık süreçlerinizi
              tek merkezden, kurumsal standartlarla yönetiyoruz.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <motion.article
                key={service.title}
                {...(isDesktop
                  ? {
                      initial: { opacity: 0, y: 14 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: "-100px" },
                      transition: {
                        duration: 0.25,
                        delay: Math.min(index * 0.04, 0.24),
                        ease: "easeOut",
                      },
                    }
                  : {})}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 md:hover:-translate-y-1 md:hover:border-primary/20 md:hover:shadow-xl md:hover:shadow-primary/10"
              >
                <div
                  className="h-24 bg-cover bg-center"
                  style={{ backgroundImage: `url(${service.image})` }}
                >
                  <div className="h-full w-full bg-gradient-to-br from-slate-950/65 via-slate-950/35 to-primary/20" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-slate-950">
                    {service.title}
                  </h3>
                  <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                  <Link
                    href={`/${locale}/hizmetler/${service.slug}`}
                    className="btn-primary mt-auto w-full gap-2 px-5 py-2.5 text-sm"
                  >
                    Detayları incele
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
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
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Expertise Section */}
      <section
        id="uzmanlik"
        className="section relative overflow-hidden bg-[#f4f9ff]"
      >
        <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-sky-200/50 blur-3xl" />

        <div className="container relative z-10">
          <motion.div
            {...(isDesktop
              ? {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-100px" },
                  transition: { duration: 0.35, ease: "easeOut" },
                }
              : {})}
            className="mx-auto mb-14 max-w-3xl text-center"
          >
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-950">
              {tExpertise("title")}
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {tExpertise("subtitle")}
            </p>
          </motion.div>

          <ExpertiseBlock
            logos={maritimeLogos}
            logosLabel={tExpertise("maritimeLogosLabel")}
            contentTitle={tExpertise("maritime.contentTitle")}
            intro1={tExpertise("maritime.intro1")}
            intro2={tExpertise("maritime.intro2")}
            servicesIntro={tExpertise("maritime.servicesIntro")}
            services={maritimeServices}
            closingParagraphs={[
              tExpertise("maritime.approach"),
              tExpertise("maritime.experience"),
            ]}
            quote={tExpertise("maritime.quote")}
          />

          <div
            aria-hidden
            className="mx-auto my-14 max-w-4xl border-t border-slate-200"
          />

          <ExpertiseBlock
            logos={productionLogos}
            logosLabel={tExpertise("productionLogosLabel")}
            contentTitle={tExpertise("production.contentTitle")}
            intro1={tExpertise("production.intro1")}
            intro2={tExpertise("production.intro2")}
            servicesIntro={tExpertise("production.servicesIntro")}
            services={productionServices}
            closingParagraphs={[
              tExpertise("production.experience"),
              tExpertise("production.goal"),
            ]}
          />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="neden-biz" className="section bg-white">
        <div className="container">
          <motion.div
            {...(isDesktop
              ? {
                  initial: { opacity: 0, y: 16 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-100px" },
                  transition: { duration: 0.35, ease: "easeOut" },
                }
              : {})}
            className="mx-auto max-w-6xl"
          >
            <div className="mb-14 text-center">
              <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-950">
                {tWhyUs("title")}
              </h2>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600">
                {tWhyUs("subtitle")}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  title: tWhyUs("expertTeam.title"),
                  description: tWhyUs("expertTeam.description"),
                },
                {
                  title: tWhyUs("personalizedService.title"),
                  description: tWhyUs("personalizedService.description"),
                },
                {
                  title: tWhyUs("upToDate.title"),
                  description: tWhyUs("upToDate.description"),
                },
                {
                  title: tWhyUs("certified.title"),
                  description: tWhyUs("certified.description"),
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px flex-1 bg-slate-200" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-slate-950">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partner Logos Marquee */}
      <section
        aria-label="Kurumsal iş ortakları"
        className="overflow-hidden border-t border-slate-200 bg-white py-10 md:py-8"
      >
        <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_6%,black_94%,transparent)]">
          <div className="logo-marquee-track flex w-max items-center gap-3">
            {[...partnerLogos, ...partnerLogos].map((logo, index) => (
              <div
                key={`${logo.src}-${index}`}
                className="flex h-14 w-36 shrink-0 items-center justify-center md:h-16 md:w-40"
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={160}
                  height={64}
                  className="max-h-full w-auto max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section
        id="iletisim"
        className="section relative overflow-hidden bg-[linear-gradient(180deg,#eef5ff_0%,#ffffff_50%,#f4f8ff_100%)]"
      >
        <div className="pointer-events-none absolute -right-16 top-0 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-72 w-72 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

        <div className="container relative z-10">
          <motion.div
            {...(isDesktop
              ? {
                  initial: { opacity: 0, y: 12 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, margin: "-100px" },
                  transition: { duration: 0.3, ease: "easeOut" },
                }
              : {})}
            className="mx-auto max-w-3xl text-center"
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-primary">
              {tContact("eyebrow")}
            </p>
            <div className="mx-auto mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-12 bg-primary/25" />
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="h-px w-12 bg-primary/25" />
            </div>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-950">
              {tContact("title")}
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-sm leading-relaxed text-slate-600">
              {tContact("subtitle")}
            </p>
            <Link
              href={`/${locale}/iletisim`}
              className="btn-primary px-8 py-3.5 text-sm"
            >
              {tContact("ctaButton")}
              <svg
                aria-hidden="true"
                className="ml-2 h-4 w-4"
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
            </Link>
          </motion.div>
        </div>
      </section>

      <OfficeMap
        locale={locale}
        title={tContact("mapTitle")}
        openInMapsLabel={tContact("openInMaps")}
      />
    </>
  );
}

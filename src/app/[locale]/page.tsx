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

function AnimatedStatValue({ value }: { value: string }) {
  const parsedValue = value.match(/^([^0-9]*)(\d+)(.*)$/);
  const prefix = parsedValue?.[1] ?? "";
  const target = Number(parsedValue?.[2] ?? 0);
  const suffix = parsedValue?.[3] ?? "";
  const [displayValue, setDisplayValue] = useState(`${prefix}0${suffix}`);

  useEffect(() => {
    const duration = 1800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(target * easedProgress);

      setDisplayValue(`${prefix}${currentValue}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [prefix, suffix, target]);

  return <>{displayValue}</>;
}

export default function Home() {
  const [isHoveringHero, setIsHoveringHero] = useState(false);

  // Translations
  const tHero = useTranslations("hero");
  const tWhyUs = useTranslations("whyUs");
  const tContact = useTranslations("contact");
  const tStats = useTranslations("stats");
  const locale = useLocale();
  const [activeHeroBackground, setActiveHeroBackground] = useState(0);
  const [activeMaritimeReference, setActiveMaritimeReference] = useState(0);
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
  const maritimeReferences = [
    {
      name: "Server Denizcilik",
      logo: "/referans/server-denizcilik.png",
      image:
        "https://images.unsplash.com/photo-1494412651409-8963ce7935a7?auto=format&fit=crop&w=1600&q=80",
      sector:
        "Deniz taşımacılığı ve gemi işletmeciliği alanında faaliyet gösteren yapılar için düzenli finansal takip kritik önem taşır.",
      support:
        "Muhasebe kayıtlarının düzenli ilerlemesi, vergi yükümlülüklerinin zamanında takip edilmesi ve raporlama süreçlerinin daha okunabilir hale gelmesi için operasyonlarını kolaylaştırıyoruz. Böylece yönetim tarafında finansal görünürlük artarken, ekiplerin günlük iş yükü azalıyor.",
    },
    {
      name: "Aquantis Maritime",
      logo: "/referans/aquantis-maritime.webp",
      image:
        "https://images.unsplash.com/photo-1773952984178-f91248ce704f?auto=format&fit=crop&w=1600&q=80",
      sector:
        "Maritime odaklı şirketlerde farklı para birimleri, operasyon maliyetleri ve sözleşme süreçleri finansal görünürlüğü zorlaştırabilir.",
      support:
        "Gelir-gider takibi, dönemsel raporlama ve mevzuata uyum süreçlerini sadeleştirerek yönetimin daha hızlı karar almasına destek oluyoruz. Operasyonel hareketlerin mali karşılığını düzenli takip edilebilir hale getiriyoruz.",
    },
    {
      name: "Maveks Marina",
      logo: "/referans/maveks-marina.png",
      image:
        "https://images.unsplash.com/photo-1770929356190-2bf66b49d18d?auto=format&fit=crop&w=1600&q=80",
      sector:
        "Marina işletmelerinde hizmet gelirleri, operasyon giderleri ve personel süreçleri düzenli mali kontrol gerektirir.",
      support:
        "Muhasebe, bordro ve finansal raporlama süreçlerini daha sistemli hale getirerek işletmenin mali takibini kolaylaştırıyoruz. Marina operasyonlarında gelir, gider ve personel süreçlerinin düzenli ilerlemesine destek oluyoruz.",
    },
    {
      name: "TR Maritime",
      logo: "/referans/tr-maritime.avif",
      image:
        "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=1600&q=80",
      sector:
        "Denizcilik sektöründe operasyonel planlama ile finansal kayıtların aynı disiplin içinde takip edilmesi gerekir.",
      support:
        "Vergi danışmanlığı, mali kayıt kontrolü ve raporlama süreçlerinde netlik sağlayarak iş yükünü azaltıyoruz. Düzenli kontrol ve anlaşılır raporlarla finansal süreçlerin daha güvenli yönetilmesini sağlıyoruz.",
    },
  ];
  const showPreviousMaritimeReference = () => {
    setActiveMaritimeReference(
      (current) =>
        (current - 1 + maritimeReferences.length) % maritimeReferences.length,
    );
  };
  const showNextMaritimeReference = () => {
    setActiveMaritimeReference(
      (current) => (current + 1) % maritimeReferences.length,
    );
  };

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

  // iOS Safari için viewport height fix
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVH();
    window.addEventListener("resize", setVH, { passive: true });
    window.addEventListener("orientationchange", setVH, { passive: true });

    return () => {
      window.removeEventListener("resize", setVH);
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
        className="relative overflow-hidden bg-slate-950 min-h-[100dvh] md:min-h-[100vh] flex items-center pt-32 pb-32"
        style={{ minHeight: "calc(var(--vh, 1vh) * 100)" }}
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
          <div className="absolute inset-x-0 bottom-0 z-10 h-40 bg-gradient-to-t from-white to-transparent"></div>
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

        <div className="container relative z-30">
          <div className="mx-auto max-w-7xl">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-4xl text-center lg:text-left"
            >
              <h1 className="max-w-4xl text-2xl font-bold tracking-tight text-white mb-6 leading-tight mx-auto lg:mx-0">
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
                      const elementPosition =
                        element.getBoundingClientRect().top;
                      const offsetPosition =
                        elementPosition + window.pageYOffset - headerOffset;
                      window.scrollTo({
                        top: Math.max(0, offsetPosition),
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="bg-white text-slate-950 text-sm px-6 py-3 rounded-full font-bold shadow-2xl shadow-black/20 transition-all transform hover:-translate-y-1 hover:bg-white/90"
                >
                  {tHero("contactButton")}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25, ease: "easeOut" }}
              className="mt-22 overflow-hidden rounded-2xl bg-white md:px-4 md:py-6 px-2 py-4 backdrop-blur-2xl [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)] md:mt-18"
            >
              <div className="logo-marquee-track flex w-max items-center gap-1">
                {[...referenceLogos, ...referenceLogos].map((logo, index) => (
                  <div
                    key={`${logo.src}-${index}`}
                    className="flex md:h-14 h-12 md:w-36 w-32 shrink-0 items-center justify-center"
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-40 -mt-24 bg-transparent pb-16">
        <div className="container">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-sm  bg-white shadow-[0_35px_100px_-55px_rgba(15,23,42,0.45)]">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid gap-0 lg:grid-cols-[0.82fr_1.18fr]"
            >
              <div className="bg-slate-950 p-6 text-white md:p-8">
                <div className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-sky-200/70">
                  Soral Danışmanlık
                </div>
                <h2 className="mb-4 text-2xl font-bold tracking-tight">
                  {tStats("title")}
                </h2>
                <p className="max-w-md text-sm leading-relaxed text-white/65">
                  {tStats("subtitle")}
                </p>
                <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="text-2xl font-bold text-white">
                    <AnimatedStatValue value={tStats("years.value")} />
                  </div>
                  <div className="mt-1 text-sm font-medium text-white/60">
                    {tStats("years.label")}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-px bg-slate-200 sm:grid-cols-2">
                {[
                  {
                    value: tStats("taxpayers.value"),
                    label: tStats("taxpayers.label"),
                  },
                  {
                    value: tStats("companies.value"),
                    label: tStats("companies.label"),
                  },
                  {
                    value: tStats("customServices.value"),
                    label: tStats("customServices.label"),
                  },
                  {
                    value: tStats("satisfaction.value"),
                    label: tStats("satisfaction.label"),
                  },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="bg-white p-6 transition-colors hover:bg-slate-50 md:p-8"
                  >
                    <div className="mb-3 h-1 w-8 rounded-full bg-primary/70" />
                    <div className="text-2xl font-bold text-slate-950">
                      <AnimatedStatValue value={metric.value} />
                    </div>
                    <div className="mt-2 text-sm font-medium text-slate-500">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="hizmetler"
        className="section bg-[linear-gradient(180deg,#ffffff_0%,#eef5ff_100%)]"
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
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
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{
                  duration: 0.25,
                  delay: Math.min(index * 0.04, 0.24),
                  ease: "easeOut",
                }}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/10"
              >
                <div
                  className="h-24 bg-cover bg-center"
                  style={{ backgroundImage: `url(${service.image})` }}
                >
                  <div className="h-full w-full bg-gradient-to-br from-slate-950/65 via-slate-950/35 to-primary/20" />
                </div>
                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-slate-950">
                    {service.title}
                  </h3>
                  <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                  <ul className="mb-5 space-y-1.5">
                    {service.details.slice(0, 2).map((detail) => (
                      <li
                        key={detail}
                        className="flex gap-2.5 text-sm leading-relaxed text-slate-600"
                      >
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full border border-primary/20 bg-primary" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/${locale}/hizmetler/${service.slug}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3.5 py-2 text-sm font-bold text-slate-800 transition-all hover:border-primary/30 hover:bg-blue-200"
                  >
                    Detayları incele
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Maritime Expertise Section */}
      <section
        className="relative overflow-hidden bg-[#f4f9ff]"
        style={{ minHeight: "calc(100vh - 180px)" }}
      >
        <div className="absolute inset-y-0 right-0 hidden w-[60vw] lg:block">
          {maritimeReferences.map((reference, index) => (
            <motion.div
              key={reference.name}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${reference.image})` }}
              animate={{
                opacity: activeMaritimeReference === index ? 1 : 0,
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#f4f9ff_0%,rgba(244,249,255,0.9)_17%,rgba(244,249,255,0.42)_40%,rgba(244,249,255,0)_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0)_48%,rgba(15,23,42,0.3)_100%)]" />
        </div>

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative"
            style={{ minHeight: "calc(100vh - 180px)" }}
          >
            <div className="absolute right-0 top-10 z-30 flex items-center gap-2">
              <button
                type="button"
                onClick={showPreviousMaritimeReference}
                aria-label="Önceki denizcilik referansı"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/75 text-slate-900 shadow-sm backdrop-blur-md transition-all hover:-translate-x-0.5 hover:bg-white hover:text-primary"
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={showNextMaritimeReference}
                aria-label="Sonraki denizcilik referansı"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/75 text-slate-900 shadow-sm backdrop-blur-md transition-all hover:translate-x-0.5 hover:bg-white hover:text-primary"
              >
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
            <div
              className="grid lg:grid-cols-[0.48fr_0.52fr]"
              style={{ minHeight: "calc(100vh - 180px)" }}
            >
              <div
                className="relative flex flex-col py-10"
                style={{ minHeight: "calc(100vh - 180px)" }}
              >
                <div>
                  <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-950">
                    Uzmanlık Alanımız
                  </h2>
                  <p className="max-w-md text-sm leading-relaxed text-slate-600">
                    Denizcilik sektöründe finansal süreçleri, raporlama düzenini
                    ve vergi takibini sektöre özel ihtiyaçlarla ele alıyoruz.
                  </p>
                </div>

                <div className="flex flex-1 flex-col justify-center py-8">
                  <motion.div
                    key={activeMaritimeReference}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    <Image
                      src={maritimeReferences[activeMaritimeReference].logo}
                      alt={maritimeReferences[activeMaritimeReference].name}
                      width={180}
                      height={72}
                      className="mb-7 h-14 w-44 object-contain object-left"
                    />
                    <h2 className="mb-4 max-w-xl text-2xl font-bold tracking-tight text-slate-950">
                      {maritimeReferences[activeMaritimeReference].name}
                    </h2>
                    <p className="mb-4 max-w-xl text-base leading-relaxed text-slate-700">
                      {maritimeReferences[activeMaritimeReference].sector}
                    </p>
                    <p className="max-w-xl text-base leading-relaxed text-slate-600">
                      {maritimeReferences[activeMaritimeReference].support}
                    </p>
                  </motion.div>
                </div>

                <div className="flex items-center gap-3">
                  {maritimeReferences.map((reference, index) => (
                    <button
                      key={reference.name}
                      type="button"
                      onClick={() => setActiveMaritimeReference(index)}
                      aria-label={`${reference.name} referansı`}
                      className={`h-3.5 rounded-full transition-all duration-300 ${
                        activeMaritimeReference === index
                          ? "w-16 bg-[#21579f]"
                          : "w-3.5 bg-slate-300 hover:bg-slate-400"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="relative min-h-[320px] overflow-hidden rounded-[1.5rem] lg:hidden">
                {maritimeReferences.map((reference, index) => (
                  <motion.div
                    key={reference.name}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${reference.image})` }}
                    animate={{
                      opacity: activeMaritimeReference === index ? 1 : 0,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                ))}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0)_45%,rgba(255,255,255,0.75)_100%)]" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="neden-biz" className="section bg-white">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.35, ease: "easeOut" }}
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
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
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

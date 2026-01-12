"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { useTranslations } from "next-intl";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [blockScroll, setBlockScroll] = useState(true);
  const [isHoveringHero, setIsHoveringHero] = useState(false);

  // Translations
  const tHero = useTranslations("hero");
  const tServices = useTranslations("services");
  const tWhyUs = useTranslations("whyUs");
  const tContact = useTranslations("contact");
  const tStats = useTranslations("stats");
  const tCertifications = useTranslations("certifications");

  // Mouse throttling için - sadece desktop'ta çalışsın
  const lastMouseUpdate = useRef(0);
  const [isDesktop, setIsDesktop] = useState(false);

  // Splash ekranı için minimum bekleme süresi (2 saniye)
  const splashStartTime = useRef<number | null>(null);
  const animationCompleted = useRef(false);

  // Mouse-following background for hero - sadece desktop'ta
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Spring animasyonlarını daha performanslı yap
  const b1x = useSpring(
    useTransform(mouseX, (v) => v * 0.02),
    { stiffness: 40, damping: 30 }
  );
  const b1y = useSpring(
    useTransform(mouseY, (v) => v * 0.02),
    { stiffness: 40, damping: 30 }
  );
  const b2x = useSpring(
    useTransform(mouseX, (v) => v * -0.015),
    { stiffness: 40, damping: 30 }
  );
  const b2y = useSpring(
    useTransform(mouseY, (v) => v * -0.015),
    { stiffness: 40, damping: 30 }
  );

  // Splash ekranı için minimum 2 saniye bekleme
  useEffect(() => {
    splashStartTime.current = Date.now();
  }, []);

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

  useEffect(() => {
    if (blockScroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [blockScroll]);

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

  return (
    <>
      <AnimatePresence onExitComplete={() => setBlockScroll(false)}>
        {showSplash && (
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
            style={{
              background:
                "radial-gradient(1000px 600px at 10% 10%, rgba(33,87,159,0.25), transparent 60%), radial-gradient(900px 500px at 90% 90%, rgba(33,87,159,0.2), transparent 60%), #000",
            }}
          >
            {/* Decorative animated blobs */}
            <div
              aria-hidden
              className="absolute -top-24 -left-24 w-[360px] h-[360px] rounded-full blur-3xl opacity-70"
              style={{ background: "rgba(33,87,159,0.35)" }}
            />
            <div
              aria-hidden
              className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-60"
              style={{ background: "rgba(33,87,159,0.28)" }}
            />
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0.5 }}
                transition={{ duration: 0.8 }}
                className="w-[80px] h-[80px] md:w-[100px] md:h-[100px] rounded-[10%] overflow-hidden ring-2 ring-white/10 shadow-[0_0_50px_rgba(33,87,159,0.35)]"
              >
                <Image
                  src="/logo.png"
                  alt="Soral Danışmanlık SMMM Logo"
                  width={200}
                  height={200}
                  priority
                  quality={85}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Loading bar under logo */}
              <div className="mt-6 w-[200px] max-w-[70vw]">
                <div className="h-1.5 w-full rounded-full bg-white/15 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-white"
                    initial={{ width: "0%" }}
                    animate={{ width: ["0%", "100%"] }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    onAnimationComplete={() => {
                      animationCompleted.current = true;
                      const elapsed = splashStartTime.current
                        ? Date.now() - splashStartTime.current
                        : 0;
                      const minDuration = 2000; // 2 saniye

                      if (elapsed >= minDuration) {
                        setShowSplash(false);
                      } else {
                        const remaining = minDuration - elapsed;
                        setTimeout(() => {
                          setShowSplash(false);
                        }, remaining);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section
        id="hero"
        className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary to-slate-800 min-h-[100dvh] md:min-h-[100vh] flex items-center pt-20"
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
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-transparent to-slate-900/60 z-10"></div>
          {/* Placeholder for hero image - replace with actual image */}
          <div className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center opacity-10"></div>
          {/* Fallback gradient if image doesn't exist */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-slate-900/50"></div>
        </div>

        {/* Mouse-following spotlight cursor - sadece desktop'ta */}
        {isDesktop && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute z-40 rounded-full ring-1 ring-white/20"
            style={{
              width: 64,
              height: 64,
              left: cursorX,
              top: cursorY,
              marginLeft: -32,
              marginTop: -32,
              opacity: isHoveringHero ? 0.8 : 0,
              background:
                "radial-gradient(closest-side, rgba(255,255,255,0.12), rgba(33,87,159,0.18), transparent 70%)",
              filter: "blur(1px)",
            }}
          />
        )}

        {/* Interactive parallax blobs */}
        {isDesktop ? (
          <>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -top-32 -left-32 w-[320px] h-[320px] rounded-full blur-3xl opacity-60"
              style={{ background: "rgba(33,87,159,0.25)", x: b1x, y: b1y }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 -right-40 w-[420px] h-[420px] rounded-full blur-3xl opacity-50"
              style={{ background: "rgba(33,87,159,0.2)", x: b2x, y: b2y }}
            />
          </>
        ) : (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 -left-32 w-[320px] h-[320px] rounded-full blur-3xl opacity-40"
              style={{ background: "rgba(33,87,159,0.2)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 -right-40 w-[420px] h-[420px] rounded-full blur-3xl opacity-30"
              style={{ background: "rgba(33,87,159,0.15)" }}
            />
          </>
        )}

        <div className="container relative z-30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center lg:text-left"
            >
              {/* Trust Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-yellow-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-sm font-medium text-white">
                  {tHero("trustBadge")}
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
                {tHero("title")}
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {tHero("subtitle")}
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
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
                  className="btn-primary text-lg px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                >
                  {tHero("contactButton")}
                </Link>
                <Link
                  href="#hizmetler"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById("hizmetler");
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
                  className="btn-secondary text-lg px-8 py-4 rounded-lg font-semibold border-2 hover:bg-white hover:text-primary transition-all"
                >
                  {tHero("servicesButton")}
                </Link>
              </div>
            </motion.div>

            {/* Right Column - Image or Visual Element */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                  {/* Gradient overlay for better text readability */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-slate-900/20 z-10"></div>
                  <Image
                    src="/hero-img.png"
                    alt="Soral Danışmanlık - Profesyonel Mali Müşavirlik"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 0vw, 50vw"
                  />
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/30 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-slate-700/30 rounded-full blur-2xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-bold text-center mb-12"
          >
            {tStats("title")}
          </motion.h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-2">
                {tStats("years.value")}
              </div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                {tStats("years.label")}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-2">
                {tStats("clients.value")}
              </div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                {tStats("clients.label")}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-2">
                {tStats("expertise.value")}
              </div>
              <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                {tStats("expertise.label")}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="hizmetler"
        className="section bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {tServices("title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {tServices("subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Service Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {tServices("accounting.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {tServices("accounting.description")}
                </p>
              </div>
            </motion.div>

            {/* Service Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
              className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {tServices("tax.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {tServices("tax.description")}
                </p>
              </div>
            </motion.div>

            {/* Service Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
              className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {tServices("financial.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {tServices("financial.description")}
                </p>
              </div>
            </motion.div>

            {/* Service Card 4 - Profesyonel Web Site Oluşturma */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
              className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {tServices("website.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {tServices("website.description")}
                </p>
              </div>
            </motion.div>

            {/* Service Card 5 - Hukuk Danışmanlığı */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.4, ease: "easeOut" }}
              className="group relative bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {tServices("legal.title")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {tServices("legal.description")}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="neden-biz" className="section bg-white dark:bg-gray-900">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
              >
                {tWhyUs("title")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
              >
                {tWhyUs("subtitle")}
              </motion.p>

              <div className="flex flex-col gap-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="flex items-start group"
                >
                  <div className="bg-gradient-to-br from-primary to-primary/70 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                      {tWhyUs("expertTeam.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {tWhyUs("expertTeam.description")}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                  className="flex items-start group"
                >
                  <div className="bg-gradient-to-br from-primary to-primary/70 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                      {tWhyUs("personalizedService.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {tWhyUs("personalizedService.description")}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                  className="flex items-start group"
                >
                  <div className="bg-gradient-to-br from-primary to-primary/70 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                      {tWhyUs("upToDate.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {tWhyUs("upToDate.description")}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                  className="flex items-start group"
                >
                  <div className="bg-gradient-to-br from-primary to-primary/70 p-3 rounded-xl mr-4 group-hover:scale-110 transition-transform">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                      {tWhyUs("certified.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {tWhyUs("certified.description")}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative mt-8 lg:mt-0"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                {/* Placeholder for professional image */}
                <div className="aspect-[4/3] sm:aspect-[4/3] lg:aspect-[4/3] bg-gradient-to-br from-primary via-primary/90 to-slate-800 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6 sm:p-8 text-white w-full">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 sm:h-12 sm:w-12 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 px-2">
                        {tWhyUs("cta.title")}
                      </h3>
                      <p className="mb-4 sm:mb-6 text-white/90 text-sm sm:text-base px-2">
                        {tWhyUs("cta.description")}
                      </p>
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
                              elementPosition +
                              window.pageYOffset -
                              headerOffset;
                            window.scrollTo({
                              top: Math.max(0, offsetPosition),
                              behavior: "smooth",
                            });
                          }
                        }}
                        className="inline-block bg-white text-slate-900 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold text-sm sm:text-base hover:bg-gray-50 hover:text-primary transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                      >
                        {tWhyUs("cta.button")}
                      </Link>
                    </div>
                  </div>
                  {/* Uncomment when you have the image */}
                  {/* <Image
                    src="/images/why-us.jpg"
                    alt="Neden Biz"
                    fill
                    className="object-cover"
                  /> */}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="section bg-gray-50 dark:bg-gray-800">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {tCertifications("title")}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {tCertifications("subtitle")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {tCertifications("smmm.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {tCertifications("smmm.description")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {tCertifications("iso.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {tCertifications("iso.description")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-2xl text-center border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                {tCertifications("compliance.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {tCertifications("compliance.description")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section
        id="iletisim"
        className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-primary via-primary/95 to-slate-800 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 sm:w-96 sm:h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 px-4">
              {tContact("title")}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed px-4">
              {tContact("subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-stretch sm:items-center px-4">
              <Link
                href="tel:05330318228"
                className="bg-white text-slate-900 px-6 sm:px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-gray-50 hover:text-primary transition-all transform hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-3 shadow-2xl hover:shadow-3xl min-w-[280px] sm:min-w-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-slate-900 group-hover:text-primary transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {tContact("freeConsultation")}
              </Link>
              <Link
                href="mailto:info@soraldanismanlik.com"
                className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-6 sm:px-8 py-4 rounded-xl font-bold text-base sm:text-lg hover:bg-white/20 hover:border-white/50 transition-all transform hover:scale-105 active:scale-95 inline-flex items-center justify-center gap-3 min-w-[280px] sm:min-w-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                E-posta Gönder
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

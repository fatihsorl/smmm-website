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

  // Splash kapanışı artık progress bar tamamlandığında tetiklenecek

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

  // iOS Safari scroll bounce engellemesi
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (e.touches.length > 1) return;

      const target = e.target as Element;
      const scrollableParent = target.closest(".scroll-container, body, html");

      if (!scrollableParent) {
        e.preventDefault();
      }
    };

    if (!isDesktop) {
      document.addEventListener("touchmove", preventDefault, {
        passive: false,
      });

      return () => {
        document.removeEventListener("touchmove", preventDefault);
      };
    }
  }, [isDesktop]);

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
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    onAnimationComplete={() => setShowSplash(false)}
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
        className="relative overflow-hidden bg-gradient-to-br from-dark to-primary min-h-[100dvh] md:min-h-[100vh] flex items-center pt-20"
        style={{ minHeight: "calc(var(--vh, 1vh) * 100)" }}
        {...(isDesktop && {
          onMouseEnter: () => setIsHoveringHero(true),
          onMouseMove: (e: React.MouseEvent) => {
            const now = Date.now();
            if (now - lastMouseUpdate.current < 32) return; // 30fps throttle for better performance
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
        <div className="absolute inset-0 opacity-20"></div>
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
              filter: "blur(1px)", // backdrop-filter yerine daha performanslı blur
            }}
          />
        )}
        {/* Interactive parallax blobs - sadece desktop'ta ve daha az blur */}
        {isDesktop ? (
          <>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -top-32 -left-32 w-[320px] h-[320px] rounded-full blur-2xl opacity-60"
              style={{ background: "rgba(33,87,159,0.2)", x: b1x, y: b1y }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 -right-40 w-[420px] h-[420px] rounded-full blur-2xl opacity-50"
              style={{ background: "rgba(33,87,159,0.18)", x: b2x, y: b2y }}
            />
          </>
        ) : (
          // Mobile için statik arka plan
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 -left-32 w-[320px] h-[320px] rounded-full blur-2xl opacity-40"
              style={{ background: "rgba(33,87,159,0.15)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 -right-40 w-[420px] h-[420px] rounded-full blur-2xl opacity-30"
              style={{ background: "rgba(33,87,159,0.12)" }}
            />
          </>
        )}
        <div className="container relative z-30">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-center select-none transform-gpu"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {tHero("title")}
            </h1>
            <p className="text-xl text-gray-200 mb-8">{tHero("subtitle")}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="#iletisim" className="btn-primary text-lg px-8 py-3">
                {tHero("contactButton")}
              </Link>
              <Link
                href="#hizmetler"
                className="btn-secondary text-lg px-8 py-3"
              >
                {tHero("servicesButton")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="hizmetler" className="section bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="text-center mb-16 select-none">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {tServices("title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {tServices("subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="glass-effect p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
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
              <h3 className="text-xl font-semibold mb-2">
                {tServices("accounting.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {tServices("accounting.description")}
              </p>
            </motion.div>

            {/* Service Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.2, delay: 0.02, ease: "easeOut" }}
              className="glass-effect p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
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
              <h3 className="text-xl font-semibold mb-2">
                {tServices("tax.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {tServices("tax.description")}
              </p>
            </motion.div>

            {/* Service Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.2, delay: 0.04, ease: "easeOut" }}
              className="glass-effect p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
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
              <h3 className="text-xl font-semibold mb-2">
                {tServices("financial.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {tServices("financial.description")}
              </p>
            </motion.div>

            {/* Service Card 4 - Profesyonel Web Site Oluşturma */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.2, delay: 0.06, ease: "easeOut" }}
              className="glass-effect p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3c4.97 0 9 4.03 9 9s-4.03 9-9 9-9-4.03-9-9 4.03-9 9-9zm0 0c2.485 0 4.5 4.03 4.5 9S14.485 21 12 21 7.5 16.97 7.5 12 9.515 3 12 3zm-8.485 8h16.97M4 15h16"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {tServices("website.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {tServices("website.description")}
              </p>
            </motion.div>

            {/* Service Card 5 - Hukuk Danışmanlığı */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.2, delay: 0.08, ease: "easeOut" }}
              className="glass-effect p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6l-2 4-4 2 4 2 2 4 2-4 4-2-4-2-2-4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {tServices("legal.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {tServices("legal.description")}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="neden-biz" className="section">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.3 }}
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                {tWhyUs("title")}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                className="text-gray-600 dark:text-gray-400 mb-8"
              >
                {tWhyUs("subtitle")}
              </motion.p>

              <div className="flex flex-col gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex items-start"
                >
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary"
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
                    <h3 className="text-lg font-semibold mb-1">
                      {tWhyUs("expertTeam.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {tWhyUs("expertTeam.description")}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.2, delay: 0.02, ease: "easeOut" }}
                  className="flex items-start"
                >
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary"
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
                    <h3 className="text-lg font-semibold mb-1">
                      {tWhyUs("personalizedService.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {tWhyUs("personalizedService.description")}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.2, delay: 0.04, ease: "easeOut" }}
                  className="flex items-start"
                >
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary"
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
                    <h3 className="text-lg font-semibold mb-1">
                      {tWhyUs("upToDate.title")}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {tWhyUs("upToDate.description")}
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-dark/80 rounded-lg"></div>
                <div className="relative z-10 p-8 text-white h-full flex flex-col justify-center select-none">
                  <h3 className="text-2xl font-bold mb-4">
                    {tWhyUs("cta.title")}
                  </h3>
                  <p className="mb-6">{tWhyUs("cta.description")}</p>
                  <Link href="#iletisim" className="btn-primary w-fit">
                    {tWhyUs("cta.button")}
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section id="iletisim" className="py-10 bg-primary mb-15">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {tContact("title")}
          </h2>
          <p className="text-xl text-white/80 mb-20 max-w-3xl mx-auto">
            {tContact("subtitle")}
          </p>
          <Link
            href="tel:05330318228"
            className="btn-primary p-3! inline-flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {tContact("freeConsultation")}
          </Link>
        </div>
      </section>
    </>
  );
}

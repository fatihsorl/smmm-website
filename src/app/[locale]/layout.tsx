import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { locales, type Locale } from "@/i18n/config";
import { notFound } from "next/navigation";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Soral Danışmanlık - Serbest Muhasebeci Mali Müşavir",
  description: "Soral Danışmanlık - Profesyonel Mali Müşavirlik Hizmetleri",
  other: {
    "scroll-behavior": "manual",
  },
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params in Next.js 15
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages({ locale });

  return (
    <html lang={locale} className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('scrollRestoration' in history) {
                history.scrollRestoration = 'manual';
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased ios-scroll-fix">
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="flex-grow ios-scroll-fix">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

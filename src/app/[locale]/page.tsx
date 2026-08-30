import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HomePage from "@/components/home/HomePage";
import { buildPageMetadata } from "@/lib/seo";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const tSeo = await getTranslations({ locale, namespace: "seo" });

  return buildPageMetadata({
    locale,
    title: tSeo("homeTitle"),
    description: tSeo("homeDescription"),
    siteName: tSeo("siteName"),
  });
}

export default function Page() {
  return <HomePage />;
}

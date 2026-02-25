import { prisma } from "@/lib/prisma";
import { METALS } from "@/lib/metals";
import PublicPageClient from "@/components/public/PublicPageClient";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Daily Metal-to-Copper Ratios | Precious Metals India",
  description:
    "Live and historical precious metal ratios relative to copper. Track Gold, Silver, Platinum, Palladium, Rhodium, Iridium, Osmium, Ruthenium and Mercury ratios updated daily.",
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://precime.com",
  },
};

async function getData() {
  const latestRatio = await prisma.metalRatio.findFirst({ orderBy: { date: "desc" } });
  return { latestRatio };
}

export default async function HomePage() {
  const { latestRatio } = await getData();

  return (
    <PublicPageClient
      initialRatio={latestRatio}
      metals={METALS}
    />
  );
}



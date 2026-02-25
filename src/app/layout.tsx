import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Precious Metals India | Daily Metal-to-Copper Ratios",
    template: "%s | Precious Metals India",
  },
  description:
    "Track daily precious metal ratios relative to copper. Gold, Silver, Platinum, Palladium and more — updated daily for Indian investors. Visit precime.com",
  keywords: ["precious metals", "metal ratio", "gold copper ratio", "silver ratio", "platinum", "palladium", "India"],
  openGraph: {
    title: "Precious Metals India | Daily Metal-to-Copper Ratios",
    description: "Track daily precious metal ratios relative to copper, updated daily for Indian investors.",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://precime.com",
    siteName: "Precious Metals India",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Precious Metals India",
    description: "Daily precious metal ratios relative to copper for Indian investors.",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://precime.com"),
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
    shortcut: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}

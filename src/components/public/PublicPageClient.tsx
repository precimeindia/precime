"use client";

import { useState } from "react";
import Image from "next/image";
import { Metal, formatRatio, formatDate } from "@/lib/metals";
import MetalRatioCards from "./MetalRatioCards";
import HistoryView from "./HistoryView";
import AnalogueClock from "./AnalogueClock";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface MetalRatio {
  id: string;
  date: string;
  Au: number; Ag: number; Pt: number; Pd: number;
  Rh: number; Ir: number; Os: number; Ru: number;
  Hg: number; Cu: number;
  updatedAt: string;
}

interface FAQ { id: string; question: string; answer: string; order: number }
interface BlogLink { id: string; title: string; url: string; order: number }

interface Props {
  initialRatio: MetalRatio | null;
  metals: Metal[];
}


export default function PublicPageClient({
  initialRatio,
  metals,
}: Props) {
  const [activeTab, setActiveTab] = useState<"latest" | "7d" | "30d" | "custom">("latest");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Precious Metals India Logo"
              width={38}
              height={38}
              className="rounded-full"
              priority
            />
            <div>
              <h1 className="text-lg font-bold text-gold-gradient leading-none">Precious Metals India</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 pulse-gold"></div>
            <span className="text-xs text-muted-foreground hidden sm:block">Daily Updated</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
        <div className="text-center mb-8">
          <Badge variant="outline" className="mb-4 text-[#d4af37] border-[#d4af37]/30 bg-[#d4af37]/5">
            Metal-to-Copper Ratios
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3">
            <span className="text-gold-gradient">Daily Precious Metal</span>
            <br />
            <span className="text-foreground">Ratios vs Copper</span>
          </h2>

        </div>

        {/* History Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {[
            { key: "latest", label: "Latest" },
            { key: "7d", label: "Last 7 Days" },
            { key: "30d", label: "Last 30 Days" },
            { key: "custom", label: "Custom Range" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-[#d4af37] text-black shadow-lg shadow-[#d4af37]/20"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-[#d4af37]/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === "latest" ? (
          <div className="animate-fade-in-up">
            {initialRatio ? (
              <>
                <div className="flex items-center justify-center gap-3 mb-6 text-sm text-muted-foreground">
                  <span>Last Updated:</span>
                  <span className="text-[#d4af37] font-medium">{formatDate(initialRatio.date)}</span>
                  <span className="text-xs">·</span>
                  <span>{new Date(initialRatio.updatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} IST</span>
                </div>
                <MetalRatioCards ratio={initialRatio} metals={metals} />
              </>
            ) : (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg">No ratio data available yet.</p>
                <p className="text-sm mt-2 text-muted-foreground/60">Check back soon — admin will publish ratios shortly.</p>
              </div>
            )}
          </div>
        ) : (
          <HistoryView activeTab={activeTab} />
        )}
      </section>

      <Separator className="max-w-7xl mx-auto my-8 opacity-30" />

      {/* Clock */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-center">
          <h2 className="text-xl font-semibold mb-4 text-foreground text-center">Market Time (IST)</h2>
          <AnalogueClock />
        </div>
      </section>

    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { formatRatio, formatDate, toISODate, METALS } from "@/lib/metals";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";

interface MetalRatio {
  id: string; date: string;
  Au: number; Ag: number; Pt: number; Pd: number;
  Rh: number; Ir: number; Os: number; Ru: number;
  Hg: number; Cu: number;
}

interface Props {
  activeTab: "7d" | "30d" | "custom";
}

export default function HistoryView({ activeTab }: Props) {
  const [ratios, setRatios] = useState<MetalRatio[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedDate, setExpandedDate] = useState<string | null>(null);
  const [customFrom, setCustomFrom] = useState<Date | undefined>();
  const [customTo, setCustomTo] = useState<Date | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let url = "/api/ratios";
        const today = new Date();

        if (activeTab === "7d") {
          const from = new Date(today);
          from.setDate(from.getDate() - 6);
          url = `/api/ratios?from=${toISODate(from)}&to=${toISODate(today)}`;
        } else if (activeTab === "30d") {
          const from = new Date(today);
          from.setDate(from.getDate() - 29);
          url = `/api/ratios?from=${toISODate(from)}&to=${toISODate(today)}`;
        } else if (activeTab === "custom" && customFrom && customTo) {
          url = `/api/ratios?from=${toISODate(customFrom)}&to=${toISODate(customTo)}`;
        } else if (activeTab === "custom") {
          setLoading(false);
          return;
        }

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setRatios(Array.isArray(data) ? data : [data]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab, customFrom, customTo]);

  const nonCuMetals = METALS.filter((m) => !m.isBase);

  if (activeTab === "custom" && !customFrom) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-6">Select a date range to view historical ratios</p>
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
          <div>
            <p className="text-xs text-muted-foreground mb-2 text-left">From Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-44 justify-start gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {customFrom ? toISODate(customFrom) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={customFrom}
                  onSelect={setCustomFrom}
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2 text-left">To Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-44 justify-start gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {customTo ? toISODate(customTo) : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={customTo}
                  onSelect={setCustomTo}
                  disabled={(date) => date > new Date() || (customFrom ? date < customFrom : false)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-xl shimmer" />
        ))}
      </div>
    );
  }

  if (!ratios.length) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <p>No historical data found for this period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 animate-fade-in-up">
      {/* Custom range date pickers at top when both are set */}
      {activeTab === "custom" && (
        <div className="flex flex-wrap gap-3 mb-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <CalendarIcon className="w-3 h-3" />
                From: {customFrom ? toISODate(customFrom) : "—"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={customFrom} onSelect={setCustomFrom} disabled={(d) => d > new Date()} /></PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 text-xs">
                <CalendarIcon className="w-3 h-3" />
                To: {customTo ? toISODate(customTo) : "—"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={customTo} onSelect={setCustomTo} disabled={(d) => d > new Date() || (customFrom ? d < customFrom : false)} /></PopoverContent>
          </Popover>
        </div>
      )}

      {/* Scrollable summary table */}
      <div className="overflow-x-auto rounded-xl border border-border/50">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-border bg-card/80">
              <th className="sticky left-0 bg-card z-10 text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider min-w-[120px]">Date</th>
              {nonCuMetals.map((m) => (
                <th key={m.symbol} className="text-right px-3 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{m.symbol}</th>
              ))}
              <th className="text-right px-3 py-3 text-xs font-semibold text-[#b87333] uppercase tracking-wider">Cu</th>
              <th className="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {ratios.map((ratio, i) => (
              <>
                <tr
                  key={ratio.date}
                  className={`border-b border-border/30 last:border-0 cursor-pointer table-row-hover transition-colors ${i % 2 === 0 ? "bg-card/20" : "bg-transparent"}`}
                  onClick={() => setExpandedDate(expandedDate === ratio.date ? null : ratio.date)}
                >
                  <td className="sticky left-0 bg-inherit px-4 py-3 font-medium text-foreground">{formatDate(ratio.date)}</td>
                  {nonCuMetals.map((m) => (
                    <td key={m.symbol} className="px-3 py-3 text-right font-mono text-[#d4af37] text-xs">{formatRatio(ratio[m.symbol as keyof typeof ratio] as number)}</td>
                  ))}
                  <td className="px-3 py-3 text-right font-mono text-[#b87333] text-xs font-bold">1.0000</td>
                  <td className="px-3 py-3 text-right text-muted-foreground">
                    {expandedDate === ratio.date ? <ChevronUp className="w-4 h-4 ml-auto" /> : <ChevronDown className="w-4 h-4 ml-auto" />}
                  </td>
                </tr>
                {expandedDate === ratio.date && (
                  <tr key={ratio.date + "-detail"} className="bg-card/40 border-b border-border/30">
                    <td colSpan={10 + 2} className="px-4 py-4">
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {METALS.map((m) => (
                          <div key={m.symbol} className="bg-card border border-border/50 rounded-lg p-3">
                            <p className="text-xs text-muted-foreground">{m.name} ({m.symbol})</p>
                            <p className={`text-base font-bold font-mono mt-1 ${m.isBase ? "text-[#b87333]" : "text-[#d4af37]"}`}>
                              {formatRatio(ratio[m.symbol as keyof typeof ratio] as number)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground text-center">Click any row to expand details. Showing {ratios.length} day(s) of data.</p>
    </div>
  );
}

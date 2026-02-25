"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ArrowLeft, Download, CalendarIcon, FileSpreadsheet } from "lucide-react";
import { toISODate } from "@/lib/metals";
import { toast } from "sonner";

type Range = "7" | "30" | "custom";

function ExportPanel({ type, label }: { type: "ratios" | "logs"; label: string }) {
  const [range, setRange] = useState<Range>("7");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);

  const buildUrl = () => {
    const base = `/api/admin/export/${type}`;
    if (range === "custom") {
      if (!fromDate || !toDate) return null;
      return `${base}?from=${toISODate(fromDate)}&to=${toISODate(toDate)}`;
    }
    return `${base}?days=${range}`;
  };

  const handleDownload = async () => {
    const url = buildUrl();
    if (!url) { toast.error("Please select both from and to dates"); return; }
    setLoading(true);
    try {
      const res = await fetch(url);
      if (!res.ok) { toast.error("Export failed"); return; }
      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="(.+?)"/);
      const filename = match?.[1] || `${type}-export.csv`;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
      toast.success("Downloaded successfully!");
    } catch {
      toast.error("Download error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileSpreadsheet className="w-4 h-4 text-[#d4af37]" />
        <h2 className="text-base font-bold">{label}</h2>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="text-xs text-muted-foreground mb-1.5 block">Date Range</Label>
          <Select value={range} onValueChange={(v) => setRange(v as Range)}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {range === "custom" && (
          <div className="flex gap-3 flex-wrap">
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">From</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 text-xs">
                    <CalendarIcon className="w-3 h-3" />
                    {fromDate ? toISODate(fromDate) : "Select"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={fromDate} onSelect={setFromDate} disabled={(d) => d > new Date()} />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground mb-1.5 block">To</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 text-xs">
                    <CalendarIcon className="w-3 h-3" />
                    {toDate ? toISODate(toDate) : "Select"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={toDate} onSelect={setToDate} disabled={(d) => d > new Date() || (fromDate ? d < fromDate : false)} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        <Button
          onClick={handleDownload}
          disabled={loading}
          className="w-full bg-[#d4af37] hover:bg-[#b8860b] text-black font-semibold gap-2"
        >
          <Download className="w-4 h-4" />
          {loading ? "Preparing..." : "Download CSV"}
        </Button>
      </div>
    </div>
  );
}

export default function AdminExportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin")} className="gap-2 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />Dashboard
          </Button>
          <div>
            <p className="text-sm font-bold">Export Data</p>
            <p className="text-[11px] text-muted-foreground">Download ratios and audit logs as CSV</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <ExportPanel type="ratios" label="Export Ratios" />
          <ExportPanel type="logs" label="Export Audit Logs" />
        </div>

        <div className="mt-6 p-4 rounded-xl border border-border/30 bg-card/20">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">CSV format:</strong> Ratios include date, all 10 metal ratios, and timestamps.
            Logs include log ID, createdAt, affected date, note, and old/new values as JSON columns.
            Open in Excel, Google Sheets, or any CSV-compatible application.
          </p>
        </div>
      </main>
    </div>
  );
}

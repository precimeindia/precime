"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { METALS, formatDate } from "@/lib/metals";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";

interface Log {
  id: string;
  metalRatioId: string;
  date: string;
  note: string | null;
  oldValues: string;
  newValues: string;
  createdAt: string;
}

function DiffCell({ oldVal, newVal, symbol }: { oldVal: number | undefined; newVal: number | undefined; symbol: string }) {
  const changed = oldVal !== undefined && newVal !== undefined && Math.abs((oldVal || 0) - (newVal || 0)) > 0.00001;
  if (newVal === undefined) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <div className={`text-xs font-mono ${changed ? "text-amber-400" : "text-foreground"}`}>
      {symbol === "Cu" ? "1.0000" : (newVal || 0).toFixed(4)}
      {changed && oldVal !== undefined && (
        <div className="text-[10px] text-muted-foreground line-through">{(oldVal || 0).toFixed(4)}</div>
      )}
    </div>
  );
}

export default function AdminLogsPage() {
  const router = useRouter();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/logs")
      .then((r) => r.json())
      .then((d) => setLogs(d))
      .finally(() => setLoading(false));
  }, []);

  const nonCuMetals = METALS.filter((m) => !m.isBase);

  return (
    <div className="min-h-screen">
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/admin")} className="gap-2 text-xs">
            <ArrowLeft className="w-3.5 h-3.5" />Dashboard
          </Button>
          <div>
            <p className="text-sm font-bold">Audit Logs</p>
            <p className="text-[11px] text-muted-foreground">Read-only history of all ratio updates</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading logs...</div>
        ) : !logs.length ? (
          <div className="text-center py-20 text-muted-foreground">No logs yet.</div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">{logs.length} update{logs.length !== 1 ? "s" : ""} found. Click a row to expand. Amber values indicate changes.</p>
            {logs.map((log) => {
              const oldV = JSON.parse(log.oldValues || "{}");
              const newV = JSON.parse(log.newValues || "{}");
              const isExpanded = expandedLog === log.id;

              return (
                <div key={log.id} className="bg-card border border-border/50 rounded-xl overflow-hidden">
                  <div
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 cursor-pointer hover:bg-card/80 transition-colors"
                    onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium">{formatDate(log.date)}</p>
                        <p className="text-[11px] text-muted-foreground">{new Date(log.createdAt).toLocaleString("en-IN")}</p>
                      </div>
                      {log.note && <Badge variant="outline" className="text-[10px]">{log.note}</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      {Object.keys(oldV).length === 0 && <Badge variant="secondary" className="text-[10px]">Initial Entry</Badge>}
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-border/30 p-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs min-w-[600px]">
                          <thead>
                            <tr className="border-b border-border/30">
                              {METALS.map((m) => (
                                <th key={m.symbol} className={`text-center py-2 px-3 font-medium ${m.isBase ? "text-[#b87333]" : "text-muted-foreground"}`}>{m.symbol}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              {METALS.map((m) => (
                                <td key={m.symbol} className="text-center py-3 px-3">
                                  <DiffCell
                                    symbol={m.symbol}
                                    oldVal={oldV[m.symbol]}
                                    newVal={newV[m.symbol] ?? (m.isBase ? 1.0 : undefined)}
                                  />
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

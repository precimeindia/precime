"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { METALS, toISODate } from "@/lib/metals";
import { LogOut, Save, FileText, Download, Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface RatioForm {
  Au: string; Ag: string; Pt: string; Pd: string;
  Rh: string; Ir: string; Os: string; Ru: string; Hg: string; Cu: string;
}

const defaultForm: RatioForm = { Au: "", Ag: "", Pt: "", Pd: "", Rh: "", Ir: "", Os: "", Ru: "", Hg: "", Cu: "1" };

export default function AdminDashboard() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  const [form, setForm] = useState<RatioForm>(defaultForm);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingRatio, setLoadingRatio] = useState(false);

  // Scheduling state
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(toISODate(new Date()));
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [pendingSchedules, setPendingSchedules] = useState<any[]>([]);

  const loadPendingSchedules = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/ratios?status=scheduled");
      if (res.ok) setPendingSchedules(await res.json());
    } catch { /* empty */ }
  }, []);

  const loadRatioForDate = useCallback(async (date: string) => {
    setLoadingRatio(true);
    try {
      const res = await fetch(`/api/admin/ratios?date=${date}`);
      if (res.ok) {
        const data = await res.json();
        if (data) {
          setForm({
            Au: String(data.Au), Ag: String(data.Ag), Pt: String(data.Pt),
            Pd: String(data.Pd), Rh: String(data.Rh), Ir: String(data.Ir),
            Os: String(data.Os), Ru: String(data.Ru), Hg: String(data.Hg),
            Cu: String(data.Cu ?? 1),
          });
          if (data.publishAt && new Date(data.publishAt) > new Date()) {
            setIsScheduled(true);
            // Format UTC from DB to IST string for inputs (approximate simple way)
            const d = new Date(data.publishAt);
            const istOffset = 5.5 * 60 * 60 * 1000;
            const localISOTime = new Date(d.getTime() + istOffset).toISOString().slice(0, 16);
            setScheduleDate(localISOTime.split("T")[0]);
            setScheduleTime(localISOTime.split("T")[1]);
          } else {
            setIsScheduled(false);
          }
        } else {
          setForm(defaultForm);
          setIsScheduled(false);
        }
      }
    } catch { /* empty */ } finally {
      setLoadingRatio(false);
    }
  }, []);

  useEffect(() => { loadRatioForDate(selectedDate); }, [selectedDate, loadRatioForDate]);
  useEffect(() => { loadPendingSchedules(); }, [loadPendingSchedules]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let publishAtIso = null;
      if (isScheduled) {
        if (!scheduleDate || !scheduleTime) {
          setSaving(false);
          return toast.error("Please enter a schedule date and time");
        }
        // Construct IST datetime string and convert to UTC ISO String
        const dateTimeStr = `${scheduleDate}T${scheduleTime}:00+05:30`;
        const publishDateObj = new Date(dateTimeStr);
        if (publishDateObj <= new Date()) {
          setSaving(false);
          return toast.error("Schedule time must be in the future");
        }
        publishAtIso = publishDateObj.toISOString();
      }

      const body = {
        date: selectedDate,
        Au: parseFloat(form.Au) || 0,
        Ag: parseFloat(form.Ag) || 0,
        Pt: parseFloat(form.Pt) || 0,
        Pd: parseFloat(form.Pd) || 0,
        Rh: parseFloat(form.Rh) || 0,
        Ir: parseFloat(form.Ir) || 0,
        Os: parseFloat(form.Os) || 0,
        Ru: parseFloat(form.Ru) || 0,
        Hg: parseFloat(form.Hg) || 0,
        Cu: parseFloat(form.Cu) || 1,
        note: note || undefined,
        publishAt: publishAtIso,
      };

      const res = await fetch("/api/admin/ratios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(isScheduled ? "Ratios scheduled successfully!" : "Ratios saved and published immediately!");
        setNote("");
        if (isScheduled) loadPendingSchedules();
      } else {
        toast.error(data.error || "Save failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSchedule = async (date: string) => {
    if (!confirm(`Are you sure you want to delete the scheduled update for ${date}?`)) return;
    
    try {
      const res = await fetch(`/api/admin/ratios?date=${date}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Schedule deleted successfully");
        loadPendingSchedules();
        if (selectedDate === date) loadRatioForDate(date);
      } else {
        toast.error("Failed to delete schedule");
      }
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Admin Nav */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="PM Logo" 
              className="w-8 h-8 object-contain" 
            />
            <div>
              <p className="text-sm font-bold">Admin Dashboard</p>
              <p className="text-[11px] text-muted-foreground">Precious Metals India</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => router.push("/admin/logs")}>
              <FileText className="w-3.5 h-3.5" />Logs
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => router.push("/admin/export")}>
              <Download className="w-3.5 h-3.5" />Export
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-xs text-muted-foreground hover:text-foreground" onClick={handleLogout}>
              <LogOut className="w-3.5 h-3.5" />Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Ratio Editor */}
        <section className="bg-card border border-border/50 rounded-2xl p-6 lg:col-span-2 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold">Metal Ratios Manager</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Enter ratio values relative to Copper (Cu = 1.0000)</p>
            </div>
            <div className="flex items-center gap-3">
              <Label htmlFor="date-picker" className="text-xs text-muted-foreground">Target Data Date:</Label>
              <Input
                id="date-picker"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-40 text-sm bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {METALS.map((metal) => (
              <div key={metal.symbol} className="space-y-1.5">
                <Label className="text-xs font-medium flex items-center gap-1.5">
                  <span>{metal.name}</span>
                  <span className="text-muted-foreground font-mono">({metal.symbol})</span>
                  {metal.isBase && <Badge variant="outline" className="text-[10px] text-[#b87333] border-[#b87333]/30 h-4">BASE</Badge>}
                </Label>
                <Input
                  type="number"
                  step="0.0001"
                  min="0"
                  value={form[metal.symbol as keyof RatioForm]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [metal.symbol]: e.target.value }))}
                  disabled={loadingRatio}
                  placeholder="0.0000"
                  className={`font-mono text-sm ${metal.isBase ? "bg-background border-[#b87333]/50 focus-visible:ring-[#b87333]" : "bg-background"}`}
                />
              </div>
            ))}
          </div>

          <div className="mb-6 space-y-4 border-t border-border/50 pt-6 mt-2">
            <div>
              <Label htmlFor="note" className="text-xs font-medium text-muted-foreground mb-1.5 block">Audit Update Note (optional)</Label>
              <Textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Adjusted for MCX closing prices, pending validation..."
                className="text-sm resize-none h-16 bg-background"
                maxLength={500}
              />
            </div>

            <div className="bg-background/50 border border-border/50 rounded-xl p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Schedule Update</Label>
                  <p className="text-xs text-muted-foreground">Delay publishing these metrics until a specific time</p>
                </div>
                <Switch 
                  checked={isScheduled} 
                  onCheckedChange={setIsScheduled} 
                  className="data-[state=checked]:bg-[#d4af37]"
                />
              </div>

              {isScheduled && (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Publish Date</Label>
                    <Input 
                      type="date" 
                      value={scheduleDate} 
                      onChange={(e) => setScheduleDate(e.target.value)} 
                      min={toISODate(new Date())}
                      className="w-36 h-9 text-xs" 
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-muted-foreground">Publish Time (IST)</Label>
                    <Input 
                      type="time" 
                      value={scheduleTime} 
                      onChange={(e) => setScheduleTime(e.target.value)} 
                      className="w-32 h-9 text-xs" 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || loadingRatio}
            className={`w-full sm:w-auto text-black font-semibold gap-2 ${isScheduled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-[#d4af37] hover:bg-[#b8860b]'}`}
          >
            {saving ? (
              <span className="flex items-center gap-2">Saving...</span>
            ) : isScheduled ? (
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Schedule Publish</span>
            ) : (
              <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save & Publish Now</span>
            )}
          </Button>
        </section>

        {/* Right Column: Pending Schedules */}
        <section className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm h-fit">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-blue-500" />
            <h2 className="text-base font-bold">Pending Schedules</h2>
          </div>
          
          <div className="space-y-3">
            {pendingSchedules.length > 0 ? (
              pendingSchedules.map((schedule) => (
                <div key={schedule.id} className="bg-background/50 border border-border/50 rounded-lg p-3 text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground">Data Date: {schedule.date}</span>
                    <Badge variant="secondary" className="text-[10px] bg-blue-500/10 text-blue-500 border-blue-500/20">Pending</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Goes live on:</p>
                    <p className="font-medium text-foreground">
                      {format(new Date(schedule.publishAt), "PP 'at' p")} (IST)
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 h-7 text-[11px]"
                      onClick={() => {
                        setSelectedDate(schedule.date);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Edit 
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[11px] text-red-500 hover:text-red-600 hover:bg-red-500/10 border-border/50"
                      onClick={() => handleDeleteSchedule(schedule.date)}
                      title="Delete Schedule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="w-8 h-8 opacity-20 mx-auto mb-3" />
                <p className="text-xs">No pending scheduled updates.</p>
                <p className="text-[10px] opacity-70 mt-1">Updates set to the future will appear here.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

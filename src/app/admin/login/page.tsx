"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Logged in successfully");
        router.push("/admin");
        router.refresh();
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8860b] flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">
            PM
          </div>
          <h1 className="text-2xl font-bold text-gold-gradient">Precious Metals India</h1>
          <p className="text-muted-foreground text-sm mt-1">Admin Dashboard</p>
        </div>

        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-xl shadow-black/30">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Secure Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-xs font-medium text-muted-foreground mb-1.5 block">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoComplete="username"
                className="bg-background border-border/50 focus:border-[#d4af37]/50 focus:ring-[#d4af37]/20"
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-xs font-medium text-muted-foreground mb-1.5 block">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="bg-background border-border/50 focus:border-[#d4af37]/50 focus:ring-[#d4af37]/20"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#d4af37] hover:bg-[#b8860b] text-black font-semibold"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground/50 mt-6">
            Protected area. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}

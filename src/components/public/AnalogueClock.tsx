"use client";

import { useEffect, useRef } from "react";

const istTimeFormatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

function getIstTimeParts(date: Date) {
  const parts = istTimeFormatter.formatToParts(date);

  return {
    hr: Number(parts.find((part) => part.type === "hour")?.value ?? "0") % 12,
    mn: Number(parts.find((part) => part.type === "minute")?.value ?? "0"),
    sc: Number(parts.find((part) => part.type === "second")?.value ?? "0"),
  };
}

export default function AnalogueClock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeOffsetMs = useRef<number>(0);

  useEffect(() => {
    // Sync with accurate world time to eliminate local device drift
    fetch("https://worldtimeapi.org/api/timezone/Asia/Kolkata")
      .then((res) => {
        if (!res.ok) throw new Error(`Time sync failed with status ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const trueTime = new Date(data.datetime).getTime();
        timeOffsetMs.current = trueTime - Date.now();
      })
      .catch(() => console.log("Time sync failed, falling back to local client time"));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    function draw() {
      if (!ctx || !canvas) return;
      const size = canvas.width;
      const cx = size / 2;
      const cy = size / 2;
      const r = (size / 2) * 0.88;

      ctx.clearRect(0, 0, size, size);

      // Background
      const bgGrad = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
      bgGrad.addColorStop(0, "#1a1a1f");
      bgGrad.addColorStop(1, "#0f0f11");
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fillStyle = bgGrad;
      ctx.fill();

      // Outer ring (gold)
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Hour markers
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI * 2) / 12 - Math.PI / 2;
        const isQuarter = i % 3 === 0;
        const innerR = isQuarter ? r * 0.80 : r * 0.86;
        const outerR = r * 0.92;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * innerR, cy + Math.sin(angle) * innerR);
        ctx.lineTo(cx + Math.cos(angle) * outerR, cy + Math.sin(angle) * outerR);
        ctx.strokeStyle = isQuarter ? "#d4af37" : "#71717a";
        ctx.lineWidth = isQuarter ? 2 : 1;
        ctx.stroke();
      }

      // True IST time Calculation
      const trueNowMs = Date.now() + timeOffsetMs.current;
      const trueDateObj = new Date(trueNowMs);

      const { hr, mn, sc } = getIstTimeParts(trueDateObj);

      // Hour hand
      const hrAngle = ((hr + mn / 60) * Math.PI * 2) / 12;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(hrAngle);
      ctx.beginPath();
      ctx.moveTo(0, r * 0.05);
      ctx.lineTo(0, -r * 0.52);
      ctx.strokeStyle = "#fafafa";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();

      // Minute hand
      const mnAngle = ((mn + sc / 60) * Math.PI * 2) / 60;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(mnAngle);
      ctx.beginPath();
      ctx.moveTo(0, r * 0.07);
      ctx.lineTo(0, -r * 0.72);
      ctx.strokeStyle = "#fafafa";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();

      // Second hand (gold)
      const scAngle = (sc * Math.PI * 2) / 60;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(scAngle);
      ctx.beginPath();
      ctx.moveTo(0, r * 0.15);
      ctx.lineTo(0, -r * 0.80);
      ctx.strokeStyle = "#d4af37";
      ctx.lineWidth = 1.5;
      ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();

      // Center dot
      ctx.beginPath();
      ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#d4af37";
      ctx.fill();

      // IST label
      ctx.fillStyle = "#71717a";
      ctx.font = `${size * 0.06}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText("IST", cx, cy + r * 0.55);

      animId = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={180}
        height={180}
        className="rounded-full border border-border/50"
        aria-label="Analogue clock showing IST"
      />
      <p className="text-xs text-muted-foreground">Indian Standard Time</p>
    </div>
  );
}

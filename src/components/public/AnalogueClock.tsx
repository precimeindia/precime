"use client";

import { useEffect, useRef } from "react";

export default function AnalogueClock() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

      // IST time
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      const istMs = utcMs + 5.5 * 3600000;
      const ist = new Date(istMs);
      const hr = ist.getHours() % 12;
      const mn = ist.getMinutes();
      const sc = ist.getSeconds();

      // Hour hand
      const hrAngle = ((hr + mn / 60) * Math.PI * 2) / 12 - Math.PI / 2;
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
      const mnAngle = ((mn + sc / 60) * Math.PI * 2) / 60 - Math.PI / 2;
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
      const scAngle = (sc * Math.PI * 2) / 60 - Math.PI / 2;
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

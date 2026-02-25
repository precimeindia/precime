"use client";

import { Metal, formatRatio } from "@/lib/metals";

interface MetalRatio {
  id: string; date: string;
  Au: number; Ag: number; Pt: number; Pd: number;
  Rh: number; Ir: number; Os: number; Ru: number;
  Hg: number; Cu: number;
}

interface Props {
  ratio: MetalRatio;
  metals: Metal[];
}

// Periodic table data per metal
const elementData: Record<string, { atomicNum: number; color: string; bgColor: string; borderColor: string }> = {
  Au: { atomicNum: 79,  color: "#d4af37", bgColor: "rgba(212,175,55,0.12)",  borderColor: "rgba(212,175,55,0.35)" },
  Ag: { atomicNum: 47,  color: "#c0c0c0", bgColor: "rgba(192,192,192,0.12)", borderColor: "rgba(192,192,192,0.35)" },
  Pt: { atomicNum: 78,  color: "#a8c4d4", bgColor: "rgba(168,196,212,0.12)", borderColor: "rgba(168,196,212,0.35)" },
  Pd: { atomicNum: 46,  color: "#b0a0d0", bgColor: "rgba(176,160,208,0.12)", borderColor: "rgba(176,160,208,0.35)" },
  Rh: { atomicNum: 45,  color: "#e8a090", bgColor: "rgba(232,160,144,0.12)", borderColor: "rgba(232,160,144,0.35)" },
  Ir: { atomicNum: 77,  color: "#60c8a8", bgColor: "rgba(96,200,168,0.12)",  borderColor: "rgba(96,200,168,0.35)"  },
  Os: { atomicNum: 76,  color: "#60c0d8", bgColor: "rgba(96,192,216,0.12)",  borderColor: "rgba(96,192,216,0.35)"  },
  Ru: { atomicNum: 44,  color: "#e8b060", bgColor: "rgba(232,176,96,0.12)",  borderColor: "rgba(232,176,96,0.35)"  },
  Hg: { atomicNum: 80,  color: "#e87878", bgColor: "rgba(232,120,120,0.12)", borderColor: "rgba(232,120,120,0.35)" },
  Cu: { atomicNum: 29,  color: "#b87333", bgColor: "rgba(184,115,51,0.15)",  borderColor: "rgba(184,115,51,0.4)"   },
};

function ElementTile({ symbol, size = 40 }: { symbol: string; size?: number }) {
  const el = elementData[symbol];
  if (!el) return null;
  const fontSize = size * 0.38;
  const numSize = size * 0.18;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <rect
        x="1" y="1"
        width={size - 2}
        height={size - 2}
        rx={size * 0.18}
        fill={el.bgColor}
        stroke={el.borderColor}
        strokeWidth="1.2"
      />
      {/* Atomic number */}
      <text
        x={size * 0.5}
        y={size * 0.3}
        textAnchor="middle"
        fontSize={numSize}
        fontFamily="Inter, system-ui, sans-serif"
        fill={el.color}
        opacity="0.7"
      >
        {el.atomicNum}
      </text>
      {/* Symbol */}
      <text
        x={size * 0.5}
        y={size * 0.68}
        textAnchor="middle"
        fontSize={fontSize}
        fontWeight="700"
        fontFamily="Inter, system-ui, sans-serif"
        fill={el.color}
      >
        {symbol}
      </text>
    </svg>
  );
}

const metalColors: Record<string, string> = {
  Au: "from-yellow-500/10 to-yellow-600/5 border-yellow-500/20",
  Ag: "from-slate-400/10 to-slate-500/5 border-slate-400/20",
  Pt: "from-blue-300/10 to-blue-400/5 border-blue-300/20",
  Pd: "from-purple-400/10 to-purple-500/5 border-purple-400/20",
  Rh: "from-rose-400/10 to-rose-500/5 border-rose-400/20",
  Ir: "from-teal-400/10 to-teal-500/5 border-teal-400/20",
  Os: "from-cyan-400/10 to-cyan-500/5 border-cyan-400/20",
  Ru: "from-orange-400/10 to-orange-500/5 border-orange-400/20",
  Hg: "from-red-400/10 to-red-500/5 border-red-400/20",
  Cu: "from-[#b87333]/20 to-[#b87333]/10 border-[#b87333]/30",
};



export default function MetalRatioCards({ ratio, metals }: Props) {
  return (
    <>
      {/* Mobile: Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:hidden gap-3">
        {metals.map((metal) => {
          const value = ratio[metal.symbol as keyof typeof ratio] as number;
          return (
            <div
              key={metal.symbol}
              className={`rounded-xl border bg-gradient-to-br p-4 ${metalColors[metal.symbol]} ${metal.isBase ? "col-span-2 sm:col-span-1" : ""}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2">
                  <ElementTile symbol={metal.symbol} size={36} />
                  <div>
                    <p className="text-xs text-muted-foreground">{metal.name}</p>
                    <p className="text-sm font-bold text-foreground">{metal.symbol}</p>
                  </div>
                </div>
                {metal.isBase && (
                  <span className="text-[10px] bg-[#b87333]/20 text-[#b87333] border border-[#b87333]/30 rounded px-1.5 py-0.5 font-medium">
                    BASE
                  </span>
                )}
              </div>
              <p className="text-xl font-bold font-mono tracking-tight" style={{ color: metal.isBase ? "#b87333" : undefined }}>
                {formatRatio(value)}
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">× copper</p>
            </div>
          );
        })}
      </div>

      {/* Desktop: Table */}
      <div className="hidden lg:block overflow-hidden rounded-xl border border-border/50">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-card/80">
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Metal</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Symbol</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ratio vs Copper</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Base</th>
            </tr>
          </thead>
          <tbody>
            {metals.map((metal, i) => {
              const value = ratio[metal.symbol as keyof typeof ratio] as number;
              return (
                <tr
                  key={metal.symbol}
                  className={`table-row-hover border-b border-border/30 last:border-0 transition-colors ${i % 2 === 0 ? "bg-card/20" : "bg-transparent"}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <ElementTile symbol={metal.symbol} size={38} />
                      <span className="font-medium text-foreground">{metal.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-muted-foreground">{metal.symbol}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-lg font-bold font-mono ${metal.isBase ? "text-[#b87333]" : "text-[#d4af37]"}`}>
                      {formatRatio(value)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {metal.isBase && (
                      <span className="text-[10px] bg-[#b87333]/20 text-[#b87333] border border-[#b87333]/30 rounded px-2 py-1 font-medium">
                        BASE
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

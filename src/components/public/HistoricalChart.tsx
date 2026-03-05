"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { Metal, METALS } from "@/lib/metals";

interface MetalRatio {
  id: string;
  date: string;
  Au: number; Ag: number; Pt: number; Pd: number;
  Rh: number; Ir: number; Os: number; Ru: number;
  Hg: number; Cu: number;
  [key: string]: any;
}

interface HistoricalChartProps {
  data: MetalRatio[];
}

const colors: Record<string, string> = {
  Au: "#d4af37",
  Ag: "#c0c0c0",
  Pt: "#a8c4d4",
  Pd: "#b0a0d0",
  Rh: "#e8a090",
  Ir: "#60c8a8",
  Os: "#60c0d8",
  Ru: "#e8b060",
  Hg: "#e87878",
  Cu: "#b87333",
};

export default function HistoricalChart({ data }: HistoricalChartProps) {
  // Select default metals to show based on standard user interest
  const [activeMetals, setActiveMetals] = useState<Record<string, boolean>>({
    Au: true,
    Ag: true,
    Pt: true,
    Pd: false,
    Rh: false,
    Ir: false,
    Os: false,
    Ru: false,
    Hg: false,
  });

  const chartData = useMemo(() => {
    // Recharts draws left to right, we want oldest to newest
    // The data comes newest to oldest, so we reverse a copy
    const reversed = [...data].reverse();
    return reversed.map(item => {
      // Create a clean date format (e.g. "Mar 5")
      const d = new Date(item.date);
      const shortDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        ...item,
        displayDate: shortDate
      };
    });
  }, [data]);

  const toggleMetal = (symbol: string) => {
    setActiveMetals(prev => ({
      ...prev,
      [symbol]: !prev[symbol]
    }));
  };

  const activeNonCuMetals = METALS.filter(m => !m.isBase);

  if (!data || data.length === 0) return null;

  return (
    <div className="w-full bg-card/30 border border-border/50 rounded-xl p-4 sm:p-6 mb-6">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-foreground">Metal Ratios (vs Copper)</h3>
          <p className="text-xs text-muted-foreground">Click the legend below to show/hide specific metals on the chart.</p>
        </div>
      </div>

      <div className="h-[350px] sm:h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="displayDate" 
              stroke="rgba(255,255,255,0.3)" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "rgba(255,255,255,0.5)" }}
              dy={10}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.3)" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "rgba(255,255,255,0.5)" }}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "rgba(10, 10, 10, 0.9)", 
                borderColor: "rgba(212, 175, 55, 0.3)",
                borderRadius: "8px",
                color: "#fff",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
              }}
              itemStyle={{ fontSize: "14px", fontWeight: "bold" }}
              labelStyle={{ color: "rgba(255,255,255,0.6)", marginBottom: "4px", fontSize: "12px" }}
              formatter={(value: any, name: any) => [
                Number(value).toLocaleString("en-IN", { maximumFractionDigits: 4 }), 
                name
              ]}
            />
            <Legend 
              content={(props) => {
                return (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-4 border-t border-border/30">
                    {activeNonCuMetals.map((metal) => {
                      const isActive = activeMetals[metal.symbol];
                      return (
                        <button
                          key={metal.symbol}
                          onClick={() => toggleMetal(metal.symbol)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            isActive 
                              ? "bg-card border border-border/80 text-foreground shadow-sm" 
                              : "bg-transparent border border-transparent text-muted-foreground opacity-50 hover:opacity-100 hover:bg-card/50"
                          } `}
                        >
                          <div 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ 
                              backgroundColor: isActive ? colors[metal.symbol] || "#fff" : "transparent", 
                              border: `1px solid ${colors[metal.symbol]}` 
                            }} 
                          />
                          {metal.symbol}
                        </button>
                      );
                    })}
                  </div>
                );
              }}
            />
            
            {activeNonCuMetals.map((metal) => (
              activeMetals[metal.symbol] && (
                <Line
                  key={metal.symbol}
                  type="monotone"
                  dataKey={metal.symbol}
                  name={metal.name}
                  stroke={colors[metal.symbol] || "#fff"}
                  strokeWidth={2}
                  dot={{ r: 3, fill: colors[metal.symbol], strokeWidth: 0 }}
                  activeDot={{ r: 5, strokeWidth: 0, fill: colors[metal.symbol] }}
                  animationDuration={1500}
                />
              )
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

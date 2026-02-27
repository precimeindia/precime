export interface Metal {
  symbol: string;
  name: string;
  isBase: boolean;
}

export const METALS: Metal[] = [
  { symbol: "Au", name: "Gold", isBase: false },
  { symbol: "Ag", name: "Silver", isBase: false },
  { symbol: "Pt", name: "Platinum", isBase: false },
  { symbol: "Pd", name: "Palladium", isBase: false },
  { symbol: "Rh", name: "Rhodium", isBase: false },
  { symbol: "Ir", name: "Iridium", isBase: false },
  { symbol: "Os", name: "Osmium", isBase: false },
  { symbol: "Ru", name: "Ruthenium", isBase: false },
  { symbol: "Hg", name: "Mercury", isBase: false },
  { symbol: "Cu", name: "Copper", isBase: true },
];

export const METAL_SYMBOLS = METALS.map((m) => m.symbol) as (
  | "Au"
  | "Ag"
  | "Pt"
  | "Pd"
  | "Rh"
  | "Ir"
  | "Os"
  | "Ru"
  | "Hg"
  | "Cu"
)[];

export type MetalSymbol = "Au" | "Ag" | "Pt" | "Pd" | "Rh" | "Ir" | "Os" | "Ru" | "Hg" | "Cu";

export function formatRatio(value: number): string {
  if (value >= 1) return parseFloat(value.toFixed(4)).toString();
  return parseFloat(value.toFixed(6)).toString();
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

import { usdToEtb } from "@/data/company";

export const formatUsd = (n: number) =>
  `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;

export const formatEtb = (usd: number) =>
  `ETB ${usdToEtb(usd).toLocaleString("en-US")}`;

/** "8 Days / 7 Nights" */
export const formatDuration = (days: number, nights: number) =>
  `${days} Day${days === 1 ? "" : "s"} / ${nights} Night${nights === 1 ? "" : "s"}`;

export const difficultyColor: Record<string, string> = {
  Easy: "bg-green-100 text-green-800",
  Moderate: "bg-amber-100 text-amber-800",
  Challenging: "bg-red-100 text-red-800",
};

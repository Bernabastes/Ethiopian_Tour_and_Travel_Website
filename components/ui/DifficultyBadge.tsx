import { difficultyColor } from "@/lib/format";

export function DifficultyBadge({ level }: { level: string }) {
  return (
    <span className={`badge ${difficultyColor[level] ?? "bg-black/10 text-ink"}`}>
      {level}
    </span>
  );
}

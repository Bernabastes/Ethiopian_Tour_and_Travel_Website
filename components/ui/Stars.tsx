import { Star } from "lucide-react";

export function Stars({
  rating,
  count,
  size = 16,
  showNumber = true,
}: {
  rating: number;
  count?: number;
  size?: number;
  showNumber?: boolean;
}) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="inline-flex items-center gap-1" aria-label={`Rated ${rating} out of 5`}>
      <span className="inline-flex">
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full || (i === full && half);
          return (
            <Star
              key={i}
              width={size}
              height={size}
              className={filled ? "fill-brand-gold text-brand-gold" : "fill-none text-black/25"}
            />
          );
        })}
      </span>
      {showNumber && <span className="text-sm font-semibold text-ink/80">{rating.toFixed(1)}</span>}
      {typeof count === "number" && (
        <span className="text-sm text-ink/50">({count})</span>
      )}
    </span>
  );
}

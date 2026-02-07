"use client";

interface StarRatingProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const SIZE_MAP = {
  sm: "text-base",
  md: "text-xl",
  lg: "text-2xl",
};

export function StarRating({
  rating,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
}: StarRatingProps) {
  return (
    <div className={`flex gap-0.5 ${SIZE_MAP[size]}`}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            className={`${
              interactive
                ? "cursor-pointer hover:scale-110 transition-transform"
                : "cursor-default"
            } ${filled ? "text-wine" : "text-ink/20"}`}
            aria-label={`${i + 1} ${i + 1 === 1 ? "ster" : "sterren"}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

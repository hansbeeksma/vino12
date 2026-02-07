interface StoryProgressBarProps {
  total: number;
  current: number;
  className?: string;
}

export function StoryProgressBar({
  total,
  current,
  className = "",
}: StoryProgressBarProps) {
  return (
    <div className={`flex gap-1 ${className}`}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex-1 h-1 bg-champagne/30 overflow-hidden">
          <div
            className={`h-full ${
              i < current
                ? "bg-champagne w-full"
                : i === current
                  ? "bg-champagne w-1/2"
                  : "w-0"
            }`}
          />
        </div>
      ))}
    </div>
  );
}

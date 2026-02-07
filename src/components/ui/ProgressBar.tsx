interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
  height?: string;
}

export function ProgressBar({
  value,
  max = 5,
  color = "bg-wine",
  className = "",
  height = "h-3",
}: ProgressBarProps) {
  const percentage = (value / max) * 100;

  return (
    <div
      className={`w-full bg-champagne border-2 border-ink ${height} ${className}`}
    >
      <div
        className={`${color} ${height}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

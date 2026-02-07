import type { BodyLevel } from "@/lib/types";
import { bodyToNumber } from "@/lib/utils";

interface BodyScaleProps {
  body: BodyLevel;
  color?: string;
  className?: string;
}

export function BodyScale({
  body,
  color = "bg-wine",
  className = "",
}: BodyScaleProps) {
  const level = bodyToNumber(body);

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="font-accent text-[10px] uppercase tracking-widest text-ink/50 w-12">
        Body
      </span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 border-2 border-ink ${
              i <= level ? color : "bg-champagne"
            }`}
          />
        ))}
      </div>
      <span className="font-accent text-[10px] uppercase tracking-widest text-ink/50">
        {body}
      </span>
    </div>
  );
}

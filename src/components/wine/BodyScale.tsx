interface BodyScaleProps {
  body: string;
  color?: string;
  className?: string;
}

const bodyMap: Record<string, number> = {
  Light: 1,
  "Light-Medium": 2,
  Medium: 3,
  "Medium-Full": 4,
  Full: 5,
};

export function BodyScale({
  body,
  color = "bg-wine",
  className = "",
}: BodyScaleProps) {
  const level = bodyMap[body] ?? 0;

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

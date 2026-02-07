interface TastingProfileProps {
  notes: string;
  className?: string;
}

export function TastingProfile({ notes, className = "" }: TastingProfileProps) {
  if (!notes) return null;

  const lines = notes.split("\n").filter(Boolean);

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="font-accent text-[10px] uppercase tracking-widest text-wine mb-2">
        Proefnotities
      </h4>
      <div className="flex flex-wrap gap-1">
        {lines.map((note) => (
          <span
            key={note}
            className="font-body text-base bg-champagne px-2 py-0.5 border border-ink"
          >
            {note}
          </span>
        ))}
      </div>
    </div>
  );
}

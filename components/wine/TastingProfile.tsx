import type { TastingNote } from "@/lib/types";

interface TastingProfileProps {
  notes: TastingNote;
  className?: string;
}

export function TastingProfile({ notes, className = "" }: TastingProfileProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <div>
        <h4 className="font-accent text-[10px] uppercase tracking-widest text-wine mb-2">
          Neus
        </h4>
        <div className="flex flex-wrap gap-1">
          {notes.nose.map((note) => (
            <span
              key={note}
              className="font-body text-base bg-champagne px-2 py-0.5 border border-ink"
            >
              {note}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-accent text-[10px] uppercase tracking-widest text-wine mb-2">
          Smaak
        </h4>
        <div className="flex flex-wrap gap-1">
          {notes.palate.map((note) => (
            <span
              key={note}
              className="font-body text-base bg-champagne px-2 py-0.5 border border-ink"
            >
              {note}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-accent text-[10px] uppercase tracking-widest text-wine mb-2">
          Afdronk
        </h4>
        <p className="font-body text-base">{notes.finish}</p>
      </div>
    </div>
  );
}

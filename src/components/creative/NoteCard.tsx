interface Note {
  id: string;
  title: string | null;
  content: string;
  note_type: string;
  created_at: string;
  updated_at: string;
}

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  return (
    <div className="border-2 border-ink bg-offwhite p-4">
      <div className="flex items-start justify-between mb-2">
        {note.title ? (
          <h3 className="font-display text-sm font-bold text-ink">
            {note.title}
          </h3>
        ) : (
          <span className="font-accent text-[9px] uppercase tracking-widest text-ink/30">
            Notitie
          </span>
        )}
        <button
          onClick={() => onDelete(note.id)}
          className="font-accent text-[10px] text-ink/30 hover:text-wine shrink-0 ml-2"
          aria-label="Verwijder notitie"
        >
          x
        </button>
      </div>
      <p className="font-body text-sm text-ink whitespace-pre-wrap">
        {note.content}
      </p>
      <p className="font-accent text-[9px] uppercase tracking-widest text-ink/20 mt-3">
        {new Date(note.updated_at).toLocaleDateString("nl-NL", {
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
}

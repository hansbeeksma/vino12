import Link from "next/link";

interface Board {
  id: string;
  title: string;
  description: string | null;
  color: string;
  is_archived: boolean;
  created_at: string;
}

export function BoardCard({ board }: { board: Board }) {
  return (
    <Link
      href={`/admin/creative/boards/${board.id}`}
      className="border-2 border-ink bg-offwhite p-4 hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_rgba(0,0,0,0.8)] transition-all block"
    >
      <div className="h-2 w-12 mb-3" style={{ backgroundColor: board.color }} />
      <h3 className="font-display text-base font-bold text-ink mb-1">
        {board.title}
      </h3>
      {board.description && (
        <p className="font-body text-xs text-ink/50 line-clamp-2">
          {board.description}
        </p>
      )}
      <p className="font-accent text-[9px] uppercase tracking-widest text-ink/30 mt-3">
        {new Date(board.created_at).toLocaleDateString("nl-NL")}
      </p>
    </Link>
  );
}

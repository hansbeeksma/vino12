export default function Loading() {
  return (
    <div className="bg-offwhite min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block w-8 h-8 border-4 border-ink border-t-wine animate-spin" />
        <p className="font-accent text-xs uppercase tracking-widest text-ink/50 mt-4">
          Laden...
        </p>
      </div>
    </div>
  );
}

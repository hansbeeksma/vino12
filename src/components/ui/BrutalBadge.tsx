interface BrutalBadgeProps {
  children: React.ReactNode;
  variant?: "wine" | "emerald" | "ink" | "champagne";
  className?: string;
}

export function BrutalBadge({
  children,
  variant = "ink",
  className = "",
}: BrutalBadgeProps) {
  const variants = {
    wine: "bg-wine text-champagne border-wine",
    emerald: "bg-emerald text-champagne border-emerald",
    ink: "bg-ink text-offwhite border-ink",
    champagne: "bg-champagne text-ink border-ink",
  };

  return (
    <span
      className={`inline-block px-3 py-1 font-accent text-xs font-bold uppercase tracking-widest border-2 ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

interface PremiumBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function PremiumBadge({ children, className = "" }: PremiumBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 font-accent text-[10px] uppercase tracking-widest bg-gold text-ink border-2 border-gold-700 brutal-shadow ${className}`}
    >
      {children}
    </span>
  );
}

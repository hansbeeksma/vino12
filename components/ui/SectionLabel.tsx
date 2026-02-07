interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function SectionLabel({ children, className = "" }: SectionLabelProps) {
  return (
    <div
      className={`font-accent text-xs font-bold uppercase tracking-[0.3em] text-wine mb-4 ${className}`}
    >
      {children}
    </div>
  );
}

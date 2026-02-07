interface BrutalCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  borderColor?: string;
}

export function BrutalCard({
  children,
  className = "",
  hover = true,
  borderColor = "border-ink",
}: BrutalCardProps) {
  return (
    <div
      className={`border-brutal ${borderColor} brutal-shadow bg-offwhite ${
        hover ? "brutal-hover" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface BrutalCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  borderColor?: string;
}

export function BrutalCard({
  children,
  className = "",
  hover = true,
  glow = false,
  borderColor = "border-ink",
}: BrutalCardProps) {
  return (
    <div
      className={`border-brutal ${borderColor} brutal-shadow bg-offwhite ${
        hover ? "brutal-hover" : ""
      } ${
        glow
          ? "transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(212,175,55,0.3),4px_4px_0px_rgba(0,0,0,0.8)]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

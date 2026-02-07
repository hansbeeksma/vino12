"use client";

interface BrutalButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  href?: string;
}

export function BrutalButton({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  href,
}: BrutalButtonProps) {
  const base =
    "font-accent font-bold uppercase tracking-wider border-brutal border-ink brutal-shadow brutal-hover inline-block text-center cursor-pointer";

  const variants = {
    primary: "bg-wine text-champagne hover:bg-burgundy",
    secondary: "bg-emerald text-champagne hover:bg-ink",
    outline: "bg-transparent text-ink hover:bg-ink hover:text-offwhite",
  };

  const sizes = {
    sm: "px-4 py-2.5 md:py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

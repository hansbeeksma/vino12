"use client";

interface MarqueeStripProps {
  text: string;
  className?: string;
  speed?: number;
}

export function MarqueeStrip({
  text,
  className = "",
  speed = 20,
}: MarqueeStripProps) {
  const repeated = Array(10).fill(text).join(" — ");

  return (
    <div
      className={`overflow-hidden border-y-brutal border-ink bg-ink text-champagne py-3 ${className}`}
    >
      <div
        className="whitespace-nowrap font-accent text-xs sm:text-sm font-bold uppercase tracking-widest animate-marquee"
        style={{
          animation: `marquee ${speed}s linear infinite`,
        }}
      >
        {repeated}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}

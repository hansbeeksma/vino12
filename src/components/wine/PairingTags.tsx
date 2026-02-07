import { BrutalBadge } from "@/components/ui/BrutalBadge";

interface PairingTagsProps {
  pairings: string[];
  className?: string;
}

export function PairingTags({ pairings, className = "" }: PairingTagsProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {pairings.map((pairing) => (
        <BrutalBadge key={pairing} variant="champagne">
          {pairing}
        </BrutalBadge>
      ))}
    </div>
  );
}

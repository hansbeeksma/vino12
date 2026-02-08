"use client";

import { useEffect, useState } from "react";

interface Badge {
  slug: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earned_at: string | null;
  progress: number;
  target: number;
}

const ICON_MAP: Record<string, string> = {
  "shopping-bag": "🛍️",
  wine: "🍷",
  star: "⭐",
  award: "🏆",
  map: "🗺️",
  heart: "❤️",
  compass: "🧭",
};

export function BadgeDisplay() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/gamification/badges");
        const json = await res.json();
        if (json.success) {
          setBadges(json.data);
        }
      } catch {
        // Non-critical
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return null;
  if (badges.length === 0) return null;

  const earned = badges.filter((b) => b.earned);
  const unearned = badges.filter((b) => !b.earned);

  return (
    <div className="space-y-4">
      {earned.length > 0 && (
        <div>
          <h3 className="font-accent text-[10px] uppercase tracking-widest text-ink/40 mb-2">
            Verdiende Badges
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {earned.map((badge) => (
              <div
                key={badge.slug}
                className="border-2 border-wine p-3 text-center bg-wine/5"
              >
                <span className="text-2xl">{ICON_MAP[badge.icon] ?? "🏅"}</span>
                <p className="font-body text-xs font-bold text-ink mt-1">
                  {badge.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {unearned.length > 0 && (
        <div>
          <h3 className="font-accent text-[10px] uppercase tracking-widest text-ink/40 mb-2">
            Nog te Verdienen
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {unearned.map((badge) => (
              <div
                key={badge.slug}
                className="border-2 border-ink/10 p-3 text-center opacity-60"
              >
                <span className="text-2xl grayscale">
                  {ICON_MAP[badge.icon] ?? "🏅"}
                </span>
                <p className="font-body text-xs text-ink mt-1">{badge.name}</p>
                <div className="mt-1 h-1 bg-ink/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-wine rounded-full"
                    style={{
                      width: `${Math.min(100, (badge.progress / badge.target) * 100)}%`,
                    }}
                  />
                </div>
                <p className="font-body text-[10px] text-ink/40 mt-0.5">
                  {badge.progress}/{badge.target}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

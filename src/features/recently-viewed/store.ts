import { create } from "zustand";
import { persist } from "zustand/middleware";

const MAX_RECENT = 6;

interface RecentlyViewedState {
  slugs: string[];
  addViewed: (slug: string) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      slugs: [],

      addViewed: (slug: string) =>
        set((state) => {
          const filtered = state.slugs.filter((s) => s !== slug);
          return { slugs: [slug, ...filtered].slice(0, MAX_RECENT) };
        }),

      clear: () => set({ slugs: [] }),
    }),
    { name: "vino12-recently-viewed" },
  ),
);

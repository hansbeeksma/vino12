import type { WineType, WineBody } from "@/lib/schemas/wine";

const BODY_COLORS: Record<string, Record<string, string>> = {
  red: {
    light: "#9B1B30",
    medium_light: "#872232",
    medium: "#722F37",
    medium_full: "#5B1A2A",
    full: "#4B0000",
  },
  white: {
    light: "#E8DCA0",
    medium_light: "#D9CC80",
    medium: "#C9B860",
    medium_full: "#B5A040",
    full: "#A09030",
  },
  rose: {
    light: "#F4C2C2",
    medium_light: "#E8A0BF",
    medium: "#D87CAB",
    medium_full: "#C76097",
    full: "#B54583",
  },
  sparkling: {
    light: "#F0D97A",
    medium_light: "#E6C54A",
    medium: "#D4AF37",
    medium_full: "#B8942E",
    full: "#9A7A25",
  },
  dessert: {
    light: "#E8C05A",
    medium_light: "#D4A930",
    medium: "#C68E17",
    medium_full: "#A87510",
    full: "#8A5D0A",
  },
  fortified: {
    light: "#A0724A",
    medium_light: "#94603A",
    medium: "#8B4513",
    medium_full: "#6E3510",
    full: "#52280C",
  },
  orange: {
    light: "#E8A050",
    medium_light: "#DA8E3A",
    medium: "#CC7722",
    medium_full: "#B06618",
    full: "#945510",
  },
};

export function bodyColor(type: WineType, body: WineBody | null): string {
  const bodyKey = body ?? "medium";
  return BODY_COLORS[type]?.[bodyKey] ?? BODY_COLORS.red.medium;
}

export function bodyGradient(type: WineType): { light: string; full: string } {
  const colors = BODY_COLORS[type] ?? BODY_COLORS.red;
  return { light: colors.light, full: colors.full };
}

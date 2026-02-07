import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { WineType, WineBody } from "@/lib/schemas/wine";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(priceCents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(priceCents / 100);
}

export function formatPriceShort(priceCents: number): string {
  return `€${(priceCents / 100).toFixed(2).replace(".", ",")}`;
}

const TYPE_COLOR_MAP: Record<WineType, string> = {
  red: "#722F37",
  white: "#00674F",
  rose: "#E8A0BF",
  sparkling: "#D4AF37",
  dessert: "#C68E17",
  fortified: "#8B4513",
  orange: "#CC7722",
};

export function typeColorHex(type: WineType): string {
  return TYPE_COLOR_MAP[type] ?? "#722F37";
}

const TYPE_LABEL_MAP: Record<WineType, string> = {
  red: "Rood",
  white: "Wit",
  rose: "Rosé",
  sparkling: "Mousseux",
  dessert: "Dessert",
  fortified: "Versterkt",
  orange: "Oranje",
};

export function typeLabel(type: WineType): string {
  return TYPE_LABEL_MAP[type] ?? type;
}

const BODY_LABEL_MAP: Record<WineBody, string> = {
  light: "Licht",
  medium_light: "Licht-Medium",
  medium: "Medium",
  medium_full: "Medium-Vol",
  full: "Vol",
};

export function bodyLabel(body: WineBody | null): string {
  if (!body) return "Medium";
  return BODY_LABEL_MAP[body] ?? body;
}

const BODY_NUMBER_MAP: Record<WineBody, number> = {
  light: 1,
  medium_light: 2,
  medium: 3,
  medium_full: 4,
  full: 5,
};

export function bodyToNumber(body: WineBody | null): number {
  if (!body) return 3;
  return BODY_NUMBER_MAP[body] ?? 3;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ñ]/g, "n")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

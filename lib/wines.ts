import type { Wine } from "./types";
import winesData from "../data/wines.json";

export const wines: Wine[] = winesData as Wine[];

export function getWineBySlug(slug: string): Wine | undefined {
  return wines.find((w) => w.slug === slug);
}

export function getRedWines(): Wine[] {
  return wines.filter((w) => w.color === "red");
}

export function getWhiteWines(): Wine[] {
  return wines.filter((w) => w.color === "white");
}

export function getTotalPrice(): number {
  return wines.reduce((sum, w) => sum + w.price, 0);
}

export function getAveragePrice(): number {
  return Math.round((getTotalPrice() / wines.length) * 100) / 100;
}

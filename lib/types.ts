export type WineColor = "red" | "white";

export type BottleShape = "bordeaux" | "bourgogne" | "rhone" | "flute";

export type BodyLevel =
  | "Light"
  | "Light-Medium"
  | "Medium"
  | "Medium-Full"
  | "Full";

export interface TastingNote {
  nose: string[];
  palate: string[];
  finish: string;
}

export interface Wine {
  id: number;
  name: string;
  grape: string;
  region: string;
  country: string;
  countryCode: string;
  color: WineColor;
  body: BodyLevel;
  price: number;
  year: number;
  alcohol: string;
  description: string;
  tastingNotes: TastingNote;
  pairings: string[];
  funFact: string;
  slug: string;
  bottleShape: BottleShape;
  image: string;
}

export interface WineCollection {
  name: string;
  tagline: string;
  totalPrice: number;
  averagePrice: number;
  wines: Wine[];
}

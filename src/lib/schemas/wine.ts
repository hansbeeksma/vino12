import { z } from "zod";

export const wineTypeSchema = z.enum([
  "red",
  "white",
  "rose",
  "sparkling",
  "dessert",
  "fortified",
  "orange",
]);

export const wineBodySchema = z.enum([
  "light",
  "medium_light",
  "medium",
  "medium_full",
  "full",
]);

export const regionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  country: z.string(),
  description: z.string().nullable(),
});

export const grapeSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  percentage: z.number().optional(),
});

export const producerSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  region_id: z.string().uuid().nullable(),
  description: z.string().nullable(),
  website: z.string().nullable(),
});

export const wineSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  type: wineTypeSchema,
  body: wineBodySchema.nullable(),
  producer_id: z.string().uuid().nullable(),
  region_id: z.string().uuid().nullable(),
  vintage: z.number().nullable(),
  alcohol_percentage: z.number().nullable(),
  price_cents: z.number().int(),
  compare_at_price_cents: z.number().int().nullable(),
  sku: z.string().nullable(),
  image_url: z.string().nullable(),
  thumbnail_url: z.string().nullable(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  tasting_notes: z.string().nullable(),
  food_pairing: z.string().nullable(),
  serving_temperature: z.string().nullable(),
  stock_quantity: z.number().int(),
  volume_ml: z.number().int(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const wineWithRelationsSchema = wineSchema.extend({
  region: regionSchema.nullable().optional(),
  grapes: z.array(grapeSchema).optional(),
});

export type WineType = z.infer<typeof wineTypeSchema>;
export type WineBody = z.infer<typeof wineBodySchema>;
export type Wine = z.infer<typeof wineSchema>;
export type WineWithRelations = z.infer<typeof wineWithRelationsSchema>;
export type Region = z.infer<typeof regionSchema>;
export type Grape = z.infer<typeof grapeSchema>;
export type Producer = z.infer<typeof producerSchema>;

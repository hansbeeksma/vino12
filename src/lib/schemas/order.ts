import { z } from "zod";

export const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
]);

export const paymentStatusSchema = z.enum([
  "pending",
  "paid",
  "failed",
  "expired",
  "cancelled",
  "refunded",
  "partially_refunded",
]);

export const addressSchema = z.object({
  street: z.string().min(1, "Straat is verplicht"),
  house_number: z.string().min(1, "Huisnummer is verplicht"),
  house_number_addition: z.string().optional(),
  postal_code: z
    .string()
    .regex(/^\d{4}\s?[A-Z]{2}$/, "Ongeldig postcodenummer (bijv. 1234 AB)"),
  city: z.string().min(1, "Plaats is verplicht"),
  country: z.string().default("NL"),
});

export const orderItemSchema = z.object({
  id: z.string().uuid(),
  order_id: z.string().uuid(),
  wine_id: z.string().uuid(),
  wine_name: z.string(),
  wine_vintage: z.number().nullable(),
  quantity: z.number().int().positive(),
  unit_price_cents: z.number().int(),
  total_cents: z.number().int(),
});

export const orderSchema = z.object({
  id: z.string().uuid(),
  order_number: z.string(),
  customer_id: z.string().uuid().nullable(),
  email: z.string().email(),
  status: orderStatusSchema,
  payment_status: paymentStatusSchema,
  mollie_payment_id: z.string().nullable(),
  subtotal_cents: z.number().int(),
  shipping_cents: z.number().int(),
  discount_cents: z.number().int(),
  total_cents: z.number().int(),
  notes: z.string().nullable(),
  age_verified: z.boolean(),
  tracking_number: z.string().nullable(),
  tracking_url: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type OrderStatus = z.infer<typeof orderStatusSchema>;
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;
export type Address = z.infer<typeof addressSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Order = z.infer<typeof orderSchema>;

import { z } from "zod";

export const checkoutSchema = z.object({
  email: z.string().email("Ongeldig e-mailadres"),
  firstName: z.string().min(1, "Voornaam is verplicht"),
  lastName: z.string().min(1, "Achternaam is verplicht"),
  phone: z.string().optional(),
  shippingAddress: z.object({
    street: z.string().min(1, "Straat is verplicht"),
    houseNumber: z.string().min(1, "Huisnummer is verplicht"),
    houseNumberAddition: z.string().optional(),
    postalCode: z
      .string()
      .regex(/^\d{4}\s?[A-Z]{2}$/, "Ongeldig postcodenummer (bijv. 1234 AB)"),
    city: z.string().min(1, "Plaats is verplicht"),
    country: z.string().default("NL"),
  }),
  sameAsBilling: z.boolean().default(true),
  billingAddress: z
    .object({
      street: z.string().optional(),
      houseNumber: z.string().optional(),
      postalCode: z.string().optional(),
      city: z.string().optional(),
      country: z.string().optional(),
    })
    .optional(),
  ageVerified: z.literal(true, {
    error: "Je moet bevestigen dat je 18 jaar of ouder bent",
  }),
  notes: z.string().optional(),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export type PaymentMethod = "ideal" | "creditcard" | "bancontact" | "paypal";

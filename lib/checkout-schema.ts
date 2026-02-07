import { z } from 'zod'

export const checkoutSchema = z.object({
  email: z.string().min(1, 'E-mailadres is verplicht').email('Voer een geldig e-mailadres in'),

  firstName: z
    .string()
    .min(1, 'Voornaam is verplicht')
    .max(50, 'Voornaam mag maximaal 50 tekens zijn'),

  lastName: z
    .string()
    .min(1, 'Achternaam is verplicht')
    .max(50, 'Achternaam mag maximaal 50 tekens zijn'),

  phone: z
    .string()
    .min(1, 'Telefoonnummer is verplicht')
    .regex(
      /^(\+31|0)[1-9]\d{8}$/,
      'Voer een geldig Nederlands telefoonnummer in (bijv. 0612345678)',
    ),

  street: z
    .string()
    .min(1, 'Straatnaam is verplicht')
    .max(100, 'Straatnaam mag maximaal 100 tekens zijn'),

  houseNumber: z
    .string()
    .min(1, 'Huisnummer is verplicht')
    .max(10, 'Huisnummer mag maximaal 10 tekens zijn'),

  houseNumberAddition: z
    .string()
    .max(10, 'Toevoeging mag maximaal 10 tekens zijn')
    .optional()
    .default(''),

  postalCode: z
    .string()
    .min(1, 'Postcode is verplicht')
    .regex(/^[1-9]\d{3}\s?[A-Za-z]{2}$/, 'Voer een geldige postcode in (bijv. 1234 AB)'),

  city: z.string().min(1, 'Plaats is verplicht').max(50, 'Plaats mag maximaal 50 tekens zijn'),

  ageConfirmed: z.literal(true, {
    error: 'Je moet bevestigen dat je 18 jaar of ouder bent',
  }),

  termsAccepted: z.literal(true, {
    error: 'Je moet akkoord gaan met de algemene voorwaarden',
  }),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>

export const checkoutDefaults: CheckoutFormData = {
  email: '',
  firstName: '',
  lastName: '',
  phone: '',
  street: '',
  houseNumber: '',
  houseNumberAddition: '',
  postalCode: '',
  city: '',
  ageConfirmed: true,
  termsAccepted: true,
}

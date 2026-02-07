"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/features/cart/store";
import { formatPrice } from "@/lib/utils";
import { BrutalButton } from "@/components/ui/BrutalButton";

export default function AfrekenenPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const subtotal_cents = useCartStore((s) => s.subtotal_cents);
  const shipping_cents = useCartStore((s) => s.shipping_cents);
  const total_cents = useCartStore((s) => s.total_cents);
  const item_count = useCartStore((s) => s.item_count);
  const clearCart = useCartStore((s) => s.clearCart);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("ideal");
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    street: "",
    houseNumber: "",
    houseNumberAddition: "",
    postalCode: "",
    city: "",
    ageVerified: false,
    notes: "",
  });

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone || undefined,
          shippingAddress: {
            street: form.street,
            houseNumber: form.houseNumber,
            houseNumberAddition: form.houseNumberAddition || undefined,
            postalCode: form.postalCode.toUpperCase(),
            city: form.city,
            country: "NL",
          },
          ageVerified: true,
          notes: form.notes || undefined,
          items: items.map((item) => ({
            wine_id: item.wine_id,
            name: item.name,
            vintage: item.vintage,
            price_cents: item.price_cents,
            quantity: item.quantity,
          })),
          subtotal_cents,
          shipping_cents,
          total_cents,
          paymentMethod,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Er ging iets mis");
        return;
      }

      clearCart();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        router.push(`/succes?order=${data.orderNumber}`);
      }
    } catch {
      setError("Verbinding mislukt. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-offwhite min-h-screen section-padding">
        <div className="container-brutal text-center py-20">
          <h1 className="font-display text-display-md text-ink mb-4">
            AFREKENEN
          </h1>
          <p className="font-body text-xl text-ink/70 mb-8">
            Je winkelwagen is leeg.
          </p>
          <BrutalButton variant="primary" size="lg" href="/wijnen">
            Bekijk wijnen →
          </BrutalButton>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full font-body text-base border-2 border-ink px-4 py-3 bg-offwhite focus:outline-hidden focus:border-wine placeholder:text-ink/30";

  return (
    <div className="bg-offwhite min-h-screen section-padding">
      <div className="container-brutal max-w-2xl">
        <h1 className="font-display text-display-md text-ink mb-8">
          AFREKENEN
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact */}
          <fieldset className="border-brutal border-ink bg-offwhite brutal-shadow p-6 space-y-4">
            <legend className="font-display text-lg font-bold px-2">
              Contact
            </legend>
            <input
              type="email"
              required
              placeholder="E-mailadres *"
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
              className={inputClass}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Voornaam *"
                value={form.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className={inputClass}
              />
              <input
                type="text"
                required
                placeholder="Achternaam *"
                value={form.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className={inputClass}
              />
            </div>
            <input
              type="tel"
              placeholder="Telefoonnummer (optioneel)"
              value={form.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              className={inputClass}
            />
          </fieldset>

          {/* Address */}
          <fieldset className="border-brutal border-ink bg-offwhite brutal-shadow p-6 space-y-4">
            <legend className="font-display text-lg font-bold px-2">
              Bezorgadres
            </legend>
            <input
              type="text"
              required
              placeholder="Straat *"
              value={form.street}
              onChange={(e) => updateField("street", e.target.value)}
              className={inputClass}
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Huisnummer *"
                value={form.houseNumber}
                onChange={(e) => updateField("houseNumber", e.target.value)}
                className={inputClass}
              />
              <input
                type="text"
                placeholder="Toevoeging"
                value={form.houseNumberAddition}
                onChange={(e) =>
                  updateField("houseNumberAddition", e.target.value)
                }
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Postcode * (1234 AB)"
                value={form.postalCode}
                onChange={(e) => updateField("postalCode", e.target.value)}
                className={inputClass}
              />
              <input
                type="text"
                required
                placeholder="Plaats *"
                value={form.city}
                onChange={(e) => updateField("city", e.target.value)}
                className={inputClass}
              />
            </div>
          </fieldset>

          {/* Order summary */}
          <div className="border-brutal border-ink bg-offwhite brutal-shadow p-6">
            <h2 className="font-display text-lg font-bold text-ink mb-4">
              Bestelling ({item_count} {item_count === 1 ? "fles" : "flessen"})
            </h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div
                  key={item.wine_id}
                  className="flex justify-between font-body text-base"
                >
                  <span>
                    {item.name} x{item.quantity}
                  </span>
                  <span className="font-bold">
                    {formatPrice(item.price_cents * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t-2 border-ink pt-4 space-y-2">
              <div className="flex justify-between font-body text-base">
                <span className="text-ink/70">Subtotaal</span>
                <span>{formatPrice(subtotal_cents)}</span>
              </div>
              <div className="flex justify-between font-body text-base">
                <span className="text-ink/70">Verzending</span>
                <span>
                  {shipping_cents === 0
                    ? "Gratis"
                    : formatPrice(shipping_cents)}
                </span>
              </div>
              <div className="flex justify-between font-display text-lg font-bold pt-2 border-t border-ink/20">
                <span>Totaal</span>
                <span className="text-wine">{formatPrice(total_cents)}</span>
              </div>
            </div>
          </div>

          {/* Payment method */}
          <fieldset className="border-brutal border-ink bg-offwhite brutal-shadow p-6 space-y-3">
            <legend className="font-display text-lg font-bold px-2">
              Betaalmethode
            </legend>
            {[
              { value: "ideal", label: "iDEAL" },
              { value: "creditcard", label: "Creditcard" },
              { value: "bancontact", label: "Bancontact" },
              { value: "paypal", label: "PayPal" },
            ].map((m) => (
              <label
                key={m.value}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={m.value}
                  checked={paymentMethod === m.value}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 border-2 border-ink accent-wine"
                />
                <span className="font-body text-base">{m.label}</span>
              </label>
            ))}
          </fieldset>

          {/* Age verification */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              required
              checked={form.ageVerified}
              onChange={(e) => updateField("ageVerified", e.target.checked)}
              className="w-5 h-5 mt-0.5 border-2 border-ink accent-wine"
            />
            <span className="font-body text-base">
              Ik bevestig dat ik 18 jaar of ouder ben *
            </span>
          </label>

          {/* Notes */}
          <textarea
            placeholder="Opmerkingen bij je bestelling (optioneel)"
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
            rows={3}
            className={inputClass}
          />

          {error && (
            <div className="border-2 border-wine bg-wine/10 p-4">
              <p className="font-body text-base text-wine">{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !form.ageVerified}
            className="w-full font-accent text-base font-bold uppercase tracking-wider bg-wine text-champagne px-8 py-4 border-brutal border-ink brutal-shadow brutal-hover disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Bezig met verwerken..."
              : `Betalen — ${formatPrice(total_cents)}`}
          </button>

          <p className="font-accent text-[10px] text-ink/40 uppercase tracking-widest text-center">
            Veilig betalen via Mollie · iDEAL & Creditcard · Alle gegevens
            versleuteld
          </p>
        </form>
      </div>
    </div>
  );
}

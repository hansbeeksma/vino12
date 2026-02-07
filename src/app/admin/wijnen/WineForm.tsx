"use client";

import { useActionState } from "react";
import type { Wine, WineType, WineBody } from "@/lib/schemas/wine";

const WINE_TYPES: { value: WineType; label: string }[] = [
  { value: "red", label: "Rood" },
  { value: "white", label: "Wit" },
  { value: "rose", label: "Rosé" },
  { value: "sparkling", label: "Mousserende" },
  { value: "dessert", label: "Dessert" },
  { value: "fortified", label: "Versterkt" },
  { value: "orange", label: "Oranje" },
];

const WINE_BODIES: { value: WineBody; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "medium_light", label: "Light-Medium" },
  { value: "medium", label: "Medium" },
  { value: "medium_full", label: "Medium-Full" },
  { value: "full", label: "Full" },
];

interface WineFormProps {
  wine?: Wine;
  regions: { id: string; name: string }[];
  producers: { id: string; name: string }[];
  action: (
    formData: FormData,
  ) => Promise<{ error?: Record<string, string[]> } | void>;
}

const inputClass =
  "font-body text-sm border-2 border-ink px-3 py-2 bg-offwhite focus:outline-none focus:border-wine w-full";
const labelClass =
  "font-accent text-[10px] uppercase tracking-widest text-ink/60 block mb-1";

export function WineForm({ wine, regions, producers, action }: WineFormProps) {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => action(formData),
    null,
  );

  const errors = (state as { error?: Record<string, string[]> } | null)?.error;

  return (
    <form action={formAction} className="space-y-6 max-w-2xl">
      {errors?._form && (
        <div className="border-2 border-wine bg-wine/10 p-3">
          <p className="font-body text-sm text-wine">{errors._form[0]}</p>
        </div>
      )}

      {/* Naam */}
      <div>
        <label htmlFor="name" className={labelClass}>
          Naam *
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={wine?.name ?? ""}
          required
          className={inputClass}
        />
        {errors?.name && (
          <p className="font-body text-xs text-wine mt-1">{errors.name[0]}</p>
        )}
      </div>

      {/* Type + Body */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="type" className={labelClass}>
            Type *
          </label>
          <select
            id="type"
            name="type"
            defaultValue={wine?.type ?? "red"}
            className={inputClass}
          >
            {WINE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="body" className={labelClass}>
            Body
          </label>
          <select
            id="body"
            name="body"
            defaultValue={wine?.body ?? ""}
            className={inputClass}
          >
            <option value="">—</option>
            {WINE_BODIES.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Beschrijving */}
      <div>
        <label htmlFor="description" className={labelClass}>
          Beschrijving
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={wine?.description ?? ""}
          rows={4}
          className={inputClass}
        />
      </div>

      {/* Regio + Producent */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="region_id" className={labelClass}>
            Regio
          </label>
          <select
            id="region_id"
            name="region_id"
            defaultValue={wine?.region_id ?? ""}
            className={inputClass}
          >
            <option value="">—</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="producer_id" className={labelClass}>
            Producent
          </label>
          <select
            id="producer_id"
            name="producer_id"
            defaultValue={wine?.producer_id ?? ""}
            className={inputClass}
          >
            <option value="">—</option>
            {producers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Vintage + Alcohol + Volume */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="vintage" className={labelClass}>
            Jaargang
          </label>
          <input
            id="vintage"
            name="vintage"
            type="number"
            defaultValue={wine?.vintage ?? ""}
            min={1900}
            max={2100}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="alcohol_percentage" className={labelClass}>
            Alcohol %
          </label>
          <input
            id="alcohol_percentage"
            name="alcohol_percentage"
            type="number"
            step="0.1"
            defaultValue={wine?.alcohol_percentage ?? ""}
            min={0}
            max={100}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="volume_ml" className={labelClass}>
            Volume (ml)
          </label>
          <input
            id="volume_ml"
            name="volume_ml"
            type="number"
            defaultValue={wine?.volume_ml ?? 750}
            min={0}
            className={inputClass}
          />
        </div>
      </div>

      {/* Prijs + Vergelijkprijs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price_cents" className={labelClass}>
            Prijs (centen) *
          </label>
          <input
            id="price_cents"
            name="price_cents"
            type="number"
            defaultValue={wine?.price_cents ?? ""}
            required
            min={0}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="compare_at_price_cents" className={labelClass}>
            Van-prijs (centen)
          </label>
          <input
            id="compare_at_price_cents"
            name="compare_at_price_cents"
            type="number"
            defaultValue={wine?.compare_at_price_cents ?? ""}
            min={0}
            className={inputClass}
          />
        </div>
      </div>

      {/* SKU + Voorraad */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="sku" className={labelClass}>
            SKU
          </label>
          <input
            id="sku"
            name="sku"
            type="text"
            defaultValue={wine?.sku ?? ""}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="stock_quantity" className={labelClass}>
            Voorraad *
          </label>
          <input
            id="stock_quantity"
            name="stock_quantity"
            type="number"
            defaultValue={wine?.stock_quantity ?? 0}
            required
            min={0}
            className={inputClass}
          />
        </div>
      </div>

      {/* Afbeelding */}
      <div>
        <label htmlFor="image_url" className={labelClass}>
          Afbeelding URL
        </label>
        <input
          id="image_url"
          name="image_url"
          type="url"
          defaultValue={wine?.image_url ?? ""}
          className={inputClass}
        />
      </div>

      {/* Proefnotities + Food pairing + Serveertemperatuur */}
      <div>
        <label htmlFor="tasting_notes" className={labelClass}>
          Proefnotities
        </label>
        <textarea
          id="tasting_notes"
          name="tasting_notes"
          defaultValue={wine?.tasting_notes ?? ""}
          rows={2}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="food_pairing" className={labelClass}>
          Food pairing
        </label>
        <input
          id="food_pairing"
          name="food_pairing"
          type="text"
          defaultValue={wine?.food_pairing ?? ""}
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="serving_temperature" className={labelClass}>
          Serveertemperatuur
        </label>
        <input
          id="serving_temperature"
          name="serving_temperature"
          type="text"
          defaultValue={wine?.serving_temperature ?? ""}
          className={inputClass}
        />
      </div>

      {/* Actief + Featured */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={wine?.is_active ?? true}
            className="w-4 h-4 accent-wine"
          />
          <span className={labelClass}>Actief</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={wine?.is_featured ?? false}
            className="w-4 h-4 accent-wine"
          />
          <span className={labelClass}>Featured</span>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={pending}
        className="font-accent text-xs font-bold uppercase tracking-widest px-6 py-3 border-2 border-ink bg-ink text-offwhite hover:bg-wine hover:border-wine transition-colors disabled:opacity-50"
      >
        {pending ? "Opslaan..." : wine ? "Bijwerken" : "Toevoegen"}
      </button>
    </form>
  );
}

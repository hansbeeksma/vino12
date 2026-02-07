"use client";

import { useActionState } from "react";
import { createAddress } from "../actions";

export function AddressForm() {
  const [state, formAction, pending] = useActionState(createAddress, {
    success: false,
  });

  const inputClass =
    "w-full font-body text-base border-2 border-ink px-4 py-3 bg-offwhite focus:outline-hidden focus:border-wine placeholder:text-ink/30";

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="font-accent text-[10px] uppercase tracking-widest text-ink/60 block mb-1">
          Label
        </label>
        <input
          type="text"
          name="label"
          defaultValue="Thuis"
          placeholder="bijv. Thuis, Werk"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-1">
          <label className="font-accent text-[10px] uppercase tracking-widest text-ink/60 block mb-1">
            Straat *
          </label>
          <input
            type="text"
            name="street"
            required
            placeholder="Straatnaam"
            className={inputClass}
          />
        </div>
        <div>
          <label className="font-accent text-[10px] uppercase tracking-widest text-ink/60 block mb-1">
            Huisnummer *
          </label>
          <input
            type="text"
            name="house_number"
            required
            placeholder="12"
            className={inputClass}
          />
        </div>
        <div>
          <label className="font-accent text-[10px] uppercase tracking-widest text-ink/60 block mb-1">
            Toevoeging
          </label>
          <input
            type="text"
            name="house_number_addition"
            placeholder="A, bis"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-accent text-[10px] uppercase tracking-widest text-ink/60 block mb-1">
            Postcode *
          </label>
          <input
            type="text"
            name="postal_code"
            required
            placeholder="1234 AB"
            pattern="[0-9]{4}\s?[A-Za-z]{2}"
            className={inputClass}
          />
        </div>
        <div>
          <label className="font-accent text-[10px] uppercase tracking-widest text-ink/60 block mb-1">
            Stad *
          </label>
          <input
            type="text"
            name="city"
            required
            placeholder="Amsterdam"
            className={inputClass}
          />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          name="is_default"
          className="w-4 h-4 border-2 border-ink accent-wine"
        />
        <span className="font-accent text-[10px] uppercase tracking-widest text-ink/60">
          Standaard bezorgadres
        </span>
      </label>

      {state.error && (
        <div className="border-2 border-wine bg-wine/10 p-3">
          <p className="font-body text-sm text-wine">{state.error}</p>
        </div>
      )}

      {state.success && (
        <div className="border-2 border-emerald bg-emerald/10 p-3">
          <p className="font-body text-sm text-emerald">Adres toegevoegd!</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="font-display text-sm font-bold uppercase tracking-wider border-2 border-ink bg-ink text-offwhite px-6 py-3 hover:bg-wine hover:border-wine transition-colors disabled:opacity-50"
      >
        {pending ? "Toevoegen..." : "Adres toevoegen"}
      </button>
    </form>
  );
}

"use client";

import { useTransition } from "react";
import { deleteAddress, setDefaultAddress } from "../actions";

interface Address {
  id: string;
  label: string;
  street: string;
  house_number: string;
  house_number_addition: string | null;
  postal_code: string;
  city: string;
  is_default: boolean;
}

export function AddressCard({ address }: { address: Address }) {
  const [pending, startTransition] = useTransition();

  const fullAddress = `${address.street} ${address.house_number}${address.house_number_addition ? ` ${address.house_number_addition}` : ""}`;

  function handleDelete() {
    if (!confirm("Weet je zeker dat je dit adres wilt verwijderen?")) return;
    startTransition(async () => {
      await deleteAddress(address.id);
    });
  }

  function handleSetDefault() {
    startTransition(async () => {
      await setDefaultAddress(address.id);
    });
  }

  return (
    <div
      className={`border-2 p-4 ${
        address.is_default ? "border-wine bg-wine/5" : "border-ink bg-offwhite"
      } ${pending ? "opacity-50" : ""}`}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="font-display text-base font-bold text-ink">
          {address.label}
        </span>
        {address.is_default && (
          <span className="font-accent text-[10px] uppercase tracking-widest text-wine border border-wine px-2 py-0.5">
            Standaard
          </span>
        )}
      </div>

      <p className="font-body text-sm text-ink">{fullAddress}</p>
      <p className="font-body text-sm text-ink">
        {address.postal_code} {address.city}
      </p>

      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-ink/10">
        {!address.is_default && (
          <button
            type="button"
            onClick={handleSetDefault}
            disabled={pending}
            className="font-accent text-[10px] uppercase tracking-widest text-ink/50 hover:text-wine"
          >
            Maak standaard
          </button>
        )}
        <button
          type="button"
          onClick={handleDelete}
          disabled={pending}
          className="font-accent text-[10px] uppercase tracking-widest text-ink/50 hover:text-wine"
        >
          Verwijderen
        </button>
      </div>
    </div>
  );
}

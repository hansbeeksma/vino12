"use client";

import { useActionState } from "react";
import { updateProfile } from "../actions";

interface ProfileFormProps {
  defaultValues: {
    first_name: string;
    last_name: string;
    phone: string;
  };
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [state, formAction, pending] = useActionState(updateProfile, {
    success: false,
  });

  const inputClass =
    "w-full font-body text-base border-2 border-ink px-4 py-3 bg-offwhite focus:outline-hidden focus:border-wine placeholder:text-ink/30";

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="font-accent text-[10px] uppercase tracking-widest text-ink/60 block mb-1">
            Voornaam *
          </label>
          <input
            type="text"
            name="first_name"
            required
            defaultValue={defaultValues.first_name}
            placeholder="Voornaam"
            className={inputClass}
          />
        </div>
        <div>
          <label className="font-accent text-[10px] uppercase tracking-widest text-ink/60 block mb-1">
            Achternaam *
          </label>
          <input
            type="text"
            name="last_name"
            required
            defaultValue={defaultValues.last_name}
            placeholder="Achternaam"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="font-accent text-[10px] uppercase tracking-widest text-ink/60 block mb-1">
          Telefoonnummer
        </label>
        <input
          type="tel"
          name="phone"
          defaultValue={defaultValues.phone}
          placeholder="06-12345678"
          className={inputClass}
        />
      </div>

      {state.error && (
        <div className="border-2 border-wine bg-wine/10 p-3">
          <p className="font-body text-sm text-wine">{state.error}</p>
        </div>
      )}

      {state.success && (
        <div className="border-2 border-emerald bg-emerald/10 p-3">
          <p className="font-body text-sm text-emerald">Profiel bijgewerkt!</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="font-display text-sm font-bold uppercase tracking-wider border-2 border-ink bg-ink text-offwhite px-6 py-3 hover:bg-wine hover:border-wine transition-colors disabled:opacity-50"
      >
        {pending ? "Opslaan..." : "Opslaan"}
      </button>
    </form>
  );
}

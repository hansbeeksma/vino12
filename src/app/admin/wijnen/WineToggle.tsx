"use client";

import { useTransition } from "react";
import { toggleWineActive, toggleWineFeatured } from "./actions";

interface WineToggleProps {
  id: string;
  field: "active" | "featured";
  checked: boolean;
}

export function WineToggle({ id, field, checked }: WineToggleProps) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      if (field === "active") {
        await toggleWineActive(id, !checked);
      } else {
        await toggleWineFeatured(id, !checked);
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={`text-sm transition-opacity ${pending ? "opacity-30" : ""} ${checked ? "text-emerald" : "text-ink/20"} hover:text-wine`}
    >
      {checked ? "●" : "○"}
    </button>
  );
}

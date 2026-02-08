"use client";

import { useState } from "react";
import { BrutalButton } from "@/components/ui/BrutalButton";
import type { Variant } from "@/lib/landing-variants";
import "@/lib/analytics/plausible"; // Window.plausible type

interface EmailSignupFormProps {
  variant: Variant;
  ctaText: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

type FormState = "idle" | "loading" | "success" | "error";

export function EmailSignupForm({
  variant,
  ctaText,
  utmSource,
  utmMedium,
  utmCampaign,
}: EmailSignupFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg("Vul een geldig e-mailadres in.");
      setState("error");
      return;
    }

    setState("loading");
    setErrorMsg("");

    window.plausible?.("CTA Click", { props: { variant } });

    try {
      const res = await fetch("/api/landing/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          variant,
          source: utmSource,
          medium: utmMedium,
          campaign: utmCampaign,
        }),
      });

      if (res.ok) {
        setState("success");
        window.plausible?.("Signup", {
          props: { variant, source: utmSource ?? "direct" },
        });
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(
          (data as { error?: string }).error ??
            "Er ging iets mis. Probeer het later opnieuw.",
        );
        setState("error");
      }
    } catch {
      setErrorMsg(
        "Geen verbinding. Controleer je internet en probeer opnieuw.",
      );
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="border-brutal border-emerald bg-emerald/5 p-6 max-w-md inline-block">
        <p className="font-display font-bold text-emerald text-lg mb-1">
          Welkom!
        </p>
        <p className="font-body text-ink/70">
          Check je inbox voor een bevestigingsmail.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 max-w-md"
    >
      <div className="flex-1">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="jouw@email.nl"
          required
          className="w-full px-4 py-4 font-body text-base border-brutal border-ink bg-white text-ink placeholder:text-ink/30 focus:outline-none focus:ring-2 focus:ring-wine"
        />
        {state === "error" && errorMsg && (
          <p className="font-body text-sm text-wine mt-1.5">{errorMsg}</p>
        )}
      </div>
      <BrutalButton
        variant="gold"
        size="lg"
        className={state === "loading" ? "opacity-60 pointer-events-none" : ""}
      >
        {state === "loading" ? "Even geduld..." : ctaText}
      </BrutalButton>
    </form>
  );
}

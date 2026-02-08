import { cookies } from "next/headers";
import { type Variant, VARIANTS, variantContent } from "@/lib/landing-variants";
import { AnimatedSection } from "@/components/motion/AnimatedSection";
import { EmailSignupForm } from "@/components/landing/EmailSignupForm";

export const metadata = {
  title: "VINO12 — Premium wijnen, eerlijk geprijsd",
  description:
    "Ontdek bijzondere wijnen van onafhankelijke wijnmakers. Direct bij je thuis bezorgd.",
  robots: { index: false, follow: false },
};

function isVariant(v: unknown): v is Variant {
  return typeof v === "string" && VARIANTS.includes(v as Variant);
}

function randomVariant(): Variant {
  return VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
}

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const cookieStore = await cookies();

  const qParam = typeof params.v === "string" ? params.v.toLowerCase() : null;
  const cookieVariant = cookieStore.get("lp_variant")?.value ?? null;

  let variant: Variant;
  if (isVariant(qParam)) {
    variant = qParam;
  } else if (isVariant(cookieVariant)) {
    variant = cookieVariant;
  } else {
    variant = randomVariant();
  }

  const content = variantContent[variant];

  const utmSource =
    typeof params.utm_source === "string" ? params.utm_source : undefined;
  const utmMedium =
    typeof params.utm_medium === "string" ? params.utm_medium : undefined;
  const utmCampaign =
    typeof params.utm_campaign === "string" ? params.utm_campaign : undefined;

  return (
    <>
      <SetVariantCookie variant={variant} />

      {/* Hero */}
      <section className="min-h-[85vh] flex flex-col justify-center bg-offwhite section-padding">
        <div className="container-brutal">
          <AnimatedSection>
            <p className="font-accent text-sm uppercase tracking-widest text-wine mb-4">
              VINO12
            </p>
            <h1
              className="font-display font-bold text-ink leading-none mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              {content.headline}
            </h1>
            <p className="font-body text-xl md:text-2xl text-ink/70 max-w-2xl mb-10">
              {content.subtext}
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <EmailSignupForm
              variant={variant}
              ctaText={content.ctaText}
              utmSource={utmSource}
              utmMedium={utmMedium}
              utmCampaign={utmCampaign}
            />
          </AnimatedSection>
        </div>
      </section>

      {/* USPs */}
      <section className="bg-ink text-champagne section-padding">
        <div className="container-brutal">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {content.usps.map((usp, i) => (
              <AnimatedSection key={usp.title} delay={i * 0.15}>
                <div className="border-brutal border-champagne/20 p-6 md:p-8">
                  <span className="font-accent text-gold text-4xl font-bold block mb-4">
                    0{i + 1}
                  </span>
                  <h3 className="font-display font-bold text-xl md:text-2xl mb-3">
                    {usp.title}
                  </h3>
                  <p className="font-body text-champagne/70 text-lg">
                    {usp.description}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof + CTA */}
      <section className="bg-offwhite section-padding">
        <div className="container-brutal text-center">
          <AnimatedSection>
            <p className="font-accent text-sm uppercase tracking-widest text-wine/60 mb-2">
              Wij geloven in
            </p>
            <h2
              className="font-display font-bold text-ink mb-6"
              style={{ fontSize: "clamp(1.5rem, 3vw, 3rem)" }}
            >
              Eerlijke wijn, zonder gedoe
            </h2>
            <p className="font-body text-lg text-ink/60 max-w-xl mx-auto mb-10">
              VINO12 werkt rechtstreeks met wijnmakers. Geen tussenhandel, geen
              opmaak — alleen wijn die het waard is.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <EmailSignupForm
              variant={variant}
              ctaText={content.ctaText}
              utmSource={utmSource}
              utmMedium={utmMedium}
              utmCampaign={utmCampaign}
            />
          </AnimatedSection>
        </div>
      </section>

      {/* Mini Footer */}
      <footer className="bg-ink text-champagne/60 py-8 px-4">
        <div className="container-brutal flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-body">
          <p>
            <span className="font-accent text-champagne font-bold">VINO12</span>{" "}
            — Premium wijnen, eerlijk geprijsd
          </p>
          <div className="flex gap-6">
            <span>Bezorging in heel NL</span>
            <span>18+ | Nix18</span>
          </div>
        </div>
      </footer>
    </>
  );
}

function SetVariantCookie({ variant }: { variant: Variant }) {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `if(!document.cookie.includes("lp_variant="))document.cookie="lp_variant=${variant};path=/;max-age=${60 * 60 * 24 * 30};samesite=lax"`,
      }}
    />
  );
}

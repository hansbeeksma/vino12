import type { WineRow } from "@/lib/api/wines";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "VINO12",
        url: "https://vino12.com",
        logo: "https://vino12.com/icon.svg",
        description:
          "12 premium wijnen, zorgvuldig gecureerd. Van licht en fris tot vol en complex.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Amsterdam",
          addressCountry: "NL",
        },
        contactPoint: {
          "@type": "ContactPoint",
          email: "hallo@vino12.com",
          contactType: "customer service",
        },
      }}
    />
  );
}

export function ProductJsonLd({ wine }: { wine: WineRow }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: wine.name,
        description: wine.description,
        image: wine.image_url,
        brand: {
          "@type": "Brand",
          name: "VINO12",
        },
        offers: {
          "@type": "Offer",
          price: (wine.price_cents / 100).toFixed(2),
          priceCurrency: "EUR",
          availability: "https://schema.org/InStock",
          url: `https://vino12.com/wijn/${wine.slug}`,
        },
        ...(wine.region && {
          countryOfOrigin: {
            "@type": "Country",
            name: wine.region.country,
          },
        }),
        additionalProperty: [
          {
            "@type": "PropertyValue",
            name: "Wijntype",
            value: wine.type,
          },
          ...(wine.vintage
            ? [
                {
                  "@type": "PropertyValue",
                  name: "Jaargang",
                  value: wine.vintage.toString(),
                },
              ]
            : []),
          ...(wine.alcohol_percentage
            ? [
                {
                  "@type": "PropertyValue",
                  name: "Alcoholpercentage",
                  value: `${wine.alcohol_percentage}%`,
                },
              ]
            : []),
        ],
      }}
    />
  );
}

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "VINO12",
        url: "https://vino12.com",
        potentialAction: {
          "@type": "SearchAction",
          target: "https://vino12.com/wijnen?q={search_term_string}",
          "query-input": "required name=search_term_string",
        },
      }}
    />
  );
}

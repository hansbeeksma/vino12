import type { Wine } from './types'

const SITE_URL = 'https://vino12.com'

export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vino12',
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description: '12 premium wijnen, zorgvuldig gecureerd. 6 rood. 6 wit. Perfecte balans.',
    sameAs: [],
  }
}

export function getWebsiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vino12',
    url: SITE_URL,
    description: '12 premium wijnen. 6 rood. 6 wit. Perfecte balans.',
    inLanguage: 'nl-NL',
  }
}

export function getProductJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Vino12 Box',
    description:
      '12 premium wijnen, zorgvuldig gecureerd. 6 rood, 6 wit. Van licht en fris tot vol en complex.',
    url: SITE_URL,
    brand: {
      '@type': 'Brand',
      name: 'Vino12',
    },
    offers: {
      '@type': 'Offer',
      price: '175.00',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: SITE_URL,
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'EUR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'NL',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          businessDays: {
            '@type': 'QuantitativeValue',
            minValue: 3,
            maxValue: 5,
          },
        },
      },
    },
    category: 'Wine',
    countryOfOrigin: {
      '@type': 'Country',
      name: 'Multiple',
    },
  }
}

export function getWineProductJsonLd(wine: Wine) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${wine.name} — ${wine.region}`,
    description: wine.description,
    url: `${SITE_URL}/wijn/${wine.slug}`,
    image: `${SITE_URL}${wine.image}`,
    brand: {
      '@type': 'Brand',
      name: 'Vino12',
    },
    offers: {
      '@type': 'Offer',
      price: wine.price.toFixed(2),
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/wijn/${wine.slug}`,
    },
    category: wine.color === 'red' ? 'Red Wine' : 'White Wine',
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Druif',
        value: wine.grape,
      },
      {
        '@type': 'PropertyValue',
        name: 'Regio',
        value: `${wine.region}, ${wine.country}`,
      },
      {
        '@type': 'PropertyValue',
        name: 'Jaargang',
        value: wine.year.toString(),
      },
      {
        '@type': 'PropertyValue',
        name: 'Alcohol',
        value: wine.alcohol,
      },
      {
        '@type': 'PropertyValue',
        name: 'Body',
        value: wine.body,
      },
    ],
  }
}

export function getBreadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

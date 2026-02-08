import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/fallback.html",
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Turbopack to coexist with webpack-based plugins (next-pwa)
  turbopack: {},
  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(self), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://vercel.live https://va.vercel-scripts.com https://js.mollie.com https://*.sentry.io",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://vitals.vercel-insights.com https://vercel.live https://api.mollie.com https://*.sentry.io https://*.ingest.sentry.io https://storage.googleapis.com https://tfhub.dev https://www.kaggle.com",
              "frame-src 'self' https://js.mollie.com https://www.mollie.com",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self' https://www.mollie.com",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

// Apply PWA wrapper first
const pwaConfig = withPWA(nextConfig);

// Only wrap with Sentry when DSN and org are configured
const hasSentry = process.env.NEXT_PUBLIC_SENTRY_DSN && process.env.SENTRY_ORG;

let config = pwaConfig;

if (hasSentry) {
  const { withSentryConfig } = await import("@sentry/nextjs");
  config = withSentryConfig(pwaConfig, {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    silent: !process.env.CI,
    widenClientFileUpload: true,
  });
}

export default config;

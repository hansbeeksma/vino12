# Vino12

Premium wijnbox webshop - 12 flessen (6 rood, 6 wit).
Neo-brutalism design met echte wijnafbeeldingen en Stripe checkout.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (neo-brutalism theme)
- Framer Motion (animations)
- Swiper (carousel)
- Stripe (checkout/payments)

## Design System

- No border-radius anywhere
- 4-6px solid borders
- Hard shadows: `4px 4px 0px rgba(0,0,0,0.8)`
- IBM Plex Mono (display), Darker Grotesque (body), Space Mono (labels)
- Colors: wine (#722F37), burgundy (#660033), emerald (#00674F), champagne (#F7E6CA), offwhite (#FAFAF5)

## Key Architecture

- Wine data: `data/wines.json` (12 wines with image paths)
- Cart: React Context + localStorage (`lib/cart-context.tsx`)
- Checkout: `/api/checkout` → Stripe hosted checkout
- Images: `public/images/wines/` (sourced from timetowine.nl)

## Scripts

- `npx tsx scripts/scrape-wines.ts` — Download wine images
- `npx tsx scripts/vino12.ts <cmd>` — CLI (dev/build/deploy/check)

## Environment Variables

- `STRIPE_SECRET_KEY` — Stripe server-side key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` — Stripe client-side key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook verification
- `NEXT_PUBLIC_SITE_URL` — Site URL (https://vino12.com)

## Plane Integration

| Setting            | Value                                |
| ------------------ | ------------------------------------ |
| Project Identifier | VINO                                 |
| Project UUID       | c8eac7b1-5a7c-429f-9fee-9b21ef62013c |

## DevOps

- **Git hooks**: Husky v9 (pre-commit: gitleaks + lint-staged, commit-msg: conventional commits)
- **CI/CD**: GitHub Actions (lint, build, secret scanning, dependency audit)
- **Security**: Semgrep SAST + npm audit SCA (daily schedule)
- **Dependencies**: Dependabot (weekly npm, monthly GitHub Actions)
- **Linting**: ESLint (Next.js config) + Prettier
- **Secret scanning**: Gitleaks (Stripe patterns)

type Environment = "development" | "staging" | "production";

/**
 * Detect runtime environment based on Vercel environment variables.
 *
 * Priority:
 * 1. Explicit SENTRY_ENVIRONMENT (allows manual override)
 * 2. NEXT_PUBLIC_VERCEL_ENV (set automatically by Vercel)
 * 3. NODE_ENV fallback
 */
export function getEnvironment(): Environment {
  if (process.env.SENTRY_ENVIRONMENT) {
    return process.env.SENTRY_ENVIRONMENT as Environment;
  }

  const vercelEnv = process.env.NEXT_PUBLIC_VERCEL_ENV;

  if (vercelEnv === "production") return "production";
  if (vercelEnv === "preview") return "staging";

  return "development";
}

export function isProduction(): boolean {
  return getEnvironment() === "production";
}

export function isStaging(): boolean {
  return getEnvironment() === "staging";
}

export function isDevelopment(): boolean {
  return getEnvironment() === "development";
}

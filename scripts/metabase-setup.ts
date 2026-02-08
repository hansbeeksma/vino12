/**
 * Metabase Setup Script
 *
 * Configures Metabase with Supabase connection and creates
 * AARRR + Conversion Funnel dashboards.
 *
 * Prerequisites:
 *   docker compose up -d metabase
 *   Wait for Metabase to be ready at http://localhost:3200
 *
 * Usage:
 *   npx tsx scripts/metabase-setup.ts
 *
 * Environment:
 *   METABASE_URL        - Metabase URL (default: http://localhost:3200)
 *   METABASE_EMAIL      - Admin email (default: admin@vino12.com)
 *   METABASE_PASSWORD   - Admin password (default: Vino12Admin!)
 *   SUPABASE_DB_HOST    - Supabase PostgreSQL host (default: host.docker.internal)
 *   SUPABASE_DB_PORT    - Supabase PostgreSQL port (default: 54322)
 *   SUPABASE_DB_NAME    - Database name (default: postgres)
 *   SUPABASE_DB_USER    - Database user (default: postgres)
 *   SUPABASE_DB_PASS    - Database password (default: postgres)
 */

const METABASE_URL = process.env.METABASE_URL ?? "http://localhost:3200";
const ADMIN_EMAIL = process.env.METABASE_EMAIL ?? "admin@vino12.com";
const ADMIN_PASSWORD = process.env.METABASE_PASSWORD ?? "Vino12Admin!";

const DB_CONFIG = {
  host: process.env.SUPABASE_DB_HOST ?? "host.docker.internal",
  port: Number(process.env.SUPABASE_DB_PORT ?? "54322"),
  dbname: process.env.SUPABASE_DB_NAME ?? "postgres",
  user: process.env.SUPABASE_DB_USER ?? "postgres",
  password: process.env.SUPABASE_DB_PASS ?? "postgres",
};

interface MetabaseSession {
  id: string;
}

async function metabaseRequest(
  path: string,
  options: RequestInit & { sessionId?: string } = {},
) {
  const { sessionId, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(sessionId ? { "X-Metabase-Session": sessionId } : {}),
  };

  const response = await fetch(`${METABASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Metabase ${path} failed (${response.status}): ${text}`);
  }

  return response.json();
}

async function waitForMetabase(): Promise<void> {
  console.log("Wachten op Metabase...");
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(`${METABASE_URL}/api/health`);
      if (res.ok) {
        console.log("Metabase is gereed.");
        return;
      }
    } catch {
      // Not ready yet
    }
    await new Promise((r) => setTimeout(r, 2000));
  }
  throw new Error("Metabase niet beschikbaar na 60 seconden");
}

async function setupAdmin(): Promise<string> {
  console.log("Admin account configureren...");

  try {
    // Check if setup is needed
    const setupInfo = await metabaseRequest("/api/session/properties");

    if (setupInfo["has-user-setup"] === true) {
      // Already set up, just login
      const session: MetabaseSession = await metabaseRequest("/api/session", {
        method: "POST",
        body: JSON.stringify({
          username: ADMIN_EMAIL,
          password: ADMIN_PASSWORD,
        }),
      });
      console.log("Ingelogd als bestaande admin.");
      return session.id;
    }
  } catch {
    // Setup might be needed
  }

  // Run initial setup
  const setupResult = await metabaseRequest("/api/setup", {
    method: "POST",
    body: JSON.stringify({
      token: await getSetupToken(),
      user: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        first_name: "VINO12",
        last_name: "Admin",
        site_name: "VINO12 Analytics",
      },
      prefs: {
        site_name: "VINO12 Analytics",
        site_locale: "nl",
        allow_tracking: false,
      },
    }),
  });

  console.log("Admin account aangemaakt.");
  return setupResult.id;
}

async function getSetupToken(): Promise<string> {
  const props = await metabaseRequest("/api/session/properties");
  return props["setup-token"] ?? "";
}

async function addDatabase(sessionId: string): Promise<number> {
  console.log("Supabase database verbinding toevoegen...");

  // Check if database already exists
  const databases = await metabaseRequest("/api/database", { sessionId });
  const existing = databases.data?.find(
    (db: { name: string }) => db.name === "VINO12 Supabase",
  );

  if (existing) {
    console.log("Database verbinding bestaat al.");
    return existing.id;
  }

  const result = await metabaseRequest("/api/database", {
    method: "POST",
    sessionId,
    body: JSON.stringify({
      name: "VINO12 Supabase",
      engine: "postgres",
      details: {
        host: DB_CONFIG.host,
        port: DB_CONFIG.port,
        dbname: DB_CONFIG.dbname,
        user: DB_CONFIG.user,
        password: DB_CONFIG.password,
        ssl: false,
        "schema-filters-type": "inclusion",
        "schema-filters-patterns": "public",
      },
      is_full_sync: true,
      auto_run_queries: true,
    }),
  });

  console.log(`Database verbinding aangemaakt (id: ${result.id}).`);
  return result.id;
}

async function createSavedQuestion(
  sessionId: string,
  dbId: number,
  name: string,
  sql: string,
  collectionId?: number,
): Promise<number> {
  const result = await metabaseRequest("/api/card", {
    method: "POST",
    sessionId,
    body: JSON.stringify({
      name,
      dataset_query: {
        type: "native",
        native: { query: sql },
        database: dbId,
      },
      display: "table",
      visualization_settings: {},
      collection_id: collectionId ?? null,
    }),
  });

  return result.id;
}

async function createCollection(
  sessionId: string,
  name: string,
): Promise<number> {
  const result = await metabaseRequest("/api/collection", {
    method: "POST",
    sessionId,
    body: JSON.stringify({ name, color: "#722F37" }),
  });
  return result.id;
}

async function createDashboard(
  sessionId: string,
  name: string,
  collectionId: number,
  cardIds: number[],
): Promise<number> {
  const dashboard = await metabaseRequest("/api/dashboard", {
    method: "POST",
    sessionId,
    body: JSON.stringify({
      name,
      collection_id: collectionId,
    }),
  });

  // Add cards to dashboard
  for (let i = 0; i < cardIds.length; i++) {
    await metabaseRequest(`/api/dashboard/${dashboard.id}`, {
      method: "PUT",
      sessionId,
      body: JSON.stringify({
        dashcards: [
          ...(dashboard.dashcards ?? []),
          {
            id: -(i + 1),
            card_id: cardIds[i],
            row: Math.floor(i / 2) * 4,
            col: (i % 2) * 9,
            size_x: 9,
            size_y: 4,
          },
        ],
      }),
    });
  }

  return dashboard.id;
}

async function main() {
  try {
    await waitForMetabase();
    const sessionId = await setupAdmin();
    const dbId = await addDatabase(sessionId);

    // Create collection
    const collectionId = await createCollection(sessionId, "VINO12 Dashboards");
    console.log(`Collection aangemaakt (id: ${collectionId}).`);

    // -- AARRR Dashboard --
    console.log("\nAARRR Dashboard aanmaken...");

    const aarrrCards = await Promise.all([
      createSavedQuestion(
        sessionId,
        dbId,
        "AARRR Samenvatting (30d)",
        "SELECT * FROM v_aarrr_summary_30d ORDER BY sort_order",
        collectionId,
      ),
      createSavedQuestion(
        sessionId,
        dbId,
        "AARRR Dagelijkse Trend",
        "SELECT date, acquisition_visitors, activation_orders, revenue_cents / 100.0 AS revenue_eur FROM v_aarrr_daily WHERE date >= CURRENT_DATE - 30",
        collectionId,
      ),
      createSavedQuestion(
        sessionId,
        dbId,
        "Revenue KPIs",
        "SELECT * FROM v_revenue_kpis ORDER BY sort_order",
        collectionId,
      ),
      createSavedQuestion(
        sessionId,
        dbId,
        "Periode Vergelijking",
        "SELECT * FROM v_period_comparison",
        collectionId,
      ),
    ]);

    const aarrrDashId = await createDashboard(
      sessionId,
      "AARRR Overview",
      collectionId,
      aarrrCards,
    );
    console.log(
      `AARRR Dashboard aangemaakt: ${METABASE_URL}/dashboard/${aarrrDashId}`,
    );

    // -- Conversion Funnel Dashboard --
    console.log("\nConversion Funnel Dashboard aanmaken...");

    const funnelCards = await Promise.all([
      createSavedQuestion(
        sessionId,
        dbId,
        "Conversion Funnel (30d)",
        "SELECT * FROM v_conversion_funnel_30d",
        collectionId,
      ),
      createSavedQuestion(
        sessionId,
        dbId,
        "Conversion Funnel (7d)",
        "SELECT * FROM v_conversion_funnel_7d",
        collectionId,
      ),
      createSavedQuestion(
        sessionId,
        dbId,
        "Conversion Funnel (90d)",
        "SELECT * FROM v_conversion_funnel_90d",
        collectionId,
      ),
      createSavedQuestion(
        sessionId,
        dbId,
        "Device Breakdown",
        "SELECT * FROM v_device_breakdown",
        collectionId,
      ),
    ]);

    const funnelDashId = await createDashboard(
      sessionId,
      "Conversion Funnel",
      collectionId,
      funnelCards,
    );
    console.log(
      `Funnel Dashboard aangemaakt: ${METABASE_URL}/dashboard/${funnelDashId}`,
    );

    console.log("\n--- Setup Voltooid ---");
    console.log(`Metabase: ${METABASE_URL}`);
    console.log(`Login: ${ADMIN_EMAIL}`);
    console.log(`AARRR Dashboard: ${METABASE_URL}/dashboard/${aarrrDashId}`);
    console.log(`Funnel Dashboard: ${METABASE_URL}/dashboard/${funnelDashId}`);
  } catch (error) {
    console.error("Setup mislukt:", error);
    process.exit(1);
  }
}

main();

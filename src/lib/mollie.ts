import createMollieClient, { type MollieClient } from "@mollie/api-client";

let _client: MollieClient | null = null;

export const mollieClient: MollieClient = new Proxy({} as MollieClient, {
  get(_target, prop) {
    if (!_client) {
      const apiKey = process.env.MOLLIE_API_KEY;
      if (!apiKey) {
        throw new Error("MOLLIE_API_KEY is not configured");
      }
      _client = createMollieClient({ apiKey });
    }
    return (_client as Record<string, unknown>)[prop as string];
  },
});

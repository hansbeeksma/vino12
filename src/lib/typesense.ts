import { Client } from "typesense";

function getTypesenseHost(): string {
  const host = process.env.TYPESENSE_HOST;
  if (!host) {
    throw new Error(
      "TYPESENSE_HOST is not configured. Check environment variables.",
    );
  }
  return host;
}

function getTypesensePort(): number {
  const port = process.env.TYPESENSE_PORT;
  return port ? parseInt(port, 10) : 8108;
}

function getTypesenseApiKey(): string {
  const key = process.env.TYPESENSE_API_KEY;
  if (!key) {
    throw new Error(
      "TYPESENSE_API_KEY is not configured. Check environment variables.",
    );
  }
  return key;
}

function getTypesenseProtocol(): string {
  return process.env.TYPESENSE_PROTOCOL ?? "http";
}

let _client: Client | null = null;

export function getTypesenseClient(): Client {
  if (!_client) {
    _client = new Client({
      nodes: [
        {
          host: getTypesenseHost(),
          port: getTypesensePort(),
          protocol: getTypesenseProtocol(),
        },
      ],
      apiKey: getTypesenseApiKey(),
      connectionTimeoutSeconds: 5,
      retryIntervalSeconds: 0.5,
      numRetries: 3,
    });
  }
  return _client;
}

export async function isTypesenseAvailable(): Promise<boolean> {
  try {
    const client = getTypesenseClient();
    await client.health.retrieve();
    return true;
  } catch {
    return false;
  }
}

export const WINES_COLLECTION = "wines";

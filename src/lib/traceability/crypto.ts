import { type SupplyChainEvent, type SupplyChainEventType } from "./types";

function getSigningKey(): string {
  const key = process.env.TRACEABILITY_SIGNING_KEY;
  if (!key) {
    throw new Error(
      "TRACEABILITY_SIGNING_KEY is not configured. Generate one with: openssl rand -hex 32",
    );
  }
  return key;
}

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSign(message: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(key);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", cryptoKey, msgData);
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacVerify(
  message: string,
  signature: string,
  key: string,
): Promise<boolean> {
  const expected = await hmacSign(message, key);
  return expected === signature;
}

export function buildEventPayload(event: {
  wine_id: string;
  event_type: SupplyChainEventType;
  timestamp: string;
  location: string;
  actor: string;
  data: Record<string, unknown>;
  previous_hash: string | null;
}): string {
  return JSON.stringify({
    wine_id: event.wine_id,
    event_type: event.event_type,
    timestamp: event.timestamp,
    location: event.location,
    actor: event.actor,
    data: event.data,
    previous_hash: event.previous_hash,
  });
}

export async function hashEvent(payload: string): Promise<string> {
  return sha256(payload);
}

export async function signEvent(hash: string): Promise<string> {
  return hmacSign(hash, getSigningKey());
}

export async function verifyEventSignature(
  hash: string,
  signature: string,
): Promise<boolean> {
  return hmacVerify(hash, signature, getSigningKey());
}

export async function verifyChain(
  events: SupplyChainEvent[],
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];

  if (events.length === 0) {
    return { valid: true, errors: [] };
  }

  const sorted = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  );

  for (let i = 0; i < sorted.length; i++) {
    const event = sorted[i];
    const payload = buildEventPayload(event);
    const expectedHash = await hashEvent(payload);

    if (event.hash !== expectedHash) {
      errors.push(
        `Event ${event.id}: hash mismatch (data may have been tampered)`,
      );
    }

    const sigValid = await verifyEventSignature(event.hash, event.signature);
    if (!sigValid) {
      errors.push(`Event ${event.id}: invalid signature`);
    }

    if (i === 0 && event.previous_hash !== null) {
      errors.push(`First event should have null previous_hash`);
    }

    if (i > 0 && event.previous_hash !== sorted[i - 1].hash) {
      errors.push(
        `Event ${event.id}: chain broken (previous_hash does not match)`,
      );
    }
  }

  return { valid: errors.length === 0, errors };
}

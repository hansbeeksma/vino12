import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  buildEventPayload,
  hashEvent,
  signEvent,
  verifyEventSignature,
  verifyChain,
} from "./crypto";
import type { SupplyChainEvent } from "./types";

// Mock TRACEABILITY_SIGNING_KEY
beforeEach(() => {
  vi.stubEnv(
    "TRACEABILITY_SIGNING_KEY",
    "test-signing-key-for-unit-tests-32chars",
  );
});

describe("buildEventPayload", () => {
  it("builds deterministic payload", () => {
    const payload = buildEventPayload({
      wine_id: "abc-123",
      event_type: "harvest",
      timestamp: "2025-09-15T10:00:00Z",
      location: "Bordeaux, France",
      actor: "Château Margaux",
      data: { grape: "Cabernet Sauvignon" },
      previous_hash: null,
    });

    const parsed = JSON.parse(payload);
    expect(parsed.wine_id).toBe("abc-123");
    expect(parsed.event_type).toBe("harvest");
    expect(parsed.previous_hash).toBeNull();
  });

  it("produces same payload for same input", () => {
    const input = {
      wine_id: "abc-123",
      event_type: "bottling" as const,
      timestamp: "2025-09-15T10:00:00Z",
      location: "Bordeaux",
      actor: "Bottler",
      data: {},
      previous_hash: "abc",
    };

    const a = buildEventPayload(input);
    const b = buildEventPayload(input);
    expect(a).toBe(b);
  });
});

describe("hashEvent", () => {
  it("returns hex string", async () => {
    const hash = await hashEvent("test payload");
    expect(hash).toMatch(/^[0-9a-f]{64}$/);
  });

  it("produces different hashes for different inputs", async () => {
    const a = await hashEvent("payload A");
    const b = await hashEvent("payload B");
    expect(a).not.toBe(b);
  });

  it("produces same hash for same input", async () => {
    const a = await hashEvent("same payload");
    const b = await hashEvent("same payload");
    expect(a).toBe(b);
  });
});

describe("signEvent / verifyEventSignature", () => {
  it("signs and verifies correctly", async () => {
    const hash = await hashEvent("test data");
    const signature = await signEvent(hash);

    expect(signature).toMatch(/^[0-9a-f]{64}$/);

    const valid = await verifyEventSignature(hash, signature);
    expect(valid).toBe(true);
  });

  it("rejects tampered hash", async () => {
    const hash = await hashEvent("original data");
    const signature = await signEvent(hash);

    const tamperedHash = await hashEvent("tampered data");
    const valid = await verifyEventSignature(tamperedHash, signature);
    expect(valid).toBe(false);
  });

  it("rejects wrong signature", async () => {
    const hash = await hashEvent("test data");
    const valid = await verifyEventSignature(hash, "0".repeat(64));
    expect(valid).toBe(false);
  });
});

describe("verifyChain", () => {
  async function createEvent(
    wineId: string,
    eventType: string,
    previousHash: string | null,
    index: number,
  ): Promise<SupplyChainEvent> {
    const payload = buildEventPayload({
      wine_id: wineId,
      event_type: eventType as SupplyChainEvent["event_type"],
      timestamp: new Date(2025, 8, 15 + index).toISOString(),
      location: `Location ${index}`,
      actor: `Actor ${index}`,
      data: {},
      previous_hash: previousHash,
    });

    const hash = await hashEvent(payload);
    const signature = await signEvent(hash);

    return {
      id: `event-${index}`,
      wine_id: wineId,
      event_type: eventType as SupplyChainEvent["event_type"],
      timestamp: new Date(2025, 8, 15 + index).toISOString(),
      location: `Location ${index}`,
      actor: `Actor ${index}`,
      data: {},
      previous_hash: previousHash,
      hash,
      signature,
    };
  }

  it("validates empty chain", async () => {
    const result = await verifyChain([]);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("validates single event chain", async () => {
    const event = await createEvent("wine-1", "harvest", null, 0);
    const result = await verifyChain([event]);
    expect(result.valid).toBe(true);
  });

  it("validates multi-event chain", async () => {
    const event1 = await createEvent("wine-1", "harvest", null, 0);
    const event2 = await createEvent("wine-1", "bottling", event1.hash, 1);
    const event3 = await createEvent("wine-1", "delivery", event2.hash, 2);

    const result = await verifyChain([event1, event2, event3]);
    expect(result.valid).toBe(true);
  });

  it("detects tampered data", async () => {
    const event = await createEvent("wine-1", "harvest", null, 0);
    const tampered = { ...event, location: "TAMPERED" };

    const result = await verifyChain([tampered]);
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.errors[0]).toContain("hash mismatch");
  });

  it("detects broken chain", async () => {
    const event1 = await createEvent("wine-1", "harvest", null, 0);
    const event2 = await createEvent("wine-1", "bottling", "wrong-hash", 1);

    const result = await verifyChain([event1, event2]);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("chain broken"))).toBe(true);
  });

  it("detects invalid first event", async () => {
    const event = await createEvent("wine-1", "harvest", "should-be-null", 0);

    const result = await verifyChain([event]);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("null previous_hash"))).toBe(
      true,
    );
  });
});

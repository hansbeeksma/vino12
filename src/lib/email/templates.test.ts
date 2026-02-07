import { describe, it, expect } from "vitest";
import {
  orderConfirmationEmail,
  shippingNotificationEmail,
  gdprDataExportEmail,
  gdprDeletionConfirmEmail,
} from "./templates";

describe("orderConfirmationEmail", () => {
  const order = {
    orderNumber: "VINO-2026-0001",
    totalCents: 17500,
    items: [
      { wineName: "Pinot Noir", quantity: 2, totalCents: 5000 },
      { wineName: "Chardonnay", quantity: 1, totalCents: 2500 },
    ],
  };

  it("contains order number", () => {
    const html = orderConfirmationEmail(order);
    expect(html).toContain("VINO-2026-0001");
  });

  it("contains total formatted in euros with comma", () => {
    const html = orderConfirmationEmail(order);
    expect(html).toContain("175,00");
  });

  it("contains wine names", () => {
    const html = orderConfirmationEmail(order);
    expect(html).toContain("Pinot Noir");
    expect(html).toContain("Chardonnay");
  });

  it("contains item quantities", () => {
    const html = orderConfirmationEmail(order);
    expect(html).toContain(">2<");
    expect(html).toContain(">1<");
  });

  it("contains VINO12 branding", () => {
    const html = orderConfirmationEmail(order);
    expect(html).toContain("VINO");
    expect(html).toContain("#722F37");
  });

  it("mentions 18+ verification", () => {
    const html = orderConfirmationEmail(order);
    expect(html).toContain("18+");
  });

  it("mentions delivery time", () => {
    const html = orderConfirmationEmail(order);
    expect(html).toContain("3-5 werkdagen");
  });
});

describe("shippingNotificationEmail", () => {
  it("contains order number and carrier", () => {
    const html = shippingNotificationEmail({
      orderNumber: "VINO-2026-0042",
      trackingUrl: "https://tracking.example.com/123",
      carrier: "PostNL",
    });
    expect(html).toContain("VINO-2026-0042");
    expect(html).toContain("PostNL");
  });

  it("contains tracking link when provided", () => {
    const html = shippingNotificationEmail({
      orderNumber: "VINO-001",
      trackingUrl: "https://tracking.example.com/abc",
      carrier: "DHL",
    });
    expect(html).toContain("https://tracking.example.com/abc");
    expect(html).toContain("Track je bestelling");
  });

  it("shows fallback text when no tracking URL", () => {
    const html = shippingNotificationEmail({
      orderNumber: "VINO-001",
      trackingUrl: null,
      carrier: "PostNL",
    });
    expect(html).not.toContain("<a href=");
    expect(html).toContain("track & trace code volgt");
  });
});

describe("gdprDataExportEmail", () => {
  it("contains download URL", () => {
    const html = gdprDataExportEmail("https://example.com/export/123");
    expect(html).toContain("https://example.com/export/123");
  });

  it("mentions 24 hour validity", () => {
    const html = gdprDataExportEmail("https://example.com/export");
    expect(html).toContain("24 uur");
  });

  it("has download button", () => {
    const html = gdprDataExportEmail("https://example.com/export");
    expect(html).toContain("Download gegevens");
  });
});

describe("gdprDeletionConfirmEmail", () => {
  it("confirms account deletion", () => {
    const html = gdprDeletionConfirmEmail();
    expect(html).toContain("verwijderd");
  });

  it("lists deleted data types", () => {
    const html = gdprDeletionConfirmEmail();
    expect(html).toContain("Account informatie");
    expect(html).toContain("Adressen");
    expect(html).toContain("Smaakprofiel");
  });

  it("mentions fiscal retention period", () => {
    const html = gdprDeletionConfirmEmail();
    expect(html).toContain("7 jaar");
    expect(html).toContain("geanonimiseerd");
  });
});

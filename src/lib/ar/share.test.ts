import { describe, it, expect, vi, beforeEach } from "vitest";
import { shareARCapture } from "./share";

describe("shareARCapture", () => {
  let mockCanvas: HTMLCanvasElement;

  beforeEach(() => {
    mockCanvas = {
      toBlob: vi.fn((callback: (blob: Blob | null) => void) => {
        callback(new Blob(["test"], { type: "image/png" }));
      }),
    } as unknown as HTMLCanvasElement;
  });

  it("downloads if Web Share API not available", async () => {
    // Ensure navigator.share is not available
    Object.defineProperty(navigator, "share", {
      value: undefined,
      writable: true,
      configurable: true,
    });

    const createElementSpy = vi.spyOn(document, "createElement");
    const mockAnchor = {
      href: "",
      download: "",
      click: vi.fn(),
    };
    createElementSpy.mockReturnValue(
      mockAnchor as unknown as HTMLAnchorElement,
    );

    const result = await shareARCapture(mockCanvas, "Merlot");

    expect(result).toBe(true);
    expect(mockAnchor.download).toBe("vino12-Merlot.png");
    expect(mockAnchor.click).toHaveBeenCalled();

    createElementSpy.mockRestore();
  });

  it("returns false when canvas toBlob returns null", async () => {
    const nullBlobCanvas = {
      toBlob: vi.fn((callback: (blob: Blob | null) => void) => {
        callback(null);
      }),
    } as unknown as HTMLCanvasElement;

    const result = await shareARCapture(nullBlobCanvas, "Test");
    expect(result).toBe(false);
  });
});

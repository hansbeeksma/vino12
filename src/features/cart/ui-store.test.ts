import { describe, it, expect, beforeEach } from "vitest";
import { useCartUI } from "./ui-store";

describe("useCartUI", () => {
  beforeEach(() => {
    useCartUI.setState({ isOpen: false });
  });

  it("starts closed", () => {
    expect(useCartUI.getState().isOpen).toBe(false);
  });

  it("opens the cart", () => {
    useCartUI.getState().open();
    expect(useCartUI.getState().isOpen).toBe(true);
  });

  it("closes the cart", () => {
    useCartUI.setState({ isOpen: true });
    useCartUI.getState().close();
    expect(useCartUI.getState().isOpen).toBe(false);
  });

  it("toggles from closed to open", () => {
    useCartUI.getState().toggle();
    expect(useCartUI.getState().isOpen).toBe(true);
  });

  it("toggles from open to closed", () => {
    useCartUI.setState({ isOpen: true });
    useCartUI.getState().toggle();
    expect(useCartUI.getState().isOpen).toBe(false);
  });

  it("double toggle returns to original state", () => {
    useCartUI.getState().toggle();
    useCartUI.getState().toggle();
    expect(useCartUI.getState().isOpen).toBe(false);
  });

  it("close after open returns to closed", () => {
    useCartUI.getState().open();
    useCartUI.getState().close();
    expect(useCartUI.getState().isOpen).toBe(false);
  });

  it("open is idempotent", () => {
    useCartUI.getState().open();
    useCartUI.getState().open();
    expect(useCartUI.getState().isOpen).toBe(true);
  });
});

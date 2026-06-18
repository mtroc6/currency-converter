import { describe, it, expect } from "vitest";
import {
  convert,
  roundTo,
  formatCurrency,
  isSameCurrency,
} from "@/lib/convert";

describe("convert", () => {
  it("multiplies the amount by the rate", () => {
    expect(convert(10, 0.9)).toBeCloseTo(9);
  });

  it("returns 0 when the amount is 0", () => {
    expect(convert(0, 1.23)).toBe(0);
  });
});

describe("roundTo", () => {
  it("rounds to 2 decimals by default", () => {
    expect(roundTo(1.23456)).toBe(1.23);
  });

  it("rounds to a given number of decimals", () => {
    expect(roundTo(1.23456, 3)).toBe(1.235);
  });

  it("handles non-finite values safely", () => {
    expect(roundTo(NaN)).toBe(0);
    expect(roundTo(Infinity)).toBe(0);
  });
});

describe("formatCurrency", () => {
  it("formats a value as USD", () => {
    expect(formatCurrency(1234.5, "USD")).toBe("$1,234.50");
  });

  it("falls back gracefully on an invalid currency code", () => {
    expect(formatCurrency(10, "XYZ123")).toContain("10");
  });
});

describe("isSameCurrency", () => {
  it("is case- and whitespace-insensitive", () => {
    expect(isSameCurrency("usd", " USD ")).toBe(true);
  });

  it("distinguishes different currencies", () => {
    expect(isSameCurrency("USD", "EUR")).toBe(false);
  });
});

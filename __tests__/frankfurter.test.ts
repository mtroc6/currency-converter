import { describe, it, expect, vi, afterEach } from "vitest";
import { getCurrencies, getLatestRate } from "@/lib/frankfurter";

afterEach(() => {
  vi.restoreAllMocks();
});

function mockFetch(body: unknown, ok = true, status = 200) {
  return vi.spyOn(globalThis, "fetch").mockResolvedValue({
    ok,
    status,
    json: async () => body,
  } as Response);
}

describe("getCurrencies", () => {
  it("returns the currency map", async () => {
    mockFetch({ EUR: "Euro", USD: "United States Dollar" });
    const result = await getCurrencies();
    expect(result.EUR).toBe("Euro");
  });

  it("throws on an HTTP error", async () => {
    mockFetch({}, false, 500);
    await expect(getCurrencies()).rejects.toThrow(/HTTP 500/);
  });
});

describe("getLatestRate", () => {
  it("returns the rate for the target currency", async () => {
    mockFetch({
      amount: 1,
      base: "USD",
      date: "2026-06-18",
      rates: { EUR: 0.87 },
    });
    const data = await getLatestRate("USD", "EUR");
    expect(data.rates.EUR).toBe(0.87);
    expect(data.date).toBe("2026-06-18");
  });

  it("throws when the target rate is missing", async () => {
    mockFetch({ amount: 1, base: "USD", date: "2026-06-18", rates: {} });
    await expect(getLatestRate("USD", "EUR")).rejects.toThrow(/not available/);
  });
});

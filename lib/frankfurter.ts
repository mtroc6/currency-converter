/**
 * Thin client for the Frankfurter exchange-rate API.
 *
 * Frankfurter is free, requires no API key and is CORS-open, so it can be
 * called directly from the browser. Rates come from the European Central Bank
 * and update once per business day (~16:00 CET).
 *
 * IMPORTANT: use the api.frankfurter.dev host and the /v1 path prefix.
 * The legacy api.frankfurter.app 301-redirects, and the bare /latest path 404s.
 */

const BASE_URL = "https://api.frankfurter.dev/v1";

/** Map of ISO currency code -> human-readable name, e.g. { EUR: "Euro" }. */
export type CurrencyMap = Record<string, string>;

/** Shape of the /latest response (v1). */
export interface LatestRates {
  amount: number;
  base: string;
  /** The business day the rates actually belong to (may differ from "today"). */
  date: string;
  rates: Record<string, number>;
}

/** Fetch the full list of supported currencies for the dropdowns. */
export async function getCurrencies(signal?: AbortSignal): Promise<CurrencyMap> {
  const res = await fetch(`${BASE_URL}/currencies`, { signal });
  if (!res.ok) {
    throw new Error(`Failed to load currencies (HTTP ${res.status})`);
  }
  return (await res.json()) as CurrencyMap;
}

/**
 * Fetch the latest rate to convert 1 `from` into `to`.
 * Throws if the requested rate is missing from the response.
 */
export async function getLatestRate(
  from: string,
  to: string,
  signal?: AbortSignal,
): Promise<LatestRates> {
  const url = `${BASE_URL}/latest?base=${encodeURIComponent(
    from,
  )}&symbols=${encodeURIComponent(to)}`;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Failed to load rate (HTTP ${res.status})`);
  }

  const data = (await res.json()) as LatestRates;
  if (!data.rates || typeof data.rates[to] !== "number") {
    throw new Error(`Rate for ${to} is not available`);
  }
  return data;
}

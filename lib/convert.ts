/**
 * Pure currency-conversion helpers.
 *
 * These functions are deliberately side-effect free so they can be unit-tested
 * in isolation (see __tests__/convert.test.ts) — the testable core of the app.
 */

/** Convert an amount given an exchange rate (1 unit of base = `rate` units of target). */
export function convert(amount: number, rate: number): number {
  return amount * rate;
}

/** Round a number to a fixed number of decimal places (default 2), safely. */
export function roundTo(value: number, decimals = 2): number {
  if (!Number.isFinite(value)) return 0;
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/** Format a numeric value as a localized currency string, with a safe fallback. */
export function formatCurrency(
  value: number,
  currency: string,
  locale = "en-US",
): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
    }).format(value);
  } catch {
    // Unknown/invalid ISO code — fall back to a plain rounded value.
    return `${roundTo(value, 2)} ${currency}`;
  }
}

/** True when two currency codes refer to the same currency (case/space-insensitive). */
export function isSameCurrency(from: string, to: string): boolean {
  return from.trim().toUpperCase() === to.trim().toUpperCase();
}

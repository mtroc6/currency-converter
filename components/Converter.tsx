"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getCurrencies,
  getLatestRate,
  type CurrencyMap,
} from "@/lib/frankfurter";
import { convert, isSameCurrency, roundTo } from "@/lib/convert";
import { CurrencySelect } from "@/components/CurrencySelect";
import { AmountInput } from "@/components/AmountInput";
import { ResultCard } from "@/components/ResultCard";

export function Converter() {
  const [currencies, setCurrencies] = useState<CurrencyMap>({});
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState(1);
  const [rate, setRate] = useState<number | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sameCurrency = isSameCurrency(from, to);

  // Load the list of available currencies once, on mount.
  useEffect(() => {
    const controller = new AbortController();
    getCurrencies(controller.signal)
      .then(setCurrencies)
      .catch((e: unknown) => {
        if (e instanceof Error && e.name !== "AbortError") {
          setError("Could not load the currency list.");
        }
      });
    return () => controller.abort();
  }, []);

  // Fetch the rate whenever the (distinct) currency pair changes.
  // The same-currency case needs no network call and is handled by the
  // derived values below.
  useEffect(() => {
    if (sameCurrency) return;

    const controller = new AbortController();

    const loadRate = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLatestRate(from, to, controller.signal);
        setRate(data.rates[to]);
        setDate(data.date);
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== "AbortError") {
          setError("Could not load the exchange rate. Please try again.");
          setRate(null);
        }
      } finally {
        setLoading(false);
      }
    };

    void loadRate();

    return () => controller.abort();
  }, [from, to, sameCurrency]);

  // Derived view state: a currency converted to itself is always 1:1.
  const effectiveRate = sameCurrency ? 1 : rate;
  const effectiveDate = sameCurrency ? null : date;
  const effectiveLoading = sameCurrency ? false : loading;
  const effectiveError = sameCurrency ? null : error;

  const result = useMemo(
    () =>
      effectiveRate === null
        ? null
        : roundTo(convert(amount, effectiveRate), 2),
    [amount, effectiveRate],
  );

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-6 shadow-sm">
      <AmountInput value={amount} onChange={setAmount} />

      <div className="flex items-end gap-3">
        <div className="flex-1">
          <CurrencySelect
            id="from"
            label="From"
            value={from}
            currencies={currencies}
            onChange={setFrom}
          />
        </div>
        <button
          type="button"
          onClick={swap}
          aria-label="Swap currencies"
          className="mb-1 rounded-lg border border-foreground/15 px-3 py-2 text-lg transition hover:bg-foreground/10"
        >
          ⇄
        </button>
        <div className="flex-1">
          <CurrencySelect
            id="to"
            label="To"
            value={to}
            currencies={currencies}
            onChange={setTo}
          />
        </div>
      </div>

      <ResultCard
        amount={Number.isFinite(amount) ? amount : 0}
        from={from}
        to={to}
        rate={effectiveRate}
        result={result}
        date={effectiveDate}
        loading={effectiveLoading}
        error={effectiveError}
      />
    </div>
  );
}

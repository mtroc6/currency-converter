"use client";

import { formatCurrency } from "@/lib/convert";

interface Props {
  amount: number;
  from: string;
  to: string;
  rate: number | null;
  result: number | null;
  date: string | null;
  loading: boolean;
  error: string | null;
}

export function ResultCard({
  amount,
  from,
  to,
  rate,
  result,
  date,
  loading,
  error,
}: Props) {
  if (error) {
    return (
      <div
        role="alert"
        className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400"
      >
        {error}
      </div>
    );
  }

  if (loading || rate === null || result === null) {
    return (
      <div className="animate-pulse rounded-lg bg-foreground/5 px-4 py-6 text-center text-sm text-foreground/50">
        Loading rate…
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-foreground/5 px-4 py-5 text-center">
      <p className="text-3xl font-semibold">{formatCurrency(result, to)}</p>
      <p className="mt-1 text-sm text-foreground/60">
        {formatCurrency(amount, from)} = {formatCurrency(result, to)}
      </p>
      <p className="mt-2 text-xs text-foreground/50">
        1 {from} = {rate} {to}
        {date ? ` · ECB rate of ${date}` : " · same currency"}
      </p>
    </div>
  );
}

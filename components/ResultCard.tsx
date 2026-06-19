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
        className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-center text-sm text-red-300"
      >
        {error}
      </div>
    );
  }

  if (loading || rate === null || result === null) {
    return (
      <div className="rounded-2xl border border-border bg-surface-2/40 px-5 py-8 text-center">
        <div className="mx-auto h-9 w-36 animate-pulse rounded-lg bg-foreground/10" />
        <p className="mt-3 text-xs text-muted">Fetching the latest rate…</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-accent/15 bg-gradient-to-b from-accent/10 to-transparent px-5 py-6 text-center">
      <p className="font-display text-[2.75rem] font-semibold leading-none tracking-tight text-accent">
        {formatCurrency(result, to)}
      </p>
      <p className="mt-3 text-sm text-muted">
        {formatCurrency(amount, from)} = {formatCurrency(result, to)}
      </p>
      <p className="mt-3 font-mono text-[11px] tracking-tight text-muted/70">
        1 {from} = {rate} {to}
        {date ? ` · ECB ${date}` : " · same currency"}
      </p>
    </div>
  );
}

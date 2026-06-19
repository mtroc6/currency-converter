"use client";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export function AmountInput({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="amount"
        className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted"
      >
        Amount
      </label>
      <input
        id="amount"
        type="number"
        min={0}
        step="any"
        inputMode="decimal"
        value={Number.isNaN(value) ? "" : value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full rounded-2xl border border-border bg-surface-2/60 px-4 py-3.5 font-display text-2xl tabular-nums text-foreground outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/15"
      />
    </div>
  );
}

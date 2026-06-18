"use client";

interface Props {
  value: number;
  onChange: (value: number) => void;
}

export function AmountInput({ value, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor="amount" className="text-sm font-medium text-foreground/70">
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
        className="rounded-lg border border-foreground/15 bg-background px-3 py-2 text-lg outline-none focus:border-foreground/40"
      />
    </div>
  );
}

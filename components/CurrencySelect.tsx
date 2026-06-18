"use client";

import type { CurrencyMap } from "@/lib/frankfurter";

interface Props {
  id: string;
  label: string;
  value: string;
  currencies: CurrencyMap;
  onChange: (code: string) => void;
}

export function CurrencySelect({ id, label, value, currencies, onChange }: Props) {
  const entries = Object.entries(currencies).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-foreground/70">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-foreground/15 bg-background px-3 py-2 text-base outline-none focus:border-foreground/40"
      >
        {/* Keep the current value selectable even before the list loads. */}
        {entries.length === 0 && <option value={value}>{value}</option>}
        {entries.map(([code, name]) => (
          <option key={code} value={code}>
            {code} — {name}
          </option>
        ))}
      </select>
    </div>
  );
}

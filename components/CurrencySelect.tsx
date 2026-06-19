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
    <div className="flex w-full flex-col gap-2">
      <label
        htmlFor={id}
        className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none truncate rounded-2xl border border-border bg-surface-2/60 px-4 py-3.5 pr-10 text-base text-foreground outline-none transition focus:border-accent/50 focus:ring-2 focus:ring-accent/15"
        >
          {/* Keep the current value selectable even before the list loads. */}
          {entries.length === 0 && <option value={value}>{value}</option>}
          {entries.map(([code, name]) => (
            <option key={code} value={code}>
              {code} — {name}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted"
        >
          ▾
        </span>
      </div>
    </div>
  );
}

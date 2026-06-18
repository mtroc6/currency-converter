# Vibe Coding — Prompt Log

This document is the log of prompts we used while building the **Currency Converter** with an AI coding assistant (Claude). It is part of our "Vibe Coding e CI/CD" deliverable: instead of hand-writing every line, we described what we wanted in natural language, reviewed the generated code, and iterated. The prompts below are grouped by development area. For each one we note the **Result** — what the AI actually produced — so the link between prompt and output is traceable. Authors: mtroc6 (Mateusz) and Rastji (Hubert Stocki).

---

## 1. Scaffold & Configuration

**Prompt:**
> Set up a new Next.js 16 project using the App Router and TypeScript (strict mode). Add Tailwind CSS, ESLint with the new flat config, and Vitest configured for unit testing pure functions. Show me the folder structure you'd use for a small currency converter and the key config files.

**Result:** Generated `next.config.ts`, `tsconfig.json` (strict), `eslint.config.mjs` (flat config), `vitest.config.ts`, Tailwind setup, and a proposed `app/`, `lib/`, `components/` layout.

**Prompt:**
> Add the npm scripts I'll need: dev, build, start, lint, and test (Vitest in run mode, not watch, so it works in CI).

**Result:** Updated `package.json` scripts: `"test": "vitest"` for local watch, `"test:ci": "vitest run"` for CI, and `"lint": "eslint ."`, plus the standard dev/build/start entries.

---

## 2. Conversion Logic (`lib/convert.ts`)

**Prompt:**
> Write a small pure-function module `lib/convert.ts` for a currency converter. I need: `convert(amount, rate)` that returns `amount * rate`; `roundTo(value, decimals)`; `formatCurrency(value, currencyCode)` using `Intl.NumberFormat`; and `isSameCurrency(a, b)`. No React, no side effects — these have to be easy to unit test. Add JSDoc and TypeScript types.

**Result:** Produced a fully typed, dependency-free `convert.ts` with the four exported functions and JSDoc on each.

**Prompt:**
> `formatCurrency` is showing the currency symbol on the wrong side for some codes. Make it locale-agnostic and default to two decimals, but allow overriding the number of decimals.

**Result:** Refactored `formatCurrency` to accept an optional `decimals` parameter and use a fixed `Intl.NumberFormat` configuration, removing the locale-dependent symbol placement issue.

---

## 3. API Client (`lib/frankfurter.ts`)

**Prompt:**
> Create `lib/frankfurter.ts` that talks to the Frankfurter API at `https://api.frankfurter.dev/v1`. I need two functions: `getCurrencies()` that calls `/v1/currencies` and returns a map of code -> name, and `getLatestRate(from, to)` that calls `/v1/latest?base=FROM&symbols=TO` and returns the numeric rate plus the `date` field. Use the native `fetch`, type the responses, and throw a clear error if the response is not ok.

**Result:** Generated `frankfurter.ts` with a typed `CurrencyMap` and `LatestRates` shape, both functions, and explicit `if (!res.ok) throw new Error(...)` handling.

**Prompt:**
> Inside `getLatestRate`, validate the Frankfurter `latest` payload (the rate lives under `rates[TO]`). Throw a clear error when the requested rate is missing, so the UI can render an error state. Keep the fetch and the validation together in one typed function.

**Result:** Added response validation inside `getLatestRate` that throws when `rates[to]` is absent, while returning the typed `LatestRates` shape.

---

## 4. UI Components

**Prompt:**
> Build the main converter screen as a client component in `app/page.tsx`. It needs: two dropdowns for source and target currency (populated from `getCurrencies()`), an amount input, a result display, a swap button between the two currencies, and a line showing the current rate and the last-update date. Use Tailwind for styling and keep it clean and responsive. Handle loading and error states.

**Result:** Generated a `'use client'` `page.tsx` with `useState`/`useEffect`, two `<select>` dropdowns, amount `<input>`, swap button, rate/date line, and basic loading/error UI styled with Tailwind.

**Prompt:**
> Extract the currency dropdown into a reusable `CurrencySelect` component that takes the currency map, the selected value, and an onChange callback. Keep it controlled.

**Result:** Created `components/CurrencySelect.tsx` as a controlled component and updated `page.tsx` to use it for both source and target.

**Prompt:**
> The result should only recompute when amount, rate, or the currencies change, and show a small spinner while rates are being fetched. Add a disabled state to the swap button while loading.

**Result:** Wired the result through `useMemo`, added a spinner during fetch, and disabled the swap button while `loading` is true.

---

## 5. Unit Tests (Vitest)

**Prompt:**
> Write Vitest unit tests for `lib/convert.ts`. Cover: `convert` with normal values and zero, `roundTo` with 2 decimals and edge rounding (e.g. 1.005), `formatCurrency` output for EUR and USD, and `isSameCurrency` true/false cases. Use `describe`/`it`/`expect`.

**Result:** Generated `__tests__/convert.test.ts` with grouped `describe` blocks and assertions covering the happy paths and rounding edge cases.

**Prompt:**
> Add Vitest tests for the Frankfurter client in `__tests__/frankfurter.test.ts`. Mock the global `fetch` with `vi.spyOn` and assert that `getCurrencies` returns the code→name map, `getLatestRate` returns the right rate and `date`, and that both throw on an HTTP error or a missing rate. No real network calls.

**Result:** Created `__tests__/frankfurter.test.ts` mocking `globalThis.fetch` via `vi.spyOn`, covering the success and error paths with no real network access.

---

## 6. CI/CD — GitHub Actions

**Prompt:**
> Write a GitHub Actions workflow `.github/workflows/ci.yml` that runs on push and on pull requests to main. It should set up Node 24, install dependencies with npm ci, then run lint, the Vitest tests, and a production build, in that order, failing the job if any step fails.

**Result:** Generated `ci.yml` with a single job running `actions/checkout`, `actions/setup-node@v4` (Node 24, npm cache), `npm ci`, `npm run lint`, `npx vitest run`, and `npm run build`.

**Prompt:**
> How do I connect this repo to Vercel so that pushes to main deploy to production automatically and every pull request gets its own preview URL? Explain what's automatic and what I configure once.

**Result:** Explained the Vercel + GitHub integration (import repo once, production on `main`, automatic per-PR preview deployments) and noted that fork PR previews need manual authorization.

---

## 7. Bug Fixes

**Prompt:**
> BUG-01: the converted result is showing too many decimal places (e.g. 12.34567899). It should always display a sensible money value with two decimals. Fix it in the formatting path, not by mutating the raw rate.

**Result:** Routed the displayed value through `roundTo(value, 2)` / `formatCurrency` so the raw rate stays precise while the UI shows two decimals.

**Prompt:**
> BUG-02: when the user picks the same currency on both sides, the app still calls the API and shows a confusing rate. If source and target are equal, skip the request and just show a rate of 1 with the amount unchanged.

**Result:** Added an `isSameCurrency` guard before fetching; when true it short-circuits to a rate of 1 and avoids the network call.

---

## Closing Note — Prompt Engineering

The biggest lesson from this activity is that **specific, constrained prompts produce far better code than vague ones**. Asking for "a currency converter" gave generic, hard-to-test output; asking for "a pure `convert(amount, rate)` function with no React and JSDoc, easy to unit test" gave exactly what we needed and dropped straight into Vitest.

A few patterns that worked well:
- **Naming the exact stack and version** (Next.js 16 App Router, Vitest run mode, Frankfurter `/v1` endpoints) kept the AI from reaching for outdated APIs or the wrong test runner.
- **Separating pure logic from side effects** in the prompt itself (e.g. keeping the pure `convert`/`roundTo` functions apart from the `fetch` layer) made the generated code testable by design.
- **Describing bugs as reproductions** ("shows 12.34567899, should show two decimals") led to targeted fixes instead of rewrites.

What needed refinement: the first UI prompt produced everything in one file with no loading/error handling, so we followed up to extract components and add states. The AI also occasionally suggested locale-dependent formatting that broke on some currency codes, which we had to correct explicitly. Overall this confirmed the course theme: AI is a strong accelerator, but it works best when the developer stays in the loop — reviewing, constraining, and iterating rather than accepting the first output.
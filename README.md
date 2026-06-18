# Currency Converter

> A fast, real-time currency converter built with AI-assisted "vibe coding".

Convert between world currencies using live European Central Bank exchange rates. Pick a source and target currency, enter an amount, and get an instant result with the current rate and the date it was last updated.

**Live app:** _(production URL — added after Vercel deploy)_

This project was built for the IPVC-ESTG course *Engenharia de Software* (2025/26) as a hands-on exercise in AI-assisted development, Agile/Scrum management, and a complete CI/CD pipeline.

## Features

- Pick source and target currencies from the full ECB list
- Enter an amount and see the converted result in real time
- Live exchange rates from the Frankfurter API (European Central Bank data)
- Swap source and target currencies with one click
- Shows the current rate and the date it was last updated
- Clear loading and error states

## Tech Stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Frankfurter API** (`api.frankfurter.dev/v1`) for exchange rates — no API key, CORS open
- **Vitest** for unit testing pure conversion logic
- **ESLint** (flat config) for linting
- **GitHub Actions** for CI (lint + test + build)
- **Vercel** for CD (automatic deploys)

## Getting Started

```bash
npm install      # Install dependencies
npm run dev      # Start the dev server (http://localhost:3000)
npm run lint     # Run ESLint
npx vitest run   # Run unit tests
npm run build    # Production build
```

## Project Structure

```
.
├── app/                # Next.js App Router (pages, layout)
├── components/         # UI components (converter, currency picker)
├── lib/                # Pure logic: convert, roundTo, formatCurrency, API client
├── __tests__/          # Vitest unit tests
├── .github/workflows/  # GitHub Actions CI pipeline
└── docs/               # Project report and documentation
```

## CI/CD

Continuous integration runs on **GitHub Actions**: every push and pull request triggers a workflow that lints, runs the unit tests, and builds the app, so broken code never reaches `main`. Continuous deployment is handled by **Vercel**: merges to `main` deploy automatically to production, and every pull request gets its own preview URL for review before merging.

## Agile

Managed with **GitHub Projects** (Scrum: Product Backlog, Sprint Backlog, issues) — board: https://github.com/mtroc6/currency-converter/projects.

## Authors

- **Mateusz** — [@mtroc6](https://github.com/mtroc6)
- **Hubert Stocki** — [@Rastji](https://github.com/Rastji)

## Documentation

The full project report (theme, architecture, AI prompting, evidence, and critical analysis) is available in [`docs/REPORT.md`](docs/REPORT.md).
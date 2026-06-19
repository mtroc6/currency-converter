import { Converter } from "@/components/Converter";

export default function Home() {
  return (
    <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 py-12">
      <div className="w-full max-w-md">
        <header className="mb-8 text-center">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.28em] text-accent/80">
            Live · ECB rates
          </p>
          <h1 className="font-display text-[2.6rem] font-semibold leading-none tracking-tight">
            Currency Converter
          </h1>
          <p className="mt-3 text-sm text-muted">
            Real-time exchange rates from the European Central Bank
          </p>
        </header>

        <Converter />

        <footer className="mt-10 text-center text-xs text-muted/70">
          Rates by Frankfurter API · Built with Next.js · EDS project
        </footer>
      </div>
    </main>
  );
}

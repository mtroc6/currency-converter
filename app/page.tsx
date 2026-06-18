import { Converter } from "@/components/Converter";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6">
      <div className="w-full max-w-md">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Currency Converter</h1>
          <p className="text-sm text-foreground/60">
            Live exchange rates from the European Central Bank
          </p>
        </header>

        <Converter />

        <footer className="mt-8 text-center text-xs text-foreground/40">
          Rates by Frankfurter API · Built with Next.js · EDS project
        </footer>
      </div>
    </main>
  );
}

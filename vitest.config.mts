import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  // tsconfigPaths() resolves the "@/*" alias in tests; react() parses JSX/.tsx.
  plugins: [tsconfigPaths(), react()],
  test: {
    // "node" is correct and fastest for our pure-logic / API tests (no DOM needed).
    environment: "node",
    globals: true,
    include: ["__tests__/**/*.{test,spec}.{ts,tsx}", "**/*.{test,spec}.{ts,tsx}"],
  },
});

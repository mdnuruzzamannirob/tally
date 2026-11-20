import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    exclude: ["tests/e2e/**", "node_modules/**", ".next/**"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.d.ts", "src/types/**", "src/**/*.types.ts"],
      reporter: ["text", "text-summary", "json-summary", "html"],
      reportsDirectory: "./coverage",
    },
  },
});

import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}", "data/**/*.test.ts"],
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
    coverage: {
      provider: "v8",
      thresholds: {
        lines: 80,
        functions: 75,
        statements: 80,
        branches: 75,
      },
      reporter: ["text", "html", "lcov"],
      exclude: [
        "node_modules/",
        "e2e/",
        "**/*.d.ts",
        "**/*.config.*",
        "**/types/**",
      ],
    },
  },
  resolve: {
    alias: [
      { find: "@/data", replacement: path.resolve(__dirname, "./data") },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
});

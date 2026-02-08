import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}", "data/**/*.test.ts"],
    globals: true,
    setupFiles: ["./src/test-setup.ts"],
  },
  resolve: {
    alias: [
      { find: "@/data", replacement: path.resolve(__dirname, "./data") },
      { find: "@", replacement: path.resolve(__dirname, "./src") },
    ],
  },
});

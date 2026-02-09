/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
export default {
  testRunner: "vitest",
  checkers: ["typescript"],
  reporters: ["html", "clear-text", "progress"],
  mutate: [
    "src/features/cart/**/*.ts",
    "src/features/checkout/**/*.ts",
    "src/features/fulfillment/**/*.ts",
    "!src/**/*.test.ts",
    "!src/**/*.d.ts",
    "!src/**/types.ts",
  ],
  thresholds: {
    high: 80,
    low: 60,
    break: 50,
  },
  vitest: {
    configFile: "vitest.config.ts",
  },
  concurrency: 4,
  timeoutMS: 30000,
  tempDirName: ".stryker-tmp",
};

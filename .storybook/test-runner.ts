import type { TestRunnerConfig } from "@storybook/test-runner";
import { toMatchImageSnapshot } from "jest-image-snapshot";

expect.extend({ toMatchImageSnapshot });

const config: TestRunnerConfig = {
  async postVisit(page, context) {
    // Wait for animations/transitions to settle
    await page.waitForTimeout(300);

    const image = await page.screenshot({ fullPage: true });
    expect(image).toMatchImageSnapshot({
      customSnapshotsDir: `${process.cwd()}/.storybook/__snapshots__`,
      customSnapshotIdentifier: context.id,
      failureThreshold: 0.01,
      failureThresholdType: "percent",
    });
  },
};

export default config;

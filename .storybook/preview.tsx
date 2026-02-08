import type { Preview } from "@storybook/react";
import "../src/app/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "offwhite",
      values: [
        { name: "offwhite", value: "#fafaf5" },
        { name: "ink", value: "#000000" },
        { name: "champagne", value: "#f7e6ca" },
        { name: "wine", value: "#722f37" },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      const isDark = context.globals.theme === "dark";
      return (
        <div className={isDark ? "dark" : ""}>
          <div
            style={{
              padding: "2rem",
              backgroundColor: isDark ? "#111111" : "#fafaf5",
              minHeight: "100vh",
            }}
          >
            <Story />
          </div>
        </div>
      );
    },
  ],
  globalTypes: {
    theme: {
      description: "Theme mode",
      toolbar: {
        title: "Theme",
        icon: "contrast",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "light",
  },
};

export default preview;

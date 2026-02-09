import type { Meta, StoryObj } from "@storybook/react";
import { SectionLabel } from "./SectionLabel";

const meta = {
  title: "UI/SectionLabel",
  component: SectionLabel,
  tags: ["autodocs"],
} satisfies Meta<typeof SectionLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Onze selectie",
  },
};

export const WithContent: Story = {
  args: { children: "Label" },
  render: () => (
    <div>
      <SectionLabel>Featured wines</SectionLabel>
      <h2 className="font-display text-3xl mb-4">
        12 Gecureerde Italiaanse Wijnen
      </h2>
      <p className="font-body text-lg text-muted-foreground">
        Handgeselecteerd door onze sommeliers
      </p>
    </div>
  ),
};

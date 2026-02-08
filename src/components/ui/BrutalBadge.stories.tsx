import type { Meta, StoryObj } from "@storybook/react";
import { BrutalBadge } from "./BrutalBadge";

const meta = {
  title: "UI/BrutalBadge",
  component: BrutalBadge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["wine", "emerald", "ink", "champagne"],
    },
  },
} satisfies Meta<typeof BrutalBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Wine: Story = {
  args: {
    children: "Piemonte",
    variant: "wine",
  },
};

export const Emerald: Story = {
  args: {
    children: "Biologisch",
    variant: "emerald",
  },
};

export const Ink: Story = {
  args: {
    children: "Uitverkocht",
    variant: "ink",
  },
};

export const Champagne: Story = {
  args: {
    children: "Nieuw",
    variant: "champagne",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <BrutalBadge variant="wine">Piemonte</BrutalBadge>
      <BrutalBadge variant="emerald">Biologisch</BrutalBadge>
      <BrutalBadge variant="ink">Uitverkocht</BrutalBadge>
      <BrutalBadge variant="champagne">Nieuw</BrutalBadge>
    </div>
  ),
};

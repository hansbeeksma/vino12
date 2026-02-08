import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./ProgressBar";

const meta = {
  title: "UI/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 5, step: 0.5 } },
    max: { control: { type: "number", min: 1, max: 10 } },
    color: {
      control: "select",
      options: ["bg-wine", "bg-emerald", "bg-gold", "bg-ink"],
    },
    height: {
      control: "select",
      options: ["h-2", "h-3", "h-4", "h-6"],
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 3.5,
    max: 5,
  },
};

export const Full: Story = {
  args: {
    value: 5,
    max: 5,
    color: "bg-emerald",
  },
};

export const Low: Story = {
  args: {
    value: 1,
    max: 5,
    color: "bg-wine",
  },
};

export const GoldBar: Story = {
  args: {
    value: 4,
    max: 5,
    color: "bg-gold",
    height: "h-4",
  },
};

export const TastingProfile: Story = {
  render: () => (
    <div className="space-y-3 max-w-md">
      <div>
        <span className="font-accent text-xs uppercase tracking-wider mb-1 block">
          Body
        </span>
        <ProgressBar value={4} max={5} color="bg-wine" />
      </div>
      <div>
        <span className="font-accent text-xs uppercase tracking-wider mb-1 block">
          Tannine
        </span>
        <ProgressBar value={3.5} max={5} color="bg-wine" />
      </div>
      <div>
        <span className="font-accent text-xs uppercase tracking-wider mb-1 block">
          Zuurgraad
        </span>
        <ProgressBar value={2.5} max={5} color="bg-emerald" />
      </div>
      <div>
        <span className="font-accent text-xs uppercase tracking-wider mb-1 block">
          Fruitigheid
        </span>
        <ProgressBar value={3} max={5} color="bg-gold" />
      </div>
    </div>
  ),
};

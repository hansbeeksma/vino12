import type { Meta, StoryObj } from "@storybook/react";
import { BrutalCard } from "./BrutalCard";
import { BrutalBadge } from "./BrutalBadge";
import { BrutalButton } from "./BrutalButton";

const meta = {
  title: "UI/BrutalCard",
  component: BrutalCard,
  tags: ["autodocs"],
  argTypes: {
    hover: { control: "boolean" },
    glow: { control: "boolean" },
    borderColor: {
      control: "select",
      options: ["border-ink", "border-wine", "border-gold"],
    },
  },
} satisfies Meta<typeof BrutalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="font-display text-xl mb-2">Barolo Riserva 2019</h3>
        <p className="font-body text-sm text-muted-foreground">
          Piemonte, Italië
        </p>
      </div>
    ),
  },
};

export const WithGlow: Story = {
  args: {
    glow: true,
    children: (
      <div className="p-6">
        <h3 className="font-display text-xl mb-2">Premium Selectie</h3>
        <p className="font-body text-sm text-muted-foreground">
          Gold glow effect bij hover
        </p>
      </div>
    ),
  },
};

export const NoHover: Story = {
  args: {
    hover: false,
    children: (
      <div className="p-6">
        <h3 className="font-display text-xl mb-2">Statische kaart</h3>
        <p className="font-body text-sm">Zonder hover effect</p>
      </div>
    ),
  },
};

export const WineProductCard: Story = {
  render: () => (
    <BrutalCard className="max-w-sm">
      <div className="aspect-[3/4] bg-champagne flex items-center justify-center">
        <span className="font-display text-4xl text-wine">🍷</span>
      </div>
      <div className="p-4">
        <BrutalBadge variant="wine" className="mb-2">
          Piemonte
        </BrutalBadge>
        <h3 className="font-display text-lg mb-1">Barolo DOCG 2019</h3>
        <p className="font-body text-sm text-muted-foreground mb-3">
          Nebbiolo — vol, krachtig, elegant
        </p>
        <div className="flex justify-between items-center">
          <span className="font-accent font-bold text-lg">€24,95</span>
          <BrutalButton size="sm" variant="primary">
            In wagen
          </BrutalButton>
        </div>
      </div>
    </BrutalCard>
  ),
};

export const WineBorder: Story = {
  args: {
    borderColor: "border-wine",
    children: (
      <div className="p-6">
        <h3 className="font-display text-xl mb-2">Wine Border</h3>
        <p className="font-body text-sm">Met wijn-gekleurde rand</p>
      </div>
    ),
  },
};

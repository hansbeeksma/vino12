import type { Meta, StoryObj } from "@storybook/react";
import { BrutalButton } from "./BrutalButton";

const meta = {
  title: "UI/BrutalButton",
  component: BrutalButton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "outline-solid", "gold"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof BrutalButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: "Bestel nu",
    variant: "primary",
    size: "md",
  },
};

export const Secondary: Story = {
  args: {
    children: "Meer info",
    variant: "secondary",
    size: "md",
  },
};

export const OutlineSolid: Story = {
  args: {
    children: "Bekijk wijnen",
    variant: "outline-solid",
    size: "md",
  },
};

export const Gold: Story = {
  args: {
    children: "Word lid",
    variant: "gold",
    size: "md",
  },
};

export const Small: Story = {
  args: {
    children: "Klein",
    variant: "primary",
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    children: "Groot",
    variant: "primary",
    size: "lg",
  },
};

export const AsLink: Story = {
  args: {
    children: "Ga naar winkel",
    variant: "primary",
    href: "/wijnen",
  },
};

export const AllVariants: Story = {
  args: { children: "Button" },
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <BrutalButton variant="primary">Primary</BrutalButton>
      <BrutalButton variant="secondary">Secondary</BrutalButton>
      <BrutalButton variant="outline-solid">Outline</BrutalButton>
      <BrutalButton variant="gold">Gold</BrutalButton>
    </div>
  ),
};

export const AllSizes: Story = {
  args: { children: "Button" },
  render: () => (
    <div className="flex flex-wrap gap-4 items-center">
      <BrutalButton size="sm">Small</BrutalButton>
      <BrutalButton size="md">Medium</BrutalButton>
      <BrutalButton size="lg">Large</BrutalButton>
    </div>
  ),
};

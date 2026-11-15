import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@repo/ui/button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "outline",
        "ghost",
        "destructive",
        "link",
      ],
    },
    size: { control: "select", options: ["sm", "md", "lg", "icon"] },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  args: {
    children: "Button",
    variant: "primary",
    size: "md",
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button aria-label="Add" size="icon">
        +
      </Button>
    </div>
  ),
};

export const Loading: Story = {
  args: {
    children: "Saving",
    isLoading: true,
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};

export const AsLink: Story = {
  render: () => (
    <Button asChild>
      <a href="#example">Open link</a>
    </Button>
  ),
};

export const RTL: Story = {
  render: () => (
    <div className="flex items-center gap-3" dir="rtl">
      <Button>إرسال</Button>
      <Button variant="secondary">إلغاء</Button>
      <Button variant="destructive">حذف</Button>
    </div>
  ),
};

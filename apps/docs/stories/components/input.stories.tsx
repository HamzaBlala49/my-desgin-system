import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

const meta = {
  title: "Components/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    invalid: { control: "boolean" },
    placeholder: { control: "text" },
  },
  args: {
    placeholder: "you@example.com",
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" {...args} />
    </div>
  ),
};

export const Invalid: Story = {
  args: {
    defaultValue: "not-an-email",
    invalid: true,
  },
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="email-invalid">Email</Label>
      <Input id="email-invalid" {...args} />
      <p className="text-xs text-danger-text">Enter a valid email address.</p>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    defaultValue: "you@example.com",
    disabled: true,
  },
};

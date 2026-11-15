import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@repo/ui/label";
import { Input } from "@repo/ui/input";

const meta = {
  title: "Components/Label",
  component: Label,
  tags: ["autodocs"],
  args: {
    children: "Email",
  },
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const WithControl: Story = {
  render: (args) => (
    <div className="flex w-72 flex-col gap-2">
      <Label htmlFor="label-control" {...args} />
      <Input id="label-control" placeholder="you@example.com" />
    </div>
  ),
};

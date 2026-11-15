import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { Button } from "@repo/ui/button";

const meta = {
  title: "Components/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Design tokens</CardTitle>
        <CardDescription>
          Tokens are generated from Figma and Style Dictionary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-normal text-content-secondary">
          Primitives come from the Figma token export, while semantic tokens map
          them to product decisions.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">View tokens</Button>
        <Button size="sm" variant="ghost">
          Dismiss
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const RTL: Story = {
  render: () => (
    <Card className="w-80" dir="rtl">
      <CardHeader>
        <CardTitle>توكينز التصميم</CardTitle>
        <CardDescription>
          تُولَّد التوكينز من فيقما عبر Style Dictionary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-normal text-content-secondary">
          الطبقة الدلالية هي الوحيدة المستخدمة داخل المكونات.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">عرض التوكينز</Button>
      </CardFooter>
    </Card>
  ),
};

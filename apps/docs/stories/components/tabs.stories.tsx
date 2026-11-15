import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs className="w-96" defaultValue="account">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <p className="text-sm leading-normal text-content-secondary">
          Make changes to your account here.
        </p>
      </TabsContent>
      <TabsContent value="password">
        <p className="text-sm leading-normal text-content-secondary">
          Change your password here.
        </p>
      </TabsContent>
      <TabsContent value="settings">
        <p className="text-sm leading-normal text-content-secondary">
          Manage your notification settings here.
        </p>
      </TabsContent>
    </Tabs>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Tabs className="w-96" defaultValue="one">
      <TabsList>
        <TabsTrigger value="one">One</TabsTrigger>
        <TabsTrigger disabled value="two">
          Two
        </TabsTrigger>
        <TabsTrigger value="three">Three</TabsTrigger>
      </TabsList>
      <TabsContent value="one">
        <p className="text-sm text-content-secondary">First tab content.</p>
      </TabsContent>
      <TabsContent value="three">
        <p className="text-sm text-content-secondary">Third tab content.</p>
      </TabsContent>
    </Tabs>
  ),
};

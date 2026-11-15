import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

function Example(): React.JSX.Element {
  return (
    <Tabs defaultValue="account">
      <TabsList aria-label="Settings">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">Account content</TabsContent>
      <TabsContent value="password">Password content</TabsContent>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("switches tabs when clicked", async () => {
    render(<Example />);

    expect(screen.getByText("Account content")).toBeInTheDocument();
    expect(screen.queryByText("Password content")).not.toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "Password" }));

    expect(screen.getByText("Password content")).toBeInTheDocument();
  });

  it("supports keyboard navigation", async () => {
    render(<Example />);

    screen.getByRole("tab", { name: "Account" }).focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Password" })).toHaveFocus();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Example />);
    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});

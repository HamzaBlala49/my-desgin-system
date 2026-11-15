import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

describe("Card", () => {
  it("renders its composition", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Design tokens</CardTitle>
          <CardDescription>Generated from Figma.</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );

    expect(
      screen.getByRole("heading", { name: "Design tokens" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Generated from Figma.")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent>Body</CardContent>
      </Card>,
    );
    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});

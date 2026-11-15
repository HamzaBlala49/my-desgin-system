import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Input } from "../input";
import { Label } from "./label";

describe("Label", () => {
  it("associates with a control through htmlFor", () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <Input id="email" />
      </>,
    );

    expect(screen.getByLabelText("Email")).toBe(screen.getByRole("textbox"));
  });

  it("renders a required indicator that is hidden from assistive technology", () => {
    render(<Label required>Email</Label>);

    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <>
        <Label htmlFor="email-a11y">Email</Label>
        <Input id="email-a11y" />
      </>,
    );
    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});

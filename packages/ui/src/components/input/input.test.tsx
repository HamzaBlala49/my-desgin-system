import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Input } from "./input";

describe("Input", () => {
  it("renders a text input with a placeholder", () => {
    render(<Input placeholder="you@example.com" />);

    expect(screen.getByPlaceholderText("you@example.com")).toBeInTheDocument();
  });

  it("exposes the invalid state to assistive technology", () => {
    render(<Input invalid />);

    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("supports the disabled state", () => {
    render(<Input disabled />);

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Input aria-label="Email" placeholder="you@example.com" />,
    );
    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});

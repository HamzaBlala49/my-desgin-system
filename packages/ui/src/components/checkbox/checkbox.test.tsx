import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("toggles when clicked", async () => {
    render(<Checkbox aria-label="Accept terms" />);

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });

  it("supports the indeterminate state", () => {
    render(<Checkbox aria-label="Partial" checked="indeterminate" />);

    expect(screen.getByRole("checkbox", { name: "Partial" })).toHaveAttribute(
      "aria-checked",
      "mixed",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(
      <Checkbox aria-label="Accept terms" defaultChecked />,
    );
    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});

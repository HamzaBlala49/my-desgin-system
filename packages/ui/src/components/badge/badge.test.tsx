import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders its content", () => {
    render(<Badge>New</Badge>);

    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Badge variant="success">Active</Badge>);

    expect(screen.getByText("Active")).toHaveClass(
      "bg-badge-success-background",
    );
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Badge>New</Badge>);
    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});

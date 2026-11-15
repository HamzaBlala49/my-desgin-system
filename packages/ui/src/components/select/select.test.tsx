import { render, screen } from "@testing-library/react";
import user from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

function Example(): React.JSX.Element {
  return (
    <Select defaultValue="apple">
      <SelectTrigger aria-label="Fruit">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe("Select", () => {
  it("opens and selects an option", async () => {
    render(<Example />);

    const trigger = screen.getByRole("combobox", { name: "Fruit" });

    await user.click(trigger);

    const option = await screen.findByRole("option", { name: "Banana" });

    await user.click(option);

    expect(trigger).toHaveTextContent("Banana");
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Example />);
    const results = await axe(container);

    expect(results.violations).toHaveLength(0);
  });
});

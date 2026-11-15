import { render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Button } from "../button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

function Example(): React.JSX.Element {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Delete project</DialogTitle>
        <DialogDescription>This action cannot be undone.</DialogDescription>
      </DialogContent>
    </Dialog>
  );
}

describe("Dialog", () => {
  it("opens and closes with the keyboard", async () => {
    render(<Example />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Open" }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Delete project")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("has no accessibility violations when open", async () => {
    render(<Example />);

    await user.click(screen.getByRole("button", { name: "Open" }));

    const dialog = await screen.findByRole("dialog");
    const results = await axe(dialog);

    expect(results.violations).toHaveLength(0);
  });
});

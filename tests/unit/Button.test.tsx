import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppButton } from "@/components/app-ui";

describe("app-ui AppButton", () => {
  it("renders an accessible project-owned button primitive", () => {
    render(<AppButton>Save application</AppButton>);
    expect(screen.getByRole("button", { name: "Save application" })).toBeEnabled();
  });

  it("maps semantic tones and sizes to the shared button primitive", () => {
    render(
      <>
        <AppButton size="xs" tone="danger">Delete</AppButton>
        <AppButton size="lg" tone="success">Saved</AppButton>
        <AppButton size="icon" tone="outline" aria-label="More actions">⋯</AppButton>
      </>,
    );

    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass("!h-7", "bg-danger!");
    expect(screen.getByRole("button", { name: "Saved" })).toHaveClass("!h-10", "bg-success!");
    expect(screen.getByRole("button", { name: "More actions" })).toHaveClass("!size-9");
  });

  it("disables the button while loading and shows a progress indicator", () => {
    render(<AppButton loading>Saving</AppButton>);
    const button = screen.getByRole("button", { name: "Saving" });
    expect(button).toBeDisabled();
    expect(button.querySelector("svg")).not.toBeNull();
  });
});

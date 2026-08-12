import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppButton } from "@/components/app-ui";

describe("app-ui AppButton", () => {
  it("renders an accessible project-owned button primitive", () => {
    render(<AppButton>Save application</AppButton>);
    expect(screen.getByRole("button", { name: "Save application" })).toBeEnabled();
  });
});

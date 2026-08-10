import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "@/components/app-ui";

describe("app-ui Button", () => {
  it("renders an accessible project-owned button primitive", () => {
    render(<Button>Save application</Button>);
    expect(screen.getByRole("button", { name: "Save application" })).toHaveClass(
      "app-button--primary",
    );
  });
});

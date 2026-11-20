import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ApplicationStatusBadge } from "@/features/applications/components/ApplicationStatusBadge";

describe("application status badge", () => {
  it("displays the configured user-facing label", () => {
    render(<ApplicationStatusBadge status="SCREENING" />);
    expect(screen.getByText("Screening")).toBeVisible();
  });
});

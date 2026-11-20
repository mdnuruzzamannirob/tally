import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  AppAlert,
  AppBadge,
  AppEmptyState,
  AppInterviewStatusBadge,
  AppPageHeader,
  AppPagination,
  AppStatusBadge,
} from "@/components/app-ui";

describe("shared app components", () => {
  it("renders alert title, content, tone, and size", () => {
    render(
      <AppAlert size="lg" title="Saved" tone="success">
        Your changes are ready.
      </AppAlert>,
    );

    expect(screen.getByText("Saved").closest("div.flex")).toHaveClass(
      "border-success-border",
      "p-5",
    );
    expect(screen.getByText("Your changes are ready.")).toBeInTheDocument();
  });

  it("renders empty-state optional icon, description, and action", () => {
    render(
      <AppEmptyState
        action={<button type="button">Add application</button>}
        description="There are no saved jobs yet."
        icon={<span aria-hidden="true">+</span>}
        title="No applications"
      />,
    );

    expect(screen.getByRole("heading", { name: "No applications" })).toBeInTheDocument();
    expect(screen.getByText("There are no saved jobs yet.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add application" })).toBeInTheDocument();
  });

  it("renders page header breadcrumb, description, and actions", () => {
    render(
      <AppPageHeader
        actions={<button type="button">Create</button>}
        breadcrumb={<nav aria-label="Breadcrumb">Home / Jobs</nav>}
        description="Keep track of your applications."
        title="Applications"
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "Applications" })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByText("Keep track of your applications.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create" })).toBeInTheDocument();
  });

  it("exposes current pagination and emits page changes", () => {
    const onPageChange = vi.fn();
    render(<AppPagination onPageChange={onPageChange} page={3} totalPages={8} />);

    expect(screen.getByRole("navigation", { name: "Pagination" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toHaveAttribute("aria-current", "page");
    expect(screen.getAllByRole("button", { name: /^[1-5]$/ })).toHaveLength(5);

    fireEvent.click(screen.getByRole("button", { name: "Previous page" }));
    fireEvent.click(screen.getByRole("button", { name: "Next page" }));
    fireEvent.click(screen.getByRole("button", { name: "5" }));

    expect(onPageChange.mock.calls).toEqual([[2], [4], [5]]);
  });

  it("disables pagination controls at the first and last page", () => {
    const { rerender } = render(<AppPagination page={1} totalPages={3} />);
    expect(screen.getByRole("button", { name: "Previous page" })).toBeDisabled();

    rerender(<AppPagination page={3} totalPages={3} />);
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("renders shared badges and status color tokens", () => {
    render(
      <>
        <AppBadge status="warning">Due soon</AppBadge>
        <AppStatusBadge status="offer">Offer</AppStatusBadge>
        <AppInterviewStatusBadge status="scheduled">Scheduled</AppInterviewStatusBadge>
      </>,
    );

    expect(screen.getByText("Due soon")).toHaveClass("border-warning-border");
    expect(screen.getByText("Offer")).toHaveStyle({ backgroundColor: "var(--st-offer-bg)" });
    expect(screen.getByText("Scheduled")).toHaveStyle({
      backgroundColor: "var(--iv-scheduled-bg)",
    });
  });
});

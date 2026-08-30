"use client";

import { useState } from "react";
import { AppBreadcrumb, AppPageHeader } from "@/components/app-ui";
import {
  ComponentExamples,
  componentPreviewItems,
  type ComponentPreviewId,
} from "./_components/component-examples";

const navigationTabClass =
  "shrink-0 rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-selected:bg-primary-subtle aria-selected:text-primary";

export default function UICatalogPage() {
  const [activeComponent, setActiveComponent] = useState<ComponentPreviewId>("button");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AppBreadcrumb
        items={[{ label: "Public Application", href: "/" }, { label: "UI Catalog" }]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-12">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <nav
            aria-label="Component navigation"
            className="max-h-[calc(100dvh-3rem)] overflow-y-auto rounded-lg border border-border bg-card p-3"
          >
            <p className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Components
            </p>
            <div
              aria-orientation="vertical"
              className="flex gap-1 overflow-x-auto lg:flex-col"
              role="tablist"
            >
              {componentPreviewItems.map((item) => (
                <button
                  aria-controls={`preview-${item.id}`}
                  aria-selected={activeComponent === item.id}
                  className={navigationTabClass}
                  id={`tab-${item.id}`}
                  key={item.id}
                  onClick={() => setActiveComponent(item.id)}
                  role="tab"
                  type="button"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        <main className="min-w-0 pb-12">
          <AppPageHeader
            description="Select a component to review its variants, states, and interaction examples."
            title="UI Component Catalog"
          />
          <section
            aria-labelledby={`tab-${activeComponent}`}
            className="mt-8"
            id={`preview-${activeComponent}`}
            role="tabpanel"
          >
            <ComponentExamples component={activeComponent} />
          </section>
        </main>
      </div>
    </div>
  );
}

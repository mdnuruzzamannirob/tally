import { describe, expect, it } from "vitest";

import {
  applicationLabels,
  applicationStatuses,
  applicationTones,
  boardAccents,
  employmentTypes,
  humanizeApplicationValue,
  remoteTypes,
} from "@/features/applications/application-config";

describe("application configuration", () => {
  it("defines a label, tone, and board accent for every status", () => {
    expect(applicationStatuses).toHaveLength(7);
    for (const status of applicationStatuses) {
      expect(applicationLabels[status]).toBeTruthy();
      expect(applicationTones[status]).toBeTruthy();
      expect(boardAccents[status]).toMatch(/^bg-/);
    }
  });

  it("exports supported workplace and employment values", () => {
    expect(remoteTypes).toEqual(["ONSITE", "REMOTE", "HYBRID"]);
    expect(employmentTypes).toEqual(["FULL_TIME", "CONTRACT", "INTERNSHIP"]);
  });

  it("humanizes underscore-separated values", () => {
    expect(humanizeApplicationValue("FULL_TIME_ENGINEER")).toBe("Full Time Engineer");
    expect(humanizeApplicationValue("")).toBe("");
  });
});

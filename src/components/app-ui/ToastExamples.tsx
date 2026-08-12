"use client";

import { toast } from "./Toast";
import { Button } from "./Button";

export function ToastExamples() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" onClick={() => toast.success("Application saved")}>
        Success toast
      </Button>
      <Button size="sm" variant="secondary" onClick={() => toast.info("Follow-up is due tomorrow")}>
        Info toast
      </Button>
      <Button
        size="sm"
        variant="danger"
        onClick={() => toast.error("Could not delete application")}
      >
        Error toast
      </Button>
    </div>
  );
}

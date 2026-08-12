"use client";
import { Paperclip, UploadCloud, X } from "lucide-react";
export function AppFileUpload({
  accept,
  description = "Drag and drop or click to browse",
  files = [],
  label = "Upload a file",
  multiple = false,
  onFiles,
  onRemove,
}: {
  accept?: string;
  description?: string;
  files?: readonly string[];
  label?: string;
  multiple?: boolean;
  onFiles?: (files: FileList | null) => void;
  onRemove?: (file: string) => void;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-background px-4 py-6 transition-colors duration-100 hover:bg-muted/40 sm:px-6 sm:py-8">
      <label className="flex cursor-pointer flex-col items-center text-center">
        <span className="ui-gradient-primary grid size-10 place-items-center rounded-md">
          <UploadCloud className="size-5" />
        </span>
        <span className="mt-3 text-sm font-medium">{label}</span>
        <span className="mt-1 text-xs leading-5 text-muted-foreground">{description}</span>
        <input
          accept={accept}
          className="sr-only"
          multiple={multiple}
          onChange={(event) => {
            onFiles?.(event.target.files);
            event.currentTarget.value = "";
          }}
          type="file"
        />
      </label>
      {files.length ? (
        <div className="mt-5 space-y-2 border-t border-border pt-4">
          {files.map((file) => (
            <div
              className="flex min-w-0 items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs shadow-none"
              key={file}
            >
              <Paperclip className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="min-w-0 flex-1 truncate">{file}</span>
              {onRemove ? (
                <button
                  aria-label={`Remove ${file}`}
                  className="grid size-6 shrink-0 place-items-center rounded-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                  onClick={() => onRemove(file)}
                  type="button"
                >
                  <X className="size-3.5" />
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

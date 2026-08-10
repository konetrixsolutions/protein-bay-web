import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
        "focus:border-primary focus:ring-0 focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };

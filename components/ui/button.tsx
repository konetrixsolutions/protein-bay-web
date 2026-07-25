import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-lg border text-sm font-medium transition-all duration-200 outline-none disabled:pointer-events-none disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 active:scale-[0.98] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "border-primary bg-primary text-primary-foreground hover:bg-[var(--primary-hover)] hover:border-[var(--primary-hover)]",

        outline:
          "border-primary bg-background text-primary hover:bg-accent hover:text-primary",

        secondary:
          "border-secondary bg-secondary text-secondary-foreground hover:bg-[var(--secondary-hover)] hover:border-[var(--secondary-hover)]",

        ghost:
          "border-transparent bg-transparent text-foreground hover:bg-accent hover:text-primary",

        destructive:
          "border-destructive bg-destructive text-white hover:opacity-90",

        link: "border-transparent bg-transparent p-0 text-primary underline-offset-4 hover:underline",
      },

      size: {
        default: "h-10 px-4 gap-2",
        sm: "h-9 px-3 gap-1.5 text-sm",
        lg: "h-11 px-6 gap-2.5 text-base",

        icon: "size-10",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };

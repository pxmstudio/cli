import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded border px-1 py-0.5 text-xs w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:outline-offset-2 focus-visible:outline-1 focus-visible:outline-actionPrimaryBackground focus-visible:ring-0 transition-[color,box-shadow] overflow-hidden text-text1 [a&]:hover:opacity-90",
  {
    variants: {
      variant: {
        default: "border-transparent bg-actionSecondaryBackground",
        primary:
          "bg-actionPrimaryBackground shadow-action-colored border-transparent",
        destructive:
          "bg-redBackground shadow-action-colored border-transparent",
        outline:
          "border-actionSecondaryBorder focus-visible:border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

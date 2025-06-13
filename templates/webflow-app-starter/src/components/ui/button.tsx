import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded text-xs transition-all disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3 shrink-0 [&_svg]:shrink-0 focus-visible:outline-offset-2 focus-visible:outline-1 focus-visible:outline-actionPrimaryBackground focus-visible:ring-0 text-text1 border",
  {
    variants: {
      variant: {
        default:
          "bg-actionSecondaryBackground shadow-action-secondary hover:bg-actionSecondaryBackgroundHover border-transparent",
        primary: "bg-actionPrimaryBackground shadow-action-colored hover:bg-actionPrimaryBackgroundHover border-transparent",
        destructive:
          "bg-redBackground shadow-action-colored hover:bg-redBackgroundHover border-transparent",
        outline:
          "border-actionSecondaryBorder hover:bg-background3 focus-visible:border-transparent",
        ghost:
          "hover:bg-background2 border-transparent",
      },
      size: {
        default: "h-6 p-1",
        icon: "size-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
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
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

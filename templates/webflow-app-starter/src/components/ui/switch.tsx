import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer data-[state=checked]:bg-actionPrimaryBackground data-[state=unchecked]:bg-background3 focus-visible:border-border3 inline-flex h-[1.25rem] w-8 shrink-0 items-center rounded-full border border-border3 transition-all focus-visible:ring-0 focus-visible:outline-offset-2 focus-visible:outline-1 focus-visible:outline-actionPrimaryBackground disabled:cursor-not-allowed disabled:opacity-50 hover:bg-actionSecondaryBackgroundHover",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "bg-actionPrimaryText dark:data-[state=unchecked]:bg-actionPrimaryText pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-3px)] data-[state=unchecked]:translate-x-[1.5px]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }

import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-text3 selection:bg-primary selection:text-primary-foreground border-border2 flex h-6 w-full min-w-0 rounded border bg-backgroundInput p-1 text-xs inset-shadow-input-inner transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 md:text-sm text-text1",
        "focus-visible:border-blueBorder focus-visible:ring-0",
        "aria-invalid:border-redBorder",
        className
      )}
      {...props}
    />
  )
}

export { Input }

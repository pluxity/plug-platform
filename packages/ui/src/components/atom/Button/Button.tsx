import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../../utils/utils";

const buttonVariants = cva(
  `inline-flex items-center justify-center gap-2
  whitespace-nowrap transition-all disabled:text-gray2 disabled:cursor-not-allowed 
  [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive px-2.5 rounded-xs`,
  {
    variants: {
      variant: {
        default:
          "bg-point-blue text-primary-foreground hover:bg-point-blue-dark disabled:bg-point-blue-disable",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 disabled:bg-gray2 disabled:text-white",
        outline:
          "border bg-white border border-gray text-gray hover:border-black hover:text-black disabled:border-gray2 disabled:text-gray2",
        secondary:
          "bg-muted-light-blue1 border border-point-blue text-point-blue hover:bg-muted-light-blue2 disabled:border-gray2 disabled:bg-point-blue-disable",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:text-point-blue underline active:text-black disabled:text-gray2",
      },
      size: {
        default: "h-9 min-w-25 has-[>svg]:px-3 text-[14px]",
        sm: "h-6 min-w-12 has-[>svg]:px-2 text-[12px]",
        lg: "h-12 min-w-38 has-[>svg]:px-4 text-[20px]",
        icon: "w-[var(--cell-size)] h-[var(--cell-size)] p-0",
      },
      onBackground: {
        true: "text-gray2 hover:text-muted-light-blue1 active:text-gray2 disabled:text-light-gray",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      onBackground: false,
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  onBackground,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, onBackground, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

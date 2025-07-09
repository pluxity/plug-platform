import * as SeparatorPrimitive from "@radix-ui/react-separator"

export interface SeparatorProps extends React.ComponentProps<typeof SeparatorPrimitive.Root> {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  className?: string;
}
